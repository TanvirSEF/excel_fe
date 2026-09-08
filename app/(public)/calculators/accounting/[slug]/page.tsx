import type { Metadata } from "next"
import { notFound } from "next/navigation"
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
  ACCOUNTING_CALCULATORS,
  getAccountingCalculator,
  getAccountingGroupForCalculator,
} from "@/lib/calculators"
import { ACCOUNTING_DETAILS, type AccountingSlug } from "@/lib/calculator-content/accounting"
import { calculatorMetadata } from "@/lib/calculator-content/metadata"

export const dynamicParams = false
export const revalidate = 300

export function generateStaticParams() {
  return ACCOUNTING_CALCULATORS.map((calculator) => ({ slug: calculator.slug }))
}

const CALCULATOR_COMPONENTS: Record<AccountingSlug, ComponentType> = {
  "retail-profit-margin-calculator": RetailProfitMarginCalculator,
  "wholesale-margin-calculator": WholesaleMarginCalculator,
  "reverse-margin-calculator": ReverseMarginCalculator,
  "amazon-seller-commission-calculator": AmazonSellerCommissionCalculator,
  "salesperson-profitability-calculator": SalespersonProfitabilityCalculator,
  "payroll-overtime-calculator": PayrollOvertimeCalculator,
  "gross-up-payroll-calculator": GrossUpPayrollCalculator,
  "prorated-bonus-calculator": ProratedBonusCalculator,
  "sales-commission-calculator": SalesCommissionCalculator,
  "payroll-conversion-calculator": PayrollConversionCalculator,
  "retained-earnings-calculator": RetainedEarningsCalculator,
  "cash-conversion-cycle-calculator": CashConversionCycleCalculator,
  "debt-payoff-extra-payments-calculator": DebtPayoffExtraPaymentsCalculator,
  "debt-snowball-vs-avalanche-calculator": DebtSnowballVsAvalancheCalculator,
  "marginal-propensity-to-consume-calculator": MarginalPropensityToConsumeCalculator,
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const entry = getAccountingCalculator(slug)
  const detail = ACCOUNTING_DETAILS[slug as AccountingSlug]
  if (!entry || !detail) return {}

  return calculatorMetadata(
    entry.name,
    detail.metaDescription,
    `/calculators/accounting/${slug}`
  )
}

export default async function AccountingCalculatorPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const entry = getAccountingCalculator(slug)
  const detail = ACCOUNTING_DETAILS[slug as AccountingSlug]
  if (!entry || !detail) notFound()

  const group = getAccountingGroupForCalculator(slug)
  const Calculator = CALCULATOR_COMPONENTS[slug as AccountingSlug]

  return (
    <CalculatorPage
      category={{ label: "Accounting", href: "/calculators/accounting" }}
      group={group}
      entry={entry}
      detail={detail}
    >
      <Calculator />
    </CalculatorPage>
  )
}
