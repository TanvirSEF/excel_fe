import Image from "next/image"
import Link from "next/link"
import { IconArrowRight, IconBook } from "@tabler/icons-react"

import type { Block } from "@/types/api"

interface InterlinkBlockProps {
  block: Extract<Block, { type: "interlink" }>
}

export function InterlinkBlock({ block }: InterlinkBlockProps) {
  const href =
    block.url.startsWith("http://") ||
    block.url.startsWith("https://") ||
    block.url.startsWith("/")
      ? block.url
      : `/${block.url}`
  const prefix = block.prefix?.trim() || "Similar Reading"

  return (
    <aside className="not-prose my-6 overflow-hidden rounded-2xl border border-primary/20 bg-linear-to-r from-primary/[0.04] via-primary/[0.02] to-transparent p-3.5 transition-all duration-200 hover:border-primary/40 hover:bg-primary/[0.06] hover:shadow-xs sm:p-4 dark:border-primary/30 dark:from-primary/[0.08] dark:to-transparent">
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-between gap-3.5 text-inherit no-underline sm:gap-4"
      >
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-105 sm:h-11 sm:w-11">
            <IconBook className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="mr-2 inline-block text-xs font-bold tracking-wider text-primary uppercase">
              {prefix}:
            </span>
            <span className="text-sm leading-snug font-semibold text-foreground underline-offset-4 transition-colors group-hover:text-primary group-hover:underline sm:text-base">
              {block.title}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {block.image_url ? (
            <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted shadow-2xs sm:h-16 sm:w-26">
              <Image
                src={block.image_url}
                alt={block.title}
                fill
                sizes="(max-width: 640px) 80px, 104px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ) : null}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background/80 text-muted-foreground shadow-2xs transition-all duration-200 group-hover:translate-x-1 group-hover:bg-primary group-hover:text-primary-foreground">
            <IconArrowRight className="h-4 w-4" />
          </div>
        </div>
      </Link>
    </aside>
  )
}
