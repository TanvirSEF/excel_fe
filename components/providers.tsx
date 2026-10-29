"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { useTheme } from "next-themes"
import type { ToasterProps } from "sonner"

import { useAuthStore } from "@/lib/auth"

const Toaster = dynamic(() => import("sonner").then((mod) => mod.Toaster), {
  ssr: false,
})

function ThemedToaster() {
  const { resolvedTheme } = useTheme()
  return (
    <Toaster
      theme={resolvedTheme as ToasterProps["theme"]}
      richColors
      closeButton
    />
  )
}

function SessionHydration() {
  const hydrate = useAuthStore((state) => state.hydrate)
  const status = useAuthStore((state) => state.status)

  React.useEffect(() => {
    hydrate()
  }, [hydrate])

  React.useEffect(() => {
    if (status !== "authenticated") return

    const interval = setInterval(() => {
      hydrate()
    }, 15 * 60 * 1000)

    return () => clearInterval(interval)
  }, [status, hydrate])

  React.useEffect(() => {
    if (status !== "authenticated") return

    let lastRefreshed = Date.now()
    function onVisibilityChange() {
      if (document.visibilityState === "visible") {
        const elapsed = Date.now() - lastRefreshed
        if (elapsed > 10 * 60 * 1000) {
          lastRefreshed = Date.now()
          hydrate()
        }
      }
    }

    document.addEventListener("visibilitychange", onVisibilityChange)
    return () => document.removeEventListener("visibilitychange", onVisibilityChange)
  }, [status, hydrate])

  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SessionHydration />
      {children}
      <ThemedToaster />
    </>
  )
}
