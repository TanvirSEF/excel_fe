"use client"

import { useState } from "react"
import { IconArrowRight, IconCheck, IconMail } from "@tabler/icons-react"
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
      toast.success("Welcome aboard! Please check your inbox.")
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
      <div className="flex items-center gap-2.5 rounded-xl border border-primary-foreground/30 bg-primary-foreground/15 px-4 py-3 text-sm font-semibold text-primary-foreground">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-foreground text-primary">
          <IconCheck className="h-3.5 w-3.5 stroke-[3]" />
        </div>
        <span>You&apos;re subscribed! Check your inbox for the free PDF guide.</span>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div
        className={cn(
          "flex flex-col gap-2.5 sm:flex-row",
          variant === "band" ? "max-w-xl" : "max-w-md"
        )}
      >
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
            <IconMail className="h-4 w-4" />
          </div>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your work or personal email..."
            aria-label="Email address"
            autoComplete="email"
            required
            className="h-12 w-full rounded-xl border border-primary-foreground/25 bg-background pl-10 pr-4 text-sm text-foreground shadow-xs placeholder:text-muted-foreground focus:border-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary-foreground/40"
          />
        </div>
        <Button
          type="submit"
          disabled={pending}
          size="lg"
          className="h-12 shrink-0 rounded-xl bg-primary-foreground px-6 text-sm font-bold text-primary shadow-xs transition-all duration-200 hover:bg-primary-foreground/90 hover:shadow-md cursor-pointer"
        >
          <span>{pending ? "Subscribing..." : "Get Free Access"}</span>
          <IconArrowRight className="h-4 w-4" />
        </Button>
      </div>
      <p className="mt-2.5 text-[11px] text-primary-foreground/70">
        🔒 100% Free · No spam ever · Unsubscribe anytime with 1-click
      </p>
    </form>
  )
}
