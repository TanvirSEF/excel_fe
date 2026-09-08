import type { CalculatorDetail } from "../types"

export const retailProfitMarginCalculator: CalculatorDetail = {
  metaDescription:
    "Free retail profit margin calculator — unit cost, selling price, quantity and sales tax give your net profit, margin, markup and the price to hit a target margin.",
  formula: "Margin = (Price − Cost) ÷ Price × 100",
  whenToUse: [
    "Profit Margin is the portion of your sales price that you actually keep. Imagine you sell a toy car for $10 and that car costs you $6 to buy from the factory — you have $4 left over. That $4 is your Gross Profit. Your Margin tells you what percentage of the total price that $4 represents.",
    "In our example: Price $10, Cost $6, Profit $4. Calculation: 4 ÷ 10 = 0.40. Result: Your Profit Margin is 40%. This means for every dollar a customer pays you, you keep 40 cents — the other 60 cents goes toward paying for the product.",
  ],
  method: {
    title: "How Does the Calculator Work?",
    paragraphs: [
      "This calculator handles three important calculations at the same time — so you do not need to work through spreadsheets on your own.",
    ],
    equations: [
      {
        label: "Gross Margin %",
        note: "This number shows how much profit you make from your sales. It tells you what percentage of your revenue stays as profit after you pay for the product. Business owners, investors, and accountants often use this number to measure product performance.",
        equation: "Gross Margin = (Price − Cost) ÷ Price × 100",
      },
      {
        label: "Markup %",
        note: "Markup helps you set your selling price. It shows how much money you should add to your product cost. For example, if you buy a shirt for $50 and want a 50% markup — you add $25 to the selling price.",
        equation: "Markup = (Price − Cost) ÷ Cost × 100",
      },
      {
        label: "Total Revenue (with Tax)",
        note: "Many calculators leave out taxes. This calculator includes a tax option under “Advanced Options.” You can enter a tax rate and see the final price that customers pay at checkout (Price + Tax). This helps you avoid charging less than you should.",
        equation: "Total = Price × Quantity × (1 + Tax Rate)",
      },
    ],
  },
  factGroups: [
    {
      title: "Some Important Facts Every Retailer Should Know",
      items: [
        {
          title: "The “Markup Trap” (The #1 Mistake)",
          body: "Many new store owners mix up Markup and Margin. The terms sound similar — they give very different results. Scenario: You buy a pair of shoes for $50 and want to make a 50% profit margin. The Mistake: You use a 50% Markup and add $25 to the cost and sell the shoes for $75. Result: Your margin is only 33%. You earn much less profit than expected. The Fix: To reach a 50% Margin, you need to double the cost. The selling price should be $100. Rule: Margin is always lower than Markup. If you confuse the two, you may price your products too low and lose profit.",
        },
        {
          title: "Volume vs. Value",
          body: "Different businesses use different profit margins. A grocery store may earn only a 5% margin on a banana, but the store sells thousands of bananas every day. A jewelry store may earn a 300% margin on a diamond ring, but the store may sell only one ring each week. High-Volume Stores, such as Groceries and Discount Stores, depend on low margins and high sales. Low-Volume Stores, such as Boutiques and Luxury Stores, depend on high margins to cover costs and earn a profit.",
        },
        {
          title: "Margin Pays the Bills",
          body: "Usually, new business owners focus only on the money left after one sale. For example, someone may think he will make $20 profit on a product — but that $20 must cover business expenses too. Your Gross Profit counts on: Rent for the shop. Salaries for the staff. Electricity and Internet. Marketing ads. Net Profit is the money left after you pay all those costs. If your Gross Profit Margin stays too low, those basic costs will consume everything, and nothing will remain at the end.",
        },
      ],
    },
  ],
  useCases: [
    {
      title: "The New Product Launch",
      body: "A new supplier sells handmade candles for $4.50 each, and they look perfect for your shop. Open the “Calculate Price” tab before setting any price. Type in the cost and your target margin — around 60%, for example. The calculator shows the right selling price of $11.25 to meet that margin.",
    },
    {
      title: "The Sale Analysis",
      body: "Seasonal discounts bring in traffic, but they can also hurt your bottom line. Enter the product cost and the sale price to see the resulting margin. If the margin falls below your break-even point, you will know the discount cuts too deeply into your profit.",
    },
    {
      title: "The Shark Tank Pitch",
      body: "Investors and lenders always ask one question first: “What are your margins?” Selling $1 million in goods means nothing if your costs hit $990,000. Use this tool to learn your margins well — it helps you sound confident and prepared in any meeting.",
    },
  ],
  faqs: [
    {
      question: "What is a good profit margin for retail?",
      answer:
        "The right profit margin depends on the type of products you sell. Many retail stores aim for a 50% Gross Margin. People often call this “Keystone Pricing.” In this method, you sell the product for double the amount you paid for it. Restaurants often target margins near 70%, and grocery stores usually work with lower margins between 20–30%.",
    },
    {
      question: "Why is my Margin lower than my Markup?",
      answer:
        "Margin and Markup use different calculations. Markup compares profit to the product cost, which is the smaller number. Margin compares profit to the selling price, which is the larger number. Since the selling price stays higher than the cost, the Margin percentage always stays lower than the Markup percentage.",
    },
    {
      question: "Does this calculator include shipping costs?",
      answer:
        "Add shipping costs to your Unit Cost. If you buy a vase for $10 and pay $2 to ship it to your store, your true Unit Cost is $12 — enter $12 into the calculator to get an accurate result. Leaving out shipping gives you a false picture of your profit.",
    },
    {
      question: "Does Gross Profit include tax?",
      answer:
        "No. Sales tax does not count as your income because you collect that money for the government. This calculator keeps tax separate in the “Total Revenue” section. That way, you can see how much money you collect and how much profit you actually keep.",
    },
  ],
}
