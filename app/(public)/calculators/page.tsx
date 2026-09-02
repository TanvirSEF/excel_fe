import type { Metadata } from "next"
import Link from "next/link"
import {
  IconArrowRight,
  IconBolt,
  IconMathFunction,
  IconShieldCheck,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { CalculatorCard } from "@/components/site/calculators/calculator-card"
import { CalculatorsFaq } from "@/components/site/calculators/calculators-faq"
import { SectionHeading } from "@/components/site/section-heading"
import { CALCULATORS } from "@/lib/calculators"

export const metadata: Metadata = {
  title: "Free Interactive Excel Calculators | Excel Insider",
  description:
    "Free browser-based calculators for loan EMI & amortization, workday date differences, CAGR investment growth, and profit margin & markup — each tied to the Excel formula it teaches.",
  alternates: { canonical: "/calculators" },
  openGraph: {
    title: "Free Interactive Excel Calculators | Excel Insider",
    description:
      "Loan EMI, business days, CAGR and profit margin calculators — free, instant, and paired with the Excel formulas behind them.",
    url: "/calculators",
    images: ["/og-default.png"],
  },
}

const TRUST_ITEMS = [
  {
    icon: IconBolt,
    title: "Instant & In-Browser",
    description:
      "Every keystroke recalculates live — no page reloads, no waiting, no server round-trips.",
  },
  {
    icon: IconShieldCheck,
    title: "No Signup, No Data Sent",
    description:
      "Tools run fully in your browser. Nothing you type leaves your device or gets stored.",
  },
  {
    icon: IconMathFunction,
    title: "Paired With Excel Formulas",
    description:
      "Each tool shows the exact PMT, NETWORKDAYS or POWER formula behind it so you can rebuild it in a worksheet.",
  },
]

export default function CalculatorsPage() {
  return (
    <>
      <section className="relative w-full overflow-hidden bg-gradient-to-bl from-chart-2 via-primary to-chart-5">
        <div
          aria-hidden
          className="absolute -top-24 right-[10%] h-72 w-72 rounded-full bg-teal-300/12 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute bottom-0 left-[5%] h-64 w-64 rounded-full bg-white/8 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-bl from-white/8 via-transparent to-transparent"
        />

        <div className="relative mx-auto w-full max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-3 py-1 text-xs font-semibold text-primary-foreground/90 backdrop-blur-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground/80" />
            Free Tools · No Signup
          </span>

          <h1 className="mx-auto mt-5 max-w-3xl text-balance text-3xl font-bold leading-tight tracking-tight text-primary-foreground sm:text-5xl">
            Interactive Calculators for{" "}
            <span className="text-teal-300">Spreadsheet People</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
            Loan payments, business days, growth rates and pricing margins —
            computed instantly in your browser, with the Excel formula behind
            every result.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              <a href="#tools">
                Browse the tools
                <IconArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-primary-foreground/35 bg-primary-foreground/5 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link href="/blog">Read the tutorials</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <section id="tools" className="scroll-mt-20 py-14 sm:py-18">
          <SectionHeading
            badge="4 Free Tools"
            title="Pick a calculator"
            subtitle="Every tool recalculates as you type and pairs its numbers with the worksheet formula that produces them."
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {CALCULATORS.map((calculator) => (
              <CalculatorCard key={calculator.slug} calculator={calculator} />
            ))}
          </div>
        </section>

        <section className="border-t border-border/60 py-14 sm:py-18">
          <div className="grid gap-5 sm:grid-cols-3">
            {TRUST_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border/80 bg-card p-6 shadow-2xs"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                    <Icon className="h-[22px] w-[22px]" />
                  </div>
                  <h3 className="mt-4 text-base font-bold tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        <section className="border-t border-border/60 py-14 sm:py-18">
          <SectionHeading
            badge="Got Questions?"
            title="Calculator FAQs"
            subtitle="How the tools work, how they match Excel, and what conventions they follow."
          />
          <CalculatorsFaq />
        </section>

        <section className="pb-14 pt-2 sm:pb-18">
          <div className="rounded-3xl bg-gradient-to-bl from-chart-2 via-primary to-chart-5 px-6 py-12 text-center shadow-xl sm:py-16">
            <h2 className="mx-auto max-w-2xl text-balance text-2xl font-bold tracking-tight text-primary-foreground sm:text-3xl">
              Want the full walkthrough, not just the number?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
              Our tutorials break down PMT, NETWORKDAYS, growth modeling and
              pricing math step by step — with practice workbooks included.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                <Link href="/blog">
                  Explore the blog
                  <IconArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-primary-foreground/35 bg-primary-foreground/5 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link href="/contact">Request a tool</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
