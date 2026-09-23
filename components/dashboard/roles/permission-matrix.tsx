"use client"

import { IconCheck, IconLock, IconMinus } from "@tabler/icons-react"

import { RoleBadge } from "@/components/dashboard/users/role-badge"
import type { PermissionGroup, RoleDetail, UserRole } from "@/types/api"

interface PermissionMatrixProps {
  roles: RoleDetail[]
  groups: PermissionGroup[]
  onEditRole: (role: RoleDetail) => void
}

const ORDERED_ROLES: UserRole[] = [
  "super_admin",
  "senior_editor",
  "technical_writer",
  "seo_specialist",
]

export function PermissionMatrix({
  roles,
  groups,
  onEditRole,
}: PermissionMatrixProps) {
  const roleMap = new Map<UserRole, RoleDetail>()
  roles.forEach((r) => roleMap.set(r.role, r))

  const hasPermission = (role: RoleDetail | undefined, permId: string) => {
    if (!role) return false
    if (role.role === "super_admin" || role.permissions.includes("*"))
      return true
    return role.permissions.includes(permId)
  }

  return (
    <div className="rounded-xl border bg-card shadow-2xs overflow-hidden">
      <div className="border-b bg-muted/30 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-foreground text-base">
              System Permission Matrix
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Side-by-side comparison of capabilities across functional domains and roles.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="flex size-4 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <IconCheck className="h-3 w-3" />
              </span>
              Granted
            </span>
            <span className="flex items-center gap-1.5">
              <span className="flex size-4 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <IconMinus className="h-3 w-3" />
              </span>
              Restricted
            </span>
            <span className="flex items-center gap-1.5">
              <span className="flex size-4 items-center justify-center rounded-full bg-purple-500/15 text-purple-600">
                <IconLock className="h-3 w-3" />
              </span>
              Root Access
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
              <th className="px-5 py-3.5 font-medium min-w-72">
                Capability / Permission
              </th>
              {ORDERED_ROLES.map((roleKey) => {
                const roleObj = roleMap.get(roleKey)
                return (
                  <th
                    key={roleKey}
                    className="px-4 py-3.5 font-medium text-center min-w-36"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <RoleBadge role={roleKey} />
                      {roleObj && roleObj.role !== "super_admin" && (
                        <button
                          type="button"
                          onClick={() => onEditRole(roleObj)}
                          className="text-[11px] text-primary hover:underline"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="divide-y">
            {groups.map((group) => (
              <tr key={group.id} className="bg-muted/10">
                <td
                  colSpan={ORDERED_ROLES.length + 1}
                  className="p-0 border-t first:border-t-0"
                >
                  <div className="bg-muted/30 px-5 py-2.5 font-semibold text-xs text-foreground uppercase tracking-wider flex items-center justify-between">
                    <span>{group.title}</span>
                    <span className="text-[11px] lowercase font-normal text-muted-foreground">
                      {group.description}
                    </span>
                  </div>
                  <table className="w-full">
                    <tbody className="divide-y divide-border/60">
                      {group.permissions.map((perm) => (
                        <tr
                          key={perm.id}
                          className="transition-colors hover:bg-muted/30 text-xs"
                        >
                          <td className="px-5 py-3 min-w-72">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">
                                  {perm.name}
                                </span>
                                <span className="font-mono text-[10px] text-muted-foreground/70">
                                  {perm.id}
                                </span>
                              </div>
                              <p className="text-[11px] text-muted-foreground">
                                {perm.description}
                              </p>
                            </div>
                          </td>
                          {ORDERED_ROLES.map((roleKey) => {
                            const roleObj = roleMap.get(roleKey)
                            const granted = hasPermission(roleObj, perm.id)
                            const isSuper = roleKey === "super_admin"

                            return (
                              <td
                                key={roleKey}
                                className="px-4 py-3 text-center min-w-36 align-middle"
                              >
                                {isSuper ? (
                                  <div className="inline-flex items-center justify-center size-6 rounded-full bg-purple-500/10 text-purple-600">
                                    <IconCheck className="h-3.5 w-3.5" />
                                  </div>
                                ) : granted ? (
                                  <div className="inline-flex items-center justify-center size-6 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                                    <IconCheck className="h-3.5 w-3.5" />
                                  </div>
                                ) : (
                                  <div className="inline-flex items-center justify-center size-6 rounded-full bg-muted/60 text-muted-foreground/50">
                                    <IconMinus className="h-3.5 w-3.5" />
                                  </div>
                                )}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
