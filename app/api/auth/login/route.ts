import { type NextRequest, NextResponse } from "next/server"

import {
  backendFetch,
  errorPassthrough,
  fetchMe,
  jsonError,
  setRefreshCookie,
} from "@/lib/api/auth-server"
import type { TokenResponse } from "@/types/api"

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    email?: unknown
    password?: unknown
  } | null

  const email = typeof body?.email === "string" ? body.email.trim() : ""
  const password = typeof body?.password === "string" ? body.password : ""

  if (!email || !password) {
    return jsonError(400, "INVALID_INPUT", "Email and password are required.")
  }

  const forwardedFor = request.headers.get("x-forwarded-for")

  const form = new URLSearchParams()
  form.set("username", email)
  form.set("password", password)

  const loginResponse = await backendFetch("/auth/login", {
    method: "POST",
    form,
    forwardedFor,
  })

  if (!loginResponse.ok) {
    return errorPassthrough(loginResponse)
  }

  const tokens = (await loginResponse.json()) as TokenResponse
  const user = await fetchMe(tokens.access_token, forwardedFor)
  if (!user) {
    return jsonError(502, "PROFILE_FETCH_FAILED", "Could not load profile.")
  }

  const response = NextResponse.json({
    access_token: tokens.access_token,
    user,
  })
  setRefreshCookie(response, tokens.refresh_token)
  return response
}
