"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

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

type CommentFormValues = z.infer<typeof commentSchema>

interface CommentFormProps {
  postId: string
  replyTo: Comment | null
  onCancelReply: () => void
}

export function CommentForm({
  postId,
  replyTo,
  onCancelReply,
}: CommentFormProps) {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: { user_name: "", user_email: "", comment_text: "" },
  })

  async function onSubmit(values: CommentFormValues) {
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
      onCancelReply()
      reset()
    } catch (error) {
      if (error instanceof ApiClientError) {
        if (error.retryAfter) {
          toast.error(`${error.message} — try again in ${error.retryAfter}s`, {
            duration: error.retryAfter * 1000,
          })
        } else {
          toast.error(error.message)
        }
      } else {
        toast.error("Could not post the comment. Please try again.")
      }
    }
  }

  return (
    <>
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
            onClick={onCancelReply}
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
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
              className="w-full rounded-md border border-input bg-background p-2 text-sm shadow-xs focus:ring-2 focus:ring-ring/50 focus:outline-none"
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
    </>
  )
}
