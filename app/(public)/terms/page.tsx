import type { Metadata } from "next"

import { LegalPage } from "@/components/site/legal/legal-page"
import { TermsContent, termsToc } from "@/components/site/legal/terms-content"

export const metadata: Metadata = {
  title: "Terms & Conditions | Excel Insider",
  description:
    "The terms of service for using Excel Insider — services, payments and refunds, intellectual property, and user responsibilities.",
  alternates: { canonical: "/terms" },
}

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      description="The terms of service for using Excel Insider."
      breadcrumbLabel="Terms & Conditions"
      toc={termsToc}
    >
      <TermsContent />
    </LegalPage>
  )
}
