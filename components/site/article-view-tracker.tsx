"use client"

import { useEffect } from "react"

interface ArticleViewTrackerProps {
  slug: string
}

export function ArticleViewTracker({ slug }: ArticleViewTrackerProps) {
  useEffect(() => {
    if (!slug || typeof window === "undefined") return

    const storageKey = `tracked_view_${slug}`
    try {
      if (sessionStorage.getItem(storageKey)) return
      sessionStorage.setItem(storageKey, "1")
    } catch {
      // Ignore sessionStorage exceptions (private mode, etc.)
    }

    const endpoint = `/api/views/${encodeURIComponent(slug)}`
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const beaconSent = navigator.sendBeacon(endpoint)
      if (beaconSent) return
    }

    fetch(endpoint, {
      method: "POST",
      keepalive: true,
    }).catch(() => {
      // Ignore background network failure silently
    })
  }, [slug])

  return null
}
