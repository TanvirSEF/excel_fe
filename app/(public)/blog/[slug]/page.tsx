import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"

import { BlockRenderer } from "@/components/blocks/block-renderer"
import { MobileToc } from "@/components/blocks/mobile-toc"
import { Toc } from "@/components/blocks/toc"
import { ArticleTags } from "@/components/site/article-tags"
import { BlogArticleHeader } from "@/components/site/blog-article-header"
import { Breadcrumb } from "@/components/site/breadcrumb"
import { CommentsSection } from "@/components/site/comments-section"
import { ArticleCtaBand } from "@/components/site/newsletter/article-cta-band"
import { PostSection } from "@/components/site/post-section"
import { ReadingProgress } from "@/components/site/reading-progress"
import { ShareButtons } from "@/components/site/share-buttons"
import { ApiClientError } from "@/lib/api/error"
import { getPostBySlug, getPostComments, getPosts } from "@/lib/api/posts"
import { isGoogleSheetsCategory } from "@/lib/category-topics"
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

  if (isGoogleSheetsCategory(post.category_slug)) {
    permanentRedirect(`/google-sheets/${post.slug}`)
  }
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
      <div className="mx-auto w-full max-w-[760px] px-4 pt-8 sm:px-6 sm:pt-10">
        <Breadcrumb items={breadcrumbItems} />
        <BlogArticleHeader post={post} />
      </div>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-4 pt-10 sm:px-6 xl:grid-cols-[minmax(0,1fr)_220px]">
        <article className="mx-auto w-full max-w-[720px] xl:mx-0">
          <div className="border-y border-border/70 py-3">
            <ShareButtons title={post.title} />
          </div>

          <MobileToc entries={toc} />

          <BlockRenderer blocks={post.content_json?.blocks ?? []} />
          <ArticleTags
            tags={post.tags}
            className="rounded-2xl border border-border/70 bg-muted/40 px-5 py-4"
          />

          <ArticleCtaBand
            source="article-footer"
            heading="Liked this? Get one practical Excel tip every week."
            className="rounded-3xl p-7 shadow-2xl sm:p-10"
          />

          <CommentsSection
            postId={post.id}
            comments={comments}
            className="rounded-2xl border border-border/70 bg-card p-6 shadow-2xs sm:p-8"
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: buildArticleJsonLd(post) }}
          />
        </article>

        <aside className="hidden xl:block">
          <div className="sticky top-20 rounded-2xl border border-border/70 bg-card p-5 shadow-2xs">
            <Toc entries={toc} />
          </div>
        </aside>
      </div>

      {related.length > 0 ? (
        <div className="mt-10 border-t border-border/60 bg-muted/40">
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
