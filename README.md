# Excel Insider — Frontend

Next.js 16 frontend for the Excel Insider blog: a public, SEO-first site and a role-aware team dashboard, served by the FastAPI backend (`api.excelinsider.com`).

## Stack

- Next.js 16 (App Router, ISR, standalone output), React 19, Tailwind v4
- TanStack Query (dashboard), TipTap v3 (block editor), zustand (auth session)
- Auth: access token in memory + httpOnly `ei_refresh` cookie rotated through `/api/auth/*` route handlers

## Local development

```bash
pnpm install
pnpm dev
```

Environment (`.env.local`):

```
NEXT_PUBLIC_API_URL=https://api.excelinsider.com
API_URL=https://api.excelinsider.com
NEXT_PUBLIC_SITE_URL=https://excelinsider.com
```

Pre-push ritual:

```bash
pnpm typecheck && pnpm lint
```

## Deploy (Dokploy)

Docker service from this repo (Node 22 alpine, `pnpm install --frozen-lockfile && pnpm build`, standalone `server.js`, non-root user).

Set on the service:

- `NEXT_PUBLIC_API_URL=https://api.<domain>`
- `API_URL` — internal service hostname if routed internally, else the public URL (used server-side for ISR fetches and the `/sitemap.xml` rewrite)
- `NEXT_PUBLIC_SITE_URL=https://excelinsider.com`

Backend `ALLOWED_ORIGINS` must include the final site origin — dashboard calls hit the API from the browser with credentials.

Health check: `GET /health` → `{"ok":true}`.

Deploys are git-push; every push should leave `pnpm typecheck && pnpm lint` green.

## Structure

- `app/(public)` — server-rendered site (ISR): home, blog, article, categories, tags, search, auth pages, newsletter
- `app/dashboard` — role-aware dashboard: posts (block editor + workflow), media, comments, categories, tags, users, analytics, audit logs, settings
- `app/api/auth` — login/session/logout route handlers owning the httpOnly refresh cookie
- `lib/` — api wrappers, queries, auth store, editor serialization, tree/seo helpers
- `docs/FRONTEND_PRD.md` — the specification this app is built against
