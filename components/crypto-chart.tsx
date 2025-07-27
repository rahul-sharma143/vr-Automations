"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"
import type { CryptoCurrency } from "@/lib/api"

interface CryptoChartProps {
  crypto: CryptoCurrency
}

export function CryptoChart({ crypto }: CryptoChartProps) {
  const [chartData, setChartData] = useState<any[]>([])
  const [timeframe, setTimeframe] = useState("7d")
  const [loading, setLoading] = useState(false)

  // Generate mock historical data for demonstration
  const generateMockData = (days: number) => {
    const data = []
    const basePrice = crypto.current_price
    const now = new Date()

    for (let i = days; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const randomChange = (Math.random() - 0.5) * 0.1 // ±5% random change
      const price = basePrice * (1 + randomChange * (i / days))

      data.push({
        date: date.toISOString().split("T")[0],
        price: Math.max(0, price),
        timestamp: date.getTime(),
      })
    }

    return data
  }

  useEffect(() => {
    setLoading(true)
    // Simulate API call delay
    setTimeout(() => {
      const days = timeframe === "1d" ? 1 : timeframe === "7d" ? 7 : timeframe === "30d" ? 30 : 90
      setChartData(generateMockData(days))
      setLoading(false)
    }, 500)
  }, [crypto.id, timeframe])

  const chartConfig = {
    price: {
      label: "Price",
      color: "hsl(var(--primary))",
    },
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {["1d", "7d", "30d", "90d"].map((period) => (
          <Button
            key={period}
            variant={timeframe === period ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeframe(period)}
          >
            {period}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="h-[400px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
              <YAxis tickFormatter={(value) => `$${value.toFixed(2)}`} />
              <ChartTooltip
                content={<ChartTooltipContent />}
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
              />
              <Line type="monotone" dataKey="price" stroke="var(--color-price)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      )}
    </div>
  )
}
