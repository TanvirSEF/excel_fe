"use client"

import * as React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useTheme } from "next-themes"
import { Toaster, type ToasterProps } from "sonner"

let browserQueryClient: QueryClient | undefined

function getQueryClient() {
  if (typeof window === "undefined") {
    return new QueryClient({
      defaultOptions: {
        queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false },
      },
    })
  }
  browserQueryClient ??= new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false },
    },
  })
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

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(getQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ThemedToaster />
      {process.env.NODE_ENV === "development" ? (
        <ReactQueryDevtools initialIsOpen={false} />
      ) : null}
    </QueryClientProvider>
  )
}
