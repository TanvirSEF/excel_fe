import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface ErrorStateProps {
  title?: string
  message?: string
  action?: ReactNode
  className?: string
}

export function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-16 text-center",
        className
      )}
    >
      <p className="font-medium">{title}</p>
      {message ? (
        <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}
