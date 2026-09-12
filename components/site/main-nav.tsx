"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  IconChevronDown,
  IconMathFunction,
  IconTable,
  IconCode,
  IconChartBar,
  IconChartHistogram,
  IconReportMoney,
  IconScale,
  IconBook2,
  IconFileSpreadsheet,
  IconUserCheck,
  IconArrowRight,
  IconBrandOffice,
  IconBrandGoogle,
  IconBulb,
  IconBolt,
  IconAdjustments,
} from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import type { NavCategory } from "@/types/api"

interface CategoryItem {
  name: string
  slug: string
  description: string
  icon: typeof IconMathFunction
}

const EXCEL_TOPICS: CategoryItem[] = [
  {
    name: "Functions & Formulas",
    slug: "excel-functions-formulas",
    description: "VLOOKUP, XLOOKUP, INDEX MATCH & logic",
    icon: IconMathFunction,
  },
  {
    name: "Advanced Excel",
    slug: "advanced-excel",
    description: "Dynamic arrays, complex modeling & arrays",
    icon: IconTable,
  },
  {
    name: "Excel VBA & Macros",
    slug: "excel-vba",
    description: "Automation scripts, procedures & user forms",
    icon: IconCode,
  },
  {
    name: "Excel Pivot Tables",
    slug: "excel-pivot-table",
    description: "Summary reports, slicers & data models",
    icon: IconChartBar,
  },
  {
    name: "Excel Charts & Visuals",
    slug: "excel-charts",
    description: "Visual reporting & dynamic dashboards",
    icon: IconChartHistogram,
  },
  {
    name: "Excel Pro Tips & Tricks",
    slug: "excel-pro-tips",
    description: "Productivity shortcuts, hacks & best practices",
    icon: IconBolt,
  },
]

const GOOGLE_TOPICS: CategoryItem[] = [
  {
    name: "Google Sheets Basic",
    slug: "google-sheets-basics",
    description: "Getting started, interface & core fundamentals",
    icon: IconBulb,
  },
  {
    name: "Google Sheets Functions",
    slug: "google-sheets-functions",
    description: "FILTER, SORT, UNIQUE & web functions",
    icon: IconTable,
  },
  {
    name: "Google Sheets Formulas",
    slug: "google-sheets-formulas",
    description: "QUERY, ARRAYFORMULA, IMPORTRANGE & regex",
    icon: IconMathFunction,
  },
  {
    name: "Google Sheets Intermediate Tutorial",
    slug: "google-sheets-intermediate-tutorials",
    description: "Data cleaning, Pivot tables & conditional formatting",
    icon: IconAdjustments,
  },
  {
    name: "Google Sheets Charts",
    slug: "charts-in-google-sheets",
    description: "Interactive cloud charts, dashboards & sparklines",
    icon: IconChartBar,
  },
  {
    name: "Google Sheets Advanced Tutorial",
    slug: "google-sheets-advanced-tutorials",
    description: "Apps Script automation, APIs & cloud workflows",
    icon: IconCode,
  },
]

interface MainNavProps {
  categories?: NavCategory[]
}

export function MainNav({ categories = [] }: MainNavProps) {
  const pathname = usePathname()

  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = (menu: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setActiveMenu(menu)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null)
    }, 150)
  }

  const [prevPathname, setPrevPathname] = useState(pathname)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setActiveMenu(null)
  }

  // Resolve category slugs against actual DB categories
  const categoryMap = new Map(categories.map((c) => [c.slug, c]))

  const excelItems = EXCEL_TOPICS.map((topic) => {
    const dbCat = categoryMap.get(topic.slug)
    return {
      ...topic,
      slug: dbCat ? dbCat.slug : topic.slug,
      name: dbCat ? dbCat.name : topic.name,
    }
  })

  const googleItems = GOOGLE_TOPICS.map((topic) => {
    const dbCat = categoryMap.get(topic.slug)
    return {
      ...topic,
      slug: dbCat ? dbCat.slug : topic.slug,
      name: topic.name,
    }
  })

  const isBlogActive = pathname.startsWith("/blog") || pathname.startsWith("/categories")
  const isPricingActive = pathname.startsWith("/pricing")
  const isCalculatorActive = pathname.startsWith("/calculators")

  return (
    <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium" aria-label="Main Navigation">
      {/* About Us */}
      <Link
        href="/about"
        className={cn(
          "rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50",
          pathname === "/about" && "text-foreground font-semibold bg-muted/40"
        )}
      >
        About Us
      </Link>

      {/* Pricing Dropdown */}
      <div
        className="relative"
        onMouseEnter={() => handleMouseEnter("pricing")}
        onMouseLeave={handleMouseLeave}
      >
        <button
          type="button"
          onClick={() => setActiveMenu(activeMenu === "pricing" ? null : "pricing")}
          className={cn(
            "group flex items-center gap-1 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50 outline-none cursor-pointer",
            (isPricingActive || activeMenu === "pricing") && "text-foreground font-semibold bg-muted/40"
          )}
          aria-expanded={activeMenu === "pricing"}
        >
          <span>Pricing</span>
          <IconChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-200 opacity-70",
              activeMenu === "pricing" && "rotate-180"
            )}
          />
        </button>

        {activeMenu === "pricing" && (
          <div
            className="absolute top-full left-0 pt-1.5 z-50 animate-in fade-in-0 zoom-in-95 duration-150"
            onMouseEnter={() => handleMouseEnter("pricing")}
            onMouseLeave={handleMouseLeave}
          >
            <div className="w-72 p-2 rounded-xl shadow-xl border border-border/70 backdrop-blur-md bg-background/95">
              <Link
                href="/pricing"
                onClick={() => setActiveMenu(null)}
                className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/60 transition-colors"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <IconUserCheck className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-foreground">Services & Solutions</p>
                  <p className="text-[11px] text-muted-foreground">Expert help plans from $19 — Basic, Premium & Advanced</p>
                </div>
              </Link>

              <Link
                href="/services/custom-templates"
                onClick={() => setActiveMenu(null)}
                className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/60 transition-colors"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <IconFileSpreadsheet className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-foreground">Custom Templates</p>
                  <p className="text-[11px] text-muted-foreground">Bespoke templates from $25 — Excel or Google Sheets</p>
                </div>
              </Link>

              <Link
                href="/services/custom-tools"
                onClick={() => setActiveMenu(null)}
                className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/60 transition-colors"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <IconCode className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-foreground">Custom Spreadsheet Tools</p>
                  <p className="text-[11px] text-muted-foreground">Custom tools & Workspace add-ons from $500</p>
                </div>
              </Link>

              <div className="my-1.5 h-px bg-border/60" />

              <Link
                href="/pricing"
                onClick={() => setActiveMenu(null)}
                className="flex items-center justify-between p-2 rounded-lg text-xs font-medium text-primary hover:text-primary hover:bg-muted/40 transition-colors"
              >
                <span>View All Pricing & Plans</span>
                <IconArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Spreadsheet Blogs 2-Column Mega Menu */}
      <div
        className="relative"
        onMouseEnter={() => handleMouseEnter("blogs")}
        onMouseLeave={handleMouseLeave}
      >
        <button
          type="button"
          onClick={() => setActiveMenu(activeMenu === "blogs" ? null : "blogs")}
          className={cn(
            "group flex items-center gap-1 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50 outline-none cursor-pointer",
            (isBlogActive || activeMenu === "blogs") && "text-foreground font-semibold bg-muted/40"
          )}
          aria-expanded={activeMenu === "blogs"}
        >
          <span>Spreadsheet Blogs</span>
          <IconChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-200 opacity-70",
              activeMenu === "blogs" && "rotate-180"
            )}
          />
        </button>

        {activeMenu === "blogs" && (
          <div
            className="absolute top-full -left-28 xl:-left-20 pt-1.5 z-50 animate-in fade-in-0 zoom-in-95 duration-150"
            onMouseEnter={() => handleMouseEnter("blogs")}
            onMouseLeave={handleMouseLeave}
          >
            <div className="w-[660px] xl:w-[700px] rounded-2xl shadow-2xl border border-border/70 backdrop-blur-xl bg-background/98 p-4 sm:p-5">
              <div className="grid grid-cols-2 gap-5">
                {/* Column 1: Microsoft Excel */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 pb-2.5 border-b border-border/60">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <IconBrandOffice className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        Microsoft Excel
                      </h3>
                      <p className="text-[11px] text-muted-foreground">Formulas, VBA macros & deep-dives</p>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    {excelItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.slug}
                          href={`/categories/${item.slug}`}
                          onClick={() => setActiveMenu(null)}
                          className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-muted/60 transition-colors group"
                        >
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground group-hover:bg-emerald-500/15 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mt-0.5">
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <div className="min-w-0 space-y-0.5">
                            <p className="truncate text-xs font-semibold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                              {item.name}
                            </p>
                            <p className="line-clamp-1 text-[11px] text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>

                {/* Column 2: Google Sheets */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 pb-2.5 border-b border-border/60">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                      <IconBrandGoogle className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                        Google Sheets
                      </h3>
                      <p className="text-[11px] text-muted-foreground">Cloud functions & web workflows</p>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    {googleItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.slug}
                          href={`/categories/${item.slug}`}
                          onClick={() => setActiveMenu(null)}
                          className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-muted/60 transition-colors group"
                        >
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground group-hover:bg-teal-500/15 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors mt-0.5">
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <div className="min-w-0 space-y-0.5">
                            <p className="truncate text-xs font-semibold text-foreground group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                              {item.name}
                            </p>
                            <p className="line-clamp-1 text-[11px] text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Footer Bar */}
              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <IconBook2 className="h-3.5 w-3.5 text-primary" />
                  <span>Looking for more? Explore all 1,600+ spreadsheet guides.</span>
                </p>
                <Link
                  href="/categories"
                  onClick={() => setActiveMenu(null)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors px-2.5 py-1 rounded-md hover:bg-primary/10"
                >
                  <span>Browse All Categories</span>
                  <IconArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Calculators Dropdown */}
      <div
        className="relative"
        onMouseEnter={() => handleMouseEnter("calculators")}
        onMouseLeave={handleMouseLeave}
      >
        <button
          type="button"
          onClick={() => setActiveMenu(activeMenu === "calculators" ? null : "calculators")}
          className={cn(
            "group flex items-center gap-1 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50 outline-none cursor-pointer",
            (isCalculatorActive || activeMenu === "calculators") && "text-foreground font-semibold bg-muted/40"
          )}
          aria-expanded={activeMenu === "calculators"}
        >
          <span>Calculators</span>
          <IconChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-200 opacity-70",
              activeMenu === "calculators" && "rotate-180"
            )}
          />
        </button>

        {activeMenu === "calculators" && (
          <div
            className="absolute top-full left-0 pt-1.5 z-50 animate-in fade-in-0 zoom-in-95 duration-150"
            onMouseEnter={() => handleMouseEnter("calculators")}
            onMouseLeave={handleMouseLeave}
          >
            <div className="w-72 p-2 rounded-xl shadow-xl border border-border/70 backdrop-blur-md bg-background/95">
              <Link
                href="/calculators/statistics"
                onClick={() => setActiveMenu(null)}
                className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/60 transition-colors"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <IconChartHistogram className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-foreground">Statistics</p>
                  <p className="text-[11px] text-muted-foreground">Mean, median, deviation & probability tools</p>
                </div>
              </Link>

              <Link
                href="/calculators/finance"
                onClick={() => setActiveMenu(null)}
                className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/60 transition-colors"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <IconReportMoney className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-foreground">Finance</p>
                  <p className="text-[11px] text-muted-foreground">Loans, interest, investments & valuation</p>
                </div>
              </Link>

              <Link
                href="/calculators/accounting"
                onClick={() => setActiveMenu(null)}
                className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/60 transition-colors"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <IconScale className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-foreground">Accounting</p>
                  <p className="text-[11px] text-muted-foreground">Margin, markup, depreciation & tax</p>
                </div>
              </Link>

              <div className="my-1.5 h-px bg-border/60" />

              <Link
                href="/calculators"
                onClick={() => setActiveMenu(null)}
                className="flex items-center justify-between p-2 rounded-lg text-xs font-medium text-primary hover:text-primary hover:bg-muted/40 transition-colors"
              >
                <span>View All Calculators</span>
                <IconArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Contact Us */}
      <Link
        href="/contact"
        className={cn(
          "rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50",
          pathname === "/contact" && "text-foreground font-semibold bg-muted/40"
        )}
      >
        Contact Us
      </Link>
    </nav>
  )
}
