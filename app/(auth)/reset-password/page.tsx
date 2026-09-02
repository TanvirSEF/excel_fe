import type { Metadata } from "next"

import { AuthCard } from "@/components/site/auth-card"
import { ResetPasswordForm } from "@/components/site/auth/reset-password-form"

export const metadata: Metadata = {
  title: "Reset password",
  robots: { index: false },
}

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token } = await searchParams

  return (
    <AuthCard
      title="Reset password"
      description="Choose a new password for your account."
    >
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <p className="text-sm text-destructive">
          This reset link is invalid — it&apos;s missing its token.
        </p>
      )}
    </AuthCard>
  )
}
