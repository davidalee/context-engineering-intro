# Identity Verification Deep Integration PRP (Didit.me)

**Version:** 2.0
**Created:** 2025-12-24
**Status:** Ready for Implementation
**Confidence Score:** 9/10

---

## Goal

Complete the identity verification integration using **Didit.me** to enable government ID + selfie verification for all users. This replaces the partial Jumio implementation with Didit's simpler, more cost-effective API.

**End State:**
- Authenticated users can initiate identity verification from the app
- Users complete verification via Didit's web client in an in-app WebView
- App receives webhook callbacks and updates user status in real-time
- Verification status is displayed throughout the app
- Protected features require verified status

---

## Why

- **Cost Reduction**: Didit claims up to 70% cost reduction vs legacy providers
- **Simpler Integration**: Single API key authentication, cleaner API structure
- **AI-Native**: Faster fraud detection (milliseconds vs 60-90 seconds)
- **Trust & Safety**: Core to BetweenUs's mission of verified community
- **Existing Schema Ready**: Database schema from Jumio work is reusable

---

## What

### User-Visible Behavior

1. **Verification Entry Point**
   - User taps "Get Verified" button (on Dashboard or Profile)
   - App shows explanation screen with privacy info
   - User confirms to start verification

2. **Verification Flow**
   - App calls backend to create Didit session
   - Backend returns verification URL
   - App opens WebView with Didit's verification UI
   - User takes photo of government ID (front/back)
   - User takes selfie for liveness check
   - Didit processes and compares

3. **Completion**
   - WebView redirects to callback URL
   - App catches redirect and closes WebView
   - Backend receives webhook with result
   - App polls for status or refreshes on return
   - User sees verification badge on profile

4. **Status Display**
   - "Not Started" - No verification attempted
   - "In Progress" - User actively verifying
   - "In Review" - Manual review required
   - "Approved" - Verified, show badge
   - "Declined" - Rejected with reason, option to retry
   - "Expired" / "Abandoned" - Session timed out, retry available

### Success Criteria

- [ ] Users can initiate verification from the app
- [ ] WebView correctly displays Didit verification UI
- [ ] Webhooks update database status correctly
- [ ] Frontend reflects verification status in real-time
- [ ] Verified badge appears on user profile
- [ ] Declined users see rejection reason and can retry
- [ ] Type-check passes for all packages
- [ ] No console errors during verification flow

---

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Critical for implementation
- url: https://docs.didit.me/reference/api-authentication
  why: API key authentication via x-api-key header
  critical: Never expose API key in frontend code

- url: https://docs.didit.me/reference/api-full-flow
  why: Complete 6-step integration flow
  critical: POST /v2/session/ returns verification URL

- url: https://docs.didit.me/reference/verification-statuses
  why: All 8 status values and their meanings
  critical: Approved/Declined are terminal, In Review needs manual action

- url: https://docs.didit.me/reference/webhooks
  why: Webhook payload structure and signature verification
  critical: Use raw JSON body for HMAC, validate X-Timestamp within 5 min

- url: https://github.com/didit-protocol/didit-full-demo
  why: Reference Next.js implementation with Prisma
  critical: Shows session creation and webhook handling patterns

# Existing codebase patterns to follow
- file: packages/backend/src/routes/auth.routes.ts
  why: Pattern for protected routes with authenticateUser middleware

- file: packages/backend/src/routes/webhooks.routes.ts
  why: Existing webhook pattern (Jumio) - adapt for Didit signature verification

- file: packages/frontend/src/screens/auth/MFAEnrollScreen.tsx
  why: Pattern for multi-step flows with loading states

- file: packages/frontend/src/contexts/AuthContext.tsx
  why: Pattern for refreshing profile data after state changes
```

### Current Codebase Tree

```bash
packages/
├── backend/src/
│   ├── config/
│   │   ├── jumio.ts              # ❌ REMOVE or keep for reference
│   │   ├── didit.ts              # ❌ CREATE - Didit API config
│   │   ├── supabase.ts           # ✅ Exists
│   │   └── database.ts           # ✅ Exists
│   ├── services/
│   │   ├── jumio.service.ts      # ❌ REMOVE or rename
│   │   ├── didit.service.ts      # ❌ CREATE - Didit session management
│   │   └── verification.service.ts # ✅ MODIFY - Update for Didit statuses
│   ├── routes/
│   │   ├── verification.routes.ts # ❌ CREATE - POST /initiate, GET /status
│   │   └── webhooks.routes.ts    # ❌ MODIFY - Add Didit webhook handler
│   └── db/
│       └── schema.ts             # ✅ MODIFY - Update status enum values
├── frontend/src/
│   ├── screens/
│   │   └── verification/         # ❌ CREATE - VerificationScreen, WebView
│   ├── components/
│   │   └── verification/         # ❌ CREATE - VerificationBadge, StatusCard
│   ├── services/
│   │   └── verification.service.ts # ❌ CREATE - API client
│   ├── contexts/
│   │   └── AuthContext.tsx       # ❌ MODIFY - Add verification status
│   └── navigation/
│       └── AppNavigator.tsx      # ❌ MODIFY - Add verification screens
└── shared/src/
    ├── schemas/
    │   └── verification.schemas.ts # ❌ CREATE - Zod schemas
    └── types/
        └── auth.types.ts         # ❌ MODIFY - Update VerificationStatus type
```

### Desired Codebase Tree with New Files

```bash
# Backend additions
packages/backend/src/
├── config/
│   └── didit.ts                  # NEW: Didit API configuration
├── services/
│   └── didit.service.ts          # NEW: Create session, get decision
├── routes/
│   └── verification.routes.ts    # NEW: POST /, GET /status

# Frontend additions
packages/frontend/src/
├── screens/
│   └── verification/
│       ├── index.ts              # NEW: Barrel export
│       ├── VerificationIntroScreen.tsx  # NEW: Explain & start
│       └── VerificationWebViewScreen.tsx # NEW: Didit WebView
├── components/
│   └── verification/
│       ├── index.ts              # NEW: Barrel export
│       ├── VerificationBadge.tsx # NEW: Badge for verified users
│       └── VerificationStatusCard.tsx # NEW: Status display
├── services/
│   └── verification.service.ts   # NEW: API client for verification

# Shared additions
packages/shared/src/
├── schemas/
│   └── verification.schemas.ts   # NEW: Zod schemas for API
```

### Known Gotchas & Library Quirks

```typescript
// CRITICAL: Didit API key authentication
// Use x-api-key header, NOT Authorization Bearer
// const headers = { 'x-api-key': process.env.DIDIT_API_KEY }

// CRITICAL: Webhook signature verification
// MUST use raw request body (not parsed JSON) for HMAC
// Use express.raw() middleware before json() for webhook route
// Validate X-Timestamp is within 5 minutes to prevent replay attacks

// CRITICAL: Didit status mapping to our schema
// Didit: Not Started, In Progress, Approved, Declined, In Review, Expired, Abandoned, KYC Expired
// Ours: pending, processing, approved, denied, error
// Map: Not Started → pending, In Progress/In Review → processing,
//      Approved → approved, Declined → denied, Expired/Abandoned/KYC Expired → error

// GOTCHA: Webhook includes 'decision' field ONLY for terminal statuses
// (Approved, Declined, In Review, Abandoned) - check before accessing

// GOTCHA: Rate limits differ by plan
// Free: 5 sessions/minute, Paid: 600 sessions/minute
// Handle 429 responses with retry-after header

// PATTERN: Didit uses workflow_id to configure what checks to run
// Create workflow in Didit dashboard, copy ID to environment variable
```

---

## Implementation Blueprint

### Data Models and Structure

```typescript
// packages/shared/src/types/auth.types.ts - UPDATE VerificationStatus
export type VerificationStatus =
  | 'pending'      // Not Started
  | 'processing'   // In Progress, In Review
  | 'approved'     // Approved
  | 'denied'       // Declined
  | 'error'        // Expired, Abandoned, KYC Expired

// packages/shared/src/schemas/verification.schemas.ts - CREATE
import { z } from 'zod'

export const initiateVerificationResponseSchema = z.object({
  sessionId: z.string(),
  verificationUrl: z.string().url(),
})

export const verificationStatusResponseSchema = z.object({
  status: z.enum(['pending', 'processing', 'approved', 'denied', 'error']),
  provider: z.string().optional(),
  idType: z.string().optional(),
  idCountry: z.string().optional(),
  verifiedAt: z.string().optional(),
  declineReason: z.string().optional(),
})

export const diditWebhookPayloadSchema = z.object({
  session_id: z.string(),
  status: z.string(),
  webhook_type: z.enum(['status.updated', 'data.updated']),
  created_at: z.number().optional(),
  workflow_id: z.string().optional(),
  vendor_data: z.string().optional(),
  decision: z.object({
    id_verification: z.object({
      status: z.string(),
      document_type: z.string().optional(),
      issuing_country: z.string().optional(),
    }).optional(),
  }).optional(),
})

export type InitiateVerificationResponse = z.infer<typeof initiateVerificationResponseSchema>
export type VerificationStatusResponse = z.infer<typeof verificationStatusResponseSchema>
export type DiditWebhookPayload = z.infer<typeof diditWebhookPayloadSchema>
```

### List of Tasks to Complete

```yaml
Task 1: Update shared types and create schemas
  MODIFY packages/shared/src/types/auth.types.ts:
    - VerificationStatus type already correct (pending, processing, approved, denied, error)
  CREATE packages/shared/src/schemas/verification.schemas.ts:
    - initiateVerificationResponseSchema
    - verificationStatusResponseSchema
    - diditWebhookPayloadSchema
  MODIFY packages/shared/src/schemas/index.ts:
    - Export verification schemas

Task 2: Update database schema for Didit statuses
  MODIFY packages/backend/src/db/schema.ts:
    - Verify verificationStatusEnum matches (pending, processing, approved, denied, error)
    - Add sessionId field to userVerificationStatus table (rename transactionReference)
  RUN: yarn workspace @betweenus/backend db:generate
  RUN: yarn workspace @betweenus/backend db:migrate

Task 3: Create Didit configuration
  CREATE packages/backend/src/config/didit.ts:
    - DIDIT_API_KEY from env
    - DIDIT_WORKFLOW_ID from env
    - DIDIT_WEBHOOK_SECRET from env
    - API base URL: https://verification.didit.me/v2
    - getDiditHeaders() function
    - isConfigured check

Task 4: Create Didit service
  CREATE packages/backend/src/services/didit.service.ts:
    - createSession(userId, email): POST /session/
    - getSessionDecision(sessionId): GET /session/{sessionId}/decision/
    - mapDiditStatus(diditStatus): Convert to our VerificationStatus

Task 5: Update verification service
  MODIFY packages/backend/src/services/verification.service.ts:
    - Update to use sessionId instead of transactionReference
    - Update status mapping for Didit statuses
    - Extract document type and country from decision payload

Task 6: Create verification routes
  CREATE packages/backend/src/routes/verification.routes.ts:
    - POST / → createSession (requires auth)
    - GET /status → getVerificationStatus (requires auth)
  MODIFY packages/backend/src/index.ts:
    - Import and mount at /api/verification

Task 7: Update webhook routes for Didit
  MODIFY packages/backend/src/routes/webhooks.routes.ts:
    - Add POST /didit endpoint
    - Use express.raw() middleware for signature verification
    - Verify X-Signature using HMAC-SHA256
    - Validate X-Timestamp within 5 minutes
    - Parse webhook payload and update verification status

Task 8: Create frontend verification service
  CREATE packages/frontend/src/services/verification.service.ts:
    - initiateVerification(): POST /api/verification
    - getVerificationStatus(): GET /api/verification/status

Task 9: Create VerificationIntroScreen
  CREATE packages/frontend/src/screens/verification/VerificationIntroScreen.tsx:
    - Explain verification process
    - Privacy information
    - "Start Verification" button
    - Handle loading and errors
  CREATE packages/frontend/src/screens/verification/index.ts:
    - Barrel exports

Task 10: Create VerificationWebViewScreen
  CREATE packages/frontend/src/screens/verification/VerificationWebViewScreen.tsx:
    - Receive verificationUrl from navigation params
    - Render WebView with Didit URL
    - Detect redirect to callback URL
    - Close WebView and navigate back

Task 11: Create verification components
  CREATE packages/frontend/src/components/verification/VerificationBadge.tsx:
    - Small verified checkmark badge
  CREATE packages/frontend/src/components/verification/VerificationStatusCard.tsx:
    - Card showing current status with appropriate actions
  CREATE packages/frontend/src/components/verification/index.ts:
    - Barrel exports

Task 12: Update AuthContext with verification status
  MODIFY packages/frontend/src/contexts/AuthContext.tsx:
    - Add verificationStatus to context
    - Fetch verification status on auth
    - Add refreshVerificationStatus method
    - Expose isVerified boolean

Task 13: Update navigation
  MODIFY packages/frontend/src/navigation/AppNavigator.tsx:
    - Import verification screens
    - Add VerificationIntro to AppStackParamList
    - Add VerificationWebView to AppStackParamList
    - Register screens in MainNavigator

Task 14: Type-check and manual test
  RUN: yarn workspace @betweenus/shared build
  RUN: yarn type-check
  FIX: Any type errors
  TEST: Manual flow in Expo Go
```

### Per-Task Pseudocode

```typescript
// Task 3: Didit configuration
// packages/backend/src/config/didit.ts

import { logger } from '../utils/logger.js'

export interface DiditConfig {
  apiKey: string
  workflowId: string
  webhookSecret: string
  baseUrl: string
}

export function getDiditConfig(): DiditConfig {
  const apiKey = process.env.DIDIT_API_KEY || ''
  const workflowId = process.env.DIDIT_WORKFLOW_ID || ''
  const webhookSecret = process.env.DIDIT_WEBHOOK_SECRET || ''

  if (!apiKey || !workflowId) {
    logger.warn('Didit credentials not configured - identity verification disabled')
  }

  return {
    apiKey,
    workflowId,
    webhookSecret,
    baseUrl: 'https://verification.didit.me/v2',
  }
}

export function getDiditHeaders(): Record<string, string> {
  const config = getDiditConfig()
  return {
    'x-api-key': config.apiKey,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
}

export const diditConfig = {
  get isConfigured() {
    const config = getDiditConfig()
    return !!config.apiKey && !!config.workflowId
  },
}
```

```typescript
// Task 4: Didit service
// packages/backend/src/services/didit.service.ts

import { eq } from 'drizzle-orm'
import { diditConfig, getDiditConfig, getDiditHeaders } from '../config/didit.js'
import { getDatabase } from '../config/database.js'
import { userVerificationStatus } from '../db/schema.js'
import { logger } from '../utils/logger.js'
import type { VerificationStatus } from '@betweenus/shared'

export interface CreateSessionResult {
  sessionId: string
  verificationUrl: string
}

// Map Didit statuses to our internal statuses
export function mapDiditStatus(diditStatus: string): VerificationStatus {
  switch (diditStatus.toLowerCase().replace(/\s+/g, '_')) {
    case 'not_started':
      return 'pending'
    case 'in_progress':
    case 'in_review':
      return 'processing'
    case 'approved':
      return 'approved'
    case 'declined':
      return 'denied'
    case 'expired':
    case 'abandoned':
    case 'kyc_expired':
      return 'error'
    default:
      logger.warn('Unknown Didit status', { diditStatus })
      return 'error'
  }
}

export async function createSession(
  userId: string,
  email: string
): Promise<CreateSessionResult> {
  if (!diditConfig.isConfigured) {
    throw new Error('Identity verification is not configured')
  }

  const config = getDiditConfig()
  const callbackUrl = `${process.env.API_URL}/api/webhooks/didit`

  const response = await fetch(`${config.baseUrl}/session/`, {
    method: 'POST',
    headers: getDiditHeaders(),
    body: JSON.stringify({
      workflow_id: config.workflowId,
      vendor_data: userId,
      callback: callbackUrl,
      contact_details: { email },
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    logger.error('Didit API error', { status: response.status, error: errorText })

    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please try again in a moment.')
    }
    throw new Error('Failed to initiate identity verification')
  }

  const data = await response.json() as {
    session_id: string
    session_token: string
    url: string
  }

  const sessionId = data.session_id
  const verificationUrl = data.url

  // Store session in database
  const db = getDatabase()
  await db
    .insert(userVerificationStatus)
    .values({
      userId,
      status: 'pending',
      provider: 'didit',
      transactionReference: sessionId,
    })
    .onConflictDoUpdate({
      target: userVerificationStatus.userId,
      set: {
        status: 'pending',
        provider: 'didit',
        transactionReference: sessionId,
        updatedAt: new Date(),
      },
    })

  logger.info('Didit session created', { userId, sessionId })

  return { sessionId, verificationUrl }
}

export async function getVerificationStatus(userId: string) {
  const db = getDatabase()

  const [status] = await db
    .select()
    .from(userVerificationStatus)
    .where(eq(userVerificationStatus.userId, userId))
    .limit(1)

  return status || null
}

export async function getSessionDecision(sessionId: string) {
  const config = getDiditConfig()

  const response = await fetch(`${config.baseUrl}/session/${sessionId}/decision/`, {
    method: 'GET',
    headers: getDiditHeaders(),
  })

  if (!response.ok) {
    logger.error('Failed to get Didit decision', { sessionId, status: response.status })
    return null
  }

  return response.json()
}

export const diditService = {
  createSession,
  getVerificationStatus,
  getSessionDecision,
  mapDiditStatus,
}
```

```typescript
// Task 6: Verification routes
// packages/backend/src/routes/verification.routes.ts

import { Router } from 'express'
import { authenticateUser, type AuthenticatedRequest } from '../middleware/auth.middleware.js'
import { createSession, getVerificationStatus } from '../services/didit.service.js'
import { logger } from '../utils/logger.js'

const router = Router()

// POST /api/verification - Start verification
router.post('/', authenticateUser, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' })
      return
    }

    const email = req.user.email
    if (!email) {
      res.status(400).json({ success: false, error: 'Email required for verification' })
      return
    }

    const result = await createSession(req.user.id, email)

    res.json({
      success: true,
      data: {
        sessionId: result.sessionId,
        verificationUrl: result.verificationUrl,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logger.error('Failed to initiate verification', { error })
    next(error)
  }
})

// GET /api/verification/status - Get current status
router.get('/status', authenticateUser, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' })
      return
    }

    const status = await getVerificationStatus(req.user.id)

    res.json({
      success: true,
      data: status ? {
        status: status.status,
        provider: status.provider,
        idType: status.idType,
        idCountry: status.idCountry,
        verifiedAt: status.verifiedAt?.toISOString(),
        declineReason: status.rejectReason,
      } : null,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

export default router
```

```typescript
// Task 7: Didit webhook handler
// ADD to packages/backend/src/routes/webhooks.routes.ts

import crypto from 'crypto'
import { getDiditConfig } from '../config/didit.js'
import { mapDiditStatus } from '../services/didit.service.js'
import { updateVerificationStatus } from '../services/verification.service.js'

interface DiditWebhookPayload {
  session_id: string
  status: string
  webhook_type: 'status.updated' | 'data.updated'
  vendor_data?: string
  decision?: {
    id_verification?: {
      status: string
      document_type?: string
      issuing_country?: string
      decline_reasons?: string[]
    }
  }
}

function verifyDiditSignature(
  rawBody: string,
  signature: string | undefined,
  timestamp: string | undefined,
  secret: string
): boolean {
  if (!signature || !secret) return false

  // Validate timestamp is within 5 minutes
  if (timestamp) {
    const webhookTime = parseInt(timestamp, 10) * 1000
    const now = Date.now()
    const fiveMinutes = 5 * 60 * 1000
    if (Math.abs(now - webhookTime) > fiveMinutes) {
      logger.warn('Didit webhook timestamp too old', { timestamp, now })
      return false
    }
  }

  // CRITICAL: Use raw body for HMAC, not re-stringified JSON
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

// IMPORTANT: This route needs express.raw() middleware
// Add before json() in main app: app.use('/api/webhooks/didit', express.raw({ type: 'application/json' }))
router.post('/didit', async (req, res, next) => {
  try {
    const signature = req.headers['x-signature'] as string | undefined
    const timestamp = req.headers['x-timestamp'] as string | undefined
    const webhookSecret = getDiditConfig().webhookSecret

    // Get raw body for signature verification
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body)

    if (webhookSecret && !verifyDiditSignature(rawBody, signature, timestamp, webhookSecret)) {
      logger.warn('Invalid Didit webhook signature')
      res.status(401).json({ error: 'Invalid signature' })
      return
    }

    const body: DiditWebhookPayload = typeof req.body === 'string'
      ? JSON.parse(req.body)
      : req.body

    const sessionId = body.session_id
    const diditStatus = body.status
    const decision = body.decision?.id_verification

    const status = mapDiditStatus(diditStatus)
    const idType = decision?.document_type
    const idCountry = decision?.issuing_country
    const declineReason = status === 'denied'
      ? decision?.decline_reasons?.join(', ') || 'Verification failed'
      : undefined

    logger.info('Didit webhook received', {
      sessionId,
      diditStatus,
      mappedStatus: status,
      webhookType: body.webhook_type,
    })

    await updateVerificationStatus(sessionId, {
      status,
      idType,
      idCountry,
      rejectReason: declineReason,
    })

    res.status(200).json({ received: true })
  } catch (error) {
    logger.error('Didit webhook error', { error })
    next(error)
  }
})
```

```typescript
// Task 10: VerificationWebViewScreen
// packages/frontend/src/screens/verification/VerificationWebViewScreen.tsx

import React, { useState, useCallback, useRef } from 'react'
import { View, StyleSheet, ActivityIndicator, Alert, BackHandler } from 'react-native'
import { WebView, type WebViewNavigation } from 'react-native-webview'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useFocusEffect } from '@react-navigation/native'
import { Text } from '../../components/Text'
import { colors } from '../../theme/colors'
import type { AppStackParamList } from '../../navigation/AppNavigator'

type Props = NativeStackScreenProps<AppStackParamList, 'VerificationWebView'>

export function VerificationWebViewScreen({ navigation, route }: Props) {
  const { verificationUrl, sessionId } = route.params
  const [isLoading, setIsLoading] = useState(true)
  const webViewRef = useRef<WebView>(null)

  // Handle hardware back button
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          'Cancel Verification?',
          'Are you sure you want to cancel? You can resume verification later.',
          [
            { text: 'Continue', style: 'cancel' },
            {
              text: 'Cancel',
              style: 'destructive',
              onPress: () => navigation.goBack(),
            },
          ]
        )
        return true
      }

      BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, [navigation])
  )

  // Detect when Didit redirects back (verification complete)
  const handleNavigationStateChange = useCallback((navState: WebViewNavigation) => {
    const { url } = navState

    // Didit will redirect to our callback URL when done
    // The actual result comes via webhook, but we detect completion here
    if (url.includes('/api/webhooks/didit') || url.includes('verification/complete')) {
      navigation.replace('VerificationComplete', { sessionId })
    }
  }, [navigation, sessionId])

  const handleError = useCallback(() => {
    Alert.alert(
      'Connection Error',
      'Unable to load verification. Please check your internet connection and try again.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    )
  }, [navigation])

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text variant="body" color="textSecondary" style={styles.loadingText}>
            Loading verification...
          </Text>
        </View>
      )}
      <WebView
        ref={webViewRef}
        source={{ uri: verificationUrl }}
        onLoadEnd={() => setIsLoading(false)}
        onNavigationStateChange={handleNavigationStateChange}
        onError={handleError}
        // Allow camera access for ID/selfie capture
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        style={styles.webview}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    zIndex: 1,
  },
  loadingText: {
    marginTop: 12,
  },
  webview: {
    flex: 1,
  },
})
```

### Integration Points

```yaml
DATABASE:
  - Verify verificationStatusEnum matches: pending, processing, approved, denied, error
  - transactionReference field stores Didit session_id (can rename to sessionId)

CONFIG:
  - ADD to packages/backend/src/index.ts:
    import verificationRoutes from './routes/verification.routes.js'
    app.use('/api/verification', verificationRoutes)
  - ADD raw body parsing for Didit webhook:
    app.use('/api/webhooks/didit', express.raw({ type: 'application/json' }))

NAVIGATION:
  - ADD to AppStackParamList:
    VerificationIntro: undefined
    VerificationWebView: { verificationUrl: string; sessionId: string }
    VerificationComplete: { sessionId: string }

ENVIRONMENT:
  - DIDIT_API_KEY: API key from Didit Business Console
  - DIDIT_WORKFLOW_ID: Workflow ID for KYC verification
  - DIDIT_WEBHOOK_SECRET: Secret for webhook signature verification
  - API_URL: Backend URL (for webhook callback)
```

---

## Validation Loop

### Level 1: Syntax & Style

```bash
# Run from project root
yarn type-check

# Expected: No type errors
# If errors: Read error message, fix type issues, re-run
```

### Level 2: Build Check

```bash
# Build shared package first
yarn workspace @betweenus/shared build

# Then type-check all packages
yarn type-check

# Expected: All packages pass
```

### Level 3: Backend Test

```bash
# Start backend
yarn workspace @betweenus/backend dev

# Test initiate endpoint (replace TOKEN with valid JWT)
curl -X POST http://localhost:3000/api/verification \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json"

# Expected: { "success": true, "data": { "sessionId": "...", "verificationUrl": "..." } }

# Test status endpoint
curl http://localhost:3000/api/verification/status \
  -H "Authorization: Bearer TOKEN"

# Expected: { "success": true, "data": { "status": "pending", ... } }

# Test webhook (simulated - for development)
curl -X POST http://localhost:3000/api/webhooks/didit \
  -H "Content-Type: application/json" \
  -d '{"session_id": "test-session", "status": "Approved", "webhook_type": "status.updated"}'

# Expected: { "received": true }
```

### Level 4: Frontend Manual Test

```bash
# Start frontend
yarn workspace @betweenus/frontend dev

# Test flow in Expo Go:
# 1. Login to app
# 2. Navigate to verification screen
# 3. Tap "Start Verification"
# 4. Verify WebView opens with Didit UI
# 5. Complete or cancel verification
# 6. Verify app handles redirect correctly

# NOTE: Camera won't work in iOS Simulator
# For full testing, use physical device
```

---

## Final Validation Checklist

- [ ] All type checks pass: `yarn type-check`
- [ ] Backend starts without errors: `yarn workspace @betweenus/backend dev`
- [ ] Frontend starts without errors: `yarn workspace @betweenus/frontend dev`
- [ ] POST /api/verification returns verificationUrl
- [ ] GET /api/verification/status returns current status
- [ ] WebView opens and loads Didit UI
- [ ] Webhook signature verification works
- [ ] Webhook updates database correctly
- [ ] AuthContext exposes verification status
- [ ] VerificationBadge shows for verified users
- [ ] No console errors during flow

---

## Anti-Patterns to Avoid

- ❌ Don't expose DIDIT_API_KEY in frontend code
- ❌ Don't re-stringify JSON body before HMAC verification
- ❌ Don't skip timestamp validation on webhooks
- ❌ Don't assume webhook arrives instantly - it may take seconds
- ❌ Don't poll excessively - use webhooks as primary, poll as fallback
- ❌ Don't create new patterns - follow existing auth/posts patterns
- ❌ Don't ignore rate limit (429) responses

---

## Environment Variables Required

```bash
# Backend (.env)
DIDIT_API_KEY=your_didit_api_key           # From Didit Business Console
DIDIT_WORKFLOW_ID=your_workflow_id          # From Didit Workflows dashboard
DIDIT_WEBHOOK_SECRET=your_webhook_secret    # From Didit API & Webhooks settings
API_URL=http://localhost:3000               # Your backend URL (for webhook callback)

# Remove Jumio variables (optional, can keep for reference)
# JUMIO_API_TOKEN=...
# JUMIO_API_SECRET=...
# JUMIO_DATACENTER=...
# JUMIO_WEBHOOK_SECRET=...
```

---

## Migration from Jumio (Optional Cleanup)

If removing Jumio integration entirely:

```yaml
REMOVE:
  - packages/backend/src/config/jumio.ts
  - packages/backend/src/services/jumio.service.ts

MODIFY:
  - packages/backend/src/routes/webhooks.routes.ts:
    - Remove /jumio endpoint (or keep as fallback)

KEEP:
  - packages/backend/src/services/verification.service.ts (reused)
  - packages/backend/src/db/schema.ts (reused)
```

---

## Sources & References

- [Didit Documentation Portal](https://docs.didit.me/reference/introduction)
- [Didit API Authentication](https://docs.didit.me/reference/api-authentication)
- [Didit API Full Flow](https://docs.didit.me/reference/api-full-flow)
- [Didit Create Session](https://docs.didit.me/reference/create-session-verification-sessions)
- [Didit Verification Statuses](https://docs.didit.me/reference/verification-statuses)
- [Didit Webhooks](https://docs.didit.me/reference/webhooks)
- [Didit Full Demo (Next.js)](https://github.com/didit-protocol/didit-full-demo)
- [Didit Quick Start Guide](https://docs.didit.me/reference/quick-start)
