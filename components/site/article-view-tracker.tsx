"use client"

import { useEffect } from "react"

import { API_BASE_PATH, config } from "@/lib/config"

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

    const endpoint = `${config.publicApiUrl}${API_BASE_PATH}/posts/${encodeURIComponent(slug)}/view`
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const beaconSent = navigator.sendBeacon(endpoint)
      if (beaconSent) return
    }

    fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      keepalive: true,
    }).catch(() => {
      // Ignore background network failure silently
    })
  }, [slug])

  return null
}
