export interface EquationItem {
  label: string
  note?: string
  equation: string
  terms?: { name: string; description: string }[]
}

export interface CalculatorDetail {
  metaDescription: string
  formula?: string
  whenToUse: string[]
  howToUse?: string[]
  example?: { title: string; body: string }
  excelNote?: string
  faqs?: { question: string; answer: string }[]
  method?: {
    title: string
    paragraphs?: string[]
    formula?: string
    equations?: EquationItem[]
  }
  parameters?: {
    title: string
    intro?: string
    items: { name: string; description: string }[]
  }
  factsTitle?: string
  factsIntro?: string
  facts?: { title: string; body: string }[]
  factGroups?: {
    title?: string
    intro?: string
    items: { title: string; body: string }[]
  }[]
  factsTable?: { title: string; headers: string[]; rows: string[][] }
  useCases?: { title: string; body: string }[]
}
