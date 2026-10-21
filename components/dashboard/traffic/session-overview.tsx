"use client"

import { useState } from "react"

import { StatTiles } from "@/components/dashboard/analytics/stat-tiles"
import { ViewsAreaChart } from "@/components/dashboard/analytics/views-area-chart"
import { ViewsBarList } from "@/components/dashboard/analytics/views-bar-list"
import { ErrorState } from "@/components/shared/error-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useTrafficOverview } from "@/lib/queries/analytics"
import type { LabelCount } from "@/types/api"

const RANGES = [7, 30, 90]

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.round(totalSeconds % 60)
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`
}

function BreakdownCard({ title, entries }: { title: string; entries: LabelCount[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ViewsBarList
          items={entries.map((entry) => ({ id: entry.label, label: entry.label, value: entry.count }))}
          valueLabel="sessions"
        />
      </CardContent>
    </Card>
  )
}

export function SessionOverview() {
  const [days, setDays] = useState(7)
  const [humansOnly, setHumansOnly] = useState(true)
  const { data, isPending, isError, refetch } = useTrafficOverview(days, humansOnly)

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Sessions overview</h2>
          <p className="text-sm text-muted-foreground">
            Visitors, session length and engagement from the on-site tracker.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {RANGES.map((range) => (
            <Button
              key={range}
              size="sm"
              variant={days === range ? "default" : "outline"}
              onClick={() => setDays(range)}
            >
              {range}d
            </Button>
          ))}
          <Button
            size="sm"
            variant={humansOnly ? "default" : "outline"}
            onClick={() => setHumansOnly(!humansOnly)}
          >
            {humansOnly ? "Humans only" : "Including bots"}
          </Button>
        </div>
      </div>

      {isError ? (
        <ErrorState
          title="Could not load sessions overview"
          message="The analytics service did not respond."
          action={
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      ) : isPending || !data ? (
        <Skeleton className="h-96 w-full rounded-2xl" />
      ) : (
        <>
          <StatTiles
            tiles={[
              { label: "Users", value: data.users.toLocaleString() },
              { label: "Sessions", value: data.sessions.toLocaleString() },
              { label: "Pageviews", value: data.pageviews.toLocaleString() },
              {
                label: "Avg. engaged time per session",
                value: formatDuration(data.avg_session_seconds),
                hint: `${data.pages_per_session} pages/session`,
              },
            ]}
          />
          <StatTiles
            tiles={[
              {
                label: "Engagement rate",
                value: `${(data.engagement_rate * 100).toFixed(1)}%`,
                hint: "Sessions with 10s+ engaged time or 2+ pages",
              },
            ]}
          />

          <ViewsAreaChart
            data={data.daily.map((day) => ({ date: day.date, views: day.pageviews }))}
            title={`Pageviews, last ${data.days} days`}
            description="Daily pageviews by session start date"
          />

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Top pages</CardTitle>
                <CardDescription>Views and average engaged time</CardDescription>
              </CardHeader>
              <CardContent>
                <ViewsBarList
                  items={data.top_pages.map((page) => ({
                    id: page.path,
                    label: `${page.path} · ${formatDuration(page.avg_engaged_seconds)}`,
                    value: page.views,
                  }))}
                />
              </CardContent>
            </Card>
            <BreakdownCard title="Traffic sources" entries={data.sources} />
            <BreakdownCard title="Devices" entries={data.devices} />
            <BreakdownCard title="Countries" entries={data.countries} />
          </div>
        </>
      )}
    </section>
  )
}
