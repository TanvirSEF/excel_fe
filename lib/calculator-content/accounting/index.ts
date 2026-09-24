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
  | "retail-profit-margin"
  | "wholesale-margin"
  | "reverse-margin"
  | "amazon-seller-commission"
  | "salesperson-profitability"
  | "payroll-with-overtime"
  | "gross-up-payroll"
  | "prorated-bonus"
  | "sales-commission"
  | "payroll-conversion"
  | "retained-earnings"
  | "cash-conversion-cycle"
  | "debt-payoff-with-extra-payments"
  | "debt-snowball-vs-avalanche"
  | "marginal-propensity-to-consume"

export const ACCOUNTING_CANONICAL_SLUG_MAP: Record<string, AccountingSlug> = {
  "retail-profit-margin": "retail-profit-margin",
  "retail-profit-margin-calculator": "retail-profit-margin",
  "wholesale-margin": "wholesale-margin",
  "wholesale-margin-calculator": "wholesale-margin",
  "reverse-margin": "reverse-margin",
  "reverse-margin-calculator": "reverse-margin",
  "amazon-seller-commission": "amazon-seller-commission",
  "amazon-seller-commission-calculator": "amazon-seller-commission",
  "salesperson-profitability": "salesperson-profitability",
  "salesperson-profitability-calculator": "salesperson-profitability",
  "payroll-with-overtime": "payroll-with-overtime",
  "payroll-overtime-calculator": "payroll-with-overtime",
  "payroll-calculator-with-overtime": "payroll-with-overtime",
  "gross-up-payroll": "gross-up-payroll",
  "gross-up-payroll-calculator": "gross-up-payroll",
  "prorated-bonus": "prorated-bonus",
  "prorated-bonus-calculator": "prorated-bonus",
  "sales-commission": "sales-commission",
  "sales-commission-calculator": "sales-commission",
  "payroll-conversion": "payroll-conversion",
  "payroll-conversion-calculator": "payroll-conversion",
  "retained-earnings": "retained-earnings",
  "retained-earnings-calculator": "retained-earnings",
  "cash-conversion-cycle": "cash-conversion-cycle",
  "cash-conversion-cycle-calculator": "cash-conversion-cycle",
  "debt-payoff-with-extra-payments": "debt-payoff-with-extra-payments",
  "debt-payoff-extra-payments-calculator": "debt-payoff-with-extra-payments",
  "debt-payoff-calculator-with-extra-payments": "debt-payoff-with-extra-payments",
  "debt-snowball-vs-avalanche": "debt-snowball-vs-avalanche",
  "debt-snowball-vs-avalanche-calculator": "debt-snowball-vs-avalanche",
  "marginal-propensity-to-consume": "marginal-propensity-to-consume",
  "marginal-propensity-to-consume-calculator": "marginal-propensity-to-consume",
}

export const ACCOUNTING_DETAILS: Record<AccountingSlug, CalculatorDetail> = {
  "retail-profit-margin": retailProfitMarginCalculator,
  "wholesale-margin": wholesaleMarginCalculator,
  "reverse-margin": reverseMarginCalculator,
  "amazon-seller-commission": amazonSellerCommissionCalculator,
  "salesperson-profitability": salespersonProfitabilityCalculator,
  "payroll-with-overtime": payrollOvertimeCalculator,
  "gross-up-payroll": grossUpPayrollCalculator,
  "prorated-bonus": proratedBonusCalculator,
  "sales-commission": salesCommissionCalculator,
  "payroll-conversion": payrollConversionCalculator,
  "retained-earnings": retainedEarningsCalculator,
  "cash-conversion-cycle": cashConversionCycleCalculator,
  "debt-payoff-with-extra-payments": debtPayoffExtraPaymentsCalculator,
  "debt-snowball-vs-avalanche": debtSnowballVsAvalancheCalculator,
  "marginal-propensity-to-consume": marginalPropensityToConsumeCalculator,
}

export function getAccountingDetail(slug: string): CalculatorDetail | undefined {
  const canonical = ACCOUNTING_CANONICAL_SLUG_MAP[slug]
  return canonical ? ACCOUNTING_DETAILS[canonical] : undefined
}
