import type { CurriculumTopic } from "@/types/api"

export interface CuratedTopicEntry {
  slug: string
  name: string
}

// Topic lists extracted from the legacy WordPress site's lesson sidebar
// (the Bellows accordion on /google-sheets/basics/introduction-to-google-sheets/):
// the exact curated entries, display names and order per module. Two legacy
// topics (Refresh Data, Export Data) have no matching series yet and are
// omitted until their content is migrated.
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
    { slug: "if-google-sheets-functions", name: "IF Function in Google Sheets" },
    { slug: "sumif-google-sheets-functions", name: "SUMIF Function in Google Sheets" },
    { slug: "countif-google-sheets-functions", name: "COUNTIF Function in Google Sheets" },
    { slug: "arrayformula", name: "ARRAYFORMULA Function in Google Sheets" },
    { slug: "query", name: "QUERY Function in Google Sheets" },
  ],
  "google-sheets-formulas": [
    { slug: "multiplication", name: "Multiplication in Google Sheets" },
    { slug: "average", name: "Average Formula in Google Sheets" },
    { slug: "percentage", name: "Percentage Formula in Google Sheets" },
    { slug: "rounding-google-sheets-formulas", name: "Rounding in Google Sheets" },
    { slug: "date", name: "Date Formula in Google Sheets" },
    { slug: "time", name: "Time Formula in Google Sheets" },
    { slug: "merge-cells", name: "Merging Cells in Google Sheets" },
    { slug: "split-cells", name: "Split Cells in Google Sheets" },
    { slug: "remove-characters-google-sheets-formulas", name: "Remove Characters in Google Sheets" },
    { slug: "compare-data-google-sheets-formulas", name: "Compare Data in Google Sheets" },
    { slug: "remove-duplicates-google-sheets-formulas", name: "Remove Duplicates in Google Sheets" },
  ],
  "google-sheets-intermediate-tutorials": [
    { slug: "protect-sheets", name: "Protect Data in Google Sheets" },
    { slug: "data-validation-google-sheets-intermediate-tutorial", name: "Data Validation in Google Sheets" },
    { slug: "drop-down-google-sheets-intermediate-tutorial", name: "Dropdown in Google Sheets" },
    { slug: "print-sheets-google-sheets-intermediate-tutorial", name: "Print Data in Google Sheets" },
    { slug: "version-history", name: "Version History in Google Sheets" },
  ],
  "charts-in-google-sheets": [
    { slug: "formatting-charts", name: "Formatting Chart in Google Sheets" },
    { slug: "trendline-google-sheets-charts", name: "Trendline in Google Sheets" },
    { slug: "sparkline", name: "Sparkline in Google Sheets" },
  ],
  "google-sheets-advanced-tutorials": [
    { slug: "send-email-google-sheets-advanced", name: "Sending Email from Google Sheets" },
    { slug: "what-if-analysis-google-sheets-advanced", name: "What-If Analysis in Google Sheets" },
    { slug: "pivot-table", name: "Pivot Table in Google Sheets" },
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
