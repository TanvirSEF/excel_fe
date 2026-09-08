import type { CalculatorDetail } from "../types"

export const savingsWithdrawalCalculator: CalculatorDetail = {
  metaDescription:
    "Free savings withdrawal calculator — savings, withdrawals, investment returns and inflation give how long your money lasts, total withdrawn and your withdrawal rate.",
  whenToUse: [
    "A drawdown strategy is a plan for spending down your savings over time. The goal is to balance two things. You need cash available now, and you need your money to last long enough.",
    "Many basic calculators ignore changes in living costs and investment growth. This calculator includes Inflation and Investment Returns in the estimate. It gives you a more practical view of your withdrawal period.",
  ],
  method: {
    title: "Key Factors That Affect Your Money",
    paragraphs: [
      "Withdrawal Rate: This is how much you take out each year. Taking out 10% a year means your money lasts about 10 years. Dropping that to 4% could stretch it to 30 years or more.",
      "Growth Rate: Your remaining savings should keep working for you. Investing in stocks, or real estate generates returns. Those returns slow down how fast your savings shrink.",
      "Inflation: Inflation quietly eats into your budget over time. A $2,000 monthly budget today could cost $3,000 in 15 years. Our calculator adjusts your withdrawals each year to keep up with rising costs.",
    ],
  },
  parameters: {
    title: "How to Use This Calculator",
    items: [
      {
        name: "Total Savings",
        description: "Your current “Nest Egg” or portfolio value.",
      },
      {
        name: "Withdrawal Amount",
        description:
          "The cash you need to transfer to your checking account per period (e.g., $4,000/month).",
      },
      {
        name: "Annual Return (%)",
        description:
          "The net return your remaining savings earn. A conservative estimate for a balanced portfolio is 4-6%.",
      },
      {
        name: "Inflation Rate (%)",
        description:
          "The rate at which you increase your withdrawal. Standard practice is 3%.",
      },
    ],
  },
  factGroups: [
    {
      title: "Understanding the Results",
      items: [
        {
          title: "Duration",
          body: "This shows how long your savings will last before the balance reaches zero.",
        },
        {
          title: "Total Withdrawn",
          body: "This number is often higher than your starting savings. That happens because your money keeps growing in the background. It earned returns even as you were spending it down.",
        },
        {
          title: "Sustainable vs. Depleting",
          body: "Sometimes your return rate is higher than your withdrawal rate. For example, earning 7% but only withdrawing 4% means your savings grow faster than you spend. In that case, the calculator shows “100+ Years.” This is what financial independence looks like in practice.",
        },
      ],
    },
    {
      title: "Global Investment Context: Withdrawal Benchmarks",
      items: [
        {
          title: "United States (USA)",
          body: "The most well-known rule in the US is the 4% Rule, which comes from the Trinity Study. It says you can withdraw 4% of your savings in your first year of retirement. After that, you adjust that amount for inflation each year. Studies show this gives you a 95% chance of not running out of money over 30 years. Many US retirees use this calculator to check if their 401(k) and IRA balances can support that rate.",
        },
        {
          title: "United Kingdom (UK)",
          body: "UK retirees got more freedom after the Pension Freedoms reform. They no longer have to buy annuities. However, inflation in the UK tends to run higher than in the US. Because of that, many financial advisors in London recommend a more careful withdrawal rate of 3% to 3.5%. This helps account for higher living costs in the British market.",
        },
        {
          title: "Canada (CAN)",
          body: "Canadian retirees need to follow RRIF rules. At age 71, you must convert your RRSP into a Registered Retirement Income Fund. The government then sets minimum withdrawal amounts, starting at around 5.28% and going up as you age. This calculator helps Canadians check if those required withdrawals will drain their savings too fast.",
        },
        {
          title: "Australia (AUS)",
          body: "Australians with an account-based pension through their superannuation must also follow minimum drawdown rates. The rate starts at 4% for those under 65 and rises to 5% for ages 65 to 74. This calculator helps you plan what to do with the extra money if the government requires you to withdraw more than you actually need.",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "Why does inflation reduce the savings duration?",
      answer:
        "Inflation increases your future living costs over time. For example, a $2,000 withdrawal today may become $2,060 next year with 3% inflation. Higher withdrawals can reduce your savings faster.",
    },
    {
      question: "Can I use this calculator for a cash savings account?",
      answer:
        "Yes. Set the “Est. Annual Profit” value to 0%. The calculator will then show how long your cash savings may last without investment growth.",
    },
    {
      question: "What is a safe withdrawal rate?",
      answer:
        "Many financial planners suggest a withdrawal rate between 3.5% and 4% for retirement. Higher withdrawal rates can drain savings faster. Rates above 5% may increase the risk of running out of money early unless your investments earn strong returns.",
    },
  ],
}
