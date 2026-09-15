import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { IconCalendar, IconNews } from "@tabler/icons-react"

import { Pagination } from "@/components/shared/pagination"
import { Time } from "@/components/shared/time"
import { Breadcrumb } from "@/components/site/breadcrumb"
import { PostGrid } from "@/components/site/post-grid"
import { getAuthor } from "@/lib/api/authors"
import { getPosts } from "@/lib/api/posts"
import { ApiClientError } from "@/lib/api/error"
import { clamp, firstParam } from "@/lib/utils"

interface AuthorPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function loadAuthor(id: string) {
  try {
    return await getAuthor(id)
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 404) {
      notFound()
    }
    throw error
  }
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("")
}

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { id } = await params
  const author = await loadAuthor(id)

  return {
    title: `${author.name} — Articles & Tutorials | Excel Insider`,
    description:
      author.bio ??
      `${author.post_count} spreadsheet guides and tutorials written by ${author.name}.`,
    alternates: { canonical: `/authors/${author.id}` },
  }
}

export default async function AuthorPage({ params, searchParams }: AuthorPageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams])
  const page = clamp(Number(firstParam(query.page) ?? 1) || 1, 1, 10_000)

  const author = await loadAuthor(id)
  const posts = await getPosts({ author: author.id, page, page_size: 12 })

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: author.name }]}
      />

      <header className="mt-6 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 sm:p-8">
        <div className="flex flex-wrap items-start gap-5">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/15 text-xl font-bold text-primary ring-2 ring-primary/20">
            {author.avatar_url ? (
              <Image
                src={author.avatar_url}
                alt={author.name}
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              initials(author.name)
            )}
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {author.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <IconNews className="h-4 w-4 text-primary/70" />
                {author.post_count} {author.post_count === 1 ? "article" : "articles"}
              </span>
              <span className="flex items-center gap-1.5">
                <IconCalendar className="h-4 w-4 text-primary/70" />
                Writing here since <Time date={author.joined_at} variant="date" />
              </span>
            </div>
            {author.bio ? (
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {author.bio}
              </p>
            ) : null}
          </div>
        </div>
      </header>

      <div className="mt-10">
        <PostGrid
          posts={posts.items}
          emptyTitle="No articles yet"
          emptyDescription="Articles by this author will appear here once published."
        />
      </div>

      <div className="mt-10">
        <Pagination
          page={page}
          totalPages={posts.total_pages}
          pathname={`/authors/${author.id}`}
        />
      </div>
    </div>
  )
}
