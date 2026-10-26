import Link from "next/link"

import { cn } from "@/lib/utils"

interface PaginationProps {
  page: number
  totalPages: number
  pathname: string
  searchParams?: Record<string, string | undefined>
}

function buildHref(
  pathname: string,
  searchParams: Record<string, string | undefined> | undefined,
  page: number
) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (value) params.set(key, value)
  }
  if (page > 1) params.set("page", String(page))
  const query = params.toString()
  return query ? `${pathname}?${query}` : pathname
}

function pageNumbers(page: number, totalPages: number) {
  const pages = new Set<number>([1, totalPages, page - 1, page, page + 1])
  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b)

  const parts: (number | string)[] = []
  let previous = 0
  for (const p of sorted) {
    if (p - previous > 1) parts.push("…")
    parts.push(p)
    previous = p
  }
  return parts
}

export function Pagination({
  page,
  totalPages,
  pathname,
  searchParams,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const linkClass =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm transition-colors"
  const idle = "text-muted-foreground hover:bg-accent hover:text-foreground"
  const active = "border-primary bg-primary text-primary-foreground"
  const disabled = "pointer-events-none opacity-40"

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center gap-1.5">
      <Link
        href={buildHref(pathname, searchParams, page - 1)}
        rel="prev"
        aria-label="Previous page"
        aria-disabled={page <= 1}
        className={cn(linkClass, page <= 1 ? disabled : idle)}
      >
        Prev
      </Link>

      {pageNumbers(page, totalPages).map((part, index) =>
        typeof part === "number" ? (
          <Link
            key={part}
            href={buildHref(pathname, searchParams, part)}
            aria-current={part === page ? "page" : undefined}
            className={cn(linkClass, part === page ? active : idle)}
          >
            {part}
          </Link>
        ) : (
          <span key={`${part}-${index}`} className="px-1 text-muted-foreground">
            …
          </span>
        )
      )}

      <Link
        href={buildHref(pathname, searchParams, page + 1)}
        rel="next"
        aria-label="Next page"
        aria-disabled={page >= totalPages}
        className={cn(linkClass, page >= totalPages ? disabled : idle)}
      >
        Next
      </Link>
    </nav>
  )
}
