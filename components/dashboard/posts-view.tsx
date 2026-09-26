"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { IconPlus, IconX } from "@tabler/icons-react"
import { toast } from "sonner"

import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { EmptyState } from "@/components/shared/empty-state"
import { ErrorState } from "@/components/shared/error-state"
import { PostsTable } from "@/components/dashboard/posts-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { can, useAuthStore } from "@/lib/auth"
import { flattenCategories } from "@/lib/category-tree"
import { useCategories } from "@/lib/queries/categories"
import { useAdminPosts, useDeletePost, useSetTrendingPin } from "@/lib/queries/posts"
import { useAuthorOptions } from "@/lib/queries/users"
import { ApiClientError } from "@/lib/api/error"
import type { PostAdminItem, PostStatus } from "@/types/api"

const STATUS_TABS: { value: PostStatus | undefined; label: string }[] = [
  { value: undefined, label: "All" },
  { value: "draft", label: "Drafts" },
  { value: "pending_review", label: "In review" },
  { value: "published", label: "Published" },
  { value: "rejected", label: "Rejected" },
  { value: "scheduled", label: "Scheduled" },
]

const PAGE_SIZE = 10

export function PostsView() {
  const [status, setStatus] = useState<PostStatus | undefined>(undefined)
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined)
  const [authorId, setAuthorId] = useState<string | undefined>(undefined)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [pendingDelete, setPendingDelete] = useState<PostAdminItem | null>(
    null
  )

  const user = useAuthStore((state) => state.user)
  const canDelete = can(user, "posts:delete")
  const canCreate = can(user, "posts:manage")
  const canPin = can(user, "posts:publish")
  const isTechnicalWriter = user?.role === "technical_writer"

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim())
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const { data: categories } = useCategories()
  const { data: authors } = useAuthorOptions(!isTechnicalWriter)
  const flatCategories = categories ? flattenCategories(categories) : []

  const { data, isPending, isError, error, refetch } = useAdminPosts({
    status,
    categoryId,
    authorId,
    search: debouncedSearch || undefined,
    page,
    page_size: PAGE_SIZE,
  })

  const deletePost = useDeletePost()
  const pinPost = useSetTrendingPin()

  const items = data?.items ?? []
  const hasActiveFilters = Boolean(
    status !== undefined || categoryId || authorId || search.trim()
  )

  async function onConfirmDelete() {
    if (!pendingDelete) return
    try {
      await deletePost.mutateAsync(pendingDelete.id)
      toast.success(`Deleted "${pendingDelete.title}"`)
      setPendingDelete(null)
    } catch (cause) {
      const message =
        cause instanceof ApiClientError
          ? cause.message
          : "Could not delete the post."
      toast.error(message)
      throw cause
    }
  }

  async function onTogglePin(post: PostAdminItem, pinned: boolean) {
    try {
      await pinPost.mutateAsync({ postId: post.id, pinned })
      toast.success(
        pinned
          ? `Pinned "${post.title}" to trending`
          : `Unpinned "${post.title}"`
      )
    } catch (cause) {
      const message =
        cause instanceof ApiClientError
          ? cause.message
          : "Could not update trending."
      toast.error(message)
    }
  }

  function handleResetFilters() {
    setStatus(undefined)
    setCategoryId(undefined)
    setAuthorId(undefined)
    setSearch("")
    setDebouncedSearch("")
    setPage(1)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.label}
                type="button"
                onClick={() => {
                  setStatus(tab.value)
                  setPage(1)
                }}
                className={
                  status === tab.value
                    ? "rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
                    : "rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                }
              >
                {tab.label}
              </button>
            ))}
          </div>

          {canCreate ? (
            <Button asChild size="sm" className="h-9">
              <Link href="/dashboard/posts/new">
                <IconPlus className="h-4 w-4" />
                New post
              </Link>
            </Button>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Input
            type="search"
            placeholder="Search posts by title…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-9 w-full sm:w-64"
          />

          <select
            aria-label="Filter by category"
            value={categoryId ?? ""}
            onChange={(event) => {
              setCategoryId(event.target.value || undefined)
              setPage(1)
            }}
            className="h-9 max-w-[200px] truncate rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
          >
            <option value="">All categories</option>
            {flatCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {"— ".repeat(cat.depth)}
                {cat.name}
              </option>
            ))}
          </select>

          {!isTechnicalWriter ? (
            <select
              aria-label="Filter by author"
              value={authorId ?? ""}
              onChange={(event) => {
                setAuthorId(event.target.value || undefined)
                setPage(1)
              }}
              className="h-9 max-w-[200px] truncate rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
            >
              <option value="">All authors</option>
              {authors?.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name || author.email}
                </option>
              ))}
            </select>
          ) : null}

          {hasActiveFilters ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="h-9 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <IconX className="mr-1 h-3.5 w-3.5" />
              Reset filters
            </Button>
          ) : null}
        </div>
      </div>

      {isPending ? (
        <div className="space-y-2 rounded-xl border p-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-10" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          title="Could not load posts"
          message={
            error instanceof ApiClientError
              ? error.message
              : "Something went wrong."
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
      ) : items.length === 0 ? (
        <EmptyState
          title={hasActiveFilters ? "No matching posts" : "No posts here yet"}
          description={
            hasActiveFilters
              ? "Try adjusting your filters or search term."
              : "Posts will appear here once they're created."
          }
          action={
            !hasActiveFilters && canCreate ? (
              <Button asChild size="sm">
                <Link href="/dashboard/posts/new">
                  <IconPlus className="h-4 w-4" />
                  Create a post
                </Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <PostsTable
          posts={items}
          canDelete={canDelete}
          onDelete={setPendingDelete}
          canPin={canPin}
          onTogglePin={onTogglePin}
        />
      )}

      {data && data.total_pages > 1 ? (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {data.page} of {data.total_pages} · {data.total} total
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => current - 1)}
              disabled={page <= 1}
              className="inline-flex h-9 items-center rounded-md border px-4 text-sm transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((current) => current + 1)}
              disabled={page >= data.total_pages}
              className="inline-flex h-9 items-center rounded-md border px-4 text-sm transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null)
        }}
        title={`Delete "${pendingDelete?.title ?? ""}"?`}
        description="This is a soft delete — the post is hidden but not permanently removed."
        confirmLabel="Delete"
        onConfirm={onConfirmDelete}
      />
    </div>
  )
}
