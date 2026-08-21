import Image from "next/image"

import { Time } from "@/components/shared/time"
import type { PostDetail } from "@/types/api"

export function ArticleHeader({ post }: { post: PostDetail }) {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span className="font-medium text-foreground/80">
            {post.author_name}
          </span>
          {post.published_at ? (
            <>
              <span aria-hidden>·</span>
              <Time date={post.published_at} variant="full" />
            </>
          ) : null}
          {post.reading_time_minutes ? (
            <>
              <span aria-hidden>·</span>
              <span>{post.reading_time_minutes} min read</span>
            </>
          ) : null}
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
