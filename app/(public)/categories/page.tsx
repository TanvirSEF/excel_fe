import type { Metadata } from "next"
import Link from "next/link"

import { EmptyState } from "@/components/shared/empty-state"
import { getCategories } from "@/lib/api/categories"

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse Excel Insider articles by topic.",
  alternates: { canonical: "/categories" },
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  const sorted = [...categories].sort((a, b) => {
    if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1
    return a.order_index - b.order_index
  })

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Categories
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Every topic on the site, organized.
        </p>
      </header>

      {sorted.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group flex flex-col gap-3 rounded-xl border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <div className="flex items-center gap-2.5">
                {category.color_hex ? (
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: category.color_hex }}
                    aria-hidden
                  />
                ) : null}
                <h2 className="font-semibold tracking-tight transition-colors group-hover:text-primary">
                  {category.name}
                </h2>
                {category.is_featured ? (
                  <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[0.675rem] font-medium text-primary">
                    Featured
                  </span>
                ) : null}
              </div>
              {category.description ? (
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {category.description}
                </p>
              ) : null}
              {category.children.length > 0 ? (
                <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                  {category.children.map((child) => (
                    <span
                      key={child.id}
                      className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground"
                    >
                      {child.name}
                    </span>
                  ))}
                </div>
              ) : null}
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No categories yet"
          description="Categories will appear here once content is organized."
        />
      )}
    </div>
  )
}
