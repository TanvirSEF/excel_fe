"use client"

import { useDeferredValue, useMemo } from "react"
import type { JSONContent } from "@tiptap/react"
import { analyzeContent } from "@power-seo/content-analysis"
import {
  IconAlertTriangle,
  IconBulb,
  IconChevronDown,
  IconCircleCheck,
  IconCircleX,
  IconGauge,
  IconSearch,
} from "@tabler/icons-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { blocksToHtml, extractImages } from "@/lib/blocks-to-html"
import { docToBlocks } from "@/lib/editor-serialize"
import { cn } from "@/lib/utils"

interface SeoAnalysisPanelProps {
  title: string
  slug: string
  excerpt: string
  metaTitle: string
  metaDescription: string
  canonicalUrl: string
  keyphrase: string
  doc: JSONContent | null
  onKeyphraseChange: (value: string) => void
}

type Status = "good" | "ok" | "poor"
type Result = {
  id: string
  title: string
  description: string
  status: "good" | "ok" | "poor" | "na"
}

const READABILITY_IDS = new Set([
  "paragraph-length",
  "sentence-length",
  "subheading-distribution",
  "transition-words",
  "word-complexity",
  "inclusive-language",
])

const GROUP_ORDER = [
  { key: "seo", label: "SEO", open: true },
  { key: "readability", label: "Readability", open: true },
  { key: "eeat", label: "E-E-A-T", open: false },
  { key: "intent", label: "Search intent", open: false },
  { key: "aeo", label: "AI & answers", open: false },
] as const

function groupKeyOf(id: string) {
  if (id.startsWith("eeat-")) return "eeat"
  if (id.startsWith("intent-")) return "intent"
  if (id.startsWith("aeo-")) return "aeo"
  if (READABILITY_IDS.has(id)) return "readability"
  return "seo"
}

const STATUS_META: Record<Status, { icon: typeof IconCircleCheck; className: string }> = {
  good: { icon: IconCircleCheck, className: "text-emerald-600 dark:text-emerald-400" },
  ok: { icon: IconAlertTriangle, className: "text-amber-600 dark:text-amber-400" },
  poor: { icon: IconCircleX, className: "text-red-600 dark:text-red-400" },
}

const STATUS_RANK: Record<Status, number> = { poor: 0, ok: 1, good: 2 }

const BUCKET_META: Record<Status, { label: string; className: string }> = {
  good: {
    label: "Good SEO score",
    className: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/30 dark:text-emerald-400",
  },
  ok: {
    label: "OK — can improve",
    className: "bg-amber-500/10 text-amber-600 ring-amber-500/30 dark:text-amber-400",
  },
  poor: {
    label: "Needs work",
    className: "bg-red-500/10 text-red-600 ring-red-500/30 dark:text-red-400",
  },
}

function bucketOf(pct: number): Status {
  if (pct >= 70) return "good"
  if (pct >= 40) return "ok"
  return "poor"
}

function CheckRow({ result }: { result: Result }) {
  const meta = STATUS_META[result.status as Status]
  const Icon = meta.icon
  return (
    <li className="flex gap-2">
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", meta.className)} />
      <div className="min-w-0">
        <p className="text-xs font-medium text-foreground">{result.title}</p>
        <p className="text-xs leading-5 text-muted-foreground">{result.description}</p>
      </div>
    </li>
  )
}

function GooglePreview({
  title,
  slug,
  description,
}: {
  title: string
  slug: string
  description: string
}) {
  const trimmedTitle = title.length > 62 ? `${title.slice(0, 62).trimEnd()}…` : title

  return (
    <div className="rounded-lg border bg-white p-3">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100">
          <IconSearch className="h-3.5 w-3.5 text-neutral-500" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-neutral-800">Excel Insider</p>
          <p className="truncate text-[11px] text-neutral-500">
            excelinsider.com › blog › {slug || "your-post-slug"}
          </p>
        </div>
      </div>
      <p className="mt-2 truncate text-[15px] font-normal text-[#1a0dab]">
        {trimmedTitle || "Your post title"}
      </p>
      <p className="mt-1 line-clamp-2 text-xs leading-5 text-neutral-600">
        {description || "Your meta description or excerpt appears here."}
      </p>
    </div>
  )
}

export function SeoAnalysisPanel({
  title,
  slug,
  excerpt,
  metaTitle,
  metaDescription,
  canonicalUrl,
  keyphrase,
  doc,
  onKeyphraseChange,
}: SeoAnalysisPanelProps) {
  const deferredDoc = useDeferredValue(doc)
  const blocks = useMemo(() => docToBlocks(deferredDoc), [deferredDoc])
  const content = useMemo(() => blocksToHtml(blocks), [blocks])
  const images = useMemo(() => extractImages(blocks), [blocks])

  const analysis = useMemo(
    () =>
      analyzeContent(
        {
          title: metaTitle || title,
          metaDescription: metaDescription || excerpt,
          focusKeyphrase: keyphrase.trim() || undefined,
          slug: slug || undefined,
          canonicalUrl: canonicalUrl || undefined,
          siteUrl: "https://excelinsider.com",
          images,
          content,
        },
        { disabledChecks: ["single-h1", "previously-used-keyphrase"] }
      ),
    [canonicalUrl, content, excerpt, images, keyphrase, metaDescription, metaTitle, slug, title]
  )

  const pct =
    analysis.maxScore > 0 ? Math.round((analysis.score / analysis.maxScore) * 100) : null
  const bucket = pct === null ? null : bucketOf(pct)
  const hasContent = blocks.length > 0 || title.trim().length > 0

  const groups = useMemo(() => {
    const byGroup = new Map<string, Result[]>()
    for (const result of analysis.results as Result[]) {
      if (result.status === "na") continue
      const key = groupKeyOf(result.id)
      const list = byGroup.get(key) ?? []
      list.push(result)
      byGroup.set(key, list)
    }
    for (const list of byGroup.values()) {
      list.sort((a, b) => STATUS_RANK[a.status as Status] - STATUS_RANK[b.status as Status])
    }
    return byGroup
  }, [analysis.results])

  return (
    <div className="space-y-4 rounded-xl border bg-card p-4">
      <div className="flex items-center gap-2">
        <IconGauge className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">SEO analysis</h3>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="seo-keyphrase">Focus keyphrase</Label>
        <Input
          id="seo-keyphrase"
          value={keyphrase}
          maxLength={100}
          placeholder="e.g. vlookup in excel"
          onChange={(event) => onKeyphraseChange(event.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          The phrase you want this post to rank for.
        </p>
      </div>

      {!hasContent ? (
        <p className="rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
          Start writing your post — the SEO analysis updates live as you type.
        </p>
      ) : (
        <>
          {bucket && pct !== null ? (
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold ring-4",
                  BUCKET_META[bucket].className
                )}
              >
                {pct}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold">{BUCKET_META[bucket].label}</p>
                <p className="text-xs text-muted-foreground">
                  {analysis.recommendations.length > 0
                    ? `${analysis.recommendations.length} improvements available`
                    : "All checks passed"}
                </p>
              </div>
            </div>
          ) : null}

          <GooglePreview
            title={metaTitle || title}
            slug={slug}
            description={metaDescription || excerpt}
          />

          {keyphrase.trim() ? null : (
            <p className="flex items-start gap-1.5 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-400">
              <IconBulb className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Set a focus keyphrase to unlock keyphrase checks.
            </p>
          )}

          <div className="space-y-3">
            {GROUP_ORDER.map((group) => {
              const results = groups.get(group.key)
              if (!results || results.length === 0) return null
              const poor = results.filter((r) => r.status === "poor").length
              const ok = results.filter((r) => r.status === "ok").length

              return (
                <details
                  key={group.key}
                  className="group rounded-lg border border-border/60"
                  open={group.open}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2 text-xs font-semibold [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center gap-1.5">
                      {group.label}
                      {poor > 0 ? (
                        <span className="text-red-600 dark:text-red-400">
                          {poor} issue{poor > 1 ? "s" : ""}
                        </span>
                      ) : ok > 0 ? (
                        <span className="text-amber-600 dark:text-amber-400">
                          {ok} to improve
                        </span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400">
                          all good
                        </span>
                      )}
                    </span>
                    <IconChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <ul className="space-y-2.5 border-t border-border/60 px-3 py-2.5">
                    {results.map((result) => (
                      <CheckRow key={result.id} result={result} />
                    ))}
                  </ul>
                </details>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
