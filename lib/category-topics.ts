import type { TablerIcon } from "@tabler/icons-react"
import {
  IconAdjustments,
  IconBolt,
  IconBrandGoogle,
  IconBrandOffice,
  IconBulb,
  IconChartBar,
  IconChartHistogram,
  IconCode,
  IconFolder,
  IconMathFunction,
  IconTable,
} from "@tabler/icons-react"

import type { Category } from "@/types/api"

export interface CuratedTopic {
  name: string
  slug: string
  description: string
  icon: TablerIcon
}

export interface PlatformGroup {
  id: string
  platform: "excel" | "google" | "other"
  title: string
  badge: string
  description: string
  icon: TablerIcon
  accentColor: "emerald" | "teal" | "blue"
  items: DisplayCategory[]
}

export interface DisplayCategory {
  id: string
  name: string
  slug: string
  description: string
  icon: TablerIcon
  colorHex?: string | null
  children?: { id: string; name: string; slug?: string }[]
  articleCount?: number
}

export const EXCEL_CURATED_TOPICS: CuratedTopic[] = [
  {
    name: "Functions & Formulas",
    slug: "excel-functions-formulas",
    description: "VLOOKUP, XLOOKUP, INDEX MATCH, LAMBDA & logical calculations",
    icon: IconMathFunction,
  },
  {
    name: "Advanced Excel",
    slug: "advanced-excel",
    description: "Dynamic arrays, complex modeling, financial formulas & nested logic",
    icon: IconTable,
  },
  {
    name: "Excel VBA & Macros",
    slug: "excel-vba",
    description: "Automation scripts, procedures, user forms & custom functions",
    icon: IconCode,
  },
  {
    name: "Excel Pivot Tables",
    slug: "excel-pivot-table",
    description: "Summary reports, multi-table slicers, calculated fields & data models",
    icon: IconChartBar,
  },
  {
    name: "Excel Charts & Visuals",
    slug: "excel-charts",
    description: "Executive dashboards, dynamic chart ranges & visualization tricks",
    icon: IconChartHistogram,
  },
  {
    name: "Excel Pro Tips & Tricks",
    slug: "excel-pro-tips",
    description: "Productivity shortcuts, interface hacks & spreadsheet best practices",
    icon: IconBolt,
  },
]

export const GOOGLE_CURATED_TOPICS: CuratedTopic[] = [
  {
    name: "Google Sheets Basics",
    slug: "google-sheets-basics",
    description: "Interface fundamentals, cloud collaboration & core setup",
    icon: IconBulb,
  },
  {
    name: "Google Sheets Functions",
    slug: "google-sheets-functions",
    description: "FILTER, SORT, UNIQUE, SPLIT & live web data functions",
    icon: IconTable,
  },
  {
    name: "Google Sheets Formulas",
    slug: "google-sheets-formulas",
    description: "QUERY syntax, ARRAYFORMULA, IMPORTRANGE & regex formulas",
    icon: IconMathFunction,
  },
  {
    name: "Google Sheets Intermediate Tutorial",
    slug: "google-sheets-intermediate-tutorials",
    description: "Data cleaning, Pivot tables, dropdown validations & conditional styling",
    icon: IconAdjustments,
  },
  {
    name: "Google Sheets Charts",
    slug: "charts-in-google-sheets",
    description: "Interactive cloud charts, team dashboards & embedded sparklines",
    icon: IconChartBar,
  },
  {
    name: "Google Sheets Advanced Tutorial",
    slug: "google-sheets-advanced-tutorials",
    description: "Apps Script automation, webhook APIs & cloud spreadsheet workflows",
    icon: IconCode,
  },
]

function getExcelTopicIcon(slug: string): TablerIcon {
  const matched = EXCEL_CURATED_TOPICS.find((t) => t.slug === slug)
  if (matched) return matched.icon
  if (slug.includes("formula") || slug.includes("function")) return IconMathFunction
  if (slug.includes("vba") || slug.includes("macro") || slug.includes("code")) return IconCode
  if (slug.includes("pivot") || slug.includes("table")) return IconChartBar
  if (slug.includes("chart") || slug.includes("graph")) return IconChartHistogram
  if (slug.includes("tip") || slug.includes("shortcut")) return IconBolt
  return IconTable
}

function getGoogleTopicIcon(slug: string): TablerIcon {
  const matched = GOOGLE_CURATED_TOPICS.find((t) => t.slug === slug)
  if (matched) return matched.icon
  if (slug.includes("basic") || slug.includes("intro")) return IconBulb
  if (slug.includes("formula") || slug.includes("query") || slug.includes("array")) return IconMathFunction
  if (slug.includes("script") || slug.includes("advanced") || slug.includes("automation")) return IconCode
  if (slug.includes("chart")) return IconChartBar
  if (slug.includes("intermediate")) return IconAdjustments
  return IconTable
}

export function partitionCategories(dbCategories: Category[]): PlatformGroup[] {
  const dbMap = new Map<string, Category>(dbCategories.map((c) => [c.slug.toLowerCase(), c]))

  const excelItems: DisplayCategory[] = []
  const googleItems: DisplayCategory[] = []
  const otherItems: DisplayCategory[] = []
  const processedSlugs = new Set<string>()

  for (const topic of EXCEL_CURATED_TOPICS) {
    const dbCat = dbMap.get(topic.slug.toLowerCase())
    if (dbCat) {
      processedSlugs.add(dbCat.slug.toLowerCase())
      excelItems.push({
        id: dbCat.id,
        name: dbCat.name,
        slug: dbCat.slug,
        description: dbCat.description || topic.description,
        icon: topic.icon,
        colorHex: dbCat.color_hex,
        children: dbCat.children,
      })
    } else {
      excelItems.push({
        id: topic.slug,
        name: topic.name,
        slug: topic.slug,
        description: topic.description,
        icon: topic.icon,
      })
    }
  }

  for (const topic of GOOGLE_CURATED_TOPICS) {
    const dbCat = dbMap.get(topic.slug.toLowerCase())
    if (dbCat) {
      processedSlugs.add(dbCat.slug.toLowerCase())
      googleItems.push({
        id: dbCat.id,
        name: dbCat.name,
        slug: dbCat.slug,
        description: dbCat.description || topic.description,
        icon: topic.icon,
        colorHex: dbCat.color_hex,
        children: dbCat.children,
      })
    } else {
      googleItems.push({
        id: topic.slug,
        name: topic.name,
        slug: topic.slug,
        description: topic.description,
        icon: topic.icon,
      })
    }
  }

  for (const cat of dbCategories) {
    const lowerSlug = cat.slug.toLowerCase()
    const lowerName = cat.name.toLowerCase()
    if (processedSlugs.has(lowerSlug)) continue

    const isExcel = lowerSlug.includes("excel") || lowerName.includes("excel")
    const isGoogle = lowerSlug.includes("google") || lowerSlug.includes("sheets") || lowerName.includes("sheets")

    if (isExcel) {
      excelItems.push({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description || "In-depth Microsoft Excel tutorials and practical spreadsheet examples.",
        icon: getExcelTopicIcon(lowerSlug),
        colorHex: cat.color_hex,
        children: cat.children,
      })
    } else if (isGoogle) {
      googleItems.push({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description || "Google Sheets tutorials, cloud workflows, and function guides.",
        icon: getGoogleTopicIcon(lowerSlug),
        colorHex: cat.color_hex,
        children: cat.children,
      })
    } else {
      otherItems.push({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description || "Comprehensive tutorials and guides.",
        icon: IconFolder,
        colorHex: cat.color_hex,
        children: cat.children,
      })
    }
  }

  const groups: PlatformGroup[] = [
    {
      id: "excel",
      platform: "excel",
      title: "Microsoft Excel",
      badge: "Microsoft Excel",
      description: "Master modern dynamic arrays, formulas, VBA macro automations, pivot tables, and dashboard visuals.",
      icon: IconBrandOffice,
      accentColor: "emerald",
      items: excelItems,
    },
    {
      id: "google-sheets",
      platform: "google",
      title: "Google Sheets",
      badge: "Google Sheets",
      description: "Cloud-native spreadsheet functions, QUERY syntax, IMPORTRANGE, Apps Script, and live reporting.",
      icon: IconBrandGoogle,
      accentColor: "teal",
      items: googleItems,
    },
  ]

  if (otherItems.length > 0) {
    groups.push({
      id: "other-topics",
      platform: "other",
      title: "Specialized & Additional Topics",
      badge: "Additional Topics",
      description: "Finance, modeling, data analysis, and domain-specific spreadsheet guides.",
      icon: IconFolder,
      accentColor: "blue",
      items: otherItems,
    })
  }

  return groups
}
