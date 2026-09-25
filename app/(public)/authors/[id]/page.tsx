import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  IconArrowRight,
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandPinterest,
  IconBrandX,
  IconBrandYoutube,
  IconCalendar,
  IconNews,
  IconShieldCheck,
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
  const isFounderAuthor = author.id === "e37945f2-9428-44bc-b9c1-f4c12d15be28"

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: author.name }]}
      />

      <header className="relative mt-6 overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-8 md:p-10 shadow-sm">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-chart-2/15 blur-3xl"
        />

        <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:gap-8 sm:text-left">
          <div className="relative group shrink-0">
            <div className="relative flex h-36 w-36 sm:h-44 sm:w-44 md:h-48 md:w-48 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-primary/25 bg-gradient-to-br from-chart-2/20 to-primary/20 shadow-xl ring-4 ring-background transition-transform duration-300 group-hover:scale-[1.02]">
              {author.avatar_url ? (
                <Image
                  src={author.avatar_url}
                  alt={author.name}
                  fill
                  priority
                  sizes="(max-width: 640px) 144px, (max-width: 768px) 176px, 192px"
                  className="object-cover"
                />
              ) : (
                <span className="text-4xl sm:text-5xl font-extrabold text-primary">
                  {initials(author.name)}
                </span>
              )}
            </div>
            <div
              className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md ring-2 ring-background"
              title="Verified Author & Consultant"
            >
              <IconShieldCheck className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                Author &amp; Spreadsheet Consultant
              </span>
              {isFounderAuthor && (
                <Link
                  href="/about/nehad-ulfat"
                  className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-semibold text-foreground/80 shadow-2xs backdrop-blur-xs transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <span>Founder Profile</span>
                  <IconArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>

            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl md:text-4xl">
              {author.name}
            </h1>

            <div className="mt-2.5 flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 text-xs sm:text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5 font-medium">
                <IconNews className="h-4 w-4 text-primary" />
                <strong className="font-bold text-foreground">{author.post_count}</strong>{" "}
                {author.post_count === 1 ? "Guide Published" : "Guides Published"}
              </span>
              <span className="hidden sm:inline-block h-3 w-px bg-border/80" />
              <span className="flex items-center gap-1.5 font-medium">
                <IconCalendar className="h-4 w-4 text-primary" />
                Publishing since <Time date={author.joined_at} variant="date" />
              </span>
            </div>

            {author.bio ? (
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {author.bio}
              </p>
            ) : null}

            {socialLinks.length > 0 ? (
              <div className="mt-5 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
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

      {/* 2nd Section: Editorial & Technical Review Disclosure */}
      <section className="mt-8 sm:mt-10 overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/8 via-card to-card p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/25">
            <IconShieldCheck className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary">
                Editorial Review
              </span>
            </div>
            <h2 className="mt-2 text-lg sm:text-xl font-bold tracking-tight text-foreground">
              {isFounderAuthor
                ? "Articles Published by admin@excelinsider.com"
                : `Articles Published by ${author.name}`}
            </h2>
            <p className="mt-2 text-sm sm:text-base leading-relaxed text-muted-foreground">
              Articles by{" "}
              <strong className="font-semibold text-foreground">
                {isFounderAuthor ? "admin@excelinsider.com" : author.name}
              </strong>{" "}
              are developed under the guidance of ExcelInsider’s core training program and are technically reviewed by{" "}
              <Link
                href="/about/nehad-ulfat"
                className="font-semibold text-primary underline underline-offset-4 decoration-primary/40 transition-colors hover:decoration-primary"
              >
                Nehad Ulfat
              </Link>
              , lead spreadsheet consultant, to ensure accuracy and user-centric value.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-8 sm:mt-10">
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

