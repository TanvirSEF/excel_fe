import type { TocEntry } from "@/lib/blocks"
import { cn } from "@/lib/utils"

interface TocProps {
  entries: TocEntry[]
}

export function Toc({ entries }: TocProps) {
  if (entries.length < 2) return null

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
              className={cn(
                "-ml-px block border-l border-transparent py-1.5 text-muted-foreground transition-colors hover:border-primary hover:text-foreground",
                entry.level === 2 && "pl-4",
                entry.level === 3 && "pl-7",
                entry.level === 4 && "pl-10"
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
