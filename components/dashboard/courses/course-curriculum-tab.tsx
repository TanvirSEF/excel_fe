"use client"

import * as React from "react"
import {
  IconArrowNarrowDown,
  IconArrowNarrowUp,
  IconBook2,
  IconFileSpreadsheet,
  IconFileText,
  IconPencil,
  IconPlus,
  IconSchool,
  IconTrash,
  IconVideo,
} from "@tabler/icons-react"
import { LessonEditorModal } from "@/components/dashboard/courses/lesson-editor-modal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  useCreateLesson,
  useCreateSection,
  useDeleteLesson,
  useDeleteSection,
  useReorderLessons,
  useReorderSections,
} from "@/lib/queries/courses"
import type { CourseDetail, CourseLesson, LessonType } from "@/types/api"

interface CourseCurriculumTabProps {
  course: CourseDetail
  courseId: string
}

export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "0m"
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

function getLessonTypeIcon(type: LessonType) {
  switch (type) {
    case "video":
      return <IconVideo className="size-4 text-sky-500" />
    case "article":
      return <IconFileText className="size-4 text-emerald-500" />
    case "exercise":
      return <IconFileSpreadsheet className="size-4 text-amber-500" />
    case "quiz":
      return <IconSchool className="size-4 text-purple-500" />
    default:
      return <IconVideo className="size-4 text-sky-500" />
  }
}

export function CourseCurriculumTab({
  course,
  courseId,
}: CourseCurriculumTabProps) {
  const createSectionMutation = useCreateSection(courseId)
  const deleteSectionMutation = useDeleteSection(courseId)
  const reorderSectionsMutation = useReorderSections(courseId)
  const createLessonMutation = useCreateLesson(courseId)
  const deleteLessonMutation = useDeleteLesson(courseId)
  const reorderLessonsMutation = useReorderLessons(courseId)

  const [editingLesson, setEditingLesson] = React.useState<CourseLesson | null>(
    null
  )
  const [lessonModalOpen, setLessonModalOpen] = React.useState(false)
  const [newSectionOpen, setNewSectionOpen] = React.useState(false)
  const [newSectionTitle, setNewSectionTitle] = React.useState("")
  const [newSectionDesc, setNewSectionDesc] = React.useState("")

  const [newLessonSectionId, setNewLessonSectionId] = React.useState<
    string | null
  >(null)
  const [newLessonTitle, setNewLessonTitle] = React.useState("")
  const [newLessonType, setNewLessonType] = React.useState<LessonType>("video")

  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSectionTitle.trim()) return

    await createSectionMutation.mutateAsync({
      title: newSectionTitle.trim(),
      description: newSectionDesc.trim() || undefined,
    })

    setNewSectionOpen(false)
    setNewSectionTitle("")
    setNewSectionDesc("")
  }

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLessonSectionId || !newLessonTitle.trim()) return

    await createLessonMutation.mutateAsync({
      sectionId: newLessonSectionId,
      data: {
        title: newLessonTitle.trim(),
        lesson_type: newLessonType,
      },
    })

    setNewLessonSectionId(null)
    setNewLessonTitle("")
    setNewLessonType("video")
  }

  const handleMoveSection = async (index: number, direction: "up" | "down") => {
    const sections = [...course.sections].sort(
      (a, b) => a.order_index - b.order_index
    )
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= sections.length) return

    const temp = sections[index]
    sections[index] = sections[targetIndex]
    sections[targetIndex] = temp

    const reordered = sections.map((sec, i) => ({ id: sec.id, order_index: i }))
    await reorderSectionsMutation.mutateAsync(reordered)
  }

  const handleMoveLesson = async (
    sectionId: string,
    lessonIndex: number,
    direction: "up" | "down"
  ) => {
    const section = course.sections.find((s) => s.id === sectionId)
    if (!section) return
    const lessons = [...section.lessons].sort(
      (a, b) => a.order_index - b.order_index
    )
    const targetIndex = direction === "up" ? lessonIndex - 1 : lessonIndex + 1
    if (targetIndex < 0 || targetIndex >= lessons.length) return

    const temp = lessons[lessonIndex]
    lessons[lessonIndex] = lessons[targetIndex]
    lessons[targetIndex] = temp

    const reordered = lessons.map((les, i) => ({
      id: les.id,
      order_index: i,
      section_id: sectionId,
    }))
    await reorderLessonsMutation.mutateAsync(reordered)
  }

  const sortedSections = [...course.sections].sort(
    (a, b) => a.order_index - b.order_index
  )

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Modular Curriculum
          </h2>
          <p className="text-xs text-muted-foreground">
            Group video lectures into ordered sections. Add practice workbooks
            and manage free preview access.
          </p>
        </div>

        <Dialog open={newSectionOpen} onOpenChange={setNewSectionOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <IconPlus className="size-4" />
              Add Section
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleAddSection}>
              <DialogHeader>
                <DialogTitle>Add Curriculum Section</DialogTitle>
                <DialogDescription>
                  Sections group related lectures.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="sec-title">Section Title *</Label>
                  <Input
                    id="sec-title"
                    placeholder="e.g. Master dynamic array formulas"
                    value={newSectionTitle}
                    onChange={(e) => setNewSectionTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sec-desc">Learning Objective</Label>
                  <Textarea
                    id="sec-desc"
                    placeholder="What will students accomplish in this section?"
                    rows={3}
                    value={newSectionDesc}
                    onChange={(e) => setNewSectionDesc(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setNewSectionOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createSectionMutation.isPending || !newSectionTitle.trim()
                  }
                >
                  {createSectionMutation.isPending
                    ? "Creating..."
                    : "Add Section"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {sortedSections.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <IconBook2 className="mx-auto size-8 text-muted-foreground" />
          <h3 className="mt-4 text-base font-semibold">
            No curriculum sections yet
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Click &quot;Add Section&quot; above to organize your course into
            structured modules.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedSections.map((section, sIndex) => {
            const sortedLessons = [...section.lessons].sort(
              (a, b) => a.order_index - b.order_index
            )
            return (
              <div
                key={section.id}
                className="overflow-hidden rounded-xl border bg-card shadow-xs"
              >
                <div className="flex flex-col gap-2 border-b bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        disabled={sIndex === 0}
                        onClick={() => handleMoveSection(sIndex, "up")}
                        title="Move section up"
                      >
                        <IconArrowNarrowUp className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        disabled={sIndex === sortedSections.length - 1}
                        onClick={() => handleMoveSection(sIndex, "down")}
                        title="Move section down"
                      >
                        <IconArrowNarrowDown className="size-3.5" />
                      </Button>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-muted-foreground uppercase">
                          Section {sIndex + 1}:
                        </span>
                        <span className="font-semibold text-foreground">
                          {section.title}
                        </span>
                      </div>
                      {section.description && (
                        <p className="line-clamp-1 text-xs text-muted-foreground">
                          {section.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {sortedLessons.length} lessons
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setNewLessonSectionId(section.id)}
                      className="gap-1.5"
                    >
                      <IconPlus className="size-3.5" />
                      Add Lesson
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        if (
                          confirm(
                            `Delete section "${section.title}" and all its lessons?`
                          )
                        ) {
                          deleteSectionMutation.mutate(section.id)
                        }
                      }}
                      title="Delete section"
                    >
                      <IconTrash className="size-4" />
                    </Button>
                  </div>
                </div>

                <div className="divide-y">
                  {sortedLessons.length === 0 ? (
                    <div className="p-6 text-center text-xs text-muted-foreground">
                      No lessons in this section. Click &quot;Add Lesson&quot;
                      to add a lecture.
                    </div>
                  ) : (
                    sortedLessons.map((lesson, lIndex) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-3.5 transition-colors hover:bg-muted/30"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-0.5">
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              disabled={lIndex === 0}
                              onClick={() =>
                                handleMoveLesson(section.id, lIndex, "up")
                              }
                              title="Move lesson up"
                            >
                              <IconArrowNarrowUp className="size-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              disabled={lIndex === sortedLessons.length - 1}
                              onClick={() =>
                                handleMoveLesson(section.id, lIndex, "down")
                              }
                              title="Move lesson down"
                            >
                              <IconArrowNarrowDown className="size-3" />
                            </Button>
                          </div>

                          <div className="flex size-7 items-center justify-center rounded-md bg-muted">
                            {getLessonTypeIcon(lesson.lesson_type)}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {sIndex + 1}.{lIndex + 1}
                              </span>
                              <span className="text-sm font-medium">
                                {lesson.title}
                              </span>
                              {lesson.is_preview && (
                                <Badge
                                  variant="outline"
                                  className="border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-600"
                                >
                                  Preview
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                              <span>
                                {formatDuration(lesson.video_duration_seconds)}
                              </span>
                              {lesson.video_url ? (
                                <span className="text-emerald-600 dark:text-emerald-400">
                                  • Video ready
                                </span>
                              ) : (
                                <span className="text-amber-600 dark:text-amber-400">
                                  • No video attached
                                </span>
                              )}
                              {lesson.attachments?.length > 0 && (
                                <span>
                                  • {lesson.attachments.length} workbooks
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingLesson(lesson)
                              setLessonModalOpen(true)
                            }}
                            className="gap-1.5"
                          >
                            <IconPencil className="size-3.5" />
                            Edit Content
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => {
                              if (confirm(`Delete lesson "${lesson.title}"?`)) {
                                deleteLessonMutation.mutate(lesson.id)
                              }
                            }}
                            title="Delete lesson"
                          >
                            <IconTrash className="size-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Dialog
        open={Boolean(newLessonSectionId)}
        onOpenChange={(open) => !open && setNewLessonSectionId(null)}
      >
        <DialogContent>
          <form onSubmit={handleAddLesson}>
            <DialogHeader>
              <DialogTitle>Add New Lesson</DialogTitle>
              <DialogDescription>Create a new lesson.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="les-title">Lesson Title *</Label>
                <Input
                  id="les-title"
                  placeholder="e.g. INDEX/MATCH with Multiple Criteria"
                  value={newLessonTitle}
                  onChange={(e) => setNewLessonTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Lesson Type</Label>
                <Select
                  value={newLessonType}
                  onValueChange={(val) => setNewLessonType(val as LessonType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video Lecture</SelectItem>
                    <SelectItem value="article">Text & Article</SelectItem>
                    <SelectItem value="exercise">
                      Excel Practice Exercise
                    </SelectItem>
                    <SelectItem value="quiz">Knowledge Quiz</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setNewLessonSectionId(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  createLessonMutation.isPending || !newLessonTitle.trim()
                }
              >
                {createLessonMutation.isPending
                  ? "Creating..."
                  : "Create Lesson"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <LessonEditorModal
        courseId={courseId}
        lesson={editingLesson}
        open={lessonModalOpen}
        onOpenChange={(open) => {
          setLessonModalOpen(open)
          if (!open) setEditingLesson(null)
        }}
      />
    </>
  )
}
