import { create } from "zustand"

import * as authApi from "@/lib/api/auth"
import type { User, UserRole } from "@/types/api"

export type AuthStatus = "loading" | "authenticated" | "unauthenticated"

interface AuthState {
  accessToken: string | null
  user: User | null
  status: AuthStatus
  setSession: (accessToken: string, user: User) => void
  setUser: (user: User) => void
  clear: () => void
  hydrate: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  status: "loading",

  setSession: (accessToken, user) =>
    set({ accessToken, user, status: "authenticated" }),

  setUser: (user) => set({ user }),

  clear: () =>
    set({ accessToken: null, user: null, status: "unauthenticated" }),

  hydrate: async () => {
    try {
      const session = await authApi.refreshSession()
      set({ accessToken: session.access_token, user: session.user, status: "authenticated" })
    } catch {
      set({ accessToken: null, user: null, status: "unauthenticated" })
    }
  },

  login: async (email, password) => {
    const session = await authApi.login(email, password)
    set({ accessToken: session.access_token, user: session.user, status: "authenticated" })
  },

  logout: async () => {
    try {
      await authApi.logout()
    } finally {
      set({ accessToken: null, user: null, status: "unauthenticated" })
    }
  },
}))

const PERMISSIONS: Record<UserRole, readonly string[]> = {
  super_admin: ["*"],
  senior_editor: [
    "overview:view",
    "posts:view",
    "posts:manage",
    "posts:delete",
    "posts:publish",
    "seo:edit",
    "comments:moderate",
    "media:view",
    "media:manage",
    "categories:manage",
    "tags:view",
    "tags:manage",
    "analytics:view",
    "settings:view",
  ],
  technical_writer: [
    "overview:view",
    "posts:view",
    "posts:manage",
    "media:view",
    "media:upload",
    "tags:view",
    "tags:create",
    "settings:view",
  ],
  seo_specialist: [
    "overview:view",
    "seo:edit",
    "analytics:view",
    "settings:view",
  ],
}

export function can(
  user: Pick<User, "role"> | null,
  permission: string
): boolean {
  if (!user) return false
  const granted = PERMISSIONS[user.role]
  return granted.includes("*") || granted.includes(permission)
}
