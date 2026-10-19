import Link from "next/link"

import { cn } from "@/lib/utils"

interface BreadcrumbProps {
  items: { label: string; href?: string }[]
  className?: string
  separator?: string
}

export function Breadcrumb({
  items,
  className,
  separator = ">",
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
              <span className="text-muted-foreground/50 select-none text-xs" aria-hidden>
                {separator}
              </span>
            ) : null}
          </span>
        )
      })}
    </nav>
  )
}
