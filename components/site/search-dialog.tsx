"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  IconSearch,
  IconArrowRight,
  IconSparkles,
  IconTrendingUp,
} from "@tabler/icons-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const POPULAR_TOPICS = [
  "VLOOKUP Formula",
  "XLOOKUP vs VLOOKUP",
  "INDEX MATCH",
  "Google Sheets Formulas",
  "Pivot Tables Guide",
  "Excel VBA Macros",
  "Conditional Formatting",
  "SUMIFS & COUNTIFS",
]

export function SearchDialog() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!query.trim()) return
    setOpen(false)
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    setQuery("")
  }

  function handleSelectTopic(topic: string) {
    setOpen(false)
    router.push(`/search?q=${encodeURIComponent(topic)}`)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative flex h-9.5 items-center justify-between gap-2.5 rounded-full border border-border/80 bg-muted/30 px-3.5 text-xs text-muted-foreground transition-all duration-200 hover:border-emerald-500/50 hover:bg-muted/70 hover:text-foreground w-40 sm:w-52 lg:w-60 shadow-2xs"
        aria-label="Search articles"
      >
        <span className="flex items-center gap-2 truncate">
          <IconSearch className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400 shrink-0" />
          <span className="truncate">Search tutorials…</span>
        </span>
        <kbd className="pointer-events-none hidden items-center gap-0.5 rounded border border-border/70 bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground shadow-2xs group-hover:text-foreground sm:inline-flex">
          <span className="text-[10px]">Ctrl</span> K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0 sm:max-w-xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Search Excel Insider</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="relative border-b border-border/60">
            <IconSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search formulas, tips, tutorials, templates…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-14 w-full bg-transparent pl-12 pr-24 text-sm font-medium placeholder:text-muted-foreground focus:outline-none"
              autoFocus
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-emerald-600 px-3.5 text-xs font-medium text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              Search
            </Button>
          </form>

          <div className="space-y-3 p-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <IconTrendingUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Trending Searches</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_TOPICS.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => handleSelectTopic(topic)}
                  className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/40 px-2.5 py-1.5 text-xs font-medium text-foreground transition-all duration-150 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300"
                >
                  <IconSparkles className="h-3 w-3 text-muted-foreground/70" />
                  <span>{topic}</span>
                  <IconArrowRight className="h-3 w-3 opacity-40" />
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
