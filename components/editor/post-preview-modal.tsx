"use client"

import { useMemo, useState } from "react"
import type { JSONContent } from "@tiptap/react"
import {
  IconDeviceDesktop,
  IconDeviceMobile,
  IconDeviceTablet,
  IconEye,
  IconX,
} from "@tabler/icons-react"

import { BlockRenderer } from "@/components/blocks/block-renderer"
import { ArticleTags } from "@/components/site/article-tags"
import { BlogArticleHeader } from "@/components/site/blog-article-header"
import { Breadcrumb } from "@/components/site/breadcrumb"
import { ShareButtons } from "@/components/site/share-buttons"
import { Button } from "@/components/ui/button"
import { extractToc } from "@/lib/blocks"
import { docToBlocks } from "@/lib/editor-serialize"
import { cn } from "@/lib/utils"
import type { Category, PostDetail, User } from "@/types/api"
import type { PostFormFields } from "@/components/editor/post-form"

interface PostPreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fields: PostFormFields
  doc: JSONContent | null
  authors?: User[]
  categories?: Category[]
  currentUserName?: string
}

type Viewport = "desktop" | "tablet" | "mobile"

const VIEWPORT_STYLES: Record<Viewport, { maxWidth: string; label: string }> = {
  desktop: { maxWidth: "max-w-[860px]", label: "Desktop (860px)" },
  tablet: { maxWidth: "max-w-[720px]", label: "Tablet (720px)" },
  mobile: { maxWidth: "max-w-[390px]", label: "Mobile (390px)" },
}

function findCategory(
  categories: Category[] | undefined,
  id: string
): Category | undefined {
  if (!categories || !id) return undefined
  for (const cat of categories) {
    if (cat.id === id) return cat
    if (cat.children?.length) {
      const match = findCategory(cat.children, id)
      if (match) return match
    }
  }
  return undefined
}

export function PostPreviewModal({
  open,
  onOpenChange,
  fields,
  doc,
  authors,
  categories,
  currentUserName,
}: PostPreviewModalProps) {
  const [viewport, setViewport] = useState<Viewport>("desktop")

  const blocks = useMemo(() => docToBlocks(doc), [doc])
  const toc = useMemo(() => extractToc(blocks), [blocks])

  const selectedCategory = useMemo(
    () => findCategory(categories, fields.categoryId),
    [categories, fields.categoryId]
  )

  const authorName = useMemo(() => {
    if (!fields.authorId) return currentUserName ?? "Editorial Team"
    const author = authors?.find((a) => a.id === fields.authorId)
    return author?.name ?? currentUserName ?? "Editorial Team"
  }, [authors, fields.authorId, currentUserName])

  const previewPost: PostDetail = useMemo(
    () => ({
      id: "preview-id",
      title: fields.title.trim() || "Untitled Draft",
      slug: fields.slug.trim() || "untitled-draft",
      excerpt: fields.excerpt.trim() || null,
      content_json: { blocks },
      content_html: null,
      status: "draft",
      author_id: fields.authorId,
      author_name: authorName,
      category_id: fields.categoryId || null,
      category_name: selectedCategory?.name ?? null,
      category_slug: selectedCategory?.slug ?? null,
      tags: fields.tags,
      meta_title: null,
      meta_description: null,
      focus_keyphrase: null,
      canonical_url: null,
      og_image_url: null,
      schema_type: "TechArticle",
      scheduled_at: null,
      rejection_reason: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
      featured_image_url: fields.featuredImageUrl.trim() || null,
      reading_time_minutes: null,
      is_trending: fields.isTrending,
      view_count: 0,
    }),
    [authorName, blocks, fields, selectedCategory]
  )

  if (!open) return null

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    ...(selectedCategory
      ? [
          {
            label: selectedCategory.name,
            href: `/categories/${selectedCategory.slug}`,
          },
        ]
      : []),
    { label: previewPost.title },
  ]

  const hasContent = blocks.length > 0 || fields.title.trim().length > 0

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-md animate-in fade-in-0 duration-200"
    >
      {/* Header Toolbar */}
      <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b bg-card px-4 sm:px-6">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <IconEye className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Article Preview
              </span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                Live Format
              </span>
            </div>
            <p className="truncate text-xs text-muted-foreground">
              {fields.title.trim() || "Untitled draft"}
            </p>
          </div>
        </div>

        {/* Viewport Switcher */}
        <div className="flex items-center gap-1 rounded-lg border bg-muted/50 p-1">
          <button
            type="button"
            aria-label="Desktop view"
            title="Desktop view (860px)"
            onClick={() => setViewport("desktop")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              viewport === "desktop"
                ? "bg-background text-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <IconDeviceDesktop className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            type="button"
            aria-label="Tablet view"
            title="Tablet view (720px)"
            onClick={() => setViewport("tablet")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              viewport === "tablet"
                ? "bg-background text-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <IconDeviceTablet className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            type="button"
            aria-label="Mobile view"
            title="Mobile view (390px)"
            onClick={() => setViewport("mobile")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              viewport === "mobile"
                ? "bg-background text-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <IconDeviceMobile className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Close Button */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="gap-1.5"
          >
            <IconX className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Editor</span>
          </Button>
        </div>
      </header>

      {/* Scrollable Preview Body */}
      <div className="flex-1 overflow-y-auto bg-muted/40 p-3 sm:p-6 lg:p-8">
        <div
          className={cn(
            "mx-auto w-full transition-all duration-200 rounded-2xl border border-border/70 bg-background shadow-xl",
            VIEWPORT_STYLES[viewport].maxWidth
          )}
        >
          {/* Top Preview Banner */}
          <div className="border-b border-border/60 bg-muted/30 px-6 py-2.5 text-center text-xs text-muted-foreground">
            Displaying live styling &amp; formatting from{" "}
            <span className="font-semibold text-foreground">
              {VIEWPORT_STYLES[viewport].label}
            </span>
          </div>

          {!hasContent ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
                <IconEye className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold">No content yet</h3>
              <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                Add a title or type your article in the editor to see how it will appear on your live blog.
              </p>
            </div>
          ) : (
            <div className="px-5 py-8 sm:px-8 sm:py-10">
              <Breadcrumb items={breadcrumbItems} />
              <BlogArticleHeader post={previewPost} />

              <article className="mt-8 w-full">
                <div className="border-y border-border/70 py-3 mb-6 sm:mb-8">
                  <ShareButtons title={previewPost.title} />
                </div>

                <BlockRenderer blocks={blocks} toc={toc} />

                <ArticleTags
                  tags={fields.tags}
                  className="rounded-2xl border-0 bg-muted/40 px-5 py-4"
                />
              </article>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
