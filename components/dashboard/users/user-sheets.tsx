"use client"

import { useState } from "react"
import { toast } from "sonner"

import { RoleBadge, ROLE_LABELS } from "@/components/dashboard/users/role-badge"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ApiClientError } from "@/lib/api/error"
import { useAuthStore } from "@/lib/auth"
import {
  useCreateUser,
  useDeleteUserPermanently,
  useUpdateUser,
} from "@/lib/queries/users"
import type { User, UserRole } from "@/types/api"

const ROLES: UserRole[] = [
  "technical_writer",
  "senior_editor",
  "seo_specialist",
  "super_admin",
]

interface CreateUserSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateUserSheet({ open, onOpenChange }: CreateUserSheetProps) {
  const createUser = useCreateUser()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>("technical_writer")

  async function onCreate() {
    if (!name.trim() || !email.trim() || password.length < 10) {
      toast.error("Name, email and a 10+ character password are required.")
      return
    }
    try {
      await createUser.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      })
      toast.success("User created.")
      onOpenChange(false)
      setName("")
      setEmail("")
      setPassword("")
      setRole("technical_writer")
    } catch (error) {
      toast.error(
        error instanceof ApiClientError
          ? error.message
          : "Could not create the user. Please try again."
      )
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>New user</SheetTitle>
          <SheetDescription>
            They can change the password after signing in.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 px-4 pb-6">
          <div className="space-y-2">
            <Label htmlFor="new-user-name">Name</Label>
            <Input
              id="new-user-name"
              value={name}
              maxLength={120}
              onChange={(event) => setName(event.target.value)}
              placeholder="Full name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-user-email">Email</Label>
            <Input
              id="new-user-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="teammate@excelinsider.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-user-password">Temporary password</Label>
            <Input
              id="new-user-password"
              type="text"
              value={password}
              maxLength={128}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 10 characters"
              className="font-mono text-sm"
            />
            {password.length > 0 && password.length < 10 ? (
              <p className="text-xs text-destructive">
                Minimum 10 characters.
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-user-role">Role</Label>
            <select
              id="new-user-role"
              value={role}
              onChange={(event) => setRole(event.target.value as UserRole)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
            >
              {ROLES.map((option) => (
                <option key={option} value={option}>
                  {ROLE_LABELS[option]}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={onCreate}
              disabled={createUser.isPending}
            >
              {createUser.isPending ? "Creating…" : "Create user"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createUser.isPending}
            >
              Cancel
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

interface EditUserSheetProps {
  user: User | null
  onOpenChange: (open: boolean) => void
}

export function EditUserSheet({ user, onOpenChange }: EditUserSheetProps) {
  const me = useAuthStore((state) => state.user)
  const updateUser = useUpdateUser()
  const deleteUserPermanently = useDeleteUserPermanently()
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [role, setRole] = useState<UserRole>("technical_writer")
  const [isActive, setIsActive] = useState(true)
  const [isVerified, setIsVerified] = useState(false)
  const [loadedFor, setLoadedFor] = useState<string | null>(null)
  const [roleConfirmOpen, setRoleConfirmOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [pending, setPending] = useState(false)

  if (user && loadedFor !== user.id) {
    setLoadedFor(user.id)
    setName(user.name)
    setBio(user.bio ?? "")
    setAvatarUrl(user.avatar_url ?? "")
    setRole(user.role)
    setIsActive(user.is_active)
    setIsVerified(user.is_verified)
  }

  const roleChanged = user !== null && user.role !== role

  async function onSave() {
    if (!user) return
    setPending(true)
    try {
      await updateUser.mutateAsync({
        userId: user.id,
        input: {
          name: name.trim(),
          bio: bio.trim() || null,
          avatar_url: avatarUrl.trim() || null,
          is_verified: isVerified,
        },
      })
      toast.success("User updated.")
      onOpenChange(false)
    } catch (error) {
      toast.error(
        error instanceof ApiClientError
          ? error.message
          : "Could not update. Please try again."
      )
    } finally {
      setPending(false)
    }
  }

  async function applyRoleChange() {
    if (!user) return
    try {
      await updateUser.mutateAsync({
        userId: user.id,
        input: { role },
      })
      toast.success(
        `Role changed — takes effect on ${user.name}'s next login.`
      )
      setRoleConfirmOpen(false)
      onOpenChange(false)
    } catch (error) {
      toast.error(
        error instanceof ApiClientError
          ? error.message
          : "Could not change the role. Please try again."
      )
    }
  }

  async function onDeletePermanent() {
    if (!user) return
    try {
      await deleteUserPermanently.mutateAsync(user.id)
      toast.success("User permanently deleted.")
      setDeleteConfirmOpen(false)
      onOpenChange(false)
    } catch (error) {
      toast.error(
        error instanceof ApiClientError
          ? error.message
          : "Could not delete user. Please try again."
      )
    }
  }

  return (
    <>
      <Sheet open={user !== null} onOpenChange={onOpenChange}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {user ? (
            <>
              <SheetHeader>
                <SheetTitle className="truncate">{user.name}</SheetTitle>
                <SheetDescription>{user.email}</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 px-4 pb-6">
                <div className="space-y-2">
                  <Label htmlFor="edit-user-name">Name</Label>
                  <Input
                    id="edit-user-name"
                    value={name}
                    maxLength={120}
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-user-bio">Bio</Label>
                  <textarea
                    id="edit-user-bio"
                    value={bio}
                    rows={2}
                    onChange={(event) => setBio(event.target.value)}
                    className="w-full rounded-md border border-input bg-background p-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-ring/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-user-avatar">Avatar URL</Label>
                  <Input
                    id="edit-user-avatar"
                    value={avatarUrl}
                    onChange={(event) => setAvatarUrl(event.target.value)}
                    placeholder="https://…"
                  />
                </div>

                <div className="space-y-2 border-t pt-4">
                  <Label htmlFor="edit-user-role">Role</Label>
                  <div className="flex gap-2">
                    <select
                      id="edit-user-role"
                      value={role}
                      onChange={(event) =>
                        setRole(event.target.value as UserRole)
                      }
                      className="h-9 flex-1 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
                    >
                      {ROLES.map((option) => (
                        <option key={option} value={option}>
                          {ROLE_LABELS[option]}
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center">
                      <RoleBadge role={role} />
                    </div>
                  </div>
                  {roleChanged ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setRoleConfirmOpen(true)}
                    >
                      Apply role change
                    </Button>
                  ) : null}
                </div>

                <label className="flex items-center gap-2 border-t pt-4 text-sm">
                  <input
                    type="checkbox"
                    checked={isVerified}
                    onChange={(event) => setIsVerified(event.target.checked)}
                    className="size-4 accent-primary"
                  />
                  Email verified
                </label>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={onSave}
                    disabled={pending}
                  >
                    {pending ? "Saving…" : "Save changes"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={pending}
                  >
                    Cancel
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Status ({isActive ? "active" : "deactivated"}) changes from
                  the list.
                </p>

                {me?.role === "super_admin" && me?.id !== user.id ? (
                  <div className="border-t pt-4">
                    <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-destructive">
                        Danger Zone
                      </h4>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Permanently remove this user. Their authored posts and media will be reassigned to you.
                      </p>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="mt-3"
                        onClick={() => setDeleteConfirmOpen(true)}
                      >
                        Delete user permanently
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={roleConfirmOpen}
        onOpenChange={setRoleConfirmOpen}
        title={`Change role to ${ROLE_LABELS[role]}?`}
        description={`${user?.name ?? ""} gets the new permissions on their next sign-in. The change is audit-logged.`}
        confirmLabel="Change role"
        destructive={false}
        onConfirm={applyRoleChange}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title={`Permanently delete ${user?.name ?? ""}?`}
        description="This action cannot be undone. Their account, profile, and active sessions will be permanently removed. Any authored posts and media will be reassigned to you."
        confirmLabel="Delete permanently"
        destructive
        onConfirm={onDeletePermanent}
      />
    </>
  )
}
