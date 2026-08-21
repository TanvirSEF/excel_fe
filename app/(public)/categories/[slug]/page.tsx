import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { EmptyState } from "@/components/shared/empty-state"
import { Pagination } from "@/components/shared/pagination"
import { PostCard } from "@/components/site/post-card"
import { getCategoryWithPosts } from "@/lib/api/categories"
import { ApiClientError } from "@/lib/api/error"
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

  const { category, posts } = await loadCategory(slug, page)

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground"
      >
        <Link
          href="/categories"
          className="transition-colors hover:text-foreground"
        >
          Categories
        </Link>
        <span aria-hidden>/</span>
        <span className="text-foreground/70">{category.name}</span>
      </nav>

      <header className="mb-8 border-b pb-8">
        <div className="flex items-center gap-3">
          {category.color_hex ? (
            <span
              className="size-3 rounded-full"
              style={{ backgroundColor: category.color_hex }}
              aria-hidden
            />
          ) : null}
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {category.name}
          </h1>
        </div>
        {category.description ? (
          <p className="mt-3 max-w-2xl text-balance text-sm text-muted-foreground sm:text-base">
            {category.description}
          </p>
        ) : null}
        <p className="mt-3 text-sm text-muted-foreground">
          {posts.total} {posts.total === 1 ? "article" : "articles"}
        </p>
      </header>

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
              pathname={`/categories/${category.slug}`}
            />
          </div>
        </>
      ) : (
        <EmptyState
          title="No articles in this category yet"
          description="Once posts are published here they'll show up in this list."
        />
      )}
    </div>
  )
}
