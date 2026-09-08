import type { CalculatorDetail } from "../types"

export const grossUpPayrollCalculator: CalculatorDetail = {
  metaDescription:
    "Free gross-up payroll calculator — target net pay with federal, state, local and FICA tax rates gives the exact gross pay so employees take home what you promised.",
  formula: "Gross Pay = Net Pay ÷ (1 − Total Tax Rate)",
  whenToUse: [
    "The government takes a portion in taxes from every payment you send to your employee before the money hits their bank account. A gross-up adds extra money to the payment so the employee receives the exact amount you promised after taxes.",
  ],
  method: {
    title: "The Simple Formula",
    paragraphs: [
      "To find the gross amount, divide the net pay you want the employee to receive by the percentage they keep after taxes.",
    ],
    equations: [
      {
        label: "Example",
        note: "You want to give an employee a $100 bonus. The total tax rate is 25% (0.25), so the employee keeps 75%.",
        equation: "Gross Pay = 100 ÷ 0.75 = $133.33 · Government takes $33.33 · Employee gets exactly $100",
      },
    ],
  },
  factGroups: [
    {
      title: "How This Calculator Works",
      intro:
        "This calculator handles the math for you. It uses several key inputs to determine the total amount you need to pay so an employee receives a specific amount after taxes.",
      items: [
        {
          title: "Target Net Pay",
          body: "This amount serves as your goal. It represents the exact amount of money you want the employee to receive.",
        },
        {
          title: "Supplemental Tax Rates",
          body: "Bonuses follow different tax rules than a regular paycheck. The IRS applies a flat 22% withholding rate to supplemental wages, such as bonuses, when wages are below the $1 million mark. Regular paychecks use standard tax brackets instead — the calculator loads the 22% rate automatically so you don’t have to enter it manually.",
        },
        {
          title: "FICA Taxes (Social Security & Medicare)",
          body: "Almost every paycheck carries FICA taxes, separate from income tax. Social Security: 6.2%. Medicare: 1.45%. Total FICA: 7.65%.",
        },
        {
          title: "State & Local Taxes",
          body: "Your employee’s location determines any extra withholding requirements. You can enter custom state and local tax rates directly into the calculator to get a precise figure.",
        },
      ],
    },
    {
      title: "Important Facts about Grossing Up",
      items: [
        {
          title: "It Costs Employers More",
          body: "Grossing up sounds great for employees, but it puts a bigger dent in your payroll budget. Covering an employee’s taxes can push the total bonus cost up by 30% to 40%. Plan your budget with that extra amount in mind.",
        },
        {
          title: "It Affects W-2 Income",
          body: "The employee takes home the net amount, but the IRS sees the full gross figure. That gross amount goes on the employee’s W-2 at year-end as taxable income. The taxes you covered on their behalf count as part of their total earnings.",
        },
      ],
    },
  ],
  useCases: [
    {
      title: "Performance Bonuses",
      body: "Promising a top performer a $5,000 bonus feels great. But a standard paycheck reduces that amount to around $3,500 after taxes. Run the numbers through this calculator so your employee walks away with the full $5,000 in hand.",
    },
    {
      title: "Relocation Stipends",
      body: "New hires often receive a moving allowance to cover relocation costs. Taxes can shrink that amount fast, leaving them short when the movers show up. A gross-up keeps the full amount intact so they can cover every expense without stress.",
    },
    {
      title: "Service Awards & Gifts",
      body: "Cash gifts for work anniversaries count as taxable income. That means a $500 gift for a 10-year milestone could land as a smaller deposit than expected. A gross-up calculation fixes that so the reward actually feels like one.",
    },
  ],
  faqs: [
    {
      question: "Is grossing up mandatory?",
      answer:
        "No, employers choose this option voluntarily. Most companies skip it for regular bonuses. Employers typically use it for special gifts, one-time perks, or contracted net pay amounts — for example, a “Net $5,000 sign-on bonus.”",
    },
    {
      question: "Why is the default Federal rate 22%?",
      answer:
        "The IRS treats bonuses as supplemental wages. It requires a flat 22% withholding rate on these payments for most employees. This makes the math simpler than applying the standard progressive tax brackets used for regular salaries.",
    },
    {
      question: "Can I use this for a regular salary?",
      answer:
        "You can, but it rarely makes sense. Employers usually negotiate regular salaries as gross amounts — such as $60,000 per year. Gross-up calculations work best for one-time payments where the employee needs to receive a specific net amount.",
    },
    {
      question: "What about 401(k) deductions?",
      answer:
        "This calculator only handles mandatory taxes. Voluntary deductions like 401(k) contributions typically come out after the gross-up calculation. Some companies leave them out entirely for separate bonus checks, depending on their payroll policy.",
    },
    {
      question: "Does the employee have to pay taxes later?",
      answer:
        "The gross-up covers the estimated withholding amount. If the employee lands in a higher tax bracket at year-end, they may owe a small difference when they file their annual tax return.",
    },
  ],
}
