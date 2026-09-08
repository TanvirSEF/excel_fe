import type { CalculatorDetail } from "../types"

export const vwapCalculator: CalculatorDetail = {
  metaDescription:
    "Free VWAP calculator — volume weighted average price for any set of stock trades. Institutional trading benchmark with total volume, traded value and step-by-step breakdown.",
  formula: "VWAP = Σ(Price × Volume) ÷ Σ(Volume)",
  whenToUse: [
    "In fast stock trading, price tells only half the story — volume shows where big money trades. The VWAP calculator shows the weighted average trading price, giving a benchmark used by institutional traders to judge performance.",
    "Most simple averages treat every trade the same. A simple moving average gives equal weight to every transaction: buying 1 share at $100 gets treated the same as buying 1,000,000 shares at $105. VWAP pulls the average toward where real money changed hands, making it far more accurate — traders consider it the true price for the day.",
  ],
  howToUse: [
    "Enter each trade's share price and volume (number of shares).",
    "Add as many trades as needed — the calculator weights each by its volume.",
    "Read the VWAP, total volume, total traded value, and compare with the simple average to see the difference.",
  ],
  example: {
    title: "A simple example — where the real money traded",
    body: "Trade A: 100 shares at $10. Trade B: 100 shares at $10. Trade C: 10,000 shares at $11. Simple average: ($10+$10+$11)÷3 = $10.33. VWAP: (100×10 + 100×10 + 10,000×11) ÷ 10,200 = $112,000 ÷ 10,200 = $10.98 — almost all the volume sat at $11, so the real price is $10.98.",
  },
  excelNote: "In Excel: =SUMPRODUCT(prices,volumes)/SUM(volumes)",
  method: {
    title: "The mathematical formula",
    paragraphs: [
      "Step 1 — Calculate total value: for every transaction, multiply the price by the number of shares (volume).",
      "Step 2 — Sum the volume: add up all the shares traded across every transaction.",
      "Step 3 — Divide: divide the total value by the total volume to get the VWAP.",
    ],
    formula: "VWAP = Σ(Price × Volume) ÷ Σ(Volume)",
  },
  facts: [
    {
      title: "1. It is an intraday indicator",
      body: "VWAP resets at the start of each trading day and does not carry data from past days. Moving averages cover longer periods like 50 days; VWAP only tracks one session. A weekly chart does not work well with VWAP.",
    },
    {
      title: "2. Institutional whales use it",
      body: "Mutual funds and pension funds buy large volumes and aim to buy below VWAP. If a trader buys at $150.00 and VWAP closes at $151.00, that is a good trade — lower cost than the average market participant. Prices often move back toward VWAP, and institutions often defend their entry points around this level.",
    },
    {
      title: "3. It acts as support and resistance",
      body: "Bullish trend: price stays above VWAP — when it falls to the VWAP line, buyers step in. Bearish trend: price stays below VWAP — the VWAP acts like a ceiling that price struggles to break above.",
    },
  ],
  useCases: [
    {
      title: "Evaluating your trade entry",
      body: "After a day of trading, enter your buy prices and volumes. If your average is lower than VWAP, you bought better than the market — a bullish sign. If higher, you paid a premium.",
    },
    {
      title: "Calculating break-even on scale-ins",
      body: "Traders scale into positions over time — 50 shares now, 100 later, 200 on a dip. This calculator finds your exact break-even price across all entries at different sizes.",
    },
    {
      title: "Post-trade analysis",
      body: "Trade logs give raw execution lists. This tool combines them into one meaningful number — the fair value of the entire session at a glance.",
    },
  ],
  faqs: [
    {
      question: "Is VWAP better than a moving average?",
      answer:
        "For day trading, VWAP often works better. Moving averages react slowly because they use past prices; VWAP updates faster and includes volume, giving a stronger view of intraday action. Moving averages work better for swing trading over weeks or months.",
    },
    {
      question: "Can I use VWAP for crypto?",
      answer:
        "Yes — VWAP works the same for Bitcoin or Ethereum as for stocks. Crypto runs 24/7 with no clear closing time, so most platforms reset VWAP at 00:00 UTC. Check your chart settings before using it.",
    },
    {
      question: "What is anchored VWAP?",
      answer:
        "Standard VWAP resets every day. Anchored VWAP starts from a chosen point — an earnings report, a news release — and calculates from that point onward. Swing traders use it to track price levels after key events.",
    },
    {
      question: "Does high volume always mean the price goes up?",
      answer:
        "No. High volume shows strong market activity but does not show direction. High volume at the top of a move can signal distribution (selling); at the bottom it can show panic. VWAP helps you see where that volume sits relative to price.",
    },
  ],
}
