import type { CalculatorDetail } from "../types"

export const proratedBonusCalculator: CalculatorDetail = {
  metaDescription:
    "Free prorated bonus calculator — full bonus amount, period dates and employment dates give your exact prorated bonus, eligible days and proration percentage.",
  whenToUse: [
    "A prorated bonus is a bonus payment for an employee who worked only part of the bonus period. Many companies give bonuses once a year to reward employees for their work. If you joined the company in July, you would not receive the same bonus as someone who has worked since January. Instead, the company calculates your bonus based on the amount of time you worked during the year.",
    "The idea is simple. You earn a bonus for the days you worked. For example, if you worked half of the year, you would usually receive half of the full bonus amount.",
  ],
  method: {
    title: "Formula for Calculating Prorated Bonus",
    paragraphs: [
      "The formula uses three numbers: the full bonus amount, the total days in the year, and the days you worked.",
    ],
    equations: [
      {
        label: "Your Bonus",
        equation: "Bonus = Full Bonus Amount × (Days You Worked ÷ Total Days in Period)",
      },
      {
        label: "A Simple Example",
        note: "Your company offers a $12,000 bonus for a full year of work (365 days). You joined on July 1st, so you worked roughly half the year — about 182 days.",
        equation: "Bonus = $12,000 × (182 ÷ 365) = $12,000 × 0.5 = $6,000",
      },
    ],
  },
  factGroups: [
    {
      title: "How the Calculator Math Works",
      intro:
        "Payroll rules often look simple — but real cases can get complex. This calculator breaks the process into clear steps and gives you an exact result.",
      items: [
        {
          title: "Setting the Bonus Period",
          body: "A company defines a fixed time range for the bonus. Many companies use January 1 to December 31. Some companies use a different cycle called a fiscal year — one example runs from April 1 to March 31. The calculator asks for a start date and an end date. It uses these dates to find the total number of days in the full bonus period — most periods have 365 days and a leap year has 366 days.",
        },
        {
          title: "Counting Eligible Days",
          body: "The tool checks your work dates against the bonus period, then counts the days you qualify for. You receive full credit if you worked through the entire period. If you joined after the period began, you receive partial credit — the tool counts days from your start date to the end date. If you left before the period ended, you receive credit only up to your last day.",
        },
        {
          title: "Applying the Performance Rate",
          body: "The calculator includes a payout percentage field. This value changes the final bonus amount. Some companies reduce the bonus if company results stay low. Some companies increase the bonus when performance stays strong. The calculator multiplies your prorated bonus by this percentage to show your final payout.",
        },
      ],
    },
    {
      title: "Important Facts About Prorated Bonuses",
      items: [
        {
          title: "The Cliff Date Matters",
          body: "Many job contracts include a cutoff date called a cliff or eligibility date. A company may state that employees hired after a certain date cannot receive that year’s bonus. For example, a company may set October 1 as the cutoff — anyone hired after that date receives no bonus for that year. Even if a calculator shows a partial amount based on days worked, company rules can override that result. Always check your offer letter or employee handbook. If the calculator shows a number but your manager says zero — you likely joined after the cutoff date.",
        },
        {
          title: "Active Employment Rules",
          body: "Most bonus plans require active employment on the payout date. A bonus period may end on December 31, but the company may pay the bonus on March 15 of the next year. An employee may work the full year and then resign on February 1. That employee can lose the entire bonus because they did not stay employed on the payout date. A calculator can show earned value, but company policy decides payment.",
        },
        {
          title: "Salary and Bonus Are Not the Same",
          body: "A prorated bonus works differently from a prorated salary. Salary is paid for work based on time, while bonuses do not follow the same rule. Companies often treat a bonus as optional pay. A calculator can show a bonus amount, but that amount does not guarantee payment — so the contract must clearly state the bonus terms for it to become a fixed right.",
        },
      ],
    },
  ],
  useCases: [
    {
      title: "Negotiating a New Job Offer",
      body: "A recruiter may offer a $20,000 yearly bonus when you start a new job. That number can sound very attractive at first. If you begin work in September, you will not earn the full yearly bonus — you may receive about $6,600 based on your remaining work period. This tool helps you see that amount before you accept the offer. You can use this information to ask for a sign-on bonus to balance the lower yearly bonus.",
    },
    {
      title: "Planning a Resignation",
      body: "Job changes need careful timing. You may plan to leave your job in November and expect a yearly bonus. Your bonus outcome depends on your company rules. Some companies offer a partial payout after resignation, while others do not. You can use this calculator to check the amount you may lose if you leave early. A few extra weeks or months at work can make a big difference in your final payout.",
    },
    {
      title: "Taking Unpaid Leave",
      body: "Unpaid leave can affect your yearly bonus. This may include long travel plans or personal breaks that last around three months. Your employment status may stay active, but your work period reduces during that time. You can enter your dates in the calculator to see how that gap changes your bonus — this helps you plan your time off with better financial awareness.",
    },
  ],
  faqs: [
    {
      question: "Do I get a prorated bonus if I lose my job through firing or layoff?",
      answer:
        "The answer depends on your company rules and your reason for leaving. If a company lays you off because of lack of work, many employers still pay a prorated bonus. Some companies include it in a severance package. If a company fires you for poor performance or rule violations, you usually lose the bonus — even if you worked most of the year.",
    },
    {
      question: "Does the calculation use base salary or total pay?",
      answer:
        "Most companies use your base salary to set the bonus amount. For example, a $100,000 salary with a 10% bonus target gives a $10,000 full bonus — the prorated amount comes from that $10,000 figure. Companies normally do not include overtime or extra benefits unless your contract says so.",
    },
    {
      question: "Why does my payment look lower than the calculator result?",
      answer:
        "The calculator shows your gross bonus before taxes. Tax rules treat bonuses as extra income, so employers take tax from the payment before you receive it. In many cases, employers apply a flat tax rate at payment time — so a $5,000 bonus can turn into $3,500 or $4,000 in your bank account.",
    },
    {
      question: "Does the calculator handle leap years?",
      answer:
        "Yes, the calculator adjusts for leap years. It counts the exact number of days between your start date and end date. If your time period includes a leap year with 366 days — the result still stays accurate.",
    },
    {
      question: "Can I use this tool for quarterly bonuses?",
      answer:
        "Yes, you can use it for any bonus period. You only need to set the start and end dates for the quarter you want. For example, you can enter January 1 to March 31 for a first-quarter bonus. The calculator then uses those dates to find your prorated amount.",
    },
  ],
}
