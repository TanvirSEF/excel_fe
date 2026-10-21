"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import type { Editor } from "@tiptap/react"
import {
  IconArrowRight,
  IconBook,
  IconCheck,
  IconLoader2,
  IconPhoto,
  IconSearch,
  IconX,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { apiFetch } from "@/lib/api/api-fetch"
import type { Page, PostAdminItem, PostDetail } from "@/types/api"

interface InterlinkPanelProps {
  editor: Editor
  onClose: () => void
}

const PREFIX_OPTIONS = [
  "Read More",
  "Also Read",
  "Related Guide",
  "Recommended",
  "Further Reading",
]

function extractSlug(input: string): string {
  const trimmed = input.trim()
  const path = trimmed.replace(/^https?:\/\/[^/]+/i, "")
  const cleaned = path.replace(/^\/+|\/+$/g, "")
  const segments = cleaned.split("/")
  return segments.pop() || ""
}

export function InterlinkPanel({ editor, onClose }: InterlinkPanelProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<PostAdminItem[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const [url, setUrl] = useState("")
  const [title, setTitle] = useState("")
  const [prefix, setPrefix] = useState("Read More")
  const [imageUrl, setImageUrl] = useState("")
  const [isFetchingInfo, setIsFetchingInfo] = useState(false)

  const searchTimerRef = useRef<NodeJS.Timeout | null>(null)

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    if (!value.trim()) {
      setSearchResults([])
      setIsSearching(false)
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current)
      }
    }
  }

  useEffect(() => {
    const query = searchTerm.trim()
    if (!query) return

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current)
    }

    searchTimerRef.current = setTimeout(async () => {
      setIsSearching(true)
      try {
        const response = await apiFetch<Page<PostAdminItem>>("/posts/admin", {
          searchParams: {
            search: query,
            status: "published",
            page_size: 6,
          },
        })
        setSearchResults(response.items || [])
      } catch {
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 280)

    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current)
      }
    }
  }, [searchTerm])

  const handleSelectPost = (post: PostAdminItem) => {
    setUrl(`/${post.slug}`)
    setTitle(post.title)
    if (post.featured_image_url) {
      setImageUrl(post.featured_image_url)
    }
    setSearchResults([])
    setSearchTerm("")
  }

  const handleFetchUrlInfo = async (inputUrl: string) => {
    const slug = extractSlug(inputUrl)
    if (!slug) return

    setIsFetchingInfo(true)
    try {
      const post = await apiFetch<PostDetail>(
        `/posts/${encodeURIComponent(slug)}`
      )
      if (post?.title) {
        setTitle(post.title)
      }
      if (post?.featured_image_url) {
        setImageUrl(post.featured_image_url)
      }
    } catch {
      // If fetching by exact slug fails, no problem — author can manually type the title
    } finally {
      setIsFetchingInfo(false)
    }
  }

  const handleInsert = () => {
    if (!url.trim() || !title.trim()) return

    const normalizedUrl =
      url.trim().startsWith("http://") ||
      url.trim().startsWith("https://") ||
      url.trim().startsWith("/")
        ? url.trim()
        : `/${url.trim()}`

    editor
      .chain()
      .focus()
      .insertContent({
        type: "interlink",
        attrs: {
          url: normalizedUrl,
          title: title.trim(),
          prefix: prefix.trim() || "Read More",
          imageUrl: imageUrl.trim() || undefined,
        },
      })
      .run()

    onClose()
  }

  return (
    <div className="relative rounded-2xl border border-primary/20 bg-card p-4 shadow-lg space-y-4 animate-in fade-in-50 zoom-in-95 duration-150">
      <div className="flex items-center justify-between border-b pb-2.5">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <IconBook className="h-4 w-4" />
          </div>
          <span>Insert Interlink / Read More</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
        >
          <IconX className="h-4 w-4" />
        </button>
      </div>

      {/* Live Post Search */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground flex items-center justify-between">
          <span>Search Published Articles</span>
          <span className="text-[11px] font-normal text-muted-foreground">
            Type keyword to auto-fill
          </span>
        </label>
        <div className="relative">
          <Input
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Type post title or keyword (e.g. VLOOKUP, INDEX MATCH)..."
            className="h-9 pr-8 text-xs"
            autoFocus
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {isSearching ? (
              <IconLoader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <IconSearch className="h-4 w-4" />
            )}
          </div>
        </div>

        {/* Search Results Dropdown */}
        {searchResults.length > 0 ? (
          <div className="max-h-52 overflow-y-auto rounded-xl border bg-popover p-1 shadow-md space-y-1">
            {searchResults.map((post) => (
              <button
                key={post.id}
                type="button"
                onClick={() => handleSelectPost(post)}
                className="w-full text-left flex items-center gap-2.5 rounded-lg p-2 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer group"
              >
                {post.featured_image_url ? (
                  <div className="relative h-10 w-12 shrink-0 overflow-hidden rounded-md border border-border/60 bg-muted">
                    <Image
                      src={post.featured_image_url}
                      alt={post.title}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <IconBook className="h-4 w-4" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-foreground group-hover:text-primary">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    {post.category_name ? (
                      <span className="rounded bg-muted px-1.5 py-0.2 font-medium">
                        {post.category_name}
                      </span>
                    ) : null}
                    <span className="font-mono">/{post.slug}</span>
                  </div>
                </div>
                <IconCheck className="h-4 w-4 opacity-0 group-hover:opacity-100 text-primary shrink-0" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="relative flex py-1 items-center">
        <div className="grow border-t border-border/60" />
        <span className="shrink mx-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Or Enter Manually
        </span>
        <div className="grow border-t border-border/60" />
      </div>

      {/* Target URL with Auto-fetch */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-foreground">
            Target URL / Slug
          </label>
          {url.trim() && !title.trim() ? (
            <button
              type="button"
              disabled={isFetchingInfo}
              onClick={() => handleFetchUrlInfo(url)}
              className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              {isFetchingInfo ? (
                <IconLoader2 className="h-3 w-3 animate-spin" />
              ) : null}
              Auto-fetch Title
            </button>
          ) : null}
        </div>
        <Input
          value={url}
          onChange={(e) => {
            const nextUrl = e.target.value
            setUrl(nextUrl)
            if (nextUrl.length > 5 && !title) {
              handleFetchUrlInfo(nextUrl)
            }
          }}
          onBlur={() => {
            if (url.trim() && !title.trim()) {
              handleFetchUrlInfo(url)
            }
          }}
          placeholder="e.g. /excel-vlookup-guide or https://www.excelinsider.com/excel-vlookup-guide"
          className="h-9 font-mono text-xs"
        />
      </div>

      {/* Prefix & Post Title */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="space-y-1.5 sm:col-span-1">
          <label className="text-xs font-semibold text-foreground">
            Prefix
          </label>
          <div className="space-y-1">
            <select
              value={
                PREFIX_OPTIONS.includes(prefix) ? prefix : "__custom__"
              }
              onChange={(e) => {
                if (e.target.value !== "__custom__") {
                  setPrefix(e.target.value)
                }
              }}
              className="h-9 w-full rounded-md border border-input bg-background px-2 text-xs font-medium"
            >
              {PREFIX_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}:
                </option>
              ))}
              <option value="__custom__">Custom prefix...</option>
            </select>
            {!PREFIX_OPTIONS.includes(prefix) ? (
              <Input
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder="Prefix text"
                className="h-8 text-xs"
              />
            ) : null}
          </div>
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-semibold text-foreground">
            Display Title (Anchor Text)
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. How to Use VLOOKUP in Excel (Step-by-Step)"
            className="h-9 text-xs"
          />
        </div>
      </div>

      {/* Side Image / Thumbnail */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <IconPhoto className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Featured Image Thumbnail (optional)</span>
          </label>
          {imageUrl ? (
            <button
              type="button"
              onClick={() => setImageUrl("")}
              className="text-[11px] text-destructive hover:underline cursor-pointer"
            >
              Remove Image
            </button>
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          {imageUrl ? (
            <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-muted">
              <Image
                src={imageUrl}
                alt="Thumbnail"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          ) : null}
          <Input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://... (image thumbnail URL)"
            className="h-9 text-xs flex-1"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 pt-1 border-t">
        <Button type="button" variant="outline" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={!url.trim() || !title.trim()}
          onClick={handleInsert}
          className="gap-1.5"
        >
          <span>Insert Read More</span>
          <IconArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
