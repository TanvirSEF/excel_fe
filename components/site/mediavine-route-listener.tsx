"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

type AdManagement = {
  refresh?: () => void
  reinitialize?: () => void
}

export function MediavineRouteListener() {
  const pathname = usePathname()
  const initialRef = useRef(true)

  useEffect(() => {
    if (initialRef.current) {
      initialRef.current = false
      return
    }

    try {
      // Mediavine patches history.pushState natively — do NOT dispatch popstate
      // as it triggers a duplicate init cycle ("Timer 'Hints time' already exists").
      // Only signal via the custom event and the refresh API if exposed.
      window.dispatchEvent(new CustomEvent("mediavine:route-change", { detail: { pathname } }))

      const adMgmt = (window as unknown as { $adManagement?: AdManagement }).$adManagement
      if (typeof adMgmt?.refresh === "function") {
        adMgmt.refresh()
      }
    } catch {
      // Fail silently
    }
  }, [pathname])

  return null
}
