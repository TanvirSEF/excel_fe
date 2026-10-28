"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  IconBook2,
  IconClock,
  IconExternalLink,
  IconFilter,
  IconPlus,
  IconSearch,
  IconTrash,
  IconVideo,
} from "@tabler/icons-react"

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useAdminCourses, useCreateCourse, useDeleteCourse } from "@/lib/queries/courses"
import type { CourseLevel, CourseListItem, CourseStatus } from "@/types/api"

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "0m"
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

function StatusBadge({ status }: { status: CourseStatus }) {
  if (status === "published") {
    return (
      <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
        Published
      </Badge>
    )
  }
  if (status === "archived") {
    return (
      <Badge variant="outline" className="border-neutral-500/30 bg-neutral-500/10 text-neutral-600 dark:text-neutral-400">
        Archived
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400">
      Draft
    </Badge>
  )
}

function LevelBadge({ level }: { level: CourseLevel }) {
  const labels: Record<CourseLevel, string> = {
    all_levels: "All Levels",
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
  }
  return (
    <Badge variant="secondary" className="capitalize">
      {labels[level] || level}
    </Badge>
  )
}

export function CoursesView() {
  const router = useRouter()
  const [search, setSearch] = React.useState("")
  const [level, setLevel] = React.useState<CourseLevel | "all">("all")
  const [status, setStatus] = React.useState<CourseStatus | "all">("all")
  const [createOpen, setCreateOpen] = React.useState(false)

  // New course form state
  const [title, setTitle] = React.useState("")
  const [headline, setHeadline] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [newCourseLevel, setNewCourseLevel] = React.useState<CourseLevel>("all_levels")
  const [isFree, setIsFree] = React.useState(true)
  const [price, setPrice] = React.useState("0")

  const { data, isLoading } = useAdminCourses({
    search: search || undefined,
    level: level === "all" ? undefined : level,
    status: status === "all" ? undefined : status,
  })

  const createMutation = useCreateCourse()
  const deleteMutation = useDeleteCourse()

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const res = await createMutation.mutateAsync({
      title: title.trim(),
      headline: headline.trim() || undefined,
      description: description.trim() || undefined,
      level: newCourseLevel,
      is_free: isFree,
      price: isFree ? 0 : parseFloat(price) || 0,
    })

    setCreateOpen(false)
    setTitle("")
    setHeadline("")
    setDescription("")
    router.push(`/dashboard/courses/${res.id}`)
  }

  const handleDelete = async (course: CourseListItem) => {
    if (confirm(`Are you sure you want to delete course "${course.title}"? This cannot be undone.`)) {
      await deleteMutation.mutateAsync(course.id)
    }
  }

  const courses = data?.items || []

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Courses & Curriculum</h1>
          <p className="text-sm text-muted-foreground">
            Author video courses, manage modular sections, and upload Cloudflare R2 assets.
          </p>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <IconPlus className="size-4" />
              New Course
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>Create New Course</DialogTitle>
                <DialogDescription>
                  Start drafting a new curriculum. You can add sections, video lessons, and spreadsheets in the studio.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Master Financial Modeling in Excel"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="headline">Subtitle / Headline</Label>
                  <Input
                    id="headline"
                    placeholder="e.g. Build dynamic 3-statement models from scratch"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Target Level</Label>
                    <Select
                      value={newCourseLevel}
                      onValueChange={(val) => setNewCourseLevel(val as CourseLevel)}
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
                        <SelectItem value="paid">Paid Enrollment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {!isFree && (
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($ USD)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="desc">Course Overview</Label>
                  <Textarea
                    id="desc"
                    placeholder="Brief description of what students will accomplish..."
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending || !title.trim()}>
                  {createMutation.isPending ? "Creating..." : "Continue to Builder"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search courses by title or headline..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={status}
            onValueChange={(val) => setStatus(val as CourseStatus | "all")}
          >
            <SelectTrigger className="w-36">
              <IconFilter className="mr-2 size-3.5 text-muted-foreground" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Drafts</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={level}
            onValueChange={(val) => setLevel(val as CourseLevel | "all")}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Level" />
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

      {/* Table Listing */}
      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Curriculum</TableHead>
              <TableHead>Pricing</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                  Loading courses...
                </TableCell>
              </TableRow>
            ) : courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-16 text-center">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
                    <IconBook2 className="size-6 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 font-semibold">No courses created yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Get started by creating your first course and adding learning sections.
                  </p>
                  <Button
                    onClick={() => setCreateOpen(true)}
                    variant="outline"
                    className="mt-4 gap-2"
                  >
                    <IconPlus className="size-4" />
                    Create Course
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <Link
                        href={`/dashboard/courses/${course.id}`}
                        className="font-medium hover:underline"
                      >
                        {course.title}
                      </Link>
                      {course.headline && (
                        <span className="line-clamp-1 text-xs text-muted-foreground">
                          {course.headline}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <LevelBadge level={course.level} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <IconVideo className="size-3.5" />
                        {course.total_lessons_count} lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <IconClock className="size-3.5" />
                        {formatDuration(course.total_duration_seconds)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {course.is_free ? (
                      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Free</span>
                    ) : (
                      <span className="text-xs font-semibold">${Number(course.price).toFixed(2)}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={course.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {course.status === "published" && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          asChild
                          title="View live course"
                        >
                          <Link href={`/courses/${course.slug}`} target="_blank">
                            <IconExternalLink className="size-4" />
                          </Link>
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link href={`/dashboard/courses/${course.id}`}>
                          Studio & Builder
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(course)}
                        title="Delete course"
                      >
                        <IconTrash className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
