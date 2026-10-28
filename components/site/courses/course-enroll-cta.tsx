"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  IconCheck,
  IconDeviceDesktop,
  IconFileSpreadsheet,
  IconInfinity,
  IconPlayerPlay,
  IconSchool,
} from "@tabler/icons-react"

import { PreviewModal } from "@/components/site/courses/preview-modal"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/lib/auth"
import { useEnrollCourse } from "@/lib/queries/courses"
import type { CoursePublicDetail } from "@/types/api"

interface CourseEnrollCtaProps {
  course: CoursePublicDetail
  firstLessonId: string | null
}

export function CourseEnrollCta({ course, firstLessonId }: CourseEnrollCtaProps) {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const status = useAuthStore((state) => state.status)

  const [previewOpen, setPreviewOpen] = React.useState(false)
  const [previewVideoUrl, setPreviewVideoUrl] = React.useState<string | null>(null)
  const [previewTitle, setPreviewTitle] = React.useState("")

  const enrollMutation = useEnrollCourse(course.slug)

  const handleAction = async () => {
    if (status !== "authenticated" || !user) {
      router.push(`/login?redirect=/courses/${encodeURIComponent(course.slug)}`)
      return
    }

    if (!course.is_enrolled) {
      await enrollMutation.mutateAsync()
    }

    if (firstLessonId) {
      router.push(`/courses/${encodeURIComponent(course.slug)}/learn/${firstLessonId}`)
    }
  }

  const handleOpenPromo = () => {
    if (course.promo_video_url) {
      setPreviewVideoUrl(course.promo_video_url)
      setPreviewTitle(`${course.title} - Preview Trailer`)
      setPreviewOpen(true)
    }
  }

  return (
    <>
      <div className="sticky top-20 rounded-2xl border bg-card p-5 shadow-lg">
        {/* Thumbnail or Promo Trailer Cover */}
        <div
          onClick={handleOpenPromo}
          className={`group relative aspect-16/9 w-full overflow-hidden rounded-xl border bg-muted/60 ${
            course.promo_video_url ? "cursor-pointer" : ""
          }`}
        >
          {course.thumbnail_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-emerald-500/10 via-primary/5 to-sky-500/10">
              <IconSchool className="size-12 text-primary/40" />
            </div>
          )}

          {course.promo_video_url && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/35 transition-colors group-hover:bg-black/50">
              <div className="flex size-14 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg transition-transform group-hover:scale-110">
                <IconPlayerPlay className="ml-1 size-7 fill-current" />
              </div>
            </div>
          )}
        </div>

        {/* Pricing & CTA */}
        <div className="mt-5 space-y-4">
          <div className="flex items-baseline justify-between">
            {course.is_free ? (
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                FREE
              </div>
            ) : (
              <div className="text-3xl font-extrabold text-foreground">
                ${Number(course.price).toFixed(2)}
              </div>
            )}
            {course.is_enrolled && (
              <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600">
                Enrolled ({course.progress_percent}% completed)
              </span>
            )}
          </div>

          <Button
            size="lg"
            className="w-full text-base font-semibold"
            onClick={handleAction}
            disabled={enrollMutation.isPending}
          >
            {enrollMutation.isPending
              ? "Enrolling..."
              : course.is_enrolled
              ? "Continue Learning"
              : course.is_free
              ? "Start Learning Now (Free)"
              : "Enroll in Course"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            30-day access guarantee • Instant Cloudflare R2 streaming
          </p>

          {/* Value Highlights */}
          <div className="space-y-2.5 border-t pt-4 text-xs text-muted-foreground">
            <div className="font-semibold text-foreground">This course includes:</div>
            <div className="flex items-center gap-2.5">
              <IconInfinity className="size-4 text-primary shrink-0" />
              <span>Full lifetime access to all lessons & updates</span>
            </div>
            <div className="flex items-center gap-2.5">
              <IconFileSpreadsheet className="size-4 text-primary shrink-0" />
              <span>Downloadable Excel solution templates & workbooks</span>
            </div>
            <div className="flex items-center gap-2.5">
              <IconDeviceDesktop className="size-4 text-primary shrink-0" />
              <span>Access on mobile, tablet, and desktop</span>
            </div>
            <div className="flex items-center gap-2.5">
              <IconCheck className="size-4 text-primary shrink-0" />
              <span>Distraction-free focus classroom mode</span>
            </div>
          </div>
        </div>
      </div>

      <PreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        videoUrl={previewVideoUrl}
        title={previewTitle}
      />
    </>
  )
}
