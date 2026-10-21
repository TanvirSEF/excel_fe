"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

import { API_BASE_PATH, config } from "@/lib/config"

const ENDPOINT = `${config.publicApiUrl}${API_BASE_PATH}/track`
const VISITOR_KEY = "ei_vid"
const SESSION_KEY = "ei_sid"
const SESSION_TIMEOUT_MS = 30 * 60 * 1000
const HEARTBEAT_MS = 30_000
const IDLE_MS = 30_000
const TICK_MS = 1_000

let landingReferrerPending = true

interface Identity {
  visitorId: string
  sessionId: string
  returning: boolean
}

function readStorage(key: string) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    return
  }
}

function resolveIdentity(): Identity {
  let visitorId = readStorage(VISITOR_KEY)
  const returning = Boolean(visitorId)
  if (!visitorId) {
    visitorId = crypto.randomUUID()
    writeStorage(VISITOR_KEY, visitorId)
  }

  let sessionId: string | null = null
  try {
    const stored = JSON.parse(readStorage(SESSION_KEY) ?? "null") as {
      id: string
      last: number
    } | null
    if (stored && Date.now() - stored.last < SESSION_TIMEOUT_MS) {
      sessionId = stored.id
    }
  } catch {
    sessionId = null
  }

  return { visitorId, sessionId: sessionId ?? crypto.randomUUID(), returning }
}

function touchSession(sessionId: string) {
  writeStorage(SESSION_KEY, JSON.stringify({ id: sessionId, last: Date.now() }))
}

function trackingDisabled() {
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean }
  return navigator.doNotTrack === "1" || nav.globalPrivacyControl === true
}

function post(body: Record<string, unknown>) {
  fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => undefined)
}

export function SiteAnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (trackingDisabled()) return

    const identity = resolveIdentity()
    const pageId = crypto.randomUUID()
    const params = new URLSearchParams(window.location.search)
    const state = { engagedMs: 0, scroll: 0, interacted: false, lastActivity: Date.now() }
    let lastSentEngaged = -1

    const base = {
      session_id: identity.sessionId,
      visitor_id: identity.visitorId,
      page_id: pageId,
      path: pathname,
    }

    const send = (type: "pageview" | "ping") => {
      touchSession(identity.sessionId)
      post({
        ...base,
        type,
        engaged_ms: state.engagedMs,
        scroll: state.scroll,
        interacted: state.interacted,
        returning: identity.returning,
        webdriver: navigator.webdriver === true,
        has_languages: (navigator.languages?.length ?? 0) > 0,
        screen_width: window.screen.width,
        screen_height: window.screen.height,
        ...(type === "pageview"
          ? {
              referrer: landingReferrerPending ? document.referrer : "",
              utm_source: params.get("utm_source"),
              utm_medium: params.get("utm_medium"),
              utm_campaign: params.get("utm_campaign"),
            }
          : {}),
      })
      lastSentEngaged = state.engagedMs
    }

    const flush = () => {
      if (state.engagedMs !== lastSentEngaged) send("ping")
    }

    const markActive = () => {
      state.lastActivity = Date.now()
    }
    const markInteracted = () => {
      state.interacted = true
      markActive()
    }
    const onScroll = () => {
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - window.innerHeight
      if (scrollable > 0) {
        const depth = Math.round(((window.scrollY + window.innerHeight) / doc.scrollHeight) * 100)
        state.scroll = Math.max(state.scroll, Math.min(depth, 100))
      }
      markInteracted()
    }
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush()
      else markActive()
    }

    send("pageview")
    landingReferrerPending = false

    const tick = window.setInterval(() => {
      if (document.visibilityState === "visible" && Date.now() - state.lastActivity < IDLE_MS) {
        state.engagedMs += TICK_MS
      }
    }, TICK_MS)
    const heartbeat = window.setInterval(flush, HEARTBEAT_MS)

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("pointerdown", markInteracted, { passive: true })
    window.addEventListener("keydown", markInteracted)
    window.addEventListener("pointermove", markActive, { passive: true })
    window.addEventListener("pagehide", flush)
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      flush()
      window.clearInterval(tick)
      window.clearInterval(heartbeat)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("pointerdown", markInteracted)
      window.removeEventListener("keydown", markInteracted)
      window.removeEventListener("pointermove", markActive)
      window.removeEventListener("pagehide", flush)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [pathname])

  return null
}
