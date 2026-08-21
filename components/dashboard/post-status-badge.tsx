import { format, isValid } from "date-fns"

import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { PostStatus } from "@/types/api"

const STATUS_LABELS: Record<PostStatus, string> = {
  draft: "Draft",
  pending_review: "In review",
  published: "Published",
  rejected: "Rejected",
  scheduled: "Scheduled",
}

const STATUS_STYLES: Record<PostStatus, string> = {
  draft: "bg-secondary text-secondary-foreground",
  pending_review: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  published: "bg-primary/10 text-primary",
  rejected: "bg-destructive/10 text-destructive",
  scheduled: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
}

interface PostStatusBadgeProps {
  status: PostStatus
  rejectionReason?: string | null
  scheduledAt?: string | null
}

export function PostStatusBadge({
  status,
  rejectionReason,
  scheduledAt,
}: PostStatusBadgeProps) {
  const tooltip =
    status === "rejected" && rejectionReason
      ? rejectionReason
      : status === "scheduled" && scheduledAt && isValid(new Date(scheduledAt))
        ? `Goes live ${format(new Date(scheduledAt), "dd MMM yyyy, HH:mm")}`
        : null

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span tabIndex={0} className="cursor-help">
            <Badge variant="secondary" className={STATUS_STYLES[status]}>
              {STATUS_LABELS[status]}
            </Badge>
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-64">
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Badge
      variant="secondary"
      className={`${STATUS_STYLES[status]} pointer-events-none`}
    >
      {STATUS_LABELS[status]}
    </Badge>
  )
}
