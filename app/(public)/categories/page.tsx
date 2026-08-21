import type { Metadata } from "next"

import { EmptyState } from "@/components/shared/empty-state"
import { CategoryCard } from "@/components/site/category-card"
import { PageHeader } from "@/components/site/page-header"
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
      <PageHeader
        title="Categories"
        description="Every topic on the site, organized."
      />

      {sorted.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((category) => (
            <CategoryCard key={category.id} category={category} />
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
