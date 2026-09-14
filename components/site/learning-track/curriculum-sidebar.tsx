import Link from "next/link"
import { IconChevronDown } from "@tabler/icons-react"

import { curatedTopics } from "@/lib/curriculum-curation"
import { cn } from "@/lib/utils"
import type { CurriculumModule } from "@/types/api"

interface CurriculumSidebarProps {
  modules: CurriculumModule[]
  activeLessonSlug?: string
  className?: string
}

export function CurriculumSidebar({
  modules,
  activeLessonSlug,
  className,
}: CurriculumSidebarProps) {
  const activeModule = modules.find((module) =>
    module.topics.some((topic) =>
      topic.lessons.some((lesson) => lesson.slug === activeLessonSlug)
    )
  )
  const activeTopic = activeModule?.topics.find((topic) =>
    topic.lessons.some((lesson) => lesson.slug === activeLessonSlug)
  )

  return (
    <nav aria-label="Curriculum" className={cn("space-y-2", className)}>
      {modules.map((module) => {
        const moduleActive = module.slug === activeModule?.slug
        return (
          <details
            key={module.slug}
            open={moduleActive}
            className="group rounded-xl border border-border/60 bg-card"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3.5 text-sm font-bold text-foreground [&::-webkit-details-marker]:hidden">
              <span className="line-clamp-2">{module.name}</span>
              <IconChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
            </summary>

            <ul className="space-y-0.5 border-t border-border/50 px-2.5 py-2.5">
              {curatedTopics(module.slug, module.topics).map((topic) => {
                const topicActive =
                  moduleActive && topic.slug === activeTopic?.slug
                const firstLesson = topic.lessons[0]
                return (
                  <li key={topic.slug}>
                    <Link
                      href={
                        firstLesson
                          ? `/google-sheets/${firstLesson.slug}`
                          : "/google-sheets"
                      }
                      aria-current={topicActive ? "page" : undefined}
                      className={cn(
                        "block rounded-lg px-2.5 py-2 text-sm leading-snug transition-colors",
                        topicActive
                          ? "bg-teal-500/15 font-semibold text-teal-700 dark:text-teal-300"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      )}
                    >
                      {topic.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </details>
        )
      })}
    </nav>
  )
}
