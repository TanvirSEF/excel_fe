import type { CalculatorDetail } from "../types"

export const rentalPropertyRoiCalculator: CalculatorDetail = {
  metaDescription:
    "Free rental property ROI calculator — rent, taxes, insurance, maintenance and vacancy give you the cap rate, NOI and gross yield of the deal.",
  formula: "Cap rate = Net operating income ÷ Purchase price",
  whenToUse: [
    "To compare rental deals on equal footing — the cap rate strips out financing effects.",
    "Before offering: check whether the rent realistically covers taxes, insurance and upkeep.",
  ],
  howToUse: [
    "Enter the purchase price and expected monthly rent.",
    "Add annual property tax, insurance and typical maintenance and vacancy allowances.",
    "Read the cap rate, NOI and gross yield — compare cap rates across properties.",
  ],
  example: {
    title: "Example: $250k property renting for $2,000/mo",
    body: "After $3,000 tax, $1,200 insurance, 10% maintenance and 5% vacancy, NOI is $16,200 → a 6.48% cap rate. Press Reset to verify.",
  },
}
