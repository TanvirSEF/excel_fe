import Link from "next/link"
import { IconArrowRight, IconFlame } from "@tabler/icons-react"

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
        "mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end",
        className
      )}
    >
      <div className="space-y-1.5">
        {badge ? (
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-2.5 py-0.5 text-xs font-semibold text-primary">
            <IconFlame className="h-3.5 w-3.5 shrink-0" />
            <span>{badge}</span>
          </div>
        ) : null}
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="text-sm text-muted-foreground sm:text-base">
            {subtitle}
          </p>
        ) : null}
      </div>

      {action ? (
        <Link
          href={action.href}
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
        >
          <span>{action.label}</span>
          <IconArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      ) : null}
    </div>
  )
}
