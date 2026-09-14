import type { Metadata } from "next"
import Link from "next/link"
import { IconArrowRight, IconCalculator } from "@tabler/icons-react"

import { Breadcrumb } from "@/components/site/breadcrumb"
import { CategoriesNavPills } from "@/components/site/categories-nav-pills"
import { CategorySection } from "@/components/site/category-section"
import { getCategories } from "@/lib/api/categories"
import { partitionCategories } from "@/lib/category-topics"

export const revalidate = 300

export const metadata: Metadata = {
  title: "Spreadsheet Categories & Learning Tracks | Excel Insider",
  description:
    "Explore in-depth tutorials, formulas, and automation workflows separated by platform — choose between Microsoft Excel and Google Sheets.",
  alternates: { canonical: "/categories" },
}

export default async function CategoriesPage() {
  const categories = await getCategories()
  const groups = partitionCategories(categories)

  const navGroups = groups.map((group) => ({
    id: group.id,
    title: group.title,
    platform: group.platform,
    count: group.items.length,
  }))

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12 space-y-12">
      {/* Page Header */}
      <div className="space-y-4">
        <Breadcrumb items={[{ label: "Categories" }]} />

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            Curated Knowledge Hub
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Spreadsheet Topics & Categories
          </h1>
          <p className="max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            Browse our complete library of spreadsheet guides separated by platform. Master formula syntax, automation scripts, and executive dashboards in Microsoft Excel or Google Sheets.
          </p>
        </div>

        {/* In-page Jump Pills */}
        <CategoriesNavPills groups={navGroups} />
      </div>

      {/* Platform Sections */}
      <div className="space-y-12">
        {groups.map((group) => (
          <CategorySection key={group.id} group={group} />
        ))}
      </div>

      {/* Bottom Discovery Band */}
      <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-card via-card to-muted/30 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-2xs">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <IconCalculator className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">
              Looking for Instant Calculations?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              Skip manual formula writing with our 45 dedicated financial, accounting, and statistics calculators. Instant results with formulas explained.
            </p>
          </div>
        </div>

        <Link
          href="/calculators"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground shadow-2xs transition-all hover:bg-primary/90 shrink-0"
        >
          <span>Explore 45 Calculators</span>
          <IconArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
