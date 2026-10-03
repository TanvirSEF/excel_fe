import Image from "next/image"
import Link from "next/link"
import { IconArticle, IconArrowRight } from "@tabler/icons-react"

import { Time } from "@/components/shared/time"
import type { PostListItem } from "@/types/api"

import { postHref } from "./post-card"

interface ArticleRelatedSidebarProps {
  posts: PostListItem[]
  categoryName: string | null
  categorySlug: string | null
}

export function ArticleRelatedSidebar({
  posts,
  categoryName,
  categorySlug,
}: ArticleRelatedSidebarProps) {
  if (posts.length === 0) return null

  return (
    <aside
      aria-label="Related articles"
      className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs"
    >
      {/* Theme Header */}
      <div className="bg-primary px-4 py-3.5 text-primary-foreground">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 text-primary-foreground backdrop-blur-xs">
              <IconArticle className="h-4 w-4" />
            </span>
            <h2 className="text-base font-bold tracking-tight text-primary-foreground">
              Related Articles
            </h2>
          </div>
          <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold tracking-tight text-primary-foreground backdrop-blur-xs">
            {posts.length} {posts.length === 1 ? "guide" : "guides"}
          </span>
        </div>
        {categoryName && categorySlug ? (
          <p className="mt-2 text-[13px] text-primary-foreground/85">
            More guides from{" "}
            <Link
              href={`/categories/${categorySlug}`}
              className="inline-flex items-center gap-1 font-semibold text-primary-foreground underline decoration-white/40 underline-offset-2 transition-colors hover:decoration-white hover:text-white"
            >
              <span>{categoryName}</span>
              <IconArrowRight className="h-3 w-3 inline" />
            </Link>
          </p>
        ) : categoryName ? (
          <p className="mt-1.5 text-[13px] text-primary-foreground/80 line-clamp-1">
            More guides from <span className="font-semibold text-primary-foreground">{categoryName}</span>
          </p>
        ) : null}
      </div>

      {/* Article Cards List with Scrollbar */}
      <ul className="divide-y divide-border/60 max-h-[460px] overflow-y-auto overscroll-contain pr-0.5 [scrollbar-width:thin] [scrollbar-color:var(--color-primary-40)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary/20 hover:[&::-webkit-scrollbar-thumb]:bg-primary/40">
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              href={postHref(post)}
              className="group flex items-start gap-3 p-3.5 transition-colors hover:bg-muted/50"
            >
              <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-border/50 bg-muted">
                {post.featured_image_url ? (
                  <Image
                    src={post.featured_image_url}
                    alt={post.title}
                    fill
                    sizes="80px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/15 via-primary/5 to-muted">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary/70">
                      Excel
                    </span>
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                {post.category ? (
                  <span className="block text-xs font-semibold uppercase tracking-wider text-primary truncate">
                    {post.category.name}
                  </span>
                ) : null}
                <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                  {post.title}
                </h3>
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  {post.published_at ? (
                    <Time date={post.published_at} variant="date" />
                  ) : null}
                  {post.reading_time_minutes ? (
                    <>
                      <span aria-hidden className="text-border">·</span>
                      <span>{post.reading_time_minutes}m read</span>
                    </>
                  ) : null}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}
