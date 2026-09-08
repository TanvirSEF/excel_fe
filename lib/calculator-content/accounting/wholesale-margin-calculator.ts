import type { CalculatorDetail } from "../types"

export const wholesaleMarginCalculator: CalculatorDetail = {
  metaDescription:
    "Free wholesale margin calculator — COGS, your margin, retailer margin, shipping and commission give the right wholesale price, MSRP and total order profit.",
  whenToUse: [
    "Wholesale margin is the profit you earn when you sell products in bulk to a retailer, distributor, or another business (B2B).",
    "This process includes two profit layers: Your layer — Manufacturer → Wholesaler. The retailer’s layer — Wholesaler → Customer.",
    "You need to set the right price for both sides. A high price reduces the retailer’s profit, so they may stop selling your product. A low price cuts into your earnings and lowers your return for the work you put in.",
  ],
  method: {
    title: "The Pricing Chain Formula",
    paragraphs: [
      "This calculator follows the Chain Method to build your pricing from the ground up.",
    ],
    equations: [
      {
        label: "Step 1: Calculate Your Wholesale Price",
        equation: "Wholesale Price = (COGS + Shipping) ÷ (1 − (Your Margin + Commission))",
      },
      {
        label: "Step 2: Calculate the MSRP (Retail Price)",
        equation: "MSRP = Wholesale Price ÷ (1 − Retailer Margin)",
      },
      {
        label: "Example",
        note: "Cost to make: $10, Your Margin: 30%, Retailer Margin: 50%.",
        equation: "Wholesale Price: $14.29 (You make $4.29) · MSRP: $28.58 (Retailer makes $14.29)",
      },
    ],
  },
  parameters: {
    title: "Understanding the Advanced Options",
    intro:
      "Wholesale deals come with extra costs that can cut into your profit if you ignore them. This calculator includes those costs — so you can see your actual net profit before you close a deal.",
    items: [
      {
        name: "Shipping Cost",
        description:
          "In B2B sales, you often cover the cost of shipping pallets to a distributor or warehouse. If you leave shipping out of your unit cost, your profit drops with every order.",
      },
      {
        name: "Sales Commission",
        description:
          "If you work with sales reps, they usually take 5% to 10% of the wholesale price, not your profit. That cost adds up fast — so you need to include it in your pricing from the start.",
      },
      {
        name: "Order Quantity",
        description:
          "Wholesale depends on volume. A $2 profit per unit may seem small — selling 10,000 units turns it into a significant return. Use the “Order Qty” field to calculate the total value of the order.",
      },
    ],
  },
  factGroups: [
    {
      title: "3 Rules for Wholesale Pricing",
      items: [
        {
          title: "Follow the Keystone Rule",
          body: "Many industries, especially fashion and gift products, use keystone pricing. Retailers expect to double the product price, which gives them a 50% margin. A simple rule works well here. Your MSRP should stay close to four times your manufacturing cost. $10 manufacturing cost → $20 wholesale price → $40 retail price.",
        },
        {
          title: "Leave Space for Distributors",
          body: "Some businesses sell products through distributors before products reach retail stores. Each step in the chain needs enough profit. Manufacturer → Distributor (20%) → Retailer (40%) → Customer. Tight margins make growth harder. Large distribution networks often avoid products that leave little room for profit.",
        },
        {
          title: "Keep Your Retail Price Consistent",
          body: "Do not sell products on your website below the MSRP. Retailers expect fair pricing from the brands they carry. For example, a retailer will lose trust if you ask them to sell a product for $30 but sell the same item on your site for $20. In many cases, they may stop carrying your brand.",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "What is a good wholesale margin?",
      answer:
        "Most manufacturers target a wholesale margin between 30% and 50% — this range covers overhead, marketing, and commissions. Resellers who buy and sell goods without manufacturing typically see lower margins — around 15% to 25%.",
    },
    {
      question: "Should I offer free shipping to retailers?",
      answer:
        "Offer free shipping only when your order minimums support it. Add the shipping cost to your unit cost in the calculator and check how it affects your margin. If your margin falls below 20%, you should charge for shipping instead of absorbing the cost.",
    },
    {
      question: "What is MSRP?",
      answer:
        "MSRP stands for Manufacturer’s Suggested Retail Price. It tells retailers what price to sell your product at. Many countries do not allow you to legally enforce this price, but setting an MSRP helps retailers see the value in your product.",
    },
    {
      question: "How do I calculate commission?",
      answer:
        "Sales reps usually earn commission from revenue, not profit. For example, if you sell a product for $100 and pay a 10% commission, the rep earns $10. This calculator includes commission as part of your business costs, so it factors that amount into your pricing automatically.",
    },
  ],
}
