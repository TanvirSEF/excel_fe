import {
  IconBuildingBank,
  IconCalendarTime,
  IconChartDots,
  IconCoin,
  IconPercentage,
  IconScale,
  IconTrendingUp,
  type TablerIcon,
} from "@tabler/icons-react"

export type CalculatorSlug =
  | "loan-emi"
  | "date-difference"
  | "cagr-calculator"
  | "profit-margin"
  | "compound-interest"
  | "pv-fv"
  | "npv-irr"

export interface CalculatorDefinition {
  slug: CalculatorSlug
  title: string
  shortTitle: string
  description: string
  metaDescription: string
  badge: string
  icon: TablerIcon
  formulaSnippet: string
  excelFunction: string
  excelTip: string
}

export const CALCULATORS: CalculatorDefinition[] = [
  {
    slug: "loan-emi",
    title: "Loan & EMI Amortization Calculator",
    shortTitle: "Loan & EMI",
    description:
      "Calculate monthly EMI payments, total interest breakdown, and generate printable principal amortization tables.",
    metaDescription:
      "Free loan & EMI calculator with monthly payment, total interest, amortization schedule and charts. See how the Excel PMT function works with real numbers.",
    badge: "Financial",
    icon: IconBuildingBank,
    formulaSnippet: "=PMT(rate/12, nper, -pv)",
    excelFunction: "PMT",
    excelTip: "In Excel, =PMT(10%/12, 60, -500000) returns the same monthly payment — payments are negative cash outflows, so the loan amount is negated.",
  },
  {
    slug: "date-difference",
    title: "Workday & Date Difference Calculator",
    shortTitle: "Date Difference",
    description:
      "Count exact working business days between two dates, automatically excluding weekends and regional public holidays.",
    metaDescription:
      "Calculate days, weeks, months and business working days between two dates. Mirrors Excel's NETWORKDAYS and DATEDIF functions with a live breakdown.",
    badge: "Date & Time",
    icon: IconCalendarTime,
    formulaSnippet: "=NETWORKDAYS(start, end, holidays)",
    excelFunction: "NETWORKDAYS",
    excelTip: "NETWORKDAYS counts start and end dates inclusively and skips Sat/Sun plus any holidays range you pass as the third argument.",
  },
  {
    slug: "cagr-calculator",
    title: "CAGR & Investment Growth Calculator",
    shortTitle: "CAGR & Growth",
    description:
      "Measure Compound Annual Growth Rate and projected multi-year returns for business revenue and investment assets.",
    metaDescription:
      "Compute Compound Annual Growth Rate (CAGR) between two values with a year-by-year growth projection table and chart. Excel formula =(End/Start)^(1/N)-1 explained.",
    badge: "Growth & Analytics",
    icon: IconTrendingUp,
    formulaSnippet: "=(End_Val / Start_Val)^(1/N) - 1",
    excelFunction: "POWER",
    excelTip: "Excel has no CAGR function — use =(End/Start)^(1/Years)-1, or RATE(Years, 0, -Start, End) which returns the same annual rate.",
  },
  {
    slug: "profit-margin",
    title: "Profit Margin & Markup Calculator",
    shortTitle: "Profit Margin",
    description:
      "Quickly compute gross profit margin percentage, cost markup multiplier, and target pricing revenue thresholds.",
    metaDescription:
      "Calculate gross profit margin, markup and required selling price from cost. Understand the difference between margin and pricing with Excel formulas.",
    badge: "Pricing & Sales",
    icon: IconPercentage,
    formulaSnippet: "Margin = (Price - Cost) / Price",
    excelFunction: "(Price-Cost)/Price",
    excelTip: "Margin and markup are not the same: a 40% margin equals a 66.7% markup. To price for a target margin use =Cost/(1-Margin).",
  },
  {
    slug: "compound-interest",
    title: "Compound Interest & Savings Growth Calculator",
    shortTitle: "Compound Interest",
    description:
      "Project savings growth with an initial deposit plus recurring monthly contributions, compounded every month.",
    metaDescription:
      "Free compound interest calculator with monthly contributions. See future value, total interest and a year-by-year growth table — the Excel FV function brought to life.",
    badge: "Financial",
    icon: IconCoin,
    formulaSnippet: "=FV(rate/12, nper, -pmt, -pv)",
    excelFunction: "FV",
    excelTip: "Excel's FV uses the same convention as this tool: end-of-period deposits. =FV(8%/12, 120, -500, -10000) grows $10k plus $500/month at 8% for 10 years.",
  },
  {
    slug: "pv-fv",
    title: "Present & Future Value Calculator",
    shortTitle: "PV & FV",
    description:
      "Convert between money today and money tomorrow — compound a present value forward or discount a future value back.",
    metaDescription:
      "Present value and future value calculator with discount factors and effective annual rate. Mirrors Excel's PV and FV functions for time-value-of-money math.",
    badge: "Financial",
    icon: IconScale,
    formulaSnippet: "FV = PV × (1 + r)^n",
    excelFunction: "PV / FV",
    excelTip: "=FV(8%, 10, 0, -10000) compounds $10,000 for 10 years; =PV(8%, 10, 0, 21589) discounts it back. The middle argument is the payment, zero for lump sums.",
  },
  {
    slug: "npv-irr",
    title: "NPV & IRR Calculator",
    shortTitle: "NPV & IRR",
    description:
      "Evaluate an investment from its cash flows — net present value at your discount rate and the internal rate of return.",
    metaDescription:
      "Calculate NPV and IRR from a series of yearly cash flows, with discounted and cumulative breakdowns. Matches Excel's NPV and IRR functions exactly.",
    badge: "Financial",
    icon: IconChartDots,
    formulaSnippet: "=NPV(rate, flows) - C0",
    excelFunction: "NPV / IRR",
    excelTip: "Excel's NPV discounts its first argument at t = 1, so the initial investment stays outside: =NPV(10%, B2:B5) - B1. =IRR(B1:B5) finds the rate where the whole series breaks even.",
  },
]

export const CALCULATOR_SLUGS = CALCULATORS.map((calc) => calc.slug)

export function getCalculator(slug: string): CalculatorDefinition | undefined {
  return CALCULATORS.find((calc) => calc.slug === slug)
}

export interface NumericInputOptions {
  min?: number
  max?: number
  integer?: boolean
}

export interface ParsedInput {
  value: number | null
  error: string | null
}

/** Parses free-text numeric input, tolerating thousands separators and currency signs. */
export function parseNumericInput(
  raw: string,
  { min, max, integer = false }: NumericInputOptions = {}
): ParsedInput {
  const cleaned = raw.replace(/[, $]/g, "").trim()
  if (cleaned === "") return { value: null, error: null }
  const value = Number(cleaned)
  if (!Number.isFinite(value)) return { value: null, error: "Enter a valid number" }
  if (integer && !Number.isInteger(value)) return { value: null, error: "Enter a whole number" }
  if (min !== undefined && value < min)
    return { value: null, error: `Must be ${min} or more` }
  if (max !== undefined && value > max)
    return { value: null, error: `Must be ${max} or less` }
  return { value, error: null }
}
