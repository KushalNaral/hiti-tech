# Development Guide

This document covers how the codebase is structured, how to make common changes, and the conventions to follow.

---

## Architecture overview

```
Browser ──► Reverse Proxy (port 80)
                 │
        ┌────────┴────────┐
        │                 │
   / (hiti-tech)    /api (api-server)
   React + Vite     Express 5
   port 5173/25999  port 8080
        │                 │
        │           PostgreSQL
        │           (via Drizzle ORM)
        │
   @workspace/api-client-react
   (generated React Query hooks)
```

All requests flow through the shared proxy. The frontend uses relative URLs — never hardcode ports.

---

## API contract (spec-first)

The OpenAPI spec at `lib/api-spec/openapi.yaml` is the **single source of truth** for all API contracts. Never write API client code by hand.

### Workflow

1. Edit `lib/api-spec/openapi.yaml`
2. Run `pnpm --filter @workspace/api-spec run codegen`
3. Use the generated hooks from `@workspace/api-client-react` in the frontend
4. Use the generated Zod schemas from `@workspace/api-zod` in the API server for validation

### Generated files (do not edit)

- `lib/api-client-react/src/generated/api.ts` — React Query hooks
- `lib/api-client-react/src/generated/api.schemas.ts` — TypeScript types
- `lib/api-zod/src/generated/` — Zod validation schemas

---

## Database

### Schema

Tables are defined in `lib/db/src/schema/`:

| File | Tables |
|---|---|
| `auth.ts` | `users`, `sessions` |
| `content.ts` | `contact_messages`, `portfolio_projects`, `testimonials`, `services` |
| `admin.ts` | `admin_users` |

### Making schema changes

1. Edit the schema file(s) in `lib/db/src/schema/`
2. Export new tables from `lib/db/src/schema/index.ts`
3. Run `pnpm --filter @workspace/db run push` to apply to the dev database

> **Caution:** `drizzle-kit push` directly applies changes without a migration file. For production, generate a migration instead with `drizzle-kit generate`.

### drizzle-zod

All insert/update schemas are generated with `createInsertSchema` from `drizzle-zod`. The pattern is:

```ts
export const insertFooSchema = createInsertSchema(fooTable).omit({ id: true, createdAt: true, updatedAt: true });
export const updateFooSchema = insertFooSchema.partial();
```

---

## Authentication

### Local auth (username/password)

The primary auth method for the dashboard. Sessions are stored as rows in the `sessions` table and referenced by a `sid` cookie.

| Endpoint | Description |
|---|---|
| `GET /api/auth/local/status` | Returns `{ setup: true }` if no admins exist |
| `POST /api/auth/local/setup` | Create the first admin account (locked after first use) |
| `POST /api/auth/local/login` | Validate credentials and create a session |
| `GET /api/auth/user` | Returns the current user from the active session |
| `GET /api/logout` | Clears the session and cookie |

Passwords are hashed with **bcryptjs** (12 rounds). Never store plain-text passwords.

### Session flow

```
POST /api/auth/local/login
  → bcrypt.compare(password, hash)
  → db.insert(sessions, { sid, sess: { user }, expire })
  → Set-Cookie: sid=<token>; HttpOnly; Secure; SameSite=Lax
```

### Adding protected routes

Use the `requireAuth` middleware in any new dashboard route file:

```ts
import { type Request, type Response, type NextFunction } from "express";

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

router.use("/dashboard/my-new-resource", requireAuth);
```

---

## Adding a new API resource

### 1. Update OpenAPI spec

Add paths and schemas to `lib/api-spec/openapi.yaml`.

### 2. Run codegen

```bash
pnpm --filter @workspace/api-spec run codegen
```

### 3. Add DB schema (if needed)

Edit `lib/db/src/schema/content.ts` and push:

```bash
pnpm --filter @workspace/db run push
```

### 4. Write the route handler

Create `artifacts/api-server/src/routes/my-resource.ts` and register it in `artifacts/api-server/src/routes/index.ts`.

### 5. Use generated hooks in the frontend

```tsx
import { useListMyResource, useCreateMyResource } from "@workspace/api-client-react";
```

---

## TypeScript

### Typechecking

```bash
pnpm run typecheck        # Full check (libs + artifacts)
pnpm run typecheck:libs   # Composite lib build only
```

### Key rules

- Leaf packages (apps) use `tsc --noEmit`, not `tsc --build`
- Library packages use composite mode (`composite: true`, `emitDeclarationOnly: true`)
- Never import between artifacts — share code via `lib/*` packages

---

## Logging

**Never use `console.log` in server code.** Use the Pino logger:

```ts
// In route handlers
req.log.info({ userId: req.user.id }, "User performed action");

// Outside request context
import { logger } from "./lib/logger";
logger.info("Server started");
```

---

## Common pitfalls

- **`zod/v4` in the API server** — esbuild can't resolve this subpath. Use `import { z } from "zod"` in server code.
- **`import.meta.env` in lib packages** — not available during composite TypeScript builds. Use `typeof process !== 'undefined'` or pass values explicitly.
- **Running `pnpm dev` at the root** — there's no root dev script. Start individual packages with `--filter`.
- **After OpenAPI changes** — always run codegen before using new hooks; stale generated files cause confusing type errors.
- **Port conflicts** — each artifact reads `PORT` from the environment. Don't hardcode ports.
