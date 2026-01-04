# Bonchi v3 - AI Coding Agent Instructions

## Architecture Overview

**Monorepo Structure**: Dual-workspace Bun + Vite full-stack application with Express backend and React frontend.

- **Root workspace** (`/`): Server-side code and orchestration
  - Entry point: [src/index.ts](src/index.ts) → imports [src/server/index.ts](src/server/index.ts)
  - Server: Express app in [src/server/](src/server/)
  - Database: Prisma with PostgreSQL (schema at [prisma/schema.prisma](prisma/schema.prisma))
- **Client workspace** (`src/client/`): Independent React SPA
  - Separate `package.json` with own dependencies
  - React 19 + Vite + TypeScript + React Router
  - Styling: Tailwind CSS v4 + DaisyUI components
  - Build output served by Express at `/dist`

## Critical Workflows

### Development

```bash
# Concurrent development (from root)
bun run dev-server  # Server with auto-reload (--watch flag)
bun run dev-client  # Vite dev server on separate port

# Or use individual commands
bun run dev         # Server only
cd src/client && bun run dev  # Client only
```

### Database Operations

```bash
# Generate Prisma Client after schema changes
bun run db:generate

# Create and apply migrations
bun run db:migrate

# Reset database (DESTRUCTIVE - dev only)
bun run db:migrate:reset

# Open Prisma Studio
bun run db:studio
```

### Building & Deployment

```bash
bun run build   # Builds client (output: src/client/dist)
bun run serve   # Build + start production server
bun run start   # Production server without rebuild
```

## Key Patterns & Conventions

### Dual Prisma Setup (Important!)

- **Root Prisma**: [prisma/schema.prisma](prisma/schema.prisma) - currently empty/minimal
- **Server reference**: [src/server/generated/prisma/](src/server/generated/prisma/) contains generated types
- Database client: [src/server/db.ts](src/server/db.ts) uses Prisma with Accelerate extension
  - Singleton pattern with `globalForPrisma` to prevent multiple instances
  - Conditional logging: verbose in development, errors-only in production

### API Architecture

- Modular routing: [src/server/api.ts](src/server/api.ts) aggregates route modules
- Route pattern: [src/server/routes/auth.ts](src/server/routes/auth.ts) exports Express Router
  - Currently stubbed: `/api/auth/sign-in` and `/api/auth/sign-up` endpoints
- Middleware: [src/server/middleware/index.ts](src/server/middleware/index.ts) for logger and error handler

### Client Patterns

- **File naming**: Mixed case - components use PascalCase (`Register.tsx`), pages lowercase (`login.tsx`) or PascalCase
- **Page structure**: Uses `react-helmet` for per-page titles
- **Routing**: SPA with `react-router-dom`, fallback handler in Express for client-side routing
- **Styling**: DaisyUI classes (`card`, `btn`, `link`) with Tailwind utilities
- **State management**: `@tanstack/react-query` available but not yet configured

### Production Serving

Express serves built client files:

- Static files from [src/client/dist](src/client/dist)
- Catch-all route returns `index.html` for client-side routing
- API routes prefixed with `/api` to avoid conflicts

## Integration Points

### Client-Server Communication

- Development: Client proxies API calls (Vite proxy config expected)
- Production: Same-origin requests to `/api/*` endpoints
- Auth flow: Pages exist ([src/client/src/pages/login.tsx](src/client/src/pages/login.tsx), [Register.tsx](src/client/src/pages/Register.tsx)) but backend routes are stubs

### Environment Variables

- `DATABASE_URL`: PostgreSQL connection (required for Prisma Accelerate)
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Affects Prisma logging and global caching

## What's Not Implemented Yet

- **Prisma schema is empty** - define models in [prisma/schema.prisma](prisma/schema.prisma), then run `bun run db:generate`
- **Auth endpoints are stubs** - implement in [src/server/routes/auth.ts](src/server/routes/auth.ts)
- **No React Query setup** - configure provider in [App.tsx](src/client/src/App.tsx) if needed
- **Middleware not applied** - import from [src/server/middleware/index.ts](src/server/middleware/index.ts) to use
- **No Vite proxy config** - add to [src/client/vite.config.ts](src/client/vite.config.ts) for dev API calls

## Common Pitfalls

1. **Working directory matters**: Client commands must run from `src/client/` subdirectory
2. **Dual package.json**: Install client deps in `src/client/`, server deps in root
3. **Prisma paths**: Schema lives in root [prisma/](prisma/), but check for server-specific generated code
4. **Case sensitivity**: File imports and component names must match actual casing
5. **Build before production**: `bun run serve` builds first, but `bun run start` doesn't
