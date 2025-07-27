"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCoins, type CryptoCurrency } from "@/lib/api";
import { CryptoChart } from "@/components/crypto-chart";
import { toast } from "@/hooks/use-toast";

export default function ChartsPage() {
  const [cryptos, setCryptos] = useState<CryptoCurrency[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoCurrency | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCoins();
        console.log("Fetched data:", data ?? "No data");

        if (Array.isArray(data)) {
          setCryptos(data);
          localStorage.setItem("cachedCoins", JSON.stringify(data));

          if (data.length > 0) {
            setSelectedCrypto(data[0]);
          }
        } else if (
          typeof data === "object" &&
          data !== null &&
          "status" in data &&
          typeof (data as any).status?.error_code === "number" &&
          (data as any).status.error_code === 429
        ) {
          console.warn("Rate limit exceeded. Using cached data.");

          const cachedData = localStorage.getItem("cachedCoins");
          if (cachedData) {
            const parsed = JSON.parse(cachedData);
            setCryptos(parsed);
            if (parsed.length > 0) {
              setSelectedCrypto(parsed[0]);
            }
            toast({
              title: "Rate Limit Exceeded",
              description: "Showing cached data instead.",
              variant: "default",
            });
          } else {
            setCryptos([]);
            toast({
              title: "Rate Limit Exceeded",
              description: "No cached data available to show.",
              variant: "destructive",
            });
          }
        } else {
          console.error("Unexpected response format:", data);
          setCryptos([]);
          toast({
            title: "Error",
            description: "Invalid data format received from API",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Fetch error:", error);

        const cachedData = localStorage.getItem("cachedCoins");
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          setCryptos(parsed);
          if (parsed.length > 0) {
            setSelectedCrypto(parsed[0]);
          }
          toast({
            title: "Offline Mode",
            description: "Using cached data due to API failure.",
            variant: "default",
          });
        } else {
          setCryptos([]);
          toast({
            title: "Error",
            description: "Failed to fetch cryptocurrency data",
            variant: "destructive",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading charts...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Charts</h1>
        <p className="text-muted-foreground">
          Interactive cryptocurrency price charts
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Cryptocurrency</CardTitle>
          <CardDescription>
            Choose a cryptocurrency to view its price chart
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedCrypto?.id || ""}
            onValueChange={(value) => {
              const crypto = cryptos.find((c) => c.id === value);
              setSelectedCrypto(crypto || null);
            }}
          >
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Select a cryptocurrency" />
            </SelectTrigger>
            <SelectContent>
              {cryptos.map((crypto) => (
                <SelectItem key={crypto.id} value={crypto.id}>
                  <div className="flex items-center gap-2">
                    <img
                      src={crypto.image || "/placeholder.svg"}
                      alt={crypto.name}
                      className="w-4 h-4"
                    />
                    {crypto.name} ({crypto.symbol.toUpperCase()})
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedCrypto && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <img
                src={selectedCrypto.image || "/placeholder.svg"}
                alt={selectedCrypto.name}
                className="w-6 h-6"
              />
              {selectedCrypto.name} ({selectedCrypto.symbol.toUpperCase()})
              Price Chart
            </CardTitle>
            <CardDescription>
              Current Price: $
              {selectedCrypto.current_price?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) ?? "N/A"}{" "}
              | Market Cap: $
              {selectedCrypto.market_cap?.toLocaleString() ?? "N/A"} | 24h
              Change:{" "}
              {selectedCrypto.price_change_percentage_24h?.toFixed(2) ?? "N/A"}%
              | Last Updated:{" "}
              {selectedCrypto.last_updated
                ? new Date(selectedCrypto.last_updated).toLocaleString()
                : "N/A"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CryptoChart crypto={selectedCrypto} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
