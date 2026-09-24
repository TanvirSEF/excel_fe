import type { CalculatorDetail } from "../types"

import { shareProfitCalculator } from "./share-profit-calculator"
import { dividendReinvestmentPlanCalculator } from "./dividend-reinvestment-plan-calculator"
import { dividendSnowballCalculator } from "./dividend-snowball-calculator"
import { livingOffDividendsCalculator } from "./living-off-dividends-calculator"
import { costOfEquityCalculator } from "./cost-of-equity-calculator"
import { rentalPropertyRoiCalculator } from "./rental-property-roi-calculator"
import { cashOnCashRoiCalculator } from "./cash-on-cash-roi-calculator"
import { solarRoiCalculator } from "./solar-roi-calculator"
import { marketingRoiCalculator } from "./marketing-roi-calculator"
import { enterpriseSeoRoiCalculator } from "./enterprise-seo-roi-calculator"
import { b2bRoiCalculator } from "./b2b-roi-calculator"
import { ventureCapitalCalculator } from "./venture-capital-calculator"
import { irrCalculator } from "./irr-calculator"
import { accountingRateOfReturnCalculator } from "./accounting-rate-of-return-calculator"
import { holdingPeriodReturnCalculator } from "./holding-period-return-calculator"
import { retirementRateOfReturnCalculator } from "./retirement-rate-of-return-calculator"
import { savingsWithdrawalCalculator } from "./savings-withdrawal-calculator"

export type FinanceSlug =
  | "share-profit"
  | "dividend-reinvestment-plan"
  | "dividend-snowball"
  | "living-off-dividends"
  | "cost-of-equity"
  | "rental-property-roi"
  | "cash-on-cash-roi"
  | "solar-roi"
  | "marketing-roi"
  | "enterprise-seo-roi"
  | "b2b-roi"
  | "venture-capital"
  | "internal-rate-of-return"
  | "accounting-rate-of-return"
  | "holding-period-return"
  | "retirement-rate-of-return"
  | "savings-withdrawal"

export const FINANCE_CANONICAL_SLUG_MAP: Record<string, FinanceSlug> = {
  "share-profit": "share-profit",
  "share-profit-calculator": "share-profit",
  "dividend-reinvestment-plan": "dividend-reinvestment-plan",
  "dividend-reinvestment-plan-calculator": "dividend-reinvestment-plan",
  "dividend-snowball": "dividend-snowball",
  "dividend-snowball-calculator": "dividend-snowball",
  "living-off-dividends": "living-off-dividends",
  "living-off-dividends-calculator": "living-off-dividends",
  "cost-of-equity": "cost-of-equity",
  "cost-of-equity-calculator": "cost-of-equity",
  "rental-property-roi": "rental-property-roi",
  "rental-property-roi-calculator": "rental-property-roi",
  "cash-on-cash-roi": "cash-on-cash-roi",
  "cash-on-cash-roi-calculator": "cash-on-cash-roi",
  "solar-roi": "solar-roi",
  "solar-roi-calculator": "solar-roi",
  "marketing-roi": "marketing-roi",
  "marketing-roi-calculator": "marketing-roi",
  "enterprise-seo-roi": "enterprise-seo-roi",
  "enterprise-seo-roi-calculator": "enterprise-seo-roi",
  "b2b-roi": "b2b-roi",
  "b2b-roi-calculator": "b2b-roi",
  "venture-capital": "venture-capital",
  "venture-capital-calculator": "venture-capital",
  "internal-rate-of-return": "internal-rate-of-return",
  "irr-calculator": "internal-rate-of-return",
  "accounting-rate-of-return": "accounting-rate-of-return",
  "accounting-rate-of-return-calculator": "accounting-rate-of-return",
  "holding-period-return": "holding-period-return",
  "holding-period-return-calculator": "holding-period-return",
  "retirement-rate-of-return": "retirement-rate-of-return",
  "retirement-rate-of-return-calculator": "retirement-rate-of-return",
  "savings-withdrawal": "savings-withdrawal",
  "savings-withdrawal-calculator": "savings-withdrawal",
}

export const FINANCE_DETAILS: Record<FinanceSlug, CalculatorDetail> = {
  "share-profit": shareProfitCalculator,
  "dividend-reinvestment-plan": dividendReinvestmentPlanCalculator,
  "dividend-snowball": dividendSnowballCalculator,
  "living-off-dividends": livingOffDividendsCalculator,
  "cost-of-equity": costOfEquityCalculator,
  "rental-property-roi": rentalPropertyRoiCalculator,
  "cash-on-cash-roi": cashOnCashRoiCalculator,
  "solar-roi": solarRoiCalculator,
  "marketing-roi": marketingRoiCalculator,
  "enterprise-seo-roi": enterpriseSeoRoiCalculator,
  "b2b-roi": b2bRoiCalculator,
  "venture-capital": ventureCapitalCalculator,
  "internal-rate-of-return": irrCalculator,
  "accounting-rate-of-return": accountingRateOfReturnCalculator,
  "holding-period-return": holdingPeriodReturnCalculator,
  "retirement-rate-of-return": retirementRateOfReturnCalculator,
  "savings-withdrawal": savingsWithdrawalCalculator,
}

export function getFinanceDetail(slug: string): CalculatorDetail | undefined {
  const canonical = FINANCE_CANONICAL_SLUG_MAP[slug]
  return canonical ? FINANCE_DETAILS[canonical] : undefined
}
