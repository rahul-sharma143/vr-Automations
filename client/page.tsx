"use client";

import { useState, useEffect } from "react";
import {
  Search,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Clock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCoins, saveSnapshot } from "@/lib/api";

interface CryptoCurrency {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
  last_updated: string;
  image: string;
  market_cap_rank: number;
}

export default function CryptoDashboard() {
  const [cryptos, setCryptos] = useState<CryptoCurrency[]>([]);
  const [filteredCryptos, setFilteredCryptos] = useState<CryptoCurrency[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("market_cap_rank");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCryptoData = async () => {
    try {
      setRefreshing(true);
      const data = await getCoins();
      setCryptos(data);
      setFilteredCryptos(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching crypto data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCryptoData();

    // Auto refresh every 30 minutes
    const interval = setInterval(fetchCryptoData, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const filtered = cryptos.filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof CryptoCurrency];
      let bValue = b[sortBy as keyof CryptoCurrency];

      if (typeof aValue === "string") aValue = aValue.toLowerCase();
      if (typeof bValue === "string") bValue = bValue.toLowerCase();

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredCryptos(filtered);
  }, [cryptos, searchTerm, sortBy, sortOrder]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(price);
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    }
    return `$${marketCap.toLocaleString()}`;
  };

  const formatPercentage = (percentage: number) => {
    const isPositive = percentage >= 0;
    return (
      <div
        className={`flex items-center gap-1 ${
          isPositive ? "text-green-600" : "text-red-600"
        }`}
      >
        {isPositive ? (
          <TrendingUp className="w-4 h-4" />
        ) : (
          <TrendingDown className="w-4 h-4" />
        )}
        {Math.abs(percentage).toFixed(2)}%
      </div>
    );
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-lg">Loading cryptocurrency data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-900">VR Automations</h1>
          <p className="text-xl text-slate-600">Cryptocurrency Tracker</p>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <Clock className="w-4 h-4" />
            {lastUpdated && `Last updated: ${lastUpdated.toLocaleTimeString()}`}
            {refreshing && (
              <div className="flex items-center gap-1 text-blue-600">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Refreshing...
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Market Overview</CardTitle>
            <CardDescription className="flex justify-between">
              Top 10 cryptocurrencies by market cap
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  const result = await saveSnapshot();
                  alert("📸 Snapshot saved: " + result.timestamp);
                } catch (err) {
                  alert("Error saving snapshot");
                }
              }}
            >
              Snapshot Now
            </Button>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search cryptocurrencies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="market_cap_rank">Rank</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="current_price">Price</SelectItem>
                    <SelectItem value="market_cap">Market Cap</SelectItem>
                    <SelectItem value="price_change_percentage_24h">
                      24h Change
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="px-3"
                >
                  {sortOrder === "asc" ? "↑" : "↓"}
                </Button>
                <Button
                  variant="outline"
                  onClick={fetchCryptoData}
                  disabled={refreshing}
                  className="px-3 bg-transparent"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                  />
                </Button>
              </div>
            </div>

            {/* Crypto Table */}
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Coin</TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead className="text-right">Price (USD)</TableHead>
                    <TableHead className="text-right">Market Cap</TableHead>
                    <TableHead className="text-right">24h Change</TableHead>
                    <TableHead className="text-right">Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCryptos.map((crypto) => (
                    <TableRow key={crypto.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium">
                        <Badge variant="secondary">
                          {crypto.market_cap_rank}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={crypto.image || "/placeholder.svg"}
                            alt={crypto.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <span className="font-medium">{crypto.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="uppercase">
                          {crypto.symbol}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatPrice(crypto.current_price)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatMarketCap(crypto.market_cap)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatPercentage(crypto.price_change_percentage_24h)}
                      </TableCell>
                      <TableCell className="text-right text-sm text-slate-500">
                        {formatTimestamp(crypto.last_updated)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredCryptos.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                No cryptocurrencies found matching your search.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500">
          <p>
            Data provided by CoinGecko API • Auto-refreshes every 30 minutes
          </p>
          <p className="mt-1">© 2024 VR Automations - Cryptocurrency Tracker</p>
        </div>
      </div>
    </div>
  );
}
