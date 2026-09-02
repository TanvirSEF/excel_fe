import { IconChevronDown } from "@tabler/icons-react"

const FAQS = [
  {
    question: "Is everything on Excel Insider really free?",
    answer:
      "Yes. All 1,600+ tutorials, the interactive calculators and the newsletter templates are completely free to read, copy and use for personal or commercial projects — with no paywall and no account required.",
  },
  {
    question: "How much does a custom template or dashboard cost?",
    answer:
      "Simple trackers start at $149. Multi-sheet executive dashboards and financial models are quoted by scope — you always get a fixed, upfront quote before any work starts, so there are no surprises.",
  },
  {
    question: "How is VBA or Apps Script automation priced?",
    answer:
      "Automation projects start at $199 and scale with complexity. Tell us what the tool should do through the contact form, we scope it together, and nothing is billed until you agree on the scope and the quote.",
  },
  {
    question: "How does consulting work?",
    answer:
      "Consulting runs from $45 per hour. Send us the broken formula, the slow workbook or the model you are stuck on — we troubleshoot asynchronously or walk you through the fix live, usually within 24–48 hours.",
  },
  {
    question: "Do I need coding knowledge to use your templates?",
    answer:
      "No. Templates are built with native Excel formulas and clear instructions. When a custom tool does include VBA or Apps Script, it ships with setup documentation so you only ever press a button.",
  },
  {
    question: "How do I download the free templates?",
    answer:
      "Join the free newsletter below — you get the 50+ Essential Excel Formulas cheat sheet PDF instantly, then a practical template or shortcut every Tuesday. Unsubscribe in one click, keep everything you downloaded.",
  },
]

export function PricingFaq() {
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
