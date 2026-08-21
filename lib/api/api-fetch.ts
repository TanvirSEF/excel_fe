import { ApiClientError, parseRetryAfter } from "@/lib/api/error"
import { useAuthStore } from "@/lib/auth"
import { API_BASE_PATH, config } from "@/lib/config"
import type { ApiError } from "@/types/api"

interface ApiFetchOptions {
  method?: string
  body?: unknown
  searchParams?: Record<string, string | number | boolean | undefined | null>
}

let refreshPromise: Promise<boolean> | null = null

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = fetch("/api/auth/session", { method: "POST" })
      .then((response) => response.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

async function parseError(response: Response) {
  const body = (await response.json().catch(() => null)) as ApiError | null
  throw ApiClientError.fromEnvelope(
    response.status,
    body as ApiError,
    parseRetryAfter(response.headers.get("retry-after"))
  )
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { method = "GET", body, searchParams } = options

  const url = new URL(`${config.publicApiUrl}${API_BASE_PATH}${path}`)
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value))
      }
    }
  }

  const isForm =
    body instanceof FormData || body instanceof URLSearchParams

  async function execute(): Promise<Response> {
    const headers: Record<string, string> = {}
    if (body !== undefined && !isForm) {
      headers["Content-Type"] = "application/json"
    }
    const accessToken = useAuthStore.getState().accessToken
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`
    }
    return fetch(url, {
      method,
      headers,
      body:
        body === undefined
          ? undefined
          : isForm
            ? body
            : JSON.stringify(body),
    })
  }

  let response = await execute()

  if (response.status === 401) {
    const refreshed = await refreshAccessToken()
    if (refreshed) {
      response = await execute()
    } else {
      useAuthStore.getState().clear()
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        const next = encodeURIComponent(
          window.location.pathname + window.location.search
        )
        window.location.assign(`/login?next=${next}`)
      }
      throw new ApiClientError(
        401,
        "SESSION_EXPIRED",
        "Session expired. Please sign in again."
      )
    }
  }

  if (!response.ok) {
    await parseError(response)
  }

  if (response.status === 204) {
    return undefined as T
  }
  return (await response.json()) as T
}

export function apiUpload<T>(
  path: string,
  file: File,
  fields: Record<string, string> = {}
) {
  const form = new FormData()
  form.append("file", file)
  for (const [key, value] of Object.entries(fields)) {
    form.append(key, value)
  }
  return apiFetch<T>(path, { method: "POST", body: form })
}
