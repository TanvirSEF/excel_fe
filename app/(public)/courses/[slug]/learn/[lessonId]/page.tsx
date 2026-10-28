import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ClassroomPlayerView } from "@/components/site/courses/classroom-player-view"
import { getCourseBySlug } from "@/lib/api/courses"

interface ClassroomPageProps {
  params: Promise<{
    slug: string
    lessonId: string
  }>
}

export async function generateMetadata({
  params,
}: ClassroomPageProps): Promise<Metadata> {
  const { slug, lessonId } = await params
  const course = await getCourseBySlug(slug).catch(() => null)

  if (!course) {
    return { title: "Lesson | Excel Insider" }
  }

  let lessonTitle = "Lecture"
  for (const s of course.sections) {
    for (const l of s.lessons) {
      if (l.id === lessonId) {
        lessonTitle = l.title
        break
      }
    }
  }

  return {
    title: `${lessonTitle} - ${course.title} | Excel Insider Classroom`,
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default async function ClassroomPage({ params }: ClassroomPageProps) {
  const { slug, lessonId } = await params
  const course = await getCourseBySlug(slug).catch(() => null)

  if (!course) {
    notFound()
  }

  return <ClassroomPlayerView course={course} initialLessonId={lessonId} />
}
