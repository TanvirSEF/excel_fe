import type { CalculatorDetail } from "../types"

export const proratedBonusCalculator: CalculatorDetail = {
  metaDescription:
    "Free prorated bonus calculator — a fair, months-worked share of the annual bonus for part-year employees and mid-year hires.",
  formula: "Prorated = Full bonus × Months worked ÷ 12",
  whenToUse: [
    "Bonus season with employees who joined mid-year or took extended leave.",
    "Making defensible, consistent bonus decisions for everyone who worked a partial year.",
  ],
  howToUse: [
    "Enter the full annual bonus for the role.",
    "Enter how many months of the bonus period the employee worked.",
    "Read the fair prorated amount.",
  ],
  example: {
    title: "Example: $5,000 bonus, 8 months worked",
    body: "$5,000 × 8/12 = $3,333.33 — two-thirds of the full bonus. Press Reset to verify.",
  },
}
