import type { CalculatorDetail } from "../types"

export const amazonSellerCommissionCalculator: CalculatorDetail = {
  metaDescription:
    "Free Amazon seller commission and profit calculator — referral fees, FBA fulfillment, storage and COGS give your net profit per unit, margin and return on capital.",
  whenToUse: [
    "Every sale on Amazon comes with deductions. Amazon pulls out several fees before it sends money to your account. You need to understand how these fees work to keep your business profitable.",
  ],
  method: {
    title: "The Core Formula for Net Profit",
    equations: [
      {
        label: "Net Profit",
        equation:
          "Net Profit = Selling Price − (Referral Fee + FBA Fees + Storage Fees + COGS + Shipping)",
      },
      {
        label: "A Simple Example",
        note: "You sell a phone case for $20. That gives you an $8 profit per unit — works out to a 40% margin.",
        equation: "$20 − $3.00 (Referral 15%) − $4.00 (FBA Pick & Pack) − $5.00 (Product Cost) = $8.00",
      },
    ],
  },
  factGroups: [
    {
      title: "How the Calculator Works",
      intro:
        "This calculator groups Amazon selling costs into three simple categories. These categories help you understand where your money goes and how each expense affects your profit.",
      items: [
        {
          title: "Revenue & Commission",
          body: "This section covers your selling price and Amazon’s referral fee. Amazon charges this fee for each sale you make through its marketplace. In most product categories, Amazon calculates the referral fee as a percentage of the total selling price — it usually runs around 15% of the total sale price.",
        },
        {
          title: "FBA & Logistics (Fulfillment by Amazon)",
          body: "Many sellers use FBA to handle storage and shipping. Under this service, Amazon stores your products, prepares customer orders, and ships them to buyers. Storage Fee: It is a monthly charge based on how much warehouse space your product takes up, measured in cubic feet. Inbound Shipping: The cost to move your inventory from your supplier or home to an Amazon warehouse.",
        },
        {
          title: "Manufacturing & Prep",
          body: "This section captures your direct product costs. COGS (Cost of Goods Sold): This amount represents the cost to make or purchase each unit. Prep and Labeling: These expenses include materials and services — such as poly bags, bubble wrap, and product labels that Amazon requires for inventory processing.",
        },
      ],
    },
    {
      title: "Important Facts about Amazon Fees",
      items: [
        {
          title: "Referral Fees Depend on the Product Category",
          body: "Amazon does not charge the same referral fee for every product category. Many categories, such as Home, Kitchen, and Sports, often carry a 15% referral fee. Some categories use different rates. For example, personal computers may have an 8% fee, and Amazon device accessories can reach 45%. That’s why you should always review the fee rate for your product category before you calculate your profit.",
        },
        {
          title: "Product Size Affects FBA Fees",
          body: "Amazon bases FBA fulfillment fees on product size and weight. The company places products into different size tiers, and each tier has its own fee. Even a small increase in thickness can move a product into a higher tier. As a result, your fulfillment cost can increase significantly. Many sellers reduce packaging size whenever possible to keep products in lower fee tiers and protect their profit margins.",
        },
      ],
    },
  ],
  useCases: [
    {
      title: "Product Research (Sourcing)",
      body: "Many sellers check profit before they order stock. You can use this calculator before you buy 500 units from a supplier. The math often looks good at first — a supplier may charge $10 per unit and you may sell it for $30, suggesting a $20 profit. Costs change that outcome fast. FBA fees of $5 and referral fees of $4.50 reduce your profit to $10.50. This step helps you avoid products that bring low returns.",
    },
    {
      title: "Setting Competitive Prices",
      body: "Price changes can affect your profit more than expected. A drop from $25 to $20 does more than reduce revenue by $5. It also lowers your referral fee since Amazon calculates it from the sale price. This calculator helps you test different price points. You can find a price that keeps you competitive and still protects your profit.",
    },
    {
      title: "FBA vs FBM Decisions",
      body: "Sellers often compare FBA and FBM to control costs. You can enter Amazon’s FBA fee in one run of the calculator. You can then replace it with your own shipping cost in another run. This comparison often shows a pattern. FBM can work better for heavy products. FBA can work better for light and fast-moving items — the calculator helps you pick the option that fits your product type.",
    },
  ],
  faqs: [
    {
      question: "What is the difference between the Referral Fee and the FBA Fee?",
      answer:
        "Amazon charges a Referral Fee as its cut for letting you sell on the platform. This fee runs around 15% of the sale price. The FBA Fee covers the cost of storing, packing, and shipping your item to the buyer. If you handle shipping yourself through FBM, you still owe the Referral Fee, but skip the FBA Fee entirely.",
    },
    {
      question: "Do fees change during the holidays?",
      answer:
        "Yes, they do. Amazon raises monthly storage fees sharply during Q4, from October through December. The increase can hit three to four times the normal rate. Amazon does this to push sellers toward moving slow inventory before the holiday rush.",
    },
    {
      question: "How do I find the exact FBA fee for my product?",
      answer:
        "Head to Seller Central and open Amazon’s official Revenue Calculator. You can also check the FBA Fulfillment Fee table directly — your fee depends on the product’s weight and dimensions, including length, width, and height.",
    },
    {
      question: "What is a good profit margin on Amazon?",
      answer:
        "Most private label sellers target a net margin between 25% and 30%. That range gives you room to spend on advertising costs like PPC, which most fee calculators leave out. A margin below 15% before ad spend makes it very hard to turn a profit.",
    },
    {
      question: "What is the Closing Fee?",
      answer:
        "The Closing Fee is a fixed charge of $1.80 that applies to media categories like Books, DVDs, Music, and Video Games. Sellers in other categories — such as Home or Sports can leave that field at zero.",
    },
  ],
}
