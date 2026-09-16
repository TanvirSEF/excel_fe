import Image from "next/image"
import Link from "next/link"

import { Time } from "@/components/shared/time"
import { cn } from "@/lib/utils"
import type { PostListItem } from "@/types/api"

import { postHref } from "./post-card"
import { SectionHeading } from "./section-heading"

interface TrendingSectionProps {
  posts: PostListItem[]
  className?: string
}

export function TrendingSection({ posts, className }: TrendingSectionProps) {
  if (posts.length === 0) return null

  return (
    <section className={cn(className)}>
      <SectionHeading
        title="Trending Tutorials"
        subtitle="Top formula breakdowns and spreadsheet guides most read this week."
        badge="Popular this week"
        action={{ label: "View all tutorials", href: "/blog" }}
      />

      <ol className="divide-y divide-border/70">
        {posts.map((post, index) => (
          <li key={post.slug}>
            <Link
              href={postHref(post)}
              className="group -mx-3 flex items-center gap-4 rounded-xl px-3 py-5 transition-colors hover:bg-primary/4 sm:gap-6"
            >
              <span className="w-10 shrink-0 text-right font-mono text-2xl font-bold tabular-nums text-primary/25 transition-colors group-hover:text-primary sm:text-3xl">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="min-w-0 flex-1">
                {post.category ? (
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                    {post.category.name}
                  </span>
                ) : null}

                <h3 className="mt-1 line-clamp-2 text-base font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-lg">
                  {post.title}
                </h3>

                {post.excerpt ? (
                  <p className="mt-1.5 line-clamp-1 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                ) : null}

                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  {post.published_at ? <Time date={post.published_at} variant="date" /> : null}
                  {post.reading_time_minutes ? (
                    <>
                      <span aria-hidden>·</span>
                      <span>{post.reading_time_minutes} min read</span>
                    </>
                  ) : null}
                </div>
              </div>

              <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border border-border/40 bg-muted sm:h-[4.5rem] sm:w-28">
                {post.featured_image_url ? (
                  <Image
                    src={post.featured_image_url}
                    alt={post.title}
                    fill
                    sizes="112px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/15 via-primary/5 to-muted">
                    <span className="font-mono text-[9px] font-semibold uppercase tracking-wider text-primary/70">
                      Excel Insider
                    </span>
                  </div>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}
