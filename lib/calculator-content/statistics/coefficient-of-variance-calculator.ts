import type { CalculatorDetail } from "../types"

export const coefficientOfVarianceCalculator: CalculatorDetail = {
  metaDescription:
    "Free coefficient of variation calculator — raw data or known stats modes, with a volatility scale verdict. Instant CV, mean and standard deviation.",
  formula: "CV = (Standard Deviation ÷ Mean) × 100%",
  whenToUse: [
    "Standard deviation shows how far numbers move from the average, but it depends on the units you use. Elephant weights vary by 500 pounds; mouse weights by 0.5 ounces — you cannot compare those values fairly. The CV solves this by comparing the standard deviation to the mean as a percentage, letting you compare two datasets even in different units.",
    "Imagine two friends guessing prices: both miss by $0.50 — one on a $1.00 candy bar, the other on a $20,000 car. Same absolute error, very different mistakes. The CV shows this difference by comparing the error to the size of the value.",
  ],
  howToUse: [
    "Raw Data mode: enter your numbers separated by commas or spaces — the calculator finds the mean, deviation, variance and CV step by step.",
    "Known Stats mode: if your textbook already gives the mean and standard deviation, enter those two values directly.",
    "Read the CV with its volatility scale verdict: green under 10% (high precision), amber 10–30% (moderate variance), red over 30% (high volatility).",
  ],
  example: {
    title: "Example: a week of measurements",
    body: "10, 15, 12, 18, 20, 14, 16 → mean 15, sample SD 3.42, CV 22.77% — moderate spread. Press Reset to load these numbers.",
  },
  excelNote: "In Excel: =STDEV.S(range) / AVERAGE(range), formatted as a percentage.",
  method: {
    title: "How this calculator works — two modes",
    paragraphs: [
      "Raw Data mode (a list like 12, 15, 18, 20): Step 1 — add all numbers and divide by the count to find the mean. Step 2 — measure how far each number sits from that average. Step 3 — square those differences and average them into the variance. Step 4 — divide the standard deviation by the mean and multiply by 100.",
      "Known Stats mode: your textbook already gives you the values — enter the mean and standard deviation, and the tool divides one by the other immediately. The volatility scale colors the result so you can read consistency at a glance.",
    ],
    formula: "0–10% High Precision · 10–30% Moderate Variance · 30%+ High Volatility",
  },
  facts: [
    {
      title: "1. CV is a unitless measure",
      body: "This is its most important property. You divide a value by another value in the same unit, so the units cancel: 5 meters ÷ 10 meters = 0.5 — meters disappears. That is why you can compare stock prices in dollars against real estate sizes in square feet directly.",
    },
    {
      title: "2. The zero-mean problem",
      body: "CV = σ ÷ mean, and dividing by zero is undefined — a mean of exactly zero kills the calculation. A mean very close to zero (like 0.001) is just as bad: the CV explodes into a huge, meaningless number. CV works best with data that is always positive, like height, weight or prices.",
    },
    {
      title: "3. Sensitivity to outliers",
      body: "CV depends on the mean, so extreme outliers throw it off — a billionaire walking into a room of regular workers shoots the average income up and distorts the CV. Always check your raw data for errors before calculating.",
    },
  ],
  useCases: [
    {
      title: "Investing & finance",
      body: "Investors use CV as a risk-to-reward lens. Stock A returns 10% with 2% variation (CV 20%); Stock B returns 20% with 5% variation (CV 25%). B earns more, but A is safer — more consistency per unit of return.",
    },
    {
      title: "Laboratory science",
      body: "Scientists use CV to test equipment. A pipette that should dispense 10ml gets tested 100 times — the goal is the Relative Standard Deviation (another name for CV). Below 5% usually means the equipment is working correctly.",
    },
    {
      title: "Manufacturing quality control",
      body: "Tiny screws and giant bolts both vary by 1mm. For the bolt that is nothing; for the screw it is a serious defect. CV spots which machine needs fixing even when the absolute error looks identical.",
    },
  ],
  faqs: [
    {
      question: "What is a good coefficient of variation?",
      answer:
        "It depends on the data. In chemistry labs a good CV is often below 2–3%. In surveys and social studies 10–15% is usually fine. In the stock market CV can exceed 20%. In general, lower means more stable data.",
    },
    {
      question: "Can the coefficient of variation be negative?",
      answer:
        "Most of the time, no — standard deviation always stays positive. A negative average can produce a negative CV, for example with temperatures below zero, but many statisticians avoid CV with negative data because the result becomes hard to interpret. This calculator uses the absolute mean.",
    },
    {
      question: "How is CV different from standard deviation?",
      answer:
        "Standard deviation shows spread in actual units — a price may change by $5. CV shows spread as a percentage of the value — the price changes by 10% of itself. Use standard deviation for one dataset; use CV when comparing different datasets.",
    },
    {
      question: "Why do we multiply by 100 in the formula?",
      answer:
        "The raw division often gives a small decimal like 0.15. Multiplying by 100 turns it into 15%, which is much easier to read and compare.",
    },
    {
      question: "Can I use this for simple lists of numbers?",
      answer:
        "Yes — Raw Data mode is built exactly for that. Enter test scores, temperatures, heights or any values, and the calculator does all the math for you.",
    },
  ],
}
