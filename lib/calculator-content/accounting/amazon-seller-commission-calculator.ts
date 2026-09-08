import type { CalculatorDetail } from "../types"

export const amazonSellerCommissionCalculator: CalculatorDetail = {
  metaDescription:
    "Free Amazon seller commission calculator — referral fees, FBA fulfillment and closing fees show what you actually keep per sale.",
  formula: "Net = Price − (Price × Referral%) − Fulfillment − Closing",
  whenToUse: [
    "Pricing a product for Amazon — the fee stack routinely surprises new sellers.",
    "Auditing whether an existing listing is still profitable after a fee change.",
  ],
  howToUse: [
    "Enter the sale price and the referral fee percentage for your category (usually 8–15%).",
    "Enter the per-unit fulfillment fee and any closing fee from Seller Central.",
    "Add your product cost to see the true profit and margin.",
  ],
  example: {
    title: "Example: $100 sale, 15% referral, $8 FBA",
    body: "Amazon keeps $23 (23%) — you receive $77, and after a $40 product cost, profit is $37. Press Reset to verify.",
  },
}
