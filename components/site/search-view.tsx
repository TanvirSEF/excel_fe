"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { EmptyState } from "@/components/shared/empty-state"
import { Pagination } from "@/components/shared/pagination"
import { PostCard } from "@/components/site/post-card"
import { Skeleton } from "@/components/ui/skeleton"
import { apiFetch } from "@/lib/api/api-fetch"
import type { Page, PostListItem } from "@/types/api"

const PAGE_SIZE = 9
const DEBOUNCE_MS = 400

interface SearchViewProps {
  query: string
  page: number
}

export function SearchView({ query, page }: SearchViewProps) {
  const router = useRouter()

  const [input, setInput] = useState(query)
  const [lastQuery, setLastQuery] = useState(query)
  const [results, setResults] = useState<Page<PostListItem> | null>(null)
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)

  if (query !== lastQuery) {
    setLastQuery(query)
    setInput(query)
  }

  useEffect(() => {
    const trimmed = input.trim()
    if (trimmed === query) return
    const timer = setTimeout(() => {
      const params = new URLSearchParams()
      if (trimmed.length >= 2) params.set("q", trimmed)
      const search = params.toString()
      router.replace(search ? `/search?${search}` : "/search", {
        scroll: false,
      })
    }, DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [input, query, router])

  useEffect(() => {
    if (query.trim().length < 2) return
    let cancelled = false
    async function load() {
      setLoading(true)
      setFailed(false)
      try {
        const data = await apiFetch<Page<PostListItem>>("/search", {
          searchParams: { q: query, page, page_size: PAGE_SIZE },
        })
        if (!cancelled) setResults(data)
      } catch {
        if (!cancelled) setFailed(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [query, page])

  const tooShort = input.trim().length > 0 && input.trim().length < 2
  const showResults = query.trim().length >= 2

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            const trimmed = input.trim()
            if (trimmed.length >= 2) {
              router.replace(`/search?q=${encodeURIComponent(trimmed)}`)
            }
          }}
        >
          <input
            type="search"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Search articles, formulas, tricks…"
            autoFocus
            aria-label="Search articles"
            className="h-12 w-full rounded-lg border border-input bg-background px-4 text-base shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring/50"
          />
        </form>
        {tooShort ? (
          <p className="text-xs text-muted-foreground">
            Keep typing — at least 2 characters.
          </p>
        ) : null}
      </div>

      {!showResults ? (
        <EmptyState
          title="Search Excel Insider"
          description="Find articles by formula, feature or keyword — results appear as you type."
        />
      ) : loading && !results ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : failed ? (
        <EmptyState
          title="Search failed"
          description="Something went wrong reaching the search service. Try again."
        />
      ) : results && results.items.length > 0 ? (
        <>
          <p className="text-sm text-muted-foreground">
            {results.total.toLocaleString()} result
            {results.total === 1 ? "" : "s"} for “{query}”
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.items.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={results.total_pages}
            pathname="/search"
            searchParams={{ q: query }}
          />
        </>
      ) : (
        <EmptyState
          title={`No results for “${query}”`}
          description="Try a different keyword, or browse the blog instead."
          action={
            <Link
              href="/blog"
              className="text-sm text-primary underline-offset-4 hover:underline"
            >
              Browse all articles
            </Link>
          }
        />
      )}
    </div>
  )
}
