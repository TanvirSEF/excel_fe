"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiFetch } from "@/lib/api/api-fetch"
import { ApiClientError } from "@/lib/api/error"

const schema = z.object({
  email: z.email("Enter a valid email address"),
})

type ForgotForm = z.infer<typeof schema>

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotForm>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  })

  async function onSubmit(values: ForgotForm) {
    try {
      await apiFetch("/auth/forgot-password", {
        method: "POST",
        body: { email: values.email.trim() },
      })
    } catch (error) {
      if (error instanceof ApiClientError && error.retryAfter) {
        toast.error(`${error.message} — try again in ${error.retryAfter}s`, {
          duration: error.retryAfter * 1000,
        })
        return
      }
    }
    setSent(true)
  }

  if (sent) {
    return (
      <div className="space-y-3">
        <p className="text-sm">
          If an account exists for that email, a reset link is on its way.
        </p>
        <p className="text-sm text-muted-foreground">
          The link expires soon — check your inbox (and spam folder).
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="forgot-email">Email</Label>
        <Input
          id="forgot-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        ) : null}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Send reset link"}
      </Button>
    </form>
  )
}
