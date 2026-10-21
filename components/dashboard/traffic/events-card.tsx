"use client"

import { ErrorState } from "@/components/shared/error-state"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useEventsReport, type ReportParams } from "@/lib/queries/analytics"

const EVENT_LABELS: Record<string, string> = {
  outbound_click: "Outbound link clicks",
  file_download: "File downloads",
  calculator_use: "Calculator uses",
}

export function EventsCard({ params }: { params: ReportParams }) {
  const { data, isPending, isError } = useEventsReport(params)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Events</CardTitle>
        <CardDescription>Outbound clicks, file downloads and first calculator input per page. Only the link host or page path is stored.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isError ? (
          <ErrorState title="Could not load events" message="Try refreshing in a moment." />
        ) : isPending || !data ? (
          <Skeleton className="h-24 w-full" />
        ) : data.rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No events in this period.</p>
        ) : (
          <>
            <dl className="space-y-1 text-sm">
              {data.rows.map((row) => (
                <div key={row.name} className="flex justify-between">
                  <dt>{EVENT_LABELS[row.name] ?? row.name}</dt>
                  <dd className="tabular-nums text-muted-foreground">
                    {row.count.toLocaleString()} from {row.sessions.toLocaleString()} sessions
                  </dd>
                </div>
              ))}
            </dl>
            <ul className="space-y-1 text-xs text-muted-foreground">
              {data.targets.map((target) => (
                <li key={`${target.name}-${target.target}`} className="flex justify-between gap-3">
                  <span className="truncate">{target.target}</span>
                  <span className="tabular-nums">{target.count}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  )
}
