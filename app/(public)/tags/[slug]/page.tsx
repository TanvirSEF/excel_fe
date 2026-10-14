import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import slugify from "slugify"

import { Pagination } from "@/components/shared/pagination"
import { PageHeader } from "@/components/site/page-header"
import { PostGrid } from "@/components/site/post-grid"
import { getPosts } from "@/lib/api/posts"
import { getTags } from "@/lib/api/tags"
import { clamp, firstParam } from "@/lib/utils"

export const revalidate = 300

interface TagPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { slug } = await params
  const decoded = decodeURIComponent(slug)
  const normalized = slugify(decoded, { lower: true, strict: true, trim: true })

  const tags = await getTags()
  const target = tags.find(
    (t) =>
      t.slug === slug ||
      t.slug === decoded ||
      t.slug === normalized ||
      t.name.toLowerCase() === decoded.toLowerCase()
  )

  const querySlug = target?.slug ?? (normalized || slug)
  if (!target) {
    const check = await getPosts({ page: 1, page_size: 1, tag: querySlug }).catch(() => null)
    if (!check || check.total === 0) {
      return {}
    }
  }

  const label = target?.name ?? decoded
  const canonicalSlug = target?.slug ?? (normalized || slug)

  return {
    title: `#${label}`,
    description: `Excel Insider articles tagged with ${label}.`,
    alternates: { canonical: `/tags/${canonicalSlug}/` },
  }
}

export default async function TagPage({
  params,
  searchParams,
}: TagPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams])
  const page = clamp(Number(firstParam(query.page) ?? 1) || 1, 1, 10_000)

  const decoded = decodeURIComponent(slug)
  const normalized = slugify(decoded, { lower: true, strict: true, trim: true })

  const tags = await getTags()
  const target = tags.find(
    (t) =>
      t.slug === slug ||
      t.slug === decoded ||
      t.slug === normalized ||
      t.name.toLowerCase() === decoded.toLowerCase()
  )

  if (target && target.slug !== slug) {
    permanentRedirect(`/tags/${target.slug}/`)
  }

  const querySlug = target?.slug ?? (normalized || slug)
  const label = target?.name ?? decoded

  const posts = await getPosts({ page, page_size: 12, tag: querySlug })

  if (!target && posts.total === 0) {
    notFound()
  }

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
          pathname={`/tags/${querySlug}/`}
        />
      </div>
    </div>
  )
}
