"use client"

import { useState } from "react"
import { format } from "date-fns"
import { toast } from "sonner"

import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { ApiClientError } from "@/lib/api/error"
import {
  usePublishPost,
  useRejectPost,
  useSchedulePost,
  useSubmitReview,
} from "@/lib/queries/posts"
import type { PostStatus } from "@/types/api"

interface WorkflowActionsProps {
  postId: string
  status: PostStatus
  scheduledAt: string | null
  canPublish: boolean
  isOwner: boolean
  title: string
  onBeforeAction: () => Promise<boolean>
}

export function WorkflowActions({
  postId,
  status,
  scheduledAt,
  canPublish,
  isOwner,
  title,
  onBeforeAction,
}: WorkflowActionsProps) {
  const [publishOpen, setPublishOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [busy, setBusy] = useState(false)

  const submitReview = useSubmitReview(postId)
  const publish = usePublishPost(postId)
  const reject = useRejectPost(postId)
  const schedule = useSchedulePost(postId)

  const showSubmit =
    isOwner && (status === "draft" || status === "rejected")
  const showReviewActions = canPublish && status === "pending_review"

  async function guard(action: () => Promise<unknown>, message: string) {
    setBusy(true)
    try {
      if (!(await onBeforeAction())) return
      await action()
      toast.success(message)
    } catch (error) {
      toast.error(
        error instanceof ApiClientError
          ? error.message
          : "Action failed. Please try again."
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {status === "scheduled" && scheduledAt ? (
        <span className="text-xs text-muted-foreground">
          Goes live {format(new Date(scheduledAt), "dd MMM yyyy, HH:mm")}
        </span>
      ) : null}

      {showSubmit ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() =>
            guard(
              () => submitReview.mutateAsync(),
              "Submitted for review."
            )
          }
        >
          Submit for review
        </Button>
      ) : null}

      {showReviewActions ? (
        <>
          <Button
            type="button"
            size="sm"
            disabled={busy}
            onClick={() => setPublishOpen(true)}
          >
            Publish
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={() => setScheduleOpen(true)}
          >
            Schedule…
          </Button>
        </>
      ) : null}

      {showReviewActions ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => setRejectOpen(true)}
        >
          Reject…
        </Button>
      ) : null}

      <ConfirmDialog
        open={publishOpen}
        onOpenChange={setPublishOpen}
        title="Publish this post?"
        description={`"${title}" will go live immediately.`}
        confirmLabel="Publish"
        destructive={false}
        onConfirm={async () => {
          await publish.mutateAsync()
          toast.success("Post published.")
        }}
      />

      <RejectDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        pending={busy}
        onConfirm={(reason) => reject.mutateAsync(reason)}
      />

      <ScheduleDialog
        open={scheduleOpen}
        onOpenChange={setScheduleOpen}
        scheduledAt={scheduledAt}
        onConfirm={(isoDate) => schedule.mutateAsync(isoDate)}
      />
    </div>
  )
}

interface RejectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pending: boolean
  onConfirm: (reason: string) => Promise<unknown>
}

function RejectDialog({ open, onOpenChange, pending, onConfirm }: RejectDialogProps) {
  const [reason, setReason] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleConfirm() {
    setSubmitting(true)
    try {
      await onConfirm(reason.trim())
      onOpenChange(false)
      setReason("")
      toast.success("Post sent back to the writer.")
    } finally {
      setSubmitting(false)
    }
  }

  const busy = pending || submitting

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reject this post?</AlertDialogTitle>
          <AlertDialogDescription>
            The reason is shown to the writer as a banner on their draft.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2">
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            rows={4}
            maxLength={500}
            placeholder="What needs to change?"
            autoFocus
            className="w-full rounded-md border border-input bg-background p-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-ring/50"
          />
          <p
            className={`text-xs ${reason.length > 450 ? "text-destructive" : "text-muted-foreground"}`}
          >
            {reason.length}/500 — required
          </p>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault()
              if (reason.trim()) handleConfirm()
            }}
            disabled={busy || !reason.trim()}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {busy ? "Rejecting…" : "Reject post"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

interface ScheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  scheduledAt: string | null
  onConfirm: (isoDate: string) => Promise<unknown>
}

function ScheduleDialog({
  open,
  onOpenChange,
  scheduledAt,
  onConfirm,
}: ScheduleDialogProps) {
  const [value, setValue] = useState("")
  const [pending, setPending] = useState(false)

  const initial = scheduledAt
    ? format(new Date(scheduledAt), "yyyy-MM-dd'T'HH:mm")
    : ""
  const chosen = value || initial

  async function handleConfirm() {
    setPending(true)
    try {
      await onConfirm(new Date(chosen).toISOString())
      onOpenChange(false)
      toast.success("Post scheduled.")
    } finally {
      setPending(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Schedule this post</AlertDialogTitle>
          <AlertDialogDescription>
            It publishes automatically at the chosen time.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2">
          <input
            type="datetime-local"
            value={chosen}
            onChange={(event) => setValue(event.target.value)}
            min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault()
              if (chosen) handleConfirm()
            }}
            disabled={pending || !chosen}
          >
            {pending ? "Scheduling…" : "Schedule"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
