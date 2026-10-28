import { serverFetch } from "@/lib/api/server-fetch"
import type { SeriesSummary, SeriesWithPosts } from "@/types/api"

export function getSeries(category?: string, revalidate = 86400) {
  return serverFetch<SeriesSummary[]>("/series", {
    revalidate,
    tags: ["series"],
    searchParams: { category },
  })
}

export function getSeriesBySlug(
  slug: string,
  { page = 1, page_size = 24 }: { page?: number; page_size?: number } = {},
  revalidate = 86400
) {
  return serverFetch<SeriesWithPosts>(`/series/${encodeURIComponent(slug)}`, {
    revalidate,
    tags: ["series", slug],
    searchParams: { page, page_size },
  })
}
