"use client"

import * as React from "react"
import {
  IconClock,
  IconDownload,
  IconFileSpreadsheet,
  IconTrash,
  IconUpload,
  IconVideo,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  useAddAttachment,
  useDeleteAttachment,
  useGetUploadIntent,
  useUpdateLesson,
} from "@/lib/queries/courses"
import type { CourseLesson, LessonType } from "@/types/api"

interface LessonEditorModalProps {
  courseId: string
  lesson: CourseLesson | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function formatBytes(bytes: number): string {
  if (!bytes) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

function LessonEditorForm({
  courseId,
  lesson,
  onClose,
}: {
  courseId: string
  lesson: CourseLesson
  onClose: () => void
}) {
  const [title, setTitle] = React.useState(lesson.title || "")
  const [slug, setSlug] = React.useState(lesson.slug || "")
  const [lessonType, setLessonType] = React.useState<LessonType>(lesson.lesson_type || "video")
  const [videoUrl, setVideoUrl] = React.useState(lesson.video_url || "")
  const totalSec = lesson.video_duration_seconds || 0
  const [durationMinutes, setDurationMinutes] = React.useState(Math.floor(totalSec / 60))
  const [durationSeconds, setDurationSeconds] = React.useState(totalSec % 60)
  const [isPreview, setIsPreview] = React.useState(lesson.is_preview || false)
  const [contentHtml, setContentHtml] = React.useState(lesson.content_html || "")

  // Video Upload State
  const [videoUploading, setVideoUploading] = React.useState(false)
  const [videoUploadPct, setVideoUploadPct] = React.useState(0)

  // Attachment Upload State
  const [attUploading, setAttUploading] = React.useState(false)
  const [attUploadPct, setAttUploadPct] = React.useState(0)

  const updateLessonMutation = useUpdateLesson(courseId)
  const uploadIntentMutation = useGetUploadIntent()
  const addAttachmentMutation = useAddAttachment(courseId)
  const deleteAttachmentMutation = useDeleteAttachment(courseId)

  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setVideoUploading(true)
      setVideoUploadPct(0)

      const tempVideo = document.createElement("video")
      tempVideo.preload = "metadata"
      tempVideo.src = URL.createObjectURL(file)
      tempVideo.onloadedmetadata = () => {
        URL.revokeObjectURL(tempVideo.src)
        const dur = Math.round(tempVideo.duration)
        if (dur > 0) {
          setDurationMinutes(Math.floor(dur / 60))
          setDurationSeconds(dur % 60)
        }
      }

      const intent = await uploadIntentMutation.mutateAsync({
        file_name: file.name,
        file_size_bytes: file.size,
        content_type: file.type || "video/mp4",
        asset_type: "video",
        course_id: courseId,
        lesson_id: lesson.id,
      })

      await uploadDirectToR2(intent.upload_url, file, (pct) => {
        setVideoUploadPct(pct)
      })

      setVideoUrl(intent.public_url)
    } catch (err) {
      console.error("Direct R2 video upload failed:", err)
      alert("Failed to upload video to Cloudflare R2.")
    } finally {
      setVideoUploading(false)
      e.target.value = ""
    }
  }

  const handleAttachmentFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setAttUploading(true)
      setAttUploadPct(0)

      const intent = await uploadIntentMutation.mutateAsync({
        file_name: file.name,
        file_size_bytes: file.size,
        content_type: file.type || "application/octet-stream",
        asset_type: "attachment",
        course_id: courseId,
        lesson_id: lesson.id,
      })

      await uploadDirectToR2(intent.upload_url, file, (pct) => {
        setAttUploadPct(pct)
      })

      await addAttachmentMutation.mutateAsync({
        lessonId: lesson.id,
        data: {
          file_name: file.name,
          file_url: intent.public_url,
          file_size_bytes: file.size,
          file_type: file.type || "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      })
    } catch (err) {
      console.error("Attachment upload failed:", err)
      alert("Failed to upload attachment.")
    } finally {
      setAttUploading(false)
      e.target.value = ""
    }
  }

  const handleSave = async () => {
    if (!title.trim()) return

    const totalSeconds = durationMinutes * 60 + durationSeconds

    await updateLessonMutation.mutateAsync({
      lessonId: lesson.id,
      data: {
        title: title.trim(),
        slug: slug.trim() || undefined,
        lesson_type: lessonType,
        video_url: videoUrl.trim() || null,
        video_duration_seconds: totalSeconds,
        is_preview: isPreview,
        content_html: contentHtml || null,
      },
    })

    onClose()
  }

  return (
    <>
      <div className="space-y-4 py-2">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="lesson-title">Lesson Title *</Label>
            <Input
              id="lesson-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Understanding INDEX and MATCH"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lesson-slug">Custom Slug</Label>
            <Input
              id="lesson-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="Auto-generated if left empty"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Lesson Format</Label>
            <Select
              value={lessonType}
              onValueChange={(val) => setLessonType(val as LessonType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">Video Lecture</SelectItem>
                <SelectItem value="article">Text & Walkthrough</SelectItem>
                <SelectItem value="exercise">Excel Practice Exercise</SelectItem>
                <SelectItem value="quiz">Knowledge Check Quiz</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 pt-6">
            <Checkbox
              id="preview-mode"
              checked={isPreview}
              onCheckedChange={(checked) => setIsPreview(Boolean(checked))}
            />
            <Label
              htmlFor="preview-mode"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Allow Free Preview (open without login / enrollment)
            </Label>
          </div>
        </div>

        <Tabs defaultValue="video" className="w-full pt-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="video" className="gap-2">
              <IconVideo className="size-4" />
              Video Lecture
            </TabsTrigger>
            <TabsTrigger value="notes" className="gap-2">
              <IconClock className="size-4" />
              Notes & Summary
            </TabsTrigger>
            <TabsTrigger value="attachments" className="gap-2">
              <IconFileSpreadsheet className="size-4" />
              Excel Workbooks ({lesson.attachments?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="video" className="space-y-4 pt-4">
            <div className="rounded-lg border bg-muted/30 p-4">
              <h4 className="text-sm font-semibold">Cloudflare R2 Direct Video Upload</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Upload MP4, WebM, or MOV files directly into your Cloudflare R2 bucket without streaming timeouts.
              </p>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="relative cursor-pointer">
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2"
                    disabled={videoUploading}
                    asChild
                  >
                    <span>
                      <IconUpload className="size-4" />
                      {videoUploading ? `Uploading ${videoUploadPct}%...` : "Select Video File"}
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    className="hidden"
                    onChange={handleVideoFileChange}
                    disabled={videoUploading}
                  />
                </label>

                <div className="flex-1">
                  <Input
                    placeholder="Or paste direct Cloudflare R2 video URL..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="text-xs font-mono"
                  />
                </div>
              </div>

              {videoUploading && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Uploading to Cloudflare R2...</span>
                    <span>{videoUploadPct}%</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-all duration-200"
                      style={{ width: `${videoUploadPct}%` }}
                    />
                  </div>
                </div>
              )}

              {videoUrl && (
                <div className="mt-4 space-y-2">
                  <span className="text-xs font-medium text-muted-foreground">Video Preview:</span>
                  <div className="overflow-hidden rounded-md border bg-black">
                    <video
                      src={videoUrl}
                      controls
                      className="aspect-video max-h-56 w-full object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dur-min">Duration (Minutes)</Label>
                <Input
                  id="dur-min"
                  type="number"
                  min="0"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dur-sec">Duration (Seconds)</Label>
                <Input
                  id="dur-sec"
                  type="number"
                  min="0"
                  max="59"
                  value={durationSeconds}
                  onChange={(e) => setDurationSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="lesson-notes">Lecture Notes & Key Formulas</Label>
              <Textarea
                id="lesson-notes"
                placeholder="Summarize key shortcuts and formulas..."
                rows={8}
                value={contentHtml}
                onChange={(e) => setContentHtml(e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="attachments" className="space-y-4 pt-4">
            <div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold">Downloadable Practice Workbooks</h4>
                  <p className="text-xs text-muted-foreground">
                    Attach starter spreadsheets and solution models.
                  </p>
                </div>

                <label className="cursor-pointer">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="gap-2"
                    disabled={attUploading}
                    asChild
                  >
                    <span>
                      <IconUpload className="size-4" />
                      {attUploading ? `Uploading ${attUploadPct}%...` : "Upload File"}
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept=".xlsx,.xls,.xlsm,.csv,.pdf,.zip"
                    className="hidden"
                    onChange={handleAttachmentFileChange}
                    disabled={attUploading}
                  />
                </label>
              </div>

              {attUploading && (
                <div className="mt-2">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-all duration-200"
                      style={{ width: `${attUploadPct}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {(!lesson.attachments || lesson.attachments.length === 0) ? (
                <p className="py-6 text-center text-xs text-muted-foreground">
                  No downloadable attachments for this lesson yet.
                </p>
              ) : (
                lesson.attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between rounded-lg border bg-card p-3 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded bg-emerald-500/10 text-emerald-600">
                        <IconFileSpreadsheet className="size-4" />
                      </div>
                      <div>
                        <div className="font-medium">{att.file_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatBytes(att.file_size_bytes)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        asChild
                        title="Download attachment"
                      >
                        <a href={att.file_url} target="_blank" download rel="noopener noreferrer">
                          <IconDownload className="size-4" />
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => deleteAttachmentMutation.mutate(att.id)}
                        title="Delete attachment"
                      >
                        <IconTrash className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSave}
          disabled={updateLessonMutation.isPending || !title.trim()}
        >
          {updateLessonMutation.isPending ? "Saving..." : "Save Lesson"}
        </Button>
      </DialogFooter>
    </>
  )
}

export function LessonEditorModal({
  courseId,
  lesson,
  open,
  onOpenChange,
}: LessonEditorModalProps) {
  if (!lesson) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Edit Lesson: {lesson.title}</DialogTitle>
            <div className="flex items-center gap-2">
              {lesson.is_preview && (
                <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600">
                  Free Preview
                </Badge>
              )}
            </div>
          </div>
          <DialogDescription>
            Configure lesson settings, upload Cloudflare R2 video, and attach practice Excel files.
          </DialogDescription>
        </DialogHeader>

        <LessonEditorForm
          key={lesson.id}
          courseId={courseId}
          lesson={lesson}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
