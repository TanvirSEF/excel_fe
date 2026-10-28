import { PageGuard } from "@/components/dashboard/page-guard"
import { CoursesView } from "@/components/dashboard/courses/courses-view"

export const metadata = {
  title: "Course Management & LMS Studio | Excel Insider",
}

export default function DashboardCoursesPage() {
  return (
    <PageGuard permission="courses:view" title="Courses">
      <CoursesView />
    </PageGuard>
  )
}
