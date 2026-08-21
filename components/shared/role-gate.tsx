"use client"

import type { ReactNode } from "react"

import { can, useAuthStore } from "@/lib/auth"

interface RoleGateProps {
  permission: string
  children: ReactNode
  fallback?: ReactNode
}

export function RoleGate({
  permission,
  children,
  fallback = null,
}: RoleGateProps) {
  const user = useAuthStore((state) => state.user)

  if (!can(user, permission)) {
    return fallback
  }
  return children
}
