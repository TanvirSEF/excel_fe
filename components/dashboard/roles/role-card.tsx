"use client"

import Link from "next/link"
import { IconEdit, IconLock, IconShieldCheck, IconUsers } from "@tabler/icons-react"

import { RoleBadge } from "@/components/dashboard/users/role-badge"
import { Button } from "@/components/ui/button"
import type { RoleDetail } from "@/types/api"

interface RoleCardProps {
  role: RoleDetail
  onEdit: (role: RoleDetail) => void
}

export function RoleCard({ role, onEdit }: RoleCardProps) {
  const isSuperAdmin = role.role === "super_admin"

  return (
    <div className="flex flex-col justify-between rounded-xl border bg-card p-5 shadow-2xs transition-all hover:border-primary/40 hover:shadow-xs">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground text-base">
                {role.name}
              </h3>
              <RoleBadge role={role.role} />
            </div>
            <p className="text-xs font-mono text-muted-foreground">
              {role.role}
            </p>
          </div>
          {isSuperAdmin ? (
            <span className="flex items-center gap-1 rounded-full bg-purple-500/10 px-2.5 py-1 text-[11px] font-medium text-purple-700 dark:text-purple-400">
              <IconLock className="h-3 w-3" />
              Root Access
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
              <IconShieldCheck className="h-3 w-3" />
              Configurable
            </span>
          )}
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          {role.description}
        </p>

        <div className="rounded-lg bg-muted/40 p-3 text-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <IconUsers className="h-3.5 w-3.5" />
              Active team members:
            </span>
            <Link
              href={`/dashboard/users`}
              className="font-semibold text-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
            >
              {role.member_count} member{role.member_count === 1 ? "" : "s"}
            </Link>
          </div>

          <div className="border-t border-border/50 pt-2 flex items-center justify-between text-muted-foreground">
            <span>Granted capabilities:</span>
            <span className="font-medium text-foreground">
              {isSuperAdmin ? "All capabilities (*)" : `${role.permissions.length} granted`}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t flex items-center justify-between gap-2">
        <span className="text-[11px] text-muted-foreground">
          {isSuperAdmin
            ? "Permanent system guardian"
            : "Customizable capabilities"}
        </span>
        <Button
          type="button"
          size="sm"
          variant={isSuperAdmin ? "outline" : "default"}
          className="gap-1.5 text-xs h-8"
          onClick={() => onEdit(role)}
        >
          {isSuperAdmin ? (
            <>
              <IconLock className="h-3.5 w-3.5" />
              View capabilities
            </>
          ) : (
            <>
              <IconEdit className="h-3.5 w-3.5" />
              Edit permissions
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
