"use client"

import { useState } from "react"
import { IconChevronDown } from "@tabler/icons-react"
import { SectionHeading } from "@/components/site/section-heading"

const FAQS = [
  {
    question: "Are all the formulas, tutorials, and templates completely free?",
    answer:
      "Yes! The vast majority of our tutorials, formula breakdowns, and foundational spreadsheet templates are 100% free to read, copy, and use for personal or commercial projects with no paywall.",
  },
  {
    question: "Do your guides work on both Microsoft Excel and Google Sheets?",
    answer:
      "Absolutely. Every tutorial clearly indicates version compatibility across Microsoft Excel (Excel 365, 2021, 2019) and Google Sheets. When functions differ (such as XLOOKUP vs VLOOKUP or Google Sheets QUERY), we provide dedicated syntax for both platforms.",
  },
  {
    question: "How does the Custom Spreadsheet & Consulting service work?",
    answer:
      "If you have a broken workbook, need custom financial modeling, or require VBA/Apps Script automation, simply submit your request via our Contact page. Our experts will evaluate your requirements, provide an upfront quote, and deliver a clean, tested solution.",
  },
  {
    question: "Do I need coding or VBA knowledge to use the downloadable templates?",
    answer:
      "No coding knowledge is necessary. All our standard business templates and financial models use native spreadsheet formulas and intuitive data input sheets with clean instructions. For specialized automation tools that use VBA macros, full setup documentation is provided.",
  },
  {
    question: "How frequently is new content published on Excel Insider?",
    answer:
      "We publish multiple comprehensive guides, formula deep-dives, and downloadable business templates every week, constantly updating our library to reflect the newest Excel 365 and Google Sheets capabilities.",
  },
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <section className="py-12 sm:py-16">
      <SectionHeading
        badge="Got Questions?"
        title="Frequently Asked Questions"
        subtitle="Find quick answers to common questions about our tutorials, formula compatibility, and custom spreadsheet services."
        action={{ label: "Ask a question", href: "/contact" }}
      />

      <div className="mx-auto max-w-4xl space-y-4">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index
          return (
            <div
              key={faq.question}
              className={`rounded-2xl border bg-card p-5 transition-all duration-200 ${
                isOpen
                  ? "border-primary/70 shadow-xs"
                  : "border-primary/40 shadow-2xs hover:border-primary/60"
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                className="flex w-full cursor-pointer items-center justify-between gap-4 text-left font-semibold text-foreground transition-colors hover:text-primary"
              >
                <span className={`text-base sm:text-lg transition-colors ${isOpen ? "text-primary" : ""}`}>
                  {faq.question}
                </span>
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted transition-all duration-200 ${
                    isOpen
                      ? "rotate-180 bg-primary/10 text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <IconChevronDown className="h-4 w-4" />
                </div>
              </button>
              <div
                className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="pt-3.5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
