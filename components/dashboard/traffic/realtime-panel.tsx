"use client"

import { ViewsBarList } from "@/components/dashboard/analytics/views-bar-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useRealtimeAnalytics } from "@/lib/queries/analytics"
import type { LabelCount } from "@/types/api"

function toItems(entries: LabelCount[]) {
  return entries.map((entry) => ({ id: entry.label, label: entry.label, value: entry.count }))
}

function BreakdownCard({ title, entries }: { title: string; entries: LabelCount[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ViewsBarList items={toItems(entries)} valueLabel="" />
      </CardContent>
    </Card>
  )
}

export function RealtimePanel() {
  const { data, isPending } = useRealtimeAnalytics()

  if (isPending || !data) {
    return <Skeleton className="h-64 w-full rounded-2xl" />
  }

  const peak = Math.max(...data.views_per_minute.map((entry) => entry.views), 1)

  return (
    <section className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Active users right now
            </CardDescription>
            <CardTitle className="text-4xl font-semibold tabular-nums">
              {data.active_users.toLocaleString()}
            </CardTitle>
            <p className="text-xs text-muted-foreground">Humans seen in the last 5 minutes</p>
          </CardHeader>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Views per minute</CardTitle>
            <CardDescription>Last 30 minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-24 items-end gap-0.5">
              {data.views_per_minute.map((entry) => (
                <div
                  key={entry.minute}
                  title={`${entry.views} views`}
                  className="flex-1 rounded-t-sm bg-primary/70"
                  style={{ height: `${Math.max(4, (entry.views / peak) * 100)}%` }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <BreakdownCard title="Active pages" entries={data.top_pages} />
        <BreakdownCard title="Sources" entries={data.top_sources} />
        <BreakdownCard title="Countries" entries={data.countries} />
        <BreakdownCard title="Devices" entries={data.devices} />
      </div>
    </section>
  )
}
