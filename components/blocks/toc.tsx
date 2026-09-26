"use client"

import { useEffect, useMemo, useState } from "react"
import { IconChevronDown, IconListNumbers } from "@tabler/icons-react"

import type { TocEntry } from "@/lib/blocks"
import { cn } from "@/lib/utils"

interface TocProps {
  entries: TocEntry[]
  className?: string
}

const ACTIVE_MARKER_OFFSET = 100

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
  const entryIds = entries.map((entry) => entry.id).join("|")
  const { sections, orphans } = useMemo(() => buildSections(entries), [entries])

  useEffect(() => {
    const ids = entryIds ? entryIds.split("|") : []
    const headings = ids
      .map((id) => document.getElementById(id))
      .filter((heading): heading is HTMLElement => heading !== null)
    if (headings.length === 0) return

    let ticking = false
    function update() {
      ticking = false
      const hash = window.location.hash.replace(/^#/, "")
      if (hash && ids.includes(hash)) {
        setActiveId(hash)
        return
      }
      const marker = window.scrollY + ACTIVE_MARKER_OFFSET
      let current: string | null = null
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top + window.scrollY <= marker) {
          current = heading.id
        }
      }
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4
      ) {
        current = headings[headings.length - 1].id
      }
      setActiveId(current)
    }

    function onScroll() {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
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

  if (entries.length < 2) return null

  function goToSection(
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) {
    event.preventDefault()
    setActiveId(id)
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" })
    history.replaceState(null, "", `#${id}`)
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
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" })
      history.replaceState(null, "", `#${id}`)
    }
  }

  return (
    <nav
      aria-label="Table of contents"
      className={cn(
        "rounded-2xl border border-border/80 bg-card/70 p-4 sm:p-5 shadow-xs backdrop-blur-xs transition-colors dark:bg-card/40",
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
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
          {sections.length} Sections
        </span>
      </div>

      <ul className="space-y-1">
        {orphans.map((entry) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              onClick={(event) => goToSection(event, entry.id)}
              className={cn(
                "block rounded-lg px-2.5 py-1.5 text-xs transition-colors hover:bg-muted/60",
                activeId === entry.id
                  ? "font-semibold text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {entry.text}
            </a>
          </li>
        ))}
        {sections.map((section, index) => {
          const isOpen = openSectionId === section.entry.id
          const hasChildren = section.children.length > 0
          const isCurrentHeading = activeId === section.entry.id
          const numberFormatted = String(index + 1).padStart(2, "0")

          return (
            <li key={section.entry.id} className="group/item">
              {hasChildren ? (
                <div
                  className={cn(
                    "flex items-center justify-between gap-1.5 rounded-lg px-2 py-1.5 transition-colors",
                    isCurrentHeading
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/90 hover:bg-muted/60"
                  )}
                >
                  <a
                    href={`#${section.entry.id}`}
                    onClick={(event) => goToSection(event, section.entry.id)}
                    className="flex min-w-0 flex-1 items-center gap-2 text-left"
                  >
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold transition-colors",
                        isCurrentHeading
                          ? "bg-primary text-primary-foreground"
                          : "bg-primary/10 text-primary"
                      )}
                    >
                      {numberFormatted}
                    </span>
                    <span className="line-clamp-2 text-xs font-semibold leading-tight">
                      {section.entry.text}
                    </span>
                  </a>
                  <button
                    type="button"
                    onClick={(event) => toggleSection(event, section)}
                    className="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={`Toggle ${section.entry.text} subsections`}
                  >
                    <IconChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-200",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>
                </div>
              ) : (
                <a
                  href={`#${section.entry.id}`}
                  onClick={(event) => goToSection(event, section.entry.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors",
                    isCurrentHeading
                      ? "bg-primary/10 font-semibold text-primary"
                      : "text-foreground/90 hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold transition-colors",
                      isCurrentHeading
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary/10 text-primary"
                    )}
                  >
                    {numberFormatted}
                  </span>
                  <span className="line-clamp-2 font-semibold leading-tight">
                    {section.entry.text}
                  </span>
                </a>
              )}

              {isOpen && hasChildren ? (
                <ul className="mt-1 space-y-0.5 border-l border-border/70 ml-4.5 pl-2.5">
                  {section.children.map((child) => (
                    <li key={child.id}>
                      <a
                        href={`#${child.id}`}
                        onClick={(event) => goToSection(event, child.id)}
                        className={cn(
                          "block rounded py-1 px-1.5 text-[11px] leading-snug transition-colors hover:bg-muted/60",
                          activeId === child.id
                            ? "font-semibold text-primary bg-primary/10"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {child.text}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
