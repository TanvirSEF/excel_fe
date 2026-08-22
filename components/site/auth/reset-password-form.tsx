"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiFetch } from "@/lib/api/api-fetch"
import { ApiClientError } from "@/lib/api/error"

const schema = z
  .object({
    password: z.string().min(10, "At least 10 characters"),
    confirm: z.string().min(10, "At least 10 characters"),
  })
  .refine((values) => values.password === values.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  })

type ResetForm = z.infer<typeof schema>

export function ResetPasswordForm({ token }: { token: string }) {
  const [done, setDone] = useState(false)
  const [failed, setFailed] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetForm>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirm: "" },
  })

  async function onSubmit(values: ResetForm) {
    try {
      await apiFetch("/auth/reset-password", {
        method: "POST",
        body: { token, new_password: values.password },
      })
      setDone(true)
    } catch (error) {
      if (error instanceof ApiClientError && error.retryAfter) {
        toast.error(`${error.message} — try again in ${error.retryAfter}s`, {
          duration: error.retryAfter * 1000,
        })
        return
      }
      setFailed(true)
    }
  }

  if (done) {
    return (
      <div className="space-y-3">
        <p className="text-sm">Your password has been reset.</p>
        <Link
          href="/login"
          className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          Sign in
        </Link>
      </div>
    )
  }

  if (failed) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-destructive">
          This reset link is invalid or has expired.
        </p>
        <Link
          href="/forgot-password"
          className="text-sm text-primary underline-offset-4 hover:underline"
        >
          Request a new link
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="reset-password">New password</Label>
        <Input
          id="reset-password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 10 characters"
          {...register("password")}
        />
        {errors.password ? (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="reset-confirm">Confirm new password</Label>
        <Input
          id="reset-confirm"
          type="password"
          autoComplete="new-password"
          {...register("confirm")}
        />
        {errors.confirm ? (
          <p className="text-xs text-destructive">{errors.confirm.message}</p>
        ) : null}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Resetting…" : "Reset password"}
      </Button>
    </form>
  )
}
