import type { Metadata } from "next"

import { HubPage } from "@/components/site/calculators/hub-page"
import { STATS_HUB } from "@/lib/calculators"

export const metadata: Metadata = {
  title: "Statistics Calculators for Students & Professionals | Excel Insider",
  description:
    "Free online statistics calculators — weighted averages, geometric & harmonic means, variance, ANOVA, Z-scores, P-values, VWAP and more. Instant, accurate, step-by-step results.",
  alternates: { canonical: "/calculators/statistics" },
  openGraph: {
    title: "Statistics Calculators for Students & Professionals | Excel Insider",
    description:
      "Solve complex statistical formulas instantly — averages, variance, ANOVA, probability and business statistics tools with step-by-step explanations.",
    url: "/calculators/statistics",
    images: ["/og-default.png"],
  },
}

export default function StatisticsHubPage() {
  return <HubPage hub={STATS_HUB} />
}
