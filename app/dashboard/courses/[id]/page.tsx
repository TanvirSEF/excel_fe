import { PageGuard } from "@/components/dashboard/page-guard"
import { CourseEditorView } from "@/components/dashboard/courses/course-editor-view"

interface CourseEditorPageProps {
  params: Promise<{ id: string }>
}

export const metadata = {
  title: "Course Curriculum Builder | Excel Insider Studio",
}

export default async function CourseEditorPage({ params }: CourseEditorPageProps) {
  const { id } = await params

  return (
    <PageGuard permission="courses:manage" title="Course Studio">
      <CourseEditorView courseId={id} />
    </PageGuard>
  )
}
