import { ApiClientError, parseRetryAfter } from "@/lib/api/error"
import { API_BASE_PATH, config } from "@/lib/config"
import type { ApiError } from "@/types/api"

interface ServerFetchOptions {
  revalidate?: number
  tags?: string[]
  searchParams?: Record<string, string | number | boolean | undefined | null>
}

export async function serverFetch<T>(
  path: string,
  options: ServerFetchOptions = {}
): Promise<T> {
  const { revalidate = 60, tags, searchParams } = options

  const url = new URL(`${config.apiUrl}${API_BASE_PATH}${path}`)
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value))
      }
    }
  }

  let response: Response
  try {
    response = await fetch(url, { next: { revalidate, tags } })
  } catch {
    throw new ApiClientError(
      503,
      "NETWORK_ERROR",
      "Could not reach the Excel Insider API. Please try again."
    )
  }

  if (!response.ok) {
    let envelope: ApiError | undefined
    try {
      envelope = (await response.json()) as ApiError
    } catch {
      envelope = undefined
    }
    throw ApiClientError.fromEnvelope(
      response.status,
      envelope as ApiError,
      parseRetryAfter(response.headers.get("retry-after"))
    )
  }

  return (await response.json()) as T
}
