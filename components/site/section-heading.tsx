import Link from "next/link"
import { IconArrowRight } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  title: string
  subtitle?: string
  badge?: string
  action?: {
    label: string
    href: string
  }
  className?: string
}

export function SectionHeading({
  title,
  subtitle,
  badge,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end",
        className
      )}
    >
      <div className="max-w-2xl space-y-2">
        {badge ? (
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-semibold text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span>{badge}</span>
          </div>
        ) : null}
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            {subtitle}
          </p>
        ) : null}
      </div>

      {action ? (
        <Link
          href={action.href}
          className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-border/90 bg-card px-4 py-2 text-xs font-semibold text-foreground shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/5 hover:text-primary hover:shadow-xs sm:text-sm"
        >
          <span>{action.label}</span>
          <IconArrowRight className="h-4 w-4 text-primary transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      ) : null}
    </div>
  )
}
