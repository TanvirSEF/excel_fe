import { NextResponse } from "next/server"

import { API_BASE_PATH, config } from "@/lib/config"
import type { ApiError, User } from "@/types/api"

export const REFRESH_COOKIE = "ei_refresh"
export const REFRESH_COOKIE_MAX_AGE = 60 * 60 * 24 * 30

interface BackendCallOptions {
  method?: string
  json?: unknown
  form?: URLSearchParams
  bearer?: string
  forwardedFor?: string | null
}

export async function backendFetch(
  path: string,
  options: BackendCallOptions = {}
) {
  const headers: Record<string, string> = {}
  if (options.json !== undefined) {
    headers["Content-Type"] = "application/json"
  }
  if (options.form) {
    headers["Content-Type"] = "application/x-www-form-urlencoded"
  }
  if (options.bearer) {
    headers.Authorization = `Bearer ${options.bearer}`
  }
  if (options.forwardedFor) {
    headers["x-forwarded-for"] = options.forwardedFor
  }

  return fetch(`${config.apiUrl}${API_BASE_PATH}${path}`, {
    method: options.method ?? "GET",
    headers,
    body:
      options.json !== undefined
        ? JSON.stringify(options.json)
        : options.form,
    cache: "no-store",
  })
}

export async function fetchMe(
  bearer: string,
  forwardedFor?: string | null
): Promise<User | null> {
  const response = await backendFetch("/auth/me", { bearer, forwardedFor })
  if (!response.ok) return null
  return (await response.json()) as User
}

export async function errorPassthrough(response: Response) {
  const body = (await response.json().catch(() => null)) as ApiError | null
  const headers = new Headers()
  const retryAfter = response.headers.get("retry-after")
  if (retryAfter) {
    headers.set("retry-after", retryAfter)
  }
  return NextResponse.json(
    body ?? {
      error: {
        code: "UPSTREAM_ERROR",
        message: "Authentication service is unavailable.",
        status: 502,
      },
    },
    { status: body ? response.status : 502, headers }
  )
}

export function jsonError(
  status: number,
  code: string,
  message: string
) {
  return NextResponse.json(
    { error: { code, message, status } },
    { status }
  )
}

const LEGACY_REFRESH_COOKIE_CLEAR = `${REFRESH_COOKIE}=; Path=/api/auth; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`

export function setRefreshCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: REFRESH_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: REFRESH_COOKIE_MAX_AGE,
  })
  response.headers.append("set-cookie", LEGACY_REFRESH_COOKIE_CLEAR)
}

export function clearRefreshCookie(response: NextResponse) {
  response.cookies.set({
    name: REFRESH_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })
  response.headers.append("set-cookie", LEGACY_REFRESH_COOKIE_CLEAR)
}
