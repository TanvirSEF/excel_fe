import { create } from "zustand"

import * as authApi from "@/lib/api/auth"
import type { User } from "@/types/api"

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
      if (session?.access_token && session.user) {
        set({ accessToken: session.access_token, user: session.user, status: "authenticated" })
      } else {
        set({ accessToken: null, user: null, status: "unauthenticated" })
      }
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

export function can(
  user: (Pick<User, "role"> & { permissions?: string[] }) | null,
  permission: string
): boolean {
  if (!user) return false
  if (user.role === "super_admin") return true
  const granted = user.permissions ?? []
  return granted.includes("*") || granted.includes(permission)
}
