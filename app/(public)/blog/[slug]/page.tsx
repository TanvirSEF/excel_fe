import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { IconSparkles } from "@tabler/icons-react"

import { BlockRenderer } from "@/components/blocks/block-renderer"
import { MobileToc } from "@/components/blocks/mobile-toc"
import { Toc } from "@/components/blocks/toc"
import { ArticleHeader } from "@/components/site/article-header"
import { ArticleTags } from "@/components/site/article-tags"
import { Breadcrumb } from "@/components/site/breadcrumb"
import { CommentsSection } from "@/components/site/comments-section"
import { NewsletterForm } from "@/components/site/newsletter/newsletter-form"
import { PostSection } from "@/components/site/post-section"
import { ReadingProgress } from "@/components/site/reading-progress"
import { ApiClientError } from "@/lib/api/error"
import { getPostBySlug, getPostComments, getPosts } from "@/lib/api/posts"
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

  const related = post.category_slug
    ? await getPosts({ category: post.category_slug, page_size: 4 }, 300)
        .then((page) =>
          page.items.filter((item) => item.id !== post.id).slice(0, 3)
        )
        .catch(() => [])
    : []

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    ...(post.category_slug
      ? [{ label: post.category_name ?? "", href: `/categories/${post.category_slug}` }]
      : []),
    { label: post.title },
  ]

  return (
    <>
      <ReadingProgress />
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-4 py-10 sm:py-12 xl:grid-cols-[minmax(0,1fr)_220px]">
        <article className="mx-auto w-full max-w-3xl xl:mx-0">
          <Breadcrumb items={breadcrumbItems} />
          <ArticleHeader post={post} />

          <MobileToc entries={toc} />

          <BlockRenderer blocks={post.content_json?.blocks ?? []} />
          <ArticleTags tags={post.tags} />

          <div className="relative mt-10 overflow-hidden rounded-2xl bg-gradient-to-bl from-chart-2 via-primary to-chart-5 p-6 text-primary-foreground shadow-xl sm:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-white/8 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-bl from-white/10 via-transparent to-transparent"
            />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-3 py-1 text-xs font-semibold text-primary-foreground/90">
                <IconSparkles className="h-3.5 w-3.5" />
                Free Weekly Tips
              </span>
              <p className="mt-3 text-lg font-bold tracking-tight text-balance">
                Liked this? Get one practical Excel tip every week.
              </p>
              <div className="mt-4">
                <NewsletterForm source="article-footer" variant="band" />
              </div>
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

      {related.length > 0 ? (
        <div className="border-t border-border/60">
          <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
            <PostSection
              title="Related Articles"
              subtitle={`More from ${post.category_name}`}
              badge="Keep Reading"
              posts={related}
            />
          </div>
        </div>
      ) : null}
    </>
  )
}
