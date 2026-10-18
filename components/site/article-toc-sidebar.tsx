"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { IconChevronRight, IconListNumbers } from "@tabler/icons-react"

import type { TocEntry } from "@/lib/blocks"
import { cn } from "@/lib/utils"

interface ArticleTocSidebarProps {
  toc: TocEntry[]
  className?: string
}

interface TocSection {
  entry: TocEntry
  children: TocEntry[]
}

function buildSections(entries: TocEntry[]): TocSection[] {
  const sections: TocSection[] = []
  let current: TocSection | null = null

  for (const entry of entries) {
    if (entry.level === 2) {
      current = { entry, children: [] }
      sections.push(current)
    } else if (current) {
      current.children.push(entry)
    } else {
      sections.push({ entry, children: [] })
    }
  }

  return sections
}

export function ArticleTocSidebar({ toc, className }: ArticleTocSidebarProps) {
  const [activeId, setActiveId] = useState<string>("")
  const isClickingRef = useRef(false)
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const sections = useMemo(() => buildSections(toc), [toc])
  const entryIds = useMemo(() => toc.map((entry) => entry.id), [toc])

  useEffect(() => {
    if (entryIds.length === 0) return

    const headings = entryIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (headings.length === 0) return

    let rafId: number | null = null

    function onScroll() {
      if (isClickingRef.current) return
      if (rafId !== null) return

      rafId = requestAnimationFrame(() => {
        rafId = null

        const scrollPosition = window.scrollY + 140
        let current = ""

        for (const heading of headings) {
          if (heading.getBoundingClientRect().top + window.scrollY <= scrollPosition) {
            current = heading.id
          }
        }

        if (
          window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 16
        ) {
          current = headings[headings.length - 1].id
        }

        if (current) {
          setActiveId(current)
        }
      })
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      window.removeEventListener("scroll", onScroll)
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
    }, 700)
  }

  if (toc.length < 2) return null

  const activeSectionId =
    sections.find(
      (s) => s.entry.id === activeId || s.children.some((c) => c.id === activeId)
    )?.entry.id ?? null

  return (
    <nav
      aria-label="Table of contents"
      className={cn(
        "w-[300px] overflow-hidden rounded-2xl border border-border/70 bg-card shadow-2xs",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <IconListNumbers className="h-4 w-4" />
          </span>
          <h2 className="text-sm font-bold tracking-tight text-foreground">
            Table of Contents
          </h2>
        </div>
        <span className="rounded-full bg-background px-2 py-0.5 text-[11px] font-semibold text-muted-foreground border border-border/60">
          {sections.length} {sections.length === 1 ? "section" : "sections"}
        </span>
      </div>

      <div className="max-h-[520px] overflow-y-auto overscroll-contain p-2.5 [scrollbar-width:thin] [scrollbar-color:var(--color-primary-30)_transparent] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border hover:[&::-webkit-scrollbar-thumb]:bg-primary/40">
        <ol className="space-y-1">
          {sections.map((section, index) => {
            const isSectionActive = activeId === section.entry.id
            const isChildActive = section.children.some((c) => c.id === activeId)
            const isCurrentSection = activeSectionId === section.entry.id
            const numberFormatted = String(index + 1).padStart(2, "0")
            const hasChildren = section.children.length > 0

            return (
              <li key={section.entry.id} className="space-y-0.5">
                <a
                  href={`#${section.entry.id}`}
                  onClick={(e) => handleNavigate(e, section.entry.id)}
                  className={cn(
                    "group flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs transition-colors",
                    isSectionActive
                      ? "bg-primary/10 font-bold text-primary"
                      : isChildActive
                        ? "bg-muted/70 font-semibold text-foreground"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold tabular-nums transition-colors",
                      isSectionActive
                        ? "bg-primary text-primary-foreground"
                        : isChildActive
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    )}
                  >
                    {numberFormatted}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{section.entry.text}</span>
                  {hasChildren ? (
                    <IconChevronRight
                      className={cn(
                        "h-3 w-3 shrink-0 text-muted-foreground/50 transition-transform duration-200",
                        isCurrentSection && "rotate-90 text-primary"
                      )}
                    />
                  ) : null}
                </a>

                {hasChildren && isCurrentSection ? (
                  <ol className="ml-3.5 space-y-0.5 border-l-2 border-primary/20 pl-2.5 my-1">
                    {section.children.map((child) => {
                      const isChildSelected = activeId === child.id
                      return (
                        <li key={child.id}>
                          <a
                            href={`#${child.id}`}
                            onClick={(e) => handleNavigate(e, child.id)}
                            className={cn(
                              "flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] leading-snug transition-colors",
                              isChildSelected
                                ? "bg-primary/10 font-bold text-primary"
                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                            )}
                          >
                            <span
                              className={cn(
                                "h-1 w-1 shrink-0 rounded-full transition-colors",
                                isChildSelected ? "bg-primary" : "bg-muted-foreground/40"
                              )}
                            />
                            <span className="truncate">{child.text}</span>
                          </a>
                        </li>
                      )
                    })}
                  </ol>
                ) : null}
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}
