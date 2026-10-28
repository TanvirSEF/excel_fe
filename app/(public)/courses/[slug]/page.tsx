import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  IconCheck,
  IconChevronRight,
  IconClock,
  IconFolder,
  IconLanguage,
  IconUser,
  IconVideo,
} from "@tabler/icons-react"

import { CourseCurriculumAccordion } from "@/components/site/courses/course-curriculum-accordion"
import { CourseEnrollCta } from "@/components/site/courses/course-enroll-cta"
import { Badge } from "@/components/ui/badge"
import { getCourseBySlug } from "@/lib/api/courses"

interface CourseLandingPageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 60

export async function generateMetadata({
  params,
}: CourseLandingPageProps): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourseBySlug(slug).catch(() => null)

  if (!course) {
    return { title: "Course Not Found | Excel Insider" }
  }

  return {
    title: `${course.title} | Excel Insider Course`,
    description: course.headline || course.description?.slice(0, 160) || "Master advanced Excel techniques.",
    openGraph: {
      title: course.title,
      description: course.headline || undefined,
      images: course.thumbnail_url ? [{ url: course.thumbnail_url }] : [],
    },
  }
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

export default async function CourseLandingPage({ params }: CourseLandingPageProps) {
  const { slug } = await params
  const course = await getCourseBySlug(slug).catch(() => null)

  if (!course) {
    notFound()
  }

  // Find first lesson for direct enrollment CTA navigation
  const firstSection = course.sections[0]
  const firstLesson = firstSection?.lessons[0]
  const firstLessonId = firstLesson?.id || null

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.headline || course.description,
    provider: {
      "@type": "Organization",
      name: "Excel Insider",
      sameAs: "https://excelinsider.com",
    },
    educationalLevel: course.level,
    timeRequired: `PT${Math.round(course.total_duration_seconds / 60)}M`,
    offers: {
      "@type": "Offer",
      price: course.is_free ? "0.00" : String(course.price),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <IconChevronRight className="size-3" />
          <Link href="/courses" className="hover:text-foreground">Courses</Link>
          <IconChevronRight className="size-3" />
          <span className="truncate text-foreground font-medium">{course.title}</span>
        </nav>

        {/* Layout Grid: Content on Left, Sticky Enrollment Card on Right */}
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Main Content Area */}
          <div className="space-y-8 lg:col-span-2">
            {/* Header info */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="capitalize">
                  {course.level.replace("_", " ")}
                </Badge>
                {course.category && (
                  <Badge variant="outline" className="gap-1">
                    <IconFolder className="size-3 text-muted-foreground" />
                    {course.category.name}
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
                {course.title}
              </h1>

              {course.headline && (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {course.headline}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2">
                <span className="flex items-center gap-1 font-medium text-foreground">
                  <IconVideo className="size-4 text-primary" />
                  {course.total_lessons_count} video lectures
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <IconClock className="size-4" />
                  {formatDuration(course.total_duration_seconds)} on-demand video
                </span>
                {course.instructor?.name && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <IconUser className="size-4" />
                      Taught by {course.instructor.name}
                    </span>
                  </>
                )}
                <span>•</span>
                <span className="flex items-center gap-1">
                  <IconLanguage className="size-4" />
                  English
                </span>
              </div>
            </div>

            {/* Mobile / Tablet Enrollment Card (visible only below lg) */}
            <div className="block lg:hidden">
              <CourseEnrollCta course={course} firstLessonId={firstLessonId} />
            </div>

            {/* What you'll learn checklist (Udemy style card) */}
            {course.learning_outcomes && course.learning_outcomes.length > 0 && (
              <div className="rounded-2xl border border-primary/20 bg-linear-to-b from-primary/5 via-card to-card p-6">
                <h2 className="text-lg font-bold tracking-tight text-foreground mb-4">
                  What you&apos;ll learn
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {course.learning_outcomes.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-sm">
                      <IconCheck className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-foreground/90">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Course Content / Curriculum */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Course content
              </h2>
              <CourseCurriculumAccordion
                sections={course.sections}
                courseSlug={course.slug}
                isEnrolled={course.is_enrolled}
              />
            </div>

            {/* Requirements */}
            {course.requirements && course.requirements.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Requirements
                </h2>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                  {course.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Full Course Description */}
            {course.description && (
              <div className="space-y-3">
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Description
                </h2>
                <div className="prose dark:prose-invert max-w-none text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {course.description}
                </div>
              </div>
            )}

            {/* Instructor Bio */}
            {course.instructor && (
              <div className="space-y-4 rounded-2xl border bg-card p-6">
                <h2 className="text-lg font-bold tracking-tight text-foreground">
                  Your Instructor
                </h2>
                <div className="flex items-center gap-4">
                  <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
                    {course.instructor.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={course.instructor.avatar_url}
                        alt={course.instructor.name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      course.instructor.name.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-foreground">
                      {course.instructor.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">Excel Insider Expert & Modeling Instructor</p>
                  </div>
                </div>
                {course.instructor.bio && (
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {course.instructor.bio}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Desktop Right Column: Sticky Enrollment CTA */}
          <div className="hidden lg:block">
            <CourseEnrollCta course={course} firstLessonId={firstLessonId} />
          </div>
        </div>
      </div>
    </>
  )
}
