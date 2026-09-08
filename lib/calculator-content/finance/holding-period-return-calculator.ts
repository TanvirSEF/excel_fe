import type { CalculatorDetail } from "../types"

export const holdingPeriodReturnCalculator: CalculatorDetail = {
  metaDescription:
    "Free holding period return calculator — total return for the entire time you owned an asset, including income received, with annualized equivalent.",
  formula: "HPR = (Ending − Starting + Income) ÷ Starting",
  whenToUse: [
    "To state what an investment actually returned over the full holding period — one month or ten years.",
    "To annualize that return so it can be compared with other investments fairly.",
  ],
  howToUse: [
    "Enter the starting and ending values of the investment.",
    "Add any income received while holding — dividends, interest or rent.",
    "Enter the years held for the annualized figure, and toggle between total and annualized.",
  ],
  example: {
    title: "Example: $10,000 → $12,500 plus $200 income",
    body: "HPR = 27% over the period — about 12.7% annualized over 2 years. Press Reset to verify.",
  },
}
