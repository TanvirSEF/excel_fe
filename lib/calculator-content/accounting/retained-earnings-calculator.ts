import type { CalculatorDetail } from "../types"

export const retainedEarningsCalculator: CalculatorDetail = {
  metaDescription:
    "Free retained earnings calculator — beginning balance, net income and dividends give the ending retained earnings and retention ratio.",
  formula: "RE(end) = RE(begin) + Net income − Dividends",
  whenToUse: [
    "Preparing the statement of retained earnings for financial statements.",
    "Seeing how much profit the business keeps versus pays out to owners.",
  ],
  howToUse: [
    "Enter last period's ending retained earnings.",
    "Enter this year's net income and dividends paid.",
    "Read the new ending balance and the retention ratio.",
  ],
  example: {
    title: "Example: $100k + $50k income − $20k dividends",
    body: "Ending retained earnings = $130,000, with a 60% retention ratio. Press Reset to verify.",
  },
}
