"use client"

import { useMemo, useSyncExternalStore } from "react"
import Link from "next/link"
import {
  IconArrowLeft,
  IconBroadcast,
  IconExternalLink,
  IconFileText,
} from "@tabler/icons-react"

import { BlockRenderer } from "@/components/blocks/block-renderer"
import { ArticleTags } from "@/components/site/article-tags"
import { BlogArticleHeader } from "@/components/site/blog-article-header"
import { Breadcrumb } from "@/components/site/breadcrumb"
import { ArticleCtaBand } from "@/components/site/newsletter/article-cta-band"
import { ArticleTocSidebar } from "@/components/site/article-toc-sidebar"
import { ReadingProgress } from "@/components/site/reading-progress"
import { ShareButtons } from "@/components/site/share-buttons"
import { extractToc, normalizePostBlocks } from "@/lib/blocks"
import type { Block, PostDetail, PostStatus } from "@/types/api"

export interface LivePreviewPayload {
  title: string
  slug: string
  excerpt: string
  blocks: Block[]
  featuredImageUrl: string
  isTrending: boolean
  tags: string[]
  authorId: string
  authorName: string
  authorAvatarUrl: string | null
  categoryId: string
  categoryName: string | null
  categorySlug: string | null
  originalPostId?: string
  originalPostStatus?: PostStatus
  updatedAt: string
}

const STORAGE_KEY = "ei_live_preview_post"
const CHANNEL_NAME = "ei_live_preview"

function subscribePreview(callback: () => void) {
  let channel: BroadcastChannel | null = null
  if (typeof BroadcastChannel !== "undefined") {
    channel = new BroadcastChannel(CHANNEL_NAME)
    channel.onmessage = () => callback()
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      callback()
    }
  }

  window.addEventListener("storage", onStorage)

  return () => {
    channel?.close()
    window.removeEventListener("storage", onStorage)
  }
}

function getPreviewSnapshot(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(STORAGE_KEY)
}

function getServerSnapshot(): string | null {
  return null
}

const emptySubscribe = () => () => {}

function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
}

export function LiveArticlePreview() {
  const isClient = useIsClient()
  const rawPayload = useSyncExternalStore(
    subscribePreview,
    getPreviewSnapshot,
    getServerSnapshot
  )

  const payload: LivePreviewPayload | null = useMemo(() => {
    if (!rawPayload) return null
    try {
      return JSON.parse(rawPayload) as LivePreviewPayload
    } catch {
      return null
    }
  }, [rawPayload])

  const normalizedBlocks = useMemo(
    () => normalizePostBlocks(payload?.blocks ?? []),
    [payload?.blocks]
  )
  const toc = useMemo(() => extractToc(normalizedBlocks), [normalizedBlocks])

  const post: PostDetail | null = useMemo(() => {
    if (!payload) return null
    return {
      id: payload.originalPostId || "preview-id",
      title: payload.title.trim() || "Untitled Draft",
      slug: payload.slug.trim() || "untitled-draft",
      excerpt: payload.excerpt.trim() || null,
      content_json: { blocks: normalizedBlocks },
      content_html: null,
      status: payload.originalPostStatus || "draft",
      author_id: payload.authorId || "",
      author_name: payload.authorName || "Editorial Team",
      author_avatar_url: payload.authorAvatarUrl,
      category_id: payload.categoryId || null,
      category_name: payload.categoryName,
      category_slug: payload.categorySlug,
      tags: payload.tags || [],
      featured_image_url: payload.featuredImageUrl || null,
      reading_time_minutes: Math.max(1, Math.ceil(normalizedBlocks.length * 0.5)),
      is_trending: payload.isTrending,
      meta_title: null,
      meta_description: null,
      focus_keyphrase: null,
      canonical_url: payload.slug ? `/blog/${payload.slug}` : "/blog",
      og_image_url: null,
      schema_type: "TechArticle",
      scheduled_at: null,
      rejection_reason: null,
      created_at: payload.updatedAt || new Date().toISOString(),
      updated_at: payload.updatedAt || new Date().toISOString(),
      published_at: new Date().toISOString(),
      view_count: 0,
    }
  }, [normalizedBlocks, payload])

  if (!isClient) {
    return <div className="min-h-screen animate-pulse bg-muted/20" />
  }

  if (!payload || !post) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center p-6 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
          <IconFileText className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-bold">No Live Preview Active</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Open an article in the Post Editor and click <strong>&ldquo;View Live ↗&rdquo;</strong> to preview your real-time draft in the website layout.
        </p>
        <Link
          href="/dashboard/posts"
          className="mt-6 inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
        >
          Go to Post Dashboard
        </Link>
      </div>
    )
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    ...(payload.categoryName && payload.categorySlug
      ? [{ label: payload.categoryName, href: `/${payload.categorySlug}/` }]
      : [{ label: "Blog", href: "/blog/" }]),
    { label: payload.title.trim() || "Article Preview" },
  ]

  return (
    <>
      {/* Top Banner Notice */}
      <aside
        aria-label="Preview notice"
        className="sticky top-0 z-40 border-b border-amber-500/30 bg-amber-500/10 backdrop-blur-md px-4 py-2.5 text-xs text-foreground"
      >
        <div className="mx-auto flex max-w-[1536px] flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-semibold text-amber-700 dark:text-amber-400">
              Live Preview (Unsaved Changes)
            </span>
            <span className="hidden sm:inline text-muted-foreground">
              — Displaying your real-time draft in the live website layout.
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
              <IconBroadcast className="h-3 w-3" />
              Live Sync Active
            </span>
          </div>
          <div className="flex items-center gap-2">
            {payload.originalPostStatus === "published" && payload.slug ? (
              <a
                href={`/blog/${payload.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-md border border-border/80 bg-background/80 px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                title="View original published article on live site"
              >
                <IconExternalLink className="h-3.5 w-3.5" />
                <span>View Published Page</span>
              </a>
            ) : null}
            <button
              type="button"
              onClick={() => window.close()}
              className="inline-flex items-center gap-1 rounded-md border border-border/80 bg-background/80 px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <IconArrowLeft className="h-3.5 w-3.5" />
              <span>Close Preview</span>
            </button>
          </div>
        </div>
      </aside>

      <ReadingProgress />

      <div className="single-post mx-auto w-full max-w-[1536px] px-4 pt-6 pb-16 sm:px-6 sm:pt-8 sm:pb-24 lg:pb-32">
        <div className="flex items-start justify-center gap-6 2xl:gap-8">
          {/* Left Table of Contents Sidebar */}
          <aside
            id="left-sidebar"
            aria-label="Table of contents"
            className="hidden xl:block xl:self-stretch w-[320px] shrink-0 space-y-6"
          >
            {toc.length >= 2 ? <ArticleTocSidebar toc={toc} /> : null}
          </aside>

          {/* Central Article Content */}
          <article className="min-w-0 w-full max-w-[820px] flex-1">
            <Breadcrumb items={breadcrumbItems} />
            <BlogArticleHeader
              post={post}
              authorAvatarUrl={payload.authorAvatarUrl}
            />

            <div className="border-y border-border/70 py-3 my-6 sm:my-8">
              <ShareButtons title={post.title} />
            </div>

            <BlockRenderer
              blocks={normalizedBlocks}
              toc={toc}
              hideInlineTocOnDesktop
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
          </article>

          {/* Right Sidebar Info */}
          <aside
            id="sidebar"
            className="sidebar sidebar-primary hidden xl:block w-[320px] shrink-0 space-y-6"
          >
            <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Live Preview Mode
              </h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                This preview renders your exact live block formatting, table of contents, and responsive layout. Edits made in the editor sync here in real time.
              </p>
              <div className="mt-4 border-t pt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Status:</span>
                <span className="font-semibold capitalize text-foreground">
                  {payload.originalPostStatus || "Draft"}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
