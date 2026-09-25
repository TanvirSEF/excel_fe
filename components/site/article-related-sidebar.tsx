import Image from "next/image"
import Link from "next/link"
import { IconArrowRight } from "@tabler/icons-react"

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
    <aside aria-label="Related articles">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-base font-bold tracking-tight text-foreground">
          {categoryName ? `More on ${categoryName}` : "Related Articles"}
        </h2>
        {categorySlug && (
          <Link
            href={`/categories/${categorySlug}`}
            className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary hover:underline underline-offset-2"
          >
            See all
            <IconArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>

      <ul className="space-y-3">
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              href={postHref(post)}
              className="group flex gap-3 rounded-xl border border-border/60 bg-card p-3 transition-all duration-200 hover:border-primary/50 hover:shadow-sm"
            >
              <div className="relative h-[3.75rem] w-[4.75rem] shrink-0 overflow-hidden rounded-lg border border-border/40 bg-muted">
                {post.featured_image_url ? (
                  <Image
                    src={post.featured_image_url}
                    alt={post.title}
                    fill
                    sizes="76px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-primary/5 to-muted" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                {post.category && (
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-primary">
                    {post.category.name}
                  </span>
                )}
                <h3 className="mt-0.5 line-clamp-2 text-[0.8125rem] font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                  {post.title}
                </h3>
                {post.published_at && (
                  <div className="mt-1 text-[11px] text-muted-foreground">
                    <Time date={post.published_at} variant="date" />
                  </div>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}
