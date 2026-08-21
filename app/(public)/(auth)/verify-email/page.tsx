import type { Metadata } from "next"

import { AuthCard } from "@/components/site/auth-card"

export const metadata: Metadata = {
  title: "Verify email",
  robots: { index: false },
}

export default function VerifyEmailPage() {
  return <AuthCard title="Verify email" />
}
