import type { CalculatorDetail } from "../types"

export const livingOffDividendsCalculator: CalculatorDetail = {
  metaDescription:
    "Free living off dividends calculator — find the exact portfolio size you need to cover your monthly expenses entirely with dividend income.",
  formula: "Goal portfolio = (Monthly expenses × 12) ÷ Dividend yield",
  whenToUse: [
    "To turn your monthly budget into one clear target number for financial independence.",
    "To check whether your current savings already generate enough income to quit.",
  ],
  howToUse: [
    "Enter your realistic monthly expenses in retirement.",
    "Enter your portfolio's dividend yield — 3–4% is sustainable for most portfolios.",
    "See the goal portfolio, your income today and how far you still have to go.",
  ],
  example: {
    title: "Example: $4,000 per month at a 4% yield",
    body: "$48,000 of annual expenses ÷ 0.04 = a $1,200,000 portfolio. Press Reset to verify.",
  },
}
