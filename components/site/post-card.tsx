import Image from "next/image"
import Link from "next/link"
import { IconArrowUpRight, IconFlame } from "@tabler/icons-react"

import { Time } from "@/components/shared/time"
import { isGoogleSheetsCategory } from "@/lib/category-topics"
import { cn } from "@/lib/utils"
import type { PostListItem } from "@/types/api"

interface PostCardProps {
  post: PostListItem
  className?: string
}

export function postHref(
  post: Pick<PostListItem, "slug"> & {
    category?: { slug: string } | null
    canonical_url?: string | null
  }
) {
  let href = post.canonical_url
    ? post.canonical_url.startsWith("/")
      ? post.canonical_url
      : `/${post.canonical_url}`
    : isGoogleSheetsCategory(post.category?.slug)
      ? `/google-sheets/${post.slug}`
      : `/blog/${post.slug}`

  if (!href.endsWith("/")) {
    href += "/"
  }
  return href
}

export function PostCard({ post, className }: PostCardProps) {
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-primary/50 bg-card p-3.5 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/80 hover:shadow-lg",
        className
      )}
    >
      <Link href={postHref(post)} className="flex h-full flex-col">
        {/* Featured Image or Gradient Fallback */}
        <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl border border-border/40 bg-muted">
          {post.featured_image_url ? (
            <Image
              src={post.featured_image_url}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 will-change-transform group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/15 via-primary/5 to-muted">
              <div
                aria-hidden
                className="absolute inset-0 opacity-20 [background-image:radial-gradient(var(--color-primary)_1px,transparent_1px)] [background-size:16px_16px]"
              />
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-primary/70">
                Excel Insider
              </span>
            </div>
          )}

          {/* Trending Badge Overlay */}
          {post.is_trending ? (
            <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-primary/20 bg-background/90 px-2.5 py-1 text-[11px] font-semibold text-primary shadow-xs backdrop-blur-xs">
              <IconFlame className="h-3.5 w-3.5 text-primary" />
              <span>Trending</span>
            </div>
          ) : null}
        </div>

        {/* Card Content */}
        <div className="flex flex-1 flex-col justify-between pt-4">
          <div className="space-y-2">
            {/* Category kicker */}
            {post.category ? (
              <span className="inline-flex line-clamp-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                {post.category.name}
              </span>
            ) : null}

            {/* Title */}
            <h3 className="text-base font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-lg">
              {post.title}
            </h3>

            {/* Description */}
            {post.meta_description || post.excerpt ? (
              <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {post.meta_description || post.excerpt}
              </p>
            ) : null}

            {/* Meta Row */}
            {post.published_at ? (
              <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
                <Time date={post.published_at} variant="date" />
              </div>
            ) : null}
          </div>

          {/* Read article arrow indicator */}
          <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-all duration-200 group-hover:opacity-100">
            <span>Read guide</span>
            <IconArrowUpRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </Link>
    </article>
  )
}
