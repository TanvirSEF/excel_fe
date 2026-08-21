"use client"

import Link from "next/link"

import { ErrorState } from "@/components/shared/error-state"
import { Time } from "@/components/shared/time"
import { Skeleton } from "@/components/ui/skeleton"
import { ApiClientError } from "@/lib/api/error"
import { useAdminPosts } from "@/lib/queries/posts"
import type { PostAdminItem, PostStatus } from "@/types/api"

export function WriterOverview() {
  const { data, isPending, isError, error, refetch } = useAdminPosts({
    page_size: 50,
  })

  if (isPending) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-56" />
      </div>
    )
  }

  if (isError) {
    return (
      <ErrorState
        title="Could not load your posts"
        message={
          error instanceof ApiClientError ? error.message : undefined
        }
        action={
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Try again
          </button>
        }
      />
    )
  }

  const counts = countByStatus(data?.items ?? [])
  const drafts = (data?.items ?? [])
    .filter((post) => post.status === "draft")
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="My posts" value={data?.total ?? 0} />
        <StatCard label="Drafts" value={counts.draft} />
        <StatCard label="In review" value={counts.pending_review} />
        <StatCard label="Published" value={counts.published} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-3 rounded-xl border p-5">
          <p className="text-sm font-medium">Recent drafts</p>
          {drafts.length > 0 ? (
            <ul className="divide-y">
              {drafts.map((post) => (
                <li
                  key={post.id}
                  className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0"
                >
                  <Link
                    href={`/dashboard/posts/${post.id}`}
                    className="line-clamp-1 text-sm font-medium hover:text-primary"
                  >
                    {post.title}
                  </Link>
                  <Time
                    date={post.updated_at}
                    variant="relative"
                    className="shrink-0 text-xs text-muted-foreground"
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No drafts yet.</p>
          )}
        </div>

        <div className="space-y-3 rounded-xl border p-5">
          <p className="text-sm font-medium">Quick actions</p>
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
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border p-5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
    </div>
  )
}

function countByStatus(posts: PostAdminItem[]) {
  const result: Record<PostStatus, number> = {
    draft: 0,
    pending_review: 0,
    published: 0,
    rejected: 0,
    scheduled: 0,
  }
  for (const post of posts) {
    result[post.status] += 1
  }
  return result
}
