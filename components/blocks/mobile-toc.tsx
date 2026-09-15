"use client"

import { useRef } from "react"
import { IconChevronDown, IconList } from "@tabler/icons-react"

import type { TocEntry } from "@/lib/blocks"

export function MobileToc({ entries }: { entries: TocEntry[] }) {
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const sections = entries.filter((entry) => entry.level === 2)

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
      className="group mb-8 rounded-xl border border-border/80 bg-card shadow-2xs xl:hidden"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2">
          <IconList className="h-4 w-4 text-primary" />
          On this page
        </span>
        <IconChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <nav
        aria-label="Table of contents"
        className="border-t border-border/60 p-3"
      >
        <ol className="space-y-1">
          {sections.map((section, index) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                onClick={(event) => goToSection(event, section.id)}
                className="flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm font-medium text-foreground/85 transition-colors hover:bg-muted/60 hover:text-foreground"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-[11px] font-bold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {section.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  )
}
