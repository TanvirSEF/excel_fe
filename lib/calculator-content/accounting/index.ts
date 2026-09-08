import type { CalculatorDetail } from "../types"

import { retailProfitMarginCalculator } from "./retail-profit-margin-calculator"
import { wholesaleMarginCalculator } from "./wholesale-margin-calculator"
import { reverseMarginCalculator } from "./reverse-margin-calculator"
import { amazonSellerCommissionCalculator } from "./amazon-seller-commission-calculator"
import { salespersonProfitabilityCalculator } from "./salesperson-profitability-calculator"
import { payrollOvertimeCalculator } from "./payroll-overtime-calculator"
import { grossUpPayrollCalculator } from "./gross-up-payroll-calculator"
import { proratedBonusCalculator } from "./prorated-bonus-calculator"
import { salesCommissionCalculator } from "./sales-commission-calculator"
import { payrollConversionCalculator } from "./payroll-conversion-calculator"
import { retainedEarningsCalculator } from "./retained-earnings-calculator"
import { cashConversionCycleCalculator } from "./cash-conversion-cycle-calculator"
import { debtPayoffExtraPaymentsCalculator } from "./debt-payoff-extra-payments-calculator"
import { debtSnowballVsAvalancheCalculator } from "./debt-snowball-vs-avalanche-calculator"
import { marginalPropensityToConsumeCalculator } from "./marginal-propensity-to-consume-calculator"

export type AccountingSlug =
  | "retail-profit-margin-calculator"
  | "wholesale-margin-calculator"
  | "reverse-margin-calculator"
  | "amazon-seller-commission-calculator"
  | "salesperson-profitability-calculator"
  | "payroll-overtime-calculator"
  | "gross-up-payroll-calculator"
  | "prorated-bonus-calculator"
  | "sales-commission-calculator"
  | "payroll-conversion-calculator"
  | "retained-earnings-calculator"
  | "cash-conversion-cycle-calculator"
  | "debt-payoff-extra-payments-calculator"
  | "debt-snowball-vs-avalanche-calculator"
  | "marginal-propensity-to-consume-calculator"

export const ACCOUNTING_DETAILS: Record<AccountingSlug, CalculatorDetail> = {
  "retail-profit-margin-calculator": retailProfitMarginCalculator,
  "wholesale-margin-calculator": wholesaleMarginCalculator,
  "reverse-margin-calculator": reverseMarginCalculator,
  "amazon-seller-commission-calculator": amazonSellerCommissionCalculator,
  "salesperson-profitability-calculator": salespersonProfitabilityCalculator,
  "payroll-overtime-calculator": payrollOvertimeCalculator,
  "gross-up-payroll-calculator": grossUpPayrollCalculator,
  "prorated-bonus-calculator": proratedBonusCalculator,
  "sales-commission-calculator": salesCommissionCalculator,
  "payroll-conversion-calculator": payrollConversionCalculator,
  "retained-earnings-calculator": retainedEarningsCalculator,
  "cash-conversion-cycle-calculator": cashConversionCycleCalculator,
  "debt-payoff-extra-payments-calculator": debtPayoffExtraPaymentsCalculator,
  "debt-snowball-vs-avalanche-calculator": debtSnowballVsAvalancheCalculator,
  "marginal-propensity-to-consume-calculator": marginalPropensityToConsumeCalculator,
}
