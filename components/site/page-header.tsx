import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: ReactNode
  description?: ReactNode
  meta?: ReactNode
  bordered?: boolean
  className?: string
}

export function PageHeader({
  title,
  description,
  meta,
  bordered,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn("mb-8", bordered && "border-b pb-8", className)}>
      <h1 className="flex flex-wrap items-center gap-3 text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-3 max-w-2xl text-balance text-sm text-muted-foreground sm:text-base">
          {description}
        </p>
      ) : null}
      {meta ? (
        <p className="mt-3 text-sm text-muted-foreground">{meta}</p>
      ) : null}
    </header>
  )
}
