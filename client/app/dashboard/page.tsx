"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Search, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCoins } from "@/lib/api";

export interface CryptoCurrency {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  image: string;
  last_updated: string;
}

export default function DashboardPage() {
  const [cryptos, setCryptos] = useState<CryptoCurrency[]>([]);
  const [filtered, setFiltered] = useState<CryptoCurrency[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("market_cap_rank");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getCoins();
      console.log("Dashboard fetched data:", data ?? "No data received");

      if (Array.isArray(data)) {
        setCryptos(data);
        setFiltered(data);
        setLastUpdated(new Date());
        localStorage.setItem("cachedCoins", JSON.stringify(data));
      } else if (
        typeof data === "object" &&
        data !== null &&
        "status" in data &&
        typeof (data as any).status?.error_code === "number" &&
        (data as any).status.error_code === 429
      ) {
        console.warn("Rate limit exceeded. Loading from cache...");

        const cachedData = localStorage.getItem("cachedCoins");
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          setCryptos(parsed);
          setFiltered(parsed);
          setLastUpdated(new Date());
        } else {
          console.warn("No cached data available.");
          setCryptos([]);
          setFiltered([]);
        }
      } else {
        console.error("Unexpected response format:", data);
        setCryptos([]);
        setFiltered([]);
      }
    } catch (err) {
      console.error("Failed to fetch:", err);

      const cachedData = localStorage.getItem("cachedCoins");
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        setCryptos(parsed);
        setFiltered(parsed);
        setLastUpdated(new Date());
      } else {
        setCryptos([]);
        setFiltered([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30 * 60 * 1000); // 30 min
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const results = cryptos.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
    );

    results.sort((a, b) => {
      const aVal = a[sortBy as keyof CryptoCurrency];
      const bVal = b[sortBy as keyof CryptoCurrency];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortOrder === "asc"
        ? Number(aVal) - Number(bVal)
        : Number(bVal) - Number(aVal);
    });

    setFiltered(results);
  }, [search, sortBy, sortOrder, cryptos]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price);

  const formatMarketCap = (cap: number) => {
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
    if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
    return `$${cap.toLocaleString()}`;
  };

  const formatChange = (value: number) => {
    const isUp = value >= 0;
    return (
      <div
        className={`flex items-center justify-end gap-1 font-medium ${
          isUp ? "text-green-600" : "text-red-600"
        }`}
      >
        {isUp ? (
          <TrendingUp className="w-4 h-4" />
        ) : (
          <TrendingDown className="w-4 h-4" />
        )}
        {Math.abs(value).toFixed(2)}%
      </div>
    );
  };

  const formatTimestamp = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
          <CardDescription>Fetching cryptocurrency data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading cryptocurrency data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Top 10 Cryptocurrencies</span>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {lastUpdated && `Updated: ${lastUpdated.toLocaleTimeString()}`}
          </div>
        </CardTitle>
        <CardDescription>
          View current price, market cap, 24h change, and last updated timestamp
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search coin name or symbol"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={(val) => setSortBy(val)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="market_cap_rank">Rank</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="current_price">Price</SelectItem>
                <SelectItem value="market_cap">Market Cap</SelectItem>
                <SelectItem value="price_change_percentage_24h">
                  24h %
                </SelectItem>
              </SelectContent>
            </Select>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="text-sm border border-input px-3 py-1 rounded-md hover:bg-accent"
            >
              {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12 text-center">#</TableHead>
                <TableHead>Coin</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Market Cap</TableHead>
                <TableHead className="text-right">24h Change</TableHead>
                <TableHead className="text-right">Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length > 0 ? (
                filtered.map((coin) => (
                  <TableRow key={coin.id}>
                    <TableCell className="text-center font-semibold">
                      <Badge variant="secondary">{coin.market_cap_rank}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img
                          src={coin.image || "/placeholder.svg"}
                          alt={coin.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="font-medium">{coin.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="uppercase">{coin.symbol}</TableCell>
                    <TableCell className="text-right font-mono">
                      {formatPrice(coin.current_price)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatMarketCap(coin.market_cap)}
                    </TableCell>
                    <TableCell>
                      {formatChange(coin.price_change_percentage_24h)}
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {formatTimestamp(coin.last_updated)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <p className="text-muted-foreground">
                      {search
                        ? "No matching cryptocurrencies found."
                        : "No cryptocurrency data available."}
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
