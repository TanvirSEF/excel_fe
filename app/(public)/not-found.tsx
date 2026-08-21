import Link from "next/link"

export default function PublicNotFound() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-4 py-24 text-center">
      <p className="font-mono text-sm font-semibold text-primary">404</p>
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        #N/A — page not found
      </h1>
      <p className="max-w-md text-balance text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Home
        </Link>
        <Link
          href="/blog"
          className="inline-flex h-9 items-center rounded-md border px-4 text-sm font-medium transition-colors hover:bg-accent"
        >
          Browse articles
        </Link>
      </div>
    </div>
  )
}
