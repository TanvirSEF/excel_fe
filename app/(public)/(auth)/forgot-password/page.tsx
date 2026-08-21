import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Forgot password",
  robots: { index: false },
}

export default function ForgotPasswordPage() {
  return (
    <div className="rounded-xl border bg-card p-6">
      <h1 className="text-xl font-semibold tracking-tight">
        Forgot password
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Not implemented yet.
      </p>
    </div>
  )
}
