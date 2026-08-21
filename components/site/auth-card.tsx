export function AuthCard({ title }: { title: string }) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Not implemented yet.
      </p>
    </div>
  )
}
