export interface MarginResult {
  grossProfit: number
  marginPercent: number
  markupPercent: number | null
  multiple: number
}

/** Forward mode: margin/markup from a known cost and selling price. */
export function calculateMargin(cost: number, price: number): MarginResult {
  const grossProfit = price - cost
  const multiple = price / cost
  return {
    grossProfit,
    marginPercent: (grossProfit / price) * 100,
    // Markup is undefined when the cost basis is zero.
    markupPercent: cost === 0 ? null : (grossProfit / cost) * 100,
    multiple,
  }
}

/** Reverse mode: the selling price that achieves a target margin on a given cost. */
export function calculateRequiredPrice(
  cost: number,
  targetMarginPercent: number
): MarginResult {
  const price = cost / (1 - targetMarginPercent / 100)
  return calculateMargin(cost, price)
}
