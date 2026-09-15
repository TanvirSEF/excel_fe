"use client"

import { useEffect, useState } from "react"

import type { TocEntry } from "@/lib/blocks"
import { cn } from "@/lib/utils"

interface TocProps {
  entries: TocEntry[]
}

const ACTIVE_MARKER_OFFSET = 100

export function Toc({ entries }: TocProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
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

  function goToSection(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault()
    setActiveId(id)
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" })
    history.replaceState(null, "", `#${id}`)
  }

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        On this page
      </p>
      <ul className="space-y-0.5 border-l">
        {entries.map((entry) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              onClick={(event) => goToSection(event, entry.id)}
              className={cn(
                "-ml-px block border-l py-1.5 transition-colors",
                entry.level === 2 && "pl-4 font-semibold text-foreground/90",
                entry.level === 3 && "pl-7 text-muted-foreground",
                entry.level === 4 && "pl-10 text-muted-foreground",
                activeId === entry.id
                  ? "border-primary text-primary"
                  : "border-transparent hover:text-foreground"
              )}
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
