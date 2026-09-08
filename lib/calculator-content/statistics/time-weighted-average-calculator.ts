import type { CalculatorDetail } from "../types"

export const timeWeightedAverageCalculator: CalculatorDetail = {
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
}
