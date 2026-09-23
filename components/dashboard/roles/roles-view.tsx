"use client"

import { useState } from "react"
import { IconShieldLock } from "@tabler/icons-react"

import { EditRoleSheet } from "@/components/dashboard/roles/edit-role-sheet"
import { PermissionMatrix } from "@/components/dashboard/roles/permission-matrix"
import { RoleCard } from "@/components/dashboard/roles/role-card"
import { UsersNav } from "@/components/dashboard/users/users-nav"
import { ErrorState } from "@/components/shared/error-state"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DEFAULT_PERMISSION_GROUPS,
  DEFAULT_ROLES,
  usePermissionGroups,
  useRoles,
} from "@/lib/queries/roles"
import type { RoleDetail } from "@/types/api"

export function RolesView() {
  const [editingRole, setEditingRole] = useState<RoleDetail | null>(null)

  const { data: roles, isPending: rolesPending, isError: rolesError, refetch } =
    useRoles()
  const { data: groups, isPending: groupsPending } = usePermissionGroups()

  const roleList = roles ?? DEFAULT_ROLES
  const groupList = groups ?? DEFAULT_PERMISSION_GROUPS
  const isPending = rolesPending || groupsPending

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure system access tiers, role capabilities, and team member permissions.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground">
          <IconShieldLock className="h-4 w-4 text-primary" />
          <span>Super Admin Access Control</span>
        </div>
      </div>

      <UsersNav />

      {rolesError ? (
        <ErrorState
          title="Could not load role definitions"
          message="The roles service encountered a problem. Try again."
          action={
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          }
        />
      ) : isPending ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={idx} className="h-56 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-96 rounded-xl" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Roles Cards Grid */}
          <div className="space-y-3">
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Configured System Roles
              </h2>
              <p className="text-xs text-muted-foreground">
                Click &ldquo;Edit permissions&rdquo; on any non-root role to grant or revoke specific operational privileges.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {roleList.map((role) => (
                <RoleCard
                  key={role.role}
                  role={role}
                  onEdit={setEditingRole}
                />
              ))}
            </div>
          </div>

          {/* Full Permission Comparison Matrix */}
          <div className="space-y-3">
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Domain Permissions Matrix
              </h2>
              <p className="text-xs text-muted-foreground">
                Granular view of all 18 system capabilities categorized across content, media, SEO, taxonomy, and administration.
              </p>
            </div>
            <PermissionMatrix
              roles={roleList}
              groups={groupList}
              onEditRole={setEditingRole}
            />
          </div>
        </div>
      )}

      <EditRoleSheet
        role={editingRole}
        groups={groupList}
        onOpenChange={(open) => !open && setEditingRole(null)}
      />
    </div>
  )
}
