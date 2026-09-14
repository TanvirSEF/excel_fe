import type { Metadata } from "next"
import Link from "next/link"
import type { TablerIcon } from "@tabler/icons-react"
import {
  IconArrowRight,
  IconBrandGoogle,
  IconTable,
} from "@tabler/icons-react"

import { Breadcrumb } from "@/components/site/breadcrumb"
import { getCurriculum } from "@/lib/api/curriculum"
import { GOOGLE_CURATED_TOPICS } from "@/lib/category-topics"
import type { CurriculumModule } from "@/types/api"

export const revalidate = 300

export const metadata: Metadata = {
  title: "Google Sheets Learning Track — Step-by-Step Course | Excel Insider",
  description:
    "Master Google Sheets with a structured learning track: basics, functions, formulas, intermediate skills, charts and Apps Script — in order, lesson by lesson.",
  alternates: { canonical: "/google-sheets" },
}

function moduleIcon(slug: string, className: string) {
  const Icon: TablerIcon =
    GOOGLE_CURATED_TOPICS.find((topic) => topic.slug === slug)?.icon ?? IconTable
  return <Icon className={className} />
}

export default async function GoogleSheetsHubPage() {
  const modules: CurriculumModule[] = await getCurriculum(300).catch(() => [])
  const totalLessons = modules.reduce((sum, m) => sum + m.lesson_count, 0)
  const firstLesson = modules[0]?.topics[0]?.lessons[0]?.slug

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Google Sheets" }]} />

      <section className="mt-6 overflow-hidden rounded-2xl border border-teal-500/25 bg-gradient-to-br from-teal-500/10 via-teal-500/5 to-transparent p-6 sm:p-10">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-700 dark:text-teal-300">
              <IconBrandGoogle className="h-3.5 w-3.5" />
              Structured Learning
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              Google Sheets Learning Track
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              A complete step-by-step course — {modules.length} modules,{" "}
              {totalLessons} lessons. Follow the curriculum in order or jump
              straight to the topic you need.
            </p>
          </div>
          {firstLesson ? (
            <Link
              href={`/google-sheets/${firstLesson}`}
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-teal-600 px-5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-teal-700"
            >
              {moduleIcon(modules[0].slug, "h-4.5 w-4.5")}
              Start Learning
              <IconArrowRight className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
      </section>

      <div className="mt-12 space-y-14">
        {modules.map((module, moduleIndex) => {
          return (
            <section key={module.slug} id={module.slug} aria-labelledby={`module-${module.slug}`}>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-500/15 text-teal-700 dark:text-teal-300">
                  {moduleIcon(module.slug, "h-6 w-6")}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Module {moduleIndex + 1}
                  </p>
                  <h2 className="mt-0.5 text-2xl font-bold tracking-tight">
                    {module.name}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {module.topics.length} topics · {module.lesson_count} lessons
                  </p>
                  {module.description ? (
                    <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground/80">
                      {module.description}
                    </p>
                  ) : null}
                </div>
              </div>

              <ul className="mt-6 divide-y divide-border/60 rounded-xl border border-border/70 bg-card">
                {module.topics.map((topic) => {
                  const firstTopicLesson = topic.lessons[0]
                  return (
                    <li key={topic.slug}>
                      <Link
                        href={
                          firstTopicLesson
                            ? `/google-sheets/${firstTopicLesson.slug}`
                            : "/google-sheets"
                        }
                        className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-teal-500/5"
                      >
                        <span className="text-base font-semibold text-foreground group-hover:text-teal-700 dark:group-hover:text-teal-300 sm:text-lg">
                          {topic.name}
                        </span>
                        <IconArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-teal-600 dark:group-hover:text-teal-400" />
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>
    </div>
  )
}
