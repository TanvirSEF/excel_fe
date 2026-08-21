import Link from "next/link"

import { CategoryFilter } from "@/components/site/category-filter"
import type { Category, Tag } from "@/types/api"

interface BlogFiltersProps {
  categories: Category[]
  tags: Tag[]
  category?: string
  tag?: string
}

function tagHref(slug: string, category?: string) {
  const search = new URLSearchParams()
  if (category) search.set("category", category)
  search.set("tag", slug)
  return `/blog?${search.toString()}`
}

export function BlogFilters({
  categories,
  tags,
  category,
  tag,
}: BlogFiltersProps) {
  if (categories.length === 0 && tags.length === 0) {
    return null
  }

  return (
    <div className="mb-8 flex flex-col gap-3 border-y py-4 sm:flex-row sm:items-center sm:justify-between">
      <CategoryFilter
        categories={categories}
        current={category}
        extraParams={{ tag }}
      />
      {tags.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1.5">
          {tags.map((t) => (
            <Link
              key={t.id}
              href={tagHref(t.slug, category)}
              className={
                t.slug === tag
                  ? "rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground"
                  : "rounded-full border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
              }
            >
              {t.name}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  )
}
