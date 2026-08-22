import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

import { apiFetch } from "@/lib/api/api-fetch"
import type {
  Category,
  Tag,
} from "@/types/api"
import type { ReorderEntry } from "@/lib/category-tree"

export interface CategoryInput {
  name: string
  slug?: string
  parent_id?: string | null
  order_index?: number
  description?: string | null
  icon_url?: string | null
  color_hex?: string | null
  is_featured?: boolean
  seo_title?: string | null
  seo_description?: string | null
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => apiFetch<Category[]>("/categories"),
    staleTime: 5 * 60_000,
  })
}

export function useTags() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: () => apiFetch<Tag[]>("/tags"),
    staleTime: 5 * 60_000,
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CategoryInput) =>
      apiFetch<Category>("/categories", { method: "POST", body: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      categoryId,
      input,
    }: {
      categoryId: string
      input: Partial<CategoryInput>
    }) =>
      apiFetch<Category>(`/categories/${categoryId}`, {
        method: "PATCH",
        body: input,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
  })
}

export function useReorderCategories() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (items: ReorderEntry[]) =>
      apiFetch<Category[]>("/categories/reorder", {
        method: "PATCH",
        body: items,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (categoryId: string) =>
      apiFetch<{ message: string }>(`/categories/${categoryId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
  })
}

export function useCreateTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ name, slug }: { name: string; slug?: string }) =>
      apiFetch<Tag>("/tags", { method: "POST", body: { name, slug } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] })
    },
  })
}
