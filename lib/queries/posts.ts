import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

import { apiFetch } from "@/lib/api/api-fetch"
import type { Page, PostAdminItem, PostStatus } from "@/types/api"

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
