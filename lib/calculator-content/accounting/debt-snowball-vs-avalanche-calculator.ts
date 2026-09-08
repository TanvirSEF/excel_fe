import type { CalculatorDetail } from "../types"

export const debtSnowballVsAvalancheCalculator: CalculatorDetail = {
  metaDescription:
    "Free debt snowball vs avalanche calculator — enter balances, rates and payments to see which payoff strategy clears your debt faster and saves the most money.",
  whenToUse: [
    "If you only pay the minimum amount on several debts each month, you may stay in debt for a long time. A payoff plan can help you take control and clear your balances faster. Most people use one of two methods such as the Debt Snowball Method or the Debt Avalanche Method.",
  ],
  method: {
    title: "How This Calculator Works",
    paragraphs: [
      "This calculator works like a virtual payment schedule. It tracks your payments month by month and compares both payoff methods at the same time. Here is the basic process behind the calculator:",
    ],
    equations: [
      {
        label: "The Monthly Markup Formula",
        note: "For each liability you enter, the calculator calculates the monthly cost added to the balance. The calculator adds this cost to your balance first. Then it subtracts your monthly payment.",
        equation: "Monthly Cost = Current Balance × Annual Rate ÷ 12",
      },
      {
        label: "The Rollover Effect (The Snowball)",
        note: "This step helps you pay off debt faster. After you clear one liability, you move that payment amount to the next debt instead of keeping the money. Your payment grows each time you pay off a debt. This process helps you reduce balances faster.",
        equation: "New Payment = Old Minimum Payment + Freed Up Cash + Extra Budget",
      },
      {
        label: "The Timeline Projection",
        note: "The calculator repeats this process every month until all balances reach zero. It also tracks the total number of months and the total markup or fees you pay. Then it compares the final results for both methods.",
        equation: "Repeat monthly until every balance reaches zero",
      },
    ],
  },
  factGroups: [
    {
      title: "Snowball vs. Avalanche: Understanding the Strategies",
      items: [
        {
          title: "The Debt Snowball Method",
          body: "The snowball method focuses on motivation and steady progress. You arrange your debts from the smallest balance to the largest balance. Interest rates do not matter in this method. The goal: You pay the minimum amount on every debt. Then you put any extra money toward the smallest balance first. The result: You pay off one debt on time — that early success can help you stay motivated and stick to your plan.",
        },
        {
          title: "The Debt Avalanche Method",
          body: "The avalanche method focuses on saving money over time. You arrange your debts from the highest interest rate to the lowest interest rate. The goal: You pay the minimum amount on every debt — then you put extra money toward the debt with the highest interest rate first. The result: You reduce your total interest costs and save more money over time because you tackle the most expensive debt first.",
        },
        {
          title: "A Simple Example",
          body: "Imagine that you have these two liabilities: Card A with a $500 balance at a 5% rate, and Card B with a $2,000 balance at a 20% rate. With the Snowball method, you would pay off Card A first because $500 is smaller than $2,000. With the Avalanche method, you would pay off Card B first because 20% of the balance is much more than 5% of the balance.",
        },
      ],
    },
    {
      title: "Important Facts About Payoff Strategies",
      items: [
        {
          title: "Behavior vs. Math",
          body: "Many people debate which payoff method works better: Snowball or Avalanche. In most cases, the Avalanche method saves more money because you pay off high-interest debt first. At the same time, the Snowball method can help people stay motivated. A study from the Harvard Business Review found that people with large amounts of debt often stick to their plans when they pay off smaller balances early. Quick progress can build confidence and help people keep going.",
        },
        {
          title: "The Power of Extra Payments",
          body: "Your extra monthly payment matters more than the payoff order itself. Even a small extra payment can make a big difference over time. If you only pay the minimum amount each month, you may stay in debt for 10 or 20 years. When you add an extra $50 or $100 each month, you can pay off debt much faster. You can also save thousands of dollars in interest over time.",
        },
      ],
    },
  ],
  useCases: [
    {
      title: "Organizing a Messy Financial Life",
      body: "It is hard to stay organized when you have several payments at the same time. You may have a car payment, two credit cards, and a personal loan. That can feel stressful and confusing. This calculator helps you place all your debts in one list. You can see how much you owe and decide which balance to pay first. A simple plan can make your debt feel easier to manage.",
    },
    {
      title: "Planning a Bonus or Tax Refund",
      body: "A work bonus or tax refund can help you reduce debt faster. You can enter that extra amount into the calculator by using the “One-Time Windfall” feature. The tool shows how much time and money you can save with a larger payment. In some cases, putting $1,000 toward debt today could save you $500 in future interest charges.",
    },
    {
      title: "Couples Financial Planning",
      body: "Money problems can create stress in a relationship. One person may want to pay off the smallest debt first with the Snowball method. The other person may want to cut interest costs with the Avalanche method. This calculator helps both people compare the results side by side. A small difference in cost, such as $50, may make the Snowball method feel like the better choice. A large difference, such as $2,000, may encourage both people to choose the Avalanche method instead.",
    },
  ],
  faqs: [
    {
      question: "Which method is better: Snowball or Avalanche?",
      answer:
        "Your goal decides the answer. Pick the Avalanche method to save the most money overall. Pick the Snowball method if you feel overwhelmed or struggle to stay motivated — it clears your smallest debts fast and keeps you moving forward.",
    },
    {
      question: "Does the Snowball method hurt my credit score?",
      answer:
        "No, it does not. Keep making the minimum payments on all your accounts on time — and your score stays safe. Both methods actually improve your score over time because they lower your Credit Utilization Ratio — the amount you owe compared to your total limit.",
    },
    {
      question: "Can I switch strategies in the middle?",
      answer:
        "Yes, many people do. Some start with the Snowball method to knock out one or two small debts and get a quick win. Once they feel confident and free up some cash, they switch to the Avalanche method to hit the high-interest loans harder.",
    },
    {
      question: "What happens if I miss a payment?",
      answer:
        "A missed payment usually triggers a late fee — and your balance grows. If an emergency hits and you cannot pay the extra amount, at least cover the minimums on all accounts to protect your credit standing.",
    },
    {
      question: "Should I save or pay off debt first?",
      answer:
        "Build a small emergency fund first — around $1,000 works well. This stops you from borrowing more money when something unexpected comes up, like a flat tire or a broken appliance. Once you have that safety net in place, put your extra money toward your debt payoff plan.",
    },
  ],
}
