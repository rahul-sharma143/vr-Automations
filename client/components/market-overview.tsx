"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react"
import type { CryptoCurrency } from "@/lib/api"

interface MarketOverviewProps {
  cryptos: CryptoCurrency[]
}

export function MarketOverview({ cryptos }: MarketOverviewProps) {
  const totalMarketCap = cryptos.reduce((sum, crypto) => sum + crypto.market_cap, 0)
  const gainers = cryptos.filter((crypto) => crypto.price_change_percentage_24h > 0).length
  const losers = cryptos.filter((crypto) => crypto.price_change_percentage_24h < 0).length
  const avgChange = cryptos.reduce((sum, crypto) => sum + crypto.price_change_percentage_24h, 0) / cryptos.length

  const formatMarketCap = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    return `$${value.toLocaleString()}`
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Market Cap</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatMarketCap(totalMarketCap)}</div>
          <p className="text-xs text-muted-foreground">Top {cryptos.length} cryptocurrencies</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Market Trend</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${avgChange >= 0 ? "text-green-600" : "text-red-600"}`}>
            {avgChange >= 0 ? "+" : ""}
            {avgChange.toFixed(2)}%
          </div>
          <p className="text-xs text-muted-foreground">Average 24h change</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gainers</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{gainers}</div>
          <p className="text-xs text-muted-foreground">Coins up in 24h</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Losers</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{losers}</div>
          <p className="text-xs text-muted-foreground">Coins down in 24h</p>
        </CardContent>
      </Card>
    </div>
  )
}
