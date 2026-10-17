import { Pagination } from "@/components/shared/pagination"
import { Breadcrumb } from "@/components/site/breadcrumb"
import { PageHeader } from "@/components/site/page-header"
import { PostGrid } from "@/components/site/post-grid"
import { buildSeriesJsonLd } from "@/lib/seo"
import type { Page, PostListItem, SeriesSummary } from "@/types/api"

interface SeriesViewProps {
  series: SeriesSummary
  posts: Page<PostListItem>
  page: number
}

export function SeriesView({ series, posts, page }: SeriesViewProps) {
  const categorySlug = series.category?.slug ?? "category"
  const canonicalPath = `/${categorySlug}/${series.slug}/`

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    ...(series.category
      ? [
          {
            label: series.category.name,
            href: `/category/${series.category.slug}/`,
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
          pathname={canonicalPath}
        />
      </div>
    </div>
  )
}
