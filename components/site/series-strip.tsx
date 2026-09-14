import Link from "next/link"
import {
  IconArrowLeft,
  IconArrowRight,
  IconListNumbers,
} from "@tabler/icons-react"

import type { SeriesContext } from "@/types/api"

interface SeriesStripProps {
  series: SeriesContext
}

export function SeriesStrip({ series }: SeriesStripProps) {
  return (
    <nav
      aria-label="Lesson series"
      className="my-6 rounded-2xl border border-primary/30 bg-muted/30 p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <IconListNumbers className="h-4.5 w-4.5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Part {series.position} of {series.total}
            </p>
            <p className="text-sm font-bold text-foreground">{series.name}</p>
          </div>
        </div>
        <Link
          href={`/series/${series.slug}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/60 hover:text-primary"
        >
          View all lessons
          <IconArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {series.prev || series.next ? (
        <div className="mt-3 grid grid-cols-1 gap-2 border-t border-border/60 pt-3 sm:grid-cols-2">
          {series.prev ? (
            <Link
              href={`/blog/${series.prev.slug}`}
              className="group flex min-w-0 items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              <IconArrowLeft className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate font-medium">{series.prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {series.next ? (
            <Link
              href={`/blog/${series.next.slug}`}
              className="group flex min-w-0 items-center justify-end gap-2 text-right text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              <span className="truncate font-medium">{series.next.title}</span>
              <IconArrowRight className="h-3.5 w-3.5 shrink-0" />
            </Link>
          ) : null}
        </div>
      ) : null}
    </nav>
  )
}
