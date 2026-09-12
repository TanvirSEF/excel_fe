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
} from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import type { NavCategory } from "@/types/api"

const BLOG_ITEM_STYLES = [
  {
    icon: IconMathFunction,
    box: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: IconTable,
    box: "bg-green-500/10 text-green-600 dark:text-green-400",
  },
  {
    icon: IconCode,
    box: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    icon: IconChartBar,
    box: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
]

const FALLBACK_BLOG_ITEMS: NavCategory[] = [
  {
    name: "Excel Formulas & Functions",
    slug: "",
    description: "VLOOKUP, XLOOKUP, INDEX MATCH & more",
  },
  {
    name: "Google Sheets Guides",
    slug: "",
    description: "Cloud functions, QUERY, ARRAYFORMULA",
  },
  {
    name: "VBA & Macro Automation",
    slug: "",
    description: "Automate repetitive spreadsheet workflows",
  },
  {
    name: "Charts & Dashboards",
    slug: "",
    description: "Professional visualizations & reporting",
  },
]

interface MainNavProps {
  categories?: NavCategory[]
}

export function MainNav({ categories = [] }: MainNavProps) {
  const blogItems = categories.length > 0 ? categories : FALLBACK_BLOG_ITEMS
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

      {/* Spreadsheet Blogs Mega Dropdown */}
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
            className="absolute top-full left-0 pt-1.5 z-50 animate-in fade-in-0 zoom-in-95 duration-150"
            onMouseEnter={() => handleMouseEnter("blogs")}
            onMouseLeave={handleMouseLeave}
          >
            <div className="w-80 p-2 rounded-xl shadow-xl border border-border/70 backdrop-blur-md bg-background/95">
              {blogItems.map((item, index) => {
                const style = BLOG_ITEM_STYLES[index % BLOG_ITEM_STYLES.length]
                const Icon = style.icon
                return (
                  <Link
                    key={item.slug || item.name}
                    href={item.slug ? `/categories/${item.slug}` : "/blog"}
                    onClick={() => setActiveMenu(null)}
                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/60 transition-colors"
                  >
                    <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", style.box)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <p className="truncate text-xs font-semibold text-foreground">{item.name}</p>
                      {item.description ? (
                        <p className="line-clamp-1 text-[11px] text-muted-foreground">{item.description}</p>
                      ) : null}
                    </div>
                  </Link>
                )
              })}

              <div className="my-1.5 h-px bg-border/60" />

              <Link
                href="/categories"
                onClick={() => setActiveMenu(null)}
                className="flex items-center justify-between p-2 rounded-lg text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 hover:bg-muted/40 transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <IconBook2 className="h-3.5 w-3.5" />
                  <span>Browse All Categories</span>
                </span>
              </Link>
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
