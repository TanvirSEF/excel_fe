"use client"

import { ViewsBarList } from "@/components/dashboard/analytics/views-bar-list"
import { ErrorState } from "@/components/shared/error-state"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRealtimeAnalytics } from "@/lib/queries/analytics"
import type { LabelCount } from "@/types/api"

function BreakdownCard({ title, entries }: { title: string; entries: LabelCount[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ViewsBarList
          valueLabel=""
          items={entries.map((entry) => ({ id: entry.label, label: entry.label, value: entry.count }))}
        />
      </CardContent>
    </Card>
  )
}

export function RealtimePanel() {
  const { data, isPending, isError } = useRealtimeAnalytics()

  if (isError) {
    return <ErrorState title="Could not load realtime data" message="The analytics service did not respond." />
  }
  if (isPending || !data) return <Skeleton className="h-96 w-full rounded-2xl" />

  const peak = Math.max(...data.views_per_minute.map((entry) => entry.views), 1)

  return (
    <section className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Active users, last 5 minutes
            </CardDescription>
            <CardTitle className="text-4xl font-semibold tabular-nums">{data.active_5m.toLocaleString()}</CardTitle>
            <p className="text-xs text-muted-foreground">
              {data.active_30m.toLocaleString()} in the last 30 minutes · {data.new_visitors} new,{" "}
              {data.returning_visitors} returning
            </p>
          </CardHeader>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Pageviews per minute</CardTitle>
            <CardDescription>
              {data.pageviews_5m.toLocaleString()} in the last 5 minutes · {data.pageviews_30m.toLocaleString()} in the
              last 30
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-24 items-end gap-0.5">
              {data.views_per_minute.map((entry) => (
                <div
                  key={entry.minute}
                  title={`${new Date(entry.minute).toLocaleTimeString()} · ${entry.views} views`}
                  className="flex-1 rounded-t-sm bg-primary/70"
                  style={{ height: `${Math.max(4, (entry.views / peak) * 100)}%` }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <BreakdownCard title="Pages being viewed now" entries={data.top_pages} />
        <BreakdownCard title="Traffic sources" entries={data.top_sources} />
        <BreakdownCard title="Countries" entries={data.countries} />
        <BreakdownCard title="Devices" entries={data.devices} />
        <BreakdownCard title="Browsers" entries={data.browsers} />
        <BreakdownCard title="Operating systems" entries={data.systems} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Recent pageviews</CardTitle>
          <CardDescription>Visitor IDs are short one-way hashes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Visitor</TableHead>
                <TableHead>Page</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Country</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.recent.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-6 text-center text-muted-foreground">
                    No recent pageviews.
                  </TableCell>
                </TableRow>
              ) : (
                data.recent.map((visit) => (
                  <TableRow key={`${visit.at}-${visit.visitor}-${visit.path}`}>
                    <TableCell className="whitespace-nowrap text-xs">{new Date(visit.at).toLocaleTimeString()}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {visit.visitor}
                      {visit.returning ? " · returning" : ""}
                    </TableCell>
                    <TableCell className="max-w-56 truncate text-xs">{visit.path}</TableCell>
                    <TableCell className="text-xs">{visit.source}</TableCell>
                    <TableCell className="text-xs">
                      {visit.device} · {visit.browser}
                    </TableCell>
                    <TableCell className="text-xs">{visit.country ?? "Unknown"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">{data.note}</p>
    </section>
  )
}
