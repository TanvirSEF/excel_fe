import type { Metadata } from "next"

import { HomeHero } from "@/components/site/home-hero"
import { HeroStatsBand } from "@/components/site/hero-stats-band"
import { LearningTrackSection } from "@/components/site/learning-track-section"
import { TrendingSection } from "@/components/site/trending-list"
import { ServicesSection } from "@/components/site/services-section"
import { TopicsExplorer } from "@/components/site/topics-explorer"
import { FaqSection } from "@/components/site/faq-section"
import { CalculatorsSection } from "@/components/site/calculators-section"
import { YoutubePlaylists } from "@/components/site/youtube-playlists"
import { NewsletterBand } from "@/components/site/newsletter/newsletter-band"
import { getCategories } from "@/lib/api/categories"
import { getCurriculum } from "@/lib/api/curriculum"
import { getPosts } from "@/lib/api/posts"
import type { CurriculumModule } from "@/types/api"

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
  const [trending, categories, trackModules] = await Promise.all([
    getPosts({ trending: true, page_size: 10 }, 300),
    getCategories(300),
    getCurriculum(300).catch(() => [] as CurriculumModule[]),
  ])

  const featuredCategories = categories.filter((c) => c.is_featured)

  return (
    <>
      {/* 1. Authority Hero Section & Live Excel Window Mockup */}
      <HomeHero categories={featuredCategories} />

      {/* 2. Social Proof & Trust Metrics Band */}
      <HeroStatsBand />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 3. Professional Excel & Sheets Services (3 Bespoke 3D Cards) */}
        <ServicesSection />

        {/* 4. Google Sheets Learning Track (Course Journey Showcase) */}
        <div className="border-t border-border/60">
          <LearningTrackSection modules={trackModules} />
        </div>

        {/* 5. Trending Tutorials (Ranked Top 10 Listing) */}
        <div className="border-t border-border/60">
          <TrendingSection posts={trending.items} className="py-12 sm:py-16" />
        </div>

        {/* 6. Comprehensive Topic Directory (Category Tabs + Live Filtered Posts) */}
        <div className="border-t border-border/60">
          <TopicsExplorer
            categories={categories}
            initialCategorySlug={categories[0]?.slug}
          />
        </div>

        {/* 6. Interactive Spreadsheet Calculators Showcase (45 Free Tools) */}
        <div className="border-t border-border/60">
          <CalculatorsSection />
        </div>

        {/* 9. Frequently Asked Questions (Accordion) */}
        <div className="border-t border-border/60">
          <FaqSection />
        </div>

        {/* 10. YouTube Playlists & Video Masterclasses */}
        <div className="border-t border-border/60">
          <YoutubePlaylists />
        </div>

        {/* 11. Newsletter Lead Magnet & Subscription */}
        <div className="pb-16 pt-4">
          <NewsletterBand />
        </div>
      </div>
    </>
  )
}
