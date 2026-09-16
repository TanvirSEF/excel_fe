import type { Metadata } from "next"

import { CookieContent, cookieToc } from "@/components/site/legal/cookie-content"
import { LegalPage } from "@/components/site/legal/legal-page"

export const metadata: Metadata = {
  title: "Cookie Policy | Excel Insider",
  description:
    "What cookies Excel Insider uses, why we use them, and how you can control cookies in your browser.",
  alternates: { canonical: "/cookie-policy" },
}

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      description="What cookies we use and how to control them."
      breadcrumbLabel="Cookie Policy"
      updatedAt="November 12, 2025"
      toc={cookieToc}
    >
      <CookieContent />
    </LegalPage>
  )
}
