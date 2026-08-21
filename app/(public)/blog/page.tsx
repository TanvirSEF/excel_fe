import type { Metadata } from "next"

import { Pagination } from "@/components/shared/pagination"
import { BlogFilters } from "@/components/site/blog-filters"
import { PageHeader } from "@/components/site/page-header"
import { PostGrid } from "@/components/site/post-grid"
import { getCategories } from "@/lib/api/categories"
import { getPosts } from "@/lib/api/posts"
import { getTags } from "@/lib/api/tags"
import { clamp, firstParam } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "All Excel Insider articles — formulas, shortcuts, Power Query, VBA and more.",
  alternates: { canonical: "/blog" },
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

  const [posts, categories, tags] = await Promise.all([
    getPosts({ page, page_size: 12, category, tag }),
    getCategories(),
    getTags(),
  ])

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <PageHeader
        title="Blog"
        meta={`${posts.total} ${posts.total === 1 ? "article" : "articles"}`}
      />

      <BlogFilters
        categories={categories}
        tags={tags}
        category={category}
        tag={tag}
      />

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
