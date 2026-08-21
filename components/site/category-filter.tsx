"use client"

import { useRouter } from "next/navigation"

import type { Category } from "@/types/api"

interface CategoryFilterProps {
  categories: Category[]
  current?: string
  extraParams?: Record<string, string | undefined>
  basePath?: string
}

function flatten(
  categories: Category[],
  depth = 0
): { category: Category; depth: number }[] {
  return categories.flatMap((category) => [
    { category, depth },
    ...flatten(category.children ?? [], depth + 1),
  ])
}

export function CategoryFilter({
  categories,
  current,
  extraParams,
  basePath = "/blog",
}: CategoryFilterProps) {
  const router = useRouter()

  function onChange(value: string) {
    const params = new URLSearchParams()
    for (const [key, val] of Object.entries(extraParams ?? {})) {
      if (val) params.set(key, val)
    }
    if (value) params.set("category", value)
    const query = params.toString()
    router.push(query ? `${basePath}?${query}` : basePath)
  }

  return (
    <label className="flex items-center gap-2 text-sm text-muted-foreground">
      <span className="hidden sm:inline">Category</span>
      <select
        value={current ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring/50"
      >
        <option value="">All categories</option>
        {flatten(categories).map(({ category, depth }) => (
          <option key={category.id} value={category.slug}>
            {depth > 0 ? `${"— ".repeat(depth)}${category.name}` : category.name}
          </option>
        ))}
      </select>
    </label>
  )
}
