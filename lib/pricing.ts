import {
  IconChartDonut4,
  IconClockHour2,
  IconCode,
  IconFileInvoice,
  IconFileSpreadsheet,
  IconLayoutDashboard,
  IconPigMoney,
  IconScale,
  IconTimeline,
  IconUserCheck,
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
  | "custom-template"
  | "automation"
  | "consulting"

export interface PaidPlan {
  id: PaidPlanId
  name: string
  tagline: string
  priceLabel: string
  unit: string
  icon: TablerIcon
  popular: boolean
  cta: PricingCta
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
    "All 7 interactive calculators",
    "100+ downloadable newsletter templates",
    "Weekly 3-minute tips & cheat sheet",
  ],
  primaryCta: { label: "Explore Free Tutorials", href: "/blog" },
  secondaryCta: { label: "Try the Calculators", href: "/calculators" },
}

export const PAID_PLANS: PaidPlan[] = [
  {
    id: "custom-template",
    name: "Custom Templates",
    tagline: "Bespoke dashboards & financial models",
    priceLabel: "from $149",
    unit: "per template",
    icon: IconFileSpreadsheet,
    popular: true,
    cta: {
      label: "Order Custom Template",
      href: "/contact?service=custom-template",
    },
    features: [
      "Executive KPI & revenue dashboards",
      "Automated budgeting & financial models",
      "Interactive Pivot Tables & smart slicers",
      "Brand colors, clean layout & setup docs included",
    ],
  },
  {
    id: "automation",
    name: "Custom Spreadsheet Tools",
    tagline: "VBA macros, Apps Script & automations",
    priceLabel: "from $199",
    unit: "per project",
    icon: IconCode,
    popular: false,
    cta: {
      label: "Build Custom Tool",
      href: "/contact?service=automation",
    },
    features: [
      "One-click VBA macro automations",
      "Google Apps Script & API integrations",
      "Multi-sheet data consolidation pipelines",
      "Scheduled reports & email automations",
    ],
  },
  {
    id: "consulting",
    name: "Services & Solutions",
    tagline: "Expert consulting, troubleshooting & optimization",
    priceLabel: "from $45",
    unit: "per hour",
    icon: IconUserCheck,
    popular: false,
    cta: {
      label: "Request Solution",
      href: "/contact?service=troubleshooting",
    },
    features: [
      "Fix #VALUE!, #N/A & circular reference errors",
      "Optimize heavy & laggy workbooks",
      "Advanced lookup & dynamic array models",
      "Async reviews or live walkthrough sessions",
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
