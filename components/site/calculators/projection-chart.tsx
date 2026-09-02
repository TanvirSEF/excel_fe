"use client"

import { useMemo } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { ProjectionRow } from "@/lib/calc-cagr"
import { formatCompactCurrency, formatCurrency } from "@/lib/format"

const chartConfig = {
  value: { label: "Projected value", color: "var(--primary)" },
} satisfies ChartConfig

export function ProjectionChart({ projection }: { projection: ProjectionRow[] }) {
  const data = useMemo(
    () =>
      projection.map((row) => ({
        year: row.year,
        value: row.value,
      })),
    [projection]
  )

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-62.5 w-full"
    >
      <AreaChart data={data}>
        <defs>
          <linearGradient id="fillProjection" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-value)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-value)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="year"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={24}
          tickFormatter={(value) => `Y${value}`}
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
              labelFormatter={(value) => `Year ${value}`}
              formatter={(value) => formatCurrency(Number(value))}
            />
          }
        />
        <Area
          dataKey="value"
          type="monotone"
          fill="url(#fillProjection)"
          stroke="var(--color-value)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  )
}
