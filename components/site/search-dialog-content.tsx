"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  IconSearch,
  IconArrowRight,
  IconMathFunction,
  IconTable,
  IconCode,
  IconChartBar,
  IconCalculator,
  IconX,
  IconCornerDownLeft,
} from "@tabler/icons-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const QUICK_CATEGORIES = [
  { label: "Excel Formulas", href: "/blog", icon: IconMathFunction, color: "text-emerald-500 bg-emerald-500/10" },
  { label: "Google Sheets", href: "/blog", icon: IconTable, color: "text-green-500 bg-green-500/10" },
  { label: "VBA & Macros", href: "/blog", icon: IconCode, color: "text-amber-500 bg-amber-500/10" },
  { label: "Charts & Visuals", href: "/blog", icon: IconChartBar, color: "text-purple-500 bg-purple-500/10" },
  { label: "Calculators", href: "/calculators", icon: IconCalculator, color: "text-indigo-500 bg-indigo-500/10" },
]

const POPULAR_SEARCHES = [
  "VLOOKUP Formula",
  "XLOOKUP vs VLOOKUP",
  "INDEX MATCH Tutorial",
  "Conditional Formatting",
  "Google Sheets QUERY",
  "Excel Pivot Tables",
  "SUMIFS Multiple Criteria",
  "VBA Macro Loop",
]

interface SearchDialogContentProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchDialogContent({ open, onOpenChange }: SearchDialogContentProps) {
  const [query, setQuery] = useState("")
  const router = useRouter()

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!query.trim()) return
    onOpenChange(false)
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    setQuery("")
  }

  function handleNavigate(href: string) {
    onOpenChange(false)
    router.push(href)
  }

  function handleSelectTopic(topic: string) {
    onOpenChange(false)
    router.push(`/search?q=${encodeURIComponent(topic)}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideCloseButton
        className="overflow-hidden p-0 sm:max-w-2xl rounded-2xl border-border/70 bg-background/95 backdrop-blur-xl shadow-2xl"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Search Excel Insider</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="relative flex items-center border-b border-border/60 px-4">
          <IconSearch className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            type="search"
            placeholder="Search 1,600+ Excel formulas, tips, tutorials & templates…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-14 w-full bg-transparent px-3.5 text-sm font-medium placeholder:text-muted-foreground/60 focus:outline-none"
            autoFocus
          />
          <div className="flex items-center gap-2 shrink-0">
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Clear query"
              >
                <IconX className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-md border border-border/80 bg-muted/40 px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              ESC
            </button>
          </div>
        </form>

        <div className="max-h-[60vh] overflow-y-auto p-5 space-y-6">
          <div className="space-y-2.5">
            <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              Browse Categories
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {QUICK_CATEGORIES.map((cat) => {
                const Icon = cat.icon
                return (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={() => handleNavigate(cat.href)}
                    className="group flex items-center gap-2.5 rounded-xl border border-border/50 bg-muted/20 p-2.5 text-left text-xs font-medium text-foreground transition-all duration-150 hover:border-border hover:bg-muted/60"
                  >
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${cat.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="truncate">{cat.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-2.5">
            <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              Popular Searches
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {POPULAR_SEARCHES.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => handleSelectTopic(topic)}
                  className="group flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
                >
                  <div className="flex items-center gap-2 truncate">
                    <IconSearch className="h-3.5 w-3.5 text-muted-foreground/60 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
                    <span className="truncate">{topic}</span>
                  </div>
                  <IconArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border/50 bg-muted/20 px-5 py-2.5 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border/80 bg-background px-1 py-0.5 font-mono text-[10px]">
                <IconCornerDownLeft className="inline h-2.5 w-2.5" />
              </kbd>
              <span>to search</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border/80 bg-background px-1 py-0.5 font-mono text-[10px]">
                ESC
              </kbd>
              <span>to close</span>
            </span>
          </div>
          <span className="font-medium text-emerald-600 dark:text-emerald-400">Excel Insider Search</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
