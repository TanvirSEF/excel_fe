import type { CalculatorDetail } from "../types"

export const ventureCapitalCalculator: CalculatorDetail = {
  metaDescription:
    "Free venture capital dilution calculator — pre-money valuation, new investment and your stake give post-money value, investor share and your diluted ownership.",
  formula: "Post-money = Pre-money + Investment · Investor % = Investment ÷ Post-money",
  whenToUse: [
    "When negotiating a term sheet — see exactly what that valuation offer costs you in ownership.",
    "To model multiple rounds: repeat with each round's numbers to build a cap table.",
  ],
  howToUse: [
    "Enter the agreed pre-money valuation and the new investment amount.",
    "Enter your current ownership percentage.",
    "Read the post-money value, the investor's share and your diluted stake.",
  ],
  example: {
    title: "Example: $8M pre-money, $2M investment, you own 60%",
    body: "Post-money $10M — the investor gets 20% and your stake dilutes to 48%. Press Reset to verify.",
  },
}
