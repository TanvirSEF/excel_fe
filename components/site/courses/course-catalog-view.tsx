"use client"

import * as React from "react"
import { IconFilter, IconSchool, IconSearch } from "@tabler/icons-react"

import { CourseCard } from "@/components/site/courses/course-card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { CourseLevel, CourseListItem } from "@/types/api"

interface CourseCatalogViewProps {
  initialCourses: CourseListItem[]
}

export function CourseCatalogView({ initialCourses }: CourseCatalogViewProps) {
  const [search, setSearch] = React.useState("")
  const [level, setLevel] = React.useState<CourseLevel | "all">("all")

  const filteredCourses = React.useMemo(() => {
    return initialCourses.filter((course) => {
      if (level !== "all" && course.level !== level) {
        return false
      }
      if (search.trim()) {
        const query = search.toLowerCase()
        const matchTitle = course.title.toLowerCase().includes(query)
        const matchHeadline = course.headline?.toLowerCase().includes(query)
        if (!matchTitle && !matchHeadline) return false
      }
      return true
    })
  }, [initialCourses, search, level])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Header */}
      <div className="relative mb-8 overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-b from-primary/5 via-card to-card p-8 sm:p-12">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <IconSchool className="size-3.5" />
            <span>Interactive Learning Experience</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Excel Insider Video Courses
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Structured, step-by-step video curriculums, real-world spreadsheet exercises, and downloadable Excel templates designed for analysts, modelers, and finance professionals.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-8 flex flex-col gap-3 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by topic, formula, or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={level}
            onValueChange={(val) => setLevel(val as CourseLevel | "all")}
          >
            <SelectTrigger className="w-40">
              <IconFilter className="mr-2 size-3.5 text-muted-foreground" />
              <SelectValue placeholder="Skill Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-16 text-center">
          <IconSchool className="mx-auto size-10 text-muted-foreground" />
          <h3 className="mt-4 text-base font-semibold">No courses found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search criteria or filter options.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  )
}
