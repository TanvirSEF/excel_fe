import type { ApiError } from "@/types/api"

export class ApiClientError extends Error {
  readonly status: number
  readonly code: string
  readonly details: { field: string; message: string }[] | undefined
  readonly retryAfter: number | undefined

  constructor(
    status: number,
    code: string,
    message: string,
    details?: { field: string; message: string }[],
    retryAfter?: number
  ) {
    super(message)
    this.name = "ApiClientError"
    this.status = status
    this.code = code
    this.details = details
    this.retryAfter = retryAfter
  }

  static fromEnvelope(status: number, body: ApiError, retryAfter?: number) {
    return new ApiClientError(
      status,
      body?.error?.code ?? "UNKNOWN",
      body?.error?.message ?? `Request failed with status ${status}`,
      body?.error?.details,
      retryAfter
    )
  }
}

export function parseRetryAfter(header: string | null): number | undefined {
  if (!header) return undefined
  const seconds = Number(header)
  return Number.isFinite(seconds) ? seconds : undefined
}
