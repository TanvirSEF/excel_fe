"use client"

import Link from "next/link"

import {
  StatTiles,
} from "@/components/dashboard/analytics/stat-tiles"
import {
  ViewsBarList,
} from "@/components/dashboard/analytics/views-bar-list"
import { ErrorState } from "@/components/shared/error-state"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAnalyticsOverview } from "@/lib/queries/analytics"

export function AnalyticsOverview() {
  const { data, isPending, isError, refetch } = useAnalyticsOverview()

  if (isError) {
    return (
      <ErrorState
        title="Could not load analytics"
        message="The analytics service did not respond. Try again."
        action={
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try again
          </Button>
        }
      />
    )
  }

  if (isPending || !data) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-24" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <StatTiles
        tiles={[
          {
            label: "Total views",
            value: data.total_views.toLocaleString(),
            hint: "Across all published posts",
          },
          {
            label: "Views (7 days)",
            value: data.views_last_7_days.toLocaleString(),
            hint: "Site-wide",
          },
          {
            label: "Published posts",
            value: data.published_posts.toLocaleString(),
            hint: `${data.total_posts.toLocaleString()} total`,
          },
          {
            label: "Drafts",
            value: data.draft_posts.toLocaleString(),
            hint: "Not yet live",
          },
        ]}
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Top posts (7 days)</CardTitle>
            <CardDescription>Views by post this week</CardDescription>
          </CardHeader>
          <div className="px-6 pb-6">
            <ViewsBarList
              items={data.top_posts_7_days.map((post) => ({
                id: post.post_id,
                label: post.title,
                value: post.views,
                href: `/dashboard/analytics?post=${post.post_id}`,
              }))}
            />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trending now</CardTitle>
            <CardDescription>Backend-computed momentum</CardDescription>
          </CardHeader>
          <div className="px-6 pb-6">
            {data.trending.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Nothing trending yet.
              </p>
            ) : (
              <ol className="space-y-2.5">
                {data.trending.map((post, index) => (
                  <li key={post.id} className="flex items-baseline gap-2.5">
                    <span className="w-4 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                      {index + 1}
                    </span>
                    <Link
                      href={`/dashboard/analytics?post=${post.id}`}
                      className="min-w-0 truncate text-sm underline-offset-4 hover:underline"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
