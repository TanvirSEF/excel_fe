import type { Metadata } from "next"
import { notFound, permanentRedirect, redirect } from "next/navigation"

import {
  BlogArticleView,
  buildPostMetadata,
} from "@/components/site/blog-article-view"
import { CategoryView } from "@/components/site/category-view"
import { SeriesView } from "@/components/site/series-view"
import { getCategoryWithPosts } from "@/lib/api/categories"
import { getPostBySlug } from "@/lib/api/posts"
import { getSeriesBySlug } from "@/lib/api/series"
import { getWpRedirect, looksLikeWpPath } from "@/lib/api/redirects"
import { clamp, firstParam } from "@/lib/utils"
import type { Category, Page, PostDetail, PostListItem, SeriesSummary } from "@/types/api"

export const revalidate = 300

interface CatchAllPageProps {
  params: Promise<{ path: string[] }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

type ResolvedRoute =
  | { type: "post"; post: PostDetail }
  | {
      type: "category"
      category: Category
      posts: Page<PostListItem>
      page: number
    }
  | {
      type: "series"
      series: SeriesSummary
      posts: Page<PostListItem>
      page: number
    }
  | { type: "redirect"; target: string; isPermanent: boolean }
  | null

async function resolvePath(path: string[], page: number): Promise<ResolvedRoute> {
  const pathname = `/${path.join("/")}`

  if (!looksLikeWpPath(pathname)) {
    return null
  }

  // Handle historical WordPress pagination pattern /<cat>/<topic>/page/<n>/
  if (path.length === 4 && path[2] === "page") {
    const p = Number(path[3]) || 1
    return {
      type: "redirect",
      target: `/${path[0]}/${path[1]}/?page=${p}`,
      isPermanent: true,
    }
  }

  // Handle historical WordPress category pagination pattern /<cat>/page/<n>/
  if (path.length === 3 && path[1] === "page") {
    const p = Number(path[2]) || 1
    return {
      type: "redirect",
      target: `/${path[0]}/?page=${p}`,
      isPermanent: true,
    }
  }

  if (path.length === 1 && path[0] === "excel-functions-and-formulas") {
    return {
      type: "redirect",
      target: "/excel-functions-formulas/",
      isPermanent: true,
    }
  }

  // 1. Check if 2 segments match a category topic / series hub: /<category>/<topic>/
  if (path.length === 2) {
    const [catSlug, topicSlug] = path
    try {
      const res = await getSeriesBySlug(topicSlug, { page, page_size: 24 })
      if (res?.series) {
        const seriesCatSlug = res.series.category?.slug
        if (seriesCatSlug === catSlug) {
          return {
            type: "series",
            series: res.series,
            posts: res.posts,
            page,
          }
        }
        if (seriesCatSlug && seriesCatSlug !== catSlug) {
          return {
            type: "redirect",
            target: `/${seriesCatSlug}/${res.series.slug}/`,
            isPermanent: true,
          }
        }
      }
    } catch {
      // not a series, continue to WP redirect / post check
    }
  }

  // 2. Check WordPress redirects table in database
  const redirectRow = await getWpRedirect(pathname)
  if (redirectRow?.new_path) {
    if (redirectRow.new_path.startsWith("/blog/")) {
      const slug = redirectRow.new_path.replace("/blog/", "").replace(/\/+$/, "")
      try {
        const post = await getPostBySlug(slug)
        if (post.canonical_url?.startsWith("/google-sheets/")) {
          return {
            type: "redirect",
            target: `/google-sheets/${post.slug}/`,
            isPermanent: true,
          }
        }
        return { type: "post", post }
      } catch {
        return null
      }
    }

    if (redirectRow.new_path.startsWith("/google-sheets/")) {
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

  // 3. Fallback for 1 segment: Category first, then Post slug
  if (path.length === 1) {
    const slug = path[0]
    try {
      const catData = await getCategoryWithPosts(slug, { page, page_size: 12 })
      if (catData?.category) {
        return {
          type: "category",
          category: catData.category,
          posts: catData.posts,
          page,
        }
      }
    } catch {
      // not a category, continue to post check
    }

    try {
      const post = await getPostBySlug(slug)
      if (post.canonical_url?.startsWith("/google-sheets/")) {
        return {
          type: "redirect",
          target: `/google-sheets/${post.slug}/`,
          isPermanent: true,
        }
      }
      if (
        post.canonical_url &&
        post.canonical_url !== pathname &&
        post.canonical_url !== `${pathname}/`
      ) {
        const target = post.canonical_url.endsWith("/")
          ? post.canonical_url
          : `${post.canonical_url}/`
        return {
          type: "redirect",
          target,
          isPermanent: true,
        }
      }
      return { type: "post", post }
    } catch {
      return null
    }
  }

  return null
}

export async function generateMetadata({
  params,
  searchParams,
}: CatchAllPageProps): Promise<Metadata> {
  const [{ path }, query] = await Promise.all([
    params,
    searchParams ?? Promise.resolve<Record<string, string | string[] | undefined>>({}),
  ])
  const page = clamp(Number(firstParam(query.page) ?? 1) || 1, 1, 10_000)
  const resolved = await resolvePath(path, page)

  if (resolved?.type === "category") {
    return {
      title: resolved.category.seo_title ?? resolved.category.name,
      description:
        resolved.category.seo_description ??
        resolved.category.description ??
        `Excel Insider articles in ${resolved.category.name}.`,
      alternates: {
        canonical: `/${resolved.category.slug}/`,
      },
    }
  }

  if (resolved?.type === "post") {
    return buildPostMetadata(resolved.post, `/${path.join("/")}`)
  }

  if (resolved?.type === "series") {
    const catSlug = resolved.series.category?.slug ?? "category"
    return {
      title: resolved.series.seo_title ?? `${resolved.series.name} | Excel Insider`,
      description:
        resolved.series.seo_description ??
        resolved.series.description ??
        `${resolved.series.name} — step-by-step lessons in order.`,
      alternates: {
        canonical: `/${catSlug}/${resolved.series.slug}/`,
      },
    }
  }

  return {}
}

export default async function CatchAllPage({ params, searchParams }: CatchAllPageProps) {
  const [{ path }, query] = await Promise.all([
    params,
    searchParams ?? Promise.resolve<Record<string, string | string[] | undefined>>({}),
  ])
  const page = clamp(Number(firstParam(query.page) ?? 1) || 1, 1, 10_000)
  const resolved = await resolvePath(path, page)

  if (!resolved) {
    notFound()
  }

  if (resolved.type === "redirect") {
    if (resolved.isPermanent) {
      permanentRedirect(resolved.target)
    }
    redirect(resolved.target)
  }

  if (resolved.type === "category") {
    return (
      <CategoryView
        category={resolved.category}
        posts={resolved.posts}
        page={resolved.page}
      />
    )
  }

  if (resolved.type === "series") {
    return (
      <SeriesView
        series={resolved.series}
        posts={resolved.posts}
        page={resolved.page}
      />
    )
  }

  return (
    <BlogArticleView
      post={resolved.post}
      currentPath={`/${path.join("/")}`}
    />
  )
}
