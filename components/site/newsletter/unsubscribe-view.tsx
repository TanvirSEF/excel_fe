"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { apiFetch } from "@/lib/api/api-fetch"

export function UnsubscribeView({ token }: { token: string }) {
  const [state, setState] = useState<"confirm" | "done" | "error">("confirm")
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState("")

  async function onUnsubscribe() {
    setPending(true)
    try {
      const result = await apiFetch<{ message?: string }>(
        "/newsletter/unsubscribe",
        { method: "POST", body: { token } }
      )
      setMessage(result?.message ?? "")
      setState("done")
    } catch (error) {
      if (error instanceof Error && error.message) {
        setMessage(error.message)
      }
      setState("error")
    } finally {
      setPending(false)
    }
  }

  if (state === "confirm") {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Sorry to see you go. Confirm below and we&apos;ll stop sending
          the newsletter to this address.
        </p>
        <Button type="button" onClick={onUnsubscribe} disabled={pending}>
          {pending ? "Unsubscribing…" : "Unsubscribe"}
        </Button>
      </div>
    )
  }

  if (state === "done") {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium">You&apos;re unsubscribed.</p>
        {message ? (
          <p className="text-sm text-muted-foreground">{message}</p>
        ) : null}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-destructive">
        {message || "This unsubscribe link is invalid or has expired."}
      </p>
      <p className="text-sm text-muted-foreground">
        If you believe this is a mistake, you can subscribe again anytime.
      </p>
    </div>
  )
}
