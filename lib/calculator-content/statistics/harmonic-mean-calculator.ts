import type { CalculatorDetail } from "../types"

export const harmonicMeanCalculator: CalculatorDetail = {
  metaDescription:
    "Free harmonic mean calculator — the true average for speeds, rates and ratios. Instant results with formula, reciprocals breakdown and worked examples.",
  formula: "HM = n ÷ Σ(1 ÷ xᵢ) = n ÷ (1/x₁ + 1/x₂ + … + 1/xₙ)",
  whenToUse: [
    "If you drive to work at 60 mph and come back at 40 mph, most people say the average speed is 50 mph — that answer is wrong. A regular average fails with rates, speeds and ratios: it gives you a number that looks right but leads you astray. This matters in physics, engineering and finance, where a wrong number can cost you dearly.",
    "The harmonic mean is the average for values linked by units — speed is distance over time, density is mass over volume. It is one of the three Pythagorean means: the arithmetic mean adds numbers directly, while the harmonic mean uses their reciprocals instead.",
  ],
  howToUse: [
    "Enter your rates or ratios — comma separated, positive numbers only.",
    "The calculator sums the reciprocals and divides the count by that sum.",
    "Read the true average, plus the arithmetic mean and the reciprocal sum for comparison.",
  ],
  example: {
    title: "A simple example — the speed paradox",
    body: "Trip A at 60 mph, Trip B at 40 mph. Reciprocals: 1/60 = 0.0167 and 1/40 = 0.0250. Sum: 0.0417. Divide the count 2 by the sum → 48 mph. The 50 mph guess ignores driving time — you spend more time at 40 than at 60, and the harmonic mean handles that difference correctly.",
  },
  excelNote: "In Excel use =HARMEAN(range).",
  facts: [
    {
      title: "1. It gives the lowest average",
      body: "The harmonic mean always stays lowest of the three Pythagorean means: Harmonic ≤ Geometric ≤ Arithmetic. Small numbers affect it the most while large values barely move it — if one value approaches zero, the harmonic mean drops toward zero too.",
    },
    {
      title: "2. It does not work with zero",
      body: "The formula divides by each number, and dividing by zero is undefined in mathematics. The calculator shows an error for zero inputs. It also struggles with negative values — a speed of −50 mph does not work in normal driving problems, which is why temperature-style data needs a different tool.",
    },
    {
      title: "3. It helps with parallel tasks",
      body: "Physicists and engineers use the harmonic mean for tasks that happen together at different rates — parallel resistors, pumps filling a tank, workers on the same job. If two pumps fill one tank together, harmonic mean math finds the total filling time.",
    },
  ],
  faqs: [
    {
      question: "Why is my result lower than the regular average?",
      answer:
        "That is normal. The harmonic mean gives more weight to smaller numbers — low values affect the final answer more than large values do, so the result usually stays below the arithmetic mean.",
    },
    {
      question: "Can I use negative numbers?",
      answer:
        "Generally, no. You can put negative numbers into the formula, but the result rarely makes sense in real situations — a speed of −50 mph does not work in normal driving problems. The harmonic mean works best with positive rates and ratios.",
    },
    {
      question: "What happens if I enter 0?",
      answer:
        "The calculator shows an error. The formula divides by each number in the list, and mathematics does not allow division by zero — the calculation cannot continue.",
    },
    {
      question: "How does harmonic mean compare with geometric mean?",
      answer:
        "Each average fits a different type of problem. Use the geometric mean for growth rates and compound interest. Use the harmonic mean for speeds, rates and resistance. Use the arithmetic mean for simple counting values such as test scores or apples.",
    },
  ],
}
