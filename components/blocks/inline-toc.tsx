"use client"

import { useEffect, useMemo, useState } from "react"
import { IconChevronDown, IconListNumbers } from "@tabler/icons-react"

import type { TocEntry } from "@/lib/blocks"
import { cn } from "@/lib/utils"

interface InlineTocProps {
  entries: TocEntry[]
  className?: string
  defaultCollapsed?: boolean
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

export function InlineToc({
  entries,
  className,
  defaultCollapsed = true,
}: InlineTocProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [openSectionId, setOpenSectionId] = useState<string | null>(null)
  const [prevActiveSectionId, setPrevActiveSectionId] = useState<string | null>(null)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(defaultCollapsed)

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
        "my-8 rounded-2xl border border-border/80 bg-card/60 p-4 sm:p-6 shadow-xs backdrop-blur-xs transition-colors dark:bg-card/40",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/25">
            <IconListNumbers className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
              Table of Contents
            </h2>
          </div>
          <span className="hidden sm:inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            {sections.length} Sections
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border/60 bg-background/80 px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-2xs transition-all hover:bg-muted hover:text-foreground active:scale-95"
          aria-expanded={!isCollapsed}
        >
          <span>{isCollapsed ? "Show Outline" : "Hide"}</span>
          <IconChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-200",
              !isCollapsed && "rotate-180"
            )}
          />
        </button>
      </div>

      {!isCollapsed ? (
        <div className="mt-4 border-t border-border/70 pt-4">
          {orphans.length > 0 ? (
            <ul className="mb-2 space-y-1">
              {orphans.map((entry) => (
                <li key={entry.id}>
                  <a
                    href={`#${entry.id}`}
                    onClick={(event) => goToSection(event, entry.id)}
                    className={cn(
                      "block rounded-lg py-1.5 px-3 text-sm transition-colors hover:bg-muted/60 hover:text-foreground",
                      activeId === entry.id
                        ? "font-medium text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    {entry.text}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}

          <ol className="space-y-1.5">
            {sections.map((section, index) => {
              const isOpen = openSectionId === section.entry.id
              const hasChildren = section.children.length > 0
              const isCurrentHeading = activeId === section.entry.id
              const numberFormatted = String(index + 1).padStart(2, "0")

              return (
                <li key={section.entry.id} className="group/item">
                  {hasChildren ? (
                    <div className="flex items-center justify-between gap-2 rounded-xl p-2 transition-colors hover:bg-primary/[0.04] dark:hover:bg-primary/[0.08]">
                      <button
                        type="button"
                        onClick={(event) => toggleSection(event, section)}
                        className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left"
                      >
                        <span
                          className={cn(
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors",
                            isCurrentHeading
                              ? "bg-primary text-primary-foreground"
                              : "bg-primary/10 text-primary group-hover/item:bg-primary group-hover/item:text-primary-foreground"
                          )}
                        >
                          {numberFormatted}
                        </span>
                        <span
                          className={cn(
                            "min-w-0 flex-1 text-sm sm:text-[0.9375rem] font-semibold transition-colors",
                            isCurrentHeading
                              ? "text-primary"
                              : "text-foreground/90 group-hover/item:text-foreground"
                          )}
                        >
                          {section.entry.text}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={(event) => toggleSection(event, section)}
                        className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
                        aria-label={isOpen ? "Collapse subsection" : "Expand subsection"}
                      >
                        <IconChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform duration-200",
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
                        "flex cursor-pointer items-center gap-3 rounded-xl p-2 text-sm sm:text-[0.9375rem] font-semibold transition-colors hover:bg-primary/[0.04] dark:hover:bg-primary/[0.08]",
                        isCurrentHeading
                          ? "text-primary"
                          : "text-foreground/90 hover:text-foreground"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors",
                          isCurrentHeading
                            ? "bg-primary text-primary-foreground"
                            : "bg-primary/10 text-primary group-hover/item:bg-primary group-hover/item:text-primary-foreground"
                        )}
                      >
                        {numberFormatted}
                      </span>
                      <span className="min-w-0 flex-1">{section.entry.text}</span>
                    </a>
                  )}

                  {isOpen && hasChildren ? (
                    <ol className="mt-1.5 mb-2 ml-4 space-y-1 border-l-2 border-primary/25 pl-4 sm:ml-5 sm:pl-5">
                      {section.children.map((child) => {
                        const isChildActive = activeId === child.id
                        return (
                          <li key={child.id}>
                            <a
                              href={`#${child.id}`}
                              onClick={(event) => goToSection(event, child.id)}
                              className={cn(
                                "group/sub block rounded-lg py-1.5 px-2 text-sm transition-colors hover:bg-muted/60 hover:text-foreground",
                                isChildActive
                                  ? "font-semibold text-primary"
                                  : "text-muted-foreground"
                              )}
                            >
                              <span className="flex items-center gap-2">
                                <span
                                  className={cn(
                                    "h-1.5 w-1.5 rounded-full transition-colors",
                                    isChildActive
                                      ? "bg-primary"
                                      : "bg-muted-foreground/40 group-hover/sub:bg-primary/70"
                                  )}
                                />
                                <span>{child.text}</span>
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
