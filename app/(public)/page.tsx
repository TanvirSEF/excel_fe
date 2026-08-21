import { HomeHero } from "@/components/site/home-hero"
import { PostSection } from "@/components/site/post-section"
import { getCategories } from "@/lib/api/categories"
import { getPosts } from "@/lib/api/posts"

export const revalidate = 300

export default async function HomePage() {
  const [trending, latest, categories] = await Promise.all([
    getPosts({ trending: true, page_size: 6 }, 300),
    getPosts({ page_size: 9 }, 300),
    getCategories(300),
  ])

  const featuredCategories = categories.filter((c) => c.is_featured)

  return (
    <div className="mx-auto w-full max-w-6xl px-4">
      <HomeHero categories={featuredCategories} />
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
    </div>
  )
}
