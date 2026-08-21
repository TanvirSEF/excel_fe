"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"

import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { EmptyState } from "@/components/shared/empty-state"
import { ErrorState } from "@/components/shared/error-state"
import { Time } from "@/components/shared/time"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import {
  useCommentsQueue,
  useDeleteComment,
  useModerateComment,
} from "@/lib/queries/comments"
import type { CommentAdminItem, CommentStatus } from "@/types/api"

const STATUS_TABS: { value: CommentStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "spam", label: "Spam" },
  { value: "rejected", label: "Rejected" },
]

export function CommentsView() {
  const [status, setStatus] = useState<CommentStatus>("pending")
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [busy, setBusy] = useState(false)

  const { data, isPending, isError, refetch } = useCommentsQueue({
    status,
    page,
  })
  const moderate = useModerateComment()
  const deleteComment = useDeleteComment()

  const items = data?.items ?? []
  const totalPages = data?.total_pages ?? 1

  async function run(action: () => Promise<unknown>, message: string) {
    try {
      await action()
      toast.success(message)
    } catch (error) {
      toast.error(
        error instanceof Error && error.message
          ? error.message
          : "Action failed. Please try again."
      )
    }
  }

  async function onModerate(
    comment: CommentAdminItem,
    next: CommentStatus
  ) {
    await run(
      () => moderate.mutateAsync({ commentId: comment.id, status: next }),
      next === "approved"
        ? "Comment approved."
        : next === "spam"
          ? "Comment marked as spam."
          : "Comment rejected."
    )
    setSelected((current) => {
      const next2 = new Set(current)
      next2.delete(comment.id)
      return next2
    })
  }

  async function onDelete(comment: CommentAdminItem) {
    await run(
      () => deleteComment.mutateAsync(comment.id),
      "Comment deleted."
    )
    setSelected((current) => {
      const nextSet = new Set(current)
      nextSet.delete(comment.id)
      return nextSet
    })
  }

  async function onBulkApprove() {
    if (selected.size === 0) return
    setBusy(true)
    let approved = 0
    for (const commentId of selected) {
      try {
        await moderate.mutateAsync({ commentId, status: "approved" })
        approved += 1
      } catch {
        continue
      }
    }
    setBusy(false)
    setSelected(new Set())
    toast.success(`${approved} comment${approved === 1 ? "" : "s"} approved.`)
  }

  function toggle(commentId: string) {
    setSelected((current) => {
      const next = new Set(current)
      if (next.has(commentId)) next.delete(commentId)
      else next.add(commentId)
      return next
    })
  }

  const allChecked =
    items.length > 0 && items.every((item) => selected.has(item.id))

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Comments</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Moderate reader comments before they appear publicly.
          </p>
        </div>
        {status === "pending" && selected.size > 0 ? (
          <Button
            type="button"
            size="sm"
            disabled={busy}
            onClick={onBulkApprove}
          >
            {busy
              ? "Approving…"
              : `Approve selected (${selected.size})`}
          </Button>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-1 border-b pb-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => {
              setStatus(tab.value)
              setPage(1)
              setSelected(new Set())
            }}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm transition-colors",
              status === tab.value
                ? "bg-accent font-medium text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isError ? (
        <ErrorState
          title="Could not load comments"
          message="The comments service did not respond. Try again."
          action={
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      ) : isPending ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title={`No ${status} comments`}
          description="New comments waiting for moderation will show up here."
        />
      ) : (
        <ul className="space-y-3">
          {items.map((comment) => (
            <li key={comment.id} className="rounded-xl border p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 text-sm">
                    <span className="font-medium">{comment.user_name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {comment.user_email}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    on{" "}
                    <Link
                      href={`/blog/${comment.post_slug}`}
                      className="underline-offset-2 hover:underline"
                    >
                      {comment.post_title}
                    </Link>{" "}
                    · <Time date={comment.created_at} variant="relative" />
                  </p>
                  <p className="mt-3 text-sm leading-relaxed">
                    {comment.comment_text}
                  </p>
                </div>
                {status === "pending" ? (
                  <input
                    type="checkbox"
                    aria-label={`Select comment by ${comment.user_name}`}
                    checked={selected.has(comment.id)}
                    onChange={() => toggle(comment.id)}
                    className="mt-1 size-4 shrink-0 accent-primary"
                  />
                ) : null}
              </div>

              <div className="mt-3 flex flex-wrap gap-2 border-t pt-3">
                {comment.status !== "approved" ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onModerate(comment, "approved")}
                  >
                    Approve
                  </Button>
                ) : null}
                {comment.status !== "spam" ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onModerate(comment, "spam")}
                  >
                    Spam
                  </Button>
                ) : null}
                {comment.status !== "rejected" ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onModerate(comment, "rejected")}
                  >
                    Reject
                  </Button>
                ) : null}
                <ConfirmDialog
                  trigger={
                    <Button type="button" variant="outline" size="sm">
                      Delete
                    </Button>
                  }
                  title="Delete this comment?"
                  description={`By ${comment.user_name} on "${comment.post_title}". This cannot be undone.`}
                  confirmLabel="Delete"
                  onConfirm={() => onDelete(comment)}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-muted-foreground">
          {status === "pending" && items.length > 0 ? (
            <>
              <input
                type="checkbox"
                aria-label="Select all pending comments on this page"
                checked={allChecked}
                onChange={() =>
                  setSelected(
                    allChecked
                      ? new Set()
                      : new Set(items.map((item) => item.id))
                  )
                }
                className="size-4 accent-primary"
              />
              Select all
            </>
          ) : null}
        </label>
        {totalPages > 1 ? (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">
              Page {page} of {totalPages}
            </span>
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
        ) : null}
      </div>
    </div>
  )
}
