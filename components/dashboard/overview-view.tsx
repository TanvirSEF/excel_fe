"use client"

import Link from "next/link"

import { Skeleton } from "@/components/ui/skeleton"
import { can, useAuthStore } from "@/lib/auth"

export function OverviewView() {
  const user = useAuthStore((state) => state.user)
  const status = useAuthStore((state) => state.status)

  if (status === "loading") {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-56" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-72" />
      </div>
    )
  }

  const firstName = user?.name.split(" ")[0] ?? "there"
  const analyticsView = can(user, "analytics:view")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {analyticsView
            ? "Site overview across all content."
            : "Your posts and activity."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {analyticsView ? (
          <>
            <StatSkeleton label="Total views" />
            <StatSkeleton label="Views (7 days)" />
            <StatSkeleton label="Published posts" />
            <StatSkeleton label="Drafts" />
          </>
        ) : (
          <>
            <StatSkeleton label="My posts" />
            <StatSkeleton label="Drafts" />
            <StatSkeleton label="In review" />
            <StatSkeleton label="Published" />
          </>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-3 rounded-xl border p-5">
          <p className="text-sm font-medium">
            {analyticsView ? "Views, last 7 days" : "Recent drafts"}
          </p>
          <Skeleton className="h-56" />
        </div>
        <div className="space-y-3 rounded-xl border p-5">
          <p className="text-sm font-medium">
            {analyticsView ? "Trending now" : "Quick actions"}
          </p>
          {analyticsView ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-9" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                href="/dashboard/posts/new"
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                New post
              </Link>
              <Link
                href="/dashboard/posts"
                className="inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm font-medium transition-colors hover:bg-accent"
              >
                My posts
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatSkeleton({ label }: { label: string }) {
  return (
    <div className="space-y-2 rounded-xl border p-5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <Skeleton className="h-8 w-20" />
    </div>
  )
}
