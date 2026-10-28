import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api/api-fetch"
import type {
  ClassroomLesson,
  CourseDetail,
  CourseLevel,
  CourseLesson,
  CourseListItem,
  CourseSection,
  CourseStatus,
  DirectUploadIntentRequest,
  DirectUploadIntentResponse,
  LessonAttachment,
  Page,
} from "@/types/api"

export interface AdminCoursesParams {
  search?: string
  categoryId?: string
  level?: CourseLevel
  status?: CourseStatus
  page?: number
  pageSize?: number
}

export function useAdminCourses(params: AdminCoursesParams = {}) {
  return useQuery({
    queryKey: [
      "admin-courses",
      {
        search: params.search,
        categoryId: params.categoryId,
        level: params.level,
        status: params.status,
        page: params.page,
        pageSize: params.pageSize,
      },
    ],
    queryFn: () =>
      apiFetch<Page<CourseListItem>>("/courses/admin", {
        searchParams: {
          search: params.search,
          category_id: params.categoryId,
          level: params.level,
          status: params.status,
          page: params.page,
          page_size: params.pageSize,
        },
      }),
  })
}

export function useAdminCourse(courseId: string | null | undefined) {
  return useQuery({
    queryKey: ["admin-course", courseId],
    queryFn: () => apiFetch<CourseDetail>(`/courses/admin/${courseId}`),
    enabled: Boolean(courseId),
  })
}

export function useCreateCourse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<CourseDetail>) =>
      apiFetch<CourseDetail>("/courses/admin", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] })
    },
  })
}

export function useUpdateCourse(courseId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<CourseDetail>) =>
      apiFetch<CourseDetail>(`/courses/admin/${courseId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] })
      queryClient.invalidateQueries({ queryKey: ["admin-course", courseId] })
    },
  })
}

export function useDeleteCourse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (courseId: string) =>
      apiFetch<void>(`/courses/admin/${courseId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] })
    },
  })
}

// --- Sections ---
export function useCreateSection(courseId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { title: string; description?: string; order_index?: number }) =>
      apiFetch<CourseSection>(`/courses/admin/${courseId}/sections`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-course", courseId] })
    },
  })
}

export function useUpdateSection(courseId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      sectionId,
      data,
    }: {
      sectionId: string
      data: { title?: string; description?: string; order_index?: number }
    }) =>
      apiFetch<CourseSection>(`/courses/admin/sections/${sectionId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-course", courseId] })
    },
  })
}

export function useDeleteSection(courseId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (sectionId: string) =>
      apiFetch<void>(`/courses/admin/sections/${sectionId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-course", courseId] })
    },
  })
}

export function useReorderSections(courseId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (sections: { id: string; order_index: number }[]) =>
      apiFetch<{ message: string }>(`/courses/admin/${courseId}/sections/reorder`, {
        method: "POST",
        body: JSON.stringify({ sections }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-course", courseId] })
    },
  })
}

// --- Lessons ---
export function useCreateLesson(courseId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      sectionId,
      data,
    }: {
      sectionId: string
      data: Partial<CourseLesson>
    }) =>
      apiFetch<CourseLesson>(`/courses/admin/sections/${sectionId}/lessons`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-course", courseId] })
    },
  })
}

export function useUpdateLesson(courseId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      lessonId,
      data,
    }: {
      lessonId: string
      data: Partial<CourseLesson>
    }) =>
      apiFetch<CourseLesson>(`/courses/admin/lessons/${lessonId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-course", courseId] })
    },
  })
}

export function useDeleteLesson(courseId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (lessonId: string) =>
      apiFetch<void>(`/courses/admin/lessons/${lessonId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-course", courseId] })
    },
  })
}

export function useReorderLessons(courseId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (lessons: { id: string; order_index: number; section_id?: string }[]) =>
      apiFetch<{ message: string }>(`/courses/admin/${courseId}/lessons/reorder`, {
        method: "POST",
        body: JSON.stringify({ lessons }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-course", courseId] })
    },
  })
}

// --- Attachments ---
export function useAddAttachment(courseId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      lessonId,
      data,
    }: {
      lessonId: string
      data: { file_name: string; file_url: string; file_size_bytes: number; file_type: string }
    }) =>
      apiFetch<LessonAttachment>(`/courses/admin/lessons/${lessonId}/attachments`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-course", courseId] })
    },
  })
}

export function useDeleteAttachment(courseId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (attachmentId: string) =>
      apiFetch<void>(`/courses/admin/attachments/${attachmentId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-course", courseId] })
    },
  })
}

// --- Upload Intent & Direct Upload to Cloudflare R2 ---
export function useGetUploadIntent() {
  return useMutation({
    mutationFn: (data: DirectUploadIntentRequest) =>
      apiFetch<DirectUploadIntentResponse>("/courses/admin/upload-intent", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  })
}

export async function uploadDirectToR2(
  uploadUrl: string,
  file: File,
  onProgress?: (percent: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("PUT", uploadUrl, true)
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream")

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100)
          onProgress(percent)
        }
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve()
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`))
      }
    }

    xhr.onerror = () => {
      reject(new Error("Network error during upload to Cloudflare R2"))
    }

    xhr.send(file)
  })
}

// --- Public LMS & Classroom Hooks ---
export function useEnrollCourse(slug: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () =>
      apiFetch(`/courses/${encodeURIComponent(slug)}/enroll`, {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["public-course", slug] })
    },
  })
}

export function useClassroomLesson(slug: string, lessonId: string | null) {
  return useQuery({
    queryKey: ["classroom-lesson", slug, lessonId],
    queryFn: () =>
      apiFetch<ClassroomLesson>(`/courses/${encodeURIComponent(slug)}/lessons/${lessonId}`),
    enabled: Boolean(slug && lessonId),
  })
}

export function useUpdateLessonProgress(slug: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      lessonId,
      isCompleted,
      lastWatchedSecond,
    }: {
      lessonId: string
      isCompleted: boolean
      lastWatchedSecond?: number
    }) =>
      apiFetch<ClassroomLesson>(
        `/courses/${encodeURIComponent(slug)}/lessons/${lessonId}/progress`,
        {
          method: "POST",
          body: JSON.stringify({
            is_completed: isCompleted,
            last_watched_second: lastWatchedSecond ?? 0,
          }),
        }
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["classroom-lesson", slug, variables.lessonId],
      })
      queryClient.invalidateQueries({ queryKey: ["public-course", slug] })
    },
  })
}
