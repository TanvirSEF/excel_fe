import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { Breadcrumb } from "@/components/site/breadcrumb"
import { CagrCalculator } from "@/components/site/calculators/cagr-calculator"
import { CompoundInterestCalculator } from "@/components/site/calculators/compound-interest-calculator"
import { DateDifferenceCalculator } from "@/components/site/calculators/date-difference-calculator"
import { LoanEmiCalculator } from "@/components/site/calculators/loan-emi-calculator"
import { NpvIrrCalculator } from "@/components/site/calculators/npv-irr-calculator"
import { ProfitMarginCalculator } from "@/components/site/calculators/profit-margin-calculator"
import { PvFvCalculator } from "@/components/site/calculators/pv-fv-calculator"
import {
  CALCULATOR_SLUGS,
  getCalculator,
  type CalculatorSlug,
} from "@/lib/calculators"

export const dynamicParams = false

export function generateStaticParams() {
  return CALCULATOR_SLUGS.map((slug) => ({ slug }))
}

const CALCULATOR_COMPONENTS: Record<
  CalculatorSlug,
  React.ComponentType
> = {
  "loan-emi": LoanEmiCalculator,
  "date-difference": DateDifferenceCalculator,
  "cagr-calculator": CagrCalculator,
  "profit-margin": ProfitMarginCalculator,
  "compound-interest": CompoundInterestCalculator,
  "pv-fv": PvFvCalculator,
  "npv-irr": NpvIrrCalculator,
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const calculator = getCalculator(slug)
  if (!calculator) return {}

  return {
    title: `${calculator.title} | Excel Insider`,
    description: calculator.metaDescription,
    alternates: { canonical: `/calculators/${calculator.slug}` },
    openGraph: {
      title: `${calculator.title} | Excel Insider`,
      description: calculator.metaDescription,
      url: `/calculators/${calculator.slug}`,
      images: ["/og-default.png"],
    },
  }
}

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const calculator = getCalculator(slug)
  if (!calculator) notFound()

  const Icon = calculator.icon
  const Calculator = CALCULATOR_COMPONENTS[calculator.slug]

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Calculators", href: "/calculators" },
          { label: calculator.shortTitle },
        ]}
      />

      <header className="mt-6 max-w-3xl space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
            <Icon className="h-[22px] w-[22px]" />
          </div>
          <span className="rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-semibold text-primary">
            {calculator.badge}
          </span>
        </div>

        <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {calculator.title}
        </h1>

        <p className="text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          {calculator.description}
        </p>

        <div className="rounded-xl border border-border/70 bg-muted/40 px-4 py-3 font-mono text-xs text-foreground/85 sm:text-sm">
          <span className="font-semibold text-primary">fx </span>
          <span>{calculator.formulaSnippet}</span>
        </div>
      </header>

      <div className="mt-10">
        <Calculator />
      </div>

      <section className="mt-12 rounded-2xl border border-border/80 bg-card p-6 shadow-2xs">
        <h2 className="text-base font-bold tracking-tight text-foreground">
          How this maps to Excel
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {calculator.excelTip}
        </p>
      </section>
    </div>
  )
}
