import { IconChevronDown } from "@tabler/icons-react"

const FAQS = [
  {
    question: "Are these calculators really free to use?",
    answer:
      "Yes — every calculator on Excel Insider is completely free, runs entirely in your browser, and needs no account or signup. Nothing you type is sent to a server.",
  },
  {
    question: "How do the calculators relate to Excel formulas?",
    answer:
      "Each tool is a live implementation of the Excel function it teaches. The Loan & EMI calculator mirrors PMT, the date tool mirrors NETWORKDAYS and DATEDIF, and the CAGR tool shows the (End/Start)^(1/N)-1 pattern — so you can verify your worksheet formulas against known-correct numbers.",
  },
  {
    question: "Can I copy the results into my spreadsheet?",
    answer:
      "Absolutely. Amortization and projection tables have a Copy for Excel button that puts the whole table on your clipboard as tab-separated values — paste it straight into a worksheet and it lands in the right cells.",
  },
  {
    question: "Do the results match what Excel would calculate?",
    answer:
      "Yes. We use the same standard financial formulas (fixed-rate amortization, NETWORKDAYS-style business-day counting) and verify our outputs against Excel's own functions. Tiny cent-level differences can appear from rounding conventions, but the methods are identical.",
  },
  {
    question: "Which currency and date conventions do you use?",
    answer:
      "Amounts are shown in US dollars and business days assume a Monday–Friday workweek with Saturday/Sunday weekends. To exclude public holidays, enter the number of holiday dates that fall on weekdays inside your range.",
  },
]

export function CalculatorsFaq() {
  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {FAQS.map((faq, index) => (
        <details
          key={faq.question}
          className="group rounded-2xl border border-border/80 bg-card p-5 shadow-2xs transition-all duration-200 open:border-primary/40 open:shadow-xs hover:border-border"
          {...(index === 0 ? { open: true } : {})}
        >
          <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold text-foreground transition-colors group-open:text-primary hover:text-primary">
            <span className="text-base sm:text-lg">{faq.question}</span>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-transform duration-200 group-open:rotate-180 group-open:bg-primary/10 group-open:text-primary">
              <IconChevronDown className="h-4 w-4" />
            </div>
          </summary>
          <p className="mt-3.5 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {faq.answer}
          </p>
        </details>
      ))}
    </div>
  )
}
