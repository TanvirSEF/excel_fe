import { serverFetch } from "@/lib/api/server-fetch"
import type { CourseListItem, CoursePublicDetail, Page } from "@/types/api"

export interface CourseListParams {
  page?: number
  page_size?: number
  category_id?: string
  level?: string
  search?: string
}

export function getCourses(params: CourseListParams = {}, revalidate = 300) {
  return serverFetch<Page<CourseListItem>>("/courses", {
    revalidate,
    searchParams: {
      page: params.page,
      page_size: params.page_size,
      category_id: params.category_id,
      level: params.level,
      search: params.search,
    },
    tags: ["courses"],
  })
}

export function getCourseBySlug(slug: string, revalidate = 60) {
  return serverFetch<CoursePublicDetail>(`/courses/${encodeURIComponent(slug)}`, {
    revalidate,
    tags: ["course", slug],
  })
}
