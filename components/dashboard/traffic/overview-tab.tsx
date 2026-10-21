"use client"

import { DurationChart } from "@/components/dashboard/traffic/duration-chart"
import { MetricCard } from "@/components/dashboard/traffic/metric-card"
import { TrafficChart } from "@/components/dashboard/traffic/traffic-chart"
import { ErrorState } from "@/components/shared/error-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDuration, formatRate, percentChange, pointChange } from "@/lib/analytics-format"
import { useOverviewReport, type ReportParams } from "@/lib/queries/analytics"

export function OverviewTab({ params }: { params: ReportParams }) {
  const { data, isPending, isError, refetch } = useOverviewReport(params)

  if (isError) {
    return (
      <ErrorState
        title="Could not load the overview"
        message="The analytics service did not respond."
        action={
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try again
          </Button>
        }
      />
    )
  }
  if (isPending || !data) return <Skeleton className="h-96 w-full rounded-2xl" />

  const { summary: current, previous } = data
  const empty = current.sessions === 0

  return (
    <div className="space-y-6">
      {empty ? (
        <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
          No sessions were recorded in this period for the selected traffic filter.
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Users"
          value={current.users.toLocaleString()}
          hint={`${current.new_users.toLocaleString()} new`}
          change={percentChange(current.users, previous?.users)}
        />
        <MetricCard
          label="Sessions"
          value={current.sessions.toLocaleString()}
          change={percentChange(current.sessions, previous?.sessions)}
        />
        <MetricCard
          label="Pageviews"
          value={current.pageviews.toLocaleString()}
          hint={`${current.pages_per_session} per session`}
          change={percentChange(current.pageviews, previous?.pageviews)}
        />
        <MetricCard
          label="Engagement rate"
          value={formatRate(current.engagement_rate)}
          hint="10s+ engaged or 2+ pages"
          change={pointChange(current.engagement_rate, previous?.engagement_rate)}
          changeUnit="pp"
        />
        <MetricCard
          label="Avg. session duration"
          value={formatDuration(current.avg_session_seconds)}
          hint={`measured on ${current.duration_sessions.toLocaleString()} sessions`}
          change={percentChange(current.avg_session_seconds, previous?.avg_session_seconds)}
        />
        <MetricCard
          label="Median session duration"
          value={formatDuration(current.median_session_seconds)}
          hint="50% of sessions are shorter"
          change={percentChange(current.median_session_seconds, previous?.median_session_seconds)}
        />
        <MetricCard
          label="Avg. engagement time"
          value={formatDuration(current.avg_engagement_seconds)}
          hint="per session, active time only"
          change={percentChange(current.avg_engagement_seconds, previous?.avg_engagement_seconds)}
        />
        <MetricCard
          label="Bounce rate"
          value={formatRate(current.bounce_rate)}
          hint={`${current.single_page_sessions.toLocaleString()} single-page sessions`}
          change={pointChange(current.bounce_rate, previous?.bounce_rate)}
          changeUnit="pp"
        />
        <MetricCard
          label="Returning visitors"
          value={formatRate(current.returning_rate)}
          hint={`${current.returning_users.toLocaleString()} of ${current.users.toLocaleString()} users`}
          change={pointChange(current.returning_rate, previous?.returning_rate)}
          changeUnit="pp"
        />
      </div>

      <TrafficChart report={data} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DurationChart
            data={data.duration_distribution}
            measured={current.duration_sessions}
            excluded={current.duration_excluded_sessions}
          />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">New vs returning users</CardTitle>
            <CardDescription>Returning means seen in an earlier period.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex h-3 overflow-hidden rounded-full bg-muted">
              <div className="bg-primary" style={{ width: `${(1 - current.returning_rate) * 100}%` }} />
            </div>
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">New</dt>
                <dd className="tabular-nums">{current.new_users.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Returning</dt>
                <dd className="tabular-nums">{current.returning_users.toLocaleString()}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <details className="rounded-2xl border bg-card p-4 text-sm">
        <summary className="cursor-pointer font-medium">How these numbers are calculated</summary>
        <dl className="mt-3 space-y-2">
          {data.methodology.map((item) => (
            <div key={item.metric}>
              <dt className="font-medium">{item.metric}</dt>
              <dd className="text-muted-foreground">{item.definition}</dd>
            </div>
          ))}
        </dl>
      </details>
    </div>
  )
}
