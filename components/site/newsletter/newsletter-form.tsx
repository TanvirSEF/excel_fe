"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { apiFetch } from "@/lib/api/api-fetch"
import { ApiClientError } from "@/lib/api/error"
import { cn } from "@/lib/utils"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function NewsletterForm({
  source,
  variant = "inline",
}: {
  source: string
  variant?: "inline" | "band"
}) {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const [pending, setPending] = useState(false)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    const trimmed = email.trim()
    if (!EMAIL_PATTERN.test(trimmed)) {
      toast.error("Enter a valid email address.")
      return
    }
    setPending(true)
    try {
      await apiFetch("/newsletter/subscribe", {
        method: "POST",
        body: { email: trimmed, source },
      })
      setSubscribed(true)
    } catch (error) {
      if (error instanceof ApiClientError && error.retryAfter) {
        toast.error(`${error.message} — try again in ${error.retryAfter}s`, {
          duration: error.retryAfter * 1000,
        })
      } else {
        toast.error(
          error instanceof ApiClientError
            ? error.message
            : "Could not subscribe. Please try again."
        )
      }
    } finally {
      setPending(false)
    }
  }

  if (subscribed) {
    return (
      <p
        className={cn(
          "text-sm font-medium",
          variant === "band" ? "text-primary-foreground" : "text-primary"
        )}
      >
        You&apos;re in — check your inbox to confirm.
      </p>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "flex w-full gap-2",
        variant === "band" ? "max-w-md" : "max-w-sm"
      )}
    >
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@example.com"
        aria-label="Email address"
        autoComplete="email"
        className="h-10 w-full min-w-0 rounded-md border border-input bg-background px-3 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-ring/50"
      />
      <Button type="submit" disabled={pending} className="h-10 shrink-0">
        {pending ? "…" : "Subscribe"}
      </Button>
    </form>
  )
}
