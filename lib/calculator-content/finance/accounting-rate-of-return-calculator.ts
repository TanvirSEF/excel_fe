import type { CalculatorDetail } from "../types"

export const accountingRateOfReturnCalculator: CalculatorDetail = {
  metaDescription:
    "Free accounting rate of return calculator — average annual profit against average investment gives the ARR managers use to approve projects.",
  formula: "ARR = Average annual profit ÷ ((Initial investment + Salvage) ÷ 2)",
  whenToUse: [
    "For a quick approval check on capital projects before doing a full NPV analysis.",
    "When comparing projects on accounting profit rather than cash flow.",
  ],
  howToUse: [
    "Enter the project's average annual profit after depreciation and tax.",
    "Enter the initial investment and the salvage value at the end.",
    "Read the ARR — many companies approve projects above a 15% hurdle.",
  ],
  example: {
    title: "Example: $20,000 average profit on $100,000",
    body: "With $10,000 salvage, average investment is $55,000 → ARR = 36.36%. Press Reset to verify.",
  },
}
