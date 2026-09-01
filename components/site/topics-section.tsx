import Link from "next/link"
import {
  IconArrowRight,
  IconChartBar,
  IconCode,
  IconMathFunction,
  IconReportMoney,
  IconTable,
  IconTools,
} from "@tabler/icons-react"

import type { Category } from "@/types/api"
import { SectionHeading } from "@/components/site/section-heading"

interface TopicsSectionProps {
  categories: Category[]
}

const DEFAULT_TOPICS = [
  {
    title: "Excel Formulas & Functions",
    slug: "excel-functions-formulas",
    description:
      "Master modern dynamic formulas from XLOOKUP, INDEX/MATCH to advanced LAMBDA and array calculations.",
    icon: IconMathFunction,
    badge: "500+ Guides",
    accentColor: "from-emerald-500/15 to-emerald-500/5",
  },
  {
    title: "VBA, Macros & Automation",
    slug: "excel-vba",
    description:
      "Automate repetitive daily tasks, build custom functions, and write fast, production-ready spreadsheet macros.",
    icon: IconCode,
    badge: "300+ Tutorials",
    accentColor: "from-teal-500/15 to-teal-500/5",
  },
  {
    title: "Dashboards & Visualizations",
    slug: "excel-pivot-table",
    description:
      "Design executive-ready KPI summary cards, interactive Pivot Tables, and dynamic presentation charts.",
    icon: IconChartBar,
    badge: "250+ Models",
    accentColor: "from-emerald-600/15 to-emerald-600/5",
  },
  {
    title: "Google Sheets & Apps Script",
    slug: "google-sheets-basics",
    description:
      "Harness the power of cloud spreadsheets with QUERY, IMPORTRANGE, and custom Apps Script automations.",
    icon: IconTable,
    badge: "200+ Guides",
    accentColor: "from-sky-500/15 to-sky-500/5",
  },
  {
    title: "Financial Modeling & Budgeting",
    slug: "excel-for-finance",
    description:
      "Build valuation models, 3-statement forecasts, cash flow analyses, and automated budget trackers.",
    icon: IconReportMoney,
    badge: "150+ Templates",
    accentColor: "from-amber-500/15 to-amber-500/5",
  },
  {
    title: "Calculators & Free Tools",
    slug: "calculators",
    description:
      "Access instant interactive spreadsheet calculators for loans, dates, percentages, and financial metrics.",
    icon: IconTools,
    badge: "Interactive",
    accentColor: "from-indigo-500/15 to-indigo-500/5",
    customHref: "/calculators",
  },
]

export function TopicsSection({ categories }: TopicsSectionProps) {
  // Merge live categories if available, or use the curated topic tracks
  const topics = DEFAULT_TOPICS.map((defaultTopic) => {
    const matched = categories.find(
      (c) =>
        c.slug.toLowerCase().includes(defaultTopic.slug) ||
        defaultTopic.slug.includes(c.slug.toLowerCase())
    )
    return {
      ...defaultTopic,
      href: defaultTopic.customHref ?? (matched ? `/categories/${matched.slug}` : `/blog`),
    }
  })

  return (
    <section className="py-12 sm:py-16">
      <SectionHeading
        badge="Structured Learning"
        title="Explore by Core Pillar"
        subtitle="Choose a specialized learning track to quickly find the exact tutorials, formulas, and templates you need."
        action={{ label: "Browse all topics", href: "/blog" }}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => {
          const Icon = topic.icon
          return (
            <Link
              key={topic.title}
              href={topic.href}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
            >
              <div className="space-y-4">
                {/* Header Row: Icon + Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full border border-border/80 bg-muted/60 px-3 py-1 text-xs font-semibold text-muted-foreground">
                    {topic.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
                  {topic.title}
                </h3>

                {/* Description */}
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {topic.description}
                </p>
              </div>

              {/* Bottom Action Indicator */}
              <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-primary">
                <span>Explore category</span>
                <IconArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
