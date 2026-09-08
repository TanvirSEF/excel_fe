import type { CalculatorDetail } from "../types"

export const cashConversionCycleCalculator: CalculatorDetail = {
  metaDescription:
    "Free cash conversion cycle calculator — inventory days, receivable days and payable days from your balance sheet give the CCC.",
  formula: "CCC = DIO + DSO − DPO",
  whenToUse: [
    "Measuring how fast your business converts inventory spending back into cash.",
    "Diagnosing working capital problems — high DIO or DSO shows exactly where cash is stuck.",
  ],
  howToUse: [
    "Enter average inventory, receivables and payables from the balance sheet.",
    "Enter annual COGS and revenue from the income statement.",
    "Read DIO, DSO, DPO and the cash conversion cycle in days.",
  ],
  example: {
    title: "Example: 50 DIO + 30 DSO − 40 DPO",
    body: "CCC = 40 days — a dollar is tied up for 40 days between paying suppliers and collecting cash. Press Reset to verify.",
  },
  excelNote: "In Excel: DIO = Inventory/COGS*365, DSO = AR/Revenue*365, DPO = AP/COGS*365.",
}
