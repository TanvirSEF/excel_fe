import { create } from "zustand"

import type { User, UserRole } from "@/types/api"

interface AuthState {
  accessToken: string | null
  user: User | null
  setSession: (accessToken: string, user: User) => void
  clear: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  setSession: (accessToken, user) => set({ accessToken, user }),
  clear: () => set({ accessToken: null, user: null }),
}))

const PERMISSIONS: Record<UserRole, readonly string[]> = {
  super_admin: ["*"],
  senior_editor: [
    "posts:manage",
    "seo:edit",
    "comments:moderate",
    "media:manage",
    "categories:manage",
    "tags:manage",
    "analytics:view",
    "settings:view",
  ],
  technical_writer: [
    "posts:manage",
    "media:upload",
    "tags:create",
    "settings:view",
  ],
  seo_specialist: ["seo:edit", "analytics:view", "settings:view"],
}

export function can(
  user: Pick<User, "role"> | null,
  permission: string
): boolean {
  if (!user) return false
  const granted = PERMISSIONS[user.role]
  return granted.includes("*") || granted.includes(permission)
}
