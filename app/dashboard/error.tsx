"use client"

import { useEffect } from "react"

import { ErrorState } from "@/components/shared/error-state"

export default function DashboardError({
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
    <ErrorState
      title="This page failed to load"
      message="The dashboard hit an unexpected error. Try again."
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
  )
}
