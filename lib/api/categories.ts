import { serverFetch } from "@/lib/api/server-fetch"
import type { Category, CategoryWithPosts } from "@/types/api"

export function getCategories(revalidate = 300) {
  return serverFetch<Category[]>("/categories", { revalidate })
}

export function getCategoryWithPosts(
  slug: string,
  { page = 1, page_size = 12 }: { page?: number; page_size?: number } = {},
  revalidate = 60
) {
  return serverFetch<CategoryWithPosts>(
    `/categories/${encodeURIComponent(slug)}`,
    { revalidate, searchParams: { page, page_size } }
  )
}
