import type { CalculatorDetail } from "../types"

export const payrollConversionCalculator: CalculatorDetail = {
  metaDescription:
    "Free payroll conversion calculator — convert pay between hourly, daily, weekly, bi-weekly, semi-monthly, monthly and annual with your own work schedule.",
  whenToUse: [
    "Payroll conversion turns one pay rate into another timeframe. For example, your job pays you by the hour, but your bank needs your yearly income for a loan application. These two numbers measure the same earnings in different ways, so you need to convert between them.",
    "The conversion works by scaling your rate up or down to match the new period. Start with your known rate, and work it into an annual figure first. Then break that number down into however many pay periods you need.",
  ],
  method: {
    title: "The Simple Formula",
    paragraphs: [
      "You can convert an hourly wage to an annual salary using a simple formula that is standard Work Year calculation. Usually, most full-time jobs run on a 40-hour week across 52 weeks a year.",
    ],
    equations: [
      {
        label: "Annual Salary",
        equation: "Annual Salary = Hourly Rate × Hours per Week × Weeks per Year",
      },
      {
        label: "A Simple Example",
        note: "Suppose a new job offer pays $20.00 per hour, with 40 hours per week across 52 weeks a year.",
        equation: "20 × 40 × 52 = $41,600 — your base annual salary",
      },
    ],
  },
  factGroups: [
    {
      title: "How This Calculator Works",
      intro:
        "The math looks simple but pay schedules like “Bi-Weekly” or “Semi-Monthly” can make things tricky. This calculator takes care of that complexity for you. Here is a look at the logic behind it, so you know what the results actually mean.",
      items: [
        {
          title: "Establishing the “Annual Base”",
          body: "The calculator starts by converting any number you enter into a single Annual Base figure. This gives the tool one consistent number to work from, regardless of the pay type you enter. Weekly amount multiplies by 52. Monthly amount multiplies by 12. Hourly amount multiplies by your total work hours (the default is 2,080 hours per year).",
        },
        {
          title: "The Work Schedule Assumptions",
          body: "Work schedules vary across people. A calculator provides advanced settings for different work patterns. These settings help adjust inputs to match each work setup. A standard setup uses 40 hours per week as the default — lower weekly hours reduce the yearly total in the calculation. The days per week setting helps measure daily pay. A worker who earns $50,000 per year and works 4 days each week earns more per day than a worker with the same income who works 5 days each week.",
        },
        {
          title: "Distributing to New Frequencies",
          body: "After the calculator finds the yearly amount, it uses that number to calculate other pay frequencies. Monthly: Annual ÷ 12. Semi-Monthly: Annual ÷ 24. Bi-Weekly: Annual ÷ 26. Weekly: Annual ÷ 52.",
        },
      ],
    },
    {
      title: "Important Facts About Pay Frequency",
      items: [
        {
          title: "Bi-Weekly and Semi-Monthly Are Not the Same",
          body: "Many workers confuse bi-weekly pay with semi-monthly pay. As both terms sound close, they do not work the same way. Bi-Weekly Pay: This pay system gives wages every two weeks — a year has 52 weeks, so this setup creates 26 paychecks in a year. Some months bring three paychecks because the schedule does not align evenly with the calendar months. Semi-Monthly Pay: Semi-monthly pay gives wages on fixed dates each month, such as the 1st and 15th. A year under this plan brings 24 paychecks in total. Semi-monthly paychecks often look larger — the yearly salary spreads across fewer payments, so each payment carries a higher amount.",
        },
        {
          title: "The Extra Day in the Calendar",
          body: "Payroll systems often use 52 weeks as a standard year. That method equals 364 days. A normal year contains 365 days where a leap year contains 366 days. That small gap can create an extra pay period for weekly or bi-weekly workers after some years. Some payroll systems adjust for that situation when it happens. This calculator uses the 52-week method to keep results steady and simple.",
        },
        {
          title: "Hourly Pay and Salary Work Differently",
          body: "Pay structure changes how income works. A calculator may still use standard formulas, but pay type affects the result. Salaried employees receive the same pay in each pay cycle — their base paycheck stays stable in most cases, and hours worked do not change the main salary amount. Hourly employees earn money based on hours worked — fewer shifts or unpaid leave reduce yearly income, and shorter work schedules also lower total pay. The calculator uses full scheduled hours for every pay period across the year. It assumes no gaps in work time and no unpaid periods.",
        },
      ],
    },
  ],
  useCases: [
    {
      title: "Comparing Job Offers",
      body: "Different employers often present pay in different formats. Job A pays $55,000 per year, while Job B pays $28 per hour. These numbers do not make an easy comparison at first. When you enter $28 per hour into the calculator, it converts the amount into an annual salary — the hourly position equals $58,240 per year based on a standard work schedule. This comparison helps you determine which offer pays more.",
    },
    {
      title: "Applying for an Apartment or Mortgage",
      body: "Property owners and lenders often ask for proof of income. Many rental applications require your monthly income to be a certain multiple of the rent. A landlord may require your monthly income to be three times the rent amount. If you earn $22 per hour, you may not know your monthly income right away. The calculator converts your hourly pay into a monthly figure that makes it easier to complete applications and confirm that you meet the income requirement.",
    },
    {
      title: "Building a Monthly Budget",
      body: "Household bills arrive every month — rent, utilities, internet service, and other expenses usually follow a monthly schedule. Your paycheck may arrive every week and this difference can make budgeting more difficult. The calculator turns weekly earnings into a monthly amount. It helps you compare income with monthly expenses. This makes it easier to track spending and plan ahead so money does not run short before the next paycheck arrives.",
    },
  ],
  faqs: [
    {
      question: "Does this calculator include taxes?",
      answer:
        "No. This calculator shows your gross income before any deductions. Taxes, insurance costs, and retirement contributions do not affect the results. Your take-home pay will usually be lower than the amount shown by the calculator.",
    },
    {
      question: "How many work hours are in a standard year?",
      answer:
        "Most employers use 2,080 hours as the standard number of work hours in a year. This number comes from a 40-hour workweek over 52 weeks. 40 hours × 52 weeks = 2,080 hours.",
    },
    {
      question: "Why does my paycheck differ from the calculator result?",
      answer:
        "Several factors can create a difference. Taxes and other deductions reduce the amount that reaches your bank account. Work hours can also change from week to week — you may work 39 hours one week and 41 hours the next. The calculator uses the same schedule for every week of the year, so actual paychecks may vary.",
    },
    {
      question: "What is the difference between a salary and a wage?",
      answer:
        "A salary gives a fixed yearly payment. It stays the same even when weekly work hours change — for example, $50,000 per year under a salary plan. A wage connects pay to time worked — for example, $20 per hour. This calculator helps compare both pay types on equal terms so people understand which option fits their needs better.",
    },
    {
      question: "Can I use this calculator for part-time work?",
      answer:
        "Yes. Part-time work works with this calculator. The tool handles both part-time and full-time jobs. Add weekly hours in the Work Schedule section. The calculator uses hours and hourly pay to find monthly and yearly income. For example, 20 hours per week at $15 per hour gives the income estimate for the month and year.",
    },
  ],
}
