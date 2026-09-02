"use client"

import { useMemo } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { AmortizationMonth } from "@/lib/calc-loan"
import { formatCompactCurrency, formatCurrency, formatMonths } from "@/lib/format"

const chartConfig = {
  balance: { label: "Balance", color: "var(--primary)" },
  interest: { label: "Interest", color: "var(--chart-1)" },
  principal: { label: "Principal", color: "var(--chart-3)" },
} satisfies ChartConfig

interface AmortizationChartProps {
  schedule: AmortizationMonth[]
}

export function AmortizationChart({ schedule }: AmortizationChartProps) {
  const data = useMemo(
    () =>
      schedule.map((row) => ({
        month: row.month,
        balance: row.balance,
        interest: row.interest,
        principal: row.principal,
      })),
    [schedule]
  )

  return (
    <Card>
      <Tabs defaultValue="balance">
        <CardHeader className="flex-row items-start justify-between gap-4">
          <div className="space-y-1.5">
            <CardTitle>Payoff over time</CardTitle>
            <CardDescription>
              Remaining balance shrinks as payments shift from interest to
              principal.
            </CardDescription>
          </div>
          <TabsList>
            <TabsTrigger value="balance">Balance</TabsTrigger>
            <TabsTrigger value="split">Interest vs Principal</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <TabsContent value="balance">
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-62.5 w-full"
            >
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="fillBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-balance)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-balance)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={24}
                  tickFormatter={(value) => `Y${Math.ceil(Number(value) / 12)}`}
                />
                <YAxis
                  width={56}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => formatCompactCurrency(Number(value))}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      indicator="dot"
                      labelFormatter={(value) =>
                        `Month ${value} (${formatMonths(Number(value))})`
                      }
                      formatter={(value, name) => (
                        <>
                          {formatCurrency(Number(value))}
                          {name ? ` ${name}` : ""}
                        </>
                      )}
                    />
                  }
                />
                <Area
                  dataKey="balance"
                  type="monotone"
                  fill="url(#fillBalance)"
                  stroke="var(--color-balance)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="split">
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-62.5 w-full"
            >
              <AreaChart data={data}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={24}
                  tickFormatter={(value) => `Y${Math.ceil(Number(value) / 12)}`}
                />
                <YAxis
                  width={56}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => formatCompactCurrency(Number(value))}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      indicator="dot"
                      labelFormatter={(value) =>
                        `Month ${value} (${formatMonths(Number(value))})`
                      }
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                  }
                />
                <Area
                  dataKey="interest"
                  type="monotone"
                  stackId="pay"
                  fill="var(--color-interest)"
                  fillOpacity={0.55}
                  stroke="var(--background)"
                  strokeWidth={2}
                />
                <Area
                  dataKey="principal"
                  type="monotone"
                  stackId="pay"
                  fill="var(--color-principal)"
                  fillOpacity={0.55}
                  stroke="var(--background)"
                  strokeWidth={2}
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  )
}
