import Image from "next/image"
import Link from "next/link"

import { Time } from "@/components/shared/time"
import { cn } from "@/lib/utils"
import type { PostListItem } from "@/types/api"

interface PostCardProps {
  post: PostListItem
  className?: string
}

export function PostCard({ post, className }: PostCardProps) {
  return (
    <article
      className={cn(
        "group overflow-hidden rounded-xl border bg-card transition-colors hover:border-primary/40",
        className
      )}
    >
      <Link href={`/blog/${post.slug}`} className="flex flex-col gap-3 p-3">
        <div className="relative aspect-video overflow-hidden rounded-lg">
          {post.featured_image_url ? (
            <Image
              src={post.featured_image_url}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-primary/15 via-primary/5 to-transparent transition-transform duration-300 group-hover:scale-[1.03]" />
          )}
        </div>

        <div className="flex flex-col gap-1.5 px-1 pb-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {post.is_trending ? (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
                Trending
              </span>
            ) : null}
            {post.reading_time_minutes ? (
              <span>{post.reading_time_minutes} min read</span>
            ) : null}
            {post.published_at ? (
              <>
                {post.reading_time_minutes ? <span aria-hidden>·</span> : null}
                <Time date={post.published_at} variant="date" />
              </>
            ) : null}
          </div>

          <h3 className="font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary">
            {post.title}
          </h3>

          {post.excerpt ? (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {post.excerpt}
            </p>
          ) : null}
        </div>
      </Link>
    </article>
  )
}
