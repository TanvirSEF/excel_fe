import type { Metadata } from "next"

import { EmptyState } from "@/components/shared/empty-state"
import { Pagination } from "@/components/shared/pagination"
import { PostCard } from "@/components/site/post-card"
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
      <header className="mb-8 border-b pb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="text-primary">#</span>
          {label}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {posts.total} {posts.total === 1 ? "article" : "articles"} tagged
          with &ldquo;{label}&rdquo;
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
              pathname={`/tags/${slug}`}
            />
          </div>
        </>
      ) : (
        <EmptyState
          title="No articles with this tag"
          description="Try browsing the blog or categories instead."
        />
      )}
    </div>
  )
}
