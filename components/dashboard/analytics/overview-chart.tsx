"use client"

import { useId, useMemo, useState } from "react"
import Link from "next/link"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"
import {
  IconActivity,
  IconArrowUpRight,
  IconChartAreaLine,
  IconChartBar,
  IconEye,
} from "@tabler/icons-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import type { OverviewAnalytics } from "@/types/api"

const chartConfig = {
  views: {
    label: "Views",
    color: "var(--primary)",
  },
} satisfies ChartConfig

interface OverviewChartProps {
  data: OverviewAnalytics
}

export function OverviewChart({ data }: OverviewChartProps) {
  const [viewMode, setViewMode] = useState<"trend" | "top">("trend")
  const gradientId = useId().replace(/:/g, "")

  // Format or synthesize daily series for last 7 days
  const dailyData = useMemo(() => {
    if (data.daily_views_7_days && data.daily_views_7_days.length > 0) {
      return data.daily_views_7_days.map((item) => {
        const d = new Date(item.date)
        return {
          date: item.date,
          dayLabel: d.toLocaleDateString("en-US", { weekday: "short" }),
          fullDate: d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          views: item.views,
        }
      })
    }

    // Fallback: 7 days up to today with 0 or distributed views
    const now = new Date()
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date()
      d.setDate(now.getDate() - (6 - i))
      const dateStr = d.toISOString().split("T")[0]
      return {
        date: dateStr,
        dayLabel: d.toLocaleDateString("en-US", { weekday: "short" }),
        fullDate: d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        views: 0,
      }
    })
  }, [data.daily_views_7_days])

  // Format top posts for BarChart
  const topPostsData = useMemo(() => {
    return data.top_posts_7_days.slice(0, 5).map((post) => ({
      name:
        post.title.length > 28
          ? `${post.title.slice(0, 26)}…`
          : post.title,
      fullTitle: post.title,
      views: post.views,
      id: post.post_id,
      slug: post.slug,
    }))
  }, [data.top_posts_7_days])

  const totalViews7d = data.views_last_7_days
  const avgViewsPerDay = Math.round(totalViews7d / 7)

  return (
    <Card className="rounded-xl border shadow-2xs overflow-hidden">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-3 sm:pb-4 border-b bg-muted/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <IconActivity className="h-4 w-4" />
            </span>
            <CardTitle className="text-base font-semibold">
              Traffic & Performance
            </CardTitle>
          </div>
          <CardDescription className="text-xs mt-1">
            Site-wide reader engagement and view distribution over the last 7 days.
          </CardDescription>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Metrics */}
          <div className="hidden md:flex items-center gap-4 text-right pr-2 border-r border-border/60">
            <div>
              <p className="text-[11px] text-muted-foreground">7-Day Total</p>
              <p className="text-sm font-bold text-foreground">
                {totalViews7d.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">Daily Avg</p>
              <p className="text-sm font-bold text-foreground">
                ~{avgViewsPerDay.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="inline-flex rounded-lg border bg-background/80 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setViewMode("trend")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-medium transition-all",
                viewMode === "trend"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <IconChartAreaLine className="h-3.5 w-3.5" />
              <span>Daily Trend</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("top")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-medium transition-all",
                viewMode === "top"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <IconChartBar className="h-3.5 w-3.5" />
              <span>Top Posts</span>
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-6 sm:px-6">
        {viewMode === "trend" ? (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[280px] w-full"
          >
            <AreaChart
              data={dailyData}
              margin={{ top: 10, right: 12, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-views)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-views)"
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                className="stroke-border/60"
              />
              <XAxis
                dataKey="dayLabel"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                className="text-xs text-muted-foreground font-medium"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                allowDecimals={false}
                className="text-xs text-muted-foreground font-medium"
                tickFormatter={(val: number) =>
                  val >= 1000 ? `${(val / 1000).toFixed(1)}k` : String(val)
                }
              />
              <ChartTooltip
                cursor={{
                  stroke: "var(--color-views)",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
                content={
                  <ChartTooltipContent
                    labelFormatter={(_, payload) => {
                      const item = payload?.[0]?.payload
                      return item ? `${item.dayLabel}, ${item.fullDate}` : ""
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="views"
                type="monotone"
                fill={`url(#${gradientId})`}
                stroke="var(--color-views)"
                strokeWidth={2.5}
                dot={{
                  r: 3,
                  fill: "var(--color-views)",
                  strokeWidth: 2,
                  stroke: "var(--background)",
                }}
                activeDot={{
                  r: 5,
                  fill: "var(--color-views)",
                  strokeWidth: 2,
                  stroke: "var(--background)",
                }}
              />
            </AreaChart>
          </ChartContainer>
        ) : topPostsData.length === 0 ? (
          <div className="flex h-[280px] flex-col items-center justify-center gap-2 text-center text-muted-foreground">
            <IconEye className="h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm font-medium">No post views recorded yet this week</p>
            <p className="text-xs text-muted-foreground/70">
              When readers browse articles, the leading posts will be graphed here.
            </p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[280px] w-full"
          >
            <BarChart
              data={topPostsData}
              layout="vertical"
              margin={{ top: 10, right: 24, left: 10, bottom: 0 }}
            >
              <CartesianGrid
                horizontal={false}
                strokeDasharray="3 3"
                className="stroke-border/60"
              />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                className="text-xs text-muted-foreground font-medium"
                tickFormatter={(val: number) =>
                  val >= 1000 ? `${(val / 1000).toFixed(1)}k` : String(val)
                }
              />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                axisLine={false}
                width={160}
                className="text-xs font-medium text-foreground"
              />
              <ChartTooltip
                cursor={{ fill: "var(--muted)", opacity: 0.3 }}
                content={
                  <ChartTooltipContent
                    labelFormatter={(_, payload) => {
                      const item = payload?.[0]?.payload
                      return item ? item.fullTitle : ""
                    }}
                    indicator="dot"
                  />
                }
              />
              <Bar
                dataKey="views"
                fill="var(--color-views)"
                radius={[0, 6, 6, 0]}
                barSize={20}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>

      <CardFooter className="flex flex-wrap items-center justify-between gap-2 border-t bg-muted/10 px-5 py-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <IconEye className="h-3.5 w-3.5 text-primary" />
          {viewMode === "trend"
            ? "Aggregated unique hits and page visits recorded across all live routes."
            : "Top 5 posts driving the highest engagement in the last 7 days."}
        </span>
        {viewMode === "top" && topPostsData.length > 0 && (
          <Link
            href={`/dashboard/analytics?post=${topPostsData[0].id}`}
            className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
          >
            <span>Inspect top post</span>
            <IconArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </CardFooter>
    </Card>
  )
}
