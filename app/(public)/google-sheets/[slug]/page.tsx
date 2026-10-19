import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"

import { BlockRenderer } from "@/components/blocks/block-renderer"
import { InlineToc } from "@/components/blocks/inline-toc"
import { ArticleHeader } from "@/components/site/article-header"
import { ArticleTags } from "@/components/site/article-tags"
import { CommentsSection } from "@/components/site/comments-section"
import { CurriculumSidebar } from "@/components/site/learning-track/curriculum-sidebar"
import { CurriculumDrawer } from "@/components/site/learning-track/curriculum-drawer"
import { GoogleSheetsCarousel } from "@/components/site/learning-track/google-sheets-carousel"
import { ArticleCtaBand } from "@/components/site/newsletter/article-cta-band"
import { ArticleTocSidebar } from "@/components/site/article-toc-sidebar"
import { ApiClientError } from "@/lib/api/error"
import { getCurriculum } from "@/lib/api/curriculum"
import { getPostBySlug, getPostComments, getPosts } from "@/lib/api/posts"
import {
  extractToc,
  getFeaturedImageFromBlocks,
  normalizePostBlocks,
  toCdnUrl,
} from "@/lib/blocks"
import { buildArticleJsonLd } from "@/lib/seo"
import { config } from "@/lib/config"
import type { CurriculumModule, PostDetail } from "@/types/api"

export const revalidate = 300

interface LessonPageProps {
  params: Promise<{ slug: string }>
}

async function loadLesson(slug: string): Promise<PostDetail> {
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
}: LessonPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await loadLesson(slug)

  const title = post.meta_title ?? post.title
  const description = post.meta_description ?? post.excerpt ?? undefined
  const image =
    (post.og_image_url ? toCdnUrl(encodeURI(decodeURI(post.og_image_url))) : null) ||
    (post.featured_image_url ? toCdnUrl(encodeURI(decodeURI(post.featured_image_url))) : null) ||
    "/og-default.png"

  if (!post.canonical_url?.startsWith("/google-sheets/")) {
    const target = post.canonical_url ?? `/blog/${post.slug}/`
    const finalTarget = target.startsWith("/") ? target : `/${target}`
    const canonical = finalTarget.endsWith("/") ? finalTarget : `${finalTarget}/`
    return {
      title,
      description,
      alternates: { canonical },
    }
  }

  return {
    title,
    description,
    alternates: { canonical: `/google-sheets/${post.slug}/` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${config.siteUrl}/google-sheets/${post.slug}/`,
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

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug } = await params
  const post = await loadLesson(slug)

  if (!post.canonical_url?.startsWith("/google-sheets/")) {
    const target = post.canonical_url ?? `/blog/${post.slug}/`
    const finalTarget = target.startsWith("/") ? target : `/${target}`
    permanentRedirect(
      finalTarget.endsWith("/") ? finalTarget : `${finalTarget}/`
    )
  }

  const [comments, modules, basicsPage] = await Promise.all([
    getPostComments(post.id).catch(() => []),
    getCurriculum(300).catch(() => [] as CurriculumModule[]),
    getPosts({ category: "google-sheets-basics", page_size: 15 }, 300).catch(
      () => null
    ),
  ])
  const relatedBasics = (basicsPage?.items ?? []).filter(
    (item) => item.id !== post.id
  )
  const normalizedBlocks = normalizePostBlocks(post.content_json?.blocks ?? [])
  const toc = extractToc(normalizedBlocks)
  const effectiveFeaturedImage =
    (post.featured_image_url
      ? toCdnUrl(encodeURI(decodeURI(post.featured_image_url)))
      : null) || getFeaturedImageFromBlocks(normalizedBlocks)

  const lessonPath = `/google-sheets/${post.slug}/`

  return (
    <>
      <div className="single-post mx-auto flex w-full max-w-[1500px] items-start justify-center gap-6 2xl:gap-8 px-4 py-8 sm:py-10">
        <aside className="hidden xl:block w-[264px] shrink-0">
          <div className="max-h-[calc(100vh-6rem)] overflow-y-auto pr-1">
            <CurriculumSidebar modules={modules} activeLessonSlug={post.slug} />
          </div>
        </aside>

        <article className="min-w-0 w-full max-w-[820px] flex-1">
          <ArticleHeader post={post} />

          {toc.length >= 2 ? (
            <InlineToc entries={toc} className="mt-0 mb-8 xl:hidden" />
          ) : null}

          <BlockRenderer blocks={normalizedBlocks} />
          <ArticleTags tags={post.tags} />

          <GoogleSheetsCarousel posts={relatedBasics} />

          <ArticleCtaBand
            source="lesson-footer"
            heading="Liked this lesson? Get one practical spreadsheet tip every week."
          />

          <CommentsSection postId={post.id} comments={comments} />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: buildArticleJsonLd(
                { ...post, featured_image_url: effectiveFeaturedImage },
                lessonPath
              ),
            }}
          />
        </article>

        <aside
          id="sidebar"
          aria-label="Table of contents"
          className="sidebar sidebar-primary hidden xl:block w-[320px] shrink-0 space-y-6"
        >
          {toc.length >= 2 ? <ArticleTocSidebar toc={toc} /> : null}
        </aside>
      </div>

      <CurriculumDrawer modules={modules} activeLessonSlug={post.slug} />
    </>
  )
}
