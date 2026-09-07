interface StepListProps {
  steps: { title: string; body: string }[]
}

export function StepList({ steps }: StepListProps) {
  return (
    <div className="rounded-2xl border border-primary/25 bg-primary/5 p-4 sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
        Step by step
      </p>
      <ol className="mt-3 space-y-3">
        {steps.map((step, index) => (
          <li key={step.title} className="flex gap-3">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
              {index + 1}
            </span>
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-semibold text-foreground">{step.title}</p>
              <p className="font-mono text-xs leading-relaxed text-foreground/75">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
