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
import { Breadcrumb } from "@/components/site/breadcrumb"
import {
  ACCOUNTING_CALCULATORS,
  getAccountingCalculator,
  getAccountingGroupForCalculator,
} from "@/lib/calculators"
import { ACCOUNTING_DETAILS, type AccountingSlug } from "@/lib/accounting-calculator-details"

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

  return {
    title: `${entry.name} | Excel Insider`,
    description: detail.metaDescription,
    alternates: { canonical: `/calculators/accounting/${slug}` },
    openGraph: {
      title: `${entry.name} | Excel Insider`,
      description: detail.metaDescription,
      url: `/calculators/accounting/${slug}`,
      images: ["/og-default.png"],
    },
  }
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
  const GroupIcon = group.icon
  const Calculator = CALCULATOR_COMPONENTS[slug as AccountingSlug]

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Calculators" },
          { label: "Accounting", href: "/calculators/accounting" },
          { label: entry.name },
        ]}
      />

      <header className="mt-6 max-w-3xl space-y-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${group.accent}`}
          >
            <GroupIcon className="h-[22px] w-[22px]" />
          </div>
          <span className="rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-semibold text-primary">
            {group.title}
          </span>
        </div>
        <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {entry.name}
        </h1>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          {entry.whatItIs}
        </p>
        <div className="flex items-start gap-2 rounded-xl border border-primary/15 bg-primary/5 px-4 py-3">
          <p className="text-sm leading-relaxed text-foreground/85">
            {entry.whatToExpect}
          </p>
        </div>
      </header>

      <div className="mt-10">
        <Calculator />
      </div>

      <section className="mt-12 rounded-2xl border border-primary/50 bg-card p-6 shadow-2xs sm:p-8">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          About this calculator
        </h2>

        <div className="mt-5 space-y-3">
          {detail.whenToUse.map((paragraph) => (
            <p
              key={paragraph.slice(0, 40)}
              className="text-sm leading-relaxed text-muted-foreground sm:text-base"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Formula
          </p>
          <p className="mt-1.5 font-mono text-sm leading-relaxed text-foreground">
            {detail.formula}
          </p>
        </div>

        {detail.howToUse ? (
          <>
            <h3 className="mt-6 text-sm font-bold uppercase tracking-wider text-foreground">
              How to use it
            </h3>
            <ol className="mt-3 space-y-2.5">
              {detail.howToUse.map((step, index) => (
                <li key={step.slice(0, 40)} className="flex gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-foreground/85">{step}</p>
                </li>
              ))}
            </ol>
          </>
        ) : null}

        {detail.example ? (
          <div className="mt-6 rounded-xl border border-border/70 bg-muted/30 p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {detail.example.title}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/85">
              {detail.example.body}
            </p>
          </div>
        ) : null}

        {detail.excelNote ? (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-primary/15 bg-primary/5 p-4">
            <p className="text-sm leading-relaxed text-foreground/85">
              <span className="font-semibold text-primary">In Excel: </span>
              {detail.excelNote}
            </p>
          </div>
        ) : null}
      </section>
    </div>
  )
}
