import type { Metadata } from "next"

import { HomeHero } from "@/components/site/home-hero"
import { HeroStatsBand } from "@/components/site/hero-stats-band"
import { NewsletterBand } from "@/components/site/newsletter/newsletter-band"
import { PostSection } from "@/components/site/post-section"
import { getCategories } from "@/lib/api/categories"
import { getPosts } from "@/lib/api/posts"

export const revalidate = 300

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    title: "Excel Insider — Excel formulas, tips & deep dives",
    description:
      "Practical, example-driven Excel guides — formulas, shortcuts, Power Query, VBA and more.",
    url: "/",
    images: ["/og-default.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-default.png"],
  },
}

export default async function HomePage() {
  const [trending, latest, categories] = await Promise.all([
    getPosts({ trending: true, page_size: 6 }, 300),
    getPosts({ page_size: 9 }, 300),
    getCategories(300),
  ])

  const featuredCategories = categories.filter((c) => c.is_featured)

  return (
    <>
      <HomeHero categories={featuredCategories} />
      <HeroStatsBand />
      <div className="mx-auto w-full max-w-6xl px-4">
        <PostSection
          title="Trending now"
          posts={trending.items}
          hideIfEmpty
          className="pb-4"
        />
        <PostSection
          title="Latest articles"
          posts={latest.items}
          emptyDescription="The first ones are on their way."
          className="py-10"
        />
        <NewsletterBand />
      </div>
    </>
  )

}
