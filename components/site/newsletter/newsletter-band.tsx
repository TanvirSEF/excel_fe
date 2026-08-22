import { NewsletterForm } from "@/components/site/newsletter/newsletter-form"

export function NewsletterBand() {
  return (
    <section className="mb-16 mt-4 rounded-2xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12">
      <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
        One practical Excel tip, every week
      </h2>
      <p className="mx-auto mt-2 max-w-md text-balance text-sm text-primary-foreground/80">
        Short, example-driven emails — no spam, unsubscribe anytime.
      </p>
      <div className="mt-6 flex justify-center">
        <NewsletterForm source="home-band" variant="band" />
      </div>
    </section>
  )
}
