# HITI TECH

A software company landing page with editorial design and an authenticated content dashboard.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, proxied at `/api`)
- `pnpm --filter @workspace/hiti-tech run dev` — run the frontend (proxied at `/`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET` — for session cookies

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5 (at `/api`)
- DB: PostgreSQL + Drizzle ORM
- Auth: Replit OIDC (openid-client), cookie sessions via PostgreSQL
- Validation: Zod (`zod`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec in `lib/api-spec`)
- Build: esbuild (ESM bundle)
- Frontend: React + Vite + Tailwind CSS, wouter routing

## Where things live

- `lib/db/src/schema/` — database tables: `auth.ts` (users, sessions), `content.ts` (contact_messages, portfolio_projects, testimonials, services)
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for API contracts)
- `lib/api-client-react/src/generated/` — auto-generated React Query hooks and TypeScript types (do not edit)
- `lib/api-zod/src/generated/` — auto-generated Zod schemas (do not edit)
- `lib/replit-auth-web/src/use-auth.ts` — `useAuth()` hook for browser auth state
- `artifacts/api-server/src/routes/` — API route handlers
- `artifacts/api-server/src/lib/auth.ts` — OIDC session management helpers
- `artifacts/hiti-tech/src/pages/home.tsx` — landing page
- `artifacts/hiti-tech/src/pages/dashboard.tsx` — admin dashboard

## Architecture decisions

- Contract-first API: OpenAPI spec is written manually, hooks/schemas are generated from it via Orval. Never edit generated files.
- Auth via Replit OIDC (PKCE flow). Sessions stored in PostgreSQL, referenced by a cookie. The `authMiddleware` populates `req.user` and `req.isAuthenticated()`.
- All dashboard routes are protected by a `requireAuth` middleware that returns 401 if not authenticated.
- `zod/v4` subpath is avoided in the API server build (esbuild can't resolve it); use `import { z } from "zod"` instead.
- `@workspace/replit-auth-web` is a composite lib used by the frontend for auth state; `import.meta.env` is NOT used in it (Vite-specific).

## Product

- **Landing page** (`/`): Hero, services list (numbered), portfolio grid, tech marquee, testimonials section, contact form that POSTs to `/api/contact`
- **Dashboard** (`/dashboard`): Authenticated via Replit SSO. Tabs for Messages (inbox with mark-read/delete), Projects (CRUD), Testimonials (CRUD), Services (CRUD).

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Run `pnpm --filter @workspace/api-spec run codegen` after any OpenAPI spec change. This regenerates both hooks and Zod schemas and runs `typecheck:libs`.
- The `replit-auth-web` lib references `@workspace/api-client-react` in its tsconfig references — keep both in sync when upgrading codegen output paths.
- esbuild bundles the API server — any package that uses `zod/v4` subpath must be changed to `import { z } from "zod"` or added to the externals list in `build.mjs`.
- Dashboard routes require the `authMiddleware` to be mounted before the router in `app.ts` (already done).
- Always push schema changes with `pnpm --filter @workspace/db run push` after editing `lib/db/src/schema/`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See the `replit-auth` skill for auth flow and session management details
