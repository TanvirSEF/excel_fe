import type { Metadata } from "next"

import { BlockRenderer } from "@/components/blocks/block-renderer"
import { Breadcrumb } from "@/components/site/breadcrumb"
import { PageHeader } from "@/components/site/page-header"
import { privacyContent } from "@/lib/legal/privacy"

export const metadata: Metadata = {
  title: "Privacy Policy | Excel Insider",
  description:
    "How Excel Insider collects, uses, and protects your personal data, including cookie practices, third-party advertising partners, and your privacy rights.",
  alternates: { canonical: "/privacy" },
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:py-14">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />

      <div className="mt-6">
        <PageHeader
          bordered
          title="Privacy Policy"
          description="How we collect, use, and protect your personal data."
        />
      </div>

      <div className="mt-8">
        <BlockRenderer blocks={privacyContent.blocks} />
      </div>
    </div>
  )
}
