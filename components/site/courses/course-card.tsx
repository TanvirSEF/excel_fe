import Link from "next/link"
import { IconClock, IconSchool } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { CourseLevel, CourseListItem } from "@/types/api"

interface CourseCardProps {
  course: CourseListItem
  className?: string
}

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "0m"
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

function formatLevel(level: CourseLevel): string {
  const map: Record<CourseLevel, string> = {
    all_levels: "All Levels",
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
  }
  return map[level] || level
}

export function CourseCard({ course, className }: CourseCardProps) {
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card p-3.5 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-lg",
        className
      )}
    >
      <Link href={`/courses/${course.slug}`} prefetch={false} className="flex h-full flex-col">
        {/* Course Thumbnail */}
        <div className="relative aspect-16/9 w-full overflow-hidden rounded-xl border border-border/40 bg-muted/60">
          {course.thumbnail_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="h-full w-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-emerald-500/10 via-primary/5 to-sky-500/10 text-muted-foreground">
              <IconSchool className="size-10 text-primary/40 transition-transform group-hover:scale-110" />
            </div>
          )}

          {/* Floating Badges */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            <Badge variant="secondary" className="bg-background/90 text-[11px] backdrop-blur-xs font-medium">
              {formatLevel(course.level)}
            </Badge>
          </div>

          <div className="absolute bottom-2.5 right-2.5">
            <span className="rounded-md bg-black/75 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-xs">
              {course.total_lessons_count} lectures
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex flex-1 flex-col justify-between pt-3.5">
          <div className="space-y-1.5">
            <h3 className="line-clamp-2 text-base font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
              {course.title}
            </h3>
            {course.headline && (
              <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {course.headline}
              </p>
            )}
          </div>

          <div className="mt-4 border-t pt-3 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <IconClock className="size-3.5" />
                {formatDuration(course.total_duration_seconds)}
              </span>
              {course.instructor?.name && (
                <>
                  <span>•</span>
                  <span className="line-clamp-1">{course.instructor.name}</span>
                </>
              )}
            </div>

            <div>
              {course.is_free ? (
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  FREE
                </span>
              ) : (
                <span className="font-bold text-foreground">
                  ${Number(course.price).toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}
