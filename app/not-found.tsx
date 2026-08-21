import Link from "next/link"

export default function RootNotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-mono text-sm font-semibold text-primary">404</p>
      <h1 className="text-2xl font-bold tracking-tight">Page not found</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link
        href="/"
        className="mt-2 inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        Back to home
      </Link>
    </div>
  )
}
