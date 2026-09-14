import type { Metadata } from "next"

import { BlockRenderer } from "@/components/blocks/block-renderer"
import { Breadcrumb } from "@/components/site/breadcrumb"
import { PageHeader } from "@/components/site/page-header"
import { termsContent } from "@/lib/legal/terms"

export const metadata: Metadata = {
  title: "Terms & Conditions | Excel Insider",
  description:
    "The terms of service for using Excel Insider — services, payments and refunds, intellectual property, and user responsibilities.",
  alternates: { canonical: "/terms" },
}

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:py-14">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Terms & Conditions" }]} />

      <div className="mt-6">
        <PageHeader
          bordered
          title="Terms & Conditions"
          description="The terms of service for using Excel Insider."
        />
      </div>

      <div className="mt-8">
        <BlockRenderer blocks={termsContent.blocks} />
      </div>
    </div>
  )
}
