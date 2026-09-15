"use client"

import { useEffect, useState } from "react"
import { IconChevronDown } from "@tabler/icons-react"

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
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
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
    const isCollapsed = collapsed.has(id)
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
    if (isCollapsed) {
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
    <nav aria-label="Table of contents" className="text-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        On this page
      </p>
      <ul className="space-y-0.5 border-l">
        {orphans.map((entry) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              onClick={(event) => goToSection(event, entry.id)}
              className={cn(
                "-ml-px block border-l py-1.5 pl-4 text-muted-foreground transition-colors hover:text-foreground",
                activeId === entry.id
                  ? "border-primary text-primary"
                  : "border-transparent"
              )}
            >
              {entry.text}
            </a>
          </li>
        ))}
        {sections.map((section) => {
          const open = !collapsed.has(section.entry.id) || isActiveChild(section)
          const hasChildren = section.children.length > 0
          return (
            <li key={section.entry.id}>
              {hasChildren ? (
                <button
                  type="button"
                  onClick={(event) => toggleSection(event, section)}
                  className="-ml-px flex w-full cursor-pointer items-center justify-between gap-2 border-l py-1.5 pl-4 text-left font-semibold text-foreground/90 transition-colors hover:text-foreground"
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
                    "-ml-px block border-l py-1.5 pl-4 font-semibold text-foreground/90 transition-colors hover:text-foreground",
                    activeId === section.entry.id
                      ? "border-primary text-primary"
                      : "border-transparent"
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
                          "-ml-px block border-l py-1.5 transition-colors",
                          child.level === 3 && "pl-7",
                          child.level === 4 && "pl-10",
                          activeId === child.id
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
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
