"use client"

import * as React from "react"
import Link from "next/link"
import {
  IconArrowLeft,
  IconArrowNarrowDown,
  IconArrowNarrowUp,
  IconBook2,
  IconCheck,
  IconDeviceFloppy,
  IconExternalLink,
  IconFileSpreadsheet,
  IconFileText,
  IconPencil,
  IconPlus,
  IconSchool,
  IconTrash,
  IconUpload,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  uploadDirectToR2,
  useAdminCourse,
  useCreateLesson,
  useCreateSection,
  useDeleteLesson,
  useDeleteSection,
  useGetUploadIntent,
  useReorderLessons,
  useReorderSections,
  useUpdateCourse,
} from "@/lib/queries/courses"
import type {
  CourseDetail,
  CourseLevel,
  CourseLesson,
  CourseStatus,
  LessonType,
} from "@/types/api"

interface CourseEditorViewProps {
  courseId: string
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

function CourseDetailsForm({
  course,
  onSave,
  isPending,
}: {
  course: CourseDetail
  onSave: (data: Partial<CourseDetail>) => Promise<void>
  isPending: boolean
}) {
  const uploadIntentMutation = useGetUploadIntent()

  const [title, setTitle] = React.useState(course.title || "")
  const [slug, setSlug] = React.useState(course.slug || "")
  const [headline, setHeadline] = React.useState(course.headline || "")
  const [description, setDescription] = React.useState(course.description || "")
  const [level, setLevel] = React.useState<CourseLevel>(course.level || "all_levels")
  const [status] = React.useState<CourseStatus>(course.status || "draft")
  const [isFree, setIsFree] = React.useState(course.is_free ?? true)
  const [price, setPrice] = React.useState(String(course.price || 0))
  const [thumbnailUrl, setThumbnailUrl] = React.useState(course.thumbnail_url || "")
  const [promoVideoUrl, setPromoVideoUrl] = React.useState(course.promo_video_url || "")
  const [learningOutcomes, setLearningOutcomes] = React.useState<string[]>(
    course.learning_outcomes || []
  )
  const [newOutcome, setNewOutcome] = React.useState("")
  const [requirements, setRequirements] = React.useState<string[]>(
    course.requirements || []
  )
  const [newRequirement, setNewRequirement] = React.useState("")
  const [thumbnailUploading, setThumbnailUploading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSave({
      title: title.trim(),
      slug: slug.trim() || undefined,
      headline: headline.trim() || undefined,
      description: description.trim() || undefined,
      level,
      status,
      is_free: isFree,
      price: isFree ? 0 : parseFloat(price) || 0,
      thumbnail_url: thumbnailUrl.trim() || undefined,
      promo_video_url: promoVideoUrl.trim() || undefined,
      learning_outcomes: learningOutcomes,
      requirements,
    })
  }

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setThumbnailUploading(true)
      const intent = await uploadIntentMutation.mutateAsync({
        file_name: file.name,
        file_size_bytes: file.size,
        content_type: file.type || "image/jpeg",
        asset_type: "thumbnail",
        course_id: course.id,
      })

      await uploadDirectToR2(intent.upload_url, file)
      setThumbnailUrl(intent.public_url)
    } catch (err) {
      console.error("Thumbnail upload failed:", err)
      alert("Failed to upload thumbnail.")
    } finally {
      setThumbnailUploading(false)
      e.target.value = ""
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border bg-card p-6 space-y-4">
            <h3 className="font-semibold text-base">Course Information</h3>

            <div className="space-y-2">
              <Label htmlFor="main-title">Course Title *</Label>
              <Input
                id="main-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="main-headline">Subtitle / Headline</Label>
              <Input
                id="main-headline"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Catchy one-line value proposition"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="main-slug">URL Slug</Label>
              <Input
                id="main-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="main-desc">Full Course Description</Label>
              <Textarea
                id="main-desc"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed overview for the course landing page..."
              />
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-base">What Students Will Learn</h3>
              <p className="text-xs text-muted-foreground">
                Key takeaways featured prominently in the course landing page checklist.
              </p>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="e.g. Master nested XLOOKUP formulas for multi-condition searching"
                value={newOutcome}
                onChange={(e) => setNewOutcome(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newOutcome.trim()) {
                    e.preventDefault()
                    setLearningOutcomes([...learningOutcomes, newOutcome.trim()])
                    setNewOutcome("")
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (newOutcome.trim()) {
                    setLearningOutcomes([...learningOutcomes, newOutcome.trim()])
                    setNewOutcome("")
                  }
                }}
              >
                Add
              </Button>
            </div>

            <div className="space-y-2">
              {learningOutcomes.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border bg-muted/40 p-2.5 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <IconCheck className="size-4 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => setLearningOutcomes(learningOutcomes.filter((_, i) => i !== idx))}
                  >
                    <IconTrash className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-base">Course Prerequisites & Requirements</h3>
              <p className="text-xs text-muted-foreground">
                Skills or tools students need before starting.
              </p>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="e.g. Basic familiarity with Microsoft Excel or Office 365"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newRequirement.trim()) {
                    e.preventDefault()
                    setRequirements([...requirements, newRequirement.trim()])
                    setNewRequirement("")
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (newRequirement.trim()) {
                    setRequirements([...requirements, newRequirement.trim()])
                    setNewRequirement("")
                  }
                }}
              >
                Add
              </Button>
            </div>

            <div className="space-y-2">
              {requirements.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border bg-muted/40 p-2.5 text-sm"
                >
                  <span>• {item}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => setRequirements(requirements.filter((_, i) => i !== idx))}
                  >
                    <IconTrash className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-6 space-y-4">
            <h3 className="font-semibold text-base">Course Thumbnail</h3>
            <div className="space-y-3">
              {thumbnailUrl ? (
                <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbnailUrl}
                    alt="Course thumbnail"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex aspect-video items-center justify-center rounded-lg border border-dashed bg-muted/30 text-xs text-muted-foreground">
                  No thumbnail uploaded
                </div>
              )}

              <div className="flex items-center gap-2">
                <label className="cursor-pointer">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={thumbnailUploading}
                    asChild
                  >
                    <span>
                      <IconUpload className="mr-1.5 size-3.5" />
                      {thumbnailUploading ? "Uploading..." : "Upload Cover Image"}
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleThumbnailUpload}
                    disabled={thumbnailUploading}
                  />
                </label>
                {thumbnailUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => setThumbnailUrl("")}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6 space-y-4">
            <h3 className="font-semibold text-base">Promo Video / Trailer</h3>
            <div className="space-y-2">
              <Label htmlFor="promo-url">Cloudflare R2 Video URL</Label>
              <Input
                id="promo-url"
                placeholder="https://pub-....r2.dev/..."
                value={promoVideoUrl}
                onChange={(e) => setPromoVideoUrl(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6 space-y-4">
            <h3 className="font-semibold text-base">Course Classification</h3>

            <div className="space-y-2">
              <Label>Difficulty Level</Label>
              <Select
                value={level}
                onValueChange={(val) => setLevel(val as CourseLevel)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_levels">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Access Pricing</Label>
              <Select
                value={isFree ? "free" : "paid"}
                onValueChange={(val) => setIsFree(val === "free")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free Access</SelectItem>
                  <SelectItem value="paid">Paid Course</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {!isFree && (
              <div className="space-y-2">
                <Label htmlFor="price-val">Price ($ USD)</Label>
                <Input
                  id="price-val"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full gap-2"
            disabled={isPending}
          >
            <IconDeviceFloppy className="size-4" />
            {isPending ? "Saving..." : "Save Course Details"}
          </Button>
        </div>
      </div>
    </form>
  )
}

export function CourseEditorView({ courseId }: CourseEditorViewProps) {
  const { data: course, isLoading } = useAdminCourse(courseId)
  const updateCourseMutation = useUpdateCourse(courseId)
  const createSectionMutation = useCreateSection(courseId)
  const deleteSectionMutation = useDeleteSection(courseId)
  const reorderSectionsMutation = useReorderSections(courseId)
  const createLessonMutation = useCreateLesson(courseId)
  const deleteLessonMutation = useDeleteLesson(courseId)
  const reorderLessonsMutation = useReorderLessons(courseId)

  const [activeTab, setActiveTab] = React.useState<"curriculum" | "details">("curriculum")
  const [editingLesson, setEditingLesson] = React.useState<CourseLesson | null>(null)
  const [lessonModalOpen, setLessonModalOpen] = React.useState(false)

  const [newSectionOpen, setNewSectionOpen] = React.useState(false)
  const [newSectionTitle, setNewSectionTitle] = React.useState("")
  const [newSectionDesc, setNewSectionDesc] = React.useState("")

  const [newLessonSectionId, setNewLessonSectionId] = React.useState<string | null>(null)
  const [newLessonTitle, setNewLessonTitle] = React.useState("")
  const [newLessonType, setNewLessonType] = React.useState<LessonType>("video")

  if (isLoading || !course) {
    return (
      <div className="flex h-96 items-center justify-center p-6 text-sm text-muted-foreground">
        Loading course studio...
      </div>
    )
  }

  const handleTogglePublish = async () => {
    const nextStatus: CourseStatus = course.status === "published" ? "draft" : "published"
    await updateCourseMutation.mutateAsync({ status: nextStatus })
  }

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
    const sections = [...course.sections].sort((a, b) => a.order_index - b.order_index)
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
    const lessons = [...section.lessons].sort((a, b) => a.order_index - b.order_index)
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

  const sortedSections = [...course.sections].sort((a, b) => a.order_index - b.order_index)

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
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{course.title}</h1>
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
            <span>{course.is_free ? "Free" : `$${Number(course.price).toFixed(2)}`}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {course.status === "published" && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/courses/${course.slug}`} target="_blank" className="gap-2">
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
            {course.status === "published" ? "Unpublish to Draft" : "Publish Course"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "curriculum" | "details")}>
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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Modular Curriculum</h2>
              <p className="text-xs text-muted-foreground">
                Group video lectures into ordered sections. Add practice workbooks and manage free preview access.
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
                    <Button type="button" variant="outline" onClick={() => setNewSectionOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createSectionMutation.isPending || !newSectionTitle.trim()}>
                      {createSectionMutation.isPending ? "Creating..." : "Add Section"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {sortedSections.length === 0 ? (
            <div className="rounded-xl border border-dashed p-12 text-center">
              <IconBook2 className="mx-auto size-8 text-muted-foreground" />
              <h3 className="mt-4 text-base font-semibold">No curriculum sections yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Click &quot;Add Section&quot; above to organize your course into structured modules.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedSections.map((section, sIndex) => {
                const sortedLessons = [...section.lessons].sort((a, b) => a.order_index - b.order_index)
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
                            <span className="text-xs font-semibold uppercase text-muted-foreground">
                              Section {sIndex + 1}:
                            </span>
                            <span className="font-semibold text-foreground">{section.title}</span>
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
                            if (confirm(`Delete section "${section.title}" and all its lessons?`)) {
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
                          No lessons in this section. Click &quot;Add Lesson&quot; to add a lecture.
                        </div>
                      ) : (
                        sortedLessons.map((lesson, lIndex) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between p-3.5 hover:bg-muted/30 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-0.5">
                                <Button
                                  variant="ghost"
                                  size="icon-xs"
                                  disabled={lIndex === 0}
                                  onClick={() => handleMoveLesson(section.id, lIndex, "up")}
                                  title="Move lesson up"
                                >
                                  <IconArrowNarrowUp className="size-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon-xs"
                                  disabled={lIndex === sortedLessons.length - 1}
                                  onClick={() => handleMoveLesson(section.id, lIndex, "down")}
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
                                  <span className="font-medium text-sm">{lesson.title}</span>
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
                                  <span>{formatDuration(lesson.video_duration_seconds)}</span>
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
                  <DialogDescription>
                    Create a new lesson.
                  </DialogDescription>
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
                        <SelectItem value="exercise">Excel Practice Exercise</SelectItem>
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
                    disabled={createLessonMutation.isPending || !newLessonTitle.trim()}
                  >
                    {createLessonMutation.isPending ? "Creating..." : "Create Lesson"}
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
