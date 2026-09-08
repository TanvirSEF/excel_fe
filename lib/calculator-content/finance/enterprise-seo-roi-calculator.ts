import type { CalculatorDetail } from "../types"

export const enterpriseSeoRoiCalculator: CalculatorDetail = {
  metaDescription:
    "Free enterprise SEO ROI calculator — projected added traffic, conversion rate and order value vs the SEO investment give revenue, ROI and net value.",
  formula: "Added revenue = Visitors × Conversion rate × Average order value",
  whenToUse: [
    "When deciding whether to fund an enterprise SEO program or agency retainer.",
    "To sanity-check an agency's traffic projections against your own conversion economics.",
  ],
  howToUse: [
    "Enter the projected added organic visitors per month.",
    "Enter your conversion rate and average order value.",
    "Enter the monthly SEO cost — read the added revenue, annual ROI and net monthly value.",
  ],
  example: {
    title: "Example: 5,000 added visitors at 2% and $100 AOV",
    body: "$10,000/month in added revenue against $5,000/month of SEO cost — a 100% annual ROI that compounds as rankings stick.",
  },
}
