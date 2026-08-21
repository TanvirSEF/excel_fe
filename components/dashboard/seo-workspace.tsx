"use client"

import { useState } from "react"

import { SeoSheet } from "@/components/editor/seo-sheet"
import { EmptyState } from "@/components/shared/empty-state"
import { ErrorState } from "@/components/shared/error-state"
import { Time } from "@/components/shared/time"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { usePublishedPosts } from "@/lib/queries/posts"

export function SeoWorkspace() {
  const [page, setPage] = useState(1)
  const [seoPostId, setSeoPostId] = useState<string | null>(null)
  const { data, isPending, isError, refetch } = usePublishedPosts(page)

  if (isPending) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-14" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <ErrorState
        title="Could not load published posts"
        message="The posts service did not respond. Try again."
        action={
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try again
          </Button>
        }
      />
    )
  }

  const posts = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / (data?.page_size ?? 10)))

  return (
    <div className="space-y-4">
      <div className="rounded-xl border">
        <div className="hidden border-b px-4 py-2 text-xs font-medium text-muted-foreground sm:grid sm:grid-cols-[minmax(0,1fr)_120px_80px_100px]">
          <span>Post</span>
          <span>Published</span>
          <span>Views</span>
          <span className="text-right">SEO</span>
        </div>
        {posts.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No published posts"
              description="Published posts appear here once the editors release them."
            />
          </div>
        ) : (
          <ul className="divide-y">
            {posts.map((post) => (
              <li
                key={post.id}
                className="grid gap-1 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_120px_80px_100px] sm:items-center sm:gap-2"
              >
                <span className="truncate text-sm font-medium">
                  {post.title}
                </span>
                <Time
                  date={post.published_at}
                  variant="date"
                  className="text-xs text-muted-foreground"
                />
                <span className="text-xs text-muted-foreground">
                  {post.view_count.toLocaleString()}
                </span>
                <div className="sm:text-right">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSeoPostId(post.id)}
                  >
                    Edit SEO
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}

      <SeoSheet
        postId={seoPostId}
        onOpenChange={(open) => !open && setSeoPostId(null)}
      />
    </div>
  )
}
