import type { CalculatorDetail } from "../types"

export const oneWayAnovaCalculator: CalculatorDetail = {
  metaDescription:
    "Free one-way ANOVA calculator — compare 3 or more group means with the full ANOVA table: SS, df, MS, F statistic and exact p-value. Copy to Excel.",
  formula: "F = MS(between) ÷ MS(within)",
  whenToUse: [
    "When you want to know whether three or more group means genuinely differ — plant yields under different fertilizers, sales across regions, test scores across teaching methods.",
    "As the gatekeeper before pairwise comparisons: a significant F tells you at least one mean differs.",
  ],
  howToUse: [
    "Enter each group's values in its own box — at least 2 values per group, 2 or more groups.",
    "The calculator builds the full ANOVA table: sums of squares, degrees of freedom, mean squares, F and the exact p-value.",
    "Use “Copy for Excel” to paste the whole table into a spreadsheet.",
  ],
  example: {
    title: "Example: three tidy groups",
    body: "Groups {3,4,5}, {7,8,9}, {10,11,12} give SS-between 74, SS-within 6, F = 37 and p ≈ 0.0004 — a significant difference. Press “Reset to example” to reproduce every number.",
  },
  excelNote: "In Excel: Data → Data Analysis → Anova: Single Factor, or F.DIST.RT(F, df1, df2) for the p-value.",
}
