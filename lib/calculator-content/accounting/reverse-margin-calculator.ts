import type { CalculatorDetail } from "../types"

export const reverseMarginCalculator: CalculatorDetail = {
  metaDescription:
    "Free reverse margin calculator — target selling price, required margin, tax, discounts and freight give the maximum product cost you can pay a supplier.",
  whenToUse: [
    "Cost-Plus Pricing: In this method, you calculate your total cost and add your profit on top of it. Risk: The problem starts when the final price goes above what customers want to pay.",
    "Reverse Margin or Target Costing: In this method, you start with the market price. You look at what customers already pay for similar products. Then, you subtract your target profit to find the highest amount you can spend on the product.",
    "Reverse margin works backward from the selling price to find your cost limit. It helps you answer an important question in purchasing: “What is the highest price I can pay and still make a profit?”",
  ],
  method: {
    title: "The Core Formula",
    paragraphs: [
      "Reverse margin uses the opposite approach of the standard margin formula.",
    ],
    equations: [
      {
        label: "Target Cost",
        equation: "Target Cost = Selling Price × (1 − Desired Margin %)",
      },
      {
        label: "A Simple Example",
        note: "You want to sell a wireless mouse. Similar products sell for $20 on Amazon, and you want a 40% profit margin. Now imagine a supplier offers the mouse for $13 — the numbers help you decide without guesswork.",
        equation: "Cost = 20 × (1 − 0.40) = 20 × 0.60 = $12",
      },
    ],
  },
  factGroups: [
    {
      title: "How Does the Calculator Work?",
      intro:
        "This calculator does more than basic percentage math. It includes three important checks that many new sellers forget.",
      items: [
        {
          title: "Tax Stripping (The Government’s Cut)",
          body: "When you sell a product for $110, you may not keep the full amount. If the price includes a 10% sales tax, the government takes $10, and you keep $100. The calculator removes the tax before it calculates your profit. This step helps you avoid counting tax money as income.",
        },
        {
          title: "Discount Buffering (The Sale Strategy)",
          body: "Most retailers do not sell every product at full price. At some point, many businesses offer discounts during sales events or clearance periods. The calculator includes a planned discount field. If you expect to offer a 20% discount later, the calculator lowers your maximum cost now — this step helps you protect your profit even after the discount.",
        },
        {
          title: "Freight & Duty (The Landed Cost)",
          body: "The supplier price is not your total cost — you still need to pay shipping (Freight) fees and import (Duty) charges. The calculator subtracts these costs from your budget using the “Freight” field. For example, suppose your maximum cost is $12, and shipping costs $2. The calculation becomes: 12 − 2 = 10. In this case, you can pay the supplier a maximum of $10 for the product itself based on the Free on Board (FOB) basis.",
        },
      ],
    },
    {
      title: "Important Facts About Target Costing",
      items: [
        {
          title: "It forces market discipline",
          body: "Customers do not care about your production costs, shipping fees, or rising rent — they care about whether the product feels worth the price. Reverse Margin forces you to accept the market price as the limit and build your costs around it. Instead of raising prices to protect profit, you improve operations and reduce expenses to stay competitive.",
        },
        {
          title: "Margins shrink as products age",
          body: "In most industries, prices drop over time. Suppose, a TV that sold for $1,000 last year may sell for $800 today. Smart buyers plan for that shift early — they calculate target costs based on future market prices instead of current ones. That helps them protect profit margins as competition grows and prices fall.",
        },
        {
          title: "Landed cost is the only cost that matters",
          body: "Many businesses focus too much on the FOB price and ignore the total landed cost. FOB: The amount the factory charges for the product. Landed: The full cost after shipping, insurance, customs, and local delivery. A low factory price does not guarantee a profitable deal. If freight and import costs rise, your margins can disappear fast. Always calculate the full landed cost before you approve a purchase order.",
        },
      ],
    },
  ],
  useCases: [
    {
      title: "Scenario 1: Buying Products From Alibaba or Faire",
      body: "You find a leather bag on Alibaba for $40 per bag. The US market sells similar bags for $100, and you need a 60% margin for fashion items. Input: Price $100, Margin 60% → Max Cost is $40. The Catch: You forgot shipping! You estimate $5 per bag. Re-Calc with Freight $5 → Max Product Cost is $35. The supplier still wants $40 — you now know you need to negotiate down to $35 or stop the deal.",
    },
    {
      title: "Scenario 2: Private Label Manufacturing",
      body: "You plan to launch your own vitamin brand at a mid-range price of $25. Retailers demand a 50% margin to stock it: Price $25, Margin 50% → your “Wholesale Price” must be $12.50. Now you need a 40% margin on your wholesale sales: Price $12.50, Margin 40% → your manufacturing cost must be $7.50. This process is called chaining — move backward through each step of the supply chain until you reach your target cost.",
    },
  ],
  faqs: [
    {
      question: "Why does the calculator remove tax?",
      answer:
        "Sales tax, VAT, and GST do not count as business income. That money comes from the customer and goes directly to the government. Since you never keep it as profit, you should not include it in your margin calculations. If you calculate margins using prices that include tax, you overstate your revenue and risk overspending on inventory.",
    },
    {
      question: "What is a good profit margin?",
      answer:
        "The right margin depends on your industry. Grocery/Electronics: 15% – 30% (High volume, low margin). Apparel/Fashion: 50% – 70% (Low volume, high risk of unsold stock). Cosmetics/Jewelry: 60% – 80% (Brand value dominates cost). Every industry works differently — you should research your market before you set a target margin.",
    },
    {
      question: "What should you do if the maximum cost is too low?",
      answer:
        "If the calculator shows a maximum product cost of $5, but suppliers charge at least $8, your numbers do not support a profitable business. You have three options: Increase the selling price — position the product as a premium item. Reduce the product cost — get a lower price with larger orders. Skip the product — sometimes the smartest decision is to avoid a product that cannot meet your profit target.",
    },
    {
      question: "Is margin the same as markup?",
      answer:
        "No. Margin and markup are different, and many people confuse them. Markup adds profit to the Cost (Cost $10 + 50% = $15 Price). Margin subtracts profit from the Price (Price $15 − 33% Margin = $10 Cost). This difference matters because a 50% markup does not create a 50% margin — to reach a 50% margin, you need a 100% markup.",
    },
  ],
}
