import type { CalculatorDetail } from "../types"

export const salesCommissionCalculator: CalculatorDetail = {
  metaDescription:
    "Free sales commission calculator — exact commission from sales amount and rate, with optional base draw and effective rate.",
  formula: "Commission = Sales × Rate",
  whenToUse: [
    "Checking a commission check against your comp plan.",
    "For tiered plans: run it once per tier with each slice of sales.",
  ],
  howToUse: [
    "Enter the sales amount the commission is paid on.",
    "Enter the commission rate percentage.",
    "Optionally add a base or draw — read the total payout and effective rate.",
  ],
  example: {
    title: "Example: $100,000 in sales at 5%",
    body: "Commission = $5,000 exactly. Press Reset to verify.",
  },
}
