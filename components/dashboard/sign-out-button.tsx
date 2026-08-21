"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/lib/auth"

export function SignOutButton() {
  const router = useRouter()
  const logout = useAuthStore((state) => state.logout)
  const [pending, setPending] = useState(false)

  async function onSignOut() {
    setPending(true)
    try {
      await logout()
      router.push("/login")
      router.refresh()
    } finally {
      setPending(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onSignOut}
      disabled={pending}
    >
      {pending ? "Signing out…" : "Sign out"}
    </Button>
  )
}
