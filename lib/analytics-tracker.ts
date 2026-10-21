import { API_BASE_PATH, config } from "@/lib/config"

const ENDPOINT = `${config.publicApiUrl}${API_BASE_PATH}/track`
const VISITOR_KEY = "ei_vid"
const SESSION_KEY = "ei_sid"
const OPT_OUT_KEY = "ei_optout"
const INTERNAL_KEY = "ei_internal"
const SESSION_TIMEOUT_MS = 30 * 60 * 1000
const HEARTBEAT_MS = 30_000
const IDLE_MS = 30_000
const TICK_MS = 1_000
const REPLAY_GUARD_MS = 1_000
const MAX_BATCH = 20
const CALCULATOR_PREFIX = "/calculator/"
const DOWNLOAD_PATTERN = /\.(pdf|xlsx?|xlsm|csv|zip|docx?|pptx?)$/i

type EventType = "pageview" | "ping" | "event"
type CustomEvent = "outbound_click" | "file_download" | "calculator_use"

interface TrackEvent {
  event_id: string
  type: EventType
  [key: string]: unknown
}

interface Page {
  id: string
  path: string
  sessionId: string
  startedAt: number
  engagedMs: number
  scroll: number
  interacted: boolean
  lastActivity: number
  lastSentEngaged: number
}

interface Visitor {
  id: string
  returning: boolean
}

const queue: TrackEvent[] = []
let current: Page | null = null
let landingReferrerPending = true

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

export function markInternalBrowser() {
  writeStorage(INTERNAL_KEY, "1")
}

function trackingAllowed() {
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean }
  if (nav.doNotTrack === "1" || nav.globalPrivacyControl === true) return false
  return readStorage(OPT_OUT_KEY) !== "1"
}

function resolveVisitor(): Visitor {
  const stored = readStorage(VISITOR_KEY)
  if (stored) return { id: stored, returning: true }
  const id = crypto.randomUUID()
  writeStorage(VISITOR_KEY, id)
  return { id, returning: false }
}

function activeSessionId() {
  try {
    const stored = JSON.parse(readStorage(SESSION_KEY) ?? "null") as {
      id: string
      last: number
    } | null
    if (stored && Date.now() - stored.last < SESSION_TIMEOUT_MS) return stored.id
  } catch {
    return crypto.randomUUID()
  }
  return crypto.randomUUID()
}

function sessionExpired(sessionId: string) {
  try {
    const stored = JSON.parse(readStorage(SESSION_KEY) ?? "null") as {
      id: string
      last: number
    } | null
    return !stored || stored.id !== sessionId || Date.now() - stored.last >= SESSION_TIMEOUT_MS
  } catch {
    return true
  }
}

function touchSession(sessionId: string) {
  writeStorage(SESSION_KEY, JSON.stringify({ id: sessionId, last: Date.now() }))
}

function transmit(events: TrackEvent[]) {
  fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ events }),
    keepalive: true,
  }).catch(() => undefined)
}

function flushQueue() {
  while (queue.length > 0) {
    transmit(queue.splice(0, MAX_BATCH))
  }
}

function enqueue(event: TrackEvent, immediate = false) {
  queue.push(event)
  if (immediate || queue.length >= MAX_BATCH) flushQueue()
}

function envelope(page: Page, visitor: Visitor) {
  return {
    session_id: page.sessionId,
    visitor_id: visitor.id,
    page_id: page.id,
    path: page.path,
    engaged_ms: page.engagedMs,
    scroll: page.scroll,
    interacted: page.interacted,
    returning: visitor.returning,
    internal: readStorage(INTERNAL_KEY) === "1",
    webdriver: navigator.webdriver === true,
    has_languages: (navigator.languages?.length ?? 0) > 0,
    screen_width: window.screen.width,
    screen_height: window.screen.height,
  }
}

function newPage(path: string, sessionId: string): Page {
  const now = Date.now()
  return {
    id: crypto.randomUUID(),
    path,
    sessionId,
    startedAt: now,
    engagedMs: 0,
    scroll: 0,
    interacted: false,
    lastActivity: now,
    lastSentEngaged: -1,
  }
}

function sendPageview(page: Page, visitor: Visitor) {
  const params = new URLSearchParams(window.location.search)
  touchSession(page.sessionId)
  enqueue(
    {
      ...envelope(page, visitor),
      event_id: crypto.randomUUID(),
      type: "pageview",
      referrer: landingReferrerPending ? document.referrer : "",
      utm_source: params.get("utm_source"),
      utm_medium: params.get("utm_medium"),
      utm_campaign: params.get("utm_campaign"),
    },
    true
  )
  landingReferrerPending = false
}

function sendEngagement(page: Page, visitor: Visitor) {
  if (page.engagedMs === page.lastSentEngaged) return
  touchSession(page.sessionId)
  enqueue({ ...envelope(page, visitor), event_id: crypto.randomUUID(), type: "ping" })
  page.lastSentEngaged = page.engagedMs
}

export function startPageTracking(path: string): () => void {
  if (typeof window === "undefined" || !trackingAllowed()) return () => undefined

  const visitor = resolveVisitor()
  const reuse =
    current !== null && current.path === path && Date.now() - current.startedAt < REPLAY_GUARD_MS
  let page: Page

  if (reuse && current) {
    page = current
  } else {
    page = newPage(path, activeSessionId())
    current = page
    sendPageview(page, visitor)
  }

  const flush = () => {
    sendEngagement(page, visitor)
    flushQueue()
  }

  const rotateSessionIfExpired = () => {
    if (!sessionExpired(page.sessionId)) return
    flush()
    page = newPage(path, crypto.randomUUID())
    current = page
    sendPageview(page, visitor)
  }

  const markActive = () => {
    rotateSessionIfExpired()
    page.lastActivity = Date.now()
  }
  const markInteracted = () => {
    markActive()
    page.interacted = true
  }
  const onScroll = () => {
    const doc = document.documentElement
    if (doc.scrollHeight - window.innerHeight > 0) {
      const depth = Math.round(((window.scrollY + window.innerHeight) / doc.scrollHeight) * 100)
      page.scroll = Math.max(page.scroll, Math.min(depth, 100))
    }
    markInteracted()
  }
  const onVisibility = () => {
    if (document.visibilityState === "hidden") flush()
    else markActive()
  }
  const onClick = (event: MouseEvent) => {
    markInteracted()
    const anchor = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null
    if (!anchor) return
    let url: URL
    try {
      url = new URL(anchor.href)
    } catch {
      return
    }
    if (url.protocol !== "http:" && url.protocol !== "https:") return
    const name: CustomEvent | null =
      url.hostname !== window.location.hostname
        ? "outbound_click"
        : DOWNLOAD_PATTERN.test(url.pathname)
          ? "file_download"
          : null
    if (!name) return
    enqueue(
      {
        ...envelope(page, visitor),
        event_id: crypto.randomUUID(),
        type: "event",
        name,
        target: name === "outbound_click" ? url.hostname : url.pathname,
      },
      true
    )
  }

  const isCalculatorPage =
    path.startsWith(CALCULATOR_PREFIX) && path.split("/").filter(Boolean).length >= 3
  let calculatorTracked = false
  const onInput = (event: Event) => {
    if (!isCalculatorPage || calculatorTracked) return
    const field = event.target as Element | null
    if (!field?.matches?.("input, select, textarea") || !field.closest("main")) return
    calculatorTracked = true
    enqueue({
      ...envelope(page, visitor),
      event_id: crypto.randomUUID(),
      type: "event",
      name: "calculator_use",
      target: path,
    })
  }

  const tick = window.setInterval(() => {
    if (document.visibilityState === "visible" && Date.now() - page.lastActivity < IDLE_MS) {
      page.engagedMs += TICK_MS
    }
  }, TICK_MS)
  const heartbeat = window.setInterval(flush, HEARTBEAT_MS)

  window.addEventListener("scroll", onScroll, { passive: true })
  window.addEventListener("pointerdown", markInteracted, { passive: true })
  window.addEventListener("keydown", markInteracted)
  window.addEventListener("pointermove", markActive, { passive: true })
  window.addEventListener("pagehide", flush)
  document.addEventListener("click", onClick, true)
  document.addEventListener("input", onInput, true)
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
    document.removeEventListener("click", onClick, true)
    document.removeEventListener("input", onInput, true)
    document.removeEventListener("visibilitychange", onVisibility)
  }
}
