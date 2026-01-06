# BetweenUs - Task Tracker

## Pending Tasks

### 2025-12-30 - PRP Generation
- [x] Generated content-moderation-privacy.md PRP (28 tasks, confidence 8/10) - PII anonymization, consent flow, ZDR application, audit logging

### Execute PRP: Content Moderation Privacy (Priority: High)
- [ ] Execute PRPs/content-moderation-privacy.md (28 tasks)
  - PII anonymization before OpenAI API calls
  - User consent management for AI moderation
  - Apply for OpenAI Zero Data Retention (PHI justification)
  - Privacy audit logging
  - Frontend consent screens and privacy badges

### Execute PRP: Moderation System (Priority: High)
- [ ] Execute PRPs/moderation-system.md (35 tasks)

### Generate PRP: Consider what types of posts are allowed (Priority: High)
- [ ] Reconsider the existing posting framework, voice guide, and inline tooltips
- [ ] Identify any gaps or ambiguities in current rules
- [ ] See this chat for some interesting borderline cases it raises, and different methods for mitigating them noted at the end of the response: https://chatgpt.com/g/g-p-694b12a0cad081919c75974c33a6560e-betweenus/c/695447c4-7d10-8332-a460-8d2a77d6c7c8

### Generate PRP: Create testing harness for content moderation (Priority: Medium)
- [ ] Test OpenAI's Moderation API with various content samples
- [ ] Create a suite of test cases covering edge cases and false positives
- [ ] Automate testing of moderation workflows
- [ ] Document testing procedures and results

### Generate PRP: Notifications PRP (Priority: Medium)
- [ ] Push notification infrastructure (Expo Push, Firebase)
- [ ] Name match alerts
- [ ] New comment notifications
- [ ] Moderation action notifications
- [ ] Notification preferences settings

### Generate PRP: Privacy & Security PRP (Priority: Medium)
- [ ] Screenshot blocking (react-native-screenshot-prevent)
- [ ] Screen recording prevention
- [ ] Secure view containers for sensitive content

### Generate PRP: Photo Upload PRP (Priority: Medium)
- [ ] Image upload on posts and comments
- [ ] Image storage (Supabase Storage or S3)
- [ ] Image compression and optimization
- [ ] NSFW image detection

### Generate PRP: Background Check Integration PRP (Priority: Low)
- [ ] Checkr/GoodHire API integration
- [ ] Sex offender registry lookup
- [ ] Paid feature gating (Stripe/RevenueCat)
- [ ] Results display UI

### Generate PRP: Real-time Updates PRP (Priority: Low)
- [ ] WebSocket infrastructure
- [ ] Live comment updates
- [ ] Real-time notifications
- [ ] Online presence indicators

### Generate PRP: Legal & Compliance PRP (Priority: Low)
- [ ] GDPR/CCPA compliance features
- [ ] Data export functionality
- [ ] Account deletion flow
- [ ] Data retention policies
- [ ] Terms of Service / Privacy Policy screens

### Create PLANNING.md Document
- [ ] Document overall project architecture, goals, style, and constraints
- [ ] Define naming conventions, file structure, and architecture patterns
- [ ] Outline testing strategies and reliability goals

### Add messaging around compliance and safety in the app
- [ ] Onboarding screens
- [ ] FAQ section
- [ ] In-app tips and reminders
- [ ] (TODO: REVISE THIS LIST) Comply with KYC, AML, CCPA, GDPR and many more privacy regulations and directives
- [ ] Data encryption at rest and in transit using industry-standard protocols
- [ ] Regular security audits and vulnerability assessments
- [ ] User data access controls and permissions management
- [ ] Incident response plan for data breaches or security incidents
- [ ] Employee training on data privacy and security best practices
- [ ] Clear data retention and deletion policies communicated to users
- [ ] Third-party vendor risk management for any integrated services
- [ ] Continuous monitoring of systems for suspicious activity or potential threats
- [ ] Compliance with international data transfer regulations (e.g., GDPR cross-border rules)
- [ ] Regular updates to privacy policies and terms of service to reflect current practices and legal requirements
- [ ] User-friendly mechanisms for users to manage their privacy settings and data preferences
- [ ] Accessibility features to ensure compliance with standards like WCAG for users with disabilities
- [ ] Implementation of multi-factor authentication (MFA) for enhanced account security
- [ ] Secure coding practices to prevent common vulnerabilities (e.g., OWASP Top 10)
- [ ] Data anonymization techniques for any analytics or research purposes
- [ ] Regular backups of user data with secure storage solutions
- [ ] Transparent communication with users regarding any changes to data practices or security measures
- [ ] Collaboration with legal experts to stay updated on evolving data protection laws and regulations
- [ ] Implementation of user consent mechanisms for data collection and processing activities
- [ ] All data is transmitted and stored with strong AES 256-bit encryption. Didit.me handles identity verification with AI-native fraud detection

### Generate PRP: Follow up with users on dates they've gone on
- [ ] Create a system to send follow-up messages to users after dates
  - [ ] Design message content to gather feedback on their experience with minimal friction
  - [ ] Based on users they've looked up? Or some other trigger?
  - We really want to incentivize users to share information about their dates to build out the database, but we also want to make it as easy and non-intrusive as possible. This could be a simple one-tap survey where we ask them how the date went, if they felt safe, etc. And all they have to do is click one of the pre-filled responses, no typing required. They always have the option to share more detail.
- [ ] Design message templates for feedback requests
- [ ] Implement scheduling logic for sending messages
- [ ] Track user responses and store feedback data

---

## Completed Tasks

### 2025-12-23 - PRP Generation
- [x] Generated project-scaffolding.md PRP
- [x] Generated authentication.md PRP
- [x] Generated posting-content-mvp.md PRP
- [x] Generated identity-verification-deep-integration.md PRP (Jumio - deprecated)

### 2025-12-24 - PRP Generation
- [x] Rewrote identity-verification-deep-integration.md PRP for Didit.me (replaces Jumio)
- [x] Generated dashboard.md PRP (16 tasks, confidence 8/10)
- [x] Generated search.md PRP (32 tasks, confidence 7/10) - PostgreSQL FTS, TinEye API, saved alerts
- [x] Generated moderation-system.md PRP (35 tasks, confidence 7/10) - reporting, queue, admin tools, audit logs, appeals

### 2025-12-24 - Identity Verification Deep Integration - Didit.me (PRP Executed)
- [x] PRP Generated: PRPs/identity-verification-deep-integration.md (v2.0 - Didit.me)

#### Backend Migration Tasks (Jumio → Didit.me)
**REUSE (no changes needed):**
- [x] Database schema (userVerificationStatus table) - statuses already compatible
- [x] Shared types (VerificationStatus) - already matches Didit statuses

**CREATE (new files):**
- [x] Create packages/backend/src/config/didit.ts (x-api-key auth pattern)
- [x] Create packages/backend/src/services/didit.service.ts (createSession, mapDiditStatus)
- [x] Create packages/backend/src/routes/verification.routes.ts (POST /, GET /status)
- [x] Create packages/shared/src/schemas/verification.schemas.ts (Zod schemas)

**MODIFY (update existing):**
- [x] Modify packages/backend/src/routes/webhooks.routes.ts (add /didit endpoint with timestamp validation)
- [x] Modify packages/backend/src/services/verification.service.ts (minor - already compatible)
- [x] Modify packages/backend/src/index.ts (mount /api/verification routes)

**CLEANUP (optional - after verified working):**
- [ ] Remove packages/backend/src/config/jumio.ts
- [ ] Remove packages/backend/src/services/jumio.service.ts
- [ ] Remove /jumio webhook endpoint from webhooks.routes.ts

#### Frontend Tasks (new implementation)
- [x] Install react-native-webview
- [x] Create packages/frontend/src/services/verification.service.ts
- [x] Create packages/frontend/src/screens/verification/VerificationIntroScreen.tsx
- [x] Create packages/frontend/src/screens/verification/VerificationWebViewScreen.tsx
- [x] Create packages/frontend/src/screens/verification/VerificationCompleteScreen.tsx
- [x] Create packages/frontend/src/screens/verification/index.ts (barrel export)
- [x] Create packages/frontend/src/components/verification/VerificationBadge.tsx
- [x] Create packages/frontend/src/components/verification/VerificationStatusCard.tsx
- [x] Create packages/frontend/src/components/verification/index.ts (barrel export)
- [x] Modify packages/frontend/src/contexts/AuthContext.tsx (add verificationStatus)
- [x] Modify packages/frontend/src/navigation/AppNavigator.tsx (add verification screens)
- [ ] Modify packages/frontend/src/utils/deepLinking.ts (handle Didit callbacks) - optional

#### Validation
- [x] yarn type-check passes for all packages
- [ ] Backend POST /api/verification returns verificationUrl (requires API key)
- [ ] Backend GET /api/verification/status returns current status (requires API key)
- [ ] Webhook signature verification works with Didit (requires webhook secret)
- [ ] Frontend WebView loads Didit verification UI (requires running backend)
- [ ] End-to-end flow works on physical device (requires Didit credentials)

### 2025-12-24 - Search (PRP Executed)
- [x] Created custom tsvector type for Drizzle ORM (packages/backend/src/utils/tsvector.ts)
- [x] Updated database schema: added subjectName, location to posts; created nameAlerts, pushTokens tables
- [x] Created shared types: search.types.ts, alert.types.ts
- [x] Created shared schemas: search.schemas.ts, alert.schemas.ts
- [x] Created TinEye configuration (packages/backend/src/config/tineye.ts)
- [x] Created search service with PostgreSQL full-text search (searchByName, searchByKeyword)
- [x] Created image search service with TinEye API integration
- [x] Created alerts service with 5-alert limit per user
- [x] Created push notification service (Expo Push API)
- [x] Created search controller (handleNameSearch, handleKeywordSearch, handleImageSearch)
- [x] Created alerts controller (handleCreateAlert, handleGetAlerts, handleDeleteAlert)
- [x] Created search routes (GET /api/search/name, GET /api/search/keyword, POST /api/search/image)
- [x] Created alerts routes (GET/POST /api/alerts, DELETE /api/alerts/:id)
- [x] Updated posts service to trigger alert check on publish
- [x] Created frontend search service and alerts service
- [x] Created useSearch and useAlerts hooks
- [x] Created search components: SearchBar, SearchTypeSelector, LocationFilter, ImageUploader, SearchResultCard, SaveAlertButton
- [x] Created search screens: SearchScreen, SearchResultsScreen, AlertsManageScreen
- [x] Updated navigation with Search, SearchResults, AlertsManage routes
- [x] Installed expo-image-picker for image upload
- [x] Validated: yarn type-check passes for all packages
- [ ] Run database migration (requires db:generate && db:migrate)
- [ ] Add rate limiting to search endpoints (deferred)
- [ ] Create backend/frontend tests (deferred)

### 2025-12-24 - Dashboard (PRP Executed)
- [x] Created dashboard screen structure
- [x] Created activity feed component with stubs
- [x] Created statistics component with server-side calculations
- [x] Integrated existing VerificationBadge component
- [x] Updated navigation to set Dashboard as initial route post-auth
- [x] Validated: yarn type-check passes for all packages
- [ ] Create backend dashboard tests (deferred)

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
- Backend requires: DATABASE_URL, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY
- Backend requires (Didit.me): DIDIT_API_KEY, DIDIT_WORKFLOW_ID, DIDIT_WEBHOOK_SECRET, API_URL
- Backend deprecated (Jumio): JUMIO_API_TOKEN, JUMIO_API_SECRET, JUMIO_DATACENTER, JUMIO_WEBHOOK_SECRET
- Frontend requires: EXPO_PUBLIC_API_URL, EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY

### Notes for Dashboard PRP
- Dashboard replaces HomeScreen as initial route after auth
- Reuses existing VerificationBadge component
- Activity feed has stubs for comments/alerts (implemented in Search/Moderation PRPs)
- Statistics calculated server-side

### Notes for Search PRP
- PostgreSQL full-text search requires custom tsvector type in Drizzle ORM
- Using to_tsvector/to_tsquery inline instead of generated columns (simpler migration)
- GIN index not added yet - may need manual SQL for performance at scale
- TinEye API: $200/5000 searches (starter), sandbox available for testing
- Saved alerts limited to 5 per user (free tier)
- Push notifications via Expo Push API
- Brand voice: "experiences" not "reports", "{count} people shared similar experiences"
- Search requires TINEYE_API_KEY env var for image search (optional feature)

### Notes for Moderation System PRP
- Audit logs are append-only (INSERT only, never UPDATE/DELETE)
- Appeals have 14-day window
- AI flagging threshold: >0.7 score → add to queue (not auto-remove)
- All moderation copy must follow BRAND_VOICE_GUIDE.md
- "We've paused this post" not "This violates our rules"

### Notes for Identity Verification Migration (Jumio → Didit.me)
- Didit.me uses simpler x-api-key header auth (vs Jumio's Basic Auth)
- Didit.me has 8 statuses that map to our 5: Not Started→pending, In Progress/In Review→processing, Approved→approved, Declined→denied, Expired/Abandoned/KYC Expired→error
- Webhook signature uses HMAC-SHA256 + timestamp validation (must validate within 5 minutes)
- CRITICAL: Use raw JSON body for HMAC verification, not re-stringified
- Existing verification.service.ts is mostly reusable (updateVerificationStatus works with both)
- Database schema already compatible - no migration needed
- Rate limits: Free plan = 5 sessions/minute, Paid = 600 sessions/minute
