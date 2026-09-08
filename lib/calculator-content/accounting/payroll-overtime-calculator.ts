import type { CalculatorDetail } from "../types"

export const payrollOvertimeCalculator: CalculatorDetail = {
  metaDescription:
    "Free payroll calculator with overtime — hourly rate with regular, overtime and double-time hours gives gross pay, effective rate and the full pay breakdown.",
  whenToUse: [
    "Payroll calculation means figuring out the total pay an employee earns over a set period. Most workers qualify for overtime once they cross 40 hours in a single workweek and that extra pay is called Overtime Pay.",
    "Overtime rewards employees for putting in longer hours. For employers, it also helps manage labor costs by making overwork more expensive.",
  ],
  method: {
    title: "The Core Formulas",
    paragraphs: [
      "Calculating overtime pay means splitting total hours into separate buckets, each with its own rate.",
    ],
    equations: [
      {
        label: "Regular Pay Formula",
        note: "In many areas, employers count up to 40 hours per week as regular hours.",
        equation: "Regular Pay = Regular Hours × Hourly Rate",
      },
      {
        label: "Overtime Pay Formula",
        equation: "Overtime Pay = Overtime Hours × (Hourly Rate × 1.5)",
      },
      {
        label: "Total Gross Pay",
        equation: "Total Pay = Regular Pay + Overtime Pay + Double Time Pay",
      },
      {
        label: "A Simple Example",
        note: "An employee earns $20 per hour and works 50 hours in one week: 40 regular hours and 10 overtime hours. Overtime rate: 20 × 1.5 = $30 per hour.",
        equation: "Total Check: (40 × $20) + (10 × $30) = $800 + $300 = $1,100",
      },
    ],
  },
  factGroups: [
    {
      title: "How This Calculator Calculates Pay",
      intro:
        "The calculator handles all calculations automatically, so there is less chance of mistakes. It follows common payroll rules and gives a quick breakdown of earnings.",
      items: [
        {
          title: "Pay Rate Multipliers",
          body: "Regular hours use the standard hourly wage. Regular pay uses 1.0 times the base hourly rate. Overtime pay uses 1.5 times the base hourly rate. Double-time pay uses 2.0 times the base hourly rate.",
        },
        {
          title: "Flexible Time Inputs",
          body: "The tool allows separate entries for overtime hours and double-time hours. Many employers pay double time under special conditions, such as holiday shifts or a seventh straight workday. Those payments can apply even when total weekly hours stay below a certain limit.",
        },
        {
          title: "The “Effective Rate”",
          body: "The result section includes an Effective Rate value and that number shows the average amount earned for each hour worked during the pay period. Extra overtime and double-time hours increase that average rate. As a result, the Effective Rate often ends up higher than the standard hourly wage and gives a better view of total earnings for the week.",
        },
      ],
    },
    {
      title: "Important Facts About Overtime",
      items: [
        {
          title: "The 40-Hour Rule",
          body: "Federal law in the United States, under the Fair Labor Standards Act (FLSA), sets a 40-hour limit as the standard workweek. Many other countries follow a similar structure. Employers calculate overtime for each individual week. They do not mix hours from different weeks. A worker who completes 30 hours in the first week and 50 hours in the second week earns overtime in the second week. The second week includes 10 overtime hours. Employers do not average the hours across both weeks or treat them as equal.",
        },
        {
          title: "Double Time Depends on Company Rules",
          body: "Many workers think Sunday or holiday shifts always come with double time pay. Federal law does not require employers to pay double time for weekends or holidays. A company can offer it as part of its own policy, or a union agreement can include it as a benefit. For that reason, this calculator includes a double time option for people who receive that type of pay.",
        },
        {
          title: "Overtime Does Not Have a Special Tax Rate",
          body: "Many people also believe the government taxes overtime at a higher rate. That is not how the tax system works. Overtime counts as regular income and follows the same tax rules as normal wages. A larger paycheck can lead to a bigger amount of tax withholding for that pay period. In many cases, employees receive any extra withholding back after they file their yearly tax return.",
        },
      ],
    },
  ],
  useCases: [
    {
      title: "Verifying Your Pay Stub",
      body: "Payroll mistakes happen more often than most people expect. If a paycheck looks short, run the numbers manually with this calculator. Enter the hours worked and the hourly rate to see if the gross pay matches the stub.",
    },
    {
      title: "Deciding to Take an Extra Shift",
      body: "A Saturday shift might feel like a burden until the numbers tell a different story. Enter those extra 8 hours into the Overtime field and see the actual dollar value. Finding out that shift pays $300 instead of the usual $200 makes the decision a lot easier.",
    },
    {
      title: "Budgeting with Variable Income",
      body: "Hours that change every week make budgeting a real challenge. Run the numbers for both a heavy week and a light week to see the income range. That range gives a solid foundation for planning savings and covering monthly expenses.",
    },
  ],
  faqs: [
    {
      question: "Does this calculator show taxes?",
      answer:
        "No. The calculator only shows gross pay before taxes. In contrast, Net pay, which is take-home income, changes based on tax rates, state rules, retirement contributions, health insurance, and other payroll deductions. These factors differ from person to person, so the tool does not estimate net pay.",
    },
    {
      question: "What if I am a salaried employee?",
      answer:
        "Many salaried employees do not qualify for overtime pay. They receive the same amount each pay period. Some salaried positions still qualify for overtime under labor laws. An HR department or employer can explain which rules apply to a specific job.",
    },
    {
      question: "How is overtime calculated if I get a bonus?",
      answer:
        "Bonuses add a layer of complexity through something called the “Regular Rate of Pay.” A non-discretionary bonus, like a production bonus, must fold into the base pay before calculating the overtime rate. This calculator works from the base hourly rate only, so manual adjustment is needed for bonus-inclusive scenarios.",
    },
    {
      question: "What counts as “Hours Worked”?",
      answer:
        "Hours worked covers all time an employee is required to be on duty. Paid time off, sick days, and vacation days typically don’t count. If you take one vacation day (8 hours) and work 34 hours adds up to 42 on paper, the overtime won’t apply because the actual hours on duty is under 40 hours.",
    },
    {
      question: "Can I use this for bi-weekly payroll?",
      answer:
        "Yes. A bi-weekly pay schedule works with the calculator. Select the bi-weekly option or enter the total hours from both weeks. Remember that overtime still depends on the hours worked in each individual week, not the combined total for the full two-week period.",
    },
  ],
}
