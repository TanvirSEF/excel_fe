"use client"

import { useState } from "react"
import { IconAlertCircle, IconCheck, IconRefresh } from "@tabler/icons-react"
import { toast } from "sonner"

import { RoleBadge } from "@/components/dashboard/users/role-badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ApiClientError } from "@/lib/api/error"
import {
  DEFAULT_ROLES,
  useUpdateRolePermissions,
} from "@/lib/queries/roles"
import type { PermissionGroup, RoleDetail } from "@/types/api"

interface EditRoleSheetProps {
  role: RoleDetail | null
  groups: PermissionGroup[]
  onOpenChange: (open: boolean) => void
}

function EditRoleForm({
  role,
  groups,
  onClose,
}: {
  role: RoleDetail
  groups: PermissionGroup[]
  onClose: () => void
}) {
  const updatePermissions = useUpdateRolePermissions()
  const [selectedPerms, setSelectedPerms] = useState<Set<string>>(
    () => new Set(role.permissions)
  )

  const isSuperAdmin = role.role === "super_admin"

  const togglePermission = (permId: string) => {
    if (isSuperAdmin) return
    setSelectedPerms((prev) => {
      const next = new Set(prev)
      if (next.has(permId)) {
        next.delete(permId)
      } else {
        next.add(permId)
      }
      return next
    })
  }

  const toggleGroup = (group: PermissionGroup) => {
    if (isSuperAdmin) return
    const groupPermIds = group.permissions.map((p) => p.id)
    const allSelected = groupPermIds.every((id) => selectedPerms.has(id))

    setSelectedPerms((prev) => {
      const next = new Set(prev)
      if (allSelected) {
        groupPermIds.forEach((id) => next.delete(id))
      } else {
        groupPermIds.forEach((id) => next.add(id))
      }
      return next
    })
  }

  const resetToDefault = () => {
    const defaultMeta = DEFAULT_ROLES.find((r) => r.role === role.role)
    if (defaultMeta) {
      setSelectedPerms(new Set(defaultMeta.permissions))
      toast.info(`Permissions reset to standard defaults for ${role.name}.`)
    }
  }

  const onSave = async () => {
    if (isSuperAdmin) return
    try {
      await updatePermissions.mutateAsync({
        role: role.role,
        permissions: Array.from(selectedPerms),
      })
      toast.success(`Permissions saved for ${role.name}.`)
      onClose()
    } catch (error) {
      toast.error(
        error instanceof ApiClientError
          ? error.message
          : "Could not save permissions. Please try again."
      )
    }
  }

  const totalPossiblePerms = groups.reduce(
    (acc, g) => acc + g.permissions.length,
    0
  )
  const activePermsCount = isSuperAdmin
    ? totalPossiblePerms
    : selectedPerms.size

  return (
    <>
      <SheetHeader className="border-b pb-4">
        <div className="flex items-center gap-2">
          <RoleBadge role={role.role} />
          <span className="text-xs text-muted-foreground">
            {role.member_count} active member{role.member_count === 1 ? "" : "s"}
          </span>
        </div>
        <SheetTitle className="text-xl">Edit {role.name} Permissions</SheetTitle>
        <SheetDescription>{role.description}</SheetDescription>
        <div className="mt-2 flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-xs">
          <span className="font-medium text-foreground">
            Active capabilities: {activePermsCount} of {totalPossiblePerms}
          </span>
          {!isSuperAdmin && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
              onClick={resetToDefault}
            >
              <IconRefresh className="h-3 w-3" />
              Reset defaults
            </Button>
          )}
        </div>
      </SheetHeader>

      {isSuperAdmin ? (
        <div className="my-auto space-y-3 p-6 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-purple-500/10 text-purple-600">
            <IconCheck className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-foreground">Wildcard Root Access</h3>
          <p className="text-xs leading-relaxed text-muted-foreground">
            The Super Admin role holds permanent root permissions (<code>*</code>) across all system modules and endpoints. This role is immutable to prevent accidental administrative lockout.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          <div className="flex items-start gap-2.5 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
            <IconAlertCircle className="h-4 w-4 shrink-0 text-primary mt-0.5" />
            <span>
              Changes take effect across the dashboard immediately for all team members currently assigned to the <strong>{role.name}</strong> role.
            </span>
          </div>

          <div className="space-y-6">
            {groups.map((group) => {
              const groupPermIds = group.permissions.map((p) => p.id)
              const allSelected = groupPermIds.every((id) =>
                selectedPerms.has(id)
              )

              return (
                <div
                  key={group.id}
                  className="rounded-xl border bg-card p-4 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between border-b pb-2.5">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">
                        {group.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {group.description}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs text-primary px-2 hover:bg-primary/10"
                      onClick={() => toggleGroup(group)}
                    >
                      {allSelected ? "Clear all" : "Select all"}
                    </Button>
                  </div>

                  <div className="space-y-2.5 pt-1">
                    {group.permissions.map((perm) => {
                      const checked = selectedPerms.has(perm.id)
                      const inputId = `perm-${role.role}-${perm.id}`

                      return (
                        <div
                          key={perm.id}
                          className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted/40 cursor-pointer"
                          onClick={() => togglePermission(perm.id)}
                        >
                          <Checkbox
                            id={inputId}
                            checked={checked}
                            onCheckedChange={() => togglePermission(perm.id)}
                            className="mt-0.5"
                          />
                          <div className="flex-1 space-y-0.5">
                            <div className="flex items-center gap-2">
                              <Label
                                htmlFor={inputId}
                                className="text-xs font-semibold cursor-pointer"
                              >
                                {perm.name}
                              </Label>
                              <span className="font-mono text-[10px] text-muted-foreground/70">
                                {perm.id}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-normal">
                              {perm.description}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="border-t bg-background p-4 flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={updatePermissions.isPending}
        >
          {isSuperAdmin ? "Close" : "Cancel"}
        </Button>
        {!isSuperAdmin && (
          <Button
            type="button"
            size="sm"
            onClick={onSave}
            disabled={updatePermissions.isPending}
          >
            {updatePermissions.isPending ? "Saving…" : "Save Permissions"}
          </Button>
        )}
      </div>
    </>
  )
}

export function EditRoleSheet({
  role,
  groups,
  onOpenChange,
}: EditRoleSheetProps) {
  return (
    <Sheet open={Boolean(role)} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col overflow-hidden sm:max-w-lg">
        {role ? (
          <EditRoleForm
            key={role.role}
            role={role}
            groups={groups}
            onClose={() => onOpenChange(false)}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
