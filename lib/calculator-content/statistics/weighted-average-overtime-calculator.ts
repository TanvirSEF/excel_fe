import type { CalculatorDetail } from "../types"

export const weightedAverageOvertimeCalculator: CalculatorDetail = {
  metaDescription:
    "Free weighted average overtime calculator — FLSA blended-rate method for multiple jobs, bonuses and commissions. DOL 4-step process with full pay breakdown.",
  formula: "Regular Rate = Total Straight Pay ÷ Total Hours · OT Premium = OT Hours × Rate × 0.5",
  whenToUse: [
    "Overtime pay does not always follow a simple time-and-a-half rule. Some employees work different jobs with different pay rates, or earn bonuses and commissions. In these cases, federal law (FLSA) requires a weighted average — the blended rate — for overtime pay.",
    "The FLSA requires this method. Employers cannot use only one pay rate. For example, an employee may work 20 hours as a Driver at $25/hr and 30 hours as a Loader at $15/hr. The employer cannot use only the $15 rate for overtime — the law requires blending both rates into one Regular Rate of Pay.",
  ],
  howToUse: [
    "Enter each job or shift with its hours and pay rate — add as many rows as needed.",
    "Enter any non-discretionary bonus (commissions, attendance bonuses, production incentives) — these must be included in the regular rate.",
    "Set the overtime threshold — usually 40 hours, but some states or agreements use 35 or 48.",
    "Read the blended rate, overtime premium and total gross pay, computed with the DOL 4-step method.",
  ],
  example: {
    title: "Example: dual-role employee with a bonus",
    body: "Regular Shift 35h @ $20 + Weekend Shift 10h @ $25 + $100 bonus → straight-time $1,050 over 45 hours → regular rate $23.33/hr → 5 OT hours × $23.33 × 0.5 = $58.33 premium → gross pay $1,108.33. Press Reset to reproduce every figure.",
  },
  excelNote: "In Excel: =(SUMPRODUCT(hours,rates)+bonus)/SUM(hours) for the regular rate, then =MAX(0,total_hours-threshold)*rate*0.5 for the premium.",
  method: {
    title: "How this calculator works — the DOL 4-step process",
    paragraphs: [
      "Step 1 — Total straight-time pay: multiply the hours for each job by its rate, then add all amounts plus any non-discretionary bonus. This covers the '1.0' portion of all hours worked.",
      "Step 2 — Regular rate: divide the total straight-time pay by the total hours worked (including overtime hours). This gives the blended rate.",
      "Step 3 — Overtime premium (the 0.5 method): you already paid the regular rate for all hours in Step 1. Now add only the extra half-time premium: OT hours × Regular Rate × 0.5.",
      "Step 4 — Gross pay: add the straight-time pay and the overtime premium together for the full paycheck amount.",
    ],
    formula: "Straight Pay + (OT Hours × Regular Rate × 0.5) = Gross Pay",
  },
  facts: [
    {
      title: "1. It is not optional",
      body: "The FLSA requires employers to use the weighted average method when employees work different jobs at different rates. Employers cannot use only the lowest rate, the highest rate, or the rate from the 41st hour alone — the blended rate is mandatory for fair overtime across the full workweek.",
    },
    {
      title: "2. Bonuses change the rate",
      body: "Many employers forget to include non-discretionary bonuses in the Regular Rate. These include attendance bonuses, commissions and production incentives. A $100 bonus raises the regular rate for every hour worked that week. This calculator includes a bonus field so the overtime rate adjusts automatically.",
    },
    {
      title: "3. The half-time logic",
      body: "Some calculations show 0.5 in the overtime formula — this does not reduce pay. Standard method: 40h @ $10 + 10h @ $15 (1.5×) = $550. Weighted method: 50h @ $10 (straight) + 10h @ $5 (0.5 premium) = $550. Both produce the same total; the weighted method handles multiple rates more accurately.",
    },
  ],
  useCases: [
    {
      title: "The dual-role employee",
      body: "A restaurant employee works as Server during lunch and Host during dinner — two different pay rates. Employers must blend the rates for overtime calculations.",
    },
    {
      title: "The commission earner",
      body: "A salesperson earns $18/hr plus a $200 commission. Working 50 hours, the commission spreads across all 50 hours, raising the regular rate and the overtime premium.",
    },
    {
      title: "Production bonuses",
      body: "Manufacturing jobs offer production bonuses or piece-rate pay. If the employee works overtime during a bonus week, the bonus must be included in the overtime calculation — this calculator handles it.",
    },
  ],
  faqs: [
    {
      question: "Can I pay overtime using the highest pay rate?",
      answer:
        "Yes — employers can use the highest rate. This gives employees more money and simplifies payroll, but businesses usually spend more. The weighted average gives a more exact result and follows FLSA rules correctly.",
    },
    {
      question: "What is the difference between discretionary and non-discretionary bonuses?",
      answer:
        "Non-discretionary bonuses are expected as part of the work agreement — commissions, attendance bonuses, or sales rewards like 'sell 10, get $50.' Employers must include them in overtime calculations. Discretionary bonuses are unexpected gifts — surprise holiday bonuses or random rewards — and are not included.",
    },
    {
      question: "Why does the calculator ask for a threshold?",
      answer:
        "Most U.S. employers pay overtime after 40 hours in one week, but some state laws or company agreements use different limits like 35 or 48 hours. The threshold field lets you adjust based on your local rules.",
    },
    {
      question: "Does this apply to salaried employees?",
      answer:
        "Usually no — most salaried employees are exempt from overtime. Some non-exempt salaried workers still qualify; in those cases a different method divides the salary by hours worked. This calculator mainly helps hourly employees with multiple pay rates.",
    },
    {
      question: "What happens if an employee works in two different states?",
      answer:
        "Different states follow different overtime laws. Employers usually follow the state where the employee worked, or whichever gives better pay. California, for example, uses daily overtime after 8 hours — this calculator follows the federal weekly (40-hour) standard under FLSA.",
    },
  ],
}
