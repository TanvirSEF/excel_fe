import type { CalculatorDetail } from "../types"

export const cashOnCashRoiCalculator: CalculatorDetail = {
  metaDescription:
    "Free cash on cash ROI calculator — down payment, closing costs, repairs, rent and financing give your annual return on invested cash and monthly cash flow.",
  whenToUse: [
    "A Cash on Cash ROI Calculator measures your annual return on invested cash. It looks at how much pre-tax income you earn compared to what you actually put in. This applies to both residential and commercial properties.",
    "It works differently from a Cap Rate. A Cap Rate ignores your loan and looks at the full property value. Cash on Cash focuses on your money specifically. It accounts for your financing and how much you borrowed.",
    "This calculator answers one simple question. For every dollar you invest, how much do you get back this year? That makes it a practical tool for investors who want their money moving fast. You can see how quickly you’ll recover your initial investment. Then you can use that capital to fund your next deal.",
  ],
  method: {
    title: "The Formulas and Logic Used",
    paragraphs: [
      "The calculator uses standard financial formulas to get your results. Here is how each one works:",
    ],
    equations: [
      {
        label: "Total Cash Invested",
        note: "This is the sum of all out-of-pocket “upfront” costs.",
        equation: "Down Payment + Closing Costs + Initial Repairs = Total Cash Invested",
      },
      {
        label: "Annual Pre-Tax Cash Flow",
        note: "What remains after the property pays for itself.",
        equation:
          "(Monthly Rent × 12) − (Monthly Mortgage + Operating Expenses) × 12 = Annual Cash Flow",
      },
      {
        label: "Cash on Cash Return",
        equation: "(Annual Pre-Tax Cash Flow ÷ Total Cash Invested) × 100 = CoC ROI%",
      },
    ],
  },
  parameters: {
    title: "Clarifying the Advanced Parameters",
    items: [
      {
        name: "Initial Repairs and Rehab",
        description:
          "Many investors forget this cost, but it matters a lot. If your down payment is $50,000 and repairs cost $20,000, your total cash investment becomes $70,000.",
      },
      {
        name: "Total Debt Service",
        description:
          "This includes your full monthly mortgage payment. It covers both principal and interest. Cash on cash return focuses on cash flow, so principal payment is not counted as yearly profit.",
      },
      {
        name: "Monthly Operating Expenses",
        description:
          "These costs include property taxes, insurance, maintenance, and management fees. They affect your monthly income and your final return.",
      },
    ],
  },
  factsTitle: "Global Investment Facts: Insights from Leading Markets",
  facts: [
    {
      title: "United States (USA)",
      body: "In the US, many investors use loans to increase returns. A good cash on cash return usually falls between 8% and 12%. Investors often compare a full cash purchase with a financed purchase. A cash purchase gives more safety, but financing can create a higher cash on cash ROI with less upfront money.",
    },
    {
      title: "Canada (CAN)",
      body: "With higher interest rates in Canada, many investors use Cash on Cash return to check for negative leverage. This happens when the mortgage interest rate is higher than the Cap Rate. In that case, the Cash on Cash return can be lower than buying the property with full cash. This often tells investors to wait or look for better loan terms.",
    },
    {
      title: "United Kingdom / England (UK)",
      body: "UK investors focus on cash yield in the Buy-to-Let market. Tax rules changed under Section 24. Landlords can no longer deduct full mortgage interest from rental income. CoC helps them check if a property still makes financial sense after that tax hit.",
    },
    {
      title: "Australia (AUS)",
      body: "Australian investors often use CoC alongside negative gearing strategies. A property may show a low CoC return due to high expenses. But the long-term tax benefits can offset that lower income. So investors look at both numbers together before making a decision.",
    },
    {
      title: "India (IND)",
      body: "Cash on Cash is gaining traction among Commercial Real Estate investors in India. REITs and fractional ownership have opened the market to more buyers. Now, investors in cities like Bangalore and Mumbai target CoC returns of 7% to 9%. That range helps them stay ahead of local inflation.",
    },
  ],
  faqs: [
    {
      question: "Why is Cash on Cash different from ROI?",
      answer:
        "ROI looks at the full picture over the life of a deal. It includes property appreciation and principal paydown. Cash on Cash does not. It only measures the cash profit you earned in one year. Think of it as a yearly check-in on how your money is performing.",
    },
    {
      question: "Can a Cash on Cash return be negative?",
      answer:
        "Yes, it can. If your mortgage and expenses cost more than your rental income, you have negative cash flow. That gives you a negative CoC return. It means you are paying out of your own pocket every month just to hold the property.",
    },
    {
      question: "What is a “Good” Cash on Cash return?",
      answer:
        "Most experts put a solid CoC return between 8% and 12%. But that number can shift based on your goal. In high-demand city centers, property values tend to rise over time. There, investors may accept a CoC return of 3% to 5%. They trade lower cash flow now for long-term appreciation.",
    },
    {
      question: "Does CoC account for taxes?",
      answer:
        "Standard CoC is a pre-tax metric. It does not factor in what you owe the government. To get your post-tax return, subtract your income tax from the annual cash flow first. Then divide that number by your total cash invested.",
    },
    {
      question: "How does leverage affect the result?",
      answer:
        "Leverage usually pushes your CoC return higher. When you take out a mortgage, you put in less of your own cash. So even a modest profit becomes a large percentage of what you actually invested.",
    },
  ],
}
