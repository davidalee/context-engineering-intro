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

---

## Pending Tasks (Next PRPs)

### Posting Content MVP PRP (Next)
- [ ] Execute posting-content-mvp.md PRP
- [ ] Content filtering service
- [ ] Auto-rewrite service (OpenAI)
- [ ] Post creation flow
- [ ] Inline tooltips

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

### Notes for Environment Setup
- Backend requires: DATABASE_URL, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, JUMIO_API_TOKEN, JUMIO_API_SECRET
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
