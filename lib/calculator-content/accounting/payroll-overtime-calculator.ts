import type { CalculatorDetail } from "../types"

export const payrollOvertimeCalculator: CalculatorDetail = {
  metaDescription:
    "Free payroll calculator with overtime — regular hours at base rate plus overtime at any multiplier, with the full FLSA breakdown.",
  formula: "Gross = Hours × Rate + OT hours × Rate × Multiplier",
  whenToUse: [
    "Running payroll for hourly employees who worked overtime.",
    "Checking a paycheck's overtime math against the FLSA time-and-a-half standard.",
  ],
  howToUse: [
    "Enter the hourly rate, regular hours and overtime hours.",
    "Keep the 1.5 multiplier for standard FLSA overtime, or change it for double-time.",
    "Read the gross pay with the regular/overtime breakdown.",
  ],
  example: {
    title: "Example: $20/h × 40 + 10 OT hours at 1.5×",
    body: "$800 regular + $300 overtime = $1,100 gross pay. Press Reset to verify.",
  },
  excelNote: "In Excel: =Reg*Rate + OT*Rate*1.5",
}
