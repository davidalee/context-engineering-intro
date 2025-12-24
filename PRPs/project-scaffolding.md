name: "Project Scaffolding - BetweenUs Monorepo"
description: |
  Complete monorepo setup with Node.js + Express + TypeScript backend,
  React Native + TypeScript frontend, and shared validation schemas.

---

## Goal

Establish the foundational monorepo structure for BetweenUs with proper workspace configuration, TypeScript setup, development tooling, and database infrastructure. This creates the base upon which all features (authentication, posting, moderation, etc.) will be built.

## Why

- **Foundation for All Features**: Every PRP depends on this scaffolding being done correctly
- **Type Safety Across Stack**: Shared Zod schemas and TypeScript types between backend and frontend
- **Development Efficiency**: Proper monorepo setup enables fast iteration with hot reload
- **Production Ready**: Configured for Vercel deployment (backend) and standard React Native builds

## What

Create a complete monorepo with:
- npm workspaces configuration (3 packages: backend, frontend, shared)
- TypeScript strict mode with project references
- Drizzle ORM setup with PostgreSQL
- Express server foundation with middleware structure
- React Native (Expo) app with navigation
- Shared Zod validation schemas
- Testing infrastructure (Jest + Supertest)
- Linting and formatting (ESLint + Prettier)
- Environment variable management
- Development workflow scripts

### Success Criteria

- [ ] npm workspaces correctly configured
- [ ] All packages build without errors
- [ ] TypeScript strict mode enabled, no type errors
- [ ] Backend server starts and responds to health check
- [ ] Frontend app runs in Expo simulator
- [ ] Shared package exports Zod schemas to both backend and frontend
- [ ] Database connection successful, migrations run
- [ ] All linting and formatting passes
- [ ] Tests run successfully in all workspaces
- [ ] Development workflow documented in README

---

## All Needed Context

### Documentation & References

```yaml
# Project Context
- file: /Users/wookiee/Code/BetweenUs/CLAUDE.md
  why: TypeScript conventions, file structure rules, testing requirements
  critical: Use 2-space indent, strict TypeScript, never exceed 500 LOC

- file: /Users/wookiee/Code/BetweenUs/docs/BRAND_VOICE_GUIDE.md
  why: Copy standards for error messages and logging
  pattern: "Measured not moralizing" applies to developer experience too

# External Documentation - Monorepo
- url: https://docs.npmjs.com/cli/v10/using-npm/workspaces
  why: npm workspaces official documentation
  section: "Running commands" for workspace scripts

# External Documentation - TypeScript
- url: https://www.typescriptlang.org/docs/handbook/project-references.html
  why: TypeScript project references for monorepo
  critical: Composite mode and references array syntax

- url: https://www.typescriptlang.org/tsconfig
  why: tsconfig.json options reference
  section: strict, baseUrl, paths for configuration

# External Documentation - Drizzle ORM
- url: https://orm.drizzle.team/docs/get-started/postgresql-new
  why: Drizzle ORM PostgreSQL setup
  critical: Use generatedAlwaysAsIdentity() not serial() (2025 best practice)

- url: https://orm.drizzle.team/kit-docs/overview
  why: Drizzle Kit for migrations
  section: Configuration and CLI commands

# External Documentation - React Native
- url: https://docs.expo.dev/
  why: Expo documentation for React Native setup
  section: Create a project, Development builds

- url: https://reactnavigation.org/docs/getting-started
  why: React Navigation setup
  section: Installation, Hello React Navigation

# External Documentation - Metro Bundler
- url: https://metrobundler.dev/docs/configuration
  why: Metro bundler monorepo configuration
  critical: watchFolders and resolver.nodeModulesPaths for workspaces

# Code Examples from Codebase
- file: /Users/wookiee/Code/BetweenUs/use-cases/mcp-server/package.json
  why: TypeScript project structure example
  pattern: Dependencies, scripts, TypeScript config

- file: /Users/wookiee/Code/BetweenUs/use-cases/mcp-server/tsconfig.json
  why: TypeScript configuration patterns
  pattern: Strict mode, module resolution
```

### Current Codebase Tree

```bash
BetweenUs/
├── .claude/
├── docs/                    # Documentation (keep as-is)
├── examples/                # Empty
├── PRPs/
│   ├── templates/
│   ├── posting-content-mvp.md
│   └── project-scaffolding.md  # THIS FILE
├── use-cases/               # Reference examples (keep)
├── CLAUDE.md
├── INITIAL.md
└── README.md

# NO PRODUCTION CODE EXISTS - WILL CREATE packages/ STRUCTURE
```

### Desired Codebase Tree

```bash
BetweenUs/
├── packages/                           # NEW - Monorepo packages
│   ├── backend/                        # Node.js + Express + TypeScript
│   │   ├── src/
│   │   │   ├── config/
│   │   │   │   ├── database.ts         # Drizzle connection
│   │   │   │   └── index.ts
│   │   │   ├── db/
│   │   │   │   ├── schema.ts           # Drizzle schema (users table for now)
│   │   │   │   └── migrations/         # Generated by Drizzle Kit
│   │   │   ├── middleware/
│   │   │   │   ├── error.middleware.ts # Global error handler
│   │   │   │   └── index.ts
│   │   │   ├── routes/
│   │   │   │   ├── health.routes.ts    # Health check endpoint
│   │   │   │   └── index.ts
│   │   │   ├── utils/
│   │   │   │   ├── logger.ts           # Logging utility
│   │   │   │   └── response.ts         # Standardized responses
│   │   │   └── index.ts                # Express app + server
│   │   ├── tests/
│   │   │   └── integration/
│   │   │       └── health.test.ts      # Health check test
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── .env.example
│   │   ├── .eslintrc.js
│   │   ├── .prettierrc
│   │   ├── jest.config.js
│   │   └── drizzle.config.ts
│   │
│   ├── frontend/                       # React Native + Expo
│   │   ├── src/
│   │   │   ├── screens/
│   │   │   │   └── HomeScreen.tsx      # Placeholder home screen
│   │   │   ├── navigation/
│   │   │   │   └── AppNavigator.tsx    # Stack navigator
│   │   │   ├── components/
│   │   │   │   └── Text.tsx            # Themed text component
│   │   │   ├── theme/
│   │   │   │   └── colors.ts           # Color palette
│   │   │   └── App.tsx                 # Root component
│   │   ├── assets/                     # Images, fonts
│   │   ├── tests/
│   │   │   └── components/
│   │   │       └── Text.test.tsx       # Example component test
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── .env.example
│   │   ├── .eslintrc.js
│   │   ├── .prettierrc
│   │   ├── jest.config.js
│   │   ├── metro.config.js             # Metro bundler config
│   │   ├── app.json                    # Expo config
│   │   ├── babel.config.js
│   │   └── index.js                    # Entry point
│   │
│   └── shared/                         # Shared types + schemas
│       ├── src/
│       │   ├── schemas/
│       │   │   ├── health.schema.ts    # Example Zod schema
│       │   │   └── index.ts
│       │   ├── types/
│       │   │   ├── api.types.ts        # Common API types
│       │   │   └── index.ts
│       │   └── index.ts                # Barrel export
│       ├── package.json
│       └── tsconfig.json
│
├── package.json                        # Root workspace config
├── tsconfig.base.json                  # Base TypeScript config
├── .gitignore                          # Updated for monorepo
├── .eslintrc.js                        # Root ESLint config
├── .prettierrc                         # Root Prettier config
├── README.md                           # Updated with setup instructions
└── (existing folders: .claude, docs, PRPs, use-cases)
```

### Known Gotchas & Library Quirks

```typescript
// CRITICAL 1: npm workspaces installation order
// Always install from ROOT, not individual packages
// ❌ DON'T: cd packages/backend && npm install
// ✅ DO: npm install (from root)

// CRITICAL 2: Build shared package FIRST
// Backend/frontend can't import shared until it's built
// Add to root package.json:
"postinstall": "npm run build --workspace=packages/shared"

// CRITICAL 3: TypeScript project references
// Use references array to link packages
// packages/backend/tsconfig.json:
{
  "references": [{ "path": "../shared" }]
}

// CRITICAL 4: Import shared package by name, NOT path
// ❌ DON'T: import { schema } from '../../shared/src/schemas'
// ✅ DO: import { schema } from '@betweenus/shared'

// CRITICAL 5: Metro bundler monorepo config
// MUST configure watchFolders and extraNodeModules
// packages/frontend/metro.config.js:
const workspaceRoot = path.resolve(__dirname, '../..');
config.watchFolders = [workspaceRoot];
config.resolver.extraNodeModules = {
  '@betweenus/shared': path.resolve(workspaceRoot, 'packages/shared'),
};

// CRITICAL 6: Drizzle config paths are relative to config file
// Place drizzle.config.ts in backend package root
// Use relative paths from there:
schema: './src/db/schema.ts',  // NOT '../backend/src/db/schema.ts'

// CRITICAL 7: Environment variable naming
// Backend: DATABASE_URL, SUPABASE_URL, etc.
// Frontend (Expo): EXPO_PUBLIC_API_URL (must prefix with EXPO_PUBLIC_)
// Access in code: process.env.EXPO_PUBLIC_API_URL

// CRITICAL 8: Duplicate React Native versions
// Use overrides in root package.json to enforce single version
// Updated for 2025: React Native 0.83+ requires React 19+
{
  "overrides": {
    "react": "^19.0.0",
    "react-native": "^0.83.0"
  }
}

// CRITICAL 9: Drizzle identity columns (2025 best practice)
// ❌ DON'T use serial()
id: serial('id').primaryKey()

// ✅ DO use generatedAlwaysAsIdentity()
id: integer('id').primaryKey().generatedAlwaysAsIdentity()

// CRITICAL 10: Express error middleware MUST be last
// Order matters - error middleware catches all previous errors
app.use('/api/health', healthRoutes)
app.use(errorMiddleware) // MUST BE LAST
```

---

## Implementation Blueprint

### Data Models and Structure

```typescript
// packages/shared/src/schemas/health.schema.ts
import { z } from 'zod'

export const healthResponseSchema = z.object({
  status: z.enum(['ok', 'error']),
  timestamp: z.string(),
  database: z.enum(['connected', 'disconnected']).optional(),
})

export type HealthResponse = z.infer<typeof healthResponseSchema>
```

```typescript
// packages/backend/src/db/schema.ts - Initial Schema
import { pgTable, integer, text, timestamp, uuid } from 'drizzle-orm/pg-core'

// Users table (placeholder for Supabase auth integration)
export const users = pgTable('users', {
  id: uuid('id').primaryKey(), // Will match Supabase auth.users.id
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Health check table (to verify DB connection)
export const healthChecks = pgTable('health_checks', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  status: text('status').notNull(),
})
```

### List of Tasks (in order)

```yaml
Task 1: Create root workspace configuration
  - CREATE package.json in root with workspaces config
  - ADD scripts: dev:backend, dev:frontend, test:all, lint:all, type-check:all
  - ADD devDependencies: typescript, prettier, @types/node
  - ADD engines: node >=20.19.4, npm >=10.0.0 (React Native 0.81+ requires Node 20.19.4+)
  - ADD postinstall script to build shared package
  - ADD overrides for React and React Native versions (see CRITICAL 8 in gotchas)

Task 2: Create base TypeScript configuration
  - CREATE tsconfig.base.json in root
  - SET strict: true, esModuleInterop: true
  - CONFIGURE for ES2022 target

Task 3: Update .gitignore for monorepo
  - ADD node_modules/, dist/, build/, .env, *.env
  - ADD .expo/, .expo-shared/, web-build/
  - ADD *.tsbuildinfo, coverage/
  - ADD OS files (.DS_Store)

Task 4: Create root linting configuration
  - CREATE .eslintrc.js with TypeScript support
  - CREATE .prettierrc with project standards
  - CONFIGURE 2-space indent, single quotes, no semicolons

Task 5: Create shared package structure
  - CREATE packages/shared/package.json
    - NAME: @betweenus/shared
    - ADD zod dependency
    - ADD build script: tsc
    - SET main and types fields
  - CREATE packages/shared/tsconfig.json
    - EXTEND tsconfig.base.json
    - SET composite: true
    - CONFIGURE declaration: true
  - CREATE packages/shared/src/index.ts (barrel export)

Task 6: Create shared schemas and types
  - CREATE packages/shared/src/schemas/health.schema.ts
    - DEFINE healthResponseSchema with Zod
    - EXPORT inferred type
  - CREATE packages/shared/src/types/api.types.ts
    - DEFINE common API types (ApiResponse, ApiError)
  - UPDATE packages/shared/src/index.ts to export all

Task 7: Build shared package
  - RUN npm install (from root)
  - RUN npm run build --workspace=packages/shared
  - VERIFY dist/ folder created with .js and .d.ts files

Task 8: Create backend package structure
  - CREATE packages/backend/package.json
    - NAME: @betweenus/backend
    - ADD dependencies: express, drizzle-orm, postgres, dotenv, cors
    - ADD devDependencies: typescript, tsx, @types/express, jest, supertest
    - ADD scripts: dev, build, start, test, lint, type-check
    - ADD drizzle-kit scripts: db:generate, db:migrate, db:studio
  - CREATE packages/backend/tsconfig.json
    - EXTEND ../../tsconfig.base.json
    - ADD references: [{ path: "../shared" }]
    - CONFIGURE baseUrl and paths (@/ aliases)
  - CREATE packages/backend/.env.example
    - DOCUMENT all required env vars
  - CREATE packages/backend/.eslintrc.js
  - CREATE packages/backend/.prettierrc
  - CREATE packages/backend/jest.config.js

Task 9: Create backend Drizzle configuration
  - CREATE packages/backend/drizzle.config.ts
    - IMPORT dotenv
    - CONFIGURE schema path: './src/db/schema.ts'
    - CONFIGURE migrations: './src/db/migrations'
    - SET dialect: 'postgresql'
    - USE DATABASE_URL from env

Task 10: Create backend database schema
  - CREATE packages/backend/src/db/schema.ts
    - DEFINE users table (uuid primary key for Supabase)
    - DEFINE healthChecks table (for DB connection test)
    - USE generatedAlwaysAsIdentity() for id columns
    - EXPORT all tables

Task 11: Create backend database config
  - CREATE packages/backend/src/config/database.ts
    - IMPORT drizzle, postgres
    - CREATE connection using DATABASE_URL
    - EXPORT db instance
  - CREATE packages/backend/src/config/index.ts (barrel export)

Task 12: Generate and run database migrations
  - RUN npm run db:generate --workspace=packages/backend
  - VERIFY migration SQL file created
  - SETUP local PostgreSQL database
  - RUN npm run db:migrate --workspace=packages/backend
  - VERIFY tables created

Task 13: Create backend utilities
  - CREATE packages/backend/src/utils/logger.ts
    - IMPLEMENT simple console logger (can upgrade later)
    - EXPORT log functions (info, warn, error)
  - CREATE packages/backend/src/utils/response.ts
    - IMPLEMENT success(data) → standardized response
    - IMPLEMENT error(message) → standardized error
    - USE brand voice for error messages
  - CREATE packages/backend/src/utils/index.ts (barrel export)

Task 14: Create backend middleware
  - CREATE packages/backend/src/middleware/error.middleware.ts
    - IMPLEMENT global error handler
    - CATCH all errors with 4 parameters (err, req, res, next)
    - LOG error details
    - RETURN user-friendly message (brand voice)
  - CREATE packages/backend/src/middleware/index.ts (barrel export)

Task 15: Create backend health check route
  - CREATE packages/backend/src/routes/health.routes.ts
    - IMPORT express.Router()
    - DEFINE GET /health endpoint
    - CHECK database connection (query healthChecks table)
    - RETURN HealthResponse from shared schema
    - HANDLE errors gracefully
  - CREATE packages/backend/src/routes/index.ts (barrel export)

Task 16: Create backend Express app
  - CREATE packages/backend/src/index.ts
    - IMPORT express, cors, dotenv
    - CONFIGURE dotenv
    - CREATE express app
    - USE cors middleware
    - USE express.json()
    - MOUNT /api/health route
    - USE error middleware LAST
    - START server on PORT from env
    - EXPORT app for testing

Task 17: Create backend health check test
  - CREATE packages/backend/tests/integration/health.test.ts
    - IMPORT supertest
    - TEST GET /api/health returns 200
    - TEST response matches healthResponseSchema
    - TEST database connection status

Task 18: Create frontend package structure
  - RUN npx create-expo-app@latest packages/frontend --template blank-typescript
  - UPDATE packages/frontend/package.json
    - NAME: @betweenus/frontend
    - ADD @betweenus/shared dependency
    - ADD @react-navigation/native and @react-navigation/native-stack dependencies
    - ADD axios for API calls
    - IMPORTANT: Expo SDK 54+ is current as of 2025, ensure compatibility
  - CREATE packages/frontend/tsconfig.json
    - EXTEND expo/tsconfig.base
    - ADD references: [{ path: "../shared" }]
    - CONFIGURE baseUrl and paths
  - CREATE packages/frontend/.env.example
  - CREATE packages/frontend/.eslintrc.js
  - CREATE packages/frontend/.prettierrc
  - CREATE packages/frontend/jest.config.js

Task 19: Configure Metro bundler for monorepo
  - CREATE packages/frontend/metro.config.js
    - IMPORT expo/metro-config
    - SET workspaceRoot to monorepo root
    - CONFIGURE watchFolders: [workspaceRoot]
    - CONFIGURE resolver.nodeModulesPaths
    - CONFIGURE resolver.extraNodeModules for @betweenus/shared
    - EXPORT config

Task 20: Create frontend theme
  - CREATE packages/frontend/src/theme/colors.ts
    - DEFINE color palette (primary, secondary, background, text)
    - EXPORT colors object

Task 21: Create frontend components
  - CREATE packages/frontend/src/components/Text.tsx
    - IMPORT React Native Text
    - CREATE themed text component
    - USE colors from theme
  - CREATE packages/frontend/src/components/index.ts

Task 22: Create frontend screens
  - CREATE packages/frontend/src/screens/HomeScreen.tsx
    - IMPORT themed components
    - RENDER welcome screen
    - TEST import from @betweenus/shared (display health schema)
  - CREATE packages/frontend/src/screens/index.ts

Task 23: Create frontend navigation
  - CREATE packages/frontend/src/navigation/AppNavigator.tsx
    - IMPORT @react-navigation/native
    - CREATE stack navigator
    - ADD HomeScreen
    - EXPORT navigator

Task 24: Create frontend App component
  - UPDATE packages/frontend/src/App.tsx
    - IMPORT NavigationContainer
    - IMPORT AppNavigator
    - RENDER navigation

Task 25: Create frontend component test
  - CREATE packages/frontend/tests/components/Text.test.tsx
    - IMPORT @testing-library/react-native
    - TEST Text component renders correctly
    - TEST theme colors applied

Task 26: Update root README with setup instructions
  - UPDATE README.md
    - ADD monorepo structure overview
    - ADD prerequisites (Node.js, PostgreSQL)
    - ADD installation steps
    - ADD development workflow
    - ADD testing instructions
    - ADD troubleshooting section

Task 27: Final validation
  - RUN npm install (from root)
  - RUN npm run lint:all
  - RUN npm run type-check:all
  - RUN npm run test:all
  - START backend: npm run dev:backend
  - START frontend: npm run dev:frontend
  - TEST health check: curl http://localhost:3000/api/health
  - TEST frontend loads in Expo
  - VERIFY shared package import works
```

### Per-Task Pseudocode (Critical Tasks Only)

```typescript
// Task 11: Database Configuration Pseudocode
// packages/backend/src/config/database.ts

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../db/schema'
import * as dotenv from 'dotenv'

dotenv.config()

// CRITICAL: Lazy connection - don't connect until first query
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required')
}

// PATTERN: Create postgres client with error handling
const client = postgres(connectionString, {
  max: 10, // Connection pool size
  idle_timeout: 20,
  connect_timeout: 10,
})

// PATTERN: Create Drizzle instance with schema
export const db = drizzle(client, { schema })

// PATTERN: Health check function
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    // Simple query to verify connection
    await db.select().from(schema.healthChecks).limit(1)
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}

// Task 15: Health Check Route Pseudocode
// packages/backend/src/routes/health.routes.ts

import { Router } from 'express'
import { db, checkDatabaseConnection } from '../config/database'
import { healthChecks } from '../db/schema'
import { healthResponseSchema } from '@betweenus/shared'

const router = Router()

router.get('/health', async (req, res, next) => {
  try {
    // STEP 1: Check database connection
    const dbConnected = await checkDatabaseConnection()

    // STEP 2: Insert health check record if connected
    if (dbConnected) {
      await db.insert(healthChecks).values({
        timestamp: new Date(),
        status: 'ok',
      })
    }

    // STEP 3: Build response matching schema
    const response = {
      status: 'ok' as const,
      timestamp: new Date().toISOString(),
      database: dbConnected ? ('connected' as const) : ('disconnected' as const),
    }

    // STEP 4: Validate response against Zod schema
    const validated = healthResponseSchema.parse(response)

    // STEP 5: Return response
    res.json(validated)
  } catch (error) {
    // PATTERN: Pass to error middleware
    next(error)
  }
})

export default router

// Task 16: Express App Setup Pseudocode
// packages/backend/src/index.ts

import express from 'express'
import cors from 'cors'
import * as dotenv from 'dotenv'
import healthRoutes from './routes/health.routes'
import { errorMiddleware } from './middleware/error.middleware'
import { logger } from './utils/logger'

// STEP 1: Load environment variables
dotenv.config()

const PORT = process.env.PORT || 3000

// STEP 2: Create Express app
export const app = express()

// STEP 3: Configure middleware (ORDER MATTERS)
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8081',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// STEP 4: Mount routes
app.use('/api/health', healthRoutes)

// STEP 5: Error middleware MUST BE LAST
app.use(errorMiddleware)

// STEP 6: Start server (only if not in test mode)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`)
    logger.info(`Health check: http://localhost:${PORT}/api/health`)
  })
}

// Task 19: Metro Config Pseudocode
// packages/frontend/metro.config.js

const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// CRITICAL: Get workspace root (two levels up from frontend package)
const workspaceRoot = path.resolve(__dirname, '../..');
const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

// STEP 1: Tell Metro to watch entire monorepo
config.watchFolders = [workspaceRoot];

// STEP 2: Configure module resolution for shared package
config.resolver = {
  ...config.resolver,

  // PATTERN: Include both package and workspace node_modules
  nodeModulesPaths: [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(workspaceRoot, 'node_modules'),
  ],

  // CRITICAL: Map shared package to source directory
  extraNodeModules: {
    '@betweenus/shared': path.resolve(workspaceRoot, 'packages/shared'),
  },
};

module.exports = config;
```

### Integration Points

```yaml
DATABASE:
  - PostgreSQL 14+ required
  - Migration: CREATE TABLE users (for Supabase integration)
  - Migration: CREATE TABLE health_checks (for connection testing)

ENVIRONMENT_VARIABLES:
  Root (.env - create manually):
    - No env vars needed at root

  Backend (packages/backend/.env):
    - DATABASE_URL: "postgresql://user:pass@localhost:5432/betweenus"
    - PORT: "3000"
    - NODE_ENV: "development"
    - CORS_ORIGIN: "http://localhost:8081"

  Frontend (packages/frontend/.env):
    - EXPO_PUBLIC_API_URL: "http://localhost:3000/api"

NPM_WORKSPACES:
  - Configure in root package.json:
    workspaces: ["packages/*"]
  - All npm commands run from root
  - Use --workspace flag for package-specific commands

EXTERNAL_SERVICES:
  - PostgreSQL database (local or cloud)
  - Expo development server (runs on 8081 by default)
```

---

## Validation Loop

### Level 1: Installation & Build

```bash
# From root directory
npm install

# Expected: No errors, all packages installed
# Verify workspaces linked:
npm ls @betweenus/shared
# Should show it's symlinked in backend and frontend

# Build shared package
npm run build --workspace=packages/shared

# Expected: dist/ folder created in packages/shared
ls packages/shared/dist
# Should see: index.js, index.d.ts, schemas/, types/
```

### Level 2: TypeScript Compilation

```bash
# Check all packages compile
npm run type-check:all

# Expected: No type errors
# If errors: Read error messages, fix types, re-run

# Check specific package
npm run type-check --workspace=packages/backend
npm run type-check --workspace=packages/frontend
```

### Level 3: Linting & Formatting

```bash
# Lint all code
npm run lint:all

# Expected: No linting errors
# If errors: Run with --fix
npm run lint -- --fix --workspaces

# Check formatting
npx prettier --check "packages/*/src/**/*.{ts,tsx}"

# Fix formatting
npx prettier --write "packages/*/src/**/*.{ts,tsx}"
```

### Level 4: Database Setup

```bash
# Generate migration
npm run db:generate --workspace=packages/backend

# Expected: New migration file in packages/backend/src/db/migrations/
cat packages/backend/src/db/migrations/0000_*.sql
# Should see: CREATE TABLE users, CREATE TABLE health_checks

# Create database (if not exists)
createdb betweenus

# Run migration
npm run db:migrate --workspace=packages/backend

# Expected: "Migrations applied successfully"

# Verify tables created
psql betweenus -c "\dt"
# Should list: users, health_checks, __drizzle_migrations
```

### Level 5: Backend Tests

```bash
cd packages/backend
npm test

# Expected tests:
# ✓ GET /api/health returns 200
# ✓ Response matches healthResponseSchema
# ✓ Database status is "connected"

# If failing: Check DATABASE_URL, ensure migrations ran
```

### Level 6: Frontend Tests

```bash
cd packages/frontend
npm test

# Expected tests:
# ✓ Text component renders correctly
# ✓ Theme colors applied

# If failing: Check Metro bundler config, shared package build
```

### Level 7: Manual Integration Test

```bash
# Terminal 1: Start backend
npm run dev:backend

# Expected output:
# Server running on http://localhost:3000
# Health check: http://localhost:3000/api/health

# Terminal 2: Test health endpoint
curl http://localhost:3000/api/health

# Expected response:
{
  "status": "ok",
  "timestamp": "2025-01-XX...",
  "database": "connected"
}

# Terminal 3: Start frontend
npm run dev:frontend

# Expected: Expo dev server starts
# Press 'i' for iOS simulator or 'a' for Android emulator

# On simulator:
# ✓ App loads without errors
# ✓ HomeScreen displays
# ✓ Can import from @betweenus/shared (no errors in Metro bundler)

# Check Metro bundler output for errors:
# ✓ No "Unable to resolve module" errors
# ✓ No duplicate React Native warnings
```

---

## Final Validation Checklist

- [ ] Root package.json has workspaces configured
- [ ] All 3 packages install correctly: `npm install`
- [ ] Shared package builds: `npm run build --workspace=packages/shared`
- [ ] No TypeScript errors: `npm run type-check:all`
- [ ] No linting errors: `npm run lint:all`
- [ ] Database migrations run successfully
- [ ] Backend server starts: `npm run dev:backend`
- [ ] Health check returns 200: `curl http://localhost:3000/api/health`
- [ ] Backend tests pass: `npm test --workspace=packages/backend`
- [ ] Frontend app starts: `npm run dev:frontend`
- [ ] Frontend loads in Expo without errors
- [ ] Frontend tests pass: `npm test --workspace=packages/frontend`
- [ ] Shared package imports work in both backend and frontend
- [ ] .env.example files document all required variables
- [ ] README.md has setup instructions
- [ ] .gitignore excludes node_modules, dist, .env files

---

## Anti-Patterns to Avoid

### Workspace Anti-Patterns
- ❌ Don't run `npm install` in individual packages - always from root
- ❌ Don't use `yarn` or `pnpm` - stick with npm workspaces
- ❌ Don't import shared package by path - use `@betweenus/shared`
- ❌ Don't forget to build shared package after changes
- ❌ Don't put native dependencies in shared package

### TypeScript Anti-Patterns
- ❌ Don't use `any` type - enable strict mode and fix types properly
- ❌ Don't disable type checking with `@ts-ignore` - fix the root cause
- ❌ Don't forget project references in tsconfig
- ❌ Don't use path aliases across packages

### Database Anti-Patterns
- ❌ Don't use `serial()` - use `generatedAlwaysAsIdentity()` (2025 best practice)
- ❌ Don't commit migrations - they're generated, keep in git
- ❌ Don't hardcode connection strings - use environment variables
- ❌ Don't skip migrations - always run db:generate after schema changes

### Configuration Anti-Patterns
- ❌ Don't share .env files between packages
- ❌ Don't commit .env files - use .env.example
- ❌ Don't forget to configure Metro bundler for monorepo
- ❌ Don't put error middleware before routes - it must be LAST

### Development Anti-Patterns
- ❌ Don't exceed 500 LOC per file (per CLAUDE.md)
- ❌ Don't skip tests - write them from the start
- ❌ Don't use semicolons - follow Prettier config
- ❌ Don't use 4-space indent - use 2 spaces (per CLAUDE.md)

---

## Quality Score

### Confidence Level: **9/10**

**Reasons for 9/10:**

✅ **Strong foundations:**
- Standard npm workspaces (well-documented, widely used)
- TypeScript strict mode with project references
- Clear monorepo structure (3 packages)
- Comprehensive validation gates at each step
- Reference examples in use-cases/mcp-server

✅ **Low complexity:**
- No custom build tools or complex configurations
- Standard tooling (TypeScript, ESLint, Prettier, Jest)
- Well-defined file structure
- Clear task order with dependencies

✅ **Proven patterns:**
- Metro bundler monorepo config is standard for Expo
- Drizzle ORM has excellent documentation
- Express server setup is straightforward
- All dependencies are stable, popular packages

✅ **Self-validating:**
- Each level builds on previous
- Clear success criteria at each step
- Executable commands for all validation
- Manual integration test to verify end-to-end

⚠️ **Minor challenges:**
- Metro bundler monorepo config can be finicky (but well-documented)
- First-time Drizzle setup requires careful env var management
- TypeScript project references need to be exact

**Mitigation strategies:**
- Detailed Metro config provided in pseudocode
- Step-by-step database setup with verification
- Comprehensive troubleshooting in README

**Expected outcome:** Fully functional monorepo with backend server, frontend app, shared schemas, all tests passing, and clear development workflow. This provides the foundation for all subsequent PRPs (Authentication, Posting, etc.).

---

## Next Steps After Completion

Once project scaffolding is complete, execute PRPs in this order:

1. **Authentication PRP** (next) - Supabase Auth integration, user roles
2. **Posting Content MVP PRP** (already created) - Core posting feature
3. **Dashboard PRP** - User activity overview
4. **Search PRP** - Name/image/keyword search
5. **Moderation PRP** - Admin tools and content review

Each PRP will build on this scaffolding foundation.
