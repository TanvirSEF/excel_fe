import type { CalculatorDetail } from "../types"

export const twoWayAnovaCalculator: CalculatorDetail = {
  metaDescription:
    "Free two-way ANOVA calculator — test how two factors and their interaction affect a result. Full ANOVA table with F statistics and p-values.",
  formula: "F = MS(factor) ÷ MS(error), computed for rows, columns and interaction",
  whenToUse: [
    "When two factors might both matter — Diet AND Exercise, Machine AND Shift — and you want each factor's effect plus whether they interact.",
    "With one value per cell you get the unreplicated model (like Excel's Two-Factor Without Replication); with the same 2+ values per cell you also get the interaction term.",
  ],
  howToUse: [
    "Set the grid size with the row and column steppers (2–6 each).",
    "Fill every cell — a single value per cell for the unreplicated model, or the same 2+ values per cell to test interaction.",
    "Read the ANOVA table: rows test factor A, columns test factor B, and interaction (when replicated) tests whether the factors combine non-additively.",
  ],
  example: {
    title: "Example: 3×3 grid",
    body: "The default grid gives SS-rows 56, SS-cols 56, SS-error 16 with F = 7 and p ≈ 0.0494 for both factors — significant at the 5% level.",
  },
  excelNote: "In Excel: Data → Data Analysis → Anova: Two-Factor with or without Replication.",
}
