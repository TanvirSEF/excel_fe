import type { Metadata } from "next"

import { HubPage } from "@/components/site/calculators/hub-page"
import { FINANCE_HUB } from "@/lib/calculators"

export const metadata: Metadata = {
  title: "Financial Calculator Hub: Business, Real Estate & Investing | Excel Insider",
  description:
    "Free online financial calculators — investment returns, dividends, rental property and solar ROI, marketing ROI, IRR, retirement planning and more. Instant, private, no signup.",
  alternates: { canonical: "/calculators/finance" },
  openGraph: {
    title: "Financial Calculator Hub: Business, Real Estate & Investing | Excel Insider",
    description:
      "Investment, real estate, business, and retirement calculators — logical formulas, instant results, 100% free.",
    url: "/calculators/finance",
    images: ["/og-default.png"],
  },
}

export default function FinanceHubPage() {
  return <HubPage hub={FINANCE_HUB} />
}
