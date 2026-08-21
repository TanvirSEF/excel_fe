import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

import { apiFetch } from "@/lib/api/api-fetch"
import type {
  CommentAdminItem,
  CommentStatus,
  Page,
} from "@/types/api"

export function useCommentsQueue(params: {
  status?: CommentStatus
  page?: number
}) {
  return useQuery({
    queryKey: ["comments-queue", { status: params.status, page: params.page }],
    queryFn: () =>
      apiFetch<Page<CommentAdminItem>>("/comments", {
        searchParams: {
          status: params.status,
          page: params.page,
          page_size: 10,
        },
      }),
  })
}

export function useModerateComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      commentId,
      status,
    }: {
      commentId: string
      status: CommentStatus
    }) =>
      apiFetch<CommentAdminItem>(`/comments/${commentId}/moderate`, {
        method: "PATCH",
        body: { status },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments-queue"] })
    },
  })
}

export function useDeleteComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (commentId: string) =>
      apiFetch<{ message: string }>(`/comments/${commentId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments-queue"] })
    },
  })
}
