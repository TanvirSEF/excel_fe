import type { Metadata } from "next"

import { Pagination } from "@/components/shared/pagination"
import { PageHeader } from "@/components/site/page-header"
import { PostGrid } from "@/components/site/post-grid"
import { getPosts } from "@/lib/api/posts"
import { getTags } from "@/lib/api/tags"
import { clamp, firstParam } from "@/lib/utils"

interface TagPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { slug } = await params
  const tags = await getTags()
  const label = tags.find((t) => t.slug === slug)?.name ?? slug

  return {
    title: `#${label}`,
    description: `Excel Insider articles tagged with ${label}.`,
    alternates: { canonical: `/tags/${slug}` },
  }
}

export default async function TagPage({
  params,
  searchParams,
}: TagPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams])
  const page = clamp(Number(firstParam(query.page) ?? 1) || 1, 1, 10_000)

  const [posts, tags] = await Promise.all([
    getPosts({ page, page_size: 12, tag: slug }),
    getTags(),
  ])

  const label = tags.find((t) => t.slug === slug)?.name ?? slug

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <PageHeader
        bordered
        title={
          <>
            <span className="text-primary">#</span>
            {label}
          </>
        }
        meta={`${posts.total} ${posts.total === 1 ? "article" : "articles"} tagged with “${label}”`}
      />

      <PostGrid
        posts={posts.items}
        emptyTitle="No articles with this tag"
        emptyDescription="Try browsing the blog or categories instead."
      />

      <div className="mt-10">
        <Pagination
          page={page}
          totalPages={posts.total_pages}
          pathname={`/tags/${slug}`}
        />
      </div>
    </div>
  )
}
