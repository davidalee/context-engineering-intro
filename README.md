# BetweenUs

Dating safety, reimagined. A platform for sharing dating experiences safely and responsibly.

## Project Structure

```
BetweenUs/
├── packages/
│   ├── backend/          # Node.js + Express + TypeScript API
│   ├── frontend/         # React Native + Expo mobile app
│   └── shared/           # Shared Zod schemas and types
├── docs/                 # Documentation
├── PRPs/                 # Product Requirements Prompts
└── package.json          # Monorepo workspace configuration
```

## Prerequisites

- **Node.js** >= 20.19.4
- **npm** >= 10.0.0
- **PostgreSQL** 14+ (for backend)
- **Expo CLI** (installed automatically)
- **iOS Simulator** or **Android Emulator** (for mobile development)

## Quick Start

### 1. Install Dependencies

```bash
# Install all dependencies from root (this also builds the shared package)
npm install
```

### 2. Set Up Environment Variables

```bash
# Backend
cp packages/backend/.env.example packages/backend/.env
# Edit packages/backend/.env with your database credentials

# Frontend
cp packages/frontend/.env.example packages/frontend/.env
```

### 3. Set Up Database

```bash
# Create the database
createdb betweenus

# Generate and run migrations
npm run db:generate
npm run db:migrate
```

### 4. Start Development Servers

```bash
# Terminal 1: Start backend
npm run dev:backend

# Terminal 2: Start frontend
npm run dev:frontend
```

## Available Scripts

### Root Level

| Command | Description |
|---------|-------------|
| `npm run dev:backend` | Start backend development server |
| `npm run dev:frontend` | Start Expo development server |
| `npm run build:shared` | Build shared package |
| `npm run build:all` | Build shared and backend |
| `npm run test:all` | Run all tests |
| `npm run lint:all` | Lint all packages |
| `npm run type-check:all` | Type check all packages |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Drizzle Studio |

### Backend (packages/backend)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with hot reload |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run test` | Run tests |

### Frontend (packages/frontend)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Expo server |
| `npm run ios` | Start on iOS simulator |
| `npm run android` | Start on Android emulator |
| `npm run test` | Run tests |

## API Endpoints

### Health Check

```bash
curl http://localhost:3000/api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "database": "connected"
}
```

## Tech Stack

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Drizzle ORM** - Database ORM
- **PostgreSQL** - Database
- **Zod** - Schema validation
- **Jest + Supertest** - Testing

### Frontend
- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **React Navigation** - Navigation
- **Jest** - Testing

### Shared
- **Zod** - Schema definitions
- **TypeScript** - Type definitions

## Monorepo Architecture

This project uses **npm workspaces** to manage three packages:

1. **@betweenus/shared** - Shared Zod schemas and TypeScript types
2. **@betweenus/backend** - Express API server
3. **@betweenus/frontend** - React Native mobile app

### Key Points

- Always run `npm install` from the **root** directory
- The shared package is built automatically on `postinstall`
- Import shared code using `@betweenus/shared`

```typescript
// In backend or frontend
import { healthResponseSchema } from '@betweenus/shared'
```

## Troubleshooting

### Metro bundler can't resolve @betweenus/shared

1. Ensure shared package is built: `npm run build:shared`
2. Check `metro.config.js` has correct workspace paths
3. Restart Metro: `npx expo start -c`

### Database connection failed

1. Ensure PostgreSQL is running
2. Check `DATABASE_URL` in `.env`
3. Run migrations: `npm run db:migrate`

### TypeScript errors in IDE

1. Build shared package: `npm run build:shared`
2. Restart TypeScript server in your IDE

## Development Workflow

1. Make changes to shared schemas in `packages/shared/src`
2. Rebuild shared: `npm run build:shared`
3. Changes are automatically available in backend and frontend

## License

MIT
