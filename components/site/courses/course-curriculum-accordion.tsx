"use client"

import * as React from "react"
import Link from "next/link"
import {
  IconChevronDown,
  IconChevronUp,
  IconFileSpreadsheet,
  IconFileText,
  IconLock,
  IconSchool,
  IconVideo,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import type { CourseSectionPublic, LessonType } from "@/types/api"

interface CourseCurriculumAccordionProps {
  sections: CourseSectionPublic[]
  courseSlug: string
  isEnrolled: boolean
}

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "0m"
  const minutes = Math.floor(seconds / 60)
  const remainingSec = seconds % 60
  if (minutes > 0) {
    return `${minutes}:${remainingSec.toString().padStart(2, "0")}`
  }
  return `0:${remainingSec.toString().padStart(2, "0")}`
}

function getLessonIcon(type: LessonType) {
  switch (type) {
    case "video":
      return <IconVideo className="size-4 text-sky-500 shrink-0" />
    case "article":
      return <IconFileText className="size-4 text-emerald-500 shrink-0" />
    case "exercise":
      return <IconFileSpreadsheet className="size-4 text-amber-500 shrink-0" />
    case "quiz":
      return <IconSchool className="size-4 text-purple-500 shrink-0" />
    default:
      return <IconVideo className="size-4 text-sky-500 shrink-0" />
  }
}

export function CourseCurriculumAccordion({
  sections,
  courseSlug,
  isEnrolled,
}: CourseCurriculumAccordionProps) {
  // All sections expanded by default
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    sections.forEach((s) => {
      initial[s.id] = true
    })
    return initial
  })

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const toggleAll = (expand: boolean) => {
    const next: Record<string, boolean> = {}
    sections.forEach((s) => {
      next[s.id] = expand
    })
    setExpandedSections(next)
  }

  return (
    <div className="space-y-4">
      {/* Header controls */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {sections.length} sections •{" "}
          {sections.reduce((acc, s) => acc + s.lessons.length, 0)} lectures
        </span>
        <button
          type="button"
          onClick={() => {
            const allExpanded = Object.values(expandedSections).every(Boolean)
            toggleAll(!allExpanded)
          }}
          className="font-medium text-primary hover:underline"
        >
          {Object.values(expandedSections).every(Boolean)
            ? "Collapse all sections"
            : "Expand all sections"}
        </button>
      </div>

      {/* Sections Accordion */}
      <div className="divide-y rounded-2xl border bg-card overflow-hidden">
        {sections.map((section, sIdx) => {
          const isExpanded = expandedSections[section.id] ?? true
          const sectionDuration = section.lessons.reduce(
            (acc, l) => acc + l.video_duration_seconds,
            0
          )

          return (
            <div key={section.id} className="transition-colors">
              {/* Section Header */}
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className="flex w-full items-center justify-between p-4 text-left font-medium hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <IconChevronUp className="size-4 text-muted-foreground shrink-0" />
                  ) : (
                    <IconChevronDown className="size-4 text-muted-foreground shrink-0" />
                  )}
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      Section {sIdx + 1}: {section.title}
                    </div>
                    {section.description && (
                      <p className="line-clamp-1 text-xs text-muted-foreground font-normal">
                        {section.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-xs text-muted-foreground shrink-0">
                  {section.lessons.length} lectures • {Math.round(sectionDuration / 60)} min
                </div>
              </button>

              {/* Lesson Items */}
              {isExpanded && (
                <div className="divide-y bg-muted/20 border-t">
                  {section.lessons.map((lesson) => {
                    const canAccess = isEnrolled || lesson.is_preview
                    return (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between px-6 py-3 text-sm hover:bg-muted/40 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {getLessonIcon(lesson.lesson_type)}
                          {canAccess ? (
                            <Link
                              href={`/courses/${encodeURIComponent(courseSlug)}/learn/${lesson.id}`}
                              className="font-medium text-foreground hover:text-primary transition-colors"
                            >
                              {lesson.title}
                            </Link>
                          ) : (
                            <span className="text-muted-foreground">{lesson.title}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          {lesson.is_preview && (
                            <Link
                              href={`/courses/${encodeURIComponent(courseSlug)}/learn/${lesson.id}`}
                            >
                              <Badge
                                variant="outline"
                                className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 cursor-pointer text-xs"
                              >
                                Preview
                              </Badge>
                            </Link>
                          )}

                          {!canAccess && !lesson.is_preview && (
                            <IconLock className="size-3.5 text-muted-foreground/60" />
                          )}

                          <span className="text-xs text-muted-foreground">
                            {formatDuration(lesson.video_duration_seconds)}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
