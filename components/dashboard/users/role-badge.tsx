import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { UserRole } from "@/types/api"

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super admin",
  senior_editor: "Senior editor",
  technical_writer: "Technical writer",
  seo_specialist: "SEO specialist",
}

const ROLE_STYLES: Record<UserRole, string> = {
  super_admin: "bg-purple-500/15 text-purple-700 dark:text-purple-400",
  senior_editor: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  technical_writer: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  seo_specialist: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
}

export function RoleBadge({
  role,
  className,
}: {
  role: UserRole
  className?: string
}) {
  return (
    <Badge
      variant="secondary"
      className={cn(ROLE_STYLES[role], "font-normal", className)}
    >
      {ROLE_LABELS[role]}
    </Badge>
  )
}

export { ROLE_LABELS }
