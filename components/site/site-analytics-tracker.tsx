"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

import { startPageTracking } from "@/lib/analytics-tracker"

export function SiteAnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => startPageTracking(pathname), [pathname])

  return null
}
