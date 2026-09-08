import type { CalculatorDetail } from "../types"

export const marginalPropensityToConsumeCalculator: CalculatorDetail = {
  metaDescription:
    "Free MPC calculator — change in income and change in spending give your marginal propensity to consume, saving propensity and the multiplier effect.",
  whenToUse: [
    "Marginal Propensity to Consume, or MPC, shows how people handle extra money. It tells how much of new income someone spends.",
    "Think you find a $10 bill on the street. You spend $7 on a sandwich and save $3 — your MPC is 0.7. If you save all $10, your MPC is 0. If you spend $10 and also borrow $5 to buy a toy, your MPC is 1.5.",
  ],
  method: {
    title: "The Formula",
    paragraphs: [
      "The formula is simple — it compares the change (∆) in two key things:",
    ],
    equations: [
      {
        label: "MPC",
        equation: "MPC = Change in Spending ÷ Change in Income",
        terms: [
          {
            name: "∆C (Change in Consumption)",
            description: "How much more did you spend than before?",
          },
          {
            name: "∆Y (Change in Income)",
            description: "How much extra money did you earn?",
          },
        ],
      },
      {
        label: "Example",
        note: "You get a $1,000 raise. You spend $800 on a vacation and save $200. This means you spend 80 cents out of every extra dollar you earn.",
        equation: "MPC = 800 ÷ 1000 = 0.8",
      },
    ],
  },
  factGroups: [
    {
      title: "Understanding the Calculator Results",
      intro:
        "This calculator gives you three important numbers. Each number shows how you use your money.",
      items: [
        {
          title: "MPC (The Spender Score)",
          body: "This number usually stays between 0 and 1. High MPC (> 0.8): It shows you are a big spender. Many low-income families have a high MPC because they spend most of their income on basic needs like rent, food, and gas. Low MPC (< 0.5): That means you are a saver. Mostly, wealthy people have a low MPC. If a billionaire earns an extra $1,000, they may not spend it because they already own most things they need.",
        },
        {
          title: "MPS (Marginal Propensity to Save)",
          body: "MPS shows how much money you save instead of spend. Since people usually spend or save their money, MPC and MPS always add up to 1. If your MPC is 0.8, your MPS is automatically 0.2 (20%).",
        },
        {
          title: "The Multiplier Effect (k)",
          body: "Economists use this number to measure how spending moves through the economy. If you spend $100 at a grocery store, the store owner earns $100. The owner may spend $80 of that money at a mechanic. Then the mechanic may spend $60 somewhere else. A high MPC creates a high multiplier — that means money moves faster through the economy and supports more businesses.",
        },
      ],
    },
    {
      title: "Important Facts About MPC",
      items: [
        {
          title: "It Drives Government Policy",
          body: "Governments use MPC to influence economic activity — especially during a recession. When the economy slows down, they often send stimulus checks to encourage consumer spending. A high MPC supports economic growth because people spend money — which increases business sales and creates more jobs. Low MPC slows that cycle because people hold onto the money instead. This is why stimulus payments often go to lower-income groups, since they tend to spend a larger share of extra income.",
        },
        {
          title: "It Declines as You Get Richer",
          body: "Economists call this the Keynesian psychological law — it says spending habits change as income grows. A person with low income may use an extra $100 for basic needs like food or bills. On the other hand, a person with higher income may not feel much change from that same $100 — so they may save it instead. As income grows, people spend a smaller share of each extra dollar. Their spending still rises, but it grows slower than income.",
        },
        {
          title: "It Can Be Greater Than 1",
          body: "MPC can sometimes exceed 1, even though that sounds unusual. This happens when someone spends more than their extra income. For example, a person receives a $1,000 bonus and then uses it as a down payment on a $5,000 car loan — that decision leads to total spending that exceeds the income received, since borrowing adds to consumption.",
        },
      ],
    },
  ],
  useCases: [
    {
      title: "Personal Budgeting",
      body: "Many people fall into lifestyle creep without noticing it. Income rises, but savings stay flat because spending rises too. This calculator helps track that behavior. If your MPC sits around 0.9, most of every raise goes straight into spending. That leaves little room to build savings or long-term wealth. A lower MPC, closer to 0.5 or below, supports stronger financial control over time.",
    },
    {
      title: "Business Forecasting",
      body: "Business owners need to understand how willing customers feel to spend. That sentiment shifts through the year. MPC often rises during holidays or tax refund season when people spend more freely. Companies use this pattern to plan product launches, promotions, and sales timing. A clear view of spending behavior helps improve demand forecasts and pricing decisions.",
    },
    {
      title: "Economics Homework",
      body: "MPC appears early in macroeconomics, often in the first introductory courses. It forms the base for models like IS-LM and helps explain aggregate demand. This calculator also helps check answers for multiplier problems — it gives a simple way to test calculations and build a stronger understanding of the concept.",
    },
  ],
  faqs: [
    {
      question: "Is a high MPC bad?",
      answer:
        "A high MPC can risk you as an individual because it means you spend most of your income and save very little for emergencies. At the same time, a high MPC helps the economy — it keeps money moving, supports business growth, and creates jobs. This creates a clear tension: what benefits the economy can put pressure on personal finances.",
    },
    {
      question: "Can MPC be negative?",
      answer:
        "In rare cases, yes. MPC turns negative when income rises but spending falls at the same time. This usually happens when people expect trouble ahead and choose to save more instead of spending extra income. Economists call this precautionary saving.",
    },
    {
      question: "How does inflation affect MPC?",
      answer:
        "Inflation often increases MPC. When people expect prices to rise, they prefer to spend money now rather than later. In extreme cases like hyperinflation, this effect becomes stronger. That’s why people rush to buy goods because cash loses value fast.",
    },
    {
      question: "What is the difference between MPC and APC?",
      answer:
        "Both measure spending behavior — but they focus on different things. APC: Total spending divided by total income. It shows overall spending habits. MPC: Change in spending divided by change in income. It shows how people respond to new income. MPC gives a better view of future behavior because it tracks reactions to extra money.",
    },
  ],
}
