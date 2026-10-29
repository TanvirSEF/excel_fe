"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useTheme } from "next-themes"
import type { ToasterProps } from "sonner"

import { useAuthStore } from "@/lib/auth"

const Toaster = dynamic(() => import("sonner").then((mod) => mod.Toaster), {
  ssr: false,
})

let browserQueryClient: QueryClient | undefined

function getQueryClient() {
  const options = {
    defaultOptions: {
      queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false },
    },
  }
  if (typeof window === "undefined") {
    return new QueryClient(options)
  }
  browserQueryClient ??= new QueryClient(options)
  return browserQueryClient
}

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
  const [queryClient] = React.useState(getQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      <SessionHydration />
      {children}
      <ThemedToaster />
      {process.env.NODE_ENV === "development" ? (
        <ReactQueryDevtools initialIsOpen={false} />
      ) : null}
    </QueryClientProvider>
  )
}
