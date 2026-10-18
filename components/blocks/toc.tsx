"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { IconChevronDown, IconListNumbers } from "@tabler/icons-react"

import type { TocEntry } from "@/lib/blocks"
import { cn } from "@/lib/utils"

interface TocProps {
  entries: TocEntry[]
  className?: string
}

const ACTIVE_MARKER_OFFSET = 120

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
    } else if (current) {
      current.children.push(entry)
    } else {
      orphans.push(entry)
    }
  }
  return { sections, orphans }
}

export function Toc({ entries, className }: TocProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [openSectionId, setOpenSectionId] = useState<string | null>(null)
  const [prevActiveSectionId, setPrevActiveSectionId] = useState<string | null>(null)
  const isClickingRef = useRef(false)
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const activeItemRef = useRef<HTMLLIElement | null>(null)

  const entryIds = useMemo(() => entries.map((entry) => entry.id), [entries])
  const { sections, orphans } = useMemo(() => buildSections(entries), [entries])

  useEffect(() => {
    if (entryIds.length === 0) return

    const headings = entryIds
      .map((id) => document.getElementById(id))
      .filter((heading): heading is HTMLElement => heading !== null)
    if (headings.length === 0) return

    let rafId: number | null = null

    function update() {
      if (isClickingRef.current) return
      if (rafId !== null) return

      rafId = requestAnimationFrame(() => {
        rafId = null
        const hash = window.location.hash.replace(/^#/, "")
        const marker = window.scrollY + ACTIVE_MARKER_OFFSET
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

  const activeSectionId = useMemo(() => {
    if (!activeId) return null
    return (
      sections.find(
        (s) =>
          s.entry.id === activeId || s.children.some((c) => c.id === activeId)
      )?.entry.id ?? null
    )
  }, [activeId, sections])

  if (activeSectionId !== prevActiveSectionId) {
    setPrevActiveSectionId(activeSectionId)
    setOpenSectionId(activeSectionId)
  }

  useEffect(() => {
    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" })
    }
  }, [activeId])

  if (entries.length < 2) return null

  function goToSection(
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) {
    event.preventDefault()
    setActiveId(id)
    isClickingRef.current = true

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

  function toggleSection(
    event: React.MouseEvent<HTMLButtonElement>,
    section: TocSection
  ) {
    event.preventDefault()
    const id = section.entry.id
    if (openSectionId === id) {
      setOpenSectionId(null)
    } else {
      setOpenSectionId(id)
      setActiveId(id)
      isClickingRef.current = true

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
  }

  return (
    <nav
      aria-label="Table of contents"
      className={cn(
        "rounded-2xl border border-border/80 bg-card/75 p-3.5 sm:p-4 shadow-xs backdrop-blur-xs transition-colors dark:bg-card/50",
        className
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2 border-b border-border/60 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/25">
            <IconListNumbers className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">
            On this page
          </span>
        </div>
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
          {sections.length || entries.length} Sections
        </span>
      </div>

      <ul className="space-y-1">
        {orphans.map((entry) => {
          const isCurrent = activeId === entry.id
          return (
            <li
              key={entry.id}
              ref={isCurrent ? activeItemRef : undefined}
            >
              <a
                href={`#${entry.id}`}
                onClick={(event) => goToSection(event, entry.id)}
                className={cn(
                  "block rounded-lg px-2.5 py-1.5 text-[13px] leading-snug transition-colors hover:bg-muted/60",
                  isCurrent
                    ? "font-semibold text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {entry.text}
              </a>
            </li>
          )
        })}

        {sections.map((section, index) => {
          const isOpen = openSectionId === section.entry.id
          const hasChildren = section.children.length > 0
          const isCurrentHeading = activeId === section.entry.id
          const numberFormatted = String(index + 1).padStart(2, "0")

          return (
            <li
              key={section.entry.id}
              ref={isCurrentHeading ? activeItemRef : undefined}
              className="group/item rounded-lg"
            >
              {hasChildren ? (
                <div
                  className={cn(
                    "flex items-center justify-between gap-1.5 rounded-lg px-2 py-1.5 transition-colors",
                    isCurrentHeading
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/85 hover:bg-muted/60"
                  )}
                >
                  <a
                    href={`#${section.entry.id}`}
                    onClick={(event) => goToSection(event, section.entry.id)}
                    className="flex min-w-0 flex-1 items-start gap-2 text-left"
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-xs font-bold transition-colors",
                        isCurrentHeading
                          ? "bg-primary text-primary-foreground"
                          : "bg-primary/10 text-primary"
                      )}
                    >
                      {numberFormatted}
                    </span>
                    <span
                      className={cn(
                        "min-w-0 flex-1 text-[13px] leading-snug",
                        isCurrentHeading ? "font-semibold text-primary" : "font-medium"
                      )}
                    >
                      {section.entry.text}
                    </span>
                  </a>
                  <button
                    type="button"
                    onClick={(event) => toggleSection(event, section)}
                    className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    aria-label={`Toggle ${section.entry.text} subsections`}
                  >
                    <IconChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-200",
                        isOpen && "rotate-180 text-primary"
                      )}
                    />
                  </button>
                </div>
              ) : (
                <a
                  href={`#${section.entry.id}`}
                  onClick={(event) => goToSection(event, section.entry.id)}
                  className={cn(
                    "flex items-start gap-2 rounded-lg px-2 py-1.5 text-[13px] leading-snug transition-colors",
                    isCurrentHeading
                      ? "bg-primary/10 font-semibold text-primary"
                      : "text-foreground/85 hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-xs font-bold transition-colors",
                      isCurrentHeading
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary/10 text-primary"
                    )}
                  >
                    {numberFormatted}
                  </span>
                  <span
                    className={cn(
                      "min-w-0 flex-1",
                      isCurrentHeading ? "font-semibold text-primary" : "font-medium"
                    )}
                  >
                    {section.entry.text}
                  </span>
                </a>
              )}

              {isOpen && hasChildren ? (
                <ul className="mt-1 space-y-0.5 border-l border-primary/25 ml-4.5 pl-2.5">
                  {section.children.map((child) => {
                    const isChildCurrent = activeId === child.id
                    return (
                      <li key={child.id} ref={isChildCurrent ? activeItemRef : undefined}>
                        <a
                          href={`#${child.id}`}
                          onClick={(event) => goToSection(event, child.id)}
                          className={cn(
                            "block rounded py-1 px-1.5 text-xs leading-snug transition-colors hover:bg-muted/60",
                            isChildCurrent
                              ? "font-semibold text-primary bg-primary/10"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {child.text}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              ) : null}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
