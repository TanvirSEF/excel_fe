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
  position: number
  total: number
  prev: PagerLesson | null
  next: PagerLesson | null
}

export function LessonProgress({
  position,
  total,
}: Pick<LessonPagerProps, "position" | "total">) {
  const percent = total > 0 ? Math.round((position / total) * 100) : 0

  return (
    <div className="my-5 rounded-xl border border-teal-500/30 bg-teal-500/5 px-4 py-3">
      <div className="flex items-center justify-between gap-3 text-xs">
        <p className="font-semibold text-teal-700 dark:text-teal-300">
          Lesson {position} of {total}
        </p>
        <p className="text-muted-foreground">{percent}% of the track</p>
      </div>
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-teal-500/15"
      >
        <div
          className="h-full rounded-full bg-teal-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

export function LessonPager({ prev, next }: Omit<LessonPagerProps, "position" | "total">) {
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
