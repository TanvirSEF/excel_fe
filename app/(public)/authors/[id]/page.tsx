import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import {
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandPinterest,
  IconBrandX,
  IconBrandYoutube,
  IconCalendar,
  IconNews,
  IconWorld,
} from "@tabler/icons-react"

import { Pagination } from "@/components/shared/pagination"
import { Time } from "@/components/shared/time"
import { Breadcrumb } from "@/components/site/breadcrumb"
import { PostGrid } from "@/components/site/post-grid"
import { getAuthor } from "@/lib/api/authors"
import { getPosts } from "@/lib/api/posts"
import { ApiClientError } from "@/lib/api/error"
import { clamp, cn, firstParam } from "@/lib/utils"
import { config } from "@/lib/config"

interface AuthorPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function loadAuthor(id: string) {
  try {
    return await getAuthor(id)
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 404) {
      notFound()
    }
    throw error
  }
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("")
}

function getAuthorSocialLinks(author: {
  linkedin_url?: string | null
  twitter_url?: string | null
  github_url?: string | null
  website_url?: string | null
}) {
  const links = []

  if (author.linkedin_url) {
    links.push({
      href: author.linkedin_url,
      icon: IconBrandLinkedin,
      label: "LinkedIn",
      className:
        "bg-[#0A66C2] text-white hover:bg-[#084e96] shadow-sm shadow-[#0A66C2]/30",
    })
  }

  if (author.twitter_url) {
    links.push({
      href: author.twitter_url,
      icon: IconBrandX,
      label: "X (Twitter)",
      className:
        "bg-black text-white ring-1 ring-white/20 hover:bg-neutral-900 shadow-sm shadow-black/40",
    })
  }

  if (author.github_url) {
    links.push({
      href: author.github_url,
      icon: IconBrandGithub,
      label: "GitHub",
      className:
        "bg-[#24292e] text-white hover:bg-[#1b1f23] shadow-sm shadow-[#24292e]/30",
    })
  }

  if (author.website_url) {
    const url = author.website_url
    const lower = url.toLowerCase()
    if (lower.includes("facebook.com")) {
      links.push({
        href: url,
        icon: IconBrandFacebook,
        label: "Facebook",
        className:
          "bg-[#1877F2] text-white hover:bg-[#1464c9] shadow-sm shadow-[#1877F2]/30",
      })
    } else if (lower.includes("youtube.com") || lower.includes("youtu.be")) {
      links.push({
        href: url,
        icon: IconBrandYoutube,
        label: "YouTube",
        className:
          "bg-[#FF0000] text-white hover:bg-[#E60000] shadow-sm shadow-[#FF0000]/30",
      })
    } else if (lower.includes("pinterest.com")) {
      links.push({
        href: url,
        icon: IconBrandPinterest,
        label: "Pinterest",
        className:
          "bg-[#E60023] text-white hover:bg-[#c5001e] shadow-sm shadow-[#E60023]/30",
      })
    } else {
      links.push({
        href: url,
        icon: IconWorld,
        label: "Website",
        className:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/25",
      })
    }
  }

  return links
}

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { id } = await params
  const author = await loadAuthor(id)

  return {
    title: `${author.name} — Articles & Tutorials | Excel Insider`,
    description:
      author.bio ??
      `${author.post_count} spreadsheet guides and tutorials written by ${author.name}.`,
    alternates: { canonical: `/authors/${author.id}` },
  }
}

export default async function AuthorPage({ params, searchParams }: AuthorPageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams])
  const page = clamp(Number(firstParam(query.page) ?? 1) || 1, 1, 10_000)

  const author = await loadAuthor(id)
  const posts = await getPosts({ author: author.id, page, page_size: 12 })

  const sameAs = [
    author.website_url,
    author.linkedin_url,
    author.twitter_url,
    author.github_url,
  ].filter(Boolean) as string[]

  const personJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    url: `${config.siteUrl}/authors/${author.id}`,
    image: author.avatar_url ?? undefined,
    description: author.bio ?? undefined,
    ...(sameAs.length > 0 && { sameAs }),
  })

  const socialLinks = getAuthorSocialLinks(author)

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: author.name }]}
      />

      <header className="mt-6 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 sm:p-8">
        <div className="flex flex-wrap items-start gap-5">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/15 text-xl font-bold text-primary ring-2 ring-primary/20">
            {author.avatar_url ? (
              <Image
                src={author.avatar_url}
                alt={author.name}
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              initials(author.name)
            )}
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {author.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <IconNews className="h-4 w-4 text-primary/70" />
                {author.post_count} {author.post_count === 1 ? "article" : "articles"}
              </span>
              <span className="flex items-center gap-1.5">
                <IconCalendar className="h-4 w-4 text-primary/70" />
                Writing here since <Time date={author.joined_at} variant="date" />
              </span>
            </div>
            {author.bio ? (
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {author.bio}
              </p>
            ) : null}
            {socialLinks.length > 0 ? (
              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                {socialLinks.map(({ href, icon: Icon, label, className }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 hover:-translate-y-1 hover:scale-110 active:scale-95",
                      className
                    )}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <div className="mt-10">
        <PostGrid
          posts={posts.items}
          emptyTitle="No articles yet"
          emptyDescription="Articles by this author will appear here once published."
        />
      </div>

      <div className="mt-10">
        <Pagination
          page={page}
          totalPages={posts.total_pages}
          pathname={`/authors/${author.id}`}
        />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: personJsonLd }}
      />
    </div>
  )
}

