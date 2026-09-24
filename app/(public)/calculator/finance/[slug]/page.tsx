import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import type { ComponentType } from "react"

import { CashOnCashRoiCalculator } from "@/components/site/calculators/finance/cash-on-cash-roi-calculator"
import { CostOfEquityCalculator } from "@/components/site/calculators/finance/cost-of-equity-calculator"
import { DividendReinvestmentPlanCalculator } from "@/components/site/calculators/finance/dividend-reinvestment-plan-calculator"
import { DividendSnowballCalculator } from "@/components/site/calculators/finance/dividend-snowball-calculator"
import { EnterpriseSeoRoiCalculator } from "@/components/site/calculators/finance/enterprise-seo-roi-calculator"
import { HoldingPeriodReturnCalculator } from "@/components/site/calculators/finance/holding-period-return-calculator"
import { IrrCalculator } from "@/components/site/calculators/finance/irr-calculator"
import { LivingOffDividendsCalculator } from "@/components/site/calculators/finance/living-off-dividends-calculator"
import { MarketingRoiCalculator } from "@/components/site/calculators/finance/marketing-roi-calculator"
import { RentalPropertyRoiCalculator } from "@/components/site/calculators/finance/rental-property-roi-calculator"
import { RetirementRateOfReturnCalculator } from "@/components/site/calculators/finance/retirement-rate-of-return-calculator"
import { SavingsWithdrawalCalculator } from "@/components/site/calculators/finance/savings-withdrawal-calculator"
import { ShareProfitCalculator } from "@/components/site/calculators/finance/share-profit-calculator"
import { SolarRoiCalculator } from "@/components/site/calculators/finance/solar-roi-calculator"
import { VentureCapitalCalculator } from "@/components/site/calculators/finance/venture-capital-calculator"
import { B2bRoiCalculator } from "@/components/site/calculators/finance/b2b-roi-calculator"
import { AccountingRateOfReturnCalculator } from "@/components/site/calculators/finance/accounting-rate-of-return-calculator"
import { CalculatorPage } from "@/components/site/calculators/calculator-page"
import {
  getFinanceCalculator,
  getFinanceGroupForCalculator,
} from "@/lib/calculators"
import {
  FINANCE_DETAILS,
  FINANCE_CANONICAL_SLUG_MAP,
  type FinanceSlug,
} from "@/lib/calculator-content/finance"
import { calculatorMetadata } from "@/lib/calculator-content/metadata"

export const dynamicParams = false
export const revalidate = 300

export function generateStaticParams() {
  const allSlugs = Object.keys(FINANCE_CANONICAL_SLUG_MAP)
  return allSlugs.map((slug) => ({ slug }))
}

const CALCULATOR_COMPONENTS: Record<FinanceSlug, ComponentType> = {
  "share-profit": ShareProfitCalculator,
  "dividend-reinvestment-plan": DividendReinvestmentPlanCalculator,
  "dividend-snowball": DividendSnowballCalculator,
  "living-off-dividends": LivingOffDividendsCalculator,
  "cost-of-equity": CostOfEquityCalculator,
  "rental-property-roi": RentalPropertyRoiCalculator,
  "cash-on-cash-roi": CashOnCashRoiCalculator,
  "solar-roi": SolarRoiCalculator,
  "marketing-roi": MarketingRoiCalculator,
  "enterprise-seo-roi": EnterpriseSeoRoiCalculator,
  "b2b-roi": B2bRoiCalculator,
  "venture-capital": VentureCapitalCalculator,
  "internal-rate-of-return": IrrCalculator,
  "accounting-rate-of-return": AccountingRateOfReturnCalculator,
  "holding-period-return": HoldingPeriodReturnCalculator,
  "retirement-rate-of-return": RetirementRateOfReturnCalculator,
  "savings-withdrawal": SavingsWithdrawalCalculator,
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const canonicalSlug = FINANCE_CANONICAL_SLUG_MAP[slug]
  if (!canonicalSlug) return {}

  const entry = getFinanceCalculator(canonicalSlug)
  const detail = FINANCE_DETAILS[canonicalSlug]
  if (!entry || !detail) return {}

  return calculatorMetadata(
    entry.name,
    detail.metaDescription,
    `/calculator/finance/${canonicalSlug}/`
  )
}

export default async function FinanceCalculatorPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const canonicalSlug = FINANCE_CANONICAL_SLUG_MAP[slug]
  if (!canonicalSlug) notFound()

  if (slug !== canonicalSlug) {
    permanentRedirect(`/calculator/finance/${canonicalSlug}/`)
  }

  const entry = getFinanceCalculator(canonicalSlug)
  const detail = FINANCE_DETAILS[canonicalSlug]
  if (!entry || !detail) notFound()

  const group = getFinanceGroupForCalculator(canonicalSlug)
  const Calculator = CALCULATOR_COMPONENTS[canonicalSlug]

  return (
    <CalculatorPage
      category={{ label: "Finance", href: "/calculator/finance/" }}
      group={group}
      entry={entry}
      detail={detail}
    >
      <Calculator />
    </CalculatorPage>
  )
}
