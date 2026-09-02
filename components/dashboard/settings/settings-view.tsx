"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  IconLoader2,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react"
import { toast } from "sonner"

import { RoleBadge } from "@/components/dashboard/users/role-badge"
import { WpImportPanel } from "@/components/dashboard/settings/wp-import-panel"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { ApiClientError } from "@/lib/api/error"
import { useAuthStore } from "@/lib/auth"
import {
  useChangePassword,
  useRequestVerification,
} from "@/lib/queries/account"
import { useUploadMedia } from "@/lib/queries/media"
import { useUpdateUser } from "@/lib/queries/users"

const AVATAR_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
])
const AVATAR_MAX_BYTES = 10 * 1024 * 1024

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("")
}

export function SettingsView() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const status = useAuthStore((state) => state.status)
  const logout = useAuthStore((state) => state.logout)
  const setUser = useAuthStore((state) => state.setUser)
  const updateUser = useUpdateUser()
  const uploadMedia = useUploadMedia()
  const changePassword = useChangePassword()
  const requestVerification = useRequestVerification()

  const avatarInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [loadedFor, setLoadedFor] = useState<string | null>(null)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [savingProfile, setSavingProfile] = useState(false)
  const [avatarBusy, setAvatarBusy] = useState(false)

  if (user && loadedFor !== user.id) {
    setLoadedFor(user.id)
    setName(user.name)
    setBio(user.bio ?? "")
    setAvatarUrl(user.avatar_url ?? "")
  }

  async function persistAvatar(url: string | null) {
    if (!user) return
    const updated = await updateUser.mutateAsync({
      userId: user.id,
      input: { avatar_url: url },
    })
    setUser(updated)
  }

  async function onPickAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file || !user) return
    if (!AVATAR_TYPES.has(file.type)) {
      toast.error("Only JPG, PNG, WebP or GIF images are allowed.")
      return
    }
    if (file.size > AVATAR_MAX_BYTES) {
      toast.error("Image must be under 10MB.")
      return
    }
    setAvatarBusy(true)
    try {
      const media = await uploadMedia.mutateAsync({
        file,
        folder: "avatars",
      })
      await persistAvatar(media.file_url)
      setAvatarUrl(media.file_url)
      toast.success("Avatar updated.")
    } catch (error) {
      toast.error(
        error instanceof ApiClientError
          ? error.message
          : "Could not upload the image. Please try again."
      )
    } finally {
      setAvatarBusy(false)
    }
  }

  async function onRemoveAvatar() {
    setAvatarBusy(true)
    try {
      await persistAvatar(null)
      setAvatarUrl("")
      toast.success("Avatar removed.")
    } catch (error) {
      toast.error(
        error instanceof ApiClientError
          ? error.message
          : "Could not remove the avatar. Please try again."
      )
    } finally {
      setAvatarBusy(false)
    }
  }

  async function onSaveProfile() {
    if (!user || !name.trim()) {
      toast.error("Name is required.")
      return
    }
    setSavingProfile(true)
    try {
      await updateUser.mutateAsync({
        userId: user.id,
        input: {
          name: name.trim(),
          bio: bio.trim() || null,
        },
      })
      toast.success("Profile saved.")
    } catch (error) {
      toast.error(
        error instanceof ApiClientError
          ? error.message
          : "Could not save. Please try again."
      )
    } finally {
      setSavingProfile(false)
    }
  }

  async function onChangePassword() {
    if (newPassword.length < 10) {
      toast.error("New password must be at least 10 characters.")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.")
      return
    }
    try {
      await changePassword.mutateAsync({
        currentPassword,
        newPassword,
      })
      toast.success("Password changed — signing you out.")
      await logout()
      router.replace("/login")
    } catch (error) {
      toast.error(
        error instanceof ApiClientError
          ? error.message
          : "Could not change the password. Please try again."
      )
    }
  }

  async function onResendVerification() {
    try {
      await requestVerification.mutateAsync()
      toast.success("Verification email sent — check your inbox.")
    } catch (error) {
      toast.error(
        error instanceof ApiClientError
          ? error.message
          : "Could not send the email. Please try again."
      )
    }
  }

  if (status === "loading" || !user) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your profile and account security.
        </p>
      </div>

      <section className="space-y-4 rounded-xl border p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Profile</h2>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {user.email}
            <RoleBadge role={user.role} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="settings-name">Name</Label>
          <Input
            id="settings-name"
            value={name}
            maxLength={120}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="settings-bio">Bio</Label>
          <textarea
            id="settings-bio"
            value={bio}
            rows={2}
            onChange={(event) => setBio(event.target.value)}
            placeholder="Shown on your articles"
            className="w-full rounded-md border border-input bg-background p-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Avatar className="h-20 w-20 rounded-full border">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={user.name} />
            ) : null}
            <AvatarFallback className="text-xl font-bold">
              {initials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => avatarInputRef.current?.click()}
                disabled={avatarBusy}
              >
                {avatarBusy ? (
                  <IconLoader2 className="animate-spin" />
                ) : (
                  <IconUpload />
                )}
                {avatarBusy ? "Uploading…" : "Upload photo"}
              </Button>
              {avatarUrl ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onRemoveAvatar}
                  disabled={avatarBusy}
                >
                  <IconTrash />
                  Remove
                </Button>
              ) : null}
            </div>
            <p className="text-xs text-muted-foreground">
              JPG, PNG, WebP or GIF — up to 10MB.
            </p>
          </div>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={onPickAvatar}
          />
        </div>
        <Button
          type="button"
          size="sm"
          onClick={onSaveProfile}
          disabled={savingProfile}
        >
          {savingProfile ? "Saving…" : "Save profile"}
        </Button>
      </section>

      <section className="space-y-4 rounded-xl border p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Security</h2>
          {user.is_verified ? (
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-700 dark:text-emerald-400">
              Email verified
            </span>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onResendVerification}
              disabled={requestVerification.isPending}
            >
              {requestVerification.isPending
                ? "Sending…"
                : "Resend verification email"}
            </Button>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="settings-current-password">Current password</Label>
          <Input
            id="settings-current-password"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="settings-new-password">New password</Label>
            <Input
              id="settings-new-password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="settings-confirm-password">
              Confirm new password
            </Label>
            <Input
              id="settings-confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </div>
        </div>
        {newPassword.length > 0 && newPassword.length < 10 ? (
          <p className="text-xs text-destructive">
            Minimum 10 characters.
          </p>
        ) : null}
        <p className="text-xs text-muted-foreground">
          Changing your password signs you out everywhere.
        </p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onChangePassword}
          disabled={
            changePassword.isPending ||
            !currentPassword ||
            !newPassword ||
            !confirmPassword
          }
        >
          {changePassword.isPending ? "Changing…" : "Change password"}
        </Button>
      </section>

      {user.role === "super_admin" && <WpImportPanel />}
    </div>
  )
}
