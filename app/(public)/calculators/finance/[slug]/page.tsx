import type { Metadata } from "next"
import { notFound } from "next/navigation"
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
  FINANCE_CALCULATORS,
  getFinanceCalculator,
  getFinanceGroupForCalculator,
} from "@/lib/calculators"
import { FINANCE_DETAILS, type FinanceSlug } from "@/lib/calculator-content/finance"
import { calculatorMetadata } from "@/lib/calculator-content/metadata"

export const dynamicParams = false
export const revalidate = 300

export function generateStaticParams() {
  return FINANCE_CALCULATORS.map((calculator) => ({ slug: calculator.slug }))
}

const CALCULATOR_COMPONENTS: Record<FinanceSlug, ComponentType> = {
  "share-profit-calculator": ShareProfitCalculator,
  "dividend-reinvestment-plan-calculator": DividendReinvestmentPlanCalculator,
  "dividend-snowball-calculator": DividendSnowballCalculator,
  "living-off-dividends-calculator": LivingOffDividendsCalculator,
  "cost-of-equity-calculator": CostOfEquityCalculator,
  "rental-property-roi-calculator": RentalPropertyRoiCalculator,
  "cash-on-cash-roi-calculator": CashOnCashRoiCalculator,
  "solar-roi-calculator": SolarRoiCalculator,
  "marketing-roi-calculator": MarketingRoiCalculator,
  "enterprise-seo-roi-calculator": EnterpriseSeoRoiCalculator,
  "b2b-roi-calculator": B2bRoiCalculator,
  "venture-capital-calculator": VentureCapitalCalculator,
  "irr-calculator": IrrCalculator,
  "accounting-rate-of-return-calculator": AccountingRateOfReturnCalculator,
  "holding-period-return-calculator": HoldingPeriodReturnCalculator,
  "retirement-rate-of-return-calculator": RetirementRateOfReturnCalculator,
  "savings-withdrawal-calculator": SavingsWithdrawalCalculator,
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const entry = getFinanceCalculator(slug)
  const detail = FINANCE_DETAILS[slug as FinanceSlug]
  if (!entry || !detail) return {}

  return calculatorMetadata(
    entry.name,
    detail.metaDescription,
    `/calculators/finance/${slug}`
  )
}

export default async function FinanceCalculatorPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const entry = getFinanceCalculator(slug)
  const detail = FINANCE_DETAILS[slug as FinanceSlug]
  if (!entry || !detail) notFound()

  const group = getFinanceGroupForCalculator(slug)
  const Calculator = CALCULATOR_COMPONENTS[slug as FinanceSlug]

  return (
    <CalculatorPage
      category={{ label: "Finance", href: "/calculators/finance" }}
      group={group}
      entry={entry}
      detail={detail}
    >
      <Calculator />
    </CalculatorPage>
  )
}
