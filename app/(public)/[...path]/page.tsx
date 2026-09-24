import type { Metadata } from "next"
import { notFound, permanentRedirect, redirect } from "next/navigation"

import {
  BlogArticleView,
  buildPostMetadata,
} from "@/components/site/blog-article-view"
import { getPostBySlug } from "@/lib/api/posts"
import { getWpRedirect, looksLikeWpPath } from "@/lib/api/redirects"
import type { PostDetail } from "@/types/api"

interface CatchAllPageProps {
  params: Promise<{ path: string[] }>
}

async function resolvePost(path: string[]): Promise<
  | { type: "post"; post: PostDetail }
  | { type: "redirect"; target: string; isPermanent: boolean }
  | null
> {
  const pathname = `/${path.join("/")}`

  if (!looksLikeWpPath(pathname)) {
    return null
  }

  const redirectRow = await getWpRedirect(pathname)
  if (redirectRow?.new_path) {
    if (redirectRow.new_path.startsWith("/blog/")) {
      const slug = redirectRow.new_path.replace("/blog/", "")
      try {
        const post = await getPostBySlug(slug)
        return { type: "post", post }
      } catch {
        return null
      }
    }

    if (redirectRow.new_path.startsWith("/google-sheets/")) {
      const slug = redirectRow.new_path.replace("/google-sheets/", "")
      try {
        const post = await getPostBySlug(slug)
        return { type: "post", post }
      } catch {
        return null
      }
    }

    const target = redirectRow.new_path.startsWith("/")
      ? redirectRow.new_path
      : `/${redirectRow.new_path}`
    const finalTarget = target.endsWith("/") ? target : `${target}/`
    return {
      type: "redirect",
      target: finalTarget,
      isPermanent: redirectRow.redirect_type === 301,
    }
  }

  if (path.length === 1) {
    try {
      const post = await getPostBySlug(path[0])
      return { type: "post", post }
    } catch {
      return null
    }
  }

  return null
}

export async function generateMetadata({
  params,
}: CatchAllPageProps): Promise<Metadata> {
  const { path } = await params
  const resolved = await resolvePost(path)
  if (resolved?.type === "post") {
    return buildPostMetadata(resolved.post, `/${path.join("/")}`)
  }
  return {}
}

export default async function CatchAllPage({ params }: CatchAllPageProps) {
  const { path } = await params
  const resolved = await resolvePost(path)

  if (!resolved) {
    notFound()
  }

  if (resolved.type === "redirect") {
    if (resolved.isPermanent) {
      permanentRedirect(resolved.target)
    }
    redirect(resolved.target)
  }

  return (
    <BlogArticleView
      post={resolved.post}
      currentPath={`/${path.join("/")}`}
    />
  )
}
