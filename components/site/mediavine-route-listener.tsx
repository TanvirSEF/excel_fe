"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export function MediavineRouteListener() {
  const pathname = usePathname()
  const initialRef = useRef(true)

  useEffect(() => {
    // Skip initial page load since the script evaluates it naturally
    if (initialRef.current) {
      initialRef.current = false
      return
    }

    try {
      // Signal SPA route transition to any listeners or browser history monitors
      window.dispatchEvent(new Event("popstate"))
      window.dispatchEvent(new CustomEvent("mediavine:route-change", { detail: { pathname } }))

      // If Mediavine exposes any custom re-evaluation method on window.$adManagement
      const adMgmt = (window as unknown as { $adManagement?: { refresh?: () => void; reinitialize?: () => void } }).$adManagement
      if (typeof adMgmt?.refresh === "function") {
        adMgmt.refresh()
      }
    } catch {
      // Fail silently to never disrupt client navigation
    }
  }, [pathname])

  return null
}
