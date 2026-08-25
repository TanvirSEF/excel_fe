import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

import { apiFetch, apiUpload } from "@/lib/api/api-fetch"
import type {
  DownloadableAsset,
  Page,
  PostAdminItem,
  PostCreateInput,
  PostDetail,
  PostListItem,
  PostStatus,
  PostUpdateInput,
  SeoUpdateInput,
} from "@/types/api"

export interface AdminPostsParams {
  status?: PostStatus
  page?: number
  page_size?: number
}

export function useAdminPosts(params: AdminPostsParams = {}) {
  return useQuery({
    queryKey: ["admin-posts", { status: params.status, page: params.page }],
    queryFn: () =>
      apiFetch<Page<PostAdminItem>>("/posts/admin", {
        searchParams: {
          status: params.status,
          page: params.page,
          page_size: params.page_size,
        },
      }),
  })
}

export function usePost(postId: string | undefined) {
  return useQuery({
    queryKey: ["post", "edit", postId],
    enabled: Boolean(postId),
    queryFn: () => apiFetch<PostDetail>(`/posts/${postId}`),
  })
}

export function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: PostCreateInput) =>
      apiFetch<PostDetail>("/posts", { method: "POST", body: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] })
    },
  })
}

export function useUpdatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      postId,
      input,
    }: {
      postId: string
      input: PostUpdateInput
    }) =>
      apiFetch<PostDetail>(`/posts/${postId}`, {
        method: "PATCH",
        body: input,
      }),
    onSuccess: (post) => {
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] })
      queryClient.invalidateQueries({
        queryKey: ["post", "edit", post.id],
      })
    },
  })
}

export function useDeletePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: string) =>
      apiFetch<{ message: string }>(`/posts/${postId}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] })
    },
  })
}

function useInvalidatePost(postId: string) {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: ["admin-posts"] })
    queryClient.invalidateQueries({ queryKey: ["posts"] })
    queryClient.invalidateQueries({ queryKey: ["post", "edit", postId] })
  }
}

export function useSubmitReview(postId: string) {
  const invalidate = useInvalidatePost(postId)

  return useMutation({
    mutationFn: () =>
      apiFetch<PostDetail>(`/posts/${postId}/submit-review`, {
        method: "POST",
      }),
    onSuccess: invalidate,
  })
}

export function usePublishPost(postId: string) {
  const invalidate = useInvalidatePost(postId)

  return useMutation({
    mutationFn: () =>
      apiFetch<PostDetail>(`/posts/${postId}/publish`, { method: "POST" }),
    onSuccess: invalidate,
  })
}

export function useRejectPost(postId: string) {
  const invalidate = useInvalidatePost(postId)

  return useMutation({
    mutationFn: (reason: string) =>
      apiFetch<PostDetail>(`/posts/${postId}/reject`, {
        method: "POST",
        body: { reason },
      }),
    onSuccess: invalidate,
  })
}

export function useSchedulePost(postId: string) {
  const invalidate = useInvalidatePost(postId)

  return useMutation({
    mutationFn: (scheduledAt: string) =>
      apiFetch<PostDetail>(`/posts/${postId}/schedule`, {
        method: "POST",
        body: { scheduled_at: scheduledAt },
      }),
    onSuccess: invalidate,
  })
}

export function useUpdateSeo(postId: string) {
  const invalidate = useInvalidatePost(postId)

  return useMutation({
    mutationFn: (input: SeoUpdateInput) =>
      apiFetch<PostDetail>(`/posts/${postId}/seo`, {
        method: "PATCH",
        body: input,
      }),
    onSuccess: invalidate,
  })
}

export function usePublishedPosts(page: number) {
  return useQuery({
    queryKey: ["posts", "published", page],
    queryFn: () =>
      apiFetch<Page<PostListItem>>("/posts", {
        searchParams: { page, page_size: 10 },
      }),
  })
}

export function usePostsByCategory(
  categorySlug: string | undefined,
  pageSize = 6,
  initialData?: Page<PostListItem>
) {
  return useQuery({
    queryKey: ["posts", "by-category", categorySlug, pageSize],
    enabled: Boolean(categorySlug),
    initialData,
    queryFn: () =>
      apiFetch<Page<PostListItem>>("/posts", {
        searchParams: { category: categorySlug, page_size: pageSize },
      }),
  })
}

export function usePostAssets(postId: string | undefined) {
  return useQuery({
    queryKey: ["post-assets", postId],
    enabled: Boolean(postId),
    queryFn: () => apiFetch<DownloadableAsset[]>(`/posts/${postId}/assets`),
  })
}

export function useUploadAsset(postId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) =>
      apiUpload<DownloadableAsset>(`/posts/${postId}/assets`, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-assets", postId] })
    },
  })
}

export function useDeleteAsset(postId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (assetId: string) =>
      apiFetch<{ message: string }>(`/assets/${assetId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-assets", postId] })
    },
  })
}
