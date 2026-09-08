import type { CalculatorDetail } from "../types"

export const salespersonProfitabilityCalculator: CalculatorDetail = {
  metaDescription:
    "Free salesperson profitability calculator — gross profit from their sales vs their full employment cost gives a hire/not-hire ROI.",
  formula: "ROI = (Revenue × Gross margin − Total comp) ÷ Total comp × 100%",
  whenToUse: [
    "Deciding whether to keep, coach or restructure a sales role.",
    "Setting realistic quota targets — the revenue a salesperson must clear to be an asset.",
  ],
  howToUse: [
    "Enter the revenue they generated and the gross margin on those sales.",
    "Enter their full cost: salary, commissions and benefits.",
    "Read the ROI and the asset verdict.",
  ],
  example: {
    title: "Example: $500k revenue at 40% margin, $110k package",
    body: "Gross profit $200k vs $110k cost → 81.8% ROI. Every $1 spent on this rep returns $1.82 in gross profit.",
  },
}
