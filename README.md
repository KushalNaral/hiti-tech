# HITI TECH

Official website and content management system for **HITI TECH** — a software company landing page with an authenticated admin dashboard.

---

## What it does

**Public site** (`/`) — Editorial dark-themed landing page with hero, services, portfolio, testimonials, and a live contact form that saves messages to the database.

**Admin dashboard** (`/dashboard`) — Authenticated content management:
- **Messages** — view, read, and delete contact form submissions
- **Projects** — manage portfolio entries (name, category, tags, visibility)
- **Testimonials** — manage client quotes (featured, visible)
- **Services** — manage the numbered services list

---

## Tech stack

| Layer | Technology |
|---|---|
| Monorepo | pnpm workspaces |
| Runtime | Node.js 24 |
| Language | TypeScript 5.9 (strict) |
| API server | Express 5 |
| Database | PostgreSQL + Drizzle ORM |
| Auth | Local username/password (bcryptjs + cookie sessions) |
| Validation | Zod v4 + drizzle-zod |
| API contract | OpenAPI 3.1 → Orval codegen |
| Frontend | React 18 + Vite + Tailwind CSS + shadcn/ui |
| Routing | wouter |
| Data fetching | TanStack Query v5 |

---

## Getting started

### Prerequisites

- Node.js 24+
- pnpm 10+
- PostgreSQL database

### 1. Clone and install

```bash
git clone <repo-url>
cd hiti-tech
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env — set DATABASE_URL and SESSION_SECRET
```

### 3. Set up the database

```bash
pnpm --filter @workspace/db run push
```

### 4. Start development servers

Open two terminals:

```bash
# Terminal 1 — API server (port 8080)
pnpm --filter @workspace/api-server run dev

# Terminal 2 — Frontend (port 5173)
pnpm --filter @workspace/hiti-tech run dev
```

Visit `http://localhost:5173` for the site and `http://localhost:5173/dashboard` for the admin panel.

### 5. Create your admin account

On first visit to `/dashboard`, you'll be prompted to create an admin username and password. This setup route only works once — it's locked after the first admin is created.

---

## Project structure

```
├── artifacts/
│   ├── api-server/          # Express 5 API server
│   │   └── src/
│   │       ├── routes/      # Route handlers
│   │       ├── lib/auth.ts  # Session management
│   │       └── middlewares/ # Auth middleware
│   └── hiti-tech/           # React + Vite frontend
│       └── src/
│           ├── pages/       # home.tsx, dashboard.tsx
│           └── components/  # shadcn/ui components
├── lib/
│   ├── db/                  # Drizzle schema + migrations
│   │   └── src/schema/      # auth.ts, content.ts, admin.ts
│   ├── api-spec/            # OpenAPI spec (source of truth)
│   ├── api-client-react/    # Generated React Query hooks
│   ├── api-zod/             # Generated Zod schemas
│   └── replit-auth-web/     # useAuth() React hook
├── .env.example
└── pnpm-workspace.yaml
```

---

## Available commands

| Command | What it does |
|---|---|
| `pnpm --filter @workspace/api-server run dev` | Start API server |
| `pnpm --filter @workspace/hiti-tech run dev` | Start frontend |
| `pnpm run typecheck` | Full TypeScript check |
| `pnpm --filter @workspace/api-spec run codegen` | Regenerate API hooks from OpenAPI spec |
| `pnpm --filter @workspace/db run push` | Push schema to database |

---

## Deployment

On Replit, both services run as registered workflows and are reverse-proxied through a shared gateway at the app's `.replit.app` domain. No additional configuration needed — just publish.

For other platforms, build the API server bundle:

```bash
pnpm --filter @workspace/api-server run build
# Output: artifacts/api-server/dist/index.mjs
```

And build the frontend static files:

```bash
pnpm --filter @workspace/hiti-tech run build
# Output: artifacts/hiti-tech/dist/
```

---

## License

Private — all rights reserved © HITI TECH 2026.
