name: "Authentication System - BetweenUs"
description: |
  Complete authentication implementation with Supabase Auth, identity verification,
  multi-factor authentication, OAuth providers, and role-based access control.

---

## Goal

Implement a comprehensive authentication system for BetweenUs that enables secure user registration, login, and identity verification while supporting multiple authentication methods (email/password, OAuth, magic links, biometrics) and role-based access control.

## Why

- **Security Foundation**: Authentication is the security backbone of the entire platform
- **User Trust**: Identity verification builds trust in the dating safety community
- **Multi-Layer Security**: 2FA and identity checks prevent sockpuppets and malicious actors
- **User Experience**: Multiple login options (OAuth, magic links, biometrics) reduce friction
- **Platform Integrity**: Role-based access control enables admin/moderator workflows

## What

Implement authentication with:
- Email/password registration with email verification
- OAuth social logins (Google, Facebook, Apple)
- Passwordless magic link authentication
- Two-factor authentication (TOTP authenticators)
- Biometric login (Face ID, Touch ID)
- Identity verification integration (Jumio - selfie + government ID)
- Role-based access control (admin, moderator, member)
- Secure session management with auto-refresh
- Protected routes (backend + frontend)

### Success Criteria

- [ ] User can sign up with email/password
- [ ] Email verification works with deep linking
- [ ] User can log in with Google, Facebook, Apple OAuth
- [ ] Magic link authentication works end-to-end
- [ ] User can enable 2FA with authenticator app
- [ ] Biometric login works on iOS (Face ID) and Android (fingerprint)
- [ ] Identity verification flow completes (Jumio integration)
- [ ] Role-based access control enforced server-side (RLS policies)
- [ ] Backend middleware validates JWT tokens correctly
- [ ] Frontend auth context manages session state
- [ ] Protected routes work on both backend and frontend
- [ ] All tests pass (unit + integration)
- [ ] Session persists across app restarts

---

## All Needed Context

### Documentation & References

```yaml
# Project Context
- file: /Users/wookiee/Code/BetweenUs/CLAUDE.md
  why: TypeScript conventions, file structure, testing requirements
  critical: Strict TypeScript, 2-space indent, max 500 LOC per file

- file: /Users/wookiee/Code/BetweenUs/docs/BRAND_VOICE_GUIDE.md
  why: Error messages and user-facing copy standards
  pattern: "Measured not moralizing" - applies to auth error messages

- file: /Users/wookiee/Code/BetweenUs/INITIAL.md
  why: Authentication requirements and features
  section: Authentication, Privacy/Security, Third-party integrations

# External Documentation - Supabase Auth
- url: https://supabase.com/docs/guides/auth
  why: Supabase Auth overview and core concepts
  critical: Session management, JWT structure, refresh tokens

- url: https://supabase.com/docs/guides/auth/auth-email
  why: Email/password authentication
  section: Sign up, Sign in, Email verification

- url: https://supabase.com/docs/guides/auth/social-login
  why: OAuth provider setup (Google, Facebook, Apple)
  critical: Platform-specific configurations, redirect URIs

- url: https://supabase.com/docs/guides/auth/auth-magic-link
  why: Passwordless magic link authentication
  critical: Deep linking requirements, OTP fallback

- url: https://supabase.com/docs/guides/auth/auth-mfa
  why: Multi-factor authentication (TOTP)
  section: Enrollment, Challenge, Verification

- url: https://supabase.com/docs/guides/auth/server-side/creating-a-client
  why: Server-side auth (Express middleware)
  critical: Use getUser() not getSession() for security

- url: https://supabase.com/docs/guides/auth/row-level-security
  why: Row Level Security for RBAC
  section: Custom claims, Auth hooks, Policies

# External Documentation - React Native
- url: https://docs.expo.dev/guides/authentication/
  why: Expo authentication patterns
  section: Session storage, Deep linking

- url: https://docs.expo.dev/versions/latest/sdk/local-authentication/
  why: Biometric authentication (Face ID, Touch ID)
  critical: Requires development build, not Expo Go

- url: https://docs.expo.dev/versions/latest/sdk/securestore/
  why: Secure token storage
  critical: Use for refresh tokens, supports biometric requirement

- url: https://docs.expo.dev/guides/linking/
  why: Deep linking configuration
  critical: Essential for email verification and OAuth

# External Documentation - Identity Verification
- url: https://github.com/Jumio/mobile-react
  why: Jumio React Native SDK
  section: Installation, Configuration, Usage

- url: https://jumio.github.io/kyx/integration-guide.html
  why: Jumio integration guide
  section: Workflow API, Webhooks, Document types

# Code Examples
- file: /Users/wookiee/Code/BetweenUs/use-cases/mcp-server/examples/database-tools.ts
  why: Zod validation patterns for API requests
  pattern: Schema-based validation, error handling

- file: /Users/wookiee/Code/BetweenUs/use-cases/mcp-server/src/types.ts
  why: TypeScript type definitions
  pattern: Branded types, utility types
```

### Current Codebase State

```bash
BetweenUs/
├── backend/          # Scaffolded (project-scaffolding PRP)
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── db/
│   │   │   └── schema.ts
│   │   ├── middleware/
│   │   │   └── error.middleware.ts
│   │   ├── routes/
│   │   │   └── health.routes.ts
│   │   └── index.ts
│   └── package.json
├── frontend/         # Scaffolded (project-scaffolding PRP)
│   ├── src/
│   │   ├── screens/
│   │   │   └── HomeScreen.tsx
│   │   ├── navigation/
│   │   │   └── AppNavigator.tsx
│   │   └── App.tsx
│   └── package.json
└── shared/           # Scaffolded
    └── src/
        ├── schemas/
        └── types/
└── docs/                 # Existing documentation
```

### Desired Codebase Tree (Authentication Added)

```bash
BetweenUs/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts        # Existing
│   │   │   ├── supabase.ts        # NEW - Supabase client (service role)
│   │   │   └── jumio.ts           # NEW - Jumio API client
│   │   ├── db/
│   │   │   ├── schema.ts          # UPDATE - Add profiles, user_roles, verification tables
│   │   │   ├── migrations/        # NEW - Auth tables migration
│   │   │   └── functions/         # NEW - RLS functions (authorize, custom_access_token_hook)
│   │   ├── middleware/
│   │   │   ├── error.middleware.ts # Existing
│   │   │   ├── auth.middleware.ts # NEW - JWT verification
│   │   │   └── rbac.middleware.ts # NEW - Role-based access control
│   │   ├── routes/
│   │   │   ├── health.routes.ts   # Existing
│   │   │   ├── auth.routes.ts     # NEW - Auth endpoints
│   │   │   └── webhooks.routes.ts # NEW - Jumio webhooks
│   │   ├── services/
│   │   │   ├── jumio.service.ts   # NEW - Jumio API integration
│   │   │   └── verification.service.ts # NEW - Verification logic
│   │   └── utils/
│   │       └── auth.utils.ts      # NEW - JWT helpers, role checks
│   └── tests/
│       ├── integration/
│       │   ├── auth.test.ts       # NEW - Auth endpoints
│       │   └── webhooks.test.ts   # NEW - Webhook handling
│       └── unit/
│           └── auth.middleware.test.ts # NEW
│
├── frontend/
│   ├── src/
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx    # NEW - Auth state management
│   │   ├── lib/
│   │   │   └── supabase.ts        # NEW - Supabase client (anon key)
│   │   ├── screens/
│   │   │   ├── auth/              # NEW
│   │   │   │   ├── LoginScreen.tsx
│   │   │   │   ├── SignUpScreen.tsx
│   │   │   │   ├── MagicLinkScreen.tsx
│   │   │   │   ├── MFAEnrollScreen.tsx
│   │   │   │   ├── MFAVerifyScreen.tsx
│   │   │   │   └── VerificationScreen.tsx
│   │   │   └── HomeScreen.tsx     # Existing
│   │   ├── navigation/
│   │   │   └── AppNavigator.tsx   # UPDATE - Protected routes
│   │   ├── components/
│   │   │   ├── auth/              # NEW
│   │   │   │   ├── SocialLoginButton.tsx
│   │   │   │   ├── BiometricButton.tsx
│   │   │   │   └── QRCodeDisplay.tsx
│   │   │   └── Text.tsx           # Existing
│   │   ├── services/
│   │   │   ├── jumio.service.ts   # NEW - Jumio SDK integration
│   │   │   └── biometrics.service.ts # NEW - Biometric helpers
│   │   ├── utils/
│   │   │   └── deepLinking.ts     # NEW - Deep link handling
│   │   └── App.tsx                # UPDATE - Wrap with AuthProvider
│   └── tests/
│       └── components/
│           └── auth/              # NEW - Component tests
│               ├── LoginScreen.test.tsx
│               └── AuthContext.test.tsx
│
└── shared/
    └── src/
        ├── schemas/
        │   ├── auth.schema.ts     # NEW - Auth request/response schemas
        │   └── user.schema.ts     # NEW - User profile schemas
        └── types/
            └── auth.types.ts      # NEW - Auth type definitions
```

### Known Gotchas & Library Quirks

```typescript
// CRITICAL 1: Server-side auth validation
// ❌ NEVER use getSession() on server - doesn't validate with auth server
const { data: { session } } = await supabase.auth.getSession()

// ✅ ALWAYS use getUser() - validates JWT with auth server
const { data: { user } } = await supabase.auth.getUser(token)

// CRITICAL 2: Supabase storage adapter for React Native
// MUST use Expo SecureStore, NOT AsyncStorage for production
import * as SecureStore from 'expo-secure-store'

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
}

const supabase = createClient(url, key, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // IMPORTANT for mobile
  },
})

// CRITICAL 3: Deep linking configuration required for production
// Email verification and OAuth REQUIRE deep linking to work
// Configure app.json:
{
  "expo": {
    "scheme": "betweenus",
    "ios": {
      "associatedDomains": ["applinks:betweenus.com"]
    }
  }
}

// CRITICAL 4: OAuth redirect URIs must match exactly
// Supabase dashboard: https://<project-id>.supabase.co/auth/v1/callback
// Google Cloud Console: Same URL
// During development with tunnel: Update both with ngrok URL

// CRITICAL 5: Magic link email scanner issue
// Enterprise email scanners may click links before users
// Solution: Expose OTP in email template with {{ .Token }}
// Provide "Enter Code" fallback screen

// CRITICAL 6: Biometric authentication requires development build
// Face ID/Touch ID DOES NOT WORK in Expo Go
// Must create development build: npx expo run:ios
// Configure NSFaceIDUsageDescription in app.json

// CRITICAL 7: RLS policies - use app_metadata, NEVER user_metadata
// ❌ DON'T use user_metadata in RLS (user can modify)
WHERE (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'

// ✅ DO use app_metadata or custom claims from auth hook
WHERE (auth.jwt() -> 'user_role')::text = 'admin'

// CRITICAL 8: Jumio SDK platform-specific installation
// iOS: Requires pod install + NSCameraUsageDescription
// Android: Requires multiDexEnabled + buildToolsVersion 33.0.0
// React Native: Install from GitHub, not npm

// CRITICAL 9: Service role key exposure
// ❌ NEVER use service role key on frontend
EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=xxx  // SECURITY BREACH

// ✅ Only use anon key on frontend
EXPO_PUBLIC_SUPABASE_ANON_KEY=xxx

// Service role key ONLY on backend (bypasses RLS)

// CRITICAL 10: Token refresh in background
// React Native apps lose token refresh when backgrounded
import { AppState } from 'react-native'

AppState.addEventListener('change', (nextAppState) => {
  if (nextAppState === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

// CRITICAL 11: MFA AAL downgrade timing
// Unenrolling MFA factor doesn't downgrade AAL until token refresh
// Call refreshSession() immediately after unenrolling:
await supabase.auth.mfa.unenroll({ factorId })
await supabase.auth.refreshSession()  // Force AAL downgrade

// CRITICAL 12: Webhook signature verification
// Always verify Jumio webhook signatures before processing
const signature = req.headers['x-jumio-signature']
// Verify against HMAC of request body with secret
```

---

## Implementation Blueprint

### Data Models and Structure

```typescript
// packages/shared/src/schemas/auth.schema.ts
import { z } from 'zod'

export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[a-z]/, 'Password must contain lowercase letter')
    .regex(/[0-9]/, 'Password must contain number'),
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
})

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password required'),
})

export const magicLinkSchema = z.object({
  email: z.string().email(),
})

export const verifyOtpSchema = z.object({
  email: z.string().email(),
  token: z.string().length(6, 'OTP must be 6 digits'),
})

export const mfaEnrollSchema = z.object({
  factorType: z.enum(['totp', 'phone']),
  friendlyName: z.string().optional(),
  phone: z.string().optional(),
})

export const mfaVerifySchema = z.object({
  factorId: z.string().uuid(),
  challengeId: z.string().uuid(),
  code: z.string().length(6),
})

export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type MagicLinkInput = z.infer<typeof magicLinkSchema>
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>
export type MFAEnrollInput = z.infer<typeof mfaEnrollSchema>
export type MFAVerifyInput = z.infer<typeof mfaVerifySchema>
```

```typescript
// packages/backend/src/db/schema.ts - Auth Tables

import { pgTable, uuid, text, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core'

// User role enum
export const appRoleEnum = pgEnum('app_role', ['admin', 'moderator', 'member'])

// Verification status enum
export const verificationStatusEnum = pgEnum('verification_status', [
  'pending',
  'processing',
  'approved',
  'denied',
  'error'
])

// Profiles table (extends auth.users)
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(), // Matches auth.users.id
  email: text('email').unique().notNull(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  isVerified: boolean('is_verified').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// User roles table
export const userRoles = pgTable('user_roles', {
  userId: uuid('user_id').primaryKey(), // FK to auth.users
  role: appRoleEnum('role').default('member').notNull(),
  assignedBy: uuid('assigned_by'), // FK to auth.users
  assignedAt: timestamp('assigned_at').defaultNow().notNull(),
})

// Verification status table
export const userVerificationStatus = pgTable('user_verification_status', {
  userId: uuid('user_id').primaryKey(), // FK to auth.users
  status: verificationStatusEnum('status').default('pending').notNull(),
  provider: text('provider'), // 'jumio' or 'onfido'
  verifiedAt: timestamp('verified_at'),
  idType: text('id_type'), // 'passport', 'drivers_license', etc.
  idCountry: text('id_country'), // ISO 2-letter country code
  rejectReason: text('reject_reason'),
  transactionReference: text('transaction_reference').unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type Profile = typeof profiles.$inferSelect
export type NewProfile = typeof profiles.$inferInsert
export type UserRole = typeof userRoles.$inferSelect
export type VerificationStatus = typeof userVerificationStatus.$inferSelect
```

```sql
-- packages/backend/src/db/functions/custom_access_token_hook.sql
-- Custom Access Token Hook - Adds role to JWT claims

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  claims jsonb;
  user_role text;
BEGIN
  -- Fetch user role from user_roles table
  SELECT role INTO user_role
  FROM public.user_roles
  WHERE user_id = (event->>'user_id')::uuid;

  -- If no role found, default to 'member'
  IF user_role IS NULL THEN
    user_role := 'member';
  END IF;

  -- Add role to JWT claims
  claims := event->'claims';
  claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));

  -- Update event with new claims
  event := jsonb_set(event, '{claims}', claims);

  RETURN event;
END;
$$;

-- Grant execute permission to Supabase
GRANT EXECUTE ON FUNCTION public.custom_access_token_hook TO supabase_auth_admin;
```

```sql
-- packages/backend/src/db/functions/authorize.sql
-- Authorization helper for RLS policies

CREATE OR REPLACE FUNCTION public.authorize(
  requested_permission text
)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  user_role text;
BEGIN
  -- Get role from JWT custom claims
  user_role := (auth.jwt() -> 'user_role')::text;

  -- Remove quotes if present
  user_role := trim(both '"' from user_role);

  -- Admin has all permissions
  IF user_role = 'admin' THEN
    RETURN true;
  END IF;

  -- Moderator permissions
  IF user_role = 'moderator' THEN
    RETURN requested_permission IN (
      'posts.edit',
      'posts.delete',
      'content.moderate',
      'users.warn'
    );
  END IF;

  -- Member permissions
  IF user_role = 'member' THEN
    RETURN requested_permission IN (
      'posts.create',
      'posts.edit_own'
    );
  END IF;

  RETURN false;
END;
$$;
```

### List of Tasks (in order)

```yaml
Task 1: Install authentication dependencies
  - BACKEND: @supabase/supabase-js, jsonwebtoken, @types/jsonwebtoken
  - FRONTEND: @supabase/supabase-js, @react-native-async-storage/async-storage, expo-secure-store
  - FRONTEND: expo-local-authentication, expo-linking, expo-web-browser
  - FRONTEND: @react-navigation/native (if not already installed)
  - FRONTEND: Jumio SDK from GitHub (https://github.com/Jumio/mobile-react.git#v4.15.0)
  - RUN npm install from root

Task 2: Create authentication database schema
  - CREATE migration for profiles, user_roles, user_verification_status tables
  - CREATE custom_access_token_hook function
  - CREATE authorize function
  - CREATE RLS policies for all auth tables
  - CREATE indexes for performance
  - CREATE updated_at triggers
  - RUN migration

Task 3: Configure Supabase custom access token hook
  - LOG IN to Supabase Dashboard
  - NAVIGATE to Authentication > Hooks
  - SELECT "Custom Access Token" hook
  - ENABLE hook pointing to public.custom_access_token_hook
  - VERIFY hook is active

Task 4: Create shared auth schemas
  - CREATE packages/shared/src/schemas/auth.schema.ts
    - DEFINE signUpSchema, signInSchema, magicLinkSchema
    - DEFINE mfaEnrollSchema, mfaVerifySchema
    - EXPORT types
  - CREATE packages/shared/src/types/auth.types.ts
    - DEFINE AuthUser, AuthSession, UserRole types
  - UPDATE packages/shared/src/index.ts exports

Task 5: Create backend Supabase config
  - CREATE packages/backend/src/config/supabase.ts
    - IMPORT @supabase/supabase-js
    - CREATE client with SERVICE_ROLE_KEY
    - EXPORT supabase instance
  - UPDATE packages/backend/.env.example with Supabase vars

Task 6: Create backend auth middleware
  - CREATE packages/backend/src/middleware/auth.middleware.ts
    - IMPLEMENT authenticateUser middleware
      - EXTRACT JWT from Authorization header
      - CALL supabase.auth.getUser(token) // CRITICAL: NOT getSession()
      - ATTACH user to req.user
      - HANDLE errors with 401
  - CREATE packages/backend/src/middleware/rbac.middleware.ts
    - IMPLEMENT requireRole(role) middleware factory
      - DECODE JWT to get user_role claim
      - CHECK if user has required role
      - RETURN 403 if insufficient permissions
  - EXPORT both middleware

Task 7: Create backend auth routes
  - CREATE packages/backend/src/routes/auth.routes.ts
    - POST /auth/verify-token (verify if token is valid)
    - GET /auth/me (get current user profile)
    - POST /auth/mfa/enroll (enroll MFA factor)
    - POST /auth/mfa/verify (verify MFA challenge)
    - GET /auth/mfa/factors (list enrolled factors)
    - DELETE /auth/mfa/unenroll/:factorId (unenroll factor)
  - MOUNT routes in packages/backend/src/index.ts

Task 8: Create Jumio service
  - CREATE packages/backend/src/config/jumio.ts
    - CONFIGURE Jumio API client
    - EXPORT API base URL, auth headers
  - CREATE packages/backend/src/services/jumio.service.ts
    - IMPLEMENT initiateVerification(userId, email) → authorizationToken
    - CALL Jumio Workflow API to create transaction
    - STORE transaction reference in user_verification_status
    - RETURN authorization token for SDK

Task 9: Create verification service
  - CREATE packages/backend/src/services/verification.service.ts
    - IMPLEMENT updateVerificationStatus(transactionRef, status, data)
    - UPDATE user_verification_status table
    - UPDATE profiles.is_verified if approved
    - SEND notification to user (future: email/push)

Task 10: Create webhook routes
  - CREATE packages/backend/src/routes/webhooks.routes.ts
    - POST /webhooks/jumio (Jumio callback)
      - VERIFY webhook signature
      - EXTRACT verification result
      - CALL verification.service.updateVerificationStatus()
      - RETURN 200 OK
  - MOUNT routes in packages/backend/src/index.ts

Task 11: Create backend auth utilities
  - CREATE packages/backend/src/utils/auth.utils.ts
    - IMPLEMENT decodeJWT(token) → claims
    - IMPLEMENT getUserRole(userId) → role
    - IMPLEMENT checkPermission(userId, permission) → boolean
  - EXPORT utilities

Task 12: Create backend auth tests
  - CREATE packages/backend/tests/integration/auth.test.ts
    - TEST POST /auth/verify-token with valid token
    - TEST POST /auth/verify-token with invalid token
    - TEST GET /auth/me returns user profile
    - TEST MFA enrollment flow
    - TEST MFA verification flow
  - CREATE packages/backend/tests/unit/auth.middleware.test.ts
    - TEST authenticateUser middleware
    - TEST requireRole middleware

Task 13: Create frontend Supabase config
  - CREATE packages/frontend/src/lib/supabase.ts
    - IMPORT createClient from @supabase/supabase-js
    - CREATE ExpoSecureStoreAdapter
    - CREATE supabase client with ANON_KEY
    - CONFIGURE auth.storage, autoRefreshToken, persistSession
    - EXPORT supabase instance
  - UPDATE packages/frontend/.env.example

Task 14: Create auth context
  - CREATE packages/frontend/src/contexts/AuthContext.tsx
    - CREATE AuthContext with session, user, profile, isLoading
    - IMPLEMENT AuthProvider component
      - GET initial session on mount
      - LISTEN to onAuthStateChange
      - FETCH user profile when authenticated
      - HANDLE token refresh
    - EXPORT useAuth hook
  - WRAP App.tsx with AuthProvider

Task 15: Create deep linking handler
  - CREATE packages/frontend/src/utils/deepLinking.ts
    - IMPLEMENT handleDeepLink(url)
      - PARSE URL for auth callback
      - CALL supabase.auth.getSessionFromUrl(url)
      - HANDLE email verification
      - HANDLE OAuth callback
  - INTEGRATE with App.tsx
    - USE Linking.addEventListener
    - CALL handleDeepLink on URL events

Task 16: Configure deep linking in app.json
  - UPDATE packages/frontend/app.json
    - ADD scheme: "betweenus"
    - ADD associatedDomains for iOS
    - ADD intentFilters for Android
  - DOCUMENT deep link URLs in README

Task 17: Create sign-up screen
  - CREATE packages/frontend/src/screens/auth/SignUpScreen.tsx
    - FORM: email, password, fullName inputs
    - VALIDATE with signUpSchema
    - CALL supabase.auth.signUp()
    - HANDLE email verification prompt
    - NAVIGATE to email verification screen
  - STYLE with brand voice

Task 18: Create login screen
  - CREATE packages/frontend/src/screens/auth/LoginScreen.tsx
    - FORM: email, password inputs
    - VALIDATE with signInSchema
    - CALL supabase.auth.signInWithPassword()
    - CHECK if MFA required (list factors)
    - IF MFA: navigate to MFAVerifyScreen
    - ELSE: navigate to HomeScreen
  - ADD magic link button
  - ADD social login buttons

Task 19: Create social login component
  - CREATE packages/frontend/src/components/auth/SocialLoginButton.tsx
    - PROPS: provider ('google', 'facebook', 'apple')
    - IMPLEMENT handleSocialLogin()
      - CALL supabase.auth.signInWithOAuth({ provider })
      - OPEN OAuth URL with WebBrowser
    - RENDER provider-specific button UI

Task 20: Create magic link screen
  - CREATE packages/frontend/src/screens/auth/MagicLinkScreen.tsx
    - FORM: email input
    - CALL supabase.auth.signInWithOtp({ email })
    - SHOW "Check your email" message
    - ADD "Enter code manually" button
    - IF manual: show OTP input (6 digits)
    - CALL supabase.auth.verifyOtp({ email, token })

Task 21: Create MFA enrollment screen
  - CREATE packages/frontend/src/screens/auth/MFAEnrollScreen.tsx
    - CALL supabase.auth.mfa.enroll({ factorType: 'totp' })
    - DISPLAY QR code from response
    - SHOW secret for manual entry
    - FORM: verification code input
    - CALL supabase.auth.mfa.verify({ factorId, code })
    - ON SUCCESS: navigate to home

Task 22: Create MFA verification screen
  - CREATE packages/frontend/src/screens/auth/MFAVerifyScreen.tsx
    - RECEIVE factorId from navigation params
    - CALL supabase.auth.mfa.challenge({ factorId })
    - FORM: 6-digit code input
    - CALL supabase.auth.mfa.verify({ factorId, challengeId, code })
    - ON SUCCESS: update auth context, navigate home

Task 23: Create QR code component
  - CREATE packages/frontend/src/components/auth/QRCodeDisplay.tsx
    - INSTALL react-native-qrcode-svg
    - PROPS: qrCode (data URL or text)
    - RENDER QR code with styling
    - SHOW "Scan with authenticator app" instructions

Task 24: Create biometric service
  - CREATE packages/frontend/src/services/biometrics.service.ts
    - IMPLEMENT checkBiometricSupport() → boolean
    - IMPLEMENT authenticateWithBiometrics() → boolean
    - IMPLEMENT enableBiometricLogin(userId, refreshToken)
      - STORE refresh token in SecureStore with requireAuthentication
    - IMPLEMENT loginWithBiometrics() → session
      - AUTHENTICATE with LocalAuthentication
      - RETRIEVE refresh token from SecureStore
      - CALL supabase.auth.setSession({ refresh_token })

Task 25: Create biometric button component
  - CREATE packages/frontend/src/components/auth/BiometricButton.tsx
    - CHECK biometric support on mount
    - IF supported: render button
    - ON PRESS: call biometrics.service.loginWithBiometrics()
    - HANDLE success/error

Task 26: Create Jumio service (frontend)
  - CREATE packages/frontend/src/services/jumio.service.ts
    - IMPLEMENT initiateVerification() → void
      - CALL backend API to get authorization token
      - INITIALIZE Jumio SDK with token
      - START verification flow
      - LISTEN to EventResult and EventError
      - SEND result to backend

Task 27: Create verification screen
  - CREATE packages/frontend/src/screens/auth/VerificationScreen.tsx
    - SHOW "Verify your identity" instructions
    - BUTTON: "Start verification"
    - ON PRESS: call jumio.service.initiateVerification()
    - HANDLE success/error from SDK events
    - ON SUCCESS: update profile, navigate to home

Task 28: Update navigation with protected routes
  - UPDATE packages/frontend/src/navigation/AppNavigator.tsx
    - USE useAuth hook
    - IF isLoading: render SplashScreen
    - IF isLoggedIn: render authenticated stack (HomeScreen, etc.)
    - ELSE: render auth stack (LoginScreen, SignUpScreen, etc.)

Task 29: Handle app state changes for token refresh
  - UPDATE packages/frontend/src/App.tsx
    - IMPORT AppState from react-native
    - ADD AppState listener
    - ON active: supabase.auth.startAutoRefresh()
    - ON background/inactive: supabase.auth.stopAutoRefresh()

Task 30: Create auth tests (frontend)
  - CREATE packages/frontend/tests/components/auth/AuthContext.test.tsx
    - MOCK Supabase client
    - TEST AuthProvider initializes correctly
    - TEST session state updates on login
    - TEST signOut clears session
  - CREATE packages/frontend/tests/components/auth/LoginScreen.test.tsx
    - TEST form validation
    - TEST successful login
    - TEST error handling

Task 31: Update README with auth setup
  - DOCUMENT Supabase setup steps
  - DOCUMENT OAuth provider configuration
  - DOCUMENT Jumio account setup
  - DOCUMENT deep linking configuration
  - DOCUMENT environment variables

Task 32: Final validation
  - RUN npm install (root)
  - RUN npm run type-check:all
  - RUN npm run lint:all
  - RUN npm run test:all
  - START backend server
  - START frontend app
  - TEST complete sign-up flow
  - TEST email verification
  - TEST OAuth login (Google)
  - TEST magic link authentication
  - TEST MFA enrollment and verification
  - TEST biometric login
  - TEST identity verification (Jumio)
  - TEST protected routes
  - VERIFY RLS policies work
```

### Per-Task Pseudocode (Critical Tasks Only)

```typescript
// Task 6: Auth Middleware Pseudocode
// packages/backend/src/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from 'express'
import { supabase } from '../config/supabase'

interface AuthRequest extends Request {
  user?: any
}

export const authenticateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // STEP 1: Extract Authorization header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'No authorization token provided. Please log in to continue.'
      })
    }

    const token = authHeader.split(' ')[1]

    // STEP 2: Validate token with Supabase auth server
    // CRITICAL: Use getUser() NOT getSession()
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return res.status(401).json({
        error: 'Your session has expired. Please log in again.'
      })
    }

    // STEP 3: Attach user to request object
    req.user = user

    // STEP 4: Continue to next middleware
    next()
  } catch (error) {
    console.error('Authentication error:', error)
    res.status(500).json({
      error: 'We encountered an issue verifying your identity. Please try again.'
    })
  }
}

// Task 14: Auth Context Pseudocode
// packages/frontend/src/contexts/AuthContext.tsx

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  session: Session | null
  user: any | null
  profile: any | null
  isLoading: boolean
  isLoggedIn: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // STEP 1: Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        fetchProfile(session.user.id)
      }
      setIsLoading(false)
    })

    // STEP 2: Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event)
        setSession(session)

        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }

        if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed successfully')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (data) {
      setProfile(data)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setProfile(null)
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        isLoading,
        isLoggedIn: !!session,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

// Task 24: Biometric Service Pseudocode
// packages/frontend/src/services/biometrics.service.ts

import * as LocalAuthentication from 'expo-local-authentication'
import * as SecureStore from 'expo-secure-store'
import { supabase } from '@/lib/supabase'

export class BiometricsService {
  async checkBiometricSupport(): Promise<boolean> {
    const hasHardware = await LocalAuthentication.hasHardwareAsync()
    const isEnrolled = await LocalAuthentication.isEnrolledAsync()
    return hasHardware && isEnrolled
  }

  async authenticateWithBiometrics(): Promise<boolean> {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to continue',
      disableDeviceFallback: false,
      cancelLabel: 'Cancel',
    })

    return result.success
  }

  async enableBiometricLogin(userId: string): Promise<void> {
    // STEP 1: Check support
    const supported = await this.checkBiometricSupport()
    if (!supported) {
      throw new Error('Biometric authentication not available')
    }

    // STEP 2: Get current session
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.refresh_token) {
      throw new Error('No active session')
    }

    // STEP 3: Store refresh token with biometric protection
    await SecureStore.setItemAsync(
      `biometric_token_${userId}`,
      session.refresh_token,
      { requireAuthentication: true }
    )

    await SecureStore.setItemAsync('biometric_enabled', 'true')
    await SecureStore.setItemAsync('last_user_id', userId)
  }

  async loginWithBiometrics(): Promise<Session | null> {
    // STEP 1: Check if enabled
    const enabled = await SecureStore.getItemAsync('biometric_enabled')
    if (enabled !== 'true') {
      return null
    }

    const userId = await SecureStore.getItemAsync('last_user_id')
    if (!userId) {
      return null
    }

    // STEP 2: Authenticate with biometrics
    const authenticated = await this.authenticateWithBiometrics()
    if (!authenticated) {
      return null
    }

    // STEP 3: Retrieve refresh token (requires biometric)
    const refreshToken = await SecureStore.getItemAsync(
      `biometric_token_${userId}`,
      { requireAuthentication: true }
    )

    if (!refreshToken) {
      throw new Error('Biometric login expired')
    }

    // STEP 4: Refresh session
    const { data, error } = await supabase.auth.setSession({
      access_token: '',
      refresh_token: refreshToken,
    })

    if (error) {
      throw error
    }

    return data.session
  }
}

export const biometricsService = new BiometricsService()
```

### Integration Points

```yaml
DATABASE:
  - Migration: CREATE profiles, user_roles, user_verification_status tables
  - Migration: CREATE custom_access_token_hook function
  - Migration: CREATE authorize function
  - Migration: CREATE RLS policies
  - Index: profiles.email, user_roles.role, user_verification_status.status

SUPABASE_DASHBOARD:
  - Enable email provider (Authentication > Providers)
  - Enable Google OAuth (add client ID/secret)
  - Enable Facebook OAuth (add app ID/secret)
  - Enable Apple OAuth (add service ID)
  - Configure Custom Access Token hook
  - Set redirect URLs for OAuth
  - Configure email templates (add {{ .Token }} for OTP)

GOOGLE_CLOUD_CONSOLE:
  - Create OAuth 2.0 credentials
  - Add authorized redirect URIs: https://<project-id>.supabase.co/auth/v1/callback
  - Add authorized JavaScript origins

FACEBOOK_DEVELOPERS:
  - Create Facebook App
  - Add OAuth redirect URIs
  - Get App ID and App Secret

APPLE_DEVELOPER:
  - Create Service ID
  - Configure Sign in with Apple
  - Add redirect URIs

JUMIO:
  - Create Jumio account
  - Get API token and secret
  - Configure webhook URL: https://<backend-url>/webhooks/jumio
  - Select data center (US/EU/SG)

ENVIRONMENT_VARIABLES:
  Backend (.env):
    - SUPABASE_URL=https://xxx.supabase.co
    - SUPABASE_SERVICE_ROLE_KEY=xxx
    - SUPABASE_ANON_KEY=xxx
    - JUMIO_API_TOKEN=xxx
    - JUMIO_API_SECRET=xxx
    - JUMIO_DATACENTER=US
    - CORS_ORIGIN=betweenus://

  Frontend (.env):
    - EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
    - EXPO_PUBLIC_SUPABASE_ANON_KEY=xxx
    - EXPO_PUBLIC_GOOGLE_CLIENT_ID=xxx
    - EXPO_PUBLIC_APPLE_SERVICE_ID=xxx
```

---

## Validation Loop

### Level 1: Database Setup

```bash
# Generate migration
npm run db:generate --workspace=packages/backend

# Expected: New migration file with profiles, user_roles, verification tables

# Run migration
npm run db:migrate --workspace=packages/backend

# Verify tables created
psql betweenus -c "\dt"
# Should see: profiles, user_roles, user_verification_status

# Verify functions created
psql betweenus -c "\df public.custom_access_token_hook"
psql betweenus -c "\df public.authorize"
```

### Level 2: TypeScript & Linting

```bash
# Type check all packages
npm run type-check:all

# Expected: No type errors

# Lint all code
npm run lint:all

# Expected: No linting errors
```

### Level 3: Backend Unit Tests

```bash
cd packages/backend
npm test -- tests/unit/auth.middleware.test.ts

# Expected tests:
# ✓ authenticateUser rejects missing token
# ✓ authenticateUser rejects invalid token
# ✓ authenticateUser accepts valid token
# ✓ requireRole allows admin to access all routes
# ✓ requireRole blocks member from moderator routes
```

### Level 4: Backend Integration Tests

```bash
cd packages/backend
npm test -- tests/integration/auth.test.ts

# Expected tests:
# ✓ POST /auth/verify-token returns 200 for valid token
# ✓ POST /auth/verify-token returns 401 for invalid token
# ✓ GET /auth/me returns user profile when authenticated
# ✓ POST /auth/mfa/enroll returns QR code
# ✓ POST /auth/mfa/verify returns success
# ✓ POST /webhooks/jumio updates verification status
```

### Level 5: Frontend Component Tests

```bash
cd packages/frontend
npm test -- tests/components/auth/

# Expected tests:
# ✓ AuthContext initializes with loading state
# ✓ AuthContext sets session on successful login
# ✓ LoginScreen renders form correctly
# ✓ LoginScreen calls signInWithPassword on submit
# ✓ LoginScreen shows error on invalid credentials
```

### Level 6: Manual E2E Testing

```bash
# Terminal 1: Start backend
npm run dev:backend

# Terminal 2: Start frontend
npm run dev:frontend

# IMPORTANT: For biometric testing, create development build:
cd packages/frontend
npx expo run:ios  # or npx expo run:android

# Test Flow 1: Email/Password Sign-Up
1. Open app in simulator
2. Tap "Sign Up"
3. Enter: email, password, full name
4. Tap "Create Account"
   - VERIFY: "Check your email" message appears
5. Open Supabase Inbucket (dev) or email
6. Click verification link
   - VERIFY: App opens via deep link
   - VERIFY: User logged in, redirected to HomeScreen

# Test Flow 2: Google OAuth Login
1. Tap "Sign in with Google"
   - VERIFY: Browser opens with Google login
2. Select Google account
   - VERIFY: Redirect back to app
   - VERIFY: User logged in

# Test Flow 3: Magic Link
1. Tap "Sign in with email"
2. Enter email address
3. Tap "Send magic link"
   - VERIFY: "Check your email" message
4. Open email, click link
   - VERIFY: App opens
   - VERIFY: User logged in

# Test Flow 4: MFA Enrollment
1. Log in with email/password
2. Navigate to Settings > Security
3. Tap "Enable 2FA"
   - VERIFY: QR code displays
4. Scan QR code with Google Authenticator
5. Enter 6-digit code
6. Tap "Verify"
   - VERIFY: "2FA enabled" message
7. Log out, log back in
   - VERIFY: MFA verification screen appears
8. Enter code from authenticator
   - VERIFY: Successfully logged in (AAL2)

# Test Flow 5: Biometric Login (MUST use development build)
1. Log in with email/password
2. Navigate to Settings > Security
3. Tap "Enable Face ID"
   - VERIFY: Face ID prompt appears
4. Authenticate with Face ID
   - VERIFY: "Face ID enabled" message
5. Log out
6. On login screen, tap "Use Face ID"
   - VERIFY: Face ID prompt
7. Authenticate
   - VERIFY: Logged in without password

# Test Flow 6: Identity Verification
1. Log in
2. Navigate to "Verify Identity"
3. Tap "Start Verification"
   - VERIFY: Jumio SDK launches
4. Complete ID scan (use Jumio test documents)
5. Complete selfie
   - VERIFY: SDK returns success
6. Check backend logs
   - VERIFY: Webhook received
   - VERIFY: user_verification_status updated to 'approved'
7. Refresh app
   - VERIFY: Profile shows "Verified" badge

# Test Flow 7: Protected Routes
1. Log out (if logged in)
2. Try to access /api/auth/me endpoint:
   curl http://localhost:3000/api/auth/me
   - VERIFY: 401 Unauthorized
3. Log in, get token from network tab
4. Try again with token:
   curl -H "Authorization: Bearer <token>" http://localhost:3000/api/auth/me
   - VERIFY: 200 OK with user profile

# Test Flow 8: Role-Based Access
1. Log in as member
2. Try to access moderator endpoint:
   curl -H "Authorization: Bearer <token>" http://localhost:3000/api/posts/:id/moderate
   - VERIFY: 403 Forbidden
3. Update user role in database:
   UPDATE user_roles SET role = 'moderator' WHERE user_id = '<user-id>'
4. Refresh token (log out and back in)
5. Try again
   - VERIFY: 200 OK (now has permission)

# Database Verification
SELECT * FROM profiles WHERE email = 'test@example.com';
# VERIFY: User profile exists

SELECT * FROM user_roles WHERE user_id = '<user-id>';
# VERIFY: Role is 'member' by default

SELECT * FROM user_verification_status WHERE user_id = '<user-id>';
# VERIFY: Status updated after Jumio webhook
```

---

## Final Validation Checklist

- [ ] All database migrations run successfully
- [ ] Custom access token hook configured in Supabase
- [ ] RLS policies enabled on all auth tables
- [ ] Backend auth middleware validates JWT correctly
- [ ] Role-based middleware blocks unauthorized access
- [ ] Frontend Supabase client uses SecureStore adapter
- [ ] AuthContext manages session state correctly
- [ ] Deep linking configured (app.json + handler)
- [ ] Email verification works with deep link
- [ ] Google OAuth login works end-to-end
- [ ] Facebook OAuth login works (if enabled)
- [ ] Apple Sign In works on physical iOS device
- [ ] Magic link authentication works
- [ ] OTP fallback works for magic links
- [ ] MFA enrollment generates QR code
- [ ] MFA verification grants AAL2 access
- [ ] Biometric login works (development build)
- [ ] Identity verification Jumio SDK launches
- [ ] Webhook handles Jumio callback correctly
- [ ] Verification status updates in database
- [ ] Protected routes redirect unauthenticated users
- [ ] Role checks enforce permissions correctly
- [ ] Token refresh works in background
- [ ] Session persists across app restarts
- [ ] All tests pass (backend + frontend)
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Environment variables documented

---

## Anti-Patterns to Avoid

### Security Anti-Patterns
- ❌ Don't use `getSession()` on backend - ALWAYS use `getUser()`
- ❌ Don't expose service role key on frontend
- ❌ Don't trust client-side role checks - enforce server-side with RLS
- ❌ Don't use `user_metadata` in RLS policies - use `app_metadata`
- ❌ Don't skip webhook signature verification
- ❌ Don't store passwords in logs or error messages
- ❌ Don't disable email verification in production

### Storage Anti-Patterns
- ❌ Don't use AsyncStorage for tokens - use SecureStore
- ❌ Don't store refresh tokens without biometric protection
- ❌ Don't forget to set `persistSession: true`

### Deep Linking Anti-Patterns
- ❌ Don't forget `detectSessionInUrl: false` for mobile
- ❌ Don't skip deep link configuration in app.json
- ❌ Don't forget to test on physical devices (not just simulator)

### OAuth Anti-Patterns
- ❌ Don't mismatch redirect URLs (Supabase vs provider)
- ❌ Don't test OAuth in Expo Go - use development build
- ❌ Don't forget to update tunneled URLs during development

### Biometric Anti-Patterns
- ❌ Don't test Face ID in Expo Go - requires development build
- ❌ Don't forget NSFaceIDUsageDescription in app.json
- ❌ Don't store keys without handling biometric invalidation

### MFA Anti-Patterns
- ❌ Don't forget to call refreshSession() after unenrolling
- ❌ Don't force MFA on all users immediately - phase it in
- ❌ Don't forget to check AAL level for sensitive operations

---

## Quality Score

### Confidence Level: **7/10**

**Reasons for 7/10:**

✅ **Strong foundations:**
- Supabase Auth is production-ready and well-documented
- Clear implementation steps with pseudocode
- Comprehensive validation gates
- Multiple authentication methods covered

✅ **Proven patterns:**
- Supabase patterns are widely used
- React Native auth flows are standard
- RBAC with RLS is well-established

⚠️ **Moderate challenges:**
- Deep linking setup can be finicky (platform-specific)
- OAuth configuration requires multiple dashboards (Google, Facebook, Apple)
- Jumio SDK React Native integration has limited documentation
- Biometric authentication requires development builds (can't test in Expo Go)
- MFA flows are complex with multiple states
- Webhook signature verification needs careful implementation

⚠️ **External dependencies:**
- Jumio account required (may need approval/setup time)
- OAuth provider accounts (Google Cloud, Facebook Dev, Apple Dev)
- Email delivery service (Supabase Inbucket for dev, custom SMTP for prod)

**Mitigation strategies:**
- Comprehensive step-by-step deep linking setup
- Detailed OAuth configuration checklist
- Jumio SDK installation documented with platform-specific steps
- Development build creation instructions
- Webhook testing with mock payloads
- Fallback options (OTP for magic links, password for biometric)

**Expected outcome:** Fully functional authentication system with email/password, OAuth (Google + others), magic links, 2FA, biometric login, and identity verification. Some platform-specific debugging may be required for deep linking and biometric features, but all core authentication flows will work reliably.

---

## Next Steps After Completion

Once authentication is complete, you can execute the remaining PRPs:

1. **Posting Content MVP PRP** (already created) - Requires auth for user posts
2. **Dashboard PRP** - Shows authenticated user's activity
3. **Search PRP** - Requires auth for saved searches
4. **Moderation PRP** - Uses RBAC for moderator/admin tools

Authentication is the foundation - all other features depend on it being implemented correctly.
