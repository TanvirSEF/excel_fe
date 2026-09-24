import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import type { ComponentType } from "react"

import { AmazonSellerCommissionCalculator } from "@/components/site/calculators/accounting/amazon-seller-commission-calculator"
import { CashConversionCycleCalculator } from "@/components/site/calculators/accounting/cash-conversion-cycle-calculator"
import { DebtPayoffExtraPaymentsCalculator } from "@/components/site/calculators/accounting/debt-payoff-extra-payments-calculator"
import { DebtSnowballVsAvalancheCalculator } from "@/components/site/calculators/accounting/debt-snowball-vs-avalanche-calculator"
import { GrossUpPayrollCalculator } from "@/components/site/calculators/accounting/gross-up-payroll-calculator"
import { MarginalPropensityToConsumeCalculator } from "@/components/site/calculators/accounting/marginal-propensity-to-consume-calculator"
import { PayrollConversionCalculator } from "@/components/site/calculators/accounting/payroll-conversion-calculator"
import { PayrollOvertimeCalculator } from "@/components/site/calculators/accounting/payroll-overtime-calculator"
import { ProratedBonusCalculator } from "@/components/site/calculators/accounting/prorated-bonus-calculator"
import { RetainedEarningsCalculator } from "@/components/site/calculators/accounting/retained-earnings-calculator"
import { RetailProfitMarginCalculator } from "@/components/site/calculators/accounting/retail-profit-margin-calculator"
import { ReverseMarginCalculator } from "@/components/site/calculators/accounting/reverse-margin-calculator"
import { SalesCommissionCalculator } from "@/components/site/calculators/accounting/sales-commission-calculator"
import { SalespersonProfitabilityCalculator } from "@/components/site/calculators/accounting/salesperson-profitability-calculator"
import { WholesaleMarginCalculator } from "@/components/site/calculators/accounting/wholesale-margin-calculator"
import { CalculatorPage } from "@/components/site/calculators/calculator-page"
import {
  getAccountingCalculator,
  getAccountingGroupForCalculator,
} from "@/lib/calculators"
import {
  ACCOUNTING_DETAILS,
  ACCOUNTING_CANONICAL_SLUG_MAP,
  type AccountingSlug,
} from "@/lib/calculator-content/accounting"
import { calculatorMetadata } from "@/lib/calculator-content/metadata"

export const dynamicParams = false
export const revalidate = 300

export function generateStaticParams() {
  const allSlugs = Object.keys(ACCOUNTING_CANONICAL_SLUG_MAP)
  return allSlugs.map((slug) => ({ slug }))
}

const CALCULATOR_COMPONENTS: Record<AccountingSlug, ComponentType> = {
  "retail-profit-margin": RetailProfitMarginCalculator,
  "wholesale-margin": WholesaleMarginCalculator,
  "reverse-margin": ReverseMarginCalculator,
  "amazon-seller-commission": AmazonSellerCommissionCalculator,
  "salesperson-profitability": SalespersonProfitabilityCalculator,
  "payroll-with-overtime": PayrollOvertimeCalculator,
  "gross-up-payroll": GrossUpPayrollCalculator,
  "prorated-bonus": ProratedBonusCalculator,
  "sales-commission": SalesCommissionCalculator,
  "payroll-conversion": PayrollConversionCalculator,
  "retained-earnings": RetainedEarningsCalculator,
  "cash-conversion-cycle": CashConversionCycleCalculator,
  "debt-payoff-with-extra-payments": DebtPayoffExtraPaymentsCalculator,
  "debt-snowball-vs-avalanche": DebtSnowballVsAvalancheCalculator,
  "marginal-propensity-to-consume": MarginalPropensityToConsumeCalculator,
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const canonicalSlug = ACCOUNTING_CANONICAL_SLUG_MAP[slug]
  if (!canonicalSlug) return {}

  const entry = getAccountingCalculator(canonicalSlug)
  const detail = ACCOUNTING_DETAILS[canonicalSlug]
  if (!entry || !detail) return {}

  return calculatorMetadata(
    entry.name,
    detail.metaDescription,
    `/calculator/accounting/${canonicalSlug}/`
  )
}

export default async function AccountingCalculatorPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const canonicalSlug = ACCOUNTING_CANONICAL_SLUG_MAP[slug]
  if (!canonicalSlug) notFound()

  if (slug !== canonicalSlug) {
    permanentRedirect(`/calculator/accounting/${canonicalSlug}/`)
  }

  const entry = getAccountingCalculator(canonicalSlug)
  const detail = ACCOUNTING_DETAILS[canonicalSlug]
  if (!entry || !detail) notFound()

  const group = getAccountingGroupForCalculator(canonicalSlug)
  const Calculator = CALCULATOR_COMPONENTS[canonicalSlug]

  return (
    <CalculatorPage
      category={{ label: "Accounting", href: "/calculator/accounting/" }}
      group={group}
      entry={entry}
      detail={detail}
    >
      <Calculator />
    </CalculatorPage>
  )
}
