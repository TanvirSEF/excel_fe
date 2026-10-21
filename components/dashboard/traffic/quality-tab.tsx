"use client"

import { MetricCard } from "@/components/dashboard/traffic/metric-card"
import { ErrorState } from "@/components/shared/error-state"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatRate } from "@/lib/analytics-format"
import { useQualityReport, type ReportParams } from "@/lib/queries/analytics"

export const CLASS_LABELS: Record<string, string> = {
  likely_human: "Likely human",
  known_bot: "Known bot",
  suspicious: "Suspicious",
  internal: "Internal",
  unknown: "Unknown",
}

export function QualityTab({ params }: { params: ReportParams }) {
  const { data, isPending, isError } = useQualityReport(params)

  if (isError) {
    return <ErrorState title="Could not load traffic quality" message="Try refreshing in a moment." />
  }
  if (isPending || !data) return <Skeleton className="h-80 w-full rounded-2xl" />

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          label="Observed sessions"
          value={data.observed_sessions.toLocaleString()}
          hint="Every session that ran the tracker"
        />
        <MetricCard
          label="Estimated human sessions"
          value={data.estimated_human_sessions.toLocaleString()}
          hint="Showed interaction or sustained engagement"
        />
        <MetricCard
          label="Excluded sessions"
          value={data.excluded_sessions.toLocaleString()}
          hint="Known bots, suspicious and internal"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Classification</CardTitle>
          <CardDescription>Share of observed sessions per class</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.classes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sessions in this period.</p>
          ) : (
            data.classes.map((row) => (
              <div key={row.traffic_class} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{CLASS_LABELS[row.traffic_class] ?? row.traffic_class}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {row.sessions.toLocaleString()} sessions · {row.pageviews.toLocaleString()} pageviews ·{" "}
                    {formatRate(row.share)}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(2, row.share * 100)}%` }} />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Why sessions were classified this way</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {data.reasons.map((row) => (
            <div key={`${row.traffic_class}-${row.reason}`} className="flex items-start justify-between gap-3 text-sm">
              <div>
                <Badge variant="outline" className="mr-2">
                  {CLASS_LABELS[row.traffic_class] ?? row.traffic_class}
                </Badge>
                {row.reason}
                <span className="ml-2 text-xs text-muted-foreground">{row.confidence} confidence</span>
              </div>
              <span className="shrink-0 tabular-nums text-muted-foreground">{row.sessions.toLocaleString()}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <details className="rounded-2xl border bg-card p-4 text-sm">
        <summary className="cursor-pointer font-medium">Limitations of bot detection</summary>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-muted-foreground">
          {data.limitations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </details>
    </div>
  )
}
