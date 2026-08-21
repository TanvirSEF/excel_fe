"use client"

import { useEffect, type ReactNode } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { can, useAuthStore } from "@/lib/auth"

interface PageGuardProps {
  permission: string
  title: string
  children: ReactNode
}

export function PageGuard({ permission, title, children }: PageGuardProps) {
  const user = useAuthStore((state) => state.user)
  const status = useAuthStore((state) => state.status)

  const allowed = can(user, permission)

  useEffect(() => {
    if (status === "authenticated" && !allowed) {
      console.error(`[rbac] ${permission} denied for role ${user?.role}`)
    }
  }, [allowed, status, permission, user?.role])

  if (status === "loading") {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-24" />
          ))}
        </div>
      </div>
    )
  }

  if (!allowed) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-16 text-center">
          <p className="font-medium">You don&apos;t have access to {title}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your role doesn&apos;t include permission for this area.
          </p>
        </div>
      </div>
    )
  }

  return children
}
