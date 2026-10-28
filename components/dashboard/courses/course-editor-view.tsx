"use client"

import * as React from "react"
import Link from "next/link"
import {
  IconArrowLeft,
  IconBook2,
  IconExternalLink,
  IconPencil,
} from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAdminCourse, useUpdateCourse } from "@/lib/queries/courses"
import type { CourseStatus } from "@/types/api"
import {
  CourseCurriculumTab,
  formatDuration,
} from "@/components/dashboard/courses/course-curriculum-tab"
import { CourseDetailsForm } from "@/components/dashboard/courses/course-details-form"

interface CourseEditorViewProps {
  courseId: string
}

export function CourseEditorView({ courseId }: CourseEditorViewProps) {
  const { data: course, isLoading } = useAdminCourse(courseId)
  const updateCourseMutation = useUpdateCourse(courseId)

  const [activeTab, setActiveTab] = React.useState<"curriculum" | "details">(
    "curriculum"
  )

  if (isLoading || !course) {
    return (
      <div className="flex h-96 items-center justify-center p-6 text-sm text-muted-foreground">
        Loading course studio...
      </div>
    )
  }

  const handleTogglePublish = async () => {
    const nextStatus: CourseStatus =
      course.status === "published" ? "draft" : "published"
    await updateCourseMutation.mutateAsync({ status: nextStatus })
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon-sm" asChild>
              <Link href="/dashboard/courses">
                <IconArrowLeft className="size-4" />
              </Link>
            </Button>
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              {course.title}
            </h1>
            <Badge
              variant="outline"
              className={
                course.status === "published"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                  : "border-amber-500/30 bg-amber-500/10 text-amber-600"
              }
            >
              {course.status.toUpperCase()}
            </Badge>
          </div>
          <div className="flex items-center gap-4 pl-9 text-xs text-muted-foreground">
            <span>{course.total_lessons_count} total lessons</span>
            <span>•</span>
            <span>{formatDuration(course.total_duration_seconds)} content</span>
            <span>•</span>
            <span>
              {course.is_free ? "Free" : `$${Number(course.price).toFixed(2)}`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {course.status === "published" && (
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`/courses/${course.slug}`}
                target="_blank"
                className="gap-2"
              >
                <IconExternalLink className="size-4" />
                Live Page
              </Link>
            </Button>
          )}

          <Button
            variant={course.status === "published" ? "outline" : "default"}
            size="sm"
            onClick={handleTogglePublish}
            disabled={updateCourseMutation.isPending}
          >
            {course.status === "published"
              ? "Unpublish to Draft"
              : "Publish Course"}
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as "curriculum" | "details")}
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="curriculum" className="gap-2">
            <IconBook2 className="size-4" />
            Curriculum Builder
          </TabsTrigger>
          <TabsTrigger value="details" className="gap-2">
            <IconPencil className="size-4" />
            Details & Landing Page
          </TabsTrigger>
        </TabsList>

        <TabsContent value="curriculum" className="space-y-6 pt-4">
          <CourseCurriculumTab course={course} courseId={courseId} />
        </TabsContent>

        <TabsContent value="details" className="pt-4">
          <CourseDetailsForm
            key={course.id}
            course={course}
            onSave={async (data) => {
              await updateCourseMutation.mutateAsync(data)
            }}
            isPending={updateCourseMutation.isPending}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
