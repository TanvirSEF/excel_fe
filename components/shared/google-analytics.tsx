"use client"

import { usePathname, useSearchParams } from "next/navigation"
import Script from "next/script"
import { Suspense, useEffect, useRef } from "react"

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

interface GoogleAnalyticsProps {
  measurementId?: string
}

function AnalyticsNavigationTracker({ measurementId }: { measurementId: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isFirstMount = useRef(true)

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false
      return
    }

    if (typeof window === "undefined" || typeof window.gtag !== "function") return

    const query = searchParams?.toString()
    const url = query ? `${pathname}?${query}` : pathname

    window.gtag("event", "page_view", {
      page_path: url,
      page_location: window.location.href,
      page_title: typeof document !== "undefined" ? document.title : "",
      ...(process.env.NODE_ENV === "development" ? { debug_mode: true } : {}),
    })
  }, [pathname, searchParams, measurementId])

  return null
}

export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  if (!measurementId) return null

  const isDev = process.env.NODE_ENV === "development"

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
              ${isDev ? "debug_mode: true," : ""}
            });
          `,
        }}
      />
      <Suspense fallback={null}>
        <AnalyticsNavigationTracker measurementId={measurementId} />
      </Suspense>
    </>
  )
}

export function trackEvent(action: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", action, params)
  }
}
