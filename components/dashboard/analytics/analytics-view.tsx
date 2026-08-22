"use client"

import Link from "next/link"

import { AnalyticsOverview } from "@/components/dashboard/analytics/analytics-overview"
import { StatTiles } from "@/components/dashboard/analytics/stat-tiles"
import {
  ViewsAreaChart,
} from "@/components/dashboard/analytics/views-area-chart"
import {
  ViewsBarList,
} from "@/components/dashboard/analytics/views-bar-list"
import { ErrorState } from "@/components/shared/error-state"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { usePostAnalytics } from "@/lib/queries/analytics"

export function AnalyticsView({ postId }: { postId?: string }) {
  if (!postId) {
    return <AnalyticsOverview />
  }
  return <PostDrilldown postId={postId} />
}

function PostDrilldown({ postId }: { postId: string }) {
  const { data, isPending, isError, refetch } = usePostAnalytics(postId)

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard/analytics"
          className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          ← All analytics
        </Link>
      </div>

      {isError ? (
        <ErrorState
          title="Could not load post analytics"
          message="You may not have access to this post, or the service did not respond."
          action={
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      ) : isPending || !data ? (
        <div className="space-y-6">
          <Skeleton className="h-8 w-72" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-72" />
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                {data.title}
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Post analytics, last 30 days
              </p>
            </div>
            <Link
              href={`/blog/${data.slug}`}
              target="_blank"
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              View public
            </Link>
          </div>

          <StatTiles
            tiles={[
              {
                label: "Total views",
                value: data.total_views.toLocaleString(),
                hint: "All time",
              },
              {
                label: "Views (30 days)",
                value: data.views_last_30_days.toLocaleString(),
              },
              {
                label: "Unique visitors (30 days)",
                value: data.unique_visitors_30_days.toLocaleString(),
              },
            ]}
          />

          <ViewsAreaChart data={data.views_last_7_days} />

          <Card>
            <CardHeader>
              <CardTitle>Top referrers (30 days)</CardTitle>
              <CardDescription>Where the readers came from</CardDescription>
            </CardHeader>
            <div className="px-6 pb-6">
              <ViewsBarList
                items={data.top_referrers_30_days.map((entry, index) => ({
                  id: `${entry.referrer}-${index}`,
                  label: entry.referrer === "" ? "Direct" : entry.referrer,
                  value: entry.views,
                }))}
              />
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
