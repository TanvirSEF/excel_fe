"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Time } from "@/components/shared/time"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiFetch } from "@/lib/api/api-fetch"
import { ApiClientError } from "@/lib/api/error"
import type { Comment } from "@/types/api"

const commentSchema = z.object({
  user_name: z.string().min(1, "Name is required").max(100),
  user_email: z.email("Enter a valid email address"),
  comment_text: z.string().min(1, "Comment is required").max(2000),
})

type CommentForm = z.infer<typeof commentSchema>

interface CommentsSectionProps {
  postId: string
  comments: Comment[]
}

export function CommentsSection({ postId, comments }: CommentsSectionProps) {
  const [replyTo, setReplyTo] = useState<Comment | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CommentForm>({
    resolver: zodResolver(commentSchema),
    defaultValues: { user_name: "", user_email: "", comment_text: "" },
  })

  async function onSubmit(values: CommentForm) {
    try {
      await apiFetch(`/posts/${postId}/comments`, {
        method: "POST",
        body: {
          user_name: values.user_name.trim(),
          user_email: values.user_email.trim(),
          comment_text: values.comment_text.trim(),
          parent_id: replyTo?.id ?? null,
        },
      })
      setSubmitted(true)
      setReplyTo(null)
      reset()
    } catch (error) {
      if (error instanceof ApiClientError) {
        if (error.retryAfter) {
          toast.error(
            `${error.message} — try again in ${error.retryAfter}s`,
            { duration: error.retryAfter * 1000 }
          )
        } else {
          toast.error(error.message)
        }
      } else {
        toast.error("Could not post the comment. Please try again.")
      }
    }
  }

  const topLevel = comments.filter((comment) => !comment.parent_id)

  return (
    <section className="mt-12 border-t pt-8">
      <h2 className="text-lg font-semibold">
        Comments{topLevel.length > 0 ? ` (${countAll(comments)})` : ""}
      </h2>

      {topLevel.length > 0 ? (
        <ul className="mt-6 space-y-6">
          {topLevel.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              depth={0}
              onReply={setReplyTo}
            />
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          No comments yet — be the first to ask a question.
        </p>
      )}

      <div className="mt-10 rounded-xl border bg-muted/30 p-5" id="comment-form">
        {replyTo ? (
          <div className="mb-3 flex items-center justify-between rounded-lg border bg-background px-3 py-2 text-sm">
            <span className="truncate text-muted-foreground">
              Replying to{" "}
              <span className="font-medium text-foreground">
                {replyTo.user_name}
              </span>
            </span>
            <button
              type="button"
              onClick={() => setReplyTo(null)}
              className="text-xs text-muted-foreground underline-offset-2 hover:underline"
            >
              Cancel
            </button>
          </div>
        ) : null}

        {submitted ? (
          <div className="space-y-3 text-center">
            <p className="text-sm font-medium">
              Thanks — your comment is awaiting moderation.
            </p>
            <p className="text-sm text-muted-foreground">
              It will appear here once a moderator approves it.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSubmitted(false)}
            >
              Write another comment
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="comment-name">Name</Label>
                <Input
                  id="comment-name"
                  autoComplete="name"
                  maxLength={100}
                  {...register("user_name")}
                />
                {errors.user_name ? (
                  <p className="text-xs text-destructive">
                    {errors.user_name.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="comment-email">Email</Label>
                <Input
                  id="comment-email"
                  type="email"
                  autoComplete="email"
                  {...register("user_email")}
                />
                {errors.user_email ? (
                  <p className="text-xs text-destructive">
                    {errors.user_email.message}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment-text">Comment</Label>
              <textarea
                id="comment-text"
                rows={4}
                maxLength={2000}
                placeholder="Ask a question or share your take"
                {...register("comment_text")}
                className="w-full rounded-md border border-input bg-background p-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-ring/50"
              />
              {errors.comment_text ? (
                <p className="text-xs text-destructive">
                  {errors.comment_text.message}
                </p>
              ) : null}
            </div>
            <p className="text-xs text-muted-foreground">
              Comments are moderated before they appear. Your email is never
              shown.
            </p>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Posting…" : "Post comment"}
            </Button>
          </form>
        )}
      </div>
    </section>
  )
}

function countAll(comments: Comment[]): number {
  return comments.reduce(
    (total, comment) => total + 1 + countAll(comment.children),
    0
  )
}

function CommentItem({
  comment,
  depth,
  onReply,
}: {
  comment: Comment
  depth: number
  onReply: (comment: Comment) => void
}) {
  return (
    <li className={depth > 0 ? "border-l pl-4" : ""}>
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-sm font-medium">{comment.user_name}</p>
          <Time
            date={comment.created_at}
            variant="relative"
            className="text-xs text-muted-foreground"
          />
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {comment.comment_text}
        </p>
        {depth < 2 ? (
          <button
            type="button"
            onClick={() => {
              onReply(comment)
              document
                .getElementById("comment-form")
                ?.scrollIntoView({ behavior: "smooth", block: "center" })
            }}
            className="mt-2 text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            Reply
          </button>
        ) : null}
      </div>
      {comment.children.length > 0 ? (
        <ul className="mt-3 space-y-3">
          {comment.children.map((child) => (
            <CommentItem
              key={child.id}
              comment={child}
              depth={depth + 1}
              onReply={onReply}
            />
          ))}
        </ul>
      ) : null}
    </li>
  )
}
