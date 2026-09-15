import Link from "next/link"
import { IconCalendar } from "@tabler/icons-react"

import { Time } from "@/components/shared/time"
import type { PostDetail } from "@/types/api"

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("")
}

export function BlogArticleHeader({ post }: { post: PostDetail }) {
  return (
    <header>
      {post.category_name && post.category_slug ? (
        <Link
          href={`/categories/${post.category_slug}`}
          className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-primary transition-colors hover:bg-primary/15"
        >
          {post.category_name}
        </Link>
      ) : null}
      <h1 className="mt-4 text-balance text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
        {post.title}
      </h1>
      {post.excerpt ? (
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
      ) : null}
      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <span className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">
            {initials(post.author_name)}
          </span>
          <span className="font-semibold text-foreground">{post.author_name}</span>
        </span>
        {post.published_at ? (
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <IconCalendar className="h-4 w-4 text-primary/70" />
            <Time date={post.published_at} variant="full" />
          </span>
        ) : null}
      </div>
    </header>
  )
}
