"use client"

import { useState } from "react"
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

  const [prevActiveSlug, setPrevActiveSlug] = useState(activeLessonSlug)
  const [openModuleSlug, setOpenModuleSlug] = useState<string | null>(
    activeModule?.slug ?? null
  )

  if (activeLessonSlug !== prevActiveSlug) {
    setPrevActiveSlug(activeLessonSlug)
    setOpenModuleSlug(activeModule?.slug ?? null)
  }

  return (
    <nav aria-label="Curriculum" className={cn("space-y-2.5", className)}>
      {modules.map((module) => {
        const moduleActive = module.slug === activeModule?.slug
        const isOpen = openModuleSlug === module.slug

        return (
          <details
            key={module.slug}
            open={isOpen}
            className={cn(
              "group overflow-hidden rounded-xl border transition-all duration-200",
              isOpen
                ? "border-primary/40 bg-primary shadow-md"
                : "border-primary/20 bg-primary shadow-xs hover:border-primary/40 hover:shadow-md"
            )}
          >
            <summary
              onClick={(e) => {
                e.preventDefault()
                setOpenModuleSlug((current) =>
                  current === module.slug ? null : module.slug
                )
              }}
              aria-expanded={isOpen}
              className={cn(
                "flex cursor-pointer list-none items-center justify-between gap-2.5 px-4 py-3.5 text-sm font-bold text-white select-none transition-colors duration-150 [&::-webkit-details-marker]:hidden",
                "bg-primary hover:bg-primary/90",
                moduleActive && !isOpen && "ring-1 ring-white/30"
              )}
            >
              <div className="flex items-center gap-2 min-w-0">
                {moduleActive && (
                  <span
                    className="h-2 w-2 shrink-0 rounded-full bg-emerald-300 shadow-xs"
                    aria-hidden="true"
                  />
                )}
                <span className="line-clamp-2 leading-snug">{module.name}</span>
              </div>
              <IconChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-white/80 transition-transform duration-200 group-hover:text-white",
                  isOpen && "rotate-180 text-white"
                )}
              />
            </summary>

            <ul className="space-y-1 border-t border-white/15 bg-primary/95 px-2.5 py-2.5">
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
                        "block rounded-lg px-2.5 py-2 text-sm leading-snug transition-all duration-150",
                        topicActive
                          ? "bg-white/20 font-semibold text-white shadow-2xs"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
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
