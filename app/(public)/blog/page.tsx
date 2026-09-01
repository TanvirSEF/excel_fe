import type { Metadata } from "next"

import { Pagination } from "@/components/shared/pagination"
import { BlogFilters } from "@/components/site/blog-filters"
import { PageHeader } from "@/components/site/page-header"
import { PostGrid } from "@/components/site/post-grid"
import { getCategories } from "@/lib/api/categories"
import { getPosts } from "@/lib/api/posts"
import { clamp, firstParam } from "@/lib/utils"

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}): Promise<Metadata> {
  const params = await searchParams
  const page = clamp(Number(firstParam(params.page) ?? 1) || 1, 1, 10_000)

  return {
    title: "Blog",
    description:
      "All Excel Insider articles — formulas, shortcuts, Power Query, VBA and more.",
    alternates: {
      canonical: page > 1 ? `/blog?page=${page}` : "/blog",
    },
  }
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const category = firstParam(params.category)
  const tag = firstParam(params.tag)
  const page = clamp(Number(firstParam(params.page) ?? 1) || 1, 1, 10_000)

  const [posts, categories] = await Promise.all([
    getPosts({ page, page_size: 12, category, tag }),
    getCategories(),
  ])

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <PageHeader
        title="Blog"
        meta={`${posts.total} ${posts.total === 1 ? "article" : "articles"}`}
      />

      <BlogFilters categories={categories} category={category} tag={tag} />

      <PostGrid
        posts={posts.items}
        emptyDescription="Nothing published here for now — check back soon."
      />

      <div className="mt-10">
        <Pagination
          page={page}
          totalPages={posts.total_pages}
          pathname="/blog"
          searchParams={{ category, tag }}
        />
      </div>
    </div>
  )
}
