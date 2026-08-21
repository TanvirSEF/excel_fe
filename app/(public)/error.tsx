"use client"

import { useEffect } from "react"

import { ErrorState } from "@/components/shared/error-state"

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-20">
      <ErrorState
        message={error.message}
        action={
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Try again
          </button>
        }
        className="mx-auto max-w-lg"
      />
    </div>
  )
}
