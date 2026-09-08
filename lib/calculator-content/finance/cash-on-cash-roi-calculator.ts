import type { CalculatorDetail } from "../types"

export const cashOnCashRoiCalculator: CalculatorDetail = {
  metaDescription:
    "Free cash on cash ROI calculator — annual pre-tax cash flow divided by the cash you actually invested in a rental property, with payback period.",
  formula: "CoC = Annual pre-tax cash flow ÷ Cash invested",
  whenToUse: [
    "When you financed the purchase — this metric shows the return on your actual cash, mortgage included.",
    "To compare leveraged deals: good ones often beat the property's cap rate.",
  ],
  howToUse: [
    "Enter the cash you put in: down payment, closing costs and any rehab.",
    "Enter the annual pre-tax cash flow: rent minus mortgage, taxes, insurance and repairs.",
    "Read your cash on cash return, monthly flow and payback period.",
  ],
  example: {
    title: "Example: $60,000 invested, $7,200 annual flow",
    body: "$7,200 ÷ $60,000 = a 12% cash on cash return — the cash pays itself back in about 8.3 years.",
  },
}
