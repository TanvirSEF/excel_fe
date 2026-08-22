import type { Metadata } from "next"

import { AuthCard } from "@/components/site/auth-card"
import { ForgotPasswordForm } from "@/components/site/auth/forgot-password-form"

export const metadata: Metadata = {
  title: "Forgot password",
  robots: { index: false },
}

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Forgot password"
      description="We'll email you a link to set a new one."
    >
      <ForgotPasswordForm />
    </AuthCard>
  )
}
