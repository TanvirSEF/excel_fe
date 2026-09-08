import type { CalculatorDetail } from "../types"

export const wholesaleMarginCalculator: CalculatorDetail = {
  metaDescription:
    "Free wholesale margin calculator — bulk cost, quantity and bulk price give the total profit, margin percentage and effective unit price.",
  formula: "Margin = (Bulk price − Units × Unit cost) ÷ Bulk price × 100%",
  whenToUse: [
    "Quoting a bulk price to a retail store — know your real margin before you negotiate.",
    "Comparing per-unit economics between wholesale and direct-to-customer sales.",
  ],
  howToUse: [
    "Enter your manufacturing cost per unit.",
    "Enter how many units are in the bulk order.",
    "Enter the price you charge for the whole lot.",
  ],
  example: {
    title: "Example: 1,000 units at $5 cost, sold for $7,000",
    body: "Total cost $5,000, profit $2,000 — a 28.57% wholesale margin at an effective $7 per unit.",
  },
}
