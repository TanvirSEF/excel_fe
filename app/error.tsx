"use client"

import { useEffect } from "react"

import { ErrorState } from "@/components/shared/error-state"

export default function RootError({
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
    <div className="flex min-h-svh items-center justify-center px-4">
      <ErrorState
        className="mx-auto max-w-lg"
        message="Something went wrong on our side. Try again in a moment."
        action={
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Try again
          </button>
        }
      />
    </div>
  )
}
