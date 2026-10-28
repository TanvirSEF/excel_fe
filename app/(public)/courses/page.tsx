import type { Metadata } from "next"

import { CourseCatalogView } from "@/components/site/courses/course-catalog-view"
import { getCourses } from "@/lib/api/courses"

export const revalidate = 300

export const metadata: Metadata = {
  title: "Excel Video Courses & Interactive LMS | Excel Insider",
  description:
    "Learn Excel from industry experts with structured video courses, hands-on workbook exercises, and downloadable financial models.",
}

export default async function CoursesPage() {
  const coursesData = await getCourses({ page: 1, page_size: 50 }, 300).catch(() => ({
    items: [],
    total: 0,
    page: 1,
    page_size: 50,
    total_pages: 1,
  }))

  return <CourseCatalogView initialCourses={coursesData.items} />
}
