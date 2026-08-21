import { config } from "@/lib/config"
import type { PostDetail } from "@/types/api"

export function buildArticleJsonLd(post: PostDetail) {
  const image = post.og_image_url ?? post.featured_image_url
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": post.schema_type || "TechArticle",
    headline: post.title,
    description: post.meta_description ?? post.excerpt,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: { "@type": "Person", name: post.author_name },
    publisher: {
      "@type": "Organization",
      name: "Excel Insider",
      url: config.siteUrl,
    },
    mainEntityOfPage: `${config.siteUrl}/blog/${post.slug}`,
  }
  if (image) data.image = [image]

  return JSON.stringify(data)
}
