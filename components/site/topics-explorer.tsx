"use client"

import { useState } from "react"
import Link from "next/link"
import {
  IconArrowRight,
  IconFolder,
  IconFolderOpen,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { PostCard } from "@/components/site/post-card"
import { SectionHeading } from "@/components/site/section-heading"
import { Skeleton } from "@/components/ui/skeleton"
import { usePostsByCategory } from "@/lib/queries/posts"
import { cn } from "@/lib/utils"
import type { Category, PostListItem } from "@/types/api"

interface TopicsExplorerProps {
  categories: Category[]
  initialCategorySlug?: string
  initialPosts?: PostListItem[]
}

const FALLBACK_CATEGORIES: Category[] = [
  {
    id: "1",
    name: "Excel Formulas",
    slug: "formulas",
    parent_id: null,
    order_index: 1,
    description: "Formulas and functions guides",
    icon_url: null,
    color_hex: null,
    is_featured: true,
    seo_title: null,
    seo_description: null,
    children: [],
  },
  {
    id: "2",
    name: "VBA & Macros",
    slug: "vba-macros",
    parent_id: null,
    order_index: 2,
    description: "VBA and automation tutorials",
    icon_url: null,
    color_hex: null,
    is_featured: true,
    seo_title: null,
    seo_description: null,
    children: [],
  },
  {
    id: "3",
    name: "Charts & Dashboards",
    slug: "dashboards",
    parent_id: null,
    order_index: 3,
    description: "Data visualization and reporting",
    icon_url: null,
    color_hex: null,
    is_featured: true,
    seo_title: null,
    seo_description: null,
    children: [],
  },
  {
    id: "4",
    name: "Google Sheets",
    slug: "google-sheets",
    parent_id: null,
    order_index: 4,
    description: "Cloud spreadsheet tutorials",
    icon_url: null,
    color_hex: null,
    is_featured: true,
    seo_title: null,
    seo_description: null,
    children: [],
  },
  {
    id: "5",
    name: "Data Analysis & Power Query",
    slug: "data-analysis",
    parent_id: null,
    order_index: 5,
    description: "Data cleaning and transformation",
    icon_url: null,
    color_hex: null,
    is_featured: true,
    seo_title: null,
    seo_description: null,
    children: [],
  },
  {
    id: "6",
    name: "Finance & Accounting",
    slug: "finance",
    parent_id: null,
    order_index: 6,
    description: "Financial modeling and valuation",
    icon_url: null,
    color_hex: null,
    is_featured: true,
    seo_title: null,
    seo_description: null,
    children: [],
  },
]

export function TopicsExplorer({
  categories = [],
  initialCategorySlug,
  initialPosts = [],
}: TopicsExplorerProps) {
  const displayCategories =
    categories.length > 0 ? categories : FALLBACK_CATEGORIES

  const [activeSlug, setActiveSlug] = useState<string>(
    initialCategorySlug || displayCategories[0]?.slug || "formulas"
  )

  const activeCategory =
    displayCategories.find((c) => c.slug === activeSlug) ||
    displayCategories[0]

  const { data: postsData, isPending } = usePostsByCategory(
    activeSlug,
    6,
    activeSlug === initialCategorySlug && initialPosts.length > 0
      ? {
          items: initialPosts,
          total: initialPosts.length,
          page: 1,
          page_size: 6,
          total_pages: 1,
        }
      : undefined
  )

  const currentPosts = postsData?.items ?? (activeSlug === initialCategorySlug ? initialPosts : [])

  return (
    <section className="py-14 sm:py-18">
      <SectionHeading
        badge="Topic Directory"
        title="All Topics from Excel & Google Sheets"
        subtitle="Explore in-depth articles across every Excel and Google Sheets category. Select any topic to view the latest tutorials."
        action={{
          label: `Browse ${activeCategory.name} archive`,
          href: `/categories/${activeCategory.slug}`,
        }}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr] lg:gap-10 items-start">
        {/* ── Left: Vertical Category Navigation ── */}
        <div className="flex flex-col gap-2">
          {/* Mobile Horizontal Category Bar */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none lg:hidden">
            {displayCategories.map((category) => {
              const isActive = category.slug === activeSlug
              return (
                <button
                  key={category.id || category.slug}
                  type="button"
                  onClick={() => setActiveSlug(category.slug)}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "border border-border/80 bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  <span>{category.name}</span>
                </button>
              )
            })}
          </div>

          {/* Desktop Vertical Category Sidebar */}
          <div className="hidden lg:flex flex-col gap-1.5 rounded-2xl border border-border/80 bg-card p-3 shadow-2xs">
            <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">
              Browse Topics
            </p>
            {displayCategories.map((category) => {
              const isActive = category.slug === activeSlug
              const Icon = isActive ? IconFolderOpen : IconFolder
              return (
                <button
                  key={category.id || category.slug}
                  type="button"
                  onClick={() => setActiveSlug(category.slug)}
                  className={cn(
                    "group flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 text-left cursor-pointer",
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "text-foreground/80 hover:bg-muted/70 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        isActive
                          ? "text-primary-foreground"
                          : "text-primary"
                      )}
                    />
                    <span className="truncate">{category.name}</span>
                  </div>

                  <IconArrowRight
                    className={cn(
                      "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
                      isActive
                        ? "text-primary-foreground translate-x-0.5"
                        : "opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 text-muted-foreground"
                    )}
                  />
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Right: Category Posts Grid ── */}
        <div className="space-y-6">
          {/* Active Category Header Bar */}
          <div className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/40 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-sm font-bold text-foreground">
                {activeCategory.name}
              </span>
              <span className="text-xs text-muted-foreground">
                ({currentPosts.length} articles shown)
              </span>
            </div>

            <Link
              href={`/categories/${activeCategory.slug}`}
              className="group inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80"
            >
              <span>View full archive</span>
              <IconArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Posts Grid or Loading / Empty States */}
          {isPending && currentPosts.length === 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col space-y-3 rounded-2xl border border-border/80 bg-card p-3.5"
                >
                  <Skeleton className="aspect-16/10 w-full rounded-xl" />
                  <Skeleton className="h-4 w-1/3 rounded-sm" />
                  <Skeleton className="h-5 w-3/4 rounded-sm" />
                  <Skeleton className="h-4 w-full rounded-sm" />
                </div>
              ))}
            </div>
          ) : currentPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {currentPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center px-4 bg-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
                <IconFolder className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-foreground">
                No guides in {activeCategory.name} yet
              </h4>
              <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                We are currently writing fresh tutorials for this topic. Check back soon or explore other categories.
              </p>
              <Button asChild size="sm" variant="outline" className="mt-5 rounded-full">
                <Link href="/blog">Browse All Articles</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
