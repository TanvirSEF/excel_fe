import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

import { apiFetch, apiUpload } from "@/lib/api/api-fetch"
import type { MediaItem, Page } from "@/types/api"

export interface MediaListParams {
  folder?: string
  page?: number
  page_size?: number
}

export function useMediaList(params: MediaListParams = {}) {
  return useQuery({
    queryKey: ["media", "list", { folder: params.folder, page: params.page }],
    queryFn: () =>
      apiFetch<Page<MediaItem>>("/media", {
        searchParams: {
          folder: params.folder,
          page: params.page,
          page_size: params.page_size,
        },
      }),
  })
}

export function useMediaFolders() {
  return useQuery({
    queryKey: ["media", "folders"],
    queryFn: () =>
      apiFetch<Page<MediaItem>>("/media", {
        searchParams: { page_size: 50 },
      }),
    select: (data) =>
      Array.from(
        new Set(
          data.items
            .map((item) => item.folder)
            .filter((folder) => folder.length > 0)
        )
      ).sort(),
    staleTime: 5 * 60_000,
  })
}

export function useUploadMedia() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ file, folder }: { file: File; folder?: string }) =>
      apiUpload<MediaItem>(
        "/media/upload",
        file,
        folder ? { folder } : {}
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] })
    },
  })
}

export function useUpdateMedia() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      mediaId,
      input,
    }: {
      mediaId: string
      input: { alt_text?: string; folder?: string }
    }) =>
      apiFetch<MediaItem>(`/media/${mediaId}`, {
        method: "PATCH",
        body: input,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] })
    },
  })
}

export function useDeleteMedia() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (mediaId: string) =>
      apiFetch<{ message: string }>(`/media/${mediaId}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] })
    },
  })
}
