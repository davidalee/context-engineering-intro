name: "Posting Content MVP - BetweenUs"
description: |
  Complete implementation of the core posting feature with content filtering,
  auto-rewrite suggestions, and legal defensibility framework.

---

## Goal

Build the MVP posting system for BetweenUs that allows users to anonymously share dating experiences while maintaining legal defensibility through intelligent content filtering, auto-rewrite suggestions, and brand voice compliance.

## Why

- **Business Value**: Core feature that differentiates BetweenUs from generic review platforms
- **User Impact**: Enables safety reporting while protecting users from legal liability
- **Integration**: Foundation for moderation queue, pattern detection, and search features
- **Legal Necessity**: Implements "defamation friction" and tone moderation required for platform viability

## What

Users can create posts about dating experiences with:
- Text-based content with rich formatting
- Real-time inline tooltips warning about problematic language
- One-tap auto-rewrite suggestions to improve safety/legality
- Confirmation checkpoints before submission
- Anonymous posting with behind-the-scenes identity verification (stub for now)

### Success Criteria

- [ ] User can create a post through React Native form
- [ ] Backend validates post content using Zod schemas
- [ ] Inline tooltips trigger on 10 pattern categories (see INLINE_TOOLTIPS.md)
- [ ] Auto-rewrite service provides 3 alternative phrasings using OpenAI
- [ ] Posts stored in PostgreSQL with original + rewritten text
- [ ] All tests pass (unit + integration)
- [ ] No type errors (TypeScript strict mode)
- [ ] API documented with example requests/responses

---

## All Needed Context

### Documentation & References

```yaml
# DEPENDENCIES - Other PRPs
- file: /Users/wookiee/Code/BetweenUs/PRPs/project-scaffolding.md
  why: Monorepo structure, database config, shared schemas foundation
  critical: MUST be complete before starting this PRP
  provides: Database connection, base schema, middleware structure

- file: /Users/wookiee/Code/BetweenUs/PRPs/authentication.md
  why: Authentication middleware, user context, JWT validation
  critical: MUST be complete before starting this PRP
  provides: requireAuth middleware, user profiles table, Supabase integration

# MUST READ - Core Project Documentation
- file: /Users/wookiee/Code/BetweenUs/docs/COMMUNITY_GUIDELINES.md
  why: Legal/psychological framework - "defamation friction" principles
  critical: Platform is "safety reporting" not "exposure" - this drives ALL UX copy

- file: /Users/wookiee/Code/BetweenUs/docs/RULES_POSTING_FRAMEWORK.md
  why: User-facing posting rules + auto-rewrite system design
  critical: 8 core rules users must follow, banner copy, footer text

- file: /Users/wookiee/Code/BetweenUs/docs/INLINE_TOOLTIPS.md
  why: 10 trigger categories for real-time warnings + rewrite suggestions
  critical: Complete pattern list with regex triggers and suggestion templates

- file: /Users/wookiee/Code/BetweenUs/docs/BRAND_VOICE_GUIDE.md
  why: Voice/tone standards for ALL copy (API responses, tooltips, errors)
  critical: "Measured not moralizing" - vocabulary standards (USE vs AVOID)

- file: /Users/wookiee/Code/BetweenUs/docs/COPY_EXAMPLES_GOOD_V_BAD.md
  why: Side-by-side examples showing legal implications of word choice
  critical: "Diary entry" not "courtroom accusation"

- file: /Users/wookiee/Code/BetweenUs/CLAUDE.md
  why: TypeScript conventions, file structure rules, testing requirements
  critical: Never exceed 500 LOC, use 2-space indent, strict TypeScript

# External Documentation - Tech Stack
- url: https://orm.drizzle.team/docs/get-started/postgresql-new
  why: Drizzle ORM setup, schema patterns, migrations
  section: "PostgreSQL column types" for correct type usage
  critical: Use .generatedAlwaysAsIdentity() not serial (2025 best practice)

- url: https://orm.drizzle.team/docs/column-types/pg
  why: PostgreSQL column type reference
  section: All column types (text, timestamp, jsonb, enum)

- url: https://blog.oscars.dev/posts/building-bulletproof-expressjs-apis-with-zod/
  why: Express + Zod validation middleware patterns
  critical: Type-safe request validation with error handling

- url: https://platform.openai.com/docs/guides/moderation
  why: OpenAI Moderation API for content flagging
  section: "Quickstart" - basic implementation

- url: https://platform.openai.com/docs/api-reference/chat/create
  why: OpenAI Chat API for auto-rewrite generation
  section: Using GPT-4 for content rewriting with system prompts

- url: https://reactnative.dev/docs/handling-text-input
  why: React Native TextInput component
  section: onChangeText for real-time validation

- url: https://supabase.com/docs/guides/auth/server-side/creating-a-client
  why: Supabase Auth server-side patterns
  critical: getUser() validation, JWT verification

- url: https://zod.dev/
  why: Zod schema validation library
  section: Basic usage, string validators, custom refinements

# Code Examples from Codebase
- file: /Users/wookiee/Code/BetweenUs/use-cases/mcp-server/examples/database-tools.ts
  why: Zod schema pattern, tool registration architecture
  pattern: Modular service registration, input validation

- file: /Users/wookiee/Code/BetweenUs/use-cases/mcp-server/src/database/security.ts
  why: SQL injection prevention patterns
  pattern: Validation utilities, security helpers

- file: /Users/wookiee/Code/BetweenUs/use-cases/mcp-server/src/types.ts
  why: TypeScript type definition patterns
  pattern: Shared types, branded types, utility types
```

### Current Codebase Tree

```bash
BetweenUs/
├── packages/                # From project-scaffolding PRP
│   ├── backend/             # Node.js + Express + TypeScript (scaffolded)
│   ├── frontend/            # React Native + Expo (scaffolded)
│   └── shared/              # Zod schemas (scaffolded)
├── .claude/
├── docs/                    # All docs exist and referenced
├── PRPs/
│   ├── posting-content-mvp.md  # THIS FILE
│   ├── project-scaffolding.md  # DEPENDENCY - must be complete
│   └── authentication.md        # DEPENDENCY - must be complete
├── use-cases/               # Reference examples
├── CLAUDE.md
├── INITIAL.md
└── README.md

# ASSUMES: project-scaffolding PRP and authentication PRP are COMPLETE
```

### Desired Codebase Tree with Files to be Added

```bash
BetweenUs/
├── backend/                              # NEW - Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts              # Drizzle connection setup
│   │   │   ├── openai.ts                # OpenAI client config
│   │   │   └── supabase.ts              # Supabase client config
│   │   ├── db/
│   │   │   ├── schema.ts                # Drizzle schema definitions
│   │   │   └── migrations/              # SQL migration files
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts       # Supabase JWT verification
│   │   │   ├── validation.middleware.ts # Zod validation wrapper
│   │   │   └── error.middleware.ts      # Global error handler
│   │   ├── routes/
│   │   │   └── posts.routes.ts          # POST /api/posts, GET /api/posts/:id
│   │   ├── controllers/
│   │   │   └── posts.controller.ts      # Request/response handling
│   │   ├── services/
│   │   │   ├── posts.service.ts         # Business logic (CRUD)
│   │   │   ├── content-filter.service.ts # Pattern matching for tooltips
│   │   │   ├── auto-rewrite.service.ts  # OpenAI-powered rewrites
│   │   │   └── moderation.service.ts    # OpenAI Moderation API
│   │   ├── utils/
│   │   │   ├── trigger-patterns.ts      # Regex patterns from INLINE_TOOLTIPS.md
│   │   │   ├── brand-voice.ts           # Copy templates from BRAND_VOICE_GUIDE.md
│   │   │   └── response.ts              # Standardized API responses
│   │   ├── types/
│   │   │   ├── posts.types.ts           # Post-related TypeScript types
│   │   │   └── api.types.ts             # API request/response types
│   │   └── index.ts                     # Express app setup
│   ├── tests/
│   │   ├── integration/
│   │   │   └── posts.test.ts            # Supertest API tests
│   │   ├── unit/
│   │   │   ├── content-filter.test.ts   # Pattern matching tests
│   │   │   └── auto-rewrite.test.ts     # Rewrite service tests
│   │   └── fixtures/
│   │       └── test-posts.ts            # Test data
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── drizzle.config.ts                # Drizzle migration config
├── frontend/                             # NEW - React Native + TypeScript
│   ├── src/
│   │   ├── screens/
│   │   │   └── PostCreationScreen.tsx   # Main posting interface
│   │   ├── components/
│   │   │   ├── PostForm.tsx             # Form component
│   │   │   ├── InlineTooltip.tsx        # Warning tooltip UI
│   │   │   ├── RewriteSuggestion.tsx    # Auto-rewrite options UI
│   │   │   └── ConfirmationChecklist.tsx # Pre-submit checkboxes
│   │   ├── services/
│   │   │   └── api.service.ts           # Backend API client (Axios)
│   │   ├── types/
│   │   │   └── posts.types.ts           # Shared types with backend
│   │   ├── utils/
│   │   │   └── validation.ts            # Client-side validation helpers
│   │   └── hooks/
│   │       └── usePostValidation.ts     # Real-time validation hook
│   ├── tests/
│   │   └── components/
│   │       └── PostForm.test.tsx        # Component tests
│   ├── package.json
│   └── tsconfig.json
├── shared/                               # NEW - Shared code (Zod schemas)
│   ├── schemas/
│   │   └── post.schema.ts               # Zod validation schemas
│   └── package.json
└── docs/                                 # Existing docs (no changes)
```

### Known Gotchas & Library Quirks

```typescript
// CRITICAL 1: Drizzle ORM 2025 best practices
// ❌ DON'T use serial() - deprecated
id: serial('id').primaryKey()

// ✅ DO use generatedAlwaysAsIdentity()
id: integer('id').primaryKey().generatedAlwaysAsIdentity()

// CRITICAL 2: Supabase Auth with Express
// Supabase doesn't have official Express middleware
// Must implement custom JWT verification:
const token = req.headers.authorization?.replace('Bearer ', '')
const { data: { user } } = await supabase.auth.getUser(token)
// Use getUser() NOT getSession() - validates with auth server

// CRITICAL 3: OpenAI Moderation API is FREE but has rate limits
// Don't call on every keystroke - debounce or call on submit only
// Use moderation.createModeration() for content flagging
// Use chat.completions.create() for auto-rewrites

// CRITICAL 4: Zod with Express
// Use express-zod-safe or create custom middleware
// Don't modify req.body in validation - create new validated object
const validated = schema.parse(req.body) // Throws on error
// Handle ZodError in global error middleware

// CRITICAL 5: React Native TextInput performance
// onChangeText fires on EVERY character
// Debounce pattern matching (use lodash.debounce or custom hook)
// Don't run LLM calls in real-time - only on demand

// CRITICAL 6: Legal compliance - Store BOTH versions
posts table MUST have:
- original_text: what user actually typed
- rewritten_text: what was published (if they accepted suggestion)
// This protects platform if legal questions arise

// CRITICAL 7: Brand voice in error messages
// ❌ BAD: "Invalid post content"
// ✅ GOOD: "This post needs a few adjustments to meet our guidelines"
// See BRAND_VOICE_GUIDE.md for all copy

// CRITICAL 8: TypeScript strict mode required
// tsconfig.json must have "strict": true
// No implicit any, proper null checks, etc.

// CRITICAL 9: Monorepo structure
// backend/, frontend/, shared/ are separate packages
// shared/ exports Zod schemas used by both
// Use npm workspaces or yarn workspaces

// CRITICAL 10: Environment variables
// Backend needs: DATABASE_URL, SUPABASE_URL, SUPABASE_ANON_KEY, OPENAI_API_KEY
// Frontend needs: REACT_APP_API_URL
// NEVER commit .env files - use .env.example
```

---

## Implementation Blueprint

### Data Models and Structure

```typescript
// backend/src/db/schema.ts - Drizzle Schema

import { pgTable, integer, text, timestamp, jsonb, pgEnum, uuid } from 'drizzle-orm/pg-core'

// Post status enum
export const postStatusEnum = pgEnum('post_status', [
  'draft',
  'pending_review',
  'published',
  'rejected'
])

// Posts table
export const posts = pgTable('posts', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: uuid('user_id').notNull(), // FK to auth.users (Supabase)

  // Content - store BOTH versions for legal protection
  originalText: text('original_text').notNull(),
  rewrittenText: text('rewritten_text'), // Nullable - only if user accepted suggestion

  // Metadata
  status: postStatusEnum('status').notNull().default('draft'),
  moderationFlags: jsonb('moderation_flags').$type<ModerationFlags>(), // OpenAI moderation results
  triggerMatches: jsonb('trigger_matches').$type<TriggerMatch[]>(), // Which patterns triggered

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'), // Soft delete
})

// TypeScript types inferred from schema
export type Post = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert

// Supporting types
type ModerationFlags = {
  flagged: boolean
  categories: {
    hate: boolean
    harassment: boolean
    sexual: boolean
    violence: boolean
    'self-harm': boolean
  }
  category_scores: Record<string, number>
}

type TriggerMatch = {
  category: string // e.g., "diagnoses", "criminal_allegations"
  matched_text: string
  position: number
  severity: 'warn' | 'block'
}
```

```typescript
// shared/schemas/post.schema.ts - Zod Validation Schemas

import { z } from 'zod'

// Post creation schema
export const createPostSchema = z.object({
  text: z.string()
    .min(50, 'Posts must be at least 50 characters')
    .max(5000, 'Posts cannot exceed 5000 characters')
    .refine(
      (text) => /\b(I|my|me)\b/i.test(text),
      'Posts must use first-person language (I, my, me)'
    ),
  confirmations: z.object({
    firstPerson: z.literal(true, {
      errorMap: () => ({ message: 'You must confirm this reflects your personal experience' })
    }),
    noHarassment: z.literal(true, {
      errorMap: () => ({ message: 'You must agree not to harass or threaten' })
    }),
    understandsPublic: z.literal(true, {
      errorMap: () => ({ message: 'You must acknowledge this may be read by the subject' })
    }),
  })
})

export type CreatePostInput = z.infer<typeof createPostSchema>

// Auto-rewrite request schema
export const rewriteRequestSchema = z.object({
  text: z.string().min(1),
  triggerCategory: z.enum([
    'diagnoses',
    'criminal_allegations',
    'character_attacks',
    'mind_reading',
    'rumor_amplification',
    'absolute_claims',
    'doxxing',
    'calls_to_action',
    'threats',
    'relationship_accusations'
  ])
})

export type RewriteRequestInput = z.infer<typeof rewriteRequestSchema>
```

### List of Tasks (in order)

```yaml
Task 1: Project scaffolding
  - CREATE backend/package.json with dependencies
  - CREATE frontend/package.json with dependencies
  - CREATE shared/package.json
  - CREATE tsconfig.json files (strict mode)
  - CREATE .env.example files with required variables
  - RUN npm install in all workspaces

Task 2: Database setup
  - CREATE backend/src/config/database.ts (Drizzle connection)
  - CREATE backend/src/db/schema.ts (posts table schema - see above)
  - CREATE backend/drizzle.config.ts (migration config)
  - RUN drizzle-kit generate:pg (generate migration)
  - RUN drizzle-kit migrate (apply migration)

Task 3: Shared validation schemas
  - CREATE shared/schemas/post.schema.ts (Zod schemas - see above)
  - EXPORT all schemas from shared/index.ts

Task 4: Content filtering service
  - CREATE backend/src/utils/trigger-patterns.ts
    - IMPLEMENT all 10 trigger categories from INLINE_TOOLTIPS.md
    - USE regex patterns for each category
    - EXPORT pattern matchers as named functions
  - CREATE backend/src/services/content-filter.service.ts
    - IMPORT trigger patterns
    - IMPLEMENT analyzeContent(text: string) → TriggerMatch[]
    - RETURN all matched patterns with position and severity

Task 5: Auto-rewrite service
  - CREATE backend/src/config/openai.ts (OpenAI client)
  - CREATE backend/src/utils/brand-voice.ts
    - IMPORT copy templates from BRAND_VOICE_GUIDE.md
    - EXPORT system prompts for rewrites
  - CREATE backend/src/services/auto-rewrite.service.ts
    - IMPLEMENT generateRewrites(text, triggerCategory) → string[]
    - CALL OpenAI Chat API with brand voice prompts
    - RETURN 3 alternative phrasings
  - CREATE backend/src/services/moderation.service.ts
    - IMPLEMENT moderateContent(text) → ModerationFlags
    - CALL OpenAI Moderation API

Task 6: Authentication middleware
  - CREATE backend/src/config/supabase.ts (Supabase client)
  - CREATE backend/src/middleware/auth.middleware.ts
    - IMPLEMENT requireAuth middleware
    - EXTRACT JWT from Authorization header
    - CALL supabase.auth.getUser(token)
    - ATTACH user to req.user
    - HANDLE errors with 401 response

Task 7: Validation middleware
  - CREATE backend/src/middleware/validation.middleware.ts
    - IMPLEMENT validateRequest(schema) middleware factory
    - PARSE req.body with schema.parse()
    - CATCH ZodError and format errors
    - RETURN 400 with user-friendly messages (brand voice)

Task 8: Error handling middleware
  - CREATE backend/src/middleware/error.middleware.ts
    - IMPLEMENT global error handler
    - HANDLE ZodError, Drizzle errors, custom errors
    - USE brand voice for error messages
    - LOG errors (don't expose internals to client)

Task 9: Posts service (business logic)
  - CREATE backend/src/types/posts.types.ts
    - DEFINE API request/response types
  - CREATE backend/src/services/posts.service.ts
    - IMPLEMENT createPost(userId, data) → Post
    - CALL content-filter.service to detect triggers
    - CALL moderation.service for OpenAI check
    - INSERT into posts table via Drizzle
    - STORE original_text, trigger_matches, moderation_flags
    - RETURN created post
  - IMPLEMENT getPostById(id) → Post | null

Task 10: Posts controller
  - CREATE backend/src/controllers/posts.controller.ts
    - IMPLEMENT handleCreatePost(req, res, next)
      - EXTRACT validated data from req.body
      - CALL posts.service.createPost()
      - RETURN 201 with created post
    - IMPLEMENT handleGetPost(req, res, next)
      - EXTRACT id from req.params
      - CALL posts.service.getPostById()
      - RETURN 200 or 404

Task 11: Posts routes
  - CREATE backend/src/routes/posts.routes.ts
    - IMPORT express.Router()
    - DEFINE POST /api/posts
      - MIDDLEWARE: requireAuth, validateRequest(createPostSchema)
      - HANDLER: handleCreatePost
    - DEFINE GET /api/posts/:id
      - MIDDLEWARE: requireAuth
      - HANDLER: handleGetPost
    - DEFINE POST /api/posts/rewrite
      - MIDDLEWARE: requireAuth, validateRequest(rewriteRequestSchema)
      - HANDLER: handleRewriteRequest
    - EXPORT router

Task 12: Express app setup
  - CREATE backend/src/index.ts
    - IMPORT express, routes, middleware
    - SETUP CORS, JSON parsing
    - MOUNT /api/posts routes
    - MOUNT error middleware LAST
    - START server on PORT from env

Task 13: Backend tests - Content filter
  - CREATE backend/tests/unit/content-filter.test.ts
    - TEST each trigger category with examples from INLINE_TOOLTIPS.md
    - TEST non-triggering text returns empty array
    - TEST multiple triggers detected correctly

Task 14: Backend tests - Auto-rewrite
  - CREATE backend/tests/unit/auto-rewrite.test.ts
    - TEST generates 3 rewrites
    - TEST follows brand voice guidelines
    - MOCK OpenAI API calls (don't hit real API in tests)

Task 15: Backend tests - API integration
  - CREATE backend/tests/integration/posts.test.ts
    - USE Supertest to test endpoints
    - TEST POST /api/posts success (201)
    - TEST POST /api/posts validation errors (400)
    - TEST POST /api/posts unauthorized (401)
    - TEST GET /api/posts/:id success (200)
    - TEST GET /api/posts/:id not found (404)
    - MOCK Supabase auth (test user)
    - CLEAN UP database after each test

Task 16: Frontend - API service
  - CREATE frontend/src/services/api.service.ts
    - IMPORT axios
    - CREATE client with baseURL from env
    - IMPLEMENT createPost(data, token) → Promise<Post>
    - IMPLEMENT requestRewrite(text, category, token) → Promise<string[]>
    - HANDLE errors with user-friendly messages

Task 17: Frontend - Types
  - CREATE frontend/src/types/posts.types.ts
    - IMPORT shared schemas
    - DEFINE component prop types
    - DEFINE state types

Task 18: Frontend - Validation hook
  - CREATE frontend/src/hooks/usePostValidation.ts
    - USE useState for validation state
    - USE useMemo for trigger patterns (lightweight client-side check)
    - IMPLEMENT debounced validation (300ms)
    - RETURN { triggers, isValid, errors }

Task 19: Frontend - Inline tooltip component
  - CREATE frontend/src/components/InlineTooltip.tsx
    - PROPS: trigger (TriggerMatch), onRewriteRequest
    - RENDER warning message based on trigger.category
    - BUTTON: "Rewrite this" → calls onRewriteRequest
    - STYLE: Use brand voice copy (measured, not moralizing)

Task 20: Frontend - Rewrite suggestion component
  - CREATE frontend/src/components/RewriteSuggestion.tsx
    - PROPS: suggestions (string[]), onSelect, onDismiss
    - RENDER 3 one-tap options
    - BUTTON for each: "Use this" → calls onSelect(text)
    - FOOTER: "These are suggestions - you decide"
    - STYLE: Calm, non-judgmental

Task 21: Frontend - Confirmation checklist
  - CREATE frontend/src/components/ConfirmationChecklist.tsx
    - PROPS: confirmations (object), onChange
    - RENDER 3 checkboxes from createPostSchema
      - "This reflects my personal experience"
      - "I won't harass or threaten anyone"
      - "I understand this may be read by the person"
    - DISABLE submit until all checked

Task 22: Frontend - Post form
  - CREATE frontend/src/components/PostForm.tsx
    - USE usePostValidation hook
    - STATE: text, confirmations, rewrites, isSubmitting
    - TEXTINPUT with onChangeText → triggers validation
    - RENDER InlineTooltip for each trigger below input
    - RENDER RewriteSuggestion when requested
    - RENDER ConfirmationChecklist before submit
    - BUTTON: "Share experience" (disabled until valid + confirmed)
    - ON SUBMIT: Call api.createPost()
    - HANDLE errors with user-friendly messages

Task 23: Frontend - Post creation screen
  - CREATE frontend/src/screens/PostCreationScreen.tsx
    - IMPORT PostForm
    - RENDER with navigation header
    - HANDLE post success → navigate to post view
    - STYLE: Clean, minimal, focused

Task 24: Frontend tests - Components
  - CREATE frontend/tests/components/PostForm.test.tsx
    - USE @testing-library/react-native
    - TEST renders text input
    - TEST shows tooltips when triggers detected
    - TEST shows rewrite suggestions when requested
    - TEST confirmation checklist blocks submit
    - TEST submits when valid
    - MOCK API calls

Task 25: Final validation
  - RUN npm run lint (ESLint + Prettier)
  - RUN npm run type-check (TypeScript)
  - RUN npm test (all tests)
  - TEST manual E2E flow:
    - Start backend server
    - Start React Native app
    - Create post with trigger words
    - Verify tooltips appear
    - Request rewrite
    - Accept suggestion
    - Submit post
    - Verify stored in database
  - VERIFY environment variables documented in .env.example
```

### Per-Task Pseudocode (Critical Tasks Only)

```typescript
// Task 4: Content Filter Service Pseudocode
// backend/src/services/content-filter.service.ts

import { triggerPatterns } from '../utils/trigger-patterns'
import type { TriggerMatch } from '../types/posts.types'

export class ContentFilterService {
  analyzeContent(text: string): TriggerMatch[] {
    const matches: TriggerMatch[] = []

    // PATTERN: Iterate through all 10 trigger categories
    for (const [category, patterns] of Object.entries(triggerPatterns)) {
      for (const pattern of patterns) {
        const regex = new RegExp(pattern.regex, 'gi')
        let match

        // CRITICAL: Find ALL matches, not just first
        while ((match = regex.exec(text)) !== null) {
          matches.push({
            category,
            matched_text: match[0],
            position: match.index,
            severity: pattern.severity // 'warn' or 'block'
          })
        }
      }
    }

    // PATTERN: Sort by position for UI rendering
    return matches.sort((a, b) => a.position - b.position)
  }
}

// Task 5: Auto-Rewrite Service Pseudocode
// backend/src/services/auto-rewrite.service.ts

import OpenAI from 'openai'
import { brandVoicePrompts } from '../utils/brand-voice'

export class AutoRewriteService {
  private openai: OpenAI

  async generateRewrites(
    text: string,
    triggerCategory: string
  ): Promise<string[]> {
    // PATTERN: Use system prompt from brand voice guide
    const systemPrompt = brandVoicePrompts.rewriteSystem

    // CRITICAL: Category-specific instructions
    const categoryGuidance = brandVoicePrompts.categories[triggerCategory]

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Rewrite this to ${categoryGuidance}:\n\n"${text}"\n\nProvide 3 alternatives, one per line.`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    })

    // PATTERN: Parse response into array
    const rewrites = completion.choices[0].message.content
      ?.split('\n')
      .filter(line => line.trim().length > 0)
      .slice(0, 3) // Ensure only 3

    return rewrites || []
  }
}

// Task 9: Posts Service Pseudocode
// backend/src/services/posts.service.ts

import { db } from '../config/database'
import { posts } from '../db/schema'
import { ContentFilterService } from './content-filter.service'
import { ModerationService } from './moderation.service'

export class PostsService {
  private contentFilter = new ContentFilterService()
  private moderation = new ModerationService()

  async createPost(userId: string, data: CreatePostInput): Promise<Post> {
    // STEP 1: Analyze content for triggers
    const triggers = this.contentFilter.analyzeContent(data.text)

    // STEP 2: Check OpenAI moderation
    const moderationFlags = await this.moderation.moderateContent(data.text)

    // STEP 3: Determine initial status
    const hasBlockingTriggers = triggers.some(t => t.severity === 'block')
    const isFlagged = moderationFlags.flagged

    const status = hasBlockingTriggers || isFlagged
      ? 'pending_review'
      : 'published'

    // STEP 4: Insert into database
    const [post] = await db.insert(posts).values({
      userId,
      originalText: data.text,
      rewrittenText: null, // User didn't accept rewrite (yet)
      status,
      moderationFlags,
      triggerMatches: triggers
    }).returning()

    // PATTERN: Return created post
    return post
  }
}

// Task 18: Frontend Validation Hook Pseudocode
// frontend/src/hooks/usePostValidation.ts

import { useState, useMemo, useCallback } from 'react'
import { debounce } from 'lodash' // or custom implementation
import { lightweightPatterns } from '../utils/validation' // Subset for client

export function usePostValidation() {
  const [text, setText] = useState('')
  const [triggers, setTriggers] = useState<TriggerMatch[]>([])

  // PATTERN: Debounce validation to avoid excessive renders
  const validateText = useMemo(
    () => debounce((value: string) => {
      const matches: TriggerMatch[] = []

      // CRITICAL: Only run lightweight patterns on client
      // Full validation happens on server
      for (const [category, pattern] of Object.entries(lightweightPatterns)) {
        const regex = new RegExp(pattern, 'gi')
        if (regex.test(value)) {
          matches.push({
            category,
            matched_text: '', // Don't need exact match on client
            position: 0,
            severity: 'warn'
          })
        }
      }

      setTriggers(matches)
    }, 300),
    []
  )

  const handleTextChange = useCallback((value: string) => {
    setText(value)
    validateText(value)
  }, [validateText])

  return {
    text,
    triggers,
    handleTextChange,
    isValid: text.length >= 50 && triggers.filter(t => t.severity === 'block').length === 0
  }
}
```

### Integration Points

```yaml
DATABASE:
  - migration: "CREATE TABLE posts with identity column, jsonb fields"
  - migration: "CREATE INDEX idx_posts_user_id ON posts(user_id)"
  - migration: "CREATE INDEX idx_posts_status ON posts(status)"
  - migration: "CREATE INDEX idx_posts_created_at ON posts(created_at DESC)"

ENVIRONMENT_VARIABLES:
  Backend (.env):
    - DATABASE_URL: "postgresql://user:pass@localhost:5432/betweenus"
    - SUPABASE_URL: "https://xxx.supabase.co"
    - SUPABASE_ANON_KEY: "eyJ..."
    - OPENAI_API_KEY: "sk-..."
    - PORT: "3000"
    - NODE_ENV: "development"

  Frontend (.env):
    - REACT_APP_API_URL: "http://localhost:3000/api"
    - REACT_APP_SUPABASE_URL: "https://xxx.supabase.co"
    - REACT_APP_SUPABASE_ANON_KEY: "eyJ..."

EXTERNAL_SERVICES:
  - Supabase Auth: User authentication and JWT tokens
  - OpenAI Moderation API: Content flagging (free tier)
  - OpenAI Chat API: Auto-rewrite generation (costs ~$0.01 per rewrite)

NPM_WORKSPACES:
  - Configure root package.json with:
    workspaces:
      - "backend"
      - "frontend"
      - "shared"
```

---

## Validation Loop

### Level 1: Syntax & Style

```bash
# Backend
cd backend
npm run lint          # ESLint + Prettier
npm run type-check    # TypeScript compiler (no emit)

# Frontend
cd frontend
npm run lint
npm run type-check

# Shared
cd shared
npm run type-check

# Expected: No errors. If errors, READ and FIX before proceeding.
```

### Level 2: Unit Tests

```bash
# Backend - Content filter tests
cd backend
npm test -- tests/unit/content-filter.test.ts

# Test cases:
# - Detects "narcissist" → triggers "diagnoses" category
# - Detects "he assaulted" → triggers "criminal_allegations"
# - Detects "everyone knows" → triggers "rumor_amplification"
# - Clean text returns empty array
# - Multiple triggers in one text all detected

# Backend - Auto-rewrite tests
npm test -- tests/unit/auto-rewrite.test.ts

# Test cases:
# - Generates 3 rewrites
# - Rewrites use first-person language
# - Rewrites remove diagnostic labels
# - Mock OpenAI API (don't call real API)

# Frontend - Component tests
cd frontend
npm test -- tests/components/PostForm.test.tsx

# Test cases:
# - Renders text input
# - Shows tooltip when trigger detected
# - Requests rewrite when button clicked
# - Checkboxes must be checked to submit
# - Submits successfully with valid input
```

### Level 3: Integration Tests

```bash
# Backend API tests
cd backend
npm test -- tests/integration/posts.test.ts

# Test cases:
# ✅ POST /api/posts with valid data → 201 + post returned
# ✅ POST /api/posts with missing auth → 401
# ✅ POST /api/posts with invalid data → 400 + error messages
# ✅ POST /api/posts with trigger words → 201 + triggers in response
# ✅ GET /api/posts/:id with valid id → 200 + post
# ✅ GET /api/posts/:id with invalid id → 404
# ✅ POST /api/posts/rewrite → 200 + 3 suggestions

# If any fail: Check logs, understand root cause, fix code, re-run
```

### Level 4: Manual E2E Test

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm start

# Manual test flow:
1. Open app in simulator/emulator
2. Log in (using Supabase test account)
3. Navigate to "Share Experience" screen
4. Type: "He's a narcissist who manipulated me"
   - VERIFY: Tooltip appears for "narcissist"
   - VERIFY: Warning says "avoid diagnosing mental health"
5. Tap "Rewrite this"
   - VERIFY: 3 suggestions appear
   - VERIFY: Suggestions use descriptive language not labels
6. Tap first suggestion to accept
   - VERIFY: Text input updates
7. Check all confirmation boxes
8. Tap "Share experience"
   - VERIFY: Success message
   - VERIFY: Navigate to post view
9. Check database:
   SELECT * FROM posts ORDER BY created_at DESC LIMIT 1;
   - VERIFY: original_text has "narcissist"
   - VERIFY: rewritten_text has accepted suggestion
   - VERIFY: trigger_matches jsonb has diagnoses category
   - VERIFY: moderation_flags jsonb has OpenAI results

# If any step fails: Check console logs, network requests, database
```

---

## Final Validation Checklist

- [ ] All tests pass: `npm test` (backend + frontend)
- [ ] No linting errors: `npm run lint` (all workspaces)
- [ ] No type errors: `npm run type-check` (all workspaces)
- [ ] Manual E2E test successful (see above)
- [ ] All 10 trigger categories implemented from INLINE_TOOLTIPS.md
- [ ] Auto-rewrites follow brand voice from BRAND_VOICE_GUIDE.md
- [ ] API responses use copy from BRAND_VOICE_GUIDE.md (not generic errors)
- [ ] Environment variables documented in .env.example files
- [ ] Database migration runs successfully
- [ ] README.md updated with setup instructions
- [ ] Posts table has both original_text and rewritten_text
- [ ] Confirmation checkboxes use exact copy from RULES_POSTING_FRAMEWORK.md
- [ ] Footer text appended: "This reflects one person's experience"

---

## Anti-Patterns to Avoid

### Technical Anti-Patterns
- ❌ Don't use serial() for primary keys - use generatedAlwaysAsIdentity()
- ❌ Don't call OpenAI API on every keystroke - debounce or on-demand only
- ❌ Don't use getSession() - use getUser() for auth validation
- ❌ Don't modify req.body in validation middleware - create new object
- ❌ Don't store only rewritten text - MUST store original too
- ❌ Don't skip soft deletes - legal requirement (deleted_at column)
- ❌ Don't expose internal errors to client - use brand voice messages
- ❌ Don't exceed 500 LOC per file - refactor into modules

### UX/Copy Anti-Patterns
- ❌ Don't say "Invalid" - say "This needs adjustment"
- ❌ Don't say "Error" - say "Let's try again"
- ❌ Don't moralize - stay neutral and measured
- ❌ Don't use words like: expose, report, danger, predator, justice, truth
- ❌ Don't make rewrites feel mandatory - "suggestion" not "requirement"
- ❌ Don't use courtroom language - use diary entry language
- ❌ Don't say "This violates rules" - say "This doesn't match our guidelines"

### Legal Anti-Patterns
- ❌ Don't allow posts without confirmations - checkboxes are REQUIRED
- ❌ Don't skip moderation for any user - no "trusted user" bypass
- ❌ Don't delete moderation_flags - permanent audit trail
- ❌ Don't allow users to edit published posts without re-moderation
- ❌ Don't show other users' identity info - anonymous always
- ❌ Don't suggest platform endorses claims - "one person's experience"

---

## Quality Score

### Confidence Level: **8/10**

**Reasons for 8/10:**

✅ **Strong foundations:**
- Exceptional documentation (5 comprehensive docs)
- Clear legal/psychological framework
- Specific technical requirements
- Complete validation loop defined

✅ **Achievable scope:**
- MVP focused on core posting only
- Well-defined 25 tasks in logical order
- No unknown unknowns in tech stack
- All dependencies have 2025 documentation

✅ **Self-validating:**
- Unit tests for each service
- Integration tests for API
- Manual E2E test procedure
- Executable validation gates

⚠️ **Moderate challenges:**
- OpenAI API integration (costs, rate limits, prompt engineering)
- Custom Supabase auth middleware (not officially documented for Express)
- Trigger pattern regex complexity (10 categories, edge cases)
- React Native real-time validation performance

⚠️ **Minor gaps:**
- No existing code to reference (starting from zero)
- Monorepo setup complexity (workspaces, shared types)
- Brand voice enforcement in error messages (subjective)

**Mitigation strategies:**
- Mock OpenAI in tests (control costs)
- Reference use-cases/mcp-server for Zod/TypeScript patterns
- Start with 3-4 trigger categories, expand incrementally
- Use lodash.debounce for validation performance

**Expected outcome:** Working MVP posting feature with all core functionality, passing tests, and legal defensibility framework in place. Follow-up PRPs needed for identity verification, image uploads, and advanced pattern detection.

---

## Next Steps After Completion

Once this PRP is successfully implemented, create follow-up PRPs for:

1. **Identity Verification Integration** - Jumio/Onfido API, selfie analysis
2. **Image Upload System** - Photo uploads, reverse image search, moderation
3. **Pattern Detection** - Cross-post analysis, same person multiple reports
4. **Subject Response System** - Limited right of response, notification flow
5. **Moderation Queue UI** - Admin dashboard, human review workflow
6. **Search System** - Full-text search, name search, location filtering

Each should be a separate PRP to maintain focus and one-pass implementation success.
