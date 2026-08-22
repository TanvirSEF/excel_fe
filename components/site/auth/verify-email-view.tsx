"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { Skeleton } from "@/components/ui/skeleton"
import { apiFetch } from "@/lib/api/api-fetch"

export function VerifyEmailView({ token }: { token: string }) {
  const [state, setState] = useState<"loading" | "ok" | "error">("loading")

  useEffect(() => {
    let cancelled = false
    async function verify() {
      try {
        await apiFetch("/auth/verify-email", {
          method: "POST",
          body: { token },
        })
        if (!cancelled) setState("ok")
      } catch {
        if (!cancelled) setState("error")
      }
    }
    verify()
    return () => {
      cancelled = true
    }
  }, [token])

  if (state === "loading") {
    return (
      <div className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>
    )
  }

  if (state === "ok") {
    return (
      <div className="space-y-3">
        <p className="text-sm">Your email is verified — welcome aboard.</p>
        <Link
          href="/login"
          className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          Sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-destructive">
        This verification link is invalid or has expired.
      </p>
      <Link
        href="/login"
        className="text-sm text-primary underline-offset-4 hover:underline"
      >
        Back to sign in
      </Link>
    </div>
  )
}
