import type { CalculatorDetail } from "../types"

export const b2bRoiCalculator: CalculatorDetail = {
  metaDescription:
    "Free B2B ROI calculator — annual cost vs the value of hours saved gives net value, ROI, payback months and a clear yes/no verdict on the purchase.",
  formula: "ROI = (Hours saved × Hourly value − Annual cost) ÷ Annual cost × 100",
  whenToUse: [
    "Before renewing any B2B SaaS subscription — does it still pay for itself?",
    "To build the business case for a tool your team is asking for.",
  ],
  howToUse: [
    "Enter the tool or service's annual cost.",
    "Estimate the team hours it saves per year and the loaded hourly cost of that time.",
    "Read the net value, ROI, payback months — and the verdict.",
  ],
  example: {
    title: "Example: $12,000 tool saving 500 hours at $50",
    body: "$25,000 of value − $12,000 cost = $13,000 net → 108.3% ROI, paying back in under 6 months. A yes.",
  },
}
