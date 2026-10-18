"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { IconChevronDown, IconListNumbers } from "@tabler/icons-react"

import type { TocEntry } from "@/lib/blocks"
import { cn } from "@/lib/utils"

interface MobileTocProps {
  entries: TocEntry[]
  className?: string
  defaultOpen?: boolean
}

interface TocSection {
  entry: TocEntry
  children: TocEntry[]
}

function buildSections(entries: TocEntry[]): {
  sections: TocSection[]
  orphans: TocEntry[]
} {
  const sections: TocSection[] = []
  const orphans: TocEntry[] = []
  let current: TocSection | null = null
  for (const entry of entries) {
    if (entry.level === 2) {
      current = { entry, children: [] }
      sections.push(current)
    } else if (current && entry.level === 3) {
      current.children.push(entry)
    } else {
      orphans.push(entry)
    }
  }
  return { sections, orphans }
}

export function MobileToc({
  entries,
  className,
  defaultOpen = false,
}: MobileTocProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const isClickingRef = useRef(false)
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const { sections, orphans } = useMemo(() => buildSections(entries), [entries])
  const entryIds = useMemo(() => entries.map((e) => e.id), [entries])

  useEffect(() => {
    if (entryIds.length === 0) return

    const headings = entryIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (headings.length === 0) return

    let rafId: number | null = null

    function update() {
      if (isClickingRef.current) return
      if (rafId !== null) return

      rafId = requestAnimationFrame(() => {
        rafId = null
        const hash = window.location.hash.replace(/^#/, "")
        const marker = window.scrollY + 120
        let current = headings[0].id

        if (window.scrollY < 50 && hash && entryIds.includes(hash)) {
          current = hash
        } else {
          for (let i = 0; i < headings.length; i++) {
            const top = headings[i].getBoundingClientRect().top + window.scrollY
            if (top <= marker) {
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
        }

        setActiveId(current)
      })
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update, { passive: true })

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current)
    }
  }, [entryIds])

  if (entries.length < 2) return null

  function goToSection(
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) {
    event.preventDefault()
    setActiveId(id)
    isClickingRef.current = true

    // Close the drawer on mobile so the user can immediately view the target content
    setIsOpen(false)

    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
      history.replaceState(null, "", `#${id}`)
    }

    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current)
    clickTimeoutRef.current = setTimeout(() => {
      isClickingRef.current = false
    }, 600)
  }

  function toggleSubsection(id: string, e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <nav
      aria-label="Table of contents"
      className={cn(
        "mb-8 rounded-2xl border border-border/80 bg-card/75 shadow-xs backdrop-blur-xs transition-colors dark:bg-card/50",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 p-4 sm:px-5 sm:py-4 text-left transition-colors hover:bg-muted/40 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-expanded={isOpen}
      >
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/25">
            <IconListNumbers className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold text-foreground">
                Table of Contents
              </span>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                {sections.length || entries.length}
              </span>
            </div>
            {activeId ? (
              <p className="truncate text-xs text-muted-foreground mt-0.5">
                Current: {entries.find((e) => e.id === activeId)?.text ?? ""}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <span className="hidden xs:inline">{isOpen ? "Hide" : "Show Outline"}</span>
          <IconChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200 text-muted-foreground",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </button>

      {isOpen ? (
        <div className="border-t border-border/60 p-3 sm:p-4">
          <ol className="space-y-1">
            {orphans.map((entry) => (
              <li key={entry.id}>
                <a
                  href={`#${entry.id}`}
                  onClick={(e) => goToSection(e, entry.id)}
                  className={cn(
                    "block rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/70",
                    activeId === entry.id
                      ? "bg-primary/10 font-semibold text-primary"
                      : "text-foreground/85"
                  )}
                >
                  {entry.text}
                </a>
              </li>
            ))}

            {sections.map((section, index) => {
              const hasChildren = section.children.length > 0
              const isSubOpen = Boolean(expandedSections[section.entry.id])
              const isCurrent = activeId === section.entry.id
              const numberFormatted = String(index + 1).padStart(2, "0")

              return (
                <li key={section.entry.id} className="rounded-xl overflow-hidden">
                  <div
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-xl transition-colors",
                      isCurrent
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted/60 text-foreground/90"
                    )}
                  >
                    <a
                      href={`#${section.entry.id}`}
                      onClick={(e) => goToSection(e, section.entry.id)}
                      className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5 text-left"
                    >
                      <span
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors",
                          isCurrent
                            ? "bg-primary text-primary-foreground"
                            : "bg-primary/10 text-primary"
                        )}
                      >
                        {numberFormatted}
                      </span>
                      <span
                        className={cn(
                          "min-w-0 flex-1 text-sm sm:text-[15px] leading-snug",
                          isCurrent ? "font-semibold text-primary" : "font-medium"
                        )}
                      >
                        {section.entry.text}
                      </span>
                    </a>

                    {hasChildren ? (
                      <button
                        type="button"
                        onClick={(e) => toggleSubsection(section.entry.id, e)}
                        className="mr-2 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        aria-label={`Toggle ${section.entry.text} subsections`}
                      >
                        <IconChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            isSubOpen && "rotate-180 text-primary"
                          )}
                        />
                      </button>
                    ) : null}
                  </div>

                  {hasChildren && isSubOpen ? (
                    <ol className="mt-1 mb-1.5 ml-4 space-y-0.5 border-l-2 border-primary/25 pl-4 sm:ml-5 sm:pl-5">
                      {section.children.map((child) => {
                        const isChildActive = activeId === child.id
                        return (
                          <li key={child.id}>
                            <a
                              href={`#${child.id}`}
                              onClick={(e) => goToSection(e, child.id)}
                              className={cn(
                                "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm transition-colors hover:bg-muted/60",
                                isChildActive
                                  ? "font-semibold text-primary bg-primary/10"
                                  : "text-muted-foreground hover:text-foreground"
                              )}
                            >
                              <span
                                className={cn(
                                  "h-1.5 w-1.5 shrink-0 rounded-full",
                                  isChildActive ? "bg-primary" : "bg-muted-foreground/40"
                                )}
                              />
                              <span className="min-w-0 flex-1 leading-snug">
                                {child.text}
                              </span>
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
      ) : null}
    </nav>
  )
}
