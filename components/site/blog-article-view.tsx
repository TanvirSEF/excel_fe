import type { Metadata } from "next"

import { BlockRenderer } from "@/components/blocks/block-renderer"
import { ArticleTags } from "@/components/site/article-tags"
import { BlogArticleHeader } from "@/components/site/blog-article-header"
import { Breadcrumb } from "@/components/site/breadcrumb"
import { CommentsSection } from "@/components/site/comments-section"
import { ArticleCtaBand } from "@/components/site/newsletter/article-cta-band"
import { PostSection } from "@/components/site/post-section"
import { ReadingProgress } from "@/components/site/reading-progress"
import { ShareButtons } from "@/components/site/share-buttons"
import { getPostComments, getPosts } from "@/lib/api/posts"
import { extractToc } from "@/lib/blocks"
import { config } from "@/lib/config"
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo"
import type { PostDetail } from "@/types/api"

export function buildPostMetadata(
  post: PostDetail,
  explicitCanonicalPath?: string
): Metadata {
  const title = post.meta_title ?? post.title
  const description = post.meta_description ?? post.excerpt ?? undefined
  const image = post.og_image_url ?? post.featured_image_url ?? "/og-default.png"
  const rawPath = explicitCanonicalPath
    ? explicitCanonicalPath.startsWith("/")
      ? explicitCanonicalPath
      : `/${explicitCanonicalPath}`
    : post.canonical_url ?? `/blog/${post.slug}`
  const canonicalPath = rawPath.endsWith("/") ? rawPath : `${rawPath}/`

  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${config.siteUrl}${canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`}`,
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

interface BlogArticleViewProps {
  post: PostDetail
  currentPath?: string
}

export async function BlogArticleView({ post }: BlogArticleViewProps) {
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
    { label: "Blog", href: "/blog" },
    ...(post.category_name && post.category_slug
      ? [
          {
            label: post.category_name,
            href: `/categories/${post.category_slug}`,
          },
        ]
      : []),
    { label: post.title },
  ]

  return (
    <>
      <ReadingProgress />
      <div className="mx-auto w-full max-w-[860px] px-4 pt-8 sm:px-6 sm:pt-10">
        <Breadcrumb items={breadcrumbItems} />
        <BlogArticleHeader post={post} />
      </div>

      <div className="mx-auto w-full max-w-[860px] px-4 pt-8 sm:px-6">
        <article className="w-full">
          <div className="border-y border-border/70 py-3 mb-6 sm:mb-8">
            <ShareButtons title={post.title} />
          </div>

          <BlockRenderer
            blocks={post.content_json?.blocks ?? []}
            toc={toc}
          />
          <ArticleTags
            tags={post.tags}
            className="rounded-2xl border-0 bg-muted/40 px-5 py-4"
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
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: buildBreadcrumbJsonLd(breadcrumbItems),
            }}
          />
        </article>
      </div>

      {related.length > 0 ? (
        <div className="mt-10 border-t border-border/60 bg-muted/40">
          <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-14">
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
