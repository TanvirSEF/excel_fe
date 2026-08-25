import type { Metadata } from "next"

import { HomeHero } from "@/components/site/home-hero"
import { HeroStatsBand } from "@/components/site/hero-stats-band"
import { TopicsSection } from "@/components/site/topics-section"
import { PostSection } from "@/components/site/post-section"
import { ServicesSection } from "@/components/site/services-section"
import { CalculatorsShowcase } from "@/components/site/calculators-showcase"
import { TopicsExplorer } from "@/components/site/topics-explorer"
import { FaqSection } from "@/components/site/faq-section"
import { NewsletterBand } from "@/components/site/newsletter/newsletter-band"
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
    getPosts({ trending: true, page_size: 3 }, 300),
    getPosts({ page_size: 9 }, 300),
    getCategories(300),
  ])

  const featuredCategories = categories.filter((c) => c.is_featured)

  return (
    <>
      {/* 1. Authority Hero Section & Live Excel Window Mockup */}
      <HomeHero categories={featuredCategories} />

      {/* 2. Social Proof & Trust Metrics Band */}
      <HeroStatsBand />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 3. Explore by Core Pillar (6 Structured Learning Tracks) */}
        <TopicsSection categories={categories} />

        {/* 4. Trending & Editor's Picks (Top 3 Popular Guides) */}
        <div className="border-t border-border/60">
          <PostSection
            title="Trending Tutorials"
            subtitle="Top formula breakdowns and spreadsheet guides most read this week."
            badge="Popular this week"
            action={{ label: "View all tutorials", href: "/blog" }}
            posts={trending.items.slice(0, 3)}
            hideIfEmpty
            className="py-12 sm:py-16"
          />
        </div>

        {/* 5. Professional Excel & Sheets Services (3 Bespoke 3D Cards) */}
        <div className="border-t border-border/60">
          <ServicesSection />
        </div>

        {/* 6. Interactive Spreadsheet Calculators Showcase (4 Tools) */}
        <div className="border-t border-border/60">
          <CalculatorsShowcase />
        </div>

        {/* 7. Comprehensive Topic Directory (Category Tabs + Live Filtered Posts) */}
        <div className="border-t border-border/60">
          <TopicsExplorer
            categories={categories}
            initialCategorySlug={categories[0]?.slug}
          />
        </div>

        {/* 8. Fresh Content Feed: Latest Articles (3x3 Grid = 9 Posts) */}
        <PostSection
          title="Latest Articles"
          subtitle="Fresh spreadsheet tips, VBA automations, and downloadable templates."
          action={{ label: "Browse archive", href: "/blog" }}
          posts={latest.items}
          emptyDescription="The first ones are on their way."
          className="border-t border-border/60 py-12 sm:py-16"
        />

        {/* 9. Frequently Asked Questions (Accordion) */}
        <div className="border-t border-border/60">
          <FaqSection />
        </div>

        {/* 10. Newsletter Lead Magnet & Subscription */}
        <div className="pb-16 pt-4">
          <NewsletterBand />
        </div>
      </div>
    </>
  )
}
