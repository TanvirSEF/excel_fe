import type { CalculatorDetail } from "../types"

export const marketingRoiCalculator: CalculatorDetail = {
  metaDescription:
    "Free marketing ROI calculator — instantly see if a campaign was a winner or loser: ROI percentage, net profit and return per dollar of ad spend.",
  formula: "ROI = (Attributed revenue − Spend) ÷ Spend × 100",
  whenToUse: [
    "After any campaign — ads, email, influencer — to decide scale-up or shut-down.",
    "To compare channels: the one with the highest ROI per dollar deserves the budget.",
  ],
  howToUse: [
    "Enter what the campaign cost, all in.",
    "Enter the revenue it brought in — use attributed revenue from your analytics.",
    "Read the verdict, ROI and return per dollar (ROAS).",
  ],
  example: {
    title: "Example: $5,000 spend returning $15,000",
    body: "ROI = (15,000 − 5,000) ÷ 5,000 = 200% — every dollar returned $3. A clear winner.",
  },
}
