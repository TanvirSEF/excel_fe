import {
  IconApps,
  IconBolt,
  IconChartBar,
  IconChartDonut4,
  IconClockHour2,
  IconCode,
  IconFileInvoice,
  IconFileSpreadsheet,
  IconLayoutDashboard,
  IconPigMoney,
  IconScale,
  IconTimeline,
  IconTools,
  IconUsers,
  type TablerIcon,
} from "@tabler/icons-react"

export interface PricingCta {
  label: string
  href: string
}

export interface FreePlan {
  name: string
  tagline: string
  priceLabel: string
  unit: string
  features: string[]
  primaryCta: PricingCta
  secondaryCta: PricingCta
}

export type PaidPlanId =
  | "basic"
  | "premium"
  | "advanced"
  | "template-basic"
  | "template-premium"
  | "template-advanced"
  | "tool-professional"
  | "tool-advanced"

export interface PaidPlan {
  id: PaidPlanId
  name: string
  tagline: string
  priceLabel: string
  unit: string
  icon: TablerIcon
  popular: boolean
  ctaLabel: string
  features: string[]
}

export interface TemplatePreview {
  slug: string
  name: string
  description: string
  icon: TablerIcon
}

export const FREE_PLAN: FreePlan = {
  name: "Free Forever",
  tagline: "Everything on Excel Insider, free to read and use",
  priceLabel: "$0",
  unit: "forever",
  features: [
    "1,600+ tutorials & formula deep-dives",
    "100+ downloadable newsletter templates",
    "Weekly 3-minute tips & cheat sheet",
  ],
  primaryCta: { label: "Explore Free Tutorials", href: "/blog" },
  secondaryCta: { label: "Get Free Templates", href: "/pricing#templates" },
}

export const HELP_PLANS: PaidPlan[] = [
  {
    id: "basic",
    name: "Basic",
    tagline: "Perfect for quick fixes & small edits",
    priceLabel: "$19",
    unit: "one-time",
    icon: IconBolt,
    popular: false,
    ctaLabel: "Get Started",
    features: [
      "Up to 2 tasks",
      "Formula corrections",
      "Chart edits",
      "Delivery in 1–2 days",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "For custom features & sheet optimization",
    priceLabel: "$49",
    unit: "one-time",
    icon: IconChartBar,
    popular: true,
    ctaLabel: "Get Started",
    features: [
      "Up to 5 tasks",
      "Advanced formulas",
      "Sheet structuring",
      "Charts & visuals",
      "Delivery in 2–3 days",
    ],
  },
  {
    id: "advanced",
    name: "Advanced",
    tagline: "Best for complex automation & full templates",
    priceLabel: "$99+",
    unit: "per project",
    icon: IconCode,
    popular: false,
    ctaLabel: "Get Started",
    features: [
      "Unlimited tasks",
      "Macros & VBA (optional)",
      "Dynamic dashboards",
      "Google Sheets support",
      "Delivery in 3–5 days",
    ],
  },
]

export const TEMPLATE_PLANS: PaidPlan[] = [
  {
    id: "template-basic",
    name: "Basic",
    tagline: "Starter custom template",
    priceLabel: "$25+",
    unit: "one-time",
    icon: IconFileSpreadsheet,
    popular: false,
    ctaLabel: "Get Started",
    features: [
      "1 clean worksheet",
      "Basic formulas",
      "Organized layout",
      "Data validation",
      "1 revision",
      "Delivery in 2–3 days",
    ],
  },
  {
    id: "template-premium",
    name: "Premium",
    tagline: "Business-ready multi-sheet template",
    priceLabel: "$75+",
    unit: "one-time",
    icon: IconLayoutDashboard,
    popular: true,
    ctaLabel: "Get Started",
    features: [
      "2–4 interlinked sheets",
      "Formulas with smart logic",
      "Charts & dashboards",
      "Custom branding",
      "2 revisions",
      "Delivery in 4–5 days",
    ],
  },
  {
    id: "template-advanced",
    name: "Advanced",
    tagline: "Best for complex automation",
    priceLabel: "$175+",
    unit: "per project",
    icon: IconCode,
    popular: false,
    ctaLabel: "Get Started",
    features: [
      "Unlimited sheets & logic",
      "All advanced formulas",
      "Power Query / VBA / Pivot Tables",
      "Real-time data visualization",
      "5 revisions",
      "Delivery in 6–8 days",
    ],
  },
]

export const TOOL_PLANS: PaidPlan[] = [
  {
    id: "tool-professional",
    name: "Professional",
    tagline: "Custom spreadsheet tool",
    priceLabel: "$500+",
    unit: "per project",
    icon: IconTools,
    popular: true,
    ctaLabel: "Get Started",
    features: [
      "Complex Excel or Google Sheets tools",
      "Multi-sheet automation",
      "Advanced formulas, Power Query or VBA",
      "Interactive dashboards",
      "Custom branding (logos, colors)",
      "3 revisions",
      "Delivery in 7–10 days",
    ],
  },
  {
    id: "tool-advanced",
    name: "Advanced",
    tagline: "Google Workspace add-on / extension",
    priceLabel: "$1200+",
    unit: "per project",
    icon: IconApps,
    popular: false,
    ctaLabel: "Get Started",
    features: [
      "Fully functional Google Sheets/Docs add-on or Chrome extension",
      "Published on Google Workspace Marketplace (optional)",
      "API integrations & advanced automation",
      "User-friendly UI with custom menus & buttons",
      "Documentation & usage guide",
      "5 revisions",
      "Delivery in 15–20 days",
    ],
  },
]

export const FREE_TEMPLATES: TemplatePreview[] = [
  {
    slug: "budget-tracker",
    name: "Budget Tracker",
    description:
      "Monthly income, expense & savings categories with automatic rollups.",
    icon: IconPigMoney,
  },
  {
    slug: "invoice-generator",
    name: "Invoice Generator",
    description:
      "Professional invoices with auto-calculated tax, totals & balances.",
    icon: IconFileInvoice,
  },
  {
    slug: "project-gantt-timeline",
    name: "Project Gantt Timeline",
    description: "Enter start/end dates and the Gantt bars draw themselves.",
    icon: IconTimeline,
  },
  {
    slug: "kpi-dashboard",
    name: "KPI Dashboard",
    description:
      "One-page executive view of revenue, margin & growth metrics.",
    icon: IconLayoutDashboard,
  },
  {
    slug: "loan-amortization-schedule",
    name: "Loan Amortization Schedule",
    description:
      "Payment split into principal vs. interest with payoff date.",
    icon: IconScale,
  },
  {
    slug: "time-timesheet-tracker",
    name: "Time & Timesheet Tracker",
    description: "Log hours per project and bill clients without manual math.",
    icon: IconClockHour2,
  },
  {
    slug: "client-pipeline-crm",
    name: "Client Pipeline CRM",
    description: "Track leads, deal stages and next follow-up dates.",
    icon: IconUsers,
  },
  {
    slug: "monthly-sales-report",
    name: "Monthly Sales Report",
    description: "Sales breakdown by product, region & sales channel.",
    icon: IconChartDonut4,
  },
]
