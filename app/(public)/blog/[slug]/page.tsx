import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { BlockRenderer } from "@/components/blocks/block-renderer"
import { Toc } from "@/components/blocks/toc"
import { Time } from "@/components/shared/time"
import { ApiClientError } from "@/lib/api/error"
import { getPostBySlug } from "@/lib/api/posts"
import { extractToc } from "@/lib/blocks"
import { config } from "@/lib/config"
import type { PostDetail } from "@/types/api"

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

async function loadPost(slug: string): Promise<PostDetail> {
  try {
    return await getPostBySlug(slug)
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 404) {
      notFound()
    }
    throw error
  }
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await loadPost(slug)

  const title = post.meta_title ?? post.title
  const description = post.meta_description ?? post.excerpt ?? undefined
  const image = post.og_image_url ?? post.featured_image_url ?? undefined

  return {
    title,
    description,
    alternates: { canonical: post.canonical_url ?? `/blog/${post.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: post.canonical_url ?? `${config.siteUrl}/blog/${post.slug}`,
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      authors: [post.author_name],
      tags: post.tags.length > 0 ? post.tags : undefined,
      images: image,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image,
    },
  }
}

function buildJsonLd(post: PostDetail) {
  const image = post.og_image_url ?? post.featured_image_url
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": post.schema_type || "TechArticle",
    headline: post.title,
    description: post.meta_description ?? post.excerpt,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: { "@type": "Person", name: post.author_name },
    publisher: {
      "@type": "Organization",
      name: "Excel Insider",
      url: config.siteUrl,
    },
    mainEntityOfPage: `${config.siteUrl}/blog/${post.slug}`,
  }
  if (image) data.image = [image]

  return JSON.stringify(data)
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const post = await loadPost(slug)

  const toc = extractToc(post.content_json?.blocks ?? [])

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-4 py-10 sm:py-12 xl:grid-cols-[minmax(0,1fr)_220px]">
      <article className="mx-auto w-full max-w-3xl xl:mx-0">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground"
        >
          <Link href="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <span aria-hidden>/</span>
          {post.category_slug ? (
            <>
              <Link
                href={`/categories/${post.category_slug}`}
                className="transition-colors hover:text-foreground"
              >
                {post.category_name}
              </Link>
              <span aria-hidden>/</span>
            </>
          ) : null}
          <span className="line-clamp-1 text-foreground/70">{post.title}</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="font-medium text-foreground/80">
              {post.author_name}
            </span>
            {post.published_at ? (
              <>
                <span aria-hidden>·</span>
                <Time date={post.published_at} variant="full" />
              </>
            ) : null}
            {post.reading_time_minutes ? (
              <>
                <span aria-hidden>·</span>
                <span>{post.reading_time_minutes} min read</span>
              </>
            ) : null}
          </div>
        </header>

        {post.featured_image_url ? (
          <div className="relative mb-8 aspect-video overflow-hidden rounded-xl border">
            <Image
              src={post.featured_image_url}
              alt=""
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        ) : null}

        <BlockRenderer blocks={post.content_json?.blocks ?? []} />

        {post.tags.length > 0 ? (
          <footer className="mt-10 flex flex-wrap items-center gap-2 border-t pt-6">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="rounded-full border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
              >
                #{tag}
              </Link>
            ))}
          </footer>
        ) : null}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: buildJsonLd(post) }}
        />
      </article>

      <aside className="hidden xl:block">
        <div className="sticky top-20">
          <Toc entries={toc} />
        </div>
      </aside>
    </div>
  )
}
