import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"

import {
  BlogArticleView,
  buildPostMetadata,
} from "@/components/site/blog-article-view"
import { ApiClientError } from "@/lib/api/error"
import { getPostBySlug } from "@/lib/api/posts"
import { isGoogleSheetsCategory } from "@/lib/category-topics"
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
  return buildPostMetadata(post)
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const post = await loadPost(slug)

  if (isGoogleSheetsCategory(post.category_slug)) {
    permanentRedirect(`/google-sheets/${post.slug}`)
  }

  if (post.canonical_url && post.canonical_url !== `/blog/${post.slug}`) {
    const target = post.canonical_url.endsWith("/")
      ? post.canonical_url
      : `${post.canonical_url}/`
    permanentRedirect(target)
  }

  return <BlogArticleView post={post} />
}
