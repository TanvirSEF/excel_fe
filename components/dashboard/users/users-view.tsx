"use client"

import { useState } from "react"
import { toast } from "sonner"

import { EditUserSheet, CreateUserSheet } from "@/components/dashboard/users/user-sheets"
import { RoleBadge } from "@/components/dashboard/users/role-badge"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { EmptyState } from "@/components/shared/empty-state"
import { ErrorState } from "@/components/shared/error-state"
import { Time } from "@/components/shared/time"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuthStore } from "@/lib/auth"
import { ApiClientError } from "@/lib/api/error"
import { useDeactivateUser, useUsers } from "@/lib/queries/users"
import type { User } from "@/types/api"

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

export function UsersView() {
  const me = useAuthStore((state) => state.user)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)
  const [deactivating, setDeactivating] = useState<User | null>(null)

  const { data, isPending, isError, refetch } = useUsers(page)
  const deactivateUser = useDeactivateUser()

  const items = (data?.items ?? []).filter((user) =>
    search.trim()
      ? `${user.name} ${user.email}`
          .toLowerCase()
          .includes(search.trim().toLowerCase())
      : true
  )
  const totalPages = data?.total_pages ?? 1

  async function onDeactivate() {
    if (!deactivating) return
    try {
      await deactivateUser.mutateAsync(deactivating.id)
      toast.success("User deactivated.")
    } catch (error) {
      toast.error(
        error instanceof ApiClientError
          ? error.message
          : "Could not deactivate. Please try again."
      )
    } finally {
      setDeactivating(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {data?.total ?? "…"} team member{(data?.total ?? 1) === 1 ? "" : "s"}
          </p>
        </div>
        <Button type="button" size="sm" onClick={() => setCreateOpen(true)}>
          New user
        </Button>
      </div>

      <Input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search by name or email"
        className="max-w-xs"
      />

      {isError ? (
        <ErrorState
          title="Could not load users"
          message="The users service did not respond. Try again."
          action={
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      ) : isPending ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-14" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title={search ? "No matching users" : "No users yet"}
          description={
            search
              ? "Try a different search."
              : "Invite your first teammate."
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Member</th>
                <th className="px-4 py-2.5 font-medium">Role</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium">Last login</th>
                <th className="px-4 py-2.5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((user) => (
                <tr key={user.id} className="border-b last:border-b-0">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {initials(user.name)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {user.name}
                          {me?.id === user.id ? (
                            <span className="ml-1.5 text-xs text-muted-foreground">
                              (you)
                            </span>
                          ) : null}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex flex-wrap gap-1.5">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          user.is_active
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {user.is_active ? "Active" : "Deactivated"}
                      </span>
                      {user.is_verified ? (
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                          Verified
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">
                    {user.last_login_at ? (
                      <Time date={user.last_login_at} variant="relative" />
                    ) : (
                      "Never"
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditing(user)}
                      >
                        Edit
                      </Button>
                      {user.is_active ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeactivating(user)}
                        >
                          Deactivate
                        </Button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 ? (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}

      <CreateUserSheet open={createOpen} onOpenChange={setCreateOpen} />
      <EditUserSheet user={editing} onOpenChange={(open) => !open && setEditing(null)} />

      <ConfirmDialog
        open={deactivating !== null}
        onOpenChange={(open) => !open && setDeactivating(null)}
        title={`Deactivate ${deactivating?.name ?? ""}?`}
        description="They can no longer sign in until reactivated. Their content stays."
        confirmLabel="Deactivate"
        onConfirm={onDeactivate}
      />
    </div>
  )
}
