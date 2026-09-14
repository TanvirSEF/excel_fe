import Link from "next/link"
import { IconListNumbers } from "@tabler/icons-react"

import type { SeriesSummary } from "@/types/api"

interface SeriesOverviewProps {
  series: SeriesSummary[]
}

const MIN_LESSONS = 3
const MAX_SHOWN = 12

export function SeriesOverview({ series }: SeriesOverviewProps) {
  const visible = series
    .filter((item) => item.post_count >= MIN_LESSONS)
    .sort((a, b) => b.post_count - a.post_count || a.name.localeCompare(b.name))
    .slice(0, MAX_SHOWN)

  if (visible.length === 0) return null

  return (
    <section className="mt-8 mb-10 space-y-4" aria-label="Lesson series">
      <div className="flex items-center gap-2">
        <IconListNumbers className="h-4.5 w-4.5 text-primary" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Lesson series
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item) => (
          <Link
            key={item.id}
            href={`/series/${item.slug}`}
            className="group flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-card px-4 py-3.5 transition-colors hover:border-primary/60 hover:bg-muted/40"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-foreground group-hover:text-primary">
                {item.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {item.post_count} {item.post_count === 1 ? "lesson" : "lessons"}
              </p>
            </div>
            <span className="shrink-0 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
              Start
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
