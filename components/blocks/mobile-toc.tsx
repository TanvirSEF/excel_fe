"use client"

import { useRef } from "react"
import { IconChevronDown, IconListNumbers } from "@tabler/icons-react"

import type { TocEntry } from "@/lib/blocks"

interface MobileTocProps {
  entries: TocEntry[]
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
    } else if (current && entry.level === 3) {
      current.children.push(entry)
    }
  }
  return sections
}

export function MobileToc({ entries }: MobileTocProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const sections = buildSections(entries)

  if (sections.length < 2) return null

  function goToSection(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault()
    if (detailsRef.current) detailsRef.current.open = false
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document
          .getElementById(id)
          ?.scrollIntoView({ behavior: "smooth", block: "start" })
      })
    })
    history.replaceState(null, "", `#${id}`)
  }

  return (
    <details
      ref={detailsRef}
      className="group mb-8 rounded-2xl border border-border/80 bg-card/70 shadow-xs backdrop-blur-xs transition-colors xl:hidden dark:bg-card/40"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3.5 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/25">
            <IconListNumbers className="h-4 w-4" />
          </div>
          <span className="font-bold text-foreground">On this page</span>
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
            {sections.length} Sections
          </span>
        </div>
        <IconChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <nav
        aria-label="Table of contents"
        className="border-t border-border/60 p-3"
      >
        <ol className="space-y-1">
          {sections.map((section, index) => (
            <li key={section.entry.id}>
              <details
                name="mobile-toc-section"
                className="group/section rounded-lg transition-colors hover:bg-muted/60"
              >
                <summary className="flex cursor-pointer list-none items-center gap-3 px-2.5 py-2.5 text-sm font-medium text-foreground/85 [&::-webkit-details-marker]:hidden">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-[11px] font-bold text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">{section.entry.text}</span>
                  {section.children.length > 0 ? (
                    <IconChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open/section:rotate-180" />
                  ) : null}
                </summary>
                {section.children.length > 0 ? (
                  <ol className="space-y-0.5 pb-2 pl-[2.65rem] pr-2.5">
                    {section.children.map((child) => (
                      <li key={child.id}>
                        <a
                          href={`#${child.id}`}
                          onClick={(event) => goToSection(event, child.id)}
                          className="block rounded-md py-1.5 pl-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {child.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                ) : null}
              </details>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  )
}
