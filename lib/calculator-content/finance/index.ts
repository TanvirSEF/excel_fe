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
  | "share-profit-calculator"
  | "dividend-reinvestment-plan-calculator"
  | "dividend-snowball-calculator"
  | "living-off-dividends-calculator"
  | "cost-of-equity-calculator"
  | "rental-property-roi-calculator"
  | "cash-on-cash-roi-calculator"
  | "solar-roi-calculator"
  | "marketing-roi-calculator"
  | "enterprise-seo-roi-calculator"
  | "b2b-roi-calculator"
  | "venture-capital-calculator"
  | "irr-calculator"
  | "accounting-rate-of-return-calculator"
  | "holding-period-return-calculator"
  | "retirement-rate-of-return-calculator"
  | "savings-withdrawal-calculator"

export const FINANCE_DETAILS: Record<FinanceSlug, CalculatorDetail> = {
  "share-profit-calculator": shareProfitCalculator,
  "dividend-reinvestment-plan-calculator": dividendReinvestmentPlanCalculator,
  "dividend-snowball-calculator": dividendSnowballCalculator,
  "living-off-dividends-calculator": livingOffDividendsCalculator,
  "cost-of-equity-calculator": costOfEquityCalculator,
  "rental-property-roi-calculator": rentalPropertyRoiCalculator,
  "cash-on-cash-roi-calculator": cashOnCashRoiCalculator,
  "solar-roi-calculator": solarRoiCalculator,
  "marketing-roi-calculator": marketingRoiCalculator,
  "enterprise-seo-roi-calculator": enterpriseSeoRoiCalculator,
  "b2b-roi-calculator": b2bRoiCalculator,
  "venture-capital-calculator": ventureCapitalCalculator,
  "irr-calculator": irrCalculator,
  "accounting-rate-of-return-calculator": accountingRateOfReturnCalculator,
  "holding-period-return-calculator": holdingPeriodReturnCalculator,
  "retirement-rate-of-return-calculator": retirementRateOfReturnCalculator,
  "savings-withdrawal-calculator": savingsWithdrawalCalculator,
}
