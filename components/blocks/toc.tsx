"use client"

import { useEffect, useState } from "react"
import { IconChevronDown, IconList } from "@tabler/icons-react"

import type { TocEntry } from "@/lib/blocks"
import { cn } from "@/lib/utils"

interface TocProps {
  entries: TocEntry[]
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

export function Toc({ entries }: TocProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const entryIds = entries.map((entry) => entry.id).join("|")

  useEffect(() => {
    const ids = entryIds ? entryIds.split("|") : []
    const headings = ids
      .map((id) => document.getElementById(id))
      .filter((heading): heading is HTMLElement => heading !== null)
    if (headings.length === 0) return

    let ticking = false
    function update() {
      ticking = false
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

  if (entries.length < 2) return null

  const { sections, orphans } = buildSections(entries)

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
    const wasExpanded = expanded.has(id)
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
    if (!wasExpanded) {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" })
      history.replaceState(null, "", `#${id}`)
    }
  }

  const isActiveChild = (section: TocSection) =>
    activeId !== null &&
    (section.entry.id === activeId ||
      section.children.some((child) => child.id === activeId))

  return (
    <nav
      aria-label="Table of contents"
      className="rounded-xl border border-border/80 bg-card text-sm shadow-2xs"
    >
      <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
        <IconList className="h-4 w-4 text-primary" />
        <p className="text-sm font-semibold text-foreground">On this page</p>
      </div>
      <ul className="space-y-0.5 p-3">
        {orphans.map((entry) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              onClick={(event) => goToSection(event, entry.id)}
              className={cn(
                "block rounded-md px-2.5 py-1.5 text-sm transition-colors hover:bg-muted/60",
                activeId === entry.id
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {entry.text}
            </a>
          </li>
        ))}
        {sections.map((section) => {
          const open = expanded.has(section.entry.id) || isActiveChild(section)
          const hasChildren = section.children.length > 0
          return (
            <li key={section.entry.id}>
              {hasChildren ? (
                <button
                  type="button"
                  onClick={(event) => toggleSection(event, section)}
                  className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-left text-sm font-semibold text-foreground/90 transition-colors hover:bg-muted/60 hover:text-foreground"
                >
                  <span className="line-clamp-2">{section.entry.text}</span>
                  <IconChevronDown
                    className={cn(
                      "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
                      open && "rotate-180"
                    )}
                  />
                </button>
              ) : (
                <a
                  href={`#${section.entry.id}`}
                  onClick={(event) => goToSection(event, section.entry.id)}
                  className={cn(
                    "block rounded-md px-2.5 py-1.5 text-sm font-semibold transition-colors hover:bg-muted/60",
                    activeId === section.entry.id
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/90"
                  )}
                >
                  {section.entry.text}
                </a>
              )}

              {open && hasChildren ? (
                <ul className="space-y-0.5">
                  {section.children.map((child) => (
                    <li key={child.id}>
                      <a
                        href={`#${child.id}`}
                        onClick={(event) => goToSection(event, child.id)}
                        className={cn(
                          "block rounded-md py-1.5 pr-2.5 text-sm transition-colors hover:bg-muted/60",
                          child.level === 3 && "pl-6",
                          child.level === 4 && "pl-9",
                          activeId === child.id
                            ? "bg-primary/10 font-medium text-primary"
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
