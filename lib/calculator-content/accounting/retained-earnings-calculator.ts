import type { CalculatorDetail } from "../types"

export const retainedEarningsCalculator: CalculatorDetail = {
  metaDescription:
    "Free retained earnings calculator — beginning balance, net income and dividends give your ending retained earnings, net change and equity status.",
  whenToUse: [
    "Retained earnings show the profit a company keeps after dividend payments. Think about a small lemonade stand business. At the end of the day, you count the money you earned — this amount becomes your net income. Now you have two options:",
    "Pocket the money: You can take some money home. This payment works like a dividend. Keep the money in the stand: You can keep the money in the business — like buying more lemons or a bigger sign next time. This saved amount becomes retained earnings.",
  ],
  method: {
    title: "The Formula",
    paragraphs: [
      "The formula follows a simple process — start with your current balance, then you add profit and subtract dividends.",
    ],
    equations: [
      {
        label: "REEnd",
        equation: "REEnd = REBegin + Net Income − Dividends",
        terms: [
          {
            name: "REBegin",
            description: "It means the balance at the start of the year.",
          },
          {
            name: "Net Income",
            description: "Total profit after expenses.",
          },
          {
            name: "Dividends",
            description: "Money paid to owners or shareholders.",
          },
        ],
      },
      {
        label: "Example",
        note: "Your business starts with $10,000 in retained earnings, earns $5,000 in profit this year, and you pay yourself $2,000 as dividends.",
        equation: "10,000 + 5,000 − 2,000 = $13,000",
      },
    ],
  },
  parameters: {
    title: "Understanding the Inputs",
    intro:
      "You need three numbers to use the calculator correctly. You can find these numbers in your financial statements.",
    items: [
      {
        name: "Beginning Retained Earnings",
        description:
          "This number shows your starting balance. A new business usually starts with $0. Older businesses can find this amount in the Balance Sheet under “Shareholder’s Equity.”",
      },
      {
        name: "Net Income (or Loss)",
        description:
          "This number shows the final profit from your Income Statement. It includes the money left after rent, salaries, taxes, and supply costs. Enter a negative number if your business lost money this year. A loss will reduce your retained earnings.",
      },
      {
        name: "Dividends Paid",
        description:
          "This amount shows money paid to the business owners. Small business owners can include draws or salary distributions here if payroll does not include them.",
      },
    ],
  },
  factGroups: [
    {
      title: "3 Important Facts About Retained Earnings",
      items: [
        {
          title: "It is NOT the Same as Cash",
          body: "Many people confuse retained earnings with cash. A company may show $100,000 in retained earnings — that amount does not mean the business holds $100,000 in the bank. The company may use that money for a new factory, delivery truck, or inventory. Retained earnings track business value, not cash.",
        },
        {
          title: "It Accumulates Forever",
          body: "Retained earnings stay active for the company’s entire life. The balance does not return to zero each new year. Revenue and expense accounts work differently. The balance can grow or shrink over time. Retained earnings show the financial history of the business.",
        },
        {
          title: "It Can Go Negative (The Deficit)",
          body: "A company can lose money for several years in a row. In that case, retained earnings can become negative. Accountants call this amount an “Accumulated Deficit.” This result warns investors about weak business growth.",
        },
      ],
    },
  ],
  useCases: [
    {
      title: "Creating a Balance Sheet",
      body: "Accountants prepare a “Statement of Retained Earnings” every year. This calculator helps you complete that calculation quickly. You need this final amount to balance your Balance Sheet: Assets = Liabilities + Equity.",
    },
    {
      title: "Deciding on Dividends",
      body: "Suppose your business may earn a large profit this year and you want to reward shareholders with dividends. This calculator helps you test different payout amounts. For example, you can check exactly how much money stays with the business after dividends. That way, you set a limit that keeps everyone happy without affecting the company.",
    },
    {
      title: "Applying for a Bank Loan",
      body: "Banks often prefer companies with strong retained earnings. High retained earnings show steady profits and careful money management. Before meeting a loan officer, you can enter your numbers here and review your retention ratio.",
    },
  ],
  faqs: [
    {
      question: "Is higher retained earnings always better?",
      answer:
        "In most cases, yes. Higher retained earnings show stronger financial health. Still, very high balances can raise questions from investors. They may expect the company to use that money for business growth or dividend payments.",
    },
    {
      question: "Does net loss affect retained earnings?",
      answer:
        "Yes. A net loss lowers retained earnings. For example, you may start with $10,000 and lose $3,000 — your new balance becomes $7,000. The calculator updates the result automatically when you enter a negative income.",
    },
    {
      question: "Are retained earnings taxed?",
      answer:
        "No. Companies pay taxes on net income — not on retained earnings. Companies also avoid extra shareholder taxes when they keep profits inside the business instead of paying dividends.",
    },
    {
      question: "Where do I find this on my financial statements?",
      answer:
        "You can find retained earnings on the Balance Sheet. This amount appears under the “Shareholder’s Equity” or “Owner’s Equity” section. In many cases, it sits below “Common Stock.”",
    },
  ],
}
