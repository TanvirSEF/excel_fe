import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

import { apiFetch } from "@/lib/api/api-fetch"
import type {
  Page,
  PostAdminItem,
  PostCreateInput,
  PostDetail,
  PostStatus,
  PostUpdateInput,
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
