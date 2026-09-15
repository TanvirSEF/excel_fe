import Link from "next/link"
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
} from "@tabler/icons-react"

export interface PagerLesson {
  slug: string
  title: string
  topicName?: string
}

interface LessonPagerProps {
  prev: PagerLesson | null
  next: PagerLesson | null
}

export function LessonPager({ prev, next }: LessonPagerProps) {
  if (!prev && !next) return null

  return (
    <nav
      aria-label="Lesson navigation"
      className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2"
    >
      {prev ? (
        <Link
          href={`/google-sheets/${prev.slug}`}
          className="group flex min-w-0 flex-col gap-1 rounded-xl border border-border/70 bg-card p-4 transition-colors hover:border-teal-500/50"
        >
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <IconArrowLeft className="h-3.5 w-3.5" />
            Previous
          </span>
          <span className="line-clamp-2 text-sm font-bold text-foreground group-hover:text-teal-700 dark:group-hover:text-teal-300">
            {prev.title}
          </span>
          {prev.topicName ? (
            <span className="text-[11px] text-muted-foreground">
              {prev.topicName}
            </span>
          ) : null}
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
      {next ? (
        <Link
          href={`/google-sheets/${next.slug}`}
          className="group flex min-w-0 flex-col items-end gap-1 rounded-xl border border-border/70 bg-card p-4 text-right transition-colors hover:border-teal-500/50"
        >
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Next
            <IconArrowRight className="h-3.5 w-3.5" />
          </span>
          <span className="line-clamp-2 text-sm font-bold text-foreground group-hover:text-teal-700 dark:group-hover:text-teal-300">
            {next.title}
          </span>
          {next.topicName ? (
            <span className="text-[11px] text-muted-foreground">
              {next.topicName}
            </span>
          ) : null}
        </Link>
      ) : (
        <span className="hidden items-center justify-end gap-1 rounded-xl border border-teal-500/40 bg-teal-500/10 p-4 text-xs font-semibold text-teal-700 dark:text-teal-300 sm:flex">
          <IconCheck className="h-4 w-4" />
          Track complete — nice work!
        </span>
      )}
    </nav>
  )
}
