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
            <h2 className="text-sm font-bold tracking-tight text-primary-foreground">
              Related Articles
            </h2>
          </div>
          {categorySlug ? (
            <Link
              href={`/categories/${categorySlug}`}
              className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold text-primary-foreground backdrop-blur-xs transition-colors hover:bg-white/25"
            >
              <span>See all</span>
              <IconArrowRight className="h-3 w-3" />
            </Link>
          ) : null}
        </div>
        {categoryName ? (
          <p className="mt-1.5 text-xs text-primary-foreground/80 line-clamp-1">
            More guides from <span className="font-semibold text-primary-foreground">{categoryName}</span>
          </p>
        ) : null}
      </div>

      {/* Article Cards List */}
      <ul className="divide-y divide-border/60">
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
                    <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-primary/70">
                      Excel
                    </span>
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                {post.category ? (
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-primary truncate">
                    {post.category.name}
                  </span>
                ) : null}
                <h3 className="mt-0.5 line-clamp-2 text-xs font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                  {post.title}
                </h3>
                <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
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

      {/* Footer Link */}
      {categorySlug ? (
        <div className="border-t border-border/60 bg-muted/20 p-2.5 text-center">
          <Link
            href={`/categories/${categorySlug}`}
            className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:underline"
          >
            <span>Explore all in {categoryName ?? "this category"}</span>
            <IconArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : null}
    </aside>
  )
}
