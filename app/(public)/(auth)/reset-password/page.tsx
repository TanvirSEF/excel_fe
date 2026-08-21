import type { Metadata } from "next"

import { AuthCard } from "@/components/site/auth-card"

export const metadata: Metadata = {
  title: "Reset password",
  robots: { index: false },
}

export default function ResetPasswordPage() {
  return <AuthCard title="Reset password" />
}
