import Link from "next/link"
import { IconX } from "@tabler/icons-react"

import { CategoryFilter } from "@/components/site/category-filter"
import type { Category } from "@/types/api"

interface BlogFiltersProps {
  categories: Category[]
  category?: string
  tag?: string
}

function humanizeSlug(slug: string) {
  return slug.replace(/-/g, " ")
}

export function BlogFilters({ categories, category, tag }: BlogFiltersProps) {
  if (categories.length === 0 && !tag) {
    return null
  }

  function removeTagHref() {
    const search = new URLSearchParams()
    if (category) search.set("category", category)
    const query = search.toString()
    return query ? `/blog?${query}` : "/blog"
  }

  return (
    <div className="mb-8 flex flex-col gap-3 border-y py-4 sm:flex-row sm:items-center sm:justify-between">
      <CategoryFilter
        categories={categories}
        current={category}
        extraParams={{ tag }}
      />
      {tag ? (
        <Link
          href={removeTagHref()}
          className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/25 bg-primary/8 px-3 py-1 text-xs font-medium capitalize text-primary transition-colors hover:bg-primary/15"
        >
          <span>#{humanizeSlug(tag)}</span>
          <IconX className="h-3 w-3" />
        </Link>
      ) : null}
    </div>
  )
}
