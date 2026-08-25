"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  IconMenu2,
  IconChevronDown,
  IconMathFunction,
  IconTable,
  IconCode,
  IconChartBar,
  IconCalculator,
  IconPercentage,
  IconCalendarEvent,
  IconFileSpreadsheet,
  IconUserCheck,
  IconMail,
  IconInfoCircle,
} from "@tabler/icons-react"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const [blogsExpanded, setBlogsExpanded] = useState(true)
  const [pricingExpanded, setPricingExpanded] = useState(false)
  const [calcExpanded, setCalcExpanded] = useState(false)
  const pathname = usePathname()

  function handleLinkClick() {
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="flex h-9.5 w-9.5 items-center justify-center rounded-lg border border-border/70 bg-muted/30 text-foreground transition-colors hover:bg-muted lg:hidden"
          aria-label="Open mobile navigation"
        >
          <IconMenu2 className="h-5 w-5" />
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-sm p-0 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-6 p-6">
          <SheetHeader className="text-left pb-4 border-b border-border/60">
            <SheetTitle asChild>
              <Link href="/" onClick={handleLinkClick} className="inline-block">
                <Image
                  src="/logo.png"
                  alt="Excel Insider"
                  width={140}
                  height={36}
                  className="h-8 w-auto object-contain dark:brightness-110"
                />
              </Link>
            </SheetTitle>
          </SheetHeader>

          <nav className="space-y-1.5" aria-label="Mobile Navigation">
            {/* About Us */}
            <Link
              href="/about"
              onClick={handleLinkClick}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                pathname === "/about" && "bg-muted font-semibold text-foreground"
              )}
            >
              <IconInfoCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>About Us</span>
            </Link>

            {/* Spreadsheet Blogs Accordion */}
            <div className="rounded-xl border border-border/50 bg-muted/20 overflow-hidden">
              <button
                type="button"
                onClick={() => setBlogsExpanded(!blogsExpanded)}
                className="flex w-full items-center justify-between px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted/40"
              >
                <span className="flex items-center gap-2.5">
                  <IconMathFunction className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Spreadsheet Blogs</span>
                </span>
                <IconChevronDown
                  className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", blogsExpanded && "rotate-180")}
                />
              </button>

              {blogsExpanded && (
                <div className="space-y-1 px-2 pb-2.5 pt-1 text-xs border-t border-border/40">
                  <Link
                    href="/blog"
                    onClick={handleLinkClick}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-muted-foreground hover:bg-background hover:text-foreground"
                  >
                    <IconMathFunction className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Excel Formulas & Functions</span>
                  </Link>
                  <Link
                    href="/blog"
                    onClick={handleLinkClick}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-muted-foreground hover:bg-background hover:text-foreground"
                  >
                    <IconTable className="h-3.5 w-3.5 text-green-500" />
                    <span>Google Sheets Guides</span>
                  </Link>
                  <Link
                    href="/blog"
                    onClick={handleLinkClick}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-muted-foreground hover:bg-background hover:text-foreground"
                  >
                    <IconCode className="h-3.5 w-3.5 text-amber-500" />
                    <span>VBA & Macro Automation</span>
                  </Link>
                  <Link
                    href="/blog"
                    onClick={handleLinkClick}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-muted-foreground hover:bg-background hover:text-foreground"
                  >
                    <IconChartBar className="h-3.5 w-3.5 text-purple-500" />
                    <span>Charts & Dashboards</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Pricing Accordion */}
            <div className="rounded-xl border border-border/50 bg-muted/20 overflow-hidden">
              <button
                type="button"
                onClick={() => setPricingExpanded(!pricingExpanded)}
                className="flex w-full items-center justify-between px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted/40"
              >
                <span className="flex items-center gap-2.5">
                  <IconFileSpreadsheet className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span>Pricing & Templates</span>
                </span>
                <IconChevronDown
                  className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", pricingExpanded && "rotate-180")}
                />
              </button>

              {pricingExpanded && (
                <div className="space-y-1 px-2 pb-2.5 pt-1 text-xs border-t border-border/40">
                  <Link
                    href="/pricing"
                    onClick={handleLinkClick}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-muted-foreground hover:bg-background hover:text-foreground"
                  >
                    <IconFileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Excel Templates Pack</span>
                  </Link>
                  <Link
                    href="/pricing"
                    onClick={handleLinkClick}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-muted-foreground hover:bg-background hover:text-foreground"
                  >
                    <IconUserCheck className="h-3.5 w-3.5 text-blue-500" />
                    <span>Pro Consultation</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Calculators Accordion */}
            <div className="rounded-xl border border-border/50 bg-muted/20 overflow-hidden">
              <button
                type="button"
                onClick={() => setCalcExpanded(!calcExpanded)}
                className="flex w-full items-center justify-between px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted/40"
              >
                <span className="flex items-center gap-2.5">
                  <IconCalculator className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Calculators</span>
                </span>
                <IconChevronDown
                  className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", calcExpanded && "rotate-180")}
                />
              </button>

              {calcExpanded && (
                <div className="space-y-1 px-2 pb-2.5 pt-1 text-xs border-t border-border/40">
                  <Link
                    href="/calculators"
                    onClick={handleLinkClick}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-muted-foreground hover:bg-background hover:text-foreground"
                  >
                    <IconCalculator className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Loan & Mortgage Calculator</span>
                  </Link>
                  <Link
                    href="/calculators"
                    onClick={handleLinkClick}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-muted-foreground hover:bg-background hover:text-foreground"
                  >
                    <IconPercentage className="h-3.5 w-3.5 text-teal-500" />
                    <span>Compound Interest</span>
                  </Link>
                  <Link
                    href="/calculators"
                    onClick={handleLinkClick}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-muted-foreground hover:bg-background hover:text-foreground"
                  >
                    <IconCalendarEvent className="h-3.5 w-3.5 text-orange-500" />
                    <span>Date & Working Days</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Contact Us */}
            <Link
              href="/contact"
              onClick={handleLinkClick}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                pathname === "/contact" && "bg-muted font-semibold text-foreground"
              )}
            >
              <IconMail className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span>Contact Us</span>
            </Link>
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-border/60 bg-muted/10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Switch Theme</span>
            <ThemeToggle />
          </div>
          <Button asChild className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm">
            <Link href="/pricing" onClick={handleLinkClick}>
              Explore Free Templates
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
