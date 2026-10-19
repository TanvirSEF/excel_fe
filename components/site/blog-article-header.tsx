import Image from "next/image"
import Link from "next/link"
import { format, isValid } from "date-fns"

import { toCdnUrl } from "@/lib/blocks"
import type { PostDetail } from "@/types/api"

function formatDate(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null
  const parsed = new Date(dateStr)
  if (!isValid(parsed)) return null
  return format(parsed, "MMMM d, yyyy")
}

interface BlogArticleHeaderProps {
  post: PostDetail
  authorAvatarUrl?: string | null
}

export function BlogArticleHeader({
  post,
  authorAvatarUrl,
}: BlogArticleHeaderProps) {
  const dateStr = post.updated_at || post.published_at
  const lastUpdated = formatDate(dateStr)
  const avatarSrc = authorAvatarUrl
    ? toCdnUrl(encodeURI(decodeURI(authorAvatarUrl)))
    : null

  return (
    <header>
      {post.category_name && post.category_slug ? (
        <Link
          href={`/category/${post.category_slug}`}
          className="inline-flex items-center rounded-full bg-primary px-3.5 py-1.5 text-xs sm:text-[13px] font-bold uppercase tracking-wider text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
        >
          {post.category_name}
        </Link>
      ) : null}
      <h1 className="mt-4 text-balance text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
        {post.title}
      </h1>
      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[15px] sm:text-base text-muted-foreground sm:gap-x-6">
        <div className="flex items-center gap-2">
          <span>Written by:</span>
          {post.author_id ? (
            <Link
              href={`/author/${post.author_slug || post.author_id}/`}
              className="group inline-flex items-center gap-2 font-medium text-foreground transition-colors hover:text-primary"
            >
              {avatarSrc ? (
                <span className="relative flex h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-border/80 transition-all group-hover:ring-primary/60">
                  <Image
                    src={avatarSrc}
                    alt={post.author_name}
                    width={28}
                    height={28}
                    className="h-full w-full object-cover"
                  />
                </span>
              ) : null}
              <span className="underline-offset-4 group-hover:underline">
                {post.author_name}
              </span>
            </Link>
          ) : (
            <span className="inline-flex items-center gap-2 font-medium text-foreground">
              {avatarSrc ? (
                <span className="relative flex h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-border/80">
                  <Image
                    src={avatarSrc}
                    alt={post.author_name}
                    width={28}
                    height={28}
                    className="h-full w-full object-cover"
                  />
                </span>
              ) : null}
              <span>{post.author_name}</span>
            </span>
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

