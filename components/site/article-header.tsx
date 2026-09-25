import Image from "next/image"
import Link from "next/link"
import { IconCalendar } from "@tabler/icons-react"

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
            className="inline-flex items-center rounded-full bg-primary px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
          >
            {post.category_name}
          </Link>
        ) : null}
        <h1 className="mt-4 text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <Link
            href={`/authors/${post.author_id}`}
            className="group flex items-center gap-2.5"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary transition-colors group-hover:bg-primary/25">
              {initials(post.author_name)}
            </span>
            <span className="font-medium text-foreground/80 underline-offset-4 transition-colors group-hover:text-primary group-hover:underline">
              {post.author_name}
            </span>
          </Link>
          {post.published_at ? (
            <span className="flex items-center gap-1.5">
              <IconCalendar className="h-4 w-4 text-primary/70" />
              <Time date={post.published_at} variant="full" />
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
