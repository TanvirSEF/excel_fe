import type { Metadata } from "next"

import { AuthCard } from "@/components/site/auth-card"
import { VerifyEmailView } from "@/components/site/auth/verify-email-view"

export const metadata: Metadata = {
  title: "Verify email",
  robots: { index: false },
}

interface VerifyEmailPageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const { token } = await searchParams

  return (
    <AuthCard title="Verify email">
      {token ? (
        <VerifyEmailView token={token} />
      ) : (
        <p className="text-sm text-destructive">
          This verification link is invalid — it&apos;s missing its token.
        </p>
      )}
    </AuthCard>
  )
}
