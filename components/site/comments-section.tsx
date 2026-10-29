"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"

import { Time } from "@/components/shared/time"
import { cn } from "@/lib/utils"
import type { Comment } from "@/types/api"

const CommentForm = dynamic(
  () => import("./comment-form").then((mod) => mod.CommentForm),
  { ssr: false }
)

interface CommentsSectionProps {
  postId: string
  comments: Comment[]
  className?: string
}

function useNearViewport<T extends Element>() {
  const ref = useRef<T>(null)
  const [near, setNear] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true)
          observer.disconnect()
        }
      },
      { rootMargin: "600px" }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return [ref, near] as const
}

export function CommentsSection({
  postId,
  comments,
  className,
}: CommentsSectionProps) {
  const [replyTo, setReplyTo] = useState<Comment | null>(null)
  const [formRef, formNear] = useNearViewport<HTMLDivElement>()

  const topLevel = comments.filter((comment) => !comment.parent_id)

  return (
    <section className={cn("mt-12 border-t pt-8", className)}>
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

      <div
        ref={formRef}
        id="comment-form"
        className="mt-10 min-h-[22rem] rounded-xl border bg-muted/30 p-5"
      >
        {formNear ? (
          <CommentForm
            postId={postId}
            replyTo={replyTo}
            onCancelReply={() => setReplyTo(null)}
          />
        ) : null}
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
