import type { Metadata } from "next"
import Link from "next/link"

import { EmptyState } from "@/components/shared/empty-state"
import { Pagination } from "@/components/shared/pagination"
import { CategoryFilter } from "@/components/site/category-filter"
import { PostCard } from "@/components/site/post-card"
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

  function tagHref(slug: string) {
    const search = new URLSearchParams()
    if (category) search.set("category", category)
    search.set("tag", slug)
    return `/blog?${search.toString()}`
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Blog</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {posts.total} {posts.total === 1 ? "article" : "articles"}
        </p>
      </header>

      <div className="mb-8 flex flex-col gap-3 border-y py-4 sm:flex-row sm:items-center sm:justify-between">
        <CategoryFilter
          categories={categories}
          current={category}
          extraParams={{ tag }}
        />
        {tags.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5">
            {tags.map((t) => (
              <Link
                key={t.id}
                href={tagHref(t.slug)}
                className={
                  t.slug === tag
                    ? "rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground"
                    : "rounded-full border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                }
              >
                {t.name}
              </Link>
            ))}
          </div>
        ) : null}
      </div>

      {posts.items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.items.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <div className="mt-10">
            <Pagination
              page={page}
              totalPages={posts.total_pages}
              pathname="/blog"
              searchParams={{ category, tag }}
            />
          </div>
        </>
      ) : (
        <EmptyState
          title="No articles yet"
          description="Nothing published here for now — check back soon."
        />
      )}
    </div>
  )
}
