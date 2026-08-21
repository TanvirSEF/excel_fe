import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reset password",
  robots: { index: false },
}

export default function ResetPasswordPage() {
  return (
    <div className="rounded-xl border bg-card p-6">
      <h1 className="text-xl font-semibold tracking-tight">
        Reset password
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Not implemented yet.
      </p>
    </div>
  )
}
