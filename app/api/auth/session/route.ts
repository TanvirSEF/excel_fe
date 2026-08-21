import { type NextRequest, NextResponse } from "next/server"

import {
  REFRESH_COOKIE,
  backendFetch,
  clearRefreshCookie,
  errorPassthrough,
  fetchMe,
  jsonError,
  setRefreshCookie,
} from "@/lib/api/auth-server"
import type { TokenResponse } from "@/types/api"

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value
  if (!refreshToken) {
    return jsonError(401, "NO_SESSION", "No active session.")
  }

  const forwardedFor = request.headers.get("x-forwarded-for")

  const refreshResponse = await backendFetch("/auth/refresh", {
    method: "POST",
    json: { refresh_token: refreshToken },
    forwardedFor,
  })

  if (!refreshResponse.ok) {
    const response = await errorPassthrough(refreshResponse)
    clearRefreshCookie(response)
    return response
  }

  const tokens = (await refreshResponse.json()) as TokenResponse
  const user = await fetchMe(tokens.access_token, forwardedFor)
  if (!user) {
    const response = jsonError(
      502,
      "PROFILE_FETCH_FAILED",
      "Could not load profile."
    )
    clearRefreshCookie(response)
    return response
  }

  const response = NextResponse.json({
    access_token: tokens.access_token,
    user,
  })
  setRefreshCookie(response, tokens.refresh_token)
  return response
}
