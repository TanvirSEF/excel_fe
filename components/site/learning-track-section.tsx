import Link from "next/link"
import type { TablerIcon } from "@tabler/icons-react"
import {
  IconArrowRight,
  IconBrandGoogle,
  IconTable,
} from "@tabler/icons-react"

import { GOOGLE_CURATED_TOPICS } from "@/lib/category-topics"
import { curatedTopics } from "@/lib/curriculum-curation"
import type { CurriculumModule } from "@/types/api"

interface LearningTrackSectionProps {
  modules: CurriculumModule[]
}

function moduleIcon(slug: string, className: string) {
  const Icon: TablerIcon =
    GOOGLE_CURATED_TOPICS.find((topic) => topic.slug === slug)?.icon ?? IconTable
  return <Icon className={className} />
}

export function LearningTrackSection({ modules }: LearningTrackSectionProps) {
  if (modules.length === 0) return null

  const totalLessons = modules.reduce((sum, module) => sum + module.lesson_count, 0)
  const totalTopics = modules.reduce(
    (sum, module) => sum + curatedTopics(module.slug, module.topics).length,
    0
  )
  const firstLesson = curatedTopics(modules[0].slug, modules[0].topics)[0]?.lessons[0]

  const stats = [
    { value: modules.length, label: "Modules" },
    { value: totalTopics, label: "Topics" },
    { value: totalLessons, label: "Lessons" },
    { value: "100%", label: "Free" },
  ]

  return (
    <section className="py-12 sm:py-16" aria-labelledby="learning-track-heading">
      <div className="overflow-hidden rounded-2xl border border-teal-500/25 bg-gradient-to-br from-teal-500/10 via-teal-500/5 to-transparent p-6 sm:p-10">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-700 dark:text-teal-300">
              <IconBrandGoogle className="h-3.5 w-3.5" />
              Google Sheets Learning Track
            </span>
            <h2
              id="learning-track-heading"
              className="mt-4 text-2xl font-bold tracking-tight text-balance sm:text-3xl lg:text-4xl"
            >
              Master Google Sheets, Lesson by Lesson
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              A complete structured course — from your first spreadsheet to Apps
              Script automation — with every lesson in the right order.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
              {stats.map((stat) => (
                <span key={stat.label} className="text-sm">
                  <span className="font-bold text-foreground">{stat.value}</span>
                  <span className="ml-1.5 text-muted-foreground">{stat.label}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            {firstLesson ? (
              <Link
                href={`/google-sheets/${firstLesson.slug}`}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-teal-700"
              >
                Start Learning
                <IconArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
            <Link
              href="/google-sheets"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-teal-500/40 bg-background px-5 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-500/10 dark:text-teal-300"
            >
              View Full Track
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((module, index) => {
          const topics = curatedTopics(module.slug, module.topics)
          return (
            <Link
              key={module.slug}
              href={`/google-sheets#${module.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/60 hover:shadow-lg"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute right-4 top-3 text-4xl font-bold leading-none text-teal-500/15"
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/15 text-teal-700 transition-colors group-hover:bg-teal-600 group-hover:text-white dark:text-teal-300 dark:group-hover:text-white">
                {moduleIcon(module.slug, "h-6 w-6")}
              </div>

              <div className="mt-4 space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Module {index + 1}
                </p>
                <h3 className="text-lg font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-teal-700 dark:group-hover:text-teal-300">
                  {module.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {topics.length} {topics.length === 1 ? "topic" : "topics"} ·{" "}
                  {module.lesson_count}{" "}
                  {module.lesson_count === 1 ? "lesson" : "lessons"}
                </p>
              </div>

              <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-teal-700 dark:text-teal-300">
                <span>Explore module</span>
                <IconArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
