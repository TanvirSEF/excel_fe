import type { Metadata } from "next"

import { BlockRenderer } from "@/components/blocks/block-renderer"
import { Breadcrumb } from "@/components/site/breadcrumb"
import { PageHeader } from "@/components/site/page-header"
import { cookieContent } from "@/lib/legal/cookie"

export const metadata: Metadata = {
  title: "Cookie Policy | Excel Insider",
  description:
    "What cookies Excel Insider uses, why we use them, and how you can control cookies in your browser.",
  alternates: { canonical: "/cookie-policy" },
}

export default function CookiePolicyPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:py-14">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cookie Policy" }]} />

      <div className="mt-6">
        <PageHeader
          bordered
          title="Cookie Policy"
          description="What cookies we use and how to control them."
        />
      </div>

      <div className="mt-8">
        <BlockRenderer blocks={cookieContent.blocks} />
      </div>
    </div>
  )
}
