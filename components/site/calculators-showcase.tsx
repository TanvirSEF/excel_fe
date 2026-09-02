import { CalculatorCard } from "@/components/site/calculators/calculator-card"
import { SectionHeading } from "@/components/site/section-heading"
import { CALCULATORS } from "@/lib/calculators"

export function CalculatorsShowcase() {
  return (
    <section id="calculators" className="scroll-mt-20 py-12 sm:py-16">
      <SectionHeading
        badge="Instant Free Tools"
        title="Interactive Spreadsheet Calculators"
        subtitle="Perform quick financial calculations, date difference analysis, and growth modeling right in your browser."
        action={{ label: "View all calculators", href: "/calculators" }}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {CALCULATORS.slice(0, 4).map((calculator) => (
          <CalculatorCard key={calculator.slug} calculator={calculator} variant="compact" />
        ))}
      </div>
    </section>
  )
}
