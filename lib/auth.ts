import { create } from "zustand"

import * as authApi from "@/lib/api/auth"
import type { User } from "@/types/api"

export type AuthStatus = "loading" | "authenticated" | "unauthenticated"

const AUTH_SYNC_CHANNEL = "ei_auth_sync"

interface AuthSyncMessage {
  type: "login" | "logout"
  accessToken?: string | null
  user?: User | null
}

function broadcastAuth(msg: AuthSyncMessage) {
  if (typeof window === "undefined" || !("BroadcastChannel" in window)) return
  try {
    const ch = new BroadcastChannel(AUTH_SYNC_CHANNEL)
    ch.postMessage(msg)
    ch.close()
  } catch {
    // BroadcastChannel unsupported or blocked
  }
}

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

  setSession: (accessToken, user) => {
    set({ accessToken, user, status: "authenticated" })
    broadcastAuth({ type: "login", accessToken, user })
  },

  setUser: (user) => set({ user }),

  clear: () => {
    set({ accessToken: null, user: null, status: "unauthenticated" })
    broadcastAuth({ type: "logout" })
  },

  hydrate: async () => {
    try {
      const session = await authApi.refreshSession()
      if (session?.access_token && session.user) {
        set({ accessToken: session.access_token, user: session.user, status: "authenticated" })
        broadcastAuth({ type: "login", accessToken: session.access_token, user: session.user })
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
    broadcastAuth({ type: "login", accessToken: session.access_token, user: session.user })
  },

  logout: async () => {
    try {
      await authApi.logout()
    } finally {
      set({ accessToken: null, user: null, status: "unauthenticated" })
      broadcastAuth({ type: "logout" })
    }
  },
}))

if (typeof window !== "undefined" && "BroadcastChannel" in window) {
  try {
    const ch = new BroadcastChannel(AUTH_SYNC_CHANNEL)
    ch.onmessage = (event: MessageEvent<AuthSyncMessage>) => {
      if (event.data?.type === "login" && event.data.accessToken && event.data.user) {
        useAuthStore.setState({
          accessToken: event.data.accessToken,
          user: event.data.user,
          status: "authenticated",
        })
      } else if (event.data?.type === "logout") {
        useAuthStore.setState({
          accessToken: null,
          user: null,
          status: "unauthenticated",
        })
      }
    }
  } catch {
    // BroadcastChannel unsupported or blocked
  }
}

export function can(
  user: (Pick<User, "role"> & { permissions?: string[] }) | null,
  permission: string
): boolean {
  if (!user) return false
  if (user.role === "super_admin") return true
  const granted = user.permissions ?? []
  return granted.includes("*") || granted.includes(permission)
}
