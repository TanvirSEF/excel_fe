"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { OverviewReport } from "@/types/api"

const chartConfig = {
  users: { label: "Users", color: "var(--chart-1)" },
  sessions: { label: "Sessions", color: "var(--chart-2)" },
  pageviews: { label: "Pageviews", color: "var(--chart-3)" },
} satisfies ChartConfig

function formatBucket(value: string, granularity: "hour" | "day") {
  const date = new Date(value)
  return granularity === "hour"
    ? date.toLocaleTimeString("en-US", { hour: "numeric" })
    : date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function TrafficChart({ report }: { report: OverviewReport }) {
  const { granularity } = report.period

  return (
    <Card>
      <CardHeader>
        <CardTitle>Traffic over time</CardTitle>
        <CardDescription>
          Users, sessions and pageviews per {granularity}. Users are distinct visitors in that {granularity}, not a
          running total.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
          <LineChart data={report.series}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="bucket"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={28}
              tickFormatter={(value: string) => formatBucket(value, granularity)}
            />
            <YAxis tickLine={false} axisLine={false} width={36} allowDecimals={false} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => formatBucket(String(value), granularity)}
                  indicator="dot"
                />
              }
            />
            <Line dataKey="pageviews" type="monotone" stroke="var(--color-pageviews)" strokeWidth={2} dot={false} />
            <Line dataKey="sessions" type="monotone" stroke="var(--color-sessions)" strokeWidth={2} dot={false} />
            <Line dataKey="users" type="monotone" stroke="var(--color-users)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
