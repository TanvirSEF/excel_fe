import { notFound, permanentRedirect } from "next/navigation"
import { getSeriesBySlug } from "@/lib/api/series"
import { ApiClientError } from "@/lib/api/error"

interface SeriesPageProps {
  params: Promise<{ slug: string }>
}

export default async function SeriesRedirectPage({ params }: SeriesPageProps) {
  const { slug } = await params
  try {
    const { series } = await getSeriesBySlug(slug, { page: 1, page_size: 1 })
    const catSlug = series.category?.slug ?? "category"
    permanentRedirect(`/${catSlug}/${series.slug}/`)
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 404) {
      notFound()
    }
    throw error
  }
}
