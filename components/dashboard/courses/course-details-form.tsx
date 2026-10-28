"use client"

import * as React from "react"
import {
  IconCheck,
  IconDeviceFloppy,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
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
import { uploadDirectToR2, useGetUploadIntent } from "@/lib/queries/courses"
import type { CourseDetail, CourseLevel, CourseStatus } from "@/types/api"

export function CourseDetailsForm({
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
  const [level, setLevel] = React.useState<CourseLevel>(
    course.level || "all_levels"
  )
  const [status] = React.useState<CourseStatus>(course.status || "draft")
  const [isFree, setIsFree] = React.useState(course.is_free ?? true)
  const [price, setPrice] = React.useState(String(course.price || 0))
  const [thumbnailUrl, setThumbnailUrl] = React.useState(
    course.thumbnail_url || ""
  )
  const [promoVideoUrl, setPromoVideoUrl] = React.useState(
    course.promo_video_url || ""
  )
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

  const handleThumbnailUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
          <div className="space-y-4 rounded-xl border bg-card p-6">
            <h3 className="text-base font-semibold">Course Information</h3>

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

          <div className="space-y-4 rounded-xl border bg-card p-6">
            <div>
              <h3 className="text-base font-semibold">
                What Students Will Learn
              </h3>
              <p className="text-xs text-muted-foreground">
                Key takeaways featured prominently in the course landing page
                checklist.
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
                    setLearningOutcomes([
                      ...learningOutcomes,
                      newOutcome.trim(),
                    ])
                    setNewOutcome("")
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (newOutcome.trim()) {
                    setLearningOutcomes([
                      ...learningOutcomes,
                      newOutcome.trim(),
                    ])
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
                    <IconCheck className="size-4 shrink-0 text-emerald-500" />
                    <span>{item}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() =>
                      setLearningOutcomes(
                        learningOutcomes.filter((_, i) => i !== idx)
                      )
                    }
                  >
                    <IconTrash className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-xl border bg-card p-6">
            <div>
              <h3 className="text-base font-semibold">
                Course Prerequisites & Requirements
              </h3>
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
                    onClick={() =>
                      setRequirements(requirements.filter((_, i) => i !== idx))
                    }
                  >
                    <IconTrash className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4 rounded-xl border bg-card p-6">
            <h3 className="text-base font-semibold">Course Thumbnail</h3>
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
                      {thumbnailUploading
                        ? "Uploading..."
                        : "Upload Cover Image"}
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

          <div className="space-y-4 rounded-xl border bg-card p-6">
            <h3 className="text-base font-semibold">Promo Video / Trailer</h3>
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

          <div className="space-y-4 rounded-xl border bg-card p-6">
            <h3 className="text-base font-semibold">Course Classification</h3>

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
