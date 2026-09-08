import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { ComponentType } from "react"
import { IconChevronDown } from "@tabler/icons-react"

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
import { Breadcrumb } from "@/components/site/breadcrumb"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  FINANCE_CALCULATORS,
  getFinanceCalculator,
  getFinanceGroupForCalculator,
} from "@/lib/calculators"
import { FINANCE_DETAILS, type FinanceSlug } from "@/lib/finance-calculator-details"

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

  return {
    title: `${entry.name} | Excel Insider`,
    description: detail.metaDescription,
    alternates: { canonical: `/calculators/finance/${slug}` },
    openGraph: {
      title: `${entry.name} | Excel Insider`,
      description: detail.metaDescription,
      url: `/calculators/finance/${slug}`,
      images: ["/og-default.png"],
    },
  }
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
  const GroupIcon = group.icon
  const Calculator = CALCULATOR_COMPONENTS[slug as FinanceSlug]

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Calculators" },
          { label: "Finance", href: "/calculators/finance" },
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

        <div className="mt-6 rounded-xl border border-border/70 bg-muted/30 p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {detail.example.title}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground/85">
            {detail.example.body}
          </p>
        </div>

        {detail.method ? (
          <div className="mt-6 rounded-xl border border-primary/25 bg-primary/5 p-4 sm:p-5">
            <h3 className="text-sm font-bold tracking-tight text-foreground">
              {detail.method.title}
            </h3>
            {detail.method.paragraphs ? (
              <div className="mt-2 space-y-2.5">
                {detail.method.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="text-sm leading-relaxed text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : null}
            {detail.method.equations ? (
              <div className="mt-4 space-y-3">
                {detail.method.equations.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-border/70 bg-background/60 p-3.5"
                  >
                    <p className="text-sm font-bold tracking-tight text-foreground">
                      {item.label}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      {item.note}
                    </p>
                    <p className="mt-2 rounded-lg border border-primary/20 bg-background px-3 py-2 font-mono text-sm leading-relaxed text-foreground">
                      {item.equation}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
            {detail.method.formula ? (
              <p className="mt-3 rounded-lg border border-primary/20 bg-background/60 px-3.5 py-2.5 font-mono text-sm text-foreground">
                {detail.method.formula}
              </p>
            ) : null}
          </div>
        ) : null}

        {detail.parameters ? (
          <div className="mt-6">
            <h3 className="text-lg font-bold tracking-tight text-foreground">
              {detail.parameters.title}
            </h3>
            {detail.parameters.intro ? (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {detail.parameters.intro}
              </p>
            ) : null}
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {detail.parameters.items.map((item) => (
                <div
                  key={item.name}
                  className="rounded-xl border border-border/70 bg-muted/20 p-4"
                >
                  <dt className="text-sm font-bold tracking-tight text-foreground">
                    {item.name}
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}

        {detail.facts && detail.facts.length > 0 ? (
          <div className="mt-8 border-t border-border/60 pt-8">
            {detail.factsTitle ? (
              <h3 className="text-lg font-bold tracking-tight text-foreground">
                {detail.factsTitle}
              </h3>
            ) : null}
            {detail.factsIntro ? (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {detail.factsIntro}
              </p>
            ) : null}
            <div className="mt-4 space-y-3">
              {detail.facts.map((fact) => (
                <div
                  key={fact.title}
                  className="rounded-xl border border-border/70 bg-muted/20 p-4"
                >
                  <p className="text-sm font-bold tracking-tight text-foreground">
                    {fact.title}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {fact.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {detail.factsTable ? (
          <div className="mt-6 rounded-xl border border-border/70 bg-muted/20 p-4 sm:p-5">
            <p className="text-sm font-bold tracking-tight text-foreground">
              {detail.factsTable.title}
            </p>
            <div className="mt-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    {detail.factsTable.headers.map((header) => (
                      <TableHead key={header}>{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detail.factsTable.rows.map((row) => (
                    <TableRow key={row.join("|")}>
                      {row.map((cell, cellIndex) => (
                        <TableCell
                          key={cell}
                          className={cellIndex === row.length - 1 ? "whitespace-normal" : "font-medium"}
                        >
                          {cell}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : null}

        {detail.useCases && detail.useCases.length > 0 ? (
          <div className="mt-8 border-t border-border/60 pt-8">
            <h3 className="text-lg font-bold tracking-tight text-foreground">
              When to use this calculator
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {detail.useCases.map((useCase) => (
                <div
                  key={useCase.title}
                  className="rounded-xl border border-primary/40 bg-card p-4 shadow-2xs"
                >
                  <p className="text-sm font-bold tracking-tight text-primary">
                    {useCase.title}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {useCase.body}
                  </p>
                </div>
              ))}
            </div>
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

        {detail.faqs && detail.faqs.length > 0 ? (
          <div className="mt-8 space-y-4 border-t border-border/60 pt-8">
            <h3 className="text-lg font-bold tracking-tight text-foreground">
              Frequently asked questions
            </h3>
            {detail.faqs.map((faq, index) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-primary/40 bg-muted/20 p-5 transition-all duration-200 open:border-primary/70 hover:border-primary/60"
                {...(index === 0 ? { open: true } : {})}
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold text-foreground transition-colors group-open:text-primary hover:text-primary">
                  <span className="text-sm sm:text-base">{faq.question}</span>
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-transform duration-200 group-open:rotate-180 group-open:bg-primary/10 group-open:text-primary">
                    <IconChevronDown className="h-4 w-4" />
                  </div>
                </summary>
                <p className="mt-3.5 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  )
}
