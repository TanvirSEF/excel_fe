"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  IconArrowLeft,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconCircleCheck,
  IconDownload,
  IconFileSpreadsheet,
  IconFileText,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarRightCollapse,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  useClassroomLesson,
  useUpdateLessonProgress,
} from "@/lib/queries/courses"
import type { CoursePublicDetail } from "@/types/api"

interface ClassroomPlayerViewProps {
  course: CoursePublicDetail
  initialLessonId: string
}

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "0m"
  const minutes = Math.floor(seconds / 60)
  const remSec = seconds % 60
  return `${minutes}:${remSec.toString().padStart(2, "0")}`
}

function formatBytes(bytes: number): string {
  if (!bytes) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

export function ClassroomPlayerView({
  course,
  initialLessonId,
}: ClassroomPlayerViewProps) {
  const router = useRouter()
  const videoRef = React.useRef<HTMLVideoElement>(null)

  const [activeLessonId, setActiveLessonId] = React.useState(initialLessonId)
  const [sidebarOpen, setSidebarOpen] = React.useState(true)
  const [playbackSpeed, setPlaybackSpeed] = React.useState(1)

  const { data: lesson, isLoading } = useClassroomLesson(course.slug, activeLessonId)
  const updateProgressMutation = useUpdateLessonProgress(course.slug)

  const handleToggleComplete = async () => {
    if (!lesson) return
    const nextCompleted = !lesson.is_completed
    await updateProgressMutation.mutateAsync({
      lessonId: lesson.id,
      isCompleted: nextCompleted,
      lastWatchedSecond: videoRef.current ? Math.round(videoRef.current.currentTime) : 0,
    })
  }

  const handleVideoEnded = async () => {
    if (!lesson) return
    await updateProgressMutation.mutateAsync({
      lessonId: lesson.id,
      isCompleted: true,
      lastWatchedSecond: Math.round(lesson.video_duration_seconds || 0),
    })

    if (lesson.next_lesson_id) {
      setActiveLessonId(lesson.next_lesson_id)
      router.push(`/courses/${encodeURIComponent(course.slug)}/learn/${lesson.next_lesson_id}`)
    }
  }

  const handleSelectLesson = (lessonId: string) => {
    setActiveLessonId(lessonId)
    router.push(`/courses/${encodeURIComponent(course.slug)}/learn/${lessonId}`)
  }

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed)
    if (videoRef.current) {
      videoRef.current.playbackRate = speed
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-background">
      {/* Top Classroom Bar */}
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b bg-card/95 px-4 backdrop-blur-xs">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href={`/courses/${course.slug}`}>
              <IconArrowLeft className="size-4" />
            </Link>
          </Button>

          <div className="flex flex-col">
            <span className="line-clamp-1 text-xs font-semibold text-foreground">
              {course.title}
            </span>
            <span className="line-clamp-1 text-[11px] text-muted-foreground">
              {lesson?.title || "Loading lesson..."}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Course Progress Bar */}
          <div className="hidden items-center gap-2 sm:flex">
            <div className="h-2 w-28 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${course.progress_percent}%` }}
              />
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {course.progress_percent}% completed
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? "Hide course curriculum" : "Show course curriculum"}
          >
            {sidebarOpen ? (
              <IconLayoutSidebarRightCollapse className="size-4" />
            ) : (
              <IconLayoutSidebarLeftCollapse className="size-4" />
            )}
          </Button>
        </div>
      </header>

      {/* Main Classroom Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left / Center: Theater Video & Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex h-96 items-center justify-center text-sm text-muted-foreground">
              Loading lecture video and notes...
            </div>
          ) : !lesson ? (
            <div className="p-12 text-center text-muted-foreground">
              Lecture not found or enrollment required.
            </div>
          ) : (
            <div className="mx-auto max-w-5xl p-4 sm:p-6 space-y-6">
              {/* Theater Video Frame */}
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border/80 bg-black shadow-2xl">
                {lesson.video_url ? (
                  <video
                    ref={videoRef}
                    key={lesson.id}
                    src={lesson.video_url}
                    controls
                    autoPlay
                    onEnded={handleVideoEnded}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center text-white/80">
                    <IconFileText className="size-12 text-emerald-400" />
                    <h3 className="text-lg font-bold text-white">{lesson.title}</h3>
                    <p className="max-w-md text-xs text-white/70">
                      This lecture is provided as a structured article walkthrough and practice exercise workbook below.
                    </p>
                  </div>
                )}
              </div>

              {/* Theater Controls Bar */}
              <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <Button
                    variant={lesson.is_completed ? "default" : "outline"}
                    size="sm"
                    className={`gap-2 ${
                      lesson.is_completed ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""
                    }`}
                    onClick={handleToggleComplete}
                    disabled={updateProgressMutation.isPending}
                  >
                    <IconCircleCheck className="size-4" />
                    {lesson.is_completed ? "Completed" : "Mark as Complete"}
                  </Button>

                  {/* Playback speed selector */}
                  {lesson.video_url && (
                    <div className="flex items-center gap-1 text-xs">
                      {[1, 1.25, 1.5, 2].map((speed) => (
                        <button
                          key={speed}
                          type="button"
                          onClick={() => handleSpeedChange(speed)}
                          className={`rounded px-2 py-1 font-mono transition-colors ${
                            playbackSpeed === speed
                              ? "bg-primary text-primary-foreground font-bold"
                              : "text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Prev / Next Lecture buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!lesson.prev_lesson_id}
                    onClick={() => lesson.prev_lesson_id && handleSelectLesson(lesson.prev_lesson_id)}
                    className="gap-1.5"
                  >
                    <IconChevronLeft className="size-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!lesson.next_lesson_id}
                    onClick={() => lesson.next_lesson_id && handleSelectLesson(lesson.next_lesson_id)}
                    className="gap-1.5"
                  >
                    Next
                    <IconChevronRight className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Lecture Content Tabs */}
              <Tabs defaultValue="notes" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="notes" className="gap-2">
                    <IconFileText className="size-4" />
                    Lecture Notes & Formulas
                  </TabsTrigger>
                  <TabsTrigger value="resources" className="gap-2">
                    <IconFileSpreadsheet className="size-4" />
                    Practice Workbooks ({lesson.attachments?.length || 0})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="notes" className="pt-4">
                  <div className="rounded-2xl border bg-card p-6 space-y-4">
                    <h3 className="text-lg font-bold tracking-tight text-foreground">
                      {lesson.title}
                    </h3>
                    {lesson.content_html ? (
                      <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed whitespace-pre-line text-foreground/90">
                        {lesson.content_html}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        No supplementary notes for this lecture. Follow along with the video and practice with the downloadable spreadsheet templates in the resources tab.
                      </p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="resources" className="pt-4">
                  <div className="rounded-2xl border bg-card p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-bold tracking-tight text-foreground">
                        Downloadable Exercise Spreadsheets
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Open these workbooks in Microsoft Excel or Office 365 to practice hands-on formulas and financial models.
                      </p>
                    </div>

                    {(!lesson.attachments || lesson.attachments.length === 0) ? (
                      <div className="py-8 text-center text-xs text-muted-foreground">
                        No files attached to this lecture.
                      </div>
                    ) : (
                      <div className="divide-y rounded-xl border">
                        {lesson.attachments.map((att) => (
                          <div
                            key={att.id}
                            className="flex items-center justify-between p-4 text-sm hover:bg-muted/30 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                                <IconFileSpreadsheet className="size-5" />
                              </div>
                              <div>
                                <div className="font-semibold">{att.file_name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {formatBytes(att.file_size_bytes)}
                                </div>
                              </div>
                            </div>

                            <Button size="sm" variant="outline" asChild className="gap-1.5">
                              <a
                                href={att.file_url}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <IconDownload className="size-4" />
                                Download File
                              </a>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>

        {/* Right: Collapsible Curriculum Sidebar */}
        {sidebarOpen && (
          <aside className="w-80 border-l bg-card/60 flex flex-col shrink-0 overflow-hidden">
            <div className="border-b p-4">
              <h3 className="font-semibold text-sm text-foreground">Course Content</h3>
              <p className="text-xs text-muted-foreground">
                {course.total_lessons_count} lectures • {formatDuration(course.total_duration_seconds)}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto divide-y">
              {course.sections.map((section, sIdx) => (
                <div key={section.id} className="py-2">
                  <div className="px-4 py-1.5 text-xs font-semibold text-muted-foreground uppercase">
                    Section {sIdx + 1}: {section.title}
                  </div>

                  <div className="space-y-0.5 pt-1">
                    {section.lessons.map((les) => {
                      const isActive = les.id === activeLessonId
                      return (
                        <button
                          key={les.id}
                          type="button"
                          onClick={() => handleSelectLesson(les.id)}
                          className={`flex w-full items-start gap-3 px-4 py-2.5 text-left text-xs transition-colors ${
                            isActive
                              ? "bg-primary/10 font-semibold text-primary border-r-2 border-primary"
                              : "text-foreground hover:bg-muted/50"
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {les.is_completed ? (
                              <IconCheck className="size-4 text-emerald-500 font-bold" />
                            ) : (
                              <div className="size-4 rounded-full border border-muted-foreground/40" />
                            )}
                          </div>

                          <div className="flex-1 space-y-0.5">
                            <div className="line-clamp-2">{les.title}</div>
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-normal">
                              <span>{formatDuration(les.video_duration_seconds)}</span>
                              {les.is_preview && (
                                <span className="text-emerald-600 font-medium">Free preview</span>
                              )}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
