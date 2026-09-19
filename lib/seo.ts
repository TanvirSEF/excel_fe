import { config } from "@/lib/config"
import type { PostDetail, PostListItem, SeriesSummary } from "@/types/api"

export function buildArticleJsonLd(post: PostDetail, path?: string) {
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
    mainEntityOfPage: `${config.siteUrl}${path ?? `/blog/${post.slug}`}`,
  }
  if (image) data.image = [image]

  return JSON.stringify(data)
}

export function buildSeriesJsonLd(series: SeriesSummary, posts: PostListItem[]) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: series.name,
    url: `${config.siteUrl}/series/${series.slug}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: posts.length,
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${config.siteUrl}/blog/${post.slug}`,
        name: post.title,
      })),
    },
  }
  if (series.description) data.description = series.description

  return JSON.stringify(data)
}

export function buildBreadcrumbJsonLd(
  items: { label: string; href?: string }[]
) {
  const itemListElement = items.map((item, index) => {
    const entry: Record<string, unknown> = {
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
    }
    if (item.href) {
      entry.item = item.href.startsWith("http")
        ? item.href
        : `${config.siteUrl}${item.href}`
    }
    return entry
  })

  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  })
}

