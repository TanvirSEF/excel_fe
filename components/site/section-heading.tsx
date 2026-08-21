export function SectionHeading({ title }: { title: string }) {
  return (
    <div className="mb-5 flex items-center gap-2.5">
      <span className="h-5 w-1 rounded-full bg-primary" aria-hidden />
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
    </div>
  )
}
