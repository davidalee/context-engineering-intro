# BetweenUs - Task Tracker

## Completed Tasks

### 2025-12-23 - PRP Generation
- [x] Generated project-scaffolding.md PRP
- [x] Generated authentication.md PRP
- [x] Generated posting-content-mvp.md PRP

### 2025-12-23 - Project Scaffolding (PRP Executed)
- [x] Created root workspace configuration (package.json)
- [x] Created base TypeScript configuration (tsconfig.base.json)
- [x] Updated .gitignore for monorepo
- [x] Created root linting configuration (.eslintrc.js, .prettierrc)
- [x] Created shared package structure with Zod schemas
- [x] Created backend package with Express + Drizzle
- [x] Created backend database configuration and schema
- [x] Created backend utilities (logger, response helpers)
- [x] Created backend middleware (error handling)
- [x] Created backend health check route
- [x] Created backend tests
- [x] Created frontend package with Expo
- [x] Configured Metro bundler for monorepo
- [x] Created frontend theme, components, screens, navigation
- [x] Created frontend tests
- [x] Updated README with setup instructions
- [x] Validated: yarn install, type-check passes

### 2025-12-23 - Authentication (PRP Executed)
- [x] Installed authentication dependencies (backend + frontend)
- [x] Created shared auth schemas (Zod) and types
- [x] Updated backend database schema with auth tables (profiles, userRoles, userVerificationStatus)
- [x] Created backend Supabase configuration
- [x] Created backend auth middleware (JWT validation + RBAC)
- [x] Created backend auth routes (/auth/verify-token, /auth/me, /auth/mfa/*)
- [x] Created backend Jumio and verification services
- [x] Created backend webhook routes (/webhooks/jumio)
- [x] Created frontend Supabase configuration with SecureStore adapter
- [x] Created frontend AuthContext with session management
- [x] Created frontend deep linking handler
- [x] Created frontend auth screens (Login, SignUp, MagicLink, MFAEnroll, MFAVerify)
- [x] Created frontend auth components (BiometricButton, QRCodeDisplay, SocialLoginButton)
- [x] Created frontend biometric service
- [x] Updated frontend navigation with protected routes
- [x] Validated: yarn type-check passes for all packages
- [ ] Create backend auth tests (deferred)
- [ ] Create frontend auth tests (deferred)

### 2025-12-23 - Posting Content MVP (PRP Executed)
- [x] Installed OpenAI dependency in backend
- [x] Added posts table to database schema (id, userId, originalText, rewrittenText, status, moderationFlags, triggerMatches)
- [x] Created shared post validation schemas (Zod) - createPostSchema, rewriteRequestSchema, analyzeContentSchema
- [x] Created trigger patterns utility with all 10 categories from INLINE_TOOLTIPS.md
- [x] Created brand voice utility with copy templates for OpenAI prompts and error messages
- [x] Created OpenAI configuration
- [x] Created content filter service (analyzeContent, hasBlockingContent, getMatchedCategories)
- [x] Created auto-rewrite service (generateRewrites with OpenAI GPT-4o-mini)
- [x] Created moderation service (moderateContent with OpenAI Moderation API)
- [x] Created validation middleware (validateRequest, validateQuery, validateParams)
- [x] Created posts service (createPost, getPostById, getPostsByUserId, updatePostWithRewrite, deletePost)
- [x] Created posts controller (handleCreatePost, handleGetPost, handleGetMyPosts, handleAnalyzeContent, handleRewriteRequest)
- [x] Created posts routes (/api/posts, /api/posts/:id, /api/posts/me, /api/posts/analyze, /api/posts/rewrite)
- [x] Created frontend API service (posts.service.ts with axios)
- [x] Created usePostValidation hook with debounced client-side pattern matching
- [x] Created InlineTooltip component (warning display with rewrite button)
- [x] Created RewriteSuggestion component (3 one-tap rewrite options)
- [x] Created ConfirmationChecklist component (3 required checkboxes)
- [x] Created PostForm component (full post creation flow)
- [x] Created PostCreationScreen
- [x] Updated navigation with PostCreation route
- [x] Validated: yarn type-check passes for all packages
- [ ] Create backend posts tests (deferred)
- [ ] Create frontend posts tests (deferred)

---

## Pending Tasks (Next PRPs)

### Identity Verification Integration PRP (Next)
- [ ] Jumio/Onfido API integration
- [ ] Selfie analysis
- [ ] Verification workflow

### Moderation Queue UI PRP
- [ ] Admin dashboard
- [ ] Human review workflow

---

## Discovered During Work

### Notes for Authentication PRP
- Backend structure already has middleware folder ready for auth
- Shared package ready for auth schemas
- Navigation structure ready for auth screens
- Fixed: Must use getUser() instead of getSession() for server-side JWT validation (security)
- Fixed: Frontend must use SecureStore, not AsyncStorage for tokens
- Added: Deep linking support for OAuth and email verification

### Notes for Frontend
- React Native 0.76+ with React 18.3
- Expo SDK 52
- Using @react-navigation/native-stack

### Notes for Posting Content MVP PRP
- 10 trigger categories from INLINE_TOOLTIPS.md implemented with regex patterns
- OpenAI GPT-4o-mini used for rewrites (cost-effective)
- OpenAI Moderation API (free) used for content flagging
- Posts store both originalText and rewrittenText for legal defensibility
- Client-side validation is lightweight (debounced), full validation on server
- Brand voice copy follows BRAND_VOICE_GUIDE.md (measured, not moralizing)

### Notes for Environment Setup
- Backend requires: DATABASE_URL, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, JUMIO_API_TOKEN, JUMIO_API_SECRET, OPENAI_API_KEY
- Frontend requires: EXPO_PUBLIC_API_URL, EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY

---

## Quick Reference

### Running the Project
```bash
# Install dependencies
yarn install

# Start backend (Terminal 1)
yarn workspace @betweenus/backend dev

# Start frontend (Terminal 2)
yarn workspace @betweenus/frontend dev
```

### Database Setup
```bash
# Create database
createdb betweenus

# Generate migrations
yarn workspace @betweenus/backend db:generate

# Run migrations
yarn workspace @betweenus/backend db:migrate
```
