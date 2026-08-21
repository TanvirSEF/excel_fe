import type { Metadata } from "next"

import { AuthCard } from "@/components/site/auth-card"

export const metadata: Metadata = {
  title: "Forgot password",
  robots: { index: false },
}

export default function ForgotPasswordPage() {
  return <AuthCard title="Forgot password" />
}
