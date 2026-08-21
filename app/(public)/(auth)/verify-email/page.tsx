import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Verify email",
  robots: { index: false },
}

export default function VerifyEmailPage() {
  return (
    <div className="rounded-xl border bg-card p-6">
      <h1 className="text-xl font-semibold tracking-tight">
        Verify email
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Not implemented yet.
      </p>
    </div>
  )
}
