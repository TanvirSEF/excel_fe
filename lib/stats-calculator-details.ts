export interface StatsCalculatorDetail {
  metaDescription: string
  formula: string
  whenToUse: string[]
  howToUse: string[]
  example: { title: string; body: string }
  excelNote?: string
  faqs?: { question: string; answer: string }[]
  method?: { title: string; paragraphs: string[]; formula: string }
  facts?: { title: string; body: string }[]
  useCases?: { title: string; body: string }[]
}

export type StatisticsSlug =
  | "weighted-average-grade-calculator"
  | "geometric-mean-calculator"
  | "harmonic-mean-calculator"
  | "time-weighted-average-calculator"
  | "coefficient-of-variance-calculator"
  | "pooled-variance-calculator"
  | "one-way-anova-calculator"
  | "two-way-anova-calculator"
  | "z-score-to-percentile-calculator"
  | "critical-z-value-calculator"
  | "p-value-from-z-score-calculator"
  | "weighted-average-overtime-calculator"
  | "vwap-calculator"

export const STATS_DETAILS: Record<StatisticsSlug, StatsCalculatorDetail> = {
  "weighted-average-grade-calculator": {
    metaDescription:
      "Free weighted average grade calculator — enter grades and weights to see your current class grade, letter grade and the exact final exam score you need for your target.",
    formula: "Weighted Grade = Σ(Score × Weight) ÷ ΣWeights",
    whenToUse: [
      "Keeping grades on top gets stressful when different assignments carry different weights. A simple average fails you when a Final Exam is worth 40% and Homework is worth only 5% — in a weighted grading system, some assignments simply affect your final grade more than others.",
      "Imagine two grades: Homework 100% (worth 10% of the class) and Midterm 70% (worth 90%). The simple average says (100 + 70) ÷ 2 = 85% — looks like a B. The weighted average says (100 × 0.10) + (70 × 0.90) = 73% — actually a C. The weighted average is the accurate one, because the midterm carries the weight.",
    ],
    howToUse: [
      "Add assignments: enter the assignment name if you want, then your grade (%) and its weight (%).",
      "Ignore the total for now: your weights do not need to equal 100% yet. If you have completed only 30% of the coursework, the calculator averages that 30% — your finished work is the full picture so far.",
      "Read the result: Current Average shows your class grade on completed work, with your letter grade alongside.",
      "Use the Final Exam Planner: your current average fills in automatically — enter your target grade (e.g. 90 for an A) and the final exam's weight, and the planner shows the minimum score you need on the final.",
    ],
    example: {
      title: "Example: the built-in sample",
      body: "Homeworks 88 (20%), Midterm 76 (30%) and Lab Project 92 (20%) — 70% of the course done — give a current average of 84.00%, a B. Press Reset above to load these exact numbers, then try the Final Exam Planner with target 90% and final weight 30%.",
    },
    excelNote: "In Excel use =SUMPRODUCT(grades, weights) / SUM(weights).",
    faqs: [
      {
        question: "What if my weights don't add up to 100%?",
        answer:
          "That is normal — your semester may still be in progress and completed work may only cover 60% or 70% so far. The calculator adjusts the average based on your finished work and treats it as the full progress right now. Add assignments as they arrive and the picture updates.",
      },
      {
        question: "What if I need more than 100% on the final?",
        answer:
          "If the planner shows something like 105%, you cannot reach that target with the final exam alone. Line up extra credit, or set a lower target — a B+ instead of an A, for example. The planner tells you this honestly so you can plan realistically.",
      },
      {
        question: "Can I use points instead of percentages?",
        answer:
          "Yes — just stay consistent across your entries. For example, 45 points out of 50 equals 90%, so you can enter either the percentage directly or convert your points first. Both work with the same weighted formula.",
      },
      {
        question: "What is the difference between average and weighted average?",
        answer:
          "A simple average gives every assignment equal value. A weighted average gives more value to some assignments — exams usually count more than homework. Most schools use weighted averages for final grades, which is why this calculator exists.",
      },
    ],
  },
  "geometric-mean-calculator": {
    metaDescription:
      "Free geometric mean calculator — handles large datasets with the logarithmic method, no overflow. Instant results with formula, AM comparison and worked examples.",
    formula: "GM = ⁿ√(x₁ · x₂ · … · xₙ)",
    whenToUse: [
      "When data grows or compounds over time, a regular average often gives you the wrong answer. Investment returns, bacteria populations, and viral spread all multiply instead of adding — the geometric mean handles this kind of data correctly.",
      "The Arithmetic Mean asks: if all numbers had the same value, what number would give the same total when added? The Geometric Mean asks: if all numbers had the same value, what number would give the same result when multiplied?",
    ],
    howToUse: [
      "Enter your data series — comma separated, integers and decimals both work.",
      "Zeros are removed automatically; negative numbers are not allowed (see the FAQs below).",
      "Read the geometric mean, plus the arithmetic mean and total product for comparison.",
    ],
    example: {
      title: "Example: find the geometric mean of 2 and 8",
      body: "Multiply: 2 × 8 = 16. Count: n = 2. Root: take the square root of 16. Result: 4. Note — the arithmetic mean would be (2 + 8) ÷ 2 = 5. The geometric mean (4) is smaller and works better for multiplicative relationships.",
    },
    excelNote: "In Excel use =GEOMEAN(range).",
    method: {
      title: "How this calculator works — the log method",
      paragraphs: [
        "You can multiply small lists like 2 and 8 without any problem. But large datasets create huge numbers — multiply 50 numbers together and many standard calculators show Error or Infinity.",
        "This calculator converts each number into its natural logarithm, averages those logarithms, then converts the result back. The method produces accurate results and avoids memory overflow entirely.",
      ],
      formula: "GM = exp( Σ ln(xᵢ) ÷ n )",
    },
    facts: [
      {
        title: "1. It is always ≤ the arithmetic mean",
        body: "This is the AM-GM inequality, a basic rule of mathematics. The two means are equal only when every number in the dataset is the same (like 5, 5, 5). When numbers have a large gap — such as 1 and 100 — the geometric mean falls far below the arithmetic mean, because it dampens large swings in the data.",
      },
      {
        title: "2. It handles compounding correctly",
        body: "Imagine an investment grows +10% in year 1 (×1.10) then drops −10% in year 2 (×0.90). The arithmetic mean says (1.10 + 0.90) ÷ 2 = 1.00 — no gain or loss. Reality: 1.10 × 0.90 = 0.99 — you lost 1%. The geometric mean, √(1.10 × 0.90) = 0.9949, shows the true effect on your return.",
      },
      {
        title: "3. It requires positive numbers",
        body: "The geometric mean is undefined for datasets containing zero or negative numbers. Zero multiplies the full product to 0, so the root is also 0. Negative numbers produce imaginary roots, which standard statistical analysis does not use.",
      },
    ],
    useCases: [
      {
        title: "Finance (CAGR)",
        body: "The geometric mean is the standard way to calculate the Compound Annual Growth Rate of an investment. A simple average of yearly returns makes growth look higher than it actually is — the geometric mean shows the true, steady rate.",
      },
      {
        title: "Social media & marketing",
        body: "Marketers compare engagement rates across platforms with very different audience sizes — Instagram 1M users, Twitter 100k. A simple average of likes overweights the larger platform; the geometric mean balances the scales and shows the typical performance level.",
      },
      {
        title: "Biology & science",
        body: "Scientists use it for cell growth, bacterial multiplication and viral spread — processes that grow exponentially. Because this data follows a log-normal distribution rather than a bell curve, the geometric mean gives the true average growth or infection rate.",
      },
    ],
    faqs: [
      {
        question: "Can I use negative numbers?",
        answer:
          "No. The standard geometric mean does not work with negative numbers — you cannot take an even root, such as a square root or 4th root, of a negative number in the real number system.",
      },
      {
        question: "Why is the geometric mean better for ratios?",
        answer:
          "Ratios — such as aspect ratios 16:9 or price-to-earnings P/E — work on a multiplication scale, not an addition scale. The geometric mean treats a 2× increase and a 0.5× decrease as opposite changes that balance each other. The arithmetic mean pushes the result higher and gives a misleading value.",
      },
      {
        question: "How does this compare to the harmonic mean?",
        answer:
          "The harmonic mean always stays smaller: Arithmetic Mean ≥ Geometric Mean ≥ Harmonic Mean. People use the harmonic mean for rates like speed, the geometric mean for growth, and the arithmetic mean for sums and regular averages.",
      },
      {
        question: "What if my input has a zero?",
        answer:
          "Mathematically, any zero makes the full product zero and the geometric mean becomes 0. To keep results meaningful, this calculator removes zeros automatically before computing — the notice above the results tells you when that happened.",
      },
    ],
  },
  "harmonic-mean-calculator": {
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
  },
  "time-weighted-average-calculator": {
    metaDescription:
      "Free OSHA & NIOSH TWA calculator — enter noise levels and durations to get your 8-hour time weighted average, daily dose % and safety verdict.",
    formula: "OSHA: TWA = 16.61 × log₁₀(Dose ÷ 100) + 90 · NIOSH: TWA = 10 × log₁₀(Dose ÷ 100) + 85",
    whenToUse: [
      "In workplace safety, an average means more than simple math — a loud noise for five minutes causes less harm than the same noise for four hours. Safety experts use the Time Weighted Average to measure daily exposure to noise, dust, fumes and other hazards across an 8-hour workday.",
      "Why standard averages fail: a worker spending 7 hours in a quiet office at 60 dB and 1 hour on a jackhammer at 100 dB has a simple average of 65 dB — looks perfectly safe. The true OSHA TWA is 85 dB, right at the hearing-protection limit. Decibels follow a logarithmic scale, so standard math cannot measure them correctly — this calculator uses the official OSHA noise-dose formula.",
    ],
    howToUse: [
      "Pick a standard: OSHA (the legal US limit, 90 dBA), NIOSH (the stricter recommended limit, 85 dBA), or Simple / Chemical mode for ppm and mg/m³ exposure.",
      "Enter each noise level (dBA) with how many hours it lasted.",
      "Read your 8-hour TWA, total dose and the safety verdict against the limits.",
    ],
    example: {
      title: "Example: a full workday of noise",
      body: "95 dBA × 2h + 90 dBA × 4h + 85 dBA × 2h → dose 112.5%, 8-hour TWA 90.8 dBA — over the OSHA limit. Press Reset to load these exact numbers.",
    },
    method: {
      title: "How this calculator works — two standards",
      paragraphs: [
        "OSHA (the legal limit): the USA uses a 5 dB exchange rate — every 5 dB increase cuts the safe exposure time in half. 90 dBA is allowed for 8 hours, 95 dBA for 4, 100 dBA for 2.",
        "NIOSH (the recommended limit): NIOSH and most of Europe use a stricter 3 dB exchange rate — sound energy genuinely doubles every 3 dB. 85 dBA is allowed for 8 hours, 88 dBA for 4. The dose sums your used fraction of each level's allowed time; the TWA formulas convert that dose back into decibels.",
      ],
      formula:
        "Dose = Σ(hoursᵢ ÷ allowed-timeᵢ) × 100 · allowed time = 8 ÷ 2^((L − criterion) ÷ exchange)",
    },
    facts: [
      {
        title: "1. The action level is 85 dB",
        body: "The OSHA legal limit (PEL) is 90 dB, but the action level starts at 85 dB. If your TWA reaches 85 dB, employers must start a Hearing Conservation Program — free hearing protection, yearly hearing tests, and hearing-safety training for workers.",
      },
      {
        title: "2. TWA also works for chemicals",
        body: "This calculator focuses on noise, but TWA also measures chemical exposure such as ammonia or welding fumes. Chemical calculations use simpler linear math — switch to Simple / Chemical mode to average exposure in ppm (parts per million) or mg/m³.",
      },
      {
        title: "3. Short bursts still matter",
        body: "Decibels are logarithmic — loud sounds increase risk very fast. A 115 dB siren stays safe for less than 15 minutes per day, and a few minutes of extreme noise can raise your full-day TWA rating. Never dismiss short bursts.",
      },
    ],
    useCases: [
      {
        title: "Workplace safety audits",
        body: "Safety officers take spot readings with a sound level meter — 92 dB at one station, 84 dB at another. This calculator combines them into one TWA value for the worker's total daily exposure.",
      },
      {
        title: "Selecting hearing protection",
        body: "Once you know the TWA, you can choose ear protection that fits — a 98 dB exposure needs strong protection that lowers the delivered exposure below 85 dB.",
      },
      {
        title: "Manufacturing shifts",
        body: "Factories often run 10 or 12-hour shifts — longer shifts increase the total dose. The calculator converts any shift length into a standard 8-hour TWA so you can compare against the legal limits.",
      },
    ],
    faqs: [
      {
        question: "What is a safe TWA level?",
        answer:
          "85 dBA or less is considered safe — no action required. 85–89 dBA is the Action Level: employers must provide hearing protection and hearing tests. 90 dBA or higher reaches the Permissible Exposure Limit (PEL): workers must wear hearing protection and employers should reduce workplace noise levels.",
      },
      {
        question: "What is the difference between TWA and Dose?",
        answer:
          "They describe the same exposure in two ways. Dose (%) shows how much of your daily limit you used — 100% dose equals 90 dBA TWA under OSHA. TWA (dBA) shows the average noise level. A 50% dose is an 85 dBA TWA; a 200% dose is a 95 dBA TWA.",
      },
      {
        question: "Why does the calculator have an OSHA and a NIOSH mode?",
        answer:
          "OSHA rules are federal laws in the United States — companies must follow them to avoid fines. NIOSH gives health and safety recommendations based on scientific research, and many companies follow the stricter NIOSH limits to protect workers better.",
      },
      {
        question: "Can I use this for extended shifts (12 hours)?",
        answer:
          "Yes. The calculator adds the total dose from all entered hours — enter 12 hours and it converts that exposure into a standard 8-hour TWA, so you can compare the result directly with the legal exposure limits.",
      },
    ],
  },
  "coefficient-of-variance-calculator": {
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
  },
  "pooled-variance-calculator": {
    metaDescription:
      "Free pooled variance calculator — combine two sample variances into one weighted estimate for T-Tests. Formula, steps and pooled SD included.",
    formula: "s²p = ((n₁−1)s₁² + (n₂−1)s₂²) ÷ (n₁+n₂−2)",
    whenToUse: [
      "Before running a two-sample T-Test, when you assume both groups share the same underlying variance.",
      "To get a better, more stable estimate of variability by combining two small samples rather than trusting either alone.",
    ],
    howToUse: [
      "Enter both data sets — each needs at least 2 values.",
      "The calculator computes each group's sample variance, then weights them by group size.",
      "Use the pooled SD shown alongside directly in your T-Test formula.",
    ],
    example: {
      title: "Example: {1,2,3} and {3,5,7}",
      body: "Both groups have variance 1 and 4 with n = 3 each: ((2×1) + (2×4)) ÷ 4 = 2.50, pooled SD ≈ 1.5811. Press “Reset to example” to verify.",
    },
  },
  "one-way-anova-calculator": {
    metaDescription:
      "Free one-way ANOVA calculator — compare 3 or more group means with the full ANOVA table: SS, df, MS, F statistic and exact p-value. Copy to Excel.",
    formula: "F = MS(between) ÷ MS(within)",
    whenToUse: [
      "When you want to know whether three or more group means genuinely differ — plant yields under different fertilizers, sales across regions, test scores across teaching methods.",
      "As the gatekeeper before pairwise comparisons: a significant F tells you at least one mean differs.",
    ],
    howToUse: [
      "Enter each group's values in its own box — at least 2 values per group, 2 or more groups.",
      "The calculator builds the full ANOVA table: sums of squares, degrees of freedom, mean squares, F and the exact p-value.",
      "Use “Copy for Excel” to paste the whole table into a spreadsheet.",
    ],
    example: {
      title: "Example: three tidy groups",
      body: "Groups {3,4,5}, {7,8,9}, {10,11,12} give SS-between 74, SS-within 6, F = 37 and p ≈ 0.0004 — a significant difference. Press “Reset to example” to reproduce every number.",
    },
    excelNote: "In Excel: Data → Data Analysis → Anova: Single Factor, or F.DIST.RT(F, df1, df2) for the p-value.",
  },
  "two-way-anova-calculator": {
    metaDescription:
      "Free two-way ANOVA calculator — test how two factors and their interaction affect a result. Full ANOVA table with F statistics and p-values.",
    formula: "F = MS(factor) ÷ MS(error), computed for rows, columns and interaction",
    whenToUse: [
      "When two factors might both matter — Diet AND Exercise, Machine AND Shift — and you want each factor's effect plus whether they interact.",
      "With one value per cell you get the unreplicated model (like Excel's Two-Factor Without Replication); with the same 2+ values per cell you also get the interaction term.",
    ],
    howToUse: [
      "Set the grid size with the row and column steppers (2–6 each).",
      "Fill every cell — a single value per cell for the unreplicated model, or the same 2+ values per cell to test interaction.",
      "Read the ANOVA table: rows test factor A, columns test factor B, and interaction (when replicated) tests whether the factors combine non-additively.",
    ],
    example: {
      title: "Example: 3×3 grid",
      body: "The default grid gives SS-rows 56, SS-cols 56, SS-error 16 with F = 7 and p ≈ 0.0494 for both factors — significant at the 5% level.",
    },
    excelNote: "In Excel: Data → Data Analysis → Anova: Two-Factor with or without Replication.",
  },
  "z-score-to-percentile-calculator": {
    metaDescription:
      "Free z-score to percentile calculator — convert any z-score into its percentile rank on the normal curve, with areas below, above and between.",
    formula: "Percentile = Φ(z) × 100%",
    whenToUse: [
      "To translate a standardized score into plain language — z = 1.96 means the 97.5th percentile.",
      "For test scores (IQ, SAT), growth charts and any normally distributed measurement.",
    ],
    howToUse: [
      "Enter the z-score directly, or switch to Raw score mode and provide the score, mean and standard deviation.",
      "The calculator evaluates the standard normal CDF for your z.",
      "Read the percentile plus the area above and the central area between ±|z|.",
    ],
    example: {
      title: "Example: IQ 130",
      body: "IQ 130 with mean 100 and SD 15 gives z = 2.0 → the 97.7250th percentile — roughly the top 2.3%.",
    },
    excelNote: "In Excel use =NORM.S.DIST(z, TRUE).",
  },
  "critical-z-value-calculator": {
    metaDescription:
      "Free critical z value calculator — instant critical values for any confidence level (80–99.9%) or custom α, one or two-tailed. Like NORM.S.INV in Excel.",
    formula: "z_critical = Φ⁻¹(1 − α) or Φ⁻¹(1 − α/2)",
    whenToUse: [
      "Before running a z-test: you need the cut-off beyond which you reject the null hypothesis.",
      "Building confidence intervals: the critical z times the standard error sets the interval's width.",
    ],
    howToUse: [
      "Pick a confidence level from the dropdown — or type a custom significance α (like 0.05) to override it.",
      "Choose one-tailed or two-tailed.",
      "Read the critical z values: ±1.9600 for the classic 95% two-tailed case.",
    ],
    example: {
      title: "Example: 95% two-tailed",
      body: "α = 0.05 split into two tails of 0.025 each gives critical z = ±1.9600 — the number every statistics student memorizes.",
    },
    excelNote: "In Excel use =NORM.S.INV(1 − α/2) for two-tailed critical values.",
  },
  "p-value-from-z-score-calculator": {
    metaDescription:
      "Free p-value from z-score calculator — get the exact one or two-tailed p-value for any z statistic, with a significance verdict at α = 0.05.",
    formula: "P = 2 × (1 − Φ(|z|)) for two-tailed · P = 1 − Φ(z) for one-tailed",
    whenToUse: [
      "After computing a z-statistic — a z-test, a large-sample proportion or mean test — and you need the p-value to make the call.",
      "Whenever a paper reports “z = 2.5” and you want to know how strong the evidence really is.",
    ],
    howToUse: [
      "Enter your z statistic (the sign only affects direction, not strength).",
      "Pick one-tailed or two-tailed to match your hypothesis.",
      "Read the p-value and the verdict against the conventional α = 0.05 threshold.",
    ],
    example: {
      title: "Example: z = 1.96",
      body: "Two-tailed p = 0.0500 — exactly on the boundary of significance at the 5% level. z = 2.576 gives p = 0.0100.",
    },
    excelNote: "In Excel use =2 × (1 − NORM.S.DIST(ABS(z), TRUE)) for the two-tailed p-value.",
  },
  "weighted-average-overtime-calculator": {
    metaDescription:
      "Free weighted average overtime calculator — the FLSA blended-rate method for employees working two jobs at different pay rates. Full pay breakdown.",
    formula: "Blended rate = Σ(hoursᵢ × rateᵢ) ÷ Σ(hoursᵢ) · OT rate = blended × multiplier",
    whenToUse: [
      "When an employee works two different jobs at different rates in the same week and goes over 40 hours — US FLSA rules require the weighted-average method.",
      "To check payroll correctness: overtime is owed on the blended rate, not the higher single-job rate.",
    ],
    howToUse: [
      "Enter both jobs' hours and hourly rates.",
      "Set the overtime multiplier (1.5 for time-and-a-half) and the threshold (usually 40 hours).",
      "Read the blended regular rate, the overtime rate, the premium owed and total weekly pay.",
    ],
    example: {
      title: "Example: 30h at $20 + 20h at $30",
      body: "Straight-time pay $1,200 over 50 hours gives a blended rate of $24.00 → OT rate $36.00 for the 10 hours beyond 40, a premium of $120, and total pay of $1,320. Press “Reset to example” to reproduce every figure.",
    },
  },
  "vwap-calculator": {
    metaDescription:
      "Free VWAP calculator — volume weighted average price for any set of trades, with total volume, notional traded and comparison to the simple mean price.",
    formula: "VWAP = Σ(priceᵢ × volumeᵢ) ÷ Σ(volumeᵢ)",
    whenToUse: [
      "As a trading benchmark: buying below the day's VWAP means better-than-average execution.",
      "To see the true average price of a position built through several fills of different sizes.",
    ],
    howToUse: [
      "Enter each fill's price and share volume.",
      "The calculator weights every price by its size and divides by total volume.",
      "Compare with the simple mean price to see how much volume weighting matters.",
    ],
    example: {
      title: "Example: three fills",
      body: "(100×200) + (102×300) + (98×500) = $99,600 over 1,000 shares → VWAP $99.60, while the simple mean price is $100.00. Press “Reset to example” to verify.",
    },
  },
}
