import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { Pagination } from "@/components/shared/pagination"
import { Breadcrumb } from "@/components/site/breadcrumb"
import { PageHeader } from "@/components/site/page-header"
import { PostGrid } from "@/components/site/post-grid"
import { SeriesOverview } from "@/components/site/series-overview"
import { getCategoryWithPosts } from "@/lib/api/categories"
import { ApiClientError } from "@/lib/api/error"
import { getSeries } from "@/lib/api/series"
import { clamp, firstParam } from "@/lib/utils"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function loadCategory(slug: string, page: number) {
  try {
    return await getCategoryWithPosts(slug, { page, page_size: 12 })
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 404) {
      notFound()
    }
    throw error
  }
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const { category } = await loadCategory(slug, 1)

  return {
    title: category.seo_title ?? category.name,
    description:
      category.seo_description ??
      category.description ??
      `Excel Insider articles in ${category.name}.`,
    alternates: { canonical: `/categories/${category.slug}` },
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams])
  const page = clamp(Number(firstParam(query.page) ?? 1) || 1, 1, 10_000)

  const [{ category, posts }, series] = await Promise.all([
    loadCategory(slug, page),
    getSeries(slug, 300).catch(() => []),
  ])

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <Breadcrumb
        items={[
          { label: "Categories", href: "/categories" },
          { label: category.name },
        ]}
      />

      <PageHeader
        bordered
        title={
          <>
            {category.color_hex ? (
              <span
                className="size-3 rounded-full"
                style={{ backgroundColor: category.color_hex }}
                aria-hidden
              />
            ) : null}
            {category.name}
          </>
        }
        description={category.description ?? undefined}
        meta={`${posts.total} ${posts.total === 1 ? "article" : "articles"}`}
      />

      <SeriesOverview series={series} />

      <PostGrid
        posts={posts.items}
        emptyTitle="No articles in this category yet"
        emptyDescription="Once posts are published here they'll show up in this list."
      />

      <div className="mt-10">
        <Pagination
          page={page}
          totalPages={posts.total_pages}
          pathname={`/categories/${category.slug}`}
        />
      </div>
    </div>
  )
}
