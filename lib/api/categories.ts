import { serverFetch } from "@/lib/api/server-fetch"
import type { Category, CategoryWithPosts } from "@/types/api"

export function getCategories(revalidate = 86400) {
  return serverFetch<Category[]>("/categories", { revalidate, tags: ["categories"] })
}

export function getCategoryWithPosts(
  slug: string,
  { page = 1, page_size = 12 }: { page?: number; page_size?: number } = {},
  revalidate = 3600
) {
  return serverFetch<CategoryWithPosts>(
    `/categories/${encodeURIComponent(slug)}`,
    {
      revalidate,
      tags: ["category", slug],
      searchParams: { page, page_size },
    }
  )
}
