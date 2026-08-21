import { format, formatDistanceToNowStrict, isValid } from "date-fns"

import { cn } from "@/lib/utils"

interface TimeProps {
  date: string | null | undefined
  variant?: "relative" | "date" | "full"
  className?: string
}

export function Time({ date, variant = "date", className }: TimeProps) {
  if (!date) return null

  const parsed = new Date(date)
  if (!isValid(parsed)) return null

  const absolute = format(parsed, "PPP p")
  const label =
    variant === "relative"
      ? `${formatDistanceToNowStrict(parsed)} ago`
      : variant === "full"
        ? format(parsed, "MMM d, yyyy 'at' p")
        : format(parsed, "MMM d, yyyy")

  return (
    <time dateTime={parsed.toISOString()} title={absolute} className={cn(className)}>
      {label}
    </time>
  )
}
