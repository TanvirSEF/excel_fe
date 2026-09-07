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
      "Free pooled variance calculator — unlimited groups, standard deviation or variance input, Excel paste. Pooled variance, pooled SD and degrees of freedom instantly.",
    formula:
      "s²p = [(n₁−1)s₁² + (n₂−1)s₂² + … + (nₖ−1)sₖ²] ÷ [(n₁−1) + (n₂−1) + … + (nₖ−1)]",
    whenToUse: [
      "Sometimes you have data from two or more groups — Class A and Class B, or samples from several production lines — that share a similar level of spread. Instead of calculating each variance separately, pooled variance combines them into one reliable, weighted average.",
      "Why weighted? Imagine Group A has 1,000 people and Group B has 5. You should not average their variances equally — the larger group gives more reliable data. Pooled variance gives more importance to larger groups, keeping the estimate of population variability accurate.",
    ],
    howToUse: [
      "Pick the value type: Std Dev mode squares your SD values automatically (2.5 becomes 6.25); Variance mode uses values as entered.",
      "Type each group on a separate line as Size, Value — e.g. 10, 2.5 — or paste directly from Excel. Unlimited groups.",
      "Read the pooled variance (for ANOVA and F-tests) and the pooled standard deviation (for t-tests and confidence intervals), with degrees of freedom computed automatically.",
    ],
    example: {
      title: "Example: three production lines",
      body: "n=10 with SD 2.5, n=15 with SD 3.1, n=20 with SD 2.8 → variances 6.25, 9.61, 7.84 → numerator 339.75 over df 42 → pooled variance 8.0893, pooled SD 2.8442. Press Reset to reproduce every number.",
    },
    method: {
      title: "How this calculator works",
      paragraphs: [
        "Many students confuse standard deviation (s) with variance (s²) — the value-type toggle prevents that mistake. In SD mode the tool squares each value before pooling; in Variance mode it uses them as entered.",
        "Each line is one group: the first number is the sample size, the second the SD or variance. The tool weights every group's variance by its degrees of freedom (n − 1), sums, and divides by the total degrees of freedom — handling k groups at once.",
      ],
      formula: "df total = (n₁−1) + (n₂−1) + … = N total − k",
    },
    facts: [
      {
        title: "1. The assumption of homogeneity",
        body: "Pooled variance works only when groups have a similar spread — statisticians call this homoscedasticity. If one group's variance is 5 and another's is 500, pooling gives a misleading result: use Welch's t-test instead of a pooled test.",
      },
      {
        title: "2. Degrees of freedom combine",
        body: "One sample contributes n − 1 degrees of freedom; combined groups add up: df total = (n₁−1) + (n₂−1) + …, or simply N total − k. The calculator shows this value — you need it to find critical values in statistical tables.",
      },
    ],
    useCases: [
      {
        title: "Independent t-tests",
        body: "Independent t-tests compare the means of two separate groups — two medicines, two teaching methods. The pooled variance estimates the shared standard error that the test statistic is built on.",
      },
      {
        title: "ANOVA",
        body: "In ANOVA, the Mean Square Error (MSE, also called Mean Square Within) is a pooled variance. This calculator hands you that value directly — no full ANOVA table needed.",
      },
      {
        title: "Quality control",
        body: "Factories sample products from several machines each hour. Pooling the variances of all samples gives a better estimate of the factory's overall process performance than any single machine's data.",
      },
    ],
    faqs: [
      {
        question: "Can I calculate pooled variance with only sample sizes and means?",
        answer:
          "No. You also need the standard deviation or variance for each group — the mean never appears in the pooled variance formula.",
      },
      {
        question: "Is pooled variance the same as average variance?",
        answer:
          "No — they match only when sample sizes are equal. When sizes differ, pooled variance weights larger groups more heavily, so the result stays closer to the larger group's variance.",
      },
      {
        question: "What if one group has n = 1?",
        answer:
          "A group with a single value cannot be used. The formula relies on n − 1, which becomes zero when n = 1 — and variance needs at least two data points to exist.",
      },
      {
        question: "When should I avoid pooled variance?",
        answer:
          "Avoid it when group variances differ too much — for example, when one is four times larger than another — or when the data is highly skewed. In those cases the pooled result does not represent the groups; Welch's t-test is the safer route.",
      },
    ],
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
      "Free z-score to percentile calculator with bell curve graph — see your percentile rank, probability and how many people you scored above, instantly.",
    formula: "Percentile = Φ(z) × 100%  ·  z = (x − μ) ÷ σ",
    whenToUse: [
      "A test score alone does not say much — a score of 75 may rank very high or very low. You need your percentile rank to understand your position. This calculator converts your z-score to a percentile and shows how many people you scored above.",
      "The z-score is the distance: how far a data point is from the average. A z-score of 0 means exactly average; +1 means one standard deviation above. The percentile is the rank: how many values fall below yours — the 80th percentile means you scored higher than 80% of the group.",
    ],
    howToUse: [
      "Enter a z-score directly, or switch to Raw Score mode and provide your score, the mean and the standard deviation.",
      "The calculator evaluates the cumulative distribution function (CDF) — the area under the bell curve from the left up to your z-score.",
      "Read the percentile, the probability, the right-tail percentage and the bell curve visualization with the shaded area.",
    ],
    example: {
      title: "A simple example — height",
      body: "The average height for men is 70 inches with a standard deviation of 3 inches. Your height is 76 inches. Subtract the average: 76 − 70 = 6. Divide by the SD: 6 ÷ 3 = 2. Your z-score is 2.0, which equals the 97.7th percentile — you are taller than about 98% of men.",
    },
    excelNote: "In Excel use =NORM.S.DIST(z, TRUE) for the probability, then format as a percentage.",
    method: {
      title: "How this calculator works — the CDF",
      paragraphs: [
        "The calculator uses the cumulative distribution function. The bell curve represents the full population, and the area under the curve shows probability. The curve splits into two equal parts at z = 0, which gives a percentile of 50% — the exact middle.",
        "A positive z-score moves above the average: the calculator measures the area from the left side of the curve to your score. A negative z-score moves below the average, where the area becomes smaller. People once used a large chart called a Z-Table to find percentiles by hand — this calculator replaces it with instant, more exact results.",
      ],
      formula: "Percentile = Φ(z) × 100",
    },
    facts: [
      {
        title: "1. The 68-95-99.7 rule",
        body: "68% of all people fall between z = −1 and +1 — the average group. 95% fall between −2 and +2; outside this range you are unusual. 99.7% fall between −3 and +3; falling outside is extremely rare. Use this rule to estimate percentiles without a calculator.",
      },
      {
        title: "2. Percentiles can never reach 100%",
        body: "The 100th percentile is mathematically impossible — the bell curve stretches forever in both directions without ever touching the bottom. Even a z-score of 5.0 only reaches 99.99997%. Most tests report a highest percentile of 99.9th.",
      },
      {
        title: "3. Symmetry is key",
        body: "The normal distribution is perfectly symmetrical. A z-score of +1.0 equals the 84th percentile; a z-score of −1.0 equals the 16th percentile. Notice that 100 − 84 = 16. If you know the percentile for a positive z-score, you already know the negative version — just subtract from 100.",
      },
    ],
    useCases: [
      {
        title: "Standardized tests",
        body: "A raw SAT or IQ score does not show your full ranking. An IQ score of 130 has a z-score of +2.0, which falls near the 98th percentile — the top 2% of test takers.",
      },
      {
        title: "Baby growth charts",
        body: "Doctors use percentiles to track child growth: a baby in the 15th percentile for weight weighs more than 15 out of 100 babies of the same age. Z-scores help doctors follow growth over time and spot problems early.",
      },
      {
        title: "Product quality checks",
        body: "Factories use z-scores to keep products consistent — a soda machine aiming for 500 ml with fills at 498 or 502 ml. Engineers study the z-scores of fill amounts; the Six Sigma method targets a z-score close to 6.",
      },
    ],
    faqs: [
      {
        question: "Can a percentile be negative?",
        answer:
          "No. Percentiles always stay between 0% and 100%. A z-score, however, can be negative — meaning your value falls below the average. A z-score of −2.0 matches the 2.28th percentile: a low rank, but still positive.",
      },
      {
        question: "What is a good z-score?",
        answer:
          "It depends on what you measure. Test scores and income favor higher values — a positive z-score above +1.0 is often good. Golf scores and race times favor lower values — a negative z-score below −1.0 is better. In most situations, a z-score between −1 and +1 falls within the normal range.",
      },
      {
        question: "Why does the graph never touch the bottom line?",
        answer:
          "The normal distribution follows a special pattern — the curve moves closer to zero as the z-score increases, but never fully reaches it. This means rare events can still happen: the chance becomes very small, but never completely disappears.",
      },
      {
        question: "How do I calculate my z-score if I don't have it?",
        answer:
          "Subtract the average from your raw score, then divide by the standard deviation: z = (x − μ) ÷ σ. Or simply switch to Raw Score mode above and the calculator derives it for you.",
      },
    ],
  },
  "critical-z-value-calculator": {
    metaDescription:
      "Free critical z-value calculator with rejection region graph — find critical values for any confidence level (90%, 95%, 99%), one or two-tailed. Instant results.",
    formula: "z_critical = Φ⁻¹(1 − α) [one-tailed] · z_critical = ±Φ⁻¹(1 − α/2) [two-tailed]",
    whenToUse: [
      "Every scientific experiment has a turning point — the point where data stops looking average and becomes statistically significant. The Critical Z-Value Calculator finds this boundary in seconds, whether you use a 95% confidence level or a stricter 99% study.",
      "Think of a game where you throw a ball into a bucket: a small miss feels normal, a large miss feels unusual. The critical z-value sets that limit — if your result stays inside the acceptance region, it is normal chance. If it goes into the rejection zone, you call it statistically significant.",
    ],
    howToUse: [
      "Pick the significance level (α): 0.05 for most studies, 0.01 for medical studies, or 0.10 for exploratory marketing work.",
      "Choose the test type: two-tailed (standard — checks for any difference) or one-tailed (left/right — checks one direction only).",
      "Read the critical z-value, the rejection region area, and the confidence level — the curve shows the rejection zones in red.",
    ],
    example: {
      title: "Example: 95% confidence, two-tailed",
      body: "α = 0.05 split into two tails of 2.5% each. The calculator finds the cutoff for both ends: ±1.960. If your z-score goes above 1.96 or below −1.96, you reject the null hypothesis.",
    },
    excelNote: "In Excel use =NORM.S.INV(1 − α/2) for two-tailed critical values, or =NORM.S.INV(1 − α) for one-tailed.",
    method: {
      title: "Understanding the logic — tails and alpha",
      paragraphs: [
        "The significance level (α) sets your risk limit: 0.05 means 95% confident, 0.01 means 99% confident, 0.10 means 90% confident. Most studies use 0.05; medical studies prefer 0.01 for extra safety.",
        "Two-tailed test (the standard): you look for any kind of difference — the calculator splits α in half, putting α/2 on each side of the curve. One-tailed test: you care about only one direction — the calculator places the full α on one side, which lowers the cutoff to 1.645 instead of 1.96, making significance easier to reach.",
      ],
      formula: "Two-tailed: α/2 in each tail · One-tailed: full α in one tail",
    },
    facts: [
      {
        title: "1. The big three numbers",
        body: "Statisticians memorize three critical values: ±1.645 for 90% confidence (or 95% one-tailed), ±1.960 as the standard for 95% confidence, and ±2.576 for 99% confidence in strict tests. If you see a z-score of 3.0, it already passes all three.",
      },
      {
        title: "2. Critical values define the rejection region",
        body: "The red zone on the graph is the rejection region — where the null hypothesis fails. If your test statistic enters this zone beyond the critical value, you reject the null. Most experiments aim for this result because it shows a meaningful finding.",
      },
      {
        title: "3. Z vs. T — the sample size rule",
        body: "This calculator uses critical z-values, which work when your sample size exceeds 30. With a small sample — like 5 patients — z-values do not work well; you need a critical t-value instead, which uses a higher cutoff to handle the uncertainty.",
      },
    ],
    useCases: [
      {
        title: "A/B testing (marketing)",
        body: "You test two website headlines at 95% confidence. Before collecting data, set the cutoff at 1.96. After a week, your z-score of 2.1 exceeds 1.96 — the result is significant, switch to the new headline.",
      },
      {
        title: "Quality assurance (factories)",
        body: "A factory making 10mm steel bolts sets a strict 99% confidence level (α = 0.01), giving a critical value of ±2.576. A batch returns a z-score of −2.8 — in the rejection region. The bolts are too thin; the manager stops the machine.",
      },
      {
        title: "Political polling",
        body: "When news channels say 'Candidate A leads by 4 points with a margin of error of 3%,' they base the margin on critical values. The margin of error equals the critical value multiplied by the standard error — 1.96 for 95% confidence.",
      },
    ],
    faqs: [
      {
        question: "What is the difference between a z-score and a critical value?",
        answer:
          "Think of the critical value as the goal post and the z-score as the ball. The critical value sets a fixed line before the test — it depends on your confidence level. The z-score shows your result after collecting data. You score a goal when your z-score passes the critical value.",
      },
      {
        question: "Why is the critical value lower for a one-tailed test?",
        answer:
          "A one-tailed test puts the full error budget on one side, moving the cutoff closer to the center. Two-tailed at 5%: cutoff is 1.96. One-tailed at 5%: cutoff is 1.645. This makes significance easier to reach, but you must ignore results in the opposite direction.",
      },
      {
        question: "Can a critical value be negative?",
        answer:
          "Yes. A left-tailed test uses a negative value because it looks for a decrease — for example, −1.645. A two-tailed test uses both sides, so it includes a positive and a negative value such as ±1.96.",
      },
      {
        question: "What happens if my z-score matches the critical value?",
        answer:
          "This is a borderline case. Most rules say you reject only when |z| exceeds the critical value strictly. At exactly 1.96 vs. 1.96, you fail to reject — you are close but do not pass. Collect more data for a clearer result.",
      },
      {
        question: "Does the sample size change the critical z-value?",
        answer:
          "No. The z-distribution keeps it fixed: a 95% confidence level always uses 1.96, whether you have 50 people or 5 million. Note: this rule does not apply to t-tests, where t-values change with sample size.",
      },
    ],
  },
  "p-value-from-z-score-calculator": {
    metaDescription:
      "Free p-value calculator with bell curve graph — exact one or two-tailed p-values from any z-score, with significance verdict and rejection region visualization.",
    formula: "P = 2 × (1 − Φ(|z|)) for two-tailed · P = 1 − Φ(z) for one-tailed",
    whenToUse: [
      "In statistics, numbers need proper meaning. You may find a difference in your results, but that difference may come from random chance. The p-value measures that chance — it shows how likely your result appeared by accident.",
      "The p-value is a number between 0 and 1 that measures the strength of evidence against the null hypothesis (H₀). The null hypothesis means nothing changed — a medicine shows no effect, or two groups stay the same. The p-value shows the chance of getting results this extreme if the null hypothesis is true.",
    ],
    howToUse: [
      "Enter your z-score — the test statistic from your z-test or analysis.",
      "Pick the hypothesis type: two-tailed (any difference), left-tailed (decrease), or right-tailed (increase).",
      "Pick the significance level (α) — 0.05 is standard, 0.01 is strict, 0.10 is exploratory.",
      "Read the p-value, the significance verdict, and the bell curve showing the p-value as the shaded area.",
    ],
    example: {
      title: "Example: the classic boundary",
      body: "z = 1.96 with a two-tailed test gives p = 0.0500 — exactly at the edge of significance at α = 0.05. A z-score of 2.576 gives p = 0.0100; a z of 3.00 gives p = 0.0027 (extremely significant).",
    },
    excelNote: "In Excel: =2*(1-NORM.S.DIST(ABS(z),TRUE)) for two-tailed, or =1-NORM.S.DIST(z,TRUE) for right-tailed.",
    method: {
      title: "How to use this calculator — tails & alpha",
      paragraphs: [
        "Two-tailed test (standard): use when you check for a difference in any direction. 'Is Class A's average height different from Class B?' — it could be taller or shorter. The calculator doubles the single-tail probability to cover both extremes.",
        "Left-tailed test: use when you test for a decrease. 'Did the new engine design lower fuel consumption?' The calculator finds the area on the far left of the z-score. Right-tailed test: use when you test for an increase. 'Did the study course improve scores?' The area sits on the far right.",
      ],
      formula: "Two-tailed: P = 2 × tail area · One-tailed: P = single tail area",
    },
    facts: [
      {
        title: "1. The 0.05 alpha level",
        body: "Most scientific fields use 0.05 (5%) as the significance cutoff, called alpha (α). A p-value of 0.04 passes; 0.06 does not. But the threshold varies: particle physicists require 0.0000003 (5 Sigma) for a discovery, while social scientists may accept 0.10.",
      },
      {
        title: "2. P-value is NOT the probability of truth",
        body: "A p-value of 0.05 does NOT mean 'there is a 95% chance my hypothesis is true.' It means 'there is a 5% chance of getting this data if the hypothesis is wrong.' The p-value measures how unusual the data looks — it does not prove a theory is true.",
      },
      {
        title: "3. Z-score relationship",
        body: "The p-value connects directly to the z-score. At z = 0, p = 1.0 (exactly average). At z = 1.96, p = 0.05 (the edge of significance). At z = 3.00, p = 0.0027 (extremely significant).",
      },
    ],
    useCases: [
      {
        title: "A/B testing conversion rates",
        body: "Marketers compare two website versions. Version B gives a z-score of 2.5 → p = 0.012 (two-tailed). The result likely did not happen by chance — the new layout works better.",
      },
      {
        title: "Quality control",
        body: "A factory machine fills bottles with 500ml of soda. One batch averages only 495ml. A z-test measures the chance of a 5ml error. A low p-value tells the team to inspect the machine.",
      },
      {
        title: "Medical trials",
        body: "Researchers compare people who took a drug with people who took a placebo. They calculate a z-score from the difference in results. The final p-value helps experts decide if the drug works well enough for FDA approval.",
      },
    ],
    faqs: [
      {
        question: "Why is the p-value 0.00000?",
        answer:
          "A very high or very low z-score (above 4 or below −4) creates a tiny probability that rounds to zero. This result shows very strong statistical significance — your result is extremely unlikely to have happened by chance.",
      },
      {
        question: "Can I use this for t-scores?",
        answer:
          "No. T-scores use a different formula that includes degrees of freedom. People use t-scores for small sample sizes (n < 30). This calculator works only with z-scores and normal distribution data.",
      },
      {
        question: "What does statistically significant mean?",
        answer:
          "This term means your p-value falls below the significance level (usually 0.05). It tells you the result likely did not happen by chance — there is a real effect worth investigating.",
      },
      {
        question: "Why does the graph change shape?",
        answer:
          "The bell curve keeps the same shape every time. The shaded area changes with your hypothesis type — left-tailed, right-tailed, or two-tailed. The shaded red part shows the p-value percentage visually.",
      },
    ],
  },
  "weighted-average-overtime-calculator": {
    metaDescription:
      "Free weighted average overtime calculator — FLSA blended-rate method for multiple jobs, bonuses and commissions. DOL 4-step process with full pay breakdown.",
    formula: "Regular Rate = Total Straight Pay ÷ Total Hours · OT Premium = OT Hours × Rate × 0.5",
    whenToUse: [
      "Overtime pay does not always follow a simple time-and-a-half rule. Some employees work different jobs with different pay rates, or earn bonuses and commissions. In these cases, federal law (FLSA) requires a weighted average — the blended rate — for overtime pay.",
      "The FLSA requires this method. Employers cannot use only one pay rate. For example, an employee may work 20 hours as a Driver at $25/hr and 30 hours as a Loader at $15/hr. The employer cannot use only the $15 rate for overtime — the law requires blending both rates into one Regular Rate of Pay.",
    ],
    howToUse: [
      "Enter each job or shift with its hours and pay rate — add as many rows as needed.",
      "Enter any non-discretionary bonus (commissions, attendance bonuses, production incentives) — these must be included in the regular rate.",
      "Set the overtime threshold — usually 40 hours, but some states or agreements use 35 or 48.",
      "Read the blended rate, overtime premium and total gross pay, computed with the DOL 4-step method.",
    ],
    example: {
      title: "Example: dual-role employee with a bonus",
      body: "Regular Shift 35h @ $20 + Weekend Shift 10h @ $25 + $100 bonus → straight-time $1,050 over 45 hours → regular rate $23.33/hr → 5 OT hours × $23.33 × 0.5 = $58.33 premium → gross pay $1,108.33. Press Reset to reproduce every figure.",
    },
    excelNote: "In Excel: =(SUMPRODUCT(hours,rates)+bonus)/SUM(hours) for the regular rate, then =MAX(0,total_hours-threshold)*rate*0.5 for the premium.",
    method: {
      title: "How this calculator works — the DOL 4-step process",
      paragraphs: [
        "Step 1 — Total straight-time pay: multiply the hours for each job by its rate, then add all amounts plus any non-discretionary bonus. This covers the '1.0' portion of all hours worked.",
        "Step 2 — Regular rate: divide the total straight-time pay by the total hours worked (including overtime hours). This gives the blended rate.",
        "Step 3 — Overtime premium (the 0.5 method): you already paid the regular rate for all hours in Step 1. Now add only the extra half-time premium: OT hours × Regular Rate × 0.5.",
        "Step 4 — Gross pay: add the straight-time pay and the overtime premium together for the full paycheck amount.",
      ],
      formula: "Straight Pay + (OT Hours × Regular Rate × 0.5) = Gross Pay",
    },
    facts: [
      {
        title: "1. It is not optional",
        body: "The FLSA requires employers to use the weighted average method when employees work different jobs at different rates. Employers cannot use only the lowest rate, the highest rate, or the rate from the 41st hour alone — the blended rate is mandatory for fair overtime across the full workweek.",
      },
      {
        title: "2. Bonuses change the rate",
        body: "Many employers forget to include non-discretionary bonuses in the Regular Rate. These include attendance bonuses, commissions and production incentives. A $100 bonus raises the regular rate for every hour worked that week. This calculator includes a bonus field so the overtime rate adjusts automatically.",
      },
      {
        title: "3. The half-time logic",
        body: "Some calculations show 0.5 in the overtime formula — this does not reduce pay. Standard method: 40h @ $10 + 10h @ $15 (1.5×) = $550. Weighted method: 50h @ $10 (straight) + 10h @ $5 (0.5 premium) = $550. Both produce the same total; the weighted method handles multiple rates more accurately.",
      },
    ],
    useCases: [
      {
        title: "The dual-role employee",
        body: "A restaurant employee works as Server during lunch and Host during dinner — two different pay rates. Employers must blend the rates for overtime calculations.",
      },
      {
        title: "The commission earner",
        body: "A salesperson earns $18/hr plus a $200 commission. Working 50 hours, the commission spreads across all 50 hours, raising the regular rate and the overtime premium.",
      },
      {
        title: "Production bonuses",
        body: "Manufacturing jobs offer production bonuses or piece-rate pay. If the employee works overtime during a bonus week, the bonus must be included in the overtime calculation — this calculator handles it.",
      },
    ],
    faqs: [
      {
        question: "Can I pay overtime using the highest pay rate?",
        answer:
          "Yes — employers can use the highest rate. This gives employees more money and simplifies payroll, but businesses usually spend more. The weighted average gives a more exact result and follows FLSA rules correctly.",
      },
      {
        question: "What is the difference between discretionary and non-discretionary bonuses?",
        answer:
          "Non-discretionary bonuses are expected as part of the work agreement — commissions, attendance bonuses, or sales rewards like 'sell 10, get $50.' Employers must include them in overtime calculations. Discretionary bonuses are unexpected gifts — surprise holiday bonuses or random rewards — and are not included.",
      },
      {
        question: "Why does the calculator ask for a threshold?",
        answer:
          "Most U.S. employers pay overtime after 40 hours in one week, but some state laws or company agreements use different limits like 35 or 48 hours. The threshold field lets you adjust based on your local rules.",
      },
      {
        question: "Does this apply to salaried employees?",
        answer:
          "Usually no — most salaried employees are exempt from overtime. Some non-exempt salaried workers still qualify; in those cases a different method divides the salary by hours worked. This calculator mainly helps hourly employees with multiple pay rates.",
      },
      {
        question: "What happens if an employee works in two different states?",
        answer:
          "Different states follow different overtime laws. Employers usually follow the state where the employee worked, or whichever gives better pay. California, for example, uses daily overtime after 8 hours — this calculator follows the federal weekly (40-hour) standard under FLSA.",
      },
    ],
  },
  "vwap-calculator": {
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
  },
}
