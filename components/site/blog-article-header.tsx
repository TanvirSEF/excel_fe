import Link from "next/link"
import { format, isValid } from "date-fns"

import type { PostDetail } from "@/types/api"

function formatDate(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null
  const parsed = new Date(dateStr)
  if (!isValid(parsed)) return null
  return format(parsed, "MMMM d, yyyy")
}

export function BlogArticleHeader({ post }: { post: PostDetail }) {
  const dateStr = post.updated_at || post.published_at
  const lastUpdated = formatDate(dateStr)

  return (
    <header>
      {post.category_name && post.category_slug ? (
        <Link
          href={`/categories/${post.category_slug}`}
          className="inline-flex items-center rounded-full bg-primary px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
        >
          {post.category_name}
        </Link>
      ) : null}
      <h1 className="mt-4 text-balance text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
        {post.title}
      </h1>
      {post.meta_description || post.excerpt ? (
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
          {post.meta_description || post.excerpt}
        </p>
      ) : null}
      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground sm:gap-x-6">
        <div className="flex items-center gap-1.5">
          <span>Written by:</span>
          {post.author_id ? (
            <Link
              href={`/authors/${post.author_id}`}
              className="font-medium text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              {post.author_name}
            </Link>
          ) : (
            <span className="font-medium text-foreground">{post.author_name}</span>
          )}
        </div>

        {lastUpdated && dateStr ? (
          <div className="flex items-center gap-1.5">
            <span aria-hidden className="hidden text-border sm:inline">
              •
            </span>
            <span>Last Updated:</span>
            <time
              dateTime={new Date(dateStr).toISOString()}
              className="font-medium text-foreground"
            >
              {lastUpdated}
            </time>
          </div>
        ) : null}
      </div>
    </header>
  )
}
