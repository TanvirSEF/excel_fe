import { type NextRequest, NextResponse } from "next/server"

import {
  REFRESH_COOKIE,
  backendFetch,
  clearRefreshCookie,
} from "@/lib/api/auth-server"
import type { TokenResponse } from "@/types/api"

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value
  const forwardedFor = request.headers.get("x-forwarded-for")

  if (refreshToken) {
    const refreshResponse = await backendFetch("/auth/refresh", {
      method: "POST",
      json: { refresh_token: refreshToken },
      forwardedFor,
    })

    if (refreshResponse.ok) {
      const tokens = (await refreshResponse.json()) as TokenResponse
      await backendFetch("/auth/logout", {
        method: "POST",
        json: { refresh_token: tokens.refresh_token },
        bearer: tokens.access_token,
        forwardedFor,
      })
    }
  }

  const response = NextResponse.json({ message: "Logged out" })
  clearRefreshCookie(response)
  return response
}
