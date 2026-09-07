import type { Metadata } from "next"

import { HubPage } from "@/components/site/calculators/hub-page"
import { ACCOUNTING_HUB } from "@/lib/calculators"

export const metadata: Metadata = {
  title: "Accounting Calculators Hub | Excel Insider",
  description:
    "Free online accounting calculators — retail & wholesale margins, payroll with overtime, gross-up pay, Amazon seller fees, retained earnings, debt payoff and more.",
  alternates: { canonical: "/calculators/accounting" },
  openGraph: {
    title: "Accounting Calculators Hub | Excel Insider",
    description:
      "Profit margins, payroll, commissions, business health and debt tools — universal formulas, instant results, 100% free.",
    url: "/calculators/accounting",
    images: ["/og-default.png"],
  },
}

export default function AccountingHubPage() {
  return <HubPage hub={ACCOUNTING_HUB} />
}
