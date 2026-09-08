import type { CalculatorDetail } from "../types"

export const reverseMarginCalculator: CalculatorDetail = {
  metaDescription:
    "Free reverse margin calculator — given your selling price and target margin, find the maximum cost you can afford per unit.",
  formula: "Target cost = Price × (1 − Margin%)",
  whenToUse: [
    "When the market fixes your price and you need to know your cost ceiling.",
    "Negotiating with suppliers — walk in knowing the most you can pay.",
  ],
  howToUse: [
    "Enter the selling price the market will bear.",
    "Enter the margin your business needs.",
    "Read the maximum cost you can afford per unit.",
  ],
  example: {
    title: "Example: $100 price with a 40% target margin",
    body: "Target cost = $60 — any sourcing plan above $60/unit misses the margin. Press Reset to verify.",
  },
}
