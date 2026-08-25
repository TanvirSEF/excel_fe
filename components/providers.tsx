"use client"

import * as React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useTheme } from "next-themes"
import { Toaster, type ToasterProps } from "sonner"

import { useAuthStore } from "@/lib/auth"

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

  React.useEffect(() => {
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const handle = window.requestIdleCallback(() => {
        hydrate()
      })
      return () => window.cancelIdleCallback(handle)
    } else {
      const timer = setTimeout(() => {
        hydrate()
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [hydrate])

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
