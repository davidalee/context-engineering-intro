# Repository Guidelines

## Project Structure & Module Organization
- `packages/backend`: Express + TypeScript API (`src/` for routes, controllers, services, models, middleware, utils, config, types).
- `packages/frontend`: React Native + Expo app (`src/` for screens, components, navigation, hooks, services, store/context, theme, utils, types).
- `packages/shared`: Shared Zod schemas and TypeScript types.
- `docs/`, `PRPs/`, `use-cases/`, `examples/`: reference materials and prompts.

## Build, Test, and Development Commands
Run from the repo root (npm workspaces):
- `npm install`: install deps; builds `@betweenus/shared` via `postinstall`.
- `npm run dev:backend`: start API with hot reload.
- `npm run dev:frontend`: start Expo dev server.
- `npm run build:all`: build shared and backend.
- `npm run test:all`: run tests across workspaces.
- `npm run lint:all` / `npm run type-check:all`: lint and type-check all packages.
- `npm run db:generate` / `npm run db:migrate`: generate and run Drizzle migrations.

## Coding Style & Naming Conventions
- TypeScript with `strict: true` (see `tsconfig.base.json`).
- Prettier settings: 2-space indent, single quotes, no semicolons (`.prettierrc`).
- ESLint in backend and frontend; run `npm run lint:backend` or `npm run lint:frontend`.
- Prefer barrel exports via `index.ts` in folders.
- Keep files under 500 LOC; split by feature or layer when needed.

## Testing Guidelines
- Backend: Jest + Supertest; tests in `__tests__` or `*.test.ts`.
- Frontend: Jest + React Native Testing Library; tests in `__tests__` or `*.test.tsx`.
- Aim for expected path + edge + failure case coverage for new logic.
- Run `npm run test:backend` or `npm run test:frontend` for focused checks.

## Commit & Pull Request Guidelines
- Commit messages in history are short, lowercase, and descriptive (e.g., "search feature"). Keep them concise and imperative.
- PRs should include a clear summary, linked issues (if any), and screenshots/video for UI changes.
- Note any new env vars in `.env.example` files and update `README.md` when setup changes.

## Security & Configuration Tips
- Use `.env` files for secrets; never commit real credentials.
- Backend expects PostgreSQL; ensure `DATABASE_URL` is set before running migrations.

## Agent-Specific Instructions
- See `CLAUDE.md` for workflow rules (task tracking, structure conventions, testing expectations). If `PLANNING.md` exists, read it before major changes.
