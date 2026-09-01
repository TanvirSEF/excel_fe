"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  IconChevronDown,
  IconMathFunction,
  IconTable,
  IconCode,
  IconChartBar,
  IconBook2,
  IconCalculator,
  IconPercentage,
  IconCalendarEvent,
  IconTools,
  IconFileSpreadsheet,
  IconUserCheck,
  IconArrowRight,
} from "@tabler/icons-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { NavCategory } from "@/types/api"

const BLOG_ITEM_STYLES = [
  {
    icon: IconMathFunction,
    box: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    plain: "text-emerald-500",
  },
  {
    icon: IconTable,
    box: "bg-green-500/10 text-green-600 dark:text-green-400",
    plain: "text-green-500",
  },
  {
    icon: IconCode,
    box: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    plain: "text-amber-500",
  },
  {
    icon: IconChartBar,
    box: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    plain: "text-purple-500",
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
  const blogItems =
    categories.length > 0 ? categories : FALLBACK_BLOG_ITEMS
  const pathname = usePathname()

  const isBlogActive = pathname.startsWith("/blog") || pathname.startsWith("/categories")
  const isPricingActive = pathname.startsWith("/pricing")
  const isCalculatorActive = pathname.startsWith("/calculators") || pathname.startsWith("/tools")

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
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "group flex items-center gap-1 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50 outline-none",
            isPricingActive && "text-foreground font-semibold bg-muted/40"
          )}
        >
          <span>Pricing</span>
          <IconChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180 opacity-70" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-72 p-2 rounded-xl shadow-xl border-border/70 backdrop-blur-md bg-background/95">
          <DropdownMenuItem asChild>
            <Link href="/contact?service=troubleshooting" className="flex items-start gap-3 p-2.5 rounded-lg cursor-pointer">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <IconUserCheck className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-foreground">Services & Solutions</p>
                <p className="text-[11px] text-muted-foreground">Expert consulting, troubleshooting & optimization</p>
              </div>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/contact?service=custom-template" className="flex items-start gap-3 p-2.5 rounded-lg cursor-pointer">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <IconFileSpreadsheet className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-foreground">Custom Templates</p>
                <p className="text-[11px] text-muted-foreground">Bespoke dashboards & financial models</p>
              </div>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/contact?service=automation" className="flex items-start gap-3 p-2.5 rounded-lg cursor-pointer">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <IconCode className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-foreground">Custom Spreadsheet Tools</p>
                <p className="text-[11px] text-muted-foreground">VBA macros, Apps Script & automations</p>
              </div>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href="/pricing" className="flex items-center justify-between p-2 rounded-lg text-xs font-medium text-primary hover:text-primary cursor-pointer">
              <span>View All Pricing & Plans</span>
              <IconArrowRight className="h-3.5 w-3.5" />
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Spreadsheet Blogs Mega Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "group flex items-center gap-1 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50 outline-none",
            isBlogActive && "text-foreground font-semibold bg-muted/40"
          )}
        >
          <span>Spreadsheet Blogs</span>
          <IconChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180 opacity-70" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-80 p-2 rounded-xl shadow-xl border-border/70 backdrop-blur-md bg-background/95">
          {blogItems.map((item, index) => {
            const style = BLOG_ITEM_STYLES[index % BLOG_ITEM_STYLES.length]
            const Icon = style.icon
            return (
              <DropdownMenuItem key={item.slug || item.name} asChild>
                <Link
                  href={item.slug ? `/categories/${item.slug}` : "/blog"}
                  className="flex items-start gap-3 p-2.5 rounded-lg cursor-pointer"
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
              </DropdownMenuItem>
            )
          })}

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href="/categories" className="flex items-center justify-between p-2 rounded-lg text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 cursor-pointer">
              <span className="flex items-center gap-1.5">
                <IconBook2 className="h-3.5 w-3.5" />
                <span>Browse All Categories</span>
              </span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Calculators Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "group flex items-center gap-1 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50 outline-none",
            isCalculatorActive && "text-foreground font-semibold bg-muted/40"
          )}
        >
          <span>Calculators</span>
          <IconChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180 opacity-70" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-72 p-2 rounded-xl shadow-xl border-border/70 backdrop-blur-md bg-background/95">
          <DropdownMenuItem asChild>
            <Link href="/calculators" className="flex items-start gap-3 p-2.5 rounded-lg cursor-pointer">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <IconCalculator className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-foreground">Loan & Mortgage</p>
                <p className="text-[11px] text-muted-foreground">Monthly payment & interest schedule</p>
              </div>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/calculators" className="flex items-start gap-3 p-2.5 rounded-lg cursor-pointer">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <IconPercentage className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-foreground">Compound Interest</p>
                <p className="text-[11px] text-muted-foreground">Investment growth & wealth projection</p>
              </div>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/calculators" className="flex items-start gap-3 p-2.5 rounded-lg cursor-pointer">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
                <IconCalendarEvent className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-foreground">Date & Working Days</p>
                <p className="text-[11px] text-muted-foreground">Calculate workdays and date ranges</p>
              </div>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href="/calculators" className="flex items-center justify-between p-2 rounded-lg text-xs font-medium text-primary hover:text-primary cursor-pointer">
              <span>View All Free Tools</span>
              <IconTools className="h-3.5 w-3.5" />
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
