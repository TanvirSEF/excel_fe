import { type NextRequest, NextResponse } from "next/server"

import {
  REFRESH_COOKIE,
  backendFetch,
  clearRefreshCookie,
  fetchMe,
  jsonError,
  setRefreshCookie,
} from "@/lib/api/auth-server"
import type { TokenResponse, User } from "@/types/api"

interface RotationCacheEntry {
  tokens: TokenResponse
  user: User
  expiresAt: number
}

const ROTATION_GRACE_MS = 30_000
const recentRotations = new Map<string, RotationCacheEntry>()
const inFlightRefreshes = new Map<
  string,
  Promise<{ ok: true; tokens: TokenResponse; user: User } | { ok: false; status: number }>
>()

function purgeExpired() {
  const now = Date.now()
  for (const [token, entry] of recentRotations) {
    if (entry.expiresAt <= now) {
      recentRotations.delete(token)
    }
  }
}

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value
  if (!refreshToken) {
    return NextResponse.json({
      authenticated: false,
      access_token: null,
      user: null,
    })
  }

  purgeExpired()

  const cached = recentRotations.get(refreshToken)
  if (cached && cached.expiresAt > Date.now()) {
    const response = NextResponse.json({
      access_token: cached.tokens.access_token,
      user: cached.user,
    })
    setRefreshCookie(response, cached.tokens.refresh_token)
    return response
  }

  const forwardedFor = request.headers.get("x-forwarded-for")

  let inFlight = inFlightRefreshes.get(refreshToken)
  if (!inFlight) {
    inFlight = (async () => {
      const refreshResponse = await backendFetch("/auth/refresh", {
        method: "POST",
        json: { refresh_token: refreshToken },
        forwardedFor,
      })

      if (!refreshResponse.ok) {
        return { ok: false as const, status: refreshResponse.status }
      }

      const tokens = (await refreshResponse.json()) as TokenResponse
      const user = await fetchMe(tokens.access_token, forwardedFor)
      if (!user) {
        return { ok: false as const, status: 502 }
      }

      recentRotations.set(refreshToken, {
        tokens,
        user,
        expiresAt: Date.now() + ROTATION_GRACE_MS,
      })

      return { ok: true as const, tokens, user }
    })().finally(() => {
      inFlightRefreshes.delete(refreshToken)
    })

    inFlightRefreshes.set(refreshToken, inFlight)
  }

  const outcome = await inFlight

  if (!outcome.ok) {
    if (outcome.status === 401) {
      const response = NextResponse.json({
        authenticated: false,
        access_token: null,
        user: null,
      })
      clearRefreshCookie(response)
      return response
    }

    return jsonError(
      outcome.status || 502,
      "UPSTREAM_ERROR",
      "Authentication service temporarily unavailable."
    )
  }

  const response = NextResponse.json({
    access_token: outcome.tokens.access_token,
    user: outcome.user,
  })
  setRefreshCookie(response, outcome.tokens.refresh_token)
  return response
}
