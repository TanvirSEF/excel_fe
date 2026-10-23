import type { Metadata } from "next"
import { Suspense } from "react"

import { LoginForm } from "@/components/site/login-form"

export const metadata: Metadata = {
  title: "Insider Studio",
  robots: {
    index: false,
    follow: false,
  },
}

export default function InsiderStudioPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
