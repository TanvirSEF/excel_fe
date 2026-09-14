import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { Pagination } from "@/components/shared/pagination"
import { Breadcrumb } from "@/components/site/breadcrumb"
import { PageHeader } from "@/components/site/page-header"
import { PostGrid } from "@/components/site/post-grid"
import { getSeriesBySlug } from "@/lib/api/series"
import { ApiClientError } from "@/lib/api/error"
import { buildSeriesJsonLd } from "@/lib/seo"
import { clamp, firstParam } from "@/lib/utils"

interface SeriesPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function loadSeries(slug: string, page: number) {
  try {
    return await getSeriesBySlug(slug, { page, page_size: 24 })
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 404) {
      notFound()
    }
    throw error
  }
}

export async function generateMetadata({
  params,
}: SeriesPageProps): Promise<Metadata> {
  const { slug } = await params
  const { series } = await loadSeries(slug, 1)

  return {
    title: series.seo_title ?? series.name,
    description:
      series.seo_description ??
      series.description ??
      `${series.name} — step-by-step lessons in order.`,
    alternates: { canonical: `/series/${series.slug}` },
  }
}

export default async function SeriesPage({ params, searchParams }: SeriesPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams])
  const page = clamp(Number(firstParam(query.page) ?? 1) || 1, 1, 10_000)

  const { series, posts } = await loadSeries(slug, page)

  const breadcrumbItems = [
    { label: "Categories", href: "/categories" },
    ...(series.category
      ? [
          {
            label: series.category.name,
            href: `/categories/${series.category.slug}`,
          },
        ]
      : []),
    { label: series.name },
  ]

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildSeriesJsonLd(series, posts.items) }}
      />
      <Breadcrumb items={breadcrumbItems} />

      <PageHeader
        bordered
        title={series.name}
        description={series.description ?? undefined}
        meta={`${posts.total} ${posts.total === 1 ? "lesson" : "lessons"} in order`}
      />

      <PostGrid
        posts={posts.items}
        emptyTitle="No lessons in this series yet"
        emptyDescription="Once lessons are published here they'll show up in order."
      />

      <div className="mt-10">
        <Pagination
          page={page}
          totalPages={posts.total_pages}
          pathname={`/series/${series.slug}`}
        />
      </div>
    </div>
  )
}
