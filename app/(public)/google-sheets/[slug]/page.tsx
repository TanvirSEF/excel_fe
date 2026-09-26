import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import { BlockRenderer } from "@/components/blocks/block-renderer"
import { InlineToc } from "@/components/blocks/inline-toc"
import { ArticleHeader } from "@/components/site/article-header"
import { ArticleTags } from "@/components/site/article-tags"
import { CommentsSection } from "@/components/site/comments-section"
import { CurriculumSidebar } from "@/components/site/learning-track/curriculum-sidebar"
import { CurriculumDrawer } from "@/components/site/learning-track/curriculum-drawer"
import {
  LessonPager,
  type PagerLesson,
} from "@/components/site/learning-track/lesson-pager"
import { ArticleCtaBand } from "@/components/site/newsletter/article-cta-band"
import { ApiClientError } from "@/lib/api/error"
import { getCurriculum } from "@/lib/api/curriculum"
import { getPostBySlug, getPostComments } from "@/lib/api/posts"
import { isGoogleSheetsCategory } from "@/lib/category-topics"
import { extractToc } from "@/lib/blocks"
import { buildArticleJsonLd } from "@/lib/seo"
import { config } from "@/lib/config"
import type { CurriculumModule, PostDetail } from "@/types/api"

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

function flattenTrack(modules: CurriculumModule[]) {
  return modules.flatMap((module) =>
    module.topics.flatMap((topic) =>
      topic.lessons.map((lesson) => ({
        slug: lesson.slug,
        title: lesson.title,
        topicName: topic.name,
        moduleName: module.name,
      }))
    )
  )
}

export async function generateMetadata({
  params,
}: LessonPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await loadLesson(slug)

  const title = post.meta_title ?? post.title
  const description = post.meta_description ?? post.excerpt ?? undefined
  const image = post.og_image_url ?? post.featured_image_url ?? "/og-default.png"

  return {
    title,
    description,
    alternates: { canonical: `/google-sheets/${post.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${config.siteUrl}/google-sheets/${post.slug}`,
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

  if (
    !isGoogleSheetsCategory(post.category_slug) &&
    !post.canonical_url?.startsWith("/google-sheets/") &&
    !post.canonical_url?.startsWith("/google-sheets-")
  ) {
    redirect(`/blog/${post.slug}`)
  }

  const [comments, modules] = await Promise.all([
    getPostComments(post.id).catch(() => []),
    getCurriculum(300).catch(() => [] as CurriculumModule[]),
  ])
  const toc = extractToc(post.content_json?.blocks ?? [])

  const flat = flattenTrack(modules)
  const index = flat.findIndex((lesson) => lesson.slug === post.slug)
  const prev: PagerLesson | null = index > 0 ? flat[index - 1] : null
  const next: PagerLesson | null =
    index >= 0 && index < flat.length - 1 ? flat[index + 1] : null

  const lessonPath = `/google-sheets/${post.slug}`

  return (
    <>
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-8 px-4 py-10 sm:py-12 xl:grid-cols-[264px_minmax(0,1fr)]">
        <aside className="hidden xl:block">
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1">
            <CurriculumSidebar modules={modules} activeLessonSlug={post.slug} />
          </div>
        </aside>

        <article className="mx-auto w-full max-w-[860px] xl:mx-0">
          <ArticleHeader post={post} />

          <InlineToc entries={toc} className="mt-0 mb-8" />

          <BlockRenderer blocks={post.content_json?.blocks ?? []} />
          <ArticleTags tags={post.tags} />

          <LessonPager prev={prev} next={next} />

          <ArticleCtaBand
            source="lesson-footer"
            heading="Liked this lesson? Get one practical spreadsheet tip every week."
          />

          <CommentsSection postId={post.id} comments={comments} />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: buildArticleJsonLd(post, lessonPath),
            }}
          />
        </article>
      </div>

      <CurriculumDrawer modules={modules} activeLessonSlug={post.slug} />
    </>
  )
}
