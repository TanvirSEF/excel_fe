"use client"

import Link from "next/link"
import {
  IconArticle,
  IconBulb,
  IconMessageQuestion,
  IconPencilPlus,
  IconRefresh,
  IconThumbDown,
  IconThumbUp,
} from "@tabler/icons-react"

import { Time } from "@/components/shared/time"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAssistantAnalytics } from "@/lib/queries/analytics"

export function AssistantInsightsView() {
  const { data, isPending, isError, refetch } = useAssistantAnalytics()

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-card p-12 text-center">
        <h3 className="text-base font-semibold text-foreground">
          Could not load assistant analytics
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          The service may be temporarily unavailable. Please try again.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => refetch()}
        >
          <IconRefresh className="mr-1.5 h-4 w-4" />
          Retry
        </Button>
      </div>
    )
  }

  if (isPending || !data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-9 w-24" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-xl" />
      </div>
    )
  }

  const {
    total_queries,
    queries_today,
    satisfaction_rate,
    match_rate,
    thumbs_up,
    thumbs_down,
    content_gaps,
    recent_queries,
  } = data

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            AI Assistant Insights
          </h1>
          <p className="text-sm text-muted-foreground">
            Live query volume, reader satisfaction ratings, and editorial content opportunities.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="cursor-pointer"
          >
            <IconRefresh className="mr-1.5 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Questions */}
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Queries
            </CardTitle>
            <IconMessageQuestion className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {total_queries.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                +{queries_today} today
              </span>
            </p>
          </CardContent>
        </Card>

        {/* Satisfaction Rating */}
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Satisfaction Rate
            </CardTitle>
            <IconThumbUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {satisfaction_rate}%
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                👍 {thumbs_up}
              </span>
              <span className="text-rose-600 dark:text-rose-400 font-medium">
                👎 {thumbs_down}
              </span>
            </p>
          </CardContent>
        </Card>

        {/* Content Match Rate */}
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Site Match Rate
            </CardTitle>
            <IconArticle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {match_rate}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Queries matched to articles or calculators
            </p>
          </CardContent>
        </Card>

        {/* Content Gaps */}
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Content Opportunities
            </CardTitle>
            <IconBulb className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {content_gaps.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Queries with no matching article yet
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content Opportunities Section */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader>
          <div className="flex items-center gap-2">
            <IconBulb className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-base font-bold text-foreground">
              Content Opportunities (Missing Tutorials)
            </CardTitle>
          </div>
          <CardDescription>
            These questions were asked by readers where no matching tutorials were found on our site.
            Writing guides for these topics directly captures targeted search intent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {content_gaps.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No content gaps found! All recent queries matched existing guides.
            </div>
          ) : (
            <div className="rounded-xl border border-border/70 overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead>User Question / Search Term</TableHead>
                    <TableHead className="w-40">Date</TableHead>
                    <TableHead className="w-36 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {content_gaps.slice(0, 15).map((gap) => (
                    <TableRow key={gap.id}>
                      <TableCell className="font-medium text-foreground max-w-md">
                        {gap.query_text}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {gap.created_at ? (
                          <Time date={gap.created_at} variant="relative" />
                        ) : (
                          "Recent"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="h-8 gap-1 border-primary/30 text-primary hover:bg-primary/10 cursor-pointer"
                        >
                          <Link
                            href={`/dashboard/posts/new?title=${encodeURIComponent(
                              gap.query_text
                            )}`}
                          >
                            <IconPencilPlus className="h-3.5 w-3.5" />
                            <span>Write Guide</span>
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Live Recent Queries Log */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader>
          <div className="flex items-center gap-2">
            <IconMessageQuestion className="h-5 w-5 text-primary" />
            <CardTitle className="text-base font-bold text-foreground">
              Recent Visitor Queries &amp; Feedback
            </CardTitle>
          </div>
          <CardDescription>
            Live stream of questions asked through the Cellie Assistant.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recent_queries.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No queries recorded yet. Ask a question through Cellie on the site to see it here!
            </div>
          ) : (
            <div className="rounded-xl border border-border/70 overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead>User Question</TableHead>
                    <TableHead className="w-32">Matched</TableHead>
                    <TableHead className="w-28 text-center">Feedback</TableHead>
                    <TableHead className="w-36 text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recent_queries.map((q) => (
                    <TableRow key={q.id}>
                      <TableCell className="font-medium text-foreground max-w-md">
                        <p className="line-clamp-2">{q.query_text}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {q.matched_articles_count > 0 ? (
                            <Badge variant="outline" className="text-[11px] font-semibold border-primary/30 bg-primary/5 text-primary">
                              {q.matched_articles_count} Guide{q.matched_articles_count > 1 ? "s" : ""}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[11px] text-muted-foreground">
                              0 Guides
                            </Badge>
                          )}
                          {q.matched_calculators_count > 0 ? (
                            <Badge variant="outline" className="text-[11px] font-semibold border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400">
                              {q.matched_calculators_count} Calc
                            </Badge>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {q.user_feedback === "up" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            <IconThumbUp className="h-3 w-3" />
                            Helpful
                          </span>
                        ) : q.user_feedback === "down" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
                            <IconThumbDown className="h-3 w-3" />
                            Unhelpful
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground/60">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {q.created_at ? (
                          <Time date={q.created_at} variant="relative" />
                        ) : (
                          "—"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
