# Content Moderation Privacy Enhancement PRP - BetweenUs

**Version:** 1.0
**Created:** 2025-12-30
**Status:** Ready for Implementation
**Tasks:** 28
**Confidence Score:** 8/10

---

## Goal

Enhance the content moderation system to protect user privacy when using external AI services (OpenAI Moderation API) by implementing PII anonymization before API calls, adding user consent flows, and optionally supporting a hybrid local+cloud moderation approach for maximum privacy.

**End State:**
- User-generated content is anonymized (names, phones, emails, addresses stripped) before being sent to OpenAI
- Users are informed and consent to AI-assisted content moderation during onboarding
- Privacy policy explicitly discloses third-party AI processing
- Optional: Local classifier handles BetweenUs-specific categories (doxxing, impersonation, false info) without external API calls
- All privacy-sensitive operations are logged for compliance auditing

---

## Why

- **Privacy Risk**: BetweenUs handles highly sensitive content (relationship accusations, names, personal details) that currently goes to OpenAI unredacted for 30 days
- **User Trust**: Privacy-conscious users expect sensitive relationship content to stay private
- **Regulatory Compliance**: GDPR/CCPA may require explicit consent for third-party AI processing of personal data
- **Data Minimization**: Only send what's necessary - OpenAI doesn't need real names to detect harassment
- **Legal Protection**: Demonstrable privacy measures protect platform in data breach scenarios
- **Competitive Advantage**: "Your stories stay private" is a strong differentiator

---

## What

### User-Visible Behavior

1. **Onboarding Consent**
   - New screen explaining AI-assisted content moderation
   - Clear disclosure that content is processed by AI for safety
   - Link to privacy policy section on AI processing
   - Required consent checkbox before first post

2. **Privacy Indicator**
   - Visual indicator during post creation showing privacy protection is active
   - Tooltip: "Names and personal details are removed before safety checks"

3. **Privacy Policy Updates**
   - New section on AI-assisted content moderation
   - Disclosure of OpenAI as third-party processor
   - Explanation of anonymization measures
   - Data retention information (30 days at OpenAI, or ZDR if approved)

### Technical Requirements

1. **PII Anonymization Layer**
   - Detect and replace names, phone numbers, emails, addresses, SSNs before OpenAI calls
   - Preserve original text for storage, use anonymized version for moderation
   - Reversible anonymization (maintain mapping for internal use)

2. **Consent Management**
   - Store user consent timestamp and version
   - Block posting until consent given
   - Re-consent flow if privacy policy changes

3. **Local Classification (Optional Phase 2)**
   - Lightweight classifier for BetweenUs-specific categories
   - Runs on backend without external API calls
   - Categories: doxxing patterns, spam, impersonation indicators

### Success Criteria

- [ ] All content sent to OpenAI has PII replaced with placeholders
- [ ] User consent is required and recorded before first post
- [ ] Privacy policy includes AI processing disclosure
- [ ] Anonymization preserves moderation accuracy (hate/violence still detected)
- [ ] Type-check passes for all packages
- [ ] Unit tests cover anonymization edge cases
- [ ] Audit log records anonymization events

---

## All Needed Context

### Documentation & References

```yaml
# DEPENDENCIES - Other PRPs
- file: /Users/wookiee/Code/BetweenUs/PRPs/posting-content-mvp.md
  why: Current moderation implementation using OpenAI
  critical: MUST be complete - this PRP modifies moderation.service.ts

- file: /Users/wookiee/Code/BetweenUs/PRPs/moderation-system.md
  why: Full moderation system with audit logs
  critical: Audit logging pattern to follow for privacy events

- file: /Users/wookiee/Code/BetweenUs/PRPs/authentication.md
  why: User consent storage in profiles table
  critical: Profile schema extension for consent fields

# MUST READ - Core Project Documentation
- file: /Users/wookiee/Code/BetweenUs/CLAUDE.md
  why: TypeScript conventions, file structure rules
  critical: Never exceed 500 LOC, strict TypeScript

- file: /Users/wookiee/Code/BetweenUs/docs/BRAND_VOICE_GUIDE.md
  why: Consent and privacy messaging must follow brand voice
  critical: "Measured not moralizing" - privacy explanations should be clear, not scary

# External Documentation
- url: https://platform.openai.com/docs/guides/moderation
  why: OpenAI Moderation API behavior and categories
  critical: Understand what categories work with anonymized text

- url: https://openai.com/enterprise-privacy/
  why: OpenAI data handling policies
  critical: 30-day retention, Zero Data Retention option

- url: https://gdpr.eu/article-6-how-to-process-personal-data-legally/
  why: GDPR lawful basis for processing
  critical: Consent requirements for third-party AI processing

# Existing codebase patterns
- file: packages/backend/src/services/moderation.service.ts
  why: Current OpenAI moderation integration
  critical: This is the file we're modifying

- file: packages/backend/src/utils/trigger-patterns.ts
  why: Existing pattern matching for content filtering
  critical: Similar regex approach for PII detection

- file: packages/backend/src/db/schema.ts
  why: Database schema patterns
  critical: Add consent fields to profiles table
```

### Current Codebase Tree

```bash
packages/
├── backend/src/
│   ├── config/
│   │   └── openai.ts                # OpenAI client setup
│   ├── db/
│   │   └── schema.ts                # Has profiles table
│   ├── services/
│   │   ├── moderation.service.ts    # Current OpenAI moderation (MODIFY)
│   │   ├── content-filter.service.ts # Pattern matching
│   │   └── posts.service.ts         # Calls moderation
│   ├── utils/
│   │   ├── trigger-patterns.ts      # Regex patterns
│   │   └── brand-voice.ts           # Copy templates
│   └── middleware/
│       └── auth.middleware.ts       # User context
├── frontend/src/
│   ├── screens/
│   │   ├── auth/                    # Auth flow screens
│   │   └── PostCreationScreen.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx          # User state
│   └── components/
└── shared/src/
    ├── schemas/
    └── types/
```

### Desired Codebase Tree with New Files

```bash
# Backend additions
packages/backend/src/
├── services/
│   ├── moderation.service.ts        # MODIFY: Add anonymization before API call
│   ├── anonymization.service.ts     # NEW: PII detection and replacement
│   └── consent.service.ts           # NEW: Consent management
├── utils/
│   ├── pii-patterns.ts              # NEW: PII detection regex patterns
│   └── anonymization-map.ts         # NEW: Placeholder mapping utilities
├── middleware/
│   └── consent.middleware.ts        # NEW: Block posts without consent
└── types/
    └── privacy.types.ts             # NEW: Privacy-related types

# Frontend additions
packages/frontend/src/
├── screens/
│   ├── onboarding/
│   │   └── PrivacyConsentScreen.tsx # NEW: AI moderation consent
│   └── settings/
│       └── PrivacySettingsScreen.tsx # NEW: View/manage privacy settings
├── components/
│   └── privacy/
│       ├── index.ts                 # NEW
│       ├── PrivacyBadge.tsx         # NEW: Shows privacy protection active
│       └── ConsentCheckbox.tsx      # NEW: Reusable consent checkbox
└── services/
    └── consent.service.ts           # NEW: Consent API client

# Shared additions
packages/shared/src/
├── schemas/
│   └── consent.schemas.ts           # NEW: Consent validation schemas
└── types/
    └── consent.types.ts             # NEW: Consent types

# Database migration
packages/backend/src/db/
└── migrations/
    └── XXXX_add_consent_fields.sql  # NEW: Add consent to profiles
```

### Known Gotchas & Library Quirks

```typescript
// CRITICAL 1: Anonymization must be reversible for internal use
// OpenAI sees: "[NAME_1] cheated on me with [NAME_2]"
// Database stores: Original text with real names
// Moderation queue shows: Original text (for human review)
// NEVER send anonymized text to user-facing features

// CRITICAL 2: Anonymization may affect moderation accuracy
// "John Smith is a narcissist" → "[NAME] is a narcissist" ✅ (still detects harassment)
// "John texted me 50 times" → "[NAME] texted me 50 times" ✅ (still detects harassment)
// "People from [LOCATION] are all..." → May miss location-based hate speech
// TEST THOROUGHLY with real examples

// CRITICAL 3: Phone number patterns are complex
// US: (555) 123-4567, 555-123-4567, 5551234567, +1 555 123 4567
// International: +44 20 7946 0958, +81-3-1234-5678
// Use comprehensive regex or library (libphonenumber-js)

// CRITICAL 4: Name detection is imperfect
// "John Smith" → Easy to detect
// "She told Mary's friend" → Need NER (Named Entity Recognition)
// Consider: Simple capitalized word detection vs NLP library
// Trade-off: Accuracy vs dependencies/complexity

// CRITICAL 5: Don't anonymize too aggressively
// "I felt like I was in Hell" → Don't replace "Hell"
// "We went to Paris" → Should replace (location doxxing)
// "The movie Paris is Burning" → Should NOT replace
// Context matters - err on side of privacy

// CRITICAL 6: Consent versioning
// If privacy policy changes, users may need to re-consent
// Store consent version, not just boolean
// Track: timestamp, policy_version, consent_type

// CRITICAL 7: GDPR considerations
// Consent must be freely given, specific, informed, unambiguous
// Pre-checked boxes don't count as consent
// Users must be able to withdraw consent
// If consent withdrawn, what happens to existing posts?

// CRITICAL 8: Audit trail for compliance
// Log when anonymization occurs
// Log what was anonymized (categories, not actual PII)
// Log consent events (given, withdrawn, updated)
// Logs are for compliance auditors, not users

// CRITICAL 9: Performance considerations
// Anonymization adds latency to post creation
// PII detection regex can be expensive on long text
// Consider: async processing, caching patterns
// Measure: Add timing logs during development

// CRITICAL 10: Testing anonymization
// NEVER use real PII in tests
// Use realistic fake data (Faker.js)
// Test edge cases: Unicode names, international phones
// Test preservation: Does OpenAI still catch harassment?
```

---

## Implementation Blueprint

### Data Models and Structure

```typescript
// packages/shared/src/types/consent.types.ts

export type ConsentType = 'ai_moderation' | 'data_processing' | 'marketing'

export interface ConsentRecord {
  userId: string
  consentType: ConsentType
  granted: boolean
  policyVersion: string
  grantedAt: Date | null
  withdrawnAt: Date | null
  ipAddress?: string // For GDPR proof of consent
}

export interface ConsentStatus {
  aiModeration: boolean
  policyVersion: string
  canPost: boolean // False if required consent not given
}
```

```typescript
// packages/shared/src/types/privacy.types.ts

export type PIICategory =
  | 'name'
  | 'email'
  | 'phone'
  | 'address'
  | 'ssn'
  | 'location'
  | 'organization'
  | 'health_info'  // PHI - strengthens ZDR application

export interface AnonymizationResult {
  originalText: string
  anonymizedText: string
  replacements: PIIReplacement[]
  anonymizationId: string // For audit trail
}

export interface PIIReplacement {
  category: PIICategory
  originalValue: string // NOT stored long-term, only for immediate mapping
  placeholder: string // e.g., "[NAME_1]", "[PHONE_1]"
  startIndex: number
  endIndex: number
}

export interface AnonymizationAuditEntry {
  id: number
  postId?: number
  userId: string
  timestamp: Date
  categoriesAnonymized: PIICategory[]
  replacementCount: number
  // Note: We log categories and counts, NOT the actual PII
}
```

```typescript
// packages/shared/src/schemas/consent.schemas.ts

import { z } from 'zod'

export const grantConsentSchema = z.object({
  consentType: z.enum(['ai_moderation', 'data_processing', 'marketing']),
  policyVersion: z.string().min(1),
})

export const withdrawConsentSchema = z.object({
  consentType: z.enum(['ai_moderation', 'data_processing', 'marketing']),
})

export type GrantConsentInput = z.infer<typeof grantConsentSchema>
export type WithdrawConsentInput = z.infer<typeof withdrawConsentSchema>
```

```typescript
// packages/backend/src/db/schema.ts - ADDITIONS

// User consent tracking table
export const userConsents = pgTable('user_consents', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: uuid('user_id').notNull(),
  consentType: text('consent_type').notNull(), // 'ai_moderation', etc.
  granted: boolean('granted').notNull().default(false),
  policyVersion: text('policy_version').notNull(),
  grantedAt: timestamp('granted_at'),
  withdrawnAt: timestamp('withdrawn_at'),
  ipAddress: text('ip_address'), // For GDPR proof
  userAgent: text('user_agent'), // Additional proof
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => [
  index('idx_consents_user').on(t.userId),
  index('idx_consents_type').on(t.consentType),
])

// Anonymization audit log (append-only)
export const anonymizationLogs = pgTable('anonymization_logs', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: uuid('user_id').notNull(),
  postId: integer('post_id'), // Nullable - may be during draft
  categoriesAnonymized: jsonb('categories_anonymized').$type<string[]>().notNull(),
  replacementCount: integer('replacement_count').notNull(),
  processingTimeMs: integer('processing_time_ms'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => [
  index('idx_anon_logs_user').on(t.userId),
  index('idx_anon_logs_date').on(t.createdAt),
])

// Type exports
export type UserConsent = typeof userConsents.$inferSelect
export type NewUserConsent = typeof userConsents.$inferInsert
export type AnonymizationLog = typeof anonymizationLogs.$inferSelect
```

### List of Tasks to Complete

```yaml
Task 1: Create PII detection patterns utility
  CREATE packages/backend/src/utils/pii-patterns.ts:
    - Name patterns: Capitalized words, common name formats
    - Email patterns: Standard email regex
    - Phone patterns: US and international formats
    - Address patterns: Street addresses, ZIP codes
    - SSN patterns: XXX-XX-XXXX format
    - Location patterns: City, State, Country detection
  EXPORT: piiPatterns object with regex for each category
  EXPORT: detectPII(text) → PIIMatch[] function

Task 2: Create anonymization service
  CREATE packages/backend/src/services/anonymization.service.ts:
    - anonymizeText(text) → AnonymizationResult
    - Uses pii-patterns.ts to detect PII
    - Replaces with numbered placeholders ([NAME_1], [NAME_2], etc.)
    - Returns mapping for potential de-anonymization
    - Handles overlapping matches correctly
  EXPORT: AnonymizationService class

Task 3: Create shared types and schemas
  CREATE packages/shared/src/types/consent.types.ts
  CREATE packages/shared/src/types/privacy.types.ts
  CREATE packages/shared/src/schemas/consent.schemas.ts
  MODIFY packages/shared/src/index.ts:
    - Export all new types and schemas

Task 4: Update database schema
  MODIFY packages/backend/src/db/schema.ts:
    - ADD userConsents table
    - ADD anonymizationLogs table
  RUN: yarn workspace @betweenus/backend db:generate
  RUN: yarn workspace @betweenus/backend db:migrate

Task 5: Create consent service
  CREATE packages/backend/src/services/consent.service.ts:
    - grantConsent(userId, consentType, policyVersion, ipAddress)
    - withdrawConsent(userId, consentType)
    - getConsentStatus(userId) → ConsentStatus
    - hasRequiredConsent(userId) → boolean
    - getConsentHistory(userId) → ConsentRecord[]

Task 6: Create consent middleware
  CREATE packages/backend/src/middleware/consent.middleware.ts:
    - requireConsent(consentType) middleware factory
    - Checks if user has granted required consent
    - Returns 403 with brand-voice message if not
    - Used on POST /api/posts route

Task 7: Modify moderation service for anonymization
  MODIFY packages/backend/src/services/moderation.service.ts:
    - IMPORT AnonymizationService
    - BEFORE calling OpenAI: anonymize the text
    - AFTER receiving result: log anonymization event
    - RETURN original moderation result (flags apply to original text)
    - ADD moderateContentWithPrivacy(text, userId) method

Task 8: Create anonymization audit logging
  MODIFY packages/backend/src/services/anonymization.service.ts:
    - ADD logAnonymization(userId, postId, result) method
    - INSERT into anonymization_logs table
    - Log categories and counts, NOT actual PII

Task 9: Create consent controller
  CREATE packages/backend/src/controllers/consent.controller.ts:
    - handleGrantConsent(req, res, next)
    - handleWithdrawConsent(req, res, next)
    - handleGetConsentStatus(req, res, next)

Task 10: Create consent routes
  CREATE packages/backend/src/routes/consent.routes.ts:
    - POST /api/consent → handleGrantConsent (requires auth)
    - DELETE /api/consent/:type → handleWithdrawConsent (requires auth)
    - GET /api/consent/status → handleGetConsentStatus (requires auth)
  MODIFY packages/backend/src/index.ts:
    - Mount at /api/consent

Task 11: Update posts routes with consent middleware
  MODIFY packages/backend/src/routes/posts.routes.ts:
    - ADD requireConsent('ai_moderation') middleware to POST /api/posts
    - Users cannot post without AI moderation consent

Task 12: Create privacy copy utility
  CREATE packages/backend/src/utils/privacy-copy.ts:
    - Brand voice compliant privacy messages
    - consentExplanation: Why we use AI moderation
    - consentRequired: Message when consent not given
    - privacyProtected: Indicator text for UI

Task 13: Create frontend consent service
  CREATE packages/frontend/src/services/consent.service.ts:
    - grantConsent(consentType, policyVersion)
    - withdrawConsent(consentType)
    - getConsentStatus()

Task 14: Create PrivacyConsentScreen
  CREATE packages/frontend/src/screens/onboarding/PrivacyConsentScreen.tsx:
    - Explanation of AI-assisted moderation
    - What data is processed and why
    - Link to full privacy policy
    - Checkbox: "I understand and consent"
    - Submit button: "Continue"
    - Navigate to next onboarding step on success

Task 15: Create ConsentCheckbox component
  CREATE packages/frontend/src/components/privacy/ConsentCheckbox.tsx:
    - Props: label, checked, onChange, required
    - Styled checkbox with brand-voice label
    - Required indicator if applicable

Task 16: Create PrivacyBadge component
  CREATE packages/frontend/src/components/privacy/PrivacyBadge.tsx:
    - Small badge showing privacy protection active
    - Tooltip on tap: "Names and personal details are removed before safety checks"
    - Used on PostCreationScreen

Task 17: Create privacy components barrel export
  CREATE packages/frontend/src/components/privacy/index.ts

Task 18: Update PostCreationScreen with privacy badge
  MODIFY packages/frontend/src/screens/PostCreationScreen.tsx:
    - ADD PrivacyBadge component near text input
    - Shows user their content is protected

Task 19: Create PrivacySettingsScreen
  CREATE packages/frontend/src/screens/settings/PrivacySettingsScreen.tsx:
    - Show current consent status
    - Option to withdraw consent (with warning)
    - Link to privacy policy
    - Consent history (when granted)

Task 20: Update navigation with privacy screens
  MODIFY packages/frontend/src/navigation/AppNavigator.tsx:
    - Add PrivacyConsent screen to onboarding flow
    - Add PrivacySettings screen to settings stack

Task 21: Update AuthContext with consent status
  MODIFY packages/frontend/src/contexts/AuthContext.tsx:
    - ADD consentStatus to context
    - FETCH consent status on auth
    - EXPOSE hasRequiredConsent boolean

Task 22: Create backend unit tests - Anonymization
  CREATE packages/backend/src/services/__tests__/anonymization.service.test.ts:
    - TEST: Detects and replaces names
    - TEST: Detects and replaces phone numbers (multiple formats)
    - TEST: Detects and replaces emails
    - TEST: Handles multiple PII types in same text
    - TEST: Preserves non-PII text exactly
    - TEST: Generates unique placeholders ([NAME_1], [NAME_2])
    - TEST: Edge cases - Unicode names, partial matches

Task 23: Create backend unit tests - PII Patterns
  CREATE packages/backend/src/utils/__tests__/pii-patterns.test.ts:
    - TEST: Each PII category with valid examples
    - TEST: False positives are minimized
    - TEST: International formats (phones, addresses)

Task 24: Create backend integration tests - Consent
  CREATE packages/backend/src/routes/__tests__/consent.routes.test.ts:
    - TEST: Grant consent successfully
    - TEST: Withdraw consent successfully
    - TEST: Get consent status
    - TEST: Post blocked without consent

Task 25: Create frontend tests - Privacy components
  CREATE packages/frontend/src/components/privacy/__tests__/PrivacyBadge.test.tsx
  CREATE packages/frontend/src/screens/onboarding/__tests__/PrivacyConsentScreen.test.tsx
    - TEST: Renders consent explanation
    - TEST: Checkbox must be checked to continue
    - TEST: Submits consent on continue

Task 26: Update privacy policy content
  CREATE packages/frontend/src/content/privacy-policy-ai-section.ts:
    - Export privacy policy text for AI moderation section
    - Includes: what data, why, how protected, retention, rights
  NOTE: Actual legal review needed before production

Task 27: Apply for OpenAI Zero Data Retention (ZDR)
  JUSTIFICATION - BetweenUs content may contain:
    - PHI (Protected Health Information): STD status, mental health disclosures,
      pregnancy, medical conditions mentioned in relationship context
    - Sensitive relationship data: Accusations, personal experiences, emotional content
    - PII despite anonymization: Edge cases where PII detection fails
  DOCUMENT requirements:
    - CREATE docs/OPENAI_ZDR_APPLICATION.md with:
      - Business description and use case
      - Data types processed (relationship content, potential PHI)
      - Current volume and projected growth
      - Security measures in place (anonymization, encryption)
      - HIPAA/healthcare adjacency argument if applicable
  PROCESS:
    - Contact OpenAI enterprise sales: https://openai.com/contact-sales/
    - Or apply via API platform settings (if self-serve option available)
    - Request ZDR for Moderation API specifically
  TRACK:
    - Application date and status
    - OpenAI response and any requirements
    - Approval confirmation
  ON APPROVAL:
    - Update privacy policy to reflect ZDR status
    - Update privacy consent screen messaging
    - Add "Zero Data Retention" to PrivacyBadge tooltip
  TIMELINE: Can proceed in parallel with technical implementation
  PRIORITY: High - reduces 30-day retention risk to zero

Task 28: Type-check and validation
  RUN: yarn workspace @betweenus/shared build
  RUN: yarn type-check
  FIX: Any type errors
  TEST: Manual flow for consent and posting
```

### Per-Task Pseudocode

```typescript
// Task 1: PII Patterns Utility
// packages/backend/src/utils/pii-patterns.ts

export interface PIIPattern {
  category: PIICategory
  pattern: RegExp
  description: string
}

// Name detection - conservative approach
// Matches: "John Smith", "Mary Jane Watson", "Dr. Smith"
const namePattern = /\b(?:(?:Mr|Mrs|Ms|Dr|Prof)\.?\s+)?[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g

// Email detection
const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi

// Phone detection - multiple formats
const phonePatterns = [
  /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g,           // 555-123-4567
  /\b\(\d{3}\)\s*\d{3}[-.\s]?\d{4}\b/g,           // (555) 123-4567
  /\b\+1\s*\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g,     // +1 555-123-4567
  /\b\+\d{1,3}[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}\b/g, // International
]

// SSN detection
const ssnPattern = /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g

// Address detection (US-focused)
const addressPatterns = [
  /\b\d+\s+[A-Za-z]+(?:\s+[A-Za-z]+)*\s+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Way|Court|Ct|Place|Pl)\b/gi,
  /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2}\s+\d{5}(?:-\d{4})?\b/g, // City, ST 12345
]

// PHI detection - health information commonly disclosed in relationship context
// This strengthens the ZDR application argument
const healthInfoPatterns = [
  // STI/STD mentions
  /\b(?:HIV|AIDS|herpes|HPV|chlamydia|gonorrhea|syphilis|hepatitis|STD|STI)\b/gi,
  // Mental health conditions
  /\b(?:diagnosed\s+(?:with\s+)?(?:bipolar|BPD|depression|anxiety|PTSD|schizophrenia|ADHD|OCD))\b/gi,
  // Pregnancy/reproductive
  /\b(?:pregnant|abortion|miscarriage|fertility|IVF)\b/gi,
  // Medical conditions in relationship context
  /\b(?:he|she|they)\s+(?:has|have|had)\s+(?:cancer|diabetes|epilepsy)\b/gi,
  // Medication mentions (common psych meds)
  /\b(?:taking|on|prescribed)\s+(?:Prozac|Zoloft|Lexapro|Xanax|Adderall|Lithium)\b/gi,
]

export const piiPatterns: PIIPattern[] = [
  { category: 'name', pattern: namePattern, description: 'Person names' },
  { category: 'email', pattern: emailPattern, description: 'Email addresses' },
  ...phonePatterns.map(p => ({ category: 'phone' as const, pattern: p, description: 'Phone numbers' })),
  { category: 'ssn', pattern: ssnPattern, description: 'Social Security Numbers' },
  ...addressPatterns.map(p => ({ category: 'address' as const, pattern: p, description: 'Physical addresses' })),
  ...healthInfoPatterns.map(p => ({ category: 'health_info' as const, pattern: p, description: 'Protected Health Information (PHI)' })),
]

export interface PIIMatch {
  category: PIICategory
  value: string
  startIndex: number
  endIndex: number
}

export function detectPII(text: string): PIIMatch[] {
  const matches: PIIMatch[] = []

  for (const { category, pattern } of piiPatterns) {
    // Clone regex to reset lastIndex
    const regex = new RegExp(pattern.source, pattern.flags)
    let match

    while ((match = regex.exec(text)) !== null) {
      matches.push({
        category,
        value: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      })
    }
  }

  // Sort by position, then by length (longer matches first for overlaps)
  return matches.sort((a, b) => {
    if (a.startIndex !== b.startIndex) return a.startIndex - b.startIndex
    return b.endIndex - a.endIndex
  })
}
```

```typescript
// Task 2: Anonymization Service
// packages/backend/src/services/anonymization.service.ts

import { v4 as uuidv4 } from 'uuid'
import { detectPII, PIIMatch } from '../utils/pii-patterns.js'
import { getDatabase } from '../config/database.js'
import { anonymizationLogs } from '../db/schema.js'
import type { AnonymizationResult, PIICategory, PIIReplacement } from '@betweenus/shared'

export class AnonymizationService {
  anonymizeText(text: string): AnonymizationResult {
    const matches = detectPII(text)
    const replacements: PIIReplacement[] = []
    const categoryCounters: Record<PIICategory, number> = {
      name: 0,
      email: 0,
      phone: 0,
      address: 0,
      ssn: 0,
      location: 0,
      organization: 0,
      health_info: 0,
    }

    // Remove overlapping matches (keep longer ones)
    const nonOverlapping = this.removeOverlaps(matches)

    // Build anonymized text
    let anonymizedText = text
    let offset = 0

    for (const match of nonOverlapping) {
      categoryCounters[match.category]++
      const placeholder = `[${match.category.toUpperCase()}_${categoryCounters[match.category]}]`

      replacements.push({
        category: match.category,
        originalValue: match.value,
        placeholder,
        startIndex: match.startIndex,
        endIndex: match.endIndex,
      })

      // Replace in text (accounting for previous replacements changing positions)
      const adjustedStart = match.startIndex + offset
      const adjustedEnd = match.endIndex + offset
      anonymizedText =
        anonymizedText.slice(0, adjustedStart) +
        placeholder +
        anonymizedText.slice(adjustedEnd)

      offset += placeholder.length - match.value.length
    }

    return {
      originalText: text,
      anonymizedText,
      replacements,
      anonymizationId: uuidv4(),
    }
  }

  private removeOverlaps(matches: PIIMatch[]): PIIMatch[] {
    const result: PIIMatch[] = []
    let lastEnd = -1

    for (const match of matches) {
      if (match.startIndex >= lastEnd) {
        result.push(match)
        lastEnd = match.endIndex
      }
      // Skip overlapping matches (earlier ones win due to sorting)
    }

    return result
  }

  async logAnonymization(
    userId: string,
    postId: number | null,
    result: AnonymizationResult,
    processingTimeMs: number
  ): Promise<void> {
    const db = getDatabase()

    const categories = [...new Set(result.replacements.map(r => r.category))]

    await db.insert(anonymizationLogs).values({
      userId,
      postId,
      categoriesAnonymized: categories,
      replacementCount: result.replacements.length,
      processingTimeMs,
    })
  }
}
```

```typescript
// Task 7: Modified Moderation Service
// packages/backend/src/services/moderation.service.ts - MODIFICATIONS

import { openai } from '../config/openai.js'
import { logger } from '../utils/index.js'
import { AnonymizationService } from './anonymization.service.js'
import type { ModerationFlags } from '../db/schema.js'

const anonymizationService = new AnonymizationService()

export type ModerationResult = {
  flags: ModerationFlags
  success: boolean
  error?: string
  anonymizationId?: string // Track which anonymization was used
}

// NEW: Privacy-preserving moderation
export async function moderateContentWithPrivacy(
  text: string,
  userId: string,
  postId?: number
): Promise<ModerationResult> {
  const startTime = Date.now()

  try {
    // STEP 1: Anonymize text before sending to OpenAI
    const anonymizationResult = anonymizationService.anonymizeText(text)

    logger.info('Content anonymized for moderation', {
      userId,
      replacementCount: anonymizationResult.replacements.length,
      categories: [...new Set(anonymizationResult.replacements.map(r => r.category))],
    })

    // STEP 2: Send anonymized text to OpenAI
    const response = await openai.moderations.create({
      input: anonymizationResult.anonymizedText, // Anonymized, not original!
    })

    const result = response.results[0]

    if (!result) {
      return {
        flags: createEmptyFlags(),
        success: false,
        error: 'No moderation result returned',
      }
    }

    // STEP 3: Log anonymization event
    const processingTime = Date.now() - startTime
    await anonymizationService.logAnonymization(
      userId,
      postId ?? null,
      anonymizationResult,
      processingTime
    )

    // STEP 4: Return flags (apply to original text context)
    const flags: ModerationFlags = {
      flagged: result.flagged,
      categories: {
        hate: result.categories.hate || result.categories['hate/threatening'],
        harassment: result.categories.harassment || result.categories['harassment/threatening'],
        sexual: result.categories.sexual || result.categories['sexual/minors'],
        violence: result.categories.violence || result.categories['violence/graphic'],
        'self-harm':
          result.categories['self-harm'] ||
          result.categories['self-harm/intent'] ||
          result.categories['self-harm/instructions'],
      },
      category_scores: {
        hate: result.category_scores.hate,
        harassment: result.category_scores.harassment,
        sexual: result.category_scores.sexual,
        violence: result.category_scores.violence,
        'self-harm': result.category_scores['self-harm'],
      },
    }

    return {
      flags,
      success: true,
      anonymizationId: anonymizationResult.anonymizationId,
    }
  } catch (error) {
    logger.error('Error moderating content with privacy:', error)

    return {
      flags: createEmptyFlags(),
      success: false,
      error: 'Failed to moderate content',
    }
  }
}

// Keep original function for backwards compatibility (deprecated)
export async function moderateContent(text: string): Promise<ModerationResult> {
  logger.warn('Using deprecated moderateContent without privacy protection')
  // ... original implementation ...
}
```

```typescript
// Task 5: Consent Service
// packages/backend/src/services/consent.service.ts

import { eq, and, desc } from 'drizzle-orm'
import { getDatabase } from '../config/database.js'
import { userConsents } from '../db/schema.js'
import type { ConsentType, ConsentStatus, ConsentRecord } from '@betweenus/shared'

const CURRENT_POLICY_VERSION = '1.0.0' // Update when privacy policy changes
const REQUIRED_CONSENTS: ConsentType[] = ['ai_moderation']

export async function grantConsent(
  userId: string,
  consentType: ConsentType,
  policyVersion: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  const db = getDatabase()

  // Upsert consent record
  const existing = await db
    .select()
    .from(userConsents)
    .where(and(
      eq(userConsents.userId, userId),
      eq(userConsents.consentType, consentType)
    ))
    .limit(1)

  if (existing.length > 0) {
    await db
      .update(userConsents)
      .set({
        granted: true,
        policyVersion,
        grantedAt: new Date(),
        withdrawnAt: null,
        ipAddress,
        userAgent,
        updatedAt: new Date(),
      })
      .where(eq(userConsents.id, existing[0].id))
  } else {
    await db.insert(userConsents).values({
      userId,
      consentType,
      granted: true,
      policyVersion,
      grantedAt: new Date(),
      ipAddress,
      userAgent,
    })
  }
}

export async function withdrawConsent(
  userId: string,
  consentType: ConsentType
): Promise<void> {
  const db = getDatabase()

  await db
    .update(userConsents)
    .set({
      granted: false,
      withdrawnAt: new Date(),
      updatedAt: new Date(),
    })
    .where(and(
      eq(userConsents.userId, userId),
      eq(userConsents.consentType, consentType)
    ))
}

export async function getConsentStatus(userId: string): Promise<ConsentStatus> {
  const db = getDatabase()

  const consents = await db
    .select()
    .from(userConsents)
    .where(eq(userConsents.userId, userId))

  const aiModerationConsent = consents.find(c => c.consentType === 'ai_moderation')

  const hasAllRequired = REQUIRED_CONSENTS.every(type =>
    consents.some(c => c.consentType === type && c.granted)
  )

  return {
    aiModeration: aiModerationConsent?.granted ?? false,
    policyVersion: CURRENT_POLICY_VERSION,
    canPost: hasAllRequired,
  }
}

export async function hasRequiredConsent(userId: string): Promise<boolean> {
  const status = await getConsentStatus(userId)
  return status.canPost
}
```

### Integration Points

```yaml
DATABASE:
  - CREATE userConsents table
  - CREATE anonymizationLogs table
  - RUN drizzle-kit generate && drizzle-kit migrate

CONFIG:
  - ADD to packages/backend/src/index.ts:
    import consentRoutes from './routes/consent.routes.js'
    app.use('/api/consent', consentRoutes)

ENVIRONMENT:
  - ADD PRIVACY_POLICY_VERSION=1.0.0 to .env.example
  - No new API keys required

ROUTES:
  - MODIFY POST /api/posts: Add requireConsent('ai_moderation') middleware
  - ADD /api/consent routes for consent management

MODERATION:
  - MODIFY posts.service.ts: Use moderateContentWithPrivacy instead of moderateContent
  - Pass userId to moderation for audit logging

NAVIGATION:
  - ADD PrivacyConsent to onboarding flow (after signup, before first post)
  - ADD PrivacySettings to settings stack
```

---

## Validation Loop

### Level 1: Syntax & Style

```bash
yarn type-check

# Expected: No type errors

yarn lint

# Expected: No linting errors
```

### Level 2: Unit Tests - Anonymization

```bash
yarn workspace @betweenus/backend test src/services/__tests__/anonymization.service.test.ts

# Test cases:
# ✅ "John Smith called me" → "[NAME_1] called me"
# ✅ "Email me at john@example.com" → "Email me at [EMAIL_1]"
# ✅ "Call 555-123-4567" → "Call [PHONE_1]"
# ✅ "John and Mary both..." → "[NAME_1] and [NAME_2] both..."
# ✅ "No PII here" → "No PII here" (unchanged)
# ✅ Unicode names: "José García" → "[NAME_1]"
# ✅ Multiple formats: "(555) 123-4567" and "555.123.4567" both detected
# PHI detection (strengthens ZDR application):
# ✅ "He gave me herpes" → "He gave me [HEALTH_INFO_1]"
# ✅ "She's diagnosed with bipolar" → "She's diagnosed with [HEALTH_INFO_1]"
# ✅ "He's taking Xanax" → "He's [HEALTH_INFO_1]"
# ✅ "She had an abortion" → "She had an [HEALTH_INFO_1]"
```

### Level 3: Integration Tests

```bash
yarn workspace @betweenus/backend test src/routes/__tests__/consent.routes.test.ts

# Test cases:
# ✅ POST /api/consent grants consent
# ✅ DELETE /api/consent/ai_moderation withdraws consent
# ✅ GET /api/consent/status returns current status
# ✅ POST /api/posts without consent returns 403
# ✅ POST /api/posts with consent succeeds
```

### Level 4: Manual E2E Test

```bash
# Terminal 1: Start backend
yarn workspace @betweenus/backend dev

# Test anonymization directly
curl -X POST http://localhost:3000/api/posts/analyze \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text": "John Smith at john@test.com called me 50 times from 555-123-4567"}'

# Verify in logs that OpenAI received:
# "[NAME_1] at [EMAIL_1] called me 50 times from [PHONE_1]"

# Test consent flow
curl -X POST http://localhost:3000/api/consent \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"consentType": "ai_moderation", "policyVersion": "1.0.0"}'

# Verify consent status
curl http://localhost:3000/api/consent/status \
  -H "Authorization: Bearer USER_TOKEN"

# Expected: {"aiModeration": true, "policyVersion": "1.0.0", "canPost": true}
```

---

## Final Validation Checklist

- [ ] All tests pass: `yarn test`
- [ ] No type errors: `yarn type-check`
- [ ] PII detection works for names, emails, phones, addresses, SSNs
- [ ] Anonymized text sent to OpenAI (verify in logs)
- [ ] Original text stored in database (not anonymized version)
- [ ] Consent required before posting
- [ ] Consent status stored in database with timestamp
- [ ] Anonymization events logged in anonymization_logs table
- [ ] Privacy badge shows on post creation screen
- [ ] Consent screen appears in onboarding flow
- [ ] Privacy settings screen allows viewing consent status
- [ ] Brand voice used in all privacy-related copy

---

## Anti-Patterns to Avoid

### Privacy Anti-Patterns
- Don't store actual PII values in anonymization logs - only categories and counts
- Don't send original text to OpenAI - always anonymize first
- Don't skip consent check for any user - no "trusted user" bypass
- Don't use pre-checked consent boxes - GDPR violation
- Don't make consent withdrawal impossible - must be as easy as granting

### Technical Anti-Patterns
- Don't run PII detection on every keystroke - only on submit
- Don't over-anonymize - "Paris Hilton" the person vs "Paris" the city
- Don't use simple string replace - use indexed replacement to handle overlaps
- Don't log actual PII in application logs - only placeholders
- Don't store anonymization mapping long-term - discard after immediate use

### UX Anti-Patterns
- Don't use scary language about AI - "helps keep the community safe"
- Don't hide privacy settings - make them easily accessible
- Don't require scrolling through walls of text for consent - summarize key points
- Don't make privacy badge look like a warning - it's a positive indicator

---

## Quality Score

### Confidence Level: **8/10**

**Reasons for 8/10:**

**Strong foundations:**
- Clear privacy requirements (GDPR, user trust)
- Well-defined PII categories
- Existing moderation service to build on
- Audit logging patterns from moderation PRP

**Achievable scope:**
- PII detection with regex is straightforward
- Consent management is standard CRUD
- UI changes are minimal
- No new external dependencies required

**Moderate challenges:**
- Name detection accuracy (false positives/negatives)
- International phone number formats
- Edge cases in address detection
- Consent UX that doesn't feel intrusive

**Lower risk areas:**
- Database schema changes are additive
- OpenAI API usage unchanged (just input modified)
- Frontend changes are isolated components

**Mitigation strategies:**
- Start with high-confidence PII patterns (email, phone, SSN)
- Add name detection with lower confidence threshold
- Log false positive reports for pattern improvement
- A/B test consent screen copy for completion rates

**Expected outcome:** Working privacy-preserving moderation system with PII anonymization, user consent flow, and audit logging. Significantly reduces privacy risk from OpenAI API usage while maintaining moderation effectiveness.

---

## Phase 2 (Future Enhancement)

### Local Classifier for BetweenUs-Specific Categories

If OpenAI's gaps (doxxing, false info, impersonation) become problematic:

1. **Train lightweight classifier** - Fine-tune DistilBERT on labeled BetweenUs content
2. **Run on CPU** - No GPU required for ~66M param model
3. **Categories:** doxxing_patterns, spam_indicators, impersonation_signals
4. **Hybrid flow:** Local classifier → OpenAI (anonymized) → Moderation queue

This would eliminate external API calls for BetweenUs-specific categories while still using OpenAI for general hate/violence/harassment detection.

---

## Sources

- [OpenAI Enterprise Privacy](https://openai.com/enterprise-privacy/)
- [OpenAI Moderation API](https://platform.openai.com/docs/guides/moderation)
- [GDPR Article 6 - Lawful Basis](https://gdpr.eu/article-6-how-to-process-personal-data-legally/)
- [GDPR Article 7 - Conditions for Consent](https://gdpr.eu/article-7-how-to-get-consent-to-collect-personal-data/)
