import type { CalculatorDetail } from "../types"

export const payrollConversionCalculator: CalculatorDetail = {
  metaDescription:
    "Free payroll conversion calculator — annual salary into hourly, weekly, biweekly, semimonthly and monthly wages, adjusted for your schedule.",
  formula: "Hourly = Salary ÷ (Hours per week × Weeks per year)",
  whenToUse: [
    "Comparing a salaried offer against an hourly job — the honest apples-to-apples rate.",
    "Setting up payroll schedules: see what each paycheck looks like on every cadence.",
  ],
  howToUse: [
    "Enter the annual salary.",
    "Enter hours per week and working weeks per year — 52 if no unpaid leave.",
    "Read the hourly rate plus every paycheck cadence.",
  ],
  example: {
    title: "Example: $60,000 at 40 h/week, 52 weeks",
    body: "$28.85/hour · $1,153.85 weekly · $2,307.69 biweekly · $5,000 monthly. Press Reset to verify.",
  },
}
