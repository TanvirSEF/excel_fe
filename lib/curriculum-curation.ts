import type { CurriculumTopic } from "@/types/api"

export interface CuratedTopicEntry {
  slug: string
  name: string
}

// Topic lists from the legacy WordPress site's lesson sidebar: the exact
// curated entries and order per module (basics taken from the old sidebar,
// others from the google_sheet CPT hub pages, oldest first).
export const GS_CURATED_TOPICS: Record<string, CuratedTopicEntry[]> = {
  "google-sheets-basics": [
    { slug: "introduction", name: "Introduction to Google Sheets" },
    { slug: "cell-formatting", name: "Cell Formatting in Google Sheets" },
    { slug: "gridlines", name: "Gridlines in Google Sheets" },
    { slug: "number-format", name: "Number Formatting in Google Sheets" },
    { slug: "date-format", name: "Formatting Dates in Google Sheets" },
    { slug: "autofill", name: "Autofill in Google Sheets" },
    { slug: "line-break", name: "Line Break in Google Sheets" },
    { slug: "search", name: "Search Data in Google Sheets" },
    { slug: "characters-and-emojis", name: "Characters and Emojis in Google Sheets" },
    { slug: "notes-and-comments", name: "Notes & Comments in Google Sheets" },
    { slug: "copy-and-paste", name: "Copy and Paste in Google Sheets" },
  ],
  "google-sheets-functions": [
    { slug: "query", name: "QUERY Function" },
    { slug: "if-google-sheets-functions", name: "IF Function" },
    { slug: "arrayformula", name: "ARRAYFORMULA Function" },
    { slug: "countif-google-sheets-functions", name: "COUNTIF Function" },
    { slug: "sumif-google-sheets-functions", name: "SUMIF Function" },
  ],
  "google-sheets-formulas": [
    { slug: "compare-data-google-sheets-formulas", name: "Compare Data" },
    { slug: "remove-duplicates-google-sheets-formulas", name: "Remove Duplicates" },
    { slug: "split-cells", name: "Split Cells" },
    { slug: "remove-characters-google-sheets-formulas", name: "Remove Characters" },
    { slug: "multiplication", name: "Multiplication" },
    { slug: "average", name: "Average Formula" },
    { slug: "percentage", name: "Percentage Formula" },
    { slug: "rounding-google-sheets-formulas", name: "Rounding Numbers" },
    { slug: "date", name: "Date Formula" },
    { slug: "time", name: "Time Formula" },
  ],
  "google-sheets-intermediate-tutorials": [
    { slug: "protect-sheets", name: "Protect Data" },
    { slug: "data-validation-google-sheets-intermediate-tutorial", name: "Data Validation" },
    { slug: "drop-down-google-sheets-intermediate-tutorial", name: "Dropdown List" },
    { slug: "print-sheets-google-sheets-intermediate-tutorial", name: "Print Data" },
    { slug: "version-history", name: "Version History" },
  ],
  "charts-in-google-sheets": [
    { slug: "formatting-charts", name: "Format Charts" },
    { slug: "trendline-google-sheets-charts", name: "Trendline" },
    { slug: "sparkline", name: "Sparkline" },
  ],
  "google-sheets-advanced-tutorials": [
    { slug: "send-email-google-sheets-advanced", name: "Send Email" },
    { slug: "what-if-analysis-google-sheets-advanced", name: "What-If Analysis" },
    { slug: "pivot-table", name: "Pivot Table" },
  ],
}

// Returns the module's topics in the legacy curated order (with legacy
// display names). Topics without a curated entry are hidden from lists but
// remain part of the lesson flow.
export function curatedTopics(
  moduleSlug: string,
  topics: CurriculumTopic[]
): CurriculumTopic[] {
  const curated = GS_CURATED_TOPICS[moduleSlug]
  if (!curated) return topics

  const bySlug = new Map(topics.map((topic) => [topic.slug, topic]))
  return curated.flatMap((entry) => {
    const topic = bySlug.get(entry.slug)
    return topic ? [{ ...topic, name: entry.name }] : []
  })
}
