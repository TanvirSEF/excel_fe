import type { ReactNode } from "react"
import Link from "next/link"
import { IconChevronRight } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

interface BreadcrumbProps {
  items: { label: string; href?: string }[]
  className?: string
  separator?: ReactNode
}

export function Breadcrumb({
  items,
  className,
  separator = (
    <IconChevronRight
      className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0"
      aria-hidden
    />
  ),
}: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground",
        className
      )}
    >
      {items.map((item, index) => {
        const last = index === items.length - 1
        return (
          <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            {item.href ? (
              <Link
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground",
                  last && "line-clamp-1 font-medium text-foreground/80"
                )}
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={
                  last ? "line-clamp-1 font-medium text-foreground/80" : undefined
                }
              >
                {item.label}
              </span>
            )}
            {!last ? (
              <span className="inline-flex items-center text-muted-foreground/50 select-none" aria-hidden>
                {separator}
              </span>
            ) : null}
          </span>
        )
      })}
    </nav>
  )
}
