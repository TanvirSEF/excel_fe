"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { IconListNumbers } from "@tabler/icons-react"

import type { TocEntry } from "@/lib/blocks"
import { cn } from "@/lib/utils"

interface ArticleTocSidebarProps {
  toc: TocEntry[]
  className?: string
}

interface FormattedTocEntry extends TocEntry {
  isSub: boolean
  numberPrefix: string
}

function formatTocEntries(toc: TocEntry[]): FormattedTocEntry[] {
  let count = 0
  const result: FormattedTocEntry[] = []

  for (const entry of toc) {
    const isSub = entry.level >= 3
    let numberPrefix = ""
    if (!isSub) {
      count += 1
      numberPrefix = String(count).padStart(2, "0")
    }
    result.push({
      ...entry,
      isSub,
      numberPrefix,
    })
  }

  return result
}

export function ArticleTocSidebar({ toc, className }: ArticleTocSidebarProps) {
  const [activeId, setActiveId] = useState<string>("")
  const isClickingRef = useRef(false)
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const items = useMemo(() => formatTocEntries(toc), [toc])
  const entryIds = useMemo(() => toc.map((entry) => entry.id), [toc])

  useEffect(() => {
    if (entryIds.length === 0) return

    const headings = entryIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (headings.length === 0) return

    let rafId: number | null = null

    function updateActiveHeading() {
      if (isClickingRef.current) return
      if (rafId !== null) return

      rafId = requestAnimationFrame(() => {
        rafId = null

        const scrollThreshold = window.scrollY + 120
        let current = headings[0].id

        for (let i = 0; i < headings.length; i++) {
          const top = headings[i].getBoundingClientRect().top + window.scrollY
          if (top <= scrollThreshold) {
            current = headings[i].id
          } else {
            break
          }
        }

        if (
          window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 30
        ) {
          current = headings[headings.length - 1].id
        }

        setActiveId(current)
      })
    }

    updateActiveHeading()
    window.addEventListener("scroll", updateActiveHeading, { passive: true })
    window.addEventListener("resize", updateActiveHeading, { passive: true })

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      window.removeEventListener("scroll", updateActiveHeading)
      window.removeEventListener("resize", updateActiveHeading)
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current)
    }
  }, [entryIds])

  function handleNavigate(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault()
    setActiveId(id)
    isClickingRef.current = true

    const target = document.getElementById(id)
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" })
      history.replaceState(null, "", `#${id}`)
    }

    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current)
    clickTimeoutRef.current = setTimeout(() => {
      isClickingRef.current = false
    }, 600)
  }

  if (toc.length < 2) return null

  return (
    <nav
      aria-label="Table of contents"
      className={cn(
        "w-full overflow-hidden rounded-2xl border border-border/70 bg-card p-4 shadow-2xs",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <IconListNumbers className="h-4 w-4" />
          </span>
          <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
            Table of Contents
          </h2>
        </div>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground border border-border/50">
          {toc.length}
        </span>
      </div>

      <div className="max-h-[500px] overflow-y-auto overscroll-contain pr-1 [scrollbar-width:thin] [scrollbar-color:var(--color-primary-30)_transparent] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border hover:[&::-webkit-scrollbar-thumb]:bg-primary/40">
        <ul className="relative space-y-1 border-l-2 border-border/60 pl-0">
          {items.map((entry) => {
            const isActive = activeId === entry.id

            return (
              <li key={entry.id} className="relative">
                <a
                  href={`#${entry.id}`}
                  onClick={(e) => handleNavigate(e, entry.id)}
                  className={cn(
                    "group block -ml-[2px] border-l-2 py-2 transition-colors leading-snug",
                    entry.isSub ? "pl-5 text-[13px]" : "pl-3 text-sm font-medium",
                    isActive
                      ? "border-primary font-semibold text-primary"
                      : "border-transparent text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  <span className="flex items-start gap-2.5 min-w-0">
                    {entry.numberPrefix ? (
                      <span
                        className={cn(
                          "shrink-0 text-xs font-bold tabular-nums mt-0.5",
                          isActive
                            ? "text-primary"
                            : "text-muted-foreground/70 group-hover:text-primary"
                        )}
                      >
                        {entry.numberPrefix}
                      </span>
                    ) : (
                      <span
                        className={cn(
                          "h-1.5 w-1.5 shrink-0 rounded-full mt-1.5",
                          isActive ? "bg-primary" : "bg-muted-foreground/40"
                        )}
                      />
                    )}
                    <span className="line-clamp-2 leading-snug">{entry.text}</span>
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
