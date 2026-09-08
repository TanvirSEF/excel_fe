import type { CalculatorDetail } from "../types"

export const irrCalculator: CalculatorDetail = {
  metaDescription:
    "Free IRR calculator — initial investment and year-by-year cash flows give the exact internal rate of return, total net profit and ROI.",
  whenToUse: [
    "The Internal Rate of Return (IRR) measures the profitability of a potential investment. It finds the discount rate that makes the Net Present Value (NPV) of all project cash flows equal to zero.",
    "Think of IRR as the “Break-Even Interest Rate.” If you borrowed money at the IRR percentage to fund a project, the project would generate enough cash to repay the loan and interest. It would leave zero profit after that. So if the IRR exceeds your actual cost of capital, the project makes money.",
  ],
  method: {
    title: "The Formula and Logic",
    paragraphs: [
      "You cannot calculate IRR with a simple algebraic formula. Instead, it requires an iterative numerical method like the Newton-Raphson method or the Bisection method, which our calculator uses.",
    ],
    equations: [
      {
        label: "The NPV Equation",
        equation: "0 = CF0 + CF1/(1+IRR) + CF2/(1+IRR)² + … + CFn/(1+IRR)ⁿ",
        terms: [
          {
            name: "CF0",
            description: "Initial Investment (always a negative number).",
          },
          {
            name: "CFn",
            description: "Cash flows in period n.",
          },
          {
            name: "n",
            description: "The holding period in years.",
          },
        ],
      },
    ],
  },
  parameters: {
    title: "Clarifying the Inputs",
    items: [
      {
        name: "Initial Investment",
        description:
          "This is the total money you need to start the project. You enter it as a positive number, but the tool counts it as an outflow.",
      },
      {
        name: "Cash Flows (Years 1–10)",
        description:
          "These show the net income from the project each year. You should enter net cash flow, which means revenue minus expenses.",
      },
      {
        name: "Terminal Value",
        description:
          "This is the amount you receive when you sell the asset. If you sell in Year 5, you add the sale price to that year’s cash flow.",
      },
    ],
  },
  factsTitle: "Global Investment Facts: IRR Usage by Region",
  facts: [
    {
      title: "United States (USA)",
      body: "In the United States, many firms use IRR in private equity and real estate. Private equity firms often target an IRR above 20 percent. Analysts also compare IRR with MIRR for better insight. MIRR uses a more conservative reinvestment rate.",
    },
    {
      title: "England / United Kingdom (UK)",
      body: "In the United Kingdom, companies use IRR to review projects. Firms set a hurdle rate to guide decisions. They approve projects that exceed this rate. The hurdle rate often includes WACC plus a small risk premium.",
    },
    {
      title: "Canada (CAN)",
      body: "In Canada, resource sectors use IRR for long term projects. These sectors include mining, oil, and gas. Analysts test IRR under different scenarios. They check best case, base case, and worst case results.",
    },
    {
      title: "Australia (AUS)",
      body: "In Australia, investors use IRR to compare property types. They often compare residential and commercial real estate. Commercial leases often provide stable cash flow. This makes IRR a useful measure for these assets.",
    },
    {
      title: "India (IND)",
      body: "In India, many investors use XIRR for mutual funds and SIPs. SIP investments happen at different times. XIRR helps track returns with these irregular flows. Investors use it to measure performance against inflation.",
    },
  ],
  faqs: [
    {
      question: "What is a good IRR?",
      answer:
        "A good IRR depends on the type of investment. Corporate bonds may offer about 5 percent. Real estate often targets 10 to 15 percent. Venture capital may aim for 30 percent or more. If IRR is higher than your loan rate, you earn a profit.",
    },
    {
      question: "Can IRR be negative?",
      answer:
        "Yes, IRR can be negative. This happens when total cash inflows stay below the initial cost. It shows that the investment loses money.",
    },
    {
      question: "Why is IRR different from ROI?",
      answer:
        "ROI shows the total return on an investment. IRR shows the yearly growth rate of that return. IRR also considers the time value of money. Money received earlier has more value.",
    },
    {
      question: "What are the limits of IRR?",
      answer:
        "IRR assumes you reinvest cash at the same rate. This may not match real situations. Some cash flow patterns can also create more than one result.",
    },
    {
      question: "How do I handle selling the asset?",
      answer:
        "Add the sale price to the final year cash flow. For example, you may earn rent and sell the asset. You should combine both amounts in that year.",
    },
  ],
}
