import { ApiClientError, parseRetryAfter } from "@/lib/api/error"
import type { ApiError, User } from "@/types/api"

interface LoginResponse {
  access_token: string
  user: User
}

interface SessionResponse {
  access_token: string
  user: User
}

async function request<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(path, {
    method: "POST",
    headers:
      body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (!response.ok) {
    const envelope = (await response
      .json()
      .catch(() => null)) as ApiError | null
    throw ApiClientError.fromEnvelope(
      response.status,
      envelope as ApiError,
      parseRetryAfter(response.headers.get("retry-after"))
    )
  }

  return (await response.json()) as T
}

export function login(email: string, password: string) {
  return request<LoginResponse>("/api/auth/login", { email, password })
}

export function refreshSession() {
  return request<SessionResponse>("/api/auth/session")
}

export function logout() {
  return request<{ message: string }>("/api/auth/logout")
}
