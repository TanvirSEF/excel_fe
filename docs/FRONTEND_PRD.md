# Excel Insider — Next.js Frontend Engineering Specification

**Internal Technical PRD — v1.0**
**Prepared by:** Tanvir Hasan, Zephlo
**Purpose:** A complete, implementation-ready frontend specification. Feed this document to an AI coding assistant (Claude Code, Cursor, etc.) **one phase at a time** — not all at once. Every phase is a small, independently shippable increment.
**Companion doc:** `excel_be/docs/Excel Insider - FastAPI Backend PRD.md` (backend)

---

## Table of Contents

1. [Overview & Goals](#1-overview--goals)
2. [Current State of This Repo](#2-current-state-of-this-repo)
3. [Packages — What to Install, What to Reuse](#3-packages--what-to-install-what-to-reuse)
4. [Project Folder Structure](#4-project-folder-structure)
5. [Environment & Configuration](#5-environment--configuration)
6. [TypeScript Types (mirrors backend contract)](#6-typescript-types-mirrors-backend-contract)
7. [API Client Architecture](#7-api-client-architecture)
8. [Auth Architecture (tokens, silent refresh, guards)](#8-auth-architecture)
9. [Roles & Navigation Matrix](#9-roles--navigation-matrix)
10. [Content Block Format (editor + renderer)](#10-content-block-format)
11. [Route Map (all pages)](#11-route-map)
12. [Page Specifications — Public Site](#12-page-specifications--public-site)
13. [Page Specifications — Dashboard](#13-page-specifications--dashboard)
14. [SEO Requirements](#14-seo-requirements)
15. [States, Errors & Edge Cases (global rules)](#15-states-errors--edge-cases)
16. [Build Phases (step-by-step work plan)](#16-build-phases)
17. [Backend Gaps Discovered During This PRD](#17-backend-gaps)
18. [Deployment (Dokploy)](#18-deployment-dokploy)

---

## 1. Overview & Goals

Excel Insider is a headless architecture:

```
Next.js 16 (this repo) → FastAPI REST API (excel_be) → PostgreSQL + Redis + R2
```

This frontend serves two distinct experiences in one app:

1. **Public site** (SEO-first, server-rendered): home, article pages with a custom block renderer (Excel formula blocks, tables, embeds), categories, tags, search, newsletter signup, comments.
2. **Team dashboard** (`/dashboard`, auth + RBAC): block-based post editor with a draft → review → publish workflow, media library, comment moderation, categories/tags management, users, analytics, audit logs.

Non-negotiable goals:

- **SEO parity or better vs WordPress** — server-rendered article HTML, metadata, JSON-LD, sitemap, zero broken URLs during migration.
- **Every UI honors the backend's 4-role RBAC.** The frontend hides what a role can't use; the backend enforces it. Never show a button that will 403.
- **Small increments.** Each phase in §16 is one (or a few) working sessions. Nothing else gets built ahead of its phase.

---

## 2. Current State of This Repo

Already scaffolded (shadcn dashboard-01 boilerplate):

- Next.js **16.2.6** (App Router), React **19**, Tailwind CSS **v4**, TypeScript, pnpm
- Fonts wired: DM Sans (sans) + Geist Mono — keep these
- `components/ui/` shadcn primitives: avatar, badge, button, card, chart, checkbox, drawer, dropdown-menu, input, label, select, separator, sheet, sidebar, skeleton, table, tabs, toggle(-group), tooltip
- `app/dashboard/page.tsx` — demo dashboard (SectionCards + ChartAreaInteractive + DataTable with `data.json`) — **will be replaced in Phase 2**, reuse the components as shells
- `components/` — app-sidebar, site-header, nav-* (demo navigation — will be rewritten role-aware)
- Installed libs to reuse: `@tanstack/react-table` (data tables), `recharts` (charts), `zod` v4, `sonner` (toasts), `next-themes` (dark mode, wired via ThemeProvider), `@dnd-kit/*` (category drag-reorder), `@tabler/icons-react` + `lucide-react` (icons — pick **one primary: Tabler**, use Lucide only where Tabler lacks a glyph), `vaul` (drawers)
- `hooks/use-mobile.ts`, `lib/utils.ts` (cn)

Not yet present: data-fetching stack, auth, editor, forms, date utils, API types. That's Phase 0.

---

## 3. Packages — What to Install, What to Reuse

### 3.1 Install (Phase 0)

| Package | Purpose |
|---|---|
| `@tanstack/react-query` | Server-state: caching, retries, invalidation for all dashboard data |
| `@tanstack/react-query-devtools` | Dev debugging (devDependency) |
| `zustand` | Auth/session store (access token in memory) + small UI state |
| `react-hook-form` + `@hookform/resolvers` | All forms (login, editor metadata, category, user…) validated with the already-installed `zod` |
| `@tiptap/react` `@tiptap/starter-kit` `@tiptap/pm` | Block editor core (Phase 5) |
| `@tiptap/extension-link` `@tiptap/extension-image` `@tiptap/extension-placeholder` | Editor basics |
| `@tiptap/extension-table` `@tiptap/extension-table-row` `@tiptap/extension-table-header` `@tiptap/extension-table-cell` | Data tables inside articles |
| `shiki` | Server-side syntax highlighting (Excel formulas, VBA, M/code blocks) |
| `date-fns` | All date formatting/relative time (`format`, `formatDistanceToNow`) |
| `slugify` | Client slug preview matching backend regex `^[a-z0-9]+(-[a-z0-9]+)*$` |

Install as one command in Phase 0 except the TipTap group (defer to Phase 5 to keep increments small — but listing here for planning).

**No axios, no next-auth.** The backend is a custom JWT API (form-encoded login, rotated refresh tokens); a ~100-line fetch wrapper (§7) + one route handler (§8) covers it. next-auth would fight the contract.

### 3.2 Reuse as-is

`@tanstack/react-table` (posts/comments/users/media/audit tables), `recharts` (analytics area + bar charts), `@dnd-kit/*` (category tree reorder), `sonner` (every mutation toast), `zod` (form + API validation), `next-themes` (public site + dashboard theming).

---

## 4. Project Folder Structure

```
excel_fe/
├── app/
│   ├── (public)/                    # Public site route group (SEO layout: header/footer)
│   │   ├── layout.tsx               # Site header, footer, newsletter CTA, ThemeProvider
│   │   ├── page.tsx                 # Home
│   │   ├── blog/page.tsx            # Post index (paginated, filters)
│   │   ├── blog/[slug]/page.tsx     # Article detail
│   │   ├── categories/page.tsx      # Category browse
│   │   ├── categories/[slug]/page.tsx
│   │   ├── tags/[slug]/page.tsx     # Uses GET /posts?tag=
│   │   ├── search/page.tsx
│   │   ├── not-found.tsx            # Custom 404 (also receives WP misses)
│   │   ├── newsletter/unsubscribe/page.tsx
│   │   └── (auth)/                  # Centered card layout
│   │       ├── login/page.tsx
│   │       ├── forgot-password/page.tsx
│   │       ├── reset-password/page.tsx
│   │       └── verify-email/page.tsx
│   │
│   ├── dashboard/                   # Authenticated app (own layout: AppSidebar + SiteHeader)
│   │   ├── layout.tsx               # Sidebar shell, session guard
│   │   ├── page.tsx                 # Overview (role-aware, replaces demo)
│   │   ├── posts/page.tsx           # Data table
│   │   ├── posts/new/page.tsx       # Editor (create)
│   │   ├── posts/[id]/page.tsx      # Editor (edit)
│   │   ├── comments/page.tsx        # Moderation queue
│   │   ├── media/page.tsx           # Media library
│   │   ├── categories/page.tsx      # Tree + dnd reorder
│   │   ├── tags/page.tsx
│   │   ├── users/page.tsx           # super_admin
│   │   ├── audit-logs/page.tsx      # super_admin
│   │   ├── analytics/page.tsx       # Site-wide (editor+/seo)
│   │   └── settings/page.tsx        # Profile, password, verify email
│   │
│   ├── api/                         # Next route handlers (server-only, hold the refresh cookie)
│   │   └── auth/
│   │       ├── login/route.ts
│   │       ├── logout/route.ts
│   │       └── session/route.ts     # Silent refresh / session restore
│   │
│   ├── robots.ts
│   ├── sitemap.ts                   # Either generates from API or rewrites to backend (§14)
│   └── layout.tsx                   # Root: fonts + ThemeProvider + TooltipProvider + Toaster
│
├── components/
│   ├── ui/                          # shadcn primitives (existing; add per-phase via CLI)
│   ├── site/                        # Public site: header, footer, post-card, newsletter-form…
│   ├── blocks/                      # BlockRenderer + one component per block type (§10)
│   ├── editor/                      # TipTap editor, toolbar, slash-menu, block inspector
│   ├── dashboard/                   # Posts table, workflow actions, media grid…
│   └── shared/                      # Pagination, EmptyState, ErrorState, ConfirmDialog, RoleGate
│
├── lib/
│   ├── api/                         # apiFetch + endpoint groups (posts.ts, auth.ts, …)
│   ├── auth.ts                      # Token store, session helpers, role utils
│   ├── queries/                     # TanStack Query hooks (usePosts, usePost, …)
│   └── utils.ts                     # existing cn
│
├── types/
│   └── api.ts                       # Everything in §6 — single source of truth
│
├── proxy.ts                         # Next 16 middleware: /dashboard guard + WP redirects (§14)
└── docs/FRONTEND_PRD.md
```

---

## 5. Environment & Configuration

`.env.local` (dev) / Dokploy env (prod):

```bash
# Browser-visible backend origin (used by client-side apiFetch)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Server-side backend origin (route handlers, SSR fetches — can differ in some deploys)
API_URL=http://localhost:8000

# Canonical site origin (metadata, OG, sitemap, emails)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`lib/config.ts` exports these as typed constants. Never read `process.env` anywhere else.

---

## 6. TypeScript Types (mirrors backend contract)

Single file `types/api.ts`. These mirror the **implemented** Pydantic schemas exactly (snake_case — do not camelCase; the backend uses `extra="forbid"` on requests, so never send a field not listed in the request type).

```ts
export type UserRole =
  | "super_admin"
  | "senior_editor"
  | "technical_writer"
  | "seo_specialist"

export type PostStatus =
  | "draft"
  | "pending_review"
  | "published"
  | "rejected"
  | "scheduled"

export type CommentStatus = "pending" | "approved" | "spam" | "rejected"

export interface Page<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface ApiError {
  error: {
    code: string
    message: string
    status: number
    details?: { field: string; message: string }[]
  }
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar_url: string | null
  bio: string | null
  is_active: boolean
  is_verified: boolean
  last_login_at: string | null
  created_at: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: "bearer"
}

// ---- Posts ----
export interface PostListItem {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featured_image_url: string | null
  reading_time_minutes: number | null
  is_trending: boolean
  view_count: number
  published_at: string | null
}

export interface PostDetail extends PostListItem {
  content_json: ContentDoc
  content_html: string | null
  status: PostStatus
  author_id: string
  author_name: string
  category_id: string | null
  category_name: string | null
  category_slug: string | null
  tags: string[]
  meta_title: string | null
  meta_description: string | null
  canonical_url: string | null
  og_image_url: string | null
  schema_type: string
  published_at: string | null
  scheduled_at: string | null
  rejection_reason: string | null
  created_at: string
  updated_at: string
}

export interface PostAdminItem {
  id: string
  title: string
  slug: string
  status: PostStatus
  author_name: string
  category_name: string | null
  rejection_reason: string | null
  updated_at: string
  published_at: string | null
}

export interface PostCreateInput {
  title: string                      // 1–255
  slug?: string                      // must match ^[a-z0-9]+(-[a-z0-9]+)*$
  excerpt?: string                   // ≤ 500
  content_json: ContentDoc
  featured_image_url?: string | null
  category_id?: string | null
  tags?: string[]
  meta_title?: string                // ≤ 255
  meta_description?: string          // ≤ 500
  canonical_url?: string | null
  og_image_url?: string | null
  schema_type?: string               // ≤ 50, default "TechArticle"
}
export type PostUpdateInput = Partial<PostCreateInput>

export interface SeoUpdateInput {
  meta_title?: string
  meta_description?: string
  canonical_url?: string | null
  og_image_url?: string | null
}

// ---- Blocks (see §10) ----
export interface ContentDoc { blocks: Block[] }
export type Block =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string; level: number }
  | { type: "quote"; text: string }
  | { type: "code"; text: string; language?: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "html"; html: string }               // server-sanitized via nh3
  | { type: "image"; url: string; alt?: string }
  | { type: "table"; rows: string[][]; header?: boolean }

// ---- Categories / Tags ----
export interface Category {
  id: string
  name: string
  slug: string
  parent_id: string | null
  order_index: number
  description: string | null
  icon_url: string | null
  color_hex: string | null
  is_featured: boolean
  seo_title: string | null
  seo_description: string | null
  children: Category[]
}
export interface CategoryWithPosts { category: Category; posts: Page<PostListItem> }

export interface Tag { id: string; name: string; slug: string }

// ---- Comments ----
export interface Comment {
  id: string
  parent_id: string | null
  user_name: string
  comment_text: string
  created_at: string
  children: Comment[]
}
export interface CommentCreateInput {
  user_name: string                  // 1–100
  user_email: string
  comment_text: string
  parent_id?: string | null
}

// ---- Media / Assets ----
export interface MediaItem {
  id: string
  file_url: string
  file_type: string
  alt_text: string | null
  width: number | null
  height: number | null
  size_kb: number | null
  folder: string
  created_at: string
}
export interface DownloadableAsset {
  id: string
  post_id: string
  file_name: string
  file_url: string
  file_type: string
  file_size_kb: number | null
  download_count: number
  created_at: string
}
export interface DownloadUrlResponse { url: string; expires_in: number }

// ---- Analytics ----
export interface PostAnalytics {
  post_id: string
  title: string
  slug: string
  total_views: number
  views_last_7_days: { date: string; views: number }[]
  views_last_30_days: number
  unique_visitors_30_days: number
  top_referrers_30_days: { referrer: string; views: number }[]
}
export interface OverviewAnalytics {
  total_posts: number
  published_posts: number
  draft_posts: number
  total_views: number
  views_last_7_days: number
  top_posts_7_days: { post_id: string; title: string; slug: string; views: number }[]
  trending: { id: string; title: string; slug: string }[]
}

// ---- Audit ----
export interface AuditLog {
  id: number
  user_id: string | null
  actor_name: string | null
  action: string
  entity_type: string
  entity_id: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}
```

---

## 7. API Client Architecture

### 7.1 Endpoint reference (implemented backend, base `/api/v1`)

| Method & path | Auth | Notes |
|---|---|---|
| `POST /auth/login` | public, rate-limited 5/15m | **form-encoded** `username`(=email)&`password` |
| `POST /auth/refresh` | refresh token (JSON body) | rotates refresh token |
| `POST /auth/logout` | access | JSON `{refresh_token}` — proxy sends the cookie value |
| `GET /auth/me` | access | |
| `POST /auth/register` | super_admin | team account creation |
| `POST /auth/forgot-password` | public 5/15m | always 200 |
| `POST /auth/reset-password` | public 10/15m | `{token, new_password}` |
| `POST /auth/change-password` | access | `{current_password, new_password}` |
| `POST /auth/verify-email/request` · `POST /auth/verify-email` | access / public | |
| `GET /users` · `GET/PATCH/DELETE /users/{id}` | super_admin (list) / self | deactivate = soft |
| `GET /categories` | public | full tree |
| `GET /categories/{slug}` | public | `{category, posts: Page<PostListItem>}` |
| `POST /categories` · `PATCH /categories/{id}` | editor+ | |
| `PATCH /categories/reorder` | editor+ | body: array `{id, order_index, parent_id}` |
| `DELETE /categories/{id}` | super_admin | blocked if posts exist |
| `GET /tags` public · `POST /tags` writer+ | | |
| `GET /posts?page&page_size&category&tag&trending&author` | public | `Page<PostListItem>` |
| `GET /posts/admin?page&page_size&status` | writer+ | role-scoped (writers see own) |
| `GET /posts/{post_id}` (UUID only) | writer+ (writers: own) | full `PostDetail` for the editor |
| `GET /posts/{slug}` | public | `PostDetail`, counts a view |
| `GET /posts/{post_id}/assets` public · `POST` writer+ | | multipart attach |
| `GET /posts/{post_id}/comments` public · `POST` public 3/10m | | POST returns `{id, status}` |
| `POST /posts` writer+ · `PATCH /posts/{id}` · `DELETE` editor+ | | soft delete |
| `POST /posts/{id}/submit-review` (own) | | draft → pending_review |
| `POST /posts/{id}/publish` · `/reject` · `/schedule` | editor+ | reject needs `{reason}` |
| `PATCH /posts/{id}/seo` | editor+ **or seo_specialist** | |
| `GET /comments?status=&page=` | editor+ | moderation queue, `Page<CommentAdminItem>` w/ post title |
| `PATCH /comments/{id}/moderate` · `DELETE /comments/{id}` | editor+ | `{status: CommentStatus}` |
| `POST /media/upload` writer+ · `GET /media?folder` · `PATCH /media/{id}` writer+ · `DELETE /media/{id}` editor+ | | multipart `file` + form `folder`; PATCH = `{alt_text?, folder?}` |
| `GET /assets/{id}/download` public · `DELETE /assets/{id}` editor+ | | returns signed `url` + `expires_in` |
| `GET /search?q=` | public | q ≥ 2 chars, `Page<PostListItem>` |
| `GET /analytics/overview` | editor+ / seo | |
| `GET /analytics/posts/{post_id}` | own post or editor+ | |
| `POST /newsletter/subscribe` public 5/1h · `POST /newsletter/unsubscribe` | | `{email, source?}` / `{token}` |
| `GET /audit-logs?page&user_id&entity_type&action` | super_admin | |
| `GET /sitemap.xml` (root, not `/api/v1`) · `GET /api/v1/redirects/{old_path}` | public | |

Pagination: `page` (1-based), `page_size` (default 20, max 50).

### 7.2 `lib/api/apiFetch.ts`

One wrapper used by **client-side** code (dashboard, interactive public widgets):

- Base URL `NEXT_PUBLIC_API_URL`, JSON by default
- Attaches `Authorization: Bearer <accessToken>` from the auth store when present
- On **401**: attempt exactly one silent refresh (§8), retry the original request once, else clear session and redirect to `/login?next=…`
- Parses errors into a typed `ApiError` (envelope above) and throws `ApiClientError`
- On **429**: surface `Retry-After` seconds in the toast ("Too many attempts — try again in Ns")
- Multipart helper `apiUpload(path, file, fields)` for media/asset uploads (never set Content-Type manually)
- `login()` special-case: sends `URLSearchParams` (`username` = email), `Content-Type: application/x-www-form-urlencoded` — this is the single most surprising endpoint in the backend

Server-side (public SSR pages) uses a simpler `serverFetch` with `API_URL`, `next: { revalidate: 60 }` or `tags` — no auth, no refresh.

### 7.3 Query conventions

- `lib/queries/*.ts` — one file per resource, typed hooks wrapping `useQuery`/`useMutation`
- Query keys are arrays mirroring the endpoint + params: `["posts", "list", filters]`, `["posts", "detail", slug]`, `["admin-posts", { status, page }]`
- After every mutation, invalidate the smallest correct key set (e.g. publish → `["admin-posts"]`, `["posts"]`, `["post", slug]`)
- Public pages do **not** use TanStack Query — they're Server Components with ISR (§12 preamble)

---

## 8. Auth Architecture

The backend returns `access_token` (15 min) + `refresh_token` (30 days, rotated on every use, stored hashed server-side). Storing the refresh token in `localStorage` is XSS-vulnerable — use a **route-handler proxy with an httpOnly cookie**:

```
Browser                          Next.js (server)                    FastAPI
  │  POST /api/auth/login            │                                 │
  │  {email, password} ─────────────▶│ urlencoded /auth/login ────────▶│
  │                                  │◀──── access + refresh ──────────│
  │◀─ Set-Cookie: ei_refresh         │                                 │
  │  (httpOnly, secure, sameSite=lax, path=/api/auth)                 │
  │  {access_token, user}            │                                 │
  │                                  │                                 │
  │  access_token kept in memory     │                                 │
  │  (zustand store, NOT storage)    │                                 │
```

- `app/api/auth/session/route.ts` — `POST`: reads `ei_refresh` cookie → `POST /auth/refresh` (rotation) → sets the **new** cookie → returns `{access_token}`. Called on app boot and on 401 (single-flight: dedupe concurrent refreshes with a shared promise).
- `app/api/auth/logout/route.ts` — `POST`: revokes the refresh token server-side, clears the cookie.
- **Client store** (`lib/auth.ts`, zustand): `{ accessToken, user, status }` + `login/logout/refresh` actions. On boot, if the cookie exists, hydrate via session route + `GET /auth/me`.
- **Route guard** (`proxy.ts`, Next 16's middleware): `/dashboard/*` requires the `ei_refresh` cookie (soft check — presence only, no crypto). Missing → redirect `/login?next=…`. Role enforcement stays client-side (RoleGate) + server-side (the API).
- **Login page**: email + password (zod: password ≥ 10 chars hint on register-style fields only; login just requires non-empty), error toast on 401 `INVALID_CREDENTIALS`, 429 with countdown.
- Redirect after login: `next` param if it starts with `/`, else `/dashboard`.
- Password reset / verify-email pages consume `?token=` from email links (emails point at `FRONTEND_URL` + these paths — confirm exact paths with the backend email templates before Phase 13).

---

## 9. Roles & Navigation Matrix

Sidebar nav is filtered by role. **Never render** an item the role can't call.

| Dashboard area | super_admin | senior_editor | technical_writer | seo_specialist |
|---|---|---|---|---|
| Overview (dashboard home) | ✅ analytics overview | ✅ | 🔁 *My posts* summary | ✅ analytics overview |
| Posts (admin list + editor) | ✅ | ✅ | ✅ (own only — server scopes) | ❌ (403 on `/posts/admin`) |
| SEO editing (per post) | ✅ | ✅ | ❌ | ✅ published posts only |
| Comments moderation | ✅ | ✅ | ❌ | ❌ |
| Media library | ✅ | ✅ | ✅ (upload + list; delete editor+) | ❌ |
| Categories manage | ✅ | ✅ | ❌ | ❌ |
| Tags view / create | ✅ / ✅ | ✅ / ✅ | ✅ / ✅ | ❌ |
| Users | ✅ | ❌ | ❌ | ❌ |
| Audit logs | ✅ | ❌ | ❌ | ❌ |
| Analytics (site-wide) | ✅ | ✅ | ❌ | ✅ |
| Settings (own profile) | ✅ | ✅ | ✅ | ✅ |

Role helper (`lib/auth.ts`): `can(user, "posts:create")`, `can(user, "comments:moderate")`… — one permission map, used by `<RoleGate perm="…">` and to build the sidebar. Never scatter role string comparisons.

**seo_specialist workflow note:** they cannot list admin posts, so their SEO workspace is the **published posts table** (public `GET /posts`, paginated) with an SEO edit sheet (`PATCH /posts/{id}/seo`). Surface this as `/dashboard` home for that role in Phase 11, or fold into the analytics page.

---

## 10. Content Block Format

`PostDetail.content_json` is `{ blocks: Block[] }` (types in §6). The backend also returns `content_html` — a server-side render sanitized with **nh3** (strict allowlist; iframes allowed for embeds, schemes http/https/mailto). Backend auto-computes `reading_time_minutes` from `content_json`.

**Public rendering (Phase 3):** prefer a React `BlockRenderer` walking `content_json` — full styling control and a clean upgrade path for interactive Excel blocks. `content_html` is the fallback for imported WP content that doesn't map to blocks. Because nh3 sanitizes at storage time, `dangerouslySetInnerHTML` on `content_html` is acceptable; everything else is escaped text.

BlockRenderer component map:

| Block | Component | Notes |
|---|---|---|
| `paragraph` | `<p>` | |
| `heading` | `<h2>`–`<h4>` | clamp level 2–4 for document outline |
| `quote` | styled `<blockquote>` | |
| `code` | Shiki highlight (server) | `language`: `excel`, `vba`, `python`, `sql`, `plaintext`… |
| `list` | `<ul>`/`<ol>` | `ordered` flag |
| `html` | sanitized passthrough | embeds (YouTube iframes etc.) — aspect-ratio wrapper |
| `image` | `next/image` (remotePatterns → R2 host) | alt required, lazy |
| `table` | styled `<table>` | header row toggle; responsive overflow-x container |

**Editor (Phase 5):** TipTap instance serializing to exactly these block types — heading (level), blockquote, codeBlock (language attr incl. `excel`), bullet/ordered list, image node (url + alt), table node, and an "embed/raw HTML" node stored as `{type:"html", html}`. On save: `editor.getDocument()` → blocks array → `content_json`. On load: blocks → TipTap JSON. Anything unrepresentable round-trips through the `html` block so WP-imported content never breaks.

---

## 11. Route Map

**Public** (`app/(public)/`): `/`, `/blog`, `/blog/[slug]`, `/categories`, `/categories/[slug]`, `/tags/[slug]`, `/search`, `/login`, `/forgot-password`, `/reset-password`, `/verify-email`, `/newsletter/unsubscribe`, `not-found`.

**Dashboard** (`app/dashboard/`): `` (overview), `/posts`, `/posts/new`, `/posts/[id]`, `/comments`, `/media`, `/categories`, `/tags`, `/users`, `/audit-logs`, `/analytics`, `/settings`.

---

## 12. Page Specifications — Public Site

**Preamble — rendering strategy.** All public pages are React Server Components fetching directly from `API_URL` server-side (no CORS involved) with `revalidate: 60` (articles: `revalidate` + `tags: ["post", slug]` mental model; blog index 60s; home 300s). Interactive islands (search box, comment form, newsletter form, dark-mode toggle) are the only client components.

### 12.1 Home `/`
- **Data:** `GET /posts?trending=true&page_size=6` (trending rail), `GET /posts?page_size=9` (latest grid), `GET /categories` (featured `is_featured` chips).
- **UI:** hero (value prop + search box → `/search?q=`), trending rail (badge "Trending"), latest post cards (image, category chip, title, reading time, date), category chips, newsletter CTA band.
- **PostCard** (shared): featured image (fixed 16:9, `next/image`), category + reading time meta row, title, excerpt clamp-2, date. Links to `/blog/{slug}`.

### 12.2 Blog index `/blog`
- **Data:** `GET /posts?page&page_size=12&category=&tag=`.
- **UI:** filter bar (category select from tree, tag pills), post grid, pagination (`Pagination` shared component — `page`, `total_pages`, preserves filters in querystring). Empty state: "No articles yet."

### 12.3 Article `/blog/[slug]` — the most important public page
- **Data:** `GET /posts/{slug}` (this also registers the view server-side — do not double-fetch from client).
- **UI:** breadcrumb (Home / Category / title), H1, author + date + reading time, featured image, **BlockRenderer**, tag pills, **downloadable assets** card (`GET /posts/{id}/assets` — download button hits `GET /assets/{id}/download` then `window.location = url`; label "link expires in {expires_in}s"), **comments section** (`GET /posts/{id}/comments` → nested thread; form = client component posting `CommentCreateInput`; on `{status:"pending"}` show "Your comment awaits moderation"), newsletter inline form.
- **TOC:** from heading blocks — sticky right column on `xl:`.
- **Metadata:** `generateMetadata` from `meta_title`/`meta_description`/`og_image_url`/`canonical_url`; JSON-LD script from `schema_type` (`TechArticle` | `HowTo` | `FAQPage`).
- `notFound()` on 404.

### 12.4 Category `/categories/[slug]`
- **Data:** `GET /categories/{slug}` → `{category, posts}`. Uses `color_hex` for accents, `description` as page intro, parent/child breadcrumbs. Paginated posts (PostCard grid).

### 12.5 Categories browse `/categories` — tree rendering (2-level), featured first, post counts if visible; links to category pages.

### 12.6 Tag `/tags/[slug]` — `GET /posts?tag={slug}` + PostCard grid + pagination.

### 12.7 Search `/search?q=`
- Client component (search needs interactivity). Debounced input (400ms), `q ≥ 2` enforced, `GET /search?q=&page=`, result cards, empty and "no results" states. Reading URL query so results are shareable.

### 12.8 Auth pages — centered card layout: `/login` (§8), `/forgot-password` (always-success copy), `/reset-password?token` (new password + confirm, min 10 chars, zod), `/verify-email?token` (auto-POST on mount, success/error states).

### 12.9 `/newsletter/unsubscribe?token` — confirm page that POSTs `{token}`; handles already-unsubscribed gracefully.

---

## 13. Page Specifications — Dashboard

Shell: existing `AppSidebar` + `SiteHeader` (rewritten): sidebar sections — Content (Overview, Posts, Comments, Media, Categories, Tags), Insights (Analytics), Administration (Users, Audit Logs), footer user menu (profile, theme, logout). Filtered by §9 matrix.

### 13.1 Overview `` (role-aware)
- editor+/seo: `GET /analytics/overview` → 4 stat cards (reuse `SectionCards`: total views, views 7d, published posts, drafts) + 7-day area chart (reuse `ChartAreaInteractive` shell fed by `top_posts_7_days`/trending) + trending list + top posts table linking to `/dashboard/posts/{id}`.
- technical_writer: "My posts" — `GET /posts/admin` counts by status (from list data), recent drafts, quick "New post".

### 13.2 Posts `/posts`
- **Data:** `GET /posts/admin?page&page_size=10&status=`.
- TanStack table (reuse `DataTable` shell): title (link to editor), status badge (draft=gray, pending_review=amber, published=green, rejected=red + tooltip with `rejection_reason`, scheduled=blue + datetime), author, category, updated_at (relative), row actions (Edit, View public if published, Delete with `ConfirmDialog`).
- Status filter tabs (All / Draft / Pending / Published / Rejected / Scheduled) + search box (client-side title filter). Pagination server-side.

### 13.3 Post editor `/posts/new`, `/posts/[id]` — largest surface, built across Phases 5–6
Layout: three-pane — main TipTap canvas, right inspector (tabs: Post / SEO / Assets), top action bar (status badge, Save, Submit for review / Publish / Schedule / Reject actions per §9).
- **Post tab:** title input, slug input with live slugify + pattern validation + "auto from title" toggle, excerpt (500 counter), category select (tree flattened), tag combobox (existing `GET /tags` + free input creating new), featured image picker (media library dialog).
- **SEO tab:** meta_title (255), meta_description (500) with pixel-width hint, canonical_url, og_image_url picker, schema_type select. Same fields power the seo_specialist sheet.
- **Assets tab:** list `GET /posts/{id}/assets`, upload `.xlsx/.csv` (multipart), copy link, delete. Shows `download_count`.
- **Workflow actions:** Save (PATCH, autosave every 30s when dirty), Submit review (own draft), Publish (editor+, with confirm), Reject (dialog + required reason ≤ 500 — shown to the writer as a banner on their draft), Schedule (datetime picker → `scheduled_at`).
- Validation mirrors backend zod: title 1–255, slug regex, excerpt ≤ 500 etc., so 422s are a bug, not a flow.

### 13.4 Comments `/comments`
- Queue tabs by status (Pending default / Approved / Spam / Rejected) — *requires the backend gap fix in §17.1*.
- Each row: post link, author name/email, text, time, nested parent context; actions Approve / Spam / Reject / Delete. Bulk approve on pending.

### 13.5 Media `/media`
- Grid of `GET /media?folder&page`, folder sidebar (folders derived from data + free-text on upload), upload dropzone (multipart `file` + `folder`), detail drawer (preview, alt_text edit note — *see §17.3*), delete (editor+ only, blocked-in-use → surface backend error code).
- Copy URL button. Size/dimension badges.

### 13.6 Categories `/categories`
- Tree (2 levels) with `@dnd-kit/sortable` drag to reorder **and** reparent; save triggers `PATCH /categories/reorder` with the full `{id, order_index, parent_id}[]` array.
- Create/edit sheet: name, slug (auto), parent select, color picker (`color_hex`), icon URL, description, is_featured, SEO fields. Delete (super_admin) with the "has posts" error surfaced.

### 13.7 Tags `/tags` — simple table + create dialog (name → slug auto). 

### 13.8 Users `/users` (super_admin)
- Table: name+avatar, email, role badge, verified, active, last_login. Create dialog = `POST /auth/register` (name/email/password ≥ 10/role select). Edit sheet = `PATCH /users/{id}` (role change with confirm — audit-logged server-side). Deactivate (soft) with confirm.

### 13.9 Audit logs `/audit-logs` (super_admin)
- Read-only table: time, actor, action badge (color by prefix `post.`/`user.`/…), entity, expandable `metadata` JSON. Filters: user, entity_type, action; pagination.

### 13.10 Analytics `/analytics`
- Overview widgets (§13.1) + top posts table → drilldown view `?post={id}`: `GET /analytics/posts/{id}` — 7-day line chart, stat tiles (total, 30d views, 30d unique visitors), top referrers bar list. Writers reach their own posts' drilldown from their posts table row action.

### 13.11 Settings `/settings`
- Profile: name, bio, avatar_url (`PATCH /users/me`-equivalent: `PATCH /users/{self id}`).
- Security: change password (current + new + confirm; on success all sessions revoked → redirect to login), resend verification email (`POST /auth/verify-email/request`), verified badge.

---

## 14. SEO Requirements

1. **Metadata:** every public page implements `generateMetadata` (title template `%s | Excel Insider`), description, canonical, OG/Twitter from post fields.
2. **JSON-LD:** article pages emit per `schema_type`; org + website schema on home.
3. **Sitemap:** simplest reliable path — `next.config.ts` rewrite `/sitemap.xml` → `${API_URL}/sitemap.xml` (backend regenerates it on publish + 6h). Remove/replace Next's default.
4. **robots.ts:** allow all, disallow `/dashboard`, `Noindex` for search/auth pages, sitemap pointer.
5. **WordPress redirects (zero broken URLs):** in `proxy.ts`, on any pathname miss that looks like a WP URL (heuristics: `/yyyy/mm/…`, `/category/…`, old paths), call `GET /api/v1/redirects/{path}`; on hit → `redirect(new_path, redirect_type)`. To stay cheap, only look up when a rendered page would 404 — Next 16 pattern: do the lookup in `not-found` server flow via a lookup helper with a short revalidate cache. (Implementation detail flexible; requirement: no WP URL 404s if a redirect row exists.)
6. **Perf:** `next/image` with R2 `remotePatterns`, font subsetting (already), route-level ISR, client JS budget — public pages ship no heavy editor code (TipTap loads only under `/dashboard/posts/*` via dynamic import).

---

## 15. States, Errors & Edge Cases (global rules)

- **Loading:** skeletons everywhere (shadcn `Skeleton`) — never spinner-only pages.
- **Empty:** every list/table has an EmptyState with the primary action ("Write your first post").
- **Error:** toast (sonner) for mutations; inline ErrorState with retry for queries; `ApiClientError` message from the backend envelope, never raw HTTP text.
- **429:** toast includes wait seconds from `Retry-After`.
- **403:** "You don't have access to this" state — should be rare (nav already filtered); log to console in dev to catch matrix bugs.
- **Forms:** disabled submit while pending; server field errors (`details[]`) mapped onto fields.
- **Dates:** `date-fns` + a single `<Time>` component (absolute `title`, relative label).
- **Confirmation:** destructive actions always `ConfirmDialog` naming the object ("Delete post 'X'?").
- **Client validation mirrors server constraints** (lengths, slug regex, email, password ≥ 10) — a server 422 is treated as a frontend bug.

---

## 16. Build Phases

Work strictly in order. Each phase = small increments; commit per increment; `pnpm typecheck` and `pnpm lint` green before moving on. Phases 5 and 6 depend on the §17 backend gap fixes being deployed first.

### Phase 0 — Foundation
Install base packages (`@tanstack/react-query`, devtools, `zustand`, `react-hook-form`, `@hookform/resolvers`, `date-fns`, `slugify`). Create folder structure (§4), `lib/config.ts`, `types/api.ts` (§6), `lib/api/apiFetch.ts` + `ApiClientError` (§7.2), `QueryClientProvider` in root layout, shared primitives (`Pagination`, `EmptyState`, `ErrorState`, `ConfirmDialog`, `Time`, `RoleGate`), `Toaster` (sonner) in root layout.
**Done when:** a throwaway query in dev returns typed data from the running backend; typecheck/lint green.

### Phase 1 — Auth
Route handlers (`app/api/auth/{login,logout,session}`) with the httpOnly `ei_refresh` cookie + rotation; zustand auth store + boot hydration via session + `/auth/me`; `proxy.ts` `/dashboard` cookie guard; `/login` page (form, 401/429 handling, `next` redirect); logout in user menu.
**Done when:** login → hard refresh → still logged in; refresh rotates cookie; 401 mid-session recovers silently; logout lands on `/login`.

### Phase 2 — Dashboard shell
Rewrite `app-sidebar`/`site-header` role-aware from the §9 permission map; replace demo overview with a skeleton page per role; `/dashboard/posts` placeholder; theme toggle verified in dashboard.
**Done when:** each of the 4 roles sees the correct nav (seed users exist in backend test env); wrong-role URL shows the 403 state.

### Phase 3 — Public blog core (SEO first)
Public layout (header/footer/newsletter form), `PostCard`, home, blog index + pagination, **article page with BlockRenderer** (paragraph/heading/quote/code/list first pass + html passthrough; image/table after), TOC, metadata + JSON-LD, category + tag pages, `not-found`.
**Done when:** articles render server-side (view-source shows content), metadata valid, Lighthouse SEO ≥ 95 on an article.

### Phase 4 — Admin posts list
`/dashboard/posts` data table per §13.2 (status tabs, server pagination, row actions minus editor), view-public link, delete + confirm. Overview cards for technical_writer.
**Done when:** writers see only their posts; editor sees all; filters + pagination work.

### Phase 5 — Post editor I (requires §17.1)
Install TipTap set; editor page `/posts/new` + `/posts/[id]` (loads via new `GET /posts/{id}`); block serialization round-trip (§10); Post tab fields; create draft, edit, autosave; slug generation + validation.
**Done when:** create → edit → save round-trips blocks without loss (incl. a WP-imported `html` block); slug conflicts surface cleanly.

### Phase 6 — Post editor II — workflow + SEO + assets
Workflow actions (submit/reject/publish/schedule with reason dialog); SEO tab + pixel hints; featured image via media dialog (if Phase 7 not reached, URL input as stopgap); assets tab (upload/list/download/delete); rejection banner for writers; seo_specialist SEO sheet on published posts.
**Done when:** full draft → review → reject → resubmit → schedule → auto-publish lifecycle works in UI and statuses match the table.

### Phase 7 — Media library
`/dashboard/media` per §13.5: grid, folders, dropzone upload, detail drawer, delete rules, copy URL; media picker dialog consumed by editor (featured image, og image, inline images).
**Done when:** upload from dashboard appears in R2 + renders in an article via picker.

### Phase 8 — Comments (requires §17.2)
Public comment form + thread on article page; `/dashboard/comments` queue with moderate/delete + bulk approve.
**Done when:** comment → pending → approve → visible publicly; spam/reject hide it.

### Phase 9 — Categories + tags
Category tree manager with dnd reorder/reparent + create/edit sheet; tags table + create; category/tag pickers already consume these.
**Done when:** reorder persists after refresh; delete-with-posts shows the backend block message.

### Phase 10 — Users + settings
`/dashboard/users` (list/create/edit/deactivate) super_admin; `/dashboard/settings` profile + change password + resend verification.
**Done when:** role change reflects in that user's nav on next login; password change force-relogin.

### Phase 11 — Analytics
Overview page for editor+/seo (cards + charts + trending); per-post drilldown (line chart, referrers); writer's own-post drilldown link.
**Done when:** numbers match backend responses; charts render dark/light.

### Phase 12 — Search
Public `/search` page (debounced, shareable `?q=`); header search box on public pages.
**Done when:** 2-char minimum enforced; pagination on results.

### Phase 13 — Auth aux + newsletter
`/forgot-password`, `/reset-password`, `/verify-email` (token flows, aligned with backend email URLs); `/newsletter/unsubscribe`; newsletter inline forms (article footer + home band) with `source` values.
**Done when:** full email flows work against dev backend.

### Phase 14 — SEO & migration polish
Sitemap rewrite, robots.ts, WP redirect lookup on 404 (§14.5), OG image fallback, canonical checks, `next/image` remote patterns final, remove demo leftovers (data.json…), favicon/branding.
**Done when:** old WP URL with a redirect row lands on the new article; `/sitemap.xml` serves backend output.

### Phase 15 — Hardening + deploy
Empty/loading/error audit per §15; a11y pass (focus, labels, contrast, keyboard nav); Lighthouse ≥ 90 all categories on public pages; `pnpm build` clean; Dokploy service (§18); smoke test prod.
**Done when:** deployed, healthy, one full content lifecycle exercised on prod.

---

## 17. Backend Gaps

Found while mapping the implemented endpoints. Items 1–3 were added to the backend on 2026-08-21 and now exist:

1. ✅ **`GET /api/v1/posts/{post_id}`** — role-scoped detail (editors: any; technical_writer: own; others: 403) returning full `PostDetail` including `content_json`. Editor pages load drafts with this. The path only matches UUIDs — normal slugs still resolve through the public `/{slug}` route.
2. ✅ **`GET /api/v1/comments?status=&page=`** — editor+ moderation queue returning `Page<CommentAdminItem>`; each item adds `user_email`, `status`, `ip_address`, `post_title`, `post_slug` on top of the public comment shape.
3. ✅ **`PATCH /api/v1/media/{id}`** — writer+; body `{alt_text?, folder?}` (partial, unknown fields 422).
4. *(Minor, defer)* No admin newsletter-subscriber list (Resend remains the campaign source); no tag update/delete; `level` on headings is stored but the backend HTML renderer always emits `<h2>` (frontend renderer honors level).

---

## 18. Deployment (Dokploy)

- Docker service from this repo: Node 22 alpine, `pnpm install --frozen-lockfile && pnpm build`, `pnpm start` (or standalone output). Non-root user, matching backend conventions.
- Env: `NEXT_PUBLIC_API_URL=https://api.<domain>`, `API_URL` (internal service hostname if routed internally), `NEXT_PUBLIC_SITE_URL=https://excelinsider.com`.
- Backend `ALLOWED_ORIGINS` must include the final site origin (credentials flow for CORS-mode dashboard calls).
- Health: `/api/auth/session` returning 405/200 is a light liveness check; alternatively a static `/health` route returning `{ok:true}`.
- Deploys are git-push; keep `pnpm typecheck && pnpm lint` as the pre-push ritual (CI optional, same as backend).

---

*End of specification. Feed one phase at a time to the AI assistant. Phase 0 → 1 → 2 first; backend gap fixes (§17.1) can run in parallel with Phases 2–4.*
