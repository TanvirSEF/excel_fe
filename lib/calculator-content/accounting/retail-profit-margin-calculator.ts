import type { CalculatorDetail } from "../types"

export const retailProfitMarginCalculator: CalculatorDetail = {
  metaDescription:
    "Free retail profit margin calculator — cost and selling price give margin, markup and profit per unit instantly, with the formula explained.",
  formula: "Margin = (Price − Cost) ÷ Price × 100%",
  whenToUse: [
    "Pricing a product on your store's shelf — before you commit to a supplier price.",
    "Checking whether your markup style (markup on cost) translates to a healthy margin on price.",
  ],
  howToUse: [
    "Enter what the product costs you per unit.",
    "Enter your selling price.",
    "Read margin, markup and the profit you keep per sale.",
  ],
  example: {
    title: "Example: $60 cost, $100 price",
    body: "Margin 40%, markup 66.67% — you keep $40 of every $100 sale. Press Reset to reproduce it.",
  },
  excelNote: "In Excel: =(Price−Cost)/Price, formatted as a percentage.",
}
