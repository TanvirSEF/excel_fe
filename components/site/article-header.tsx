import Image from "next/image"
import Link from "next/link"
import { IconCalendar, IconClock } from "@tabler/icons-react"

import { Time } from "@/components/shared/time"
import { ShareButtons } from "@/components/site/share-buttons"
import type { PostDetail } from "@/types/api"

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("")
}

export function ArticleHeader({ post }: { post: PostDetail }) {
  return (
    <>
      <header className="mb-8">
        {post.category_name && post.category_slug ? (
          <Link
            href={`/categories/${post.category_slug}`}
            className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
          >
            {post.category_name}
          </Link>
        ) : null}
        <h1 className="mt-4 text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
              {initials(post.author_name)}
            </span>
            <span className="font-medium text-foreground/80">
              {post.author_name}
            </span>
          </span>
          {post.published_at ? (
            <span className="flex items-center gap-1.5">
              <IconCalendar className="h-4 w-4 text-primary/70" />
              <Time date={post.published_at} variant="full" />
            </span>
          ) : null}
          {post.reading_time_minutes ? (
            <span className="flex items-center gap-1.5">
              <IconClock className="h-4 w-4 text-primary/70" />
              <span>{post.reading_time_minutes} min read</span>
            </span>
          ) : null}
        </div>
        <div className="mt-5 border-t border-border/60 pt-4">
          <ShareButtons title={post.title} />
        </div>
      </header>

      {post.featured_image_url ? (
        <div className="relative mb-8 aspect-video overflow-hidden rounded-xl border">
          <Image
            src={post.featured_image_url}
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>
      ) : null}
    </>
  )
}
