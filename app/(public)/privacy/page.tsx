import type { Metadata } from "next"

import { LegalPage } from "@/components/site/legal/legal-page"
import { PrivacyContent, privacyToc } from "@/components/site/legal/privacy-content"

export const metadata: Metadata = {
  title: "Privacy Policy | Excel Insider",
  description:
    "How Excel Insider collects, uses, and protects your personal data, including cookie practices, third-party advertising partners, and your privacy rights.",
  alternates: { canonical: "/privacy" },
}

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="How we collect, use, and protect your personal data."
      breadcrumbLabel="Privacy Policy"
      updatedAt="August 21, 2026"
      toc={privacyToc}
    >
      <PrivacyContent />
    </LegalPage>
  )
}
