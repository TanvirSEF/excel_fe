import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

import { apiFetch, apiUpload } from "@/lib/api/api-fetch"
import { useAuthStore } from "@/lib/auth"
import type {
  DownloadableAsset,
  Page,
  PostAdminItem,
  PostCreateInput,
  PostDetail,
  PostListItem,
  PostStatus,
  PostStatusCounts,
  PostUpdateInput,
  SeoUpdateInput,
} from "@/types/api"

export interface AdminPostsParams {
  status?: PostStatus
  categoryId?: string
  authorId?: string
  search?: string
  page?: number
  page_size?: number
}

async function revalidatePostCache(
  post?: Partial<PostDetail> | null,
  revalidateHome = false,
  previousSlug?: string
) {
  if (typeof window === "undefined" || !post) return
  try {
    const accessToken = useAuthStore.getState().accessToken
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`
    }
    await fetch("/api/revalidate/", {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify({
        slug: post.slug,
        previousSlug,
        categorySlug: post.category?.slug,
        canonicalUrl: post.canonical_url,
        path: post.canonical_url || (post.slug ? `/blog/${post.slug}` : undefined),
        revalidateHome,
      }),
    })
  } catch {
    // Non-blocking
  }
}

export function useAdminPosts(params: AdminPostsParams = {}) {
  return useQuery({
    queryKey: [
      "admin-posts",
      {
        status: params.status,
        categoryId: params.categoryId,
        authorId: params.authorId,
        search: params.search,
        page: params.page,
      },
    ],
    queryFn: () =>
      apiFetch<Page<PostAdminItem>>("/posts/admin", {
        searchParams: {
          status: params.status,
          category_id: params.categoryId || undefined,
          author_id: params.authorId || undefined,
          search: params.search || undefined,
          page: params.page,
          page_size: params.page_size,
        },
      }),
  })
}

export interface AdminPostCountsParams {
  categoryId?: string
  authorId?: string
  search?: string
}

export function useAdminPostCounts(params: AdminPostCountsParams = {}) {
  return useQuery({
    queryKey: [
      "admin-post-counts",
      {
        categoryId: params.categoryId,
        authorId: params.authorId,
        search: params.search,
      },
    ],
    queryFn: () =>
      apiFetch<PostStatusCounts>("/posts/admin/counts", {
        searchParams: {
          category_id: params.categoryId || undefined,
          author_id: params.authorId || undefined,
          search: params.search || undefined,
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
    onSuccess: (post) => {
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] })
      queryClient.invalidateQueries({ queryKey: ["admin-post-counts"] })
      if (post?.status === "published") {
        revalidatePostCache(post, true)
      }
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
      previousSlug?: string
    }) =>
      apiFetch<PostDetail>(`/posts/${postId}`, {
        method: "PATCH",
        body: input,
      }),
    onSuccess: (post, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] })
      queryClient.invalidateQueries({ queryKey: ["admin-post-counts"] })
      queryClient.invalidateQueries({
        queryKey: ["post", "edit", post.id],
      })
      revalidatePostCache(
        post,
        post?.status === "published",
        variables.previousSlug
      )
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
      queryClient.invalidateQueries({ queryKey: ["admin-post-counts"] })
      revalidatePostCache({ slug: "" }, true)
    },
  })
}

export function useSetTrendingPin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, pinned }: { postId: string; pinned: boolean }) =>
      apiFetch<PostAdminItem>(`/posts/${postId}/trending`, {
        method: "PATCH",
        body: { pinned },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] })
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      revalidatePostCache({ slug: "" }, true)
    },
  })
}

function useInvalidatePost(postId: string) {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: ["admin-posts"] })
    queryClient.invalidateQueries({ queryKey: ["admin-post-counts"] })
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
    onSuccess: (post) => {
      invalidate()
      revalidatePostCache(post, true)
    },
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
    onSuccess: (post) => {
      invalidate()
      revalidatePostCache(post, post?.status === "published")
    },
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
