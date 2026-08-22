import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { BlockRenderer } from "@/components/blocks/block-renderer"
import { Toc } from "@/components/blocks/toc"
import { ArticleHeader } from "@/components/site/article-header"
import { ArticleTags } from "@/components/site/article-tags"
import { Breadcrumb } from "@/components/site/breadcrumb"
import { CommentsSection } from "@/components/site/comments-section"
import { NewsletterForm } from "@/components/site/newsletter/newsletter-form"
import { ApiClientError } from "@/lib/api/error"
import { getPostBySlug, getPostComments } from "@/lib/api/posts"
import { extractToc } from "@/lib/blocks"
import { buildArticleJsonLd } from "@/lib/seo"
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
  const image = post.og_image_url ?? post.featured_image_url ?? "/og-default.png"

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
      card: "summary_large_image",
      title,
      description,
      images: image,
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const post = await loadPost(slug)
  const comments = await getPostComments(post.id).catch(() => [])

  const toc = extractToc(post.content_json?.blocks ?? [])

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    ...(post.category_slug
      ? [{ label: post.category_name ?? "", href: `/categories/${post.category_slug}` }]
      : []),
    { label: post.title },
  ]

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-4 py-10 sm:py-12 xl:grid-cols-[minmax(0,1fr)_220px]">
      <article className="mx-auto w-full max-w-3xl xl:mx-0">
        <Breadcrumb items={breadcrumbItems} />
        <ArticleHeader post={post} />
        <BlockRenderer blocks={post.content_json?.blocks ?? []} />
        <ArticleTags tags={post.tags} />
        <div className="mt-10 rounded-xl border bg-muted/30 p-5">
          <p className="text-sm font-semibold">
            Liked this? Get one practical Excel tip every week.
          </p>
          <div className="mt-3">
            <NewsletterForm source="article-footer" />
          </div>
        </div>
        <CommentsSection postId={post.id} comments={comments} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: buildArticleJsonLd(post) }}
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
