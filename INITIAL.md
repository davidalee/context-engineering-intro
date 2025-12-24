## FEATURE:

Authentication
- Sign-up with identity verification (selfies, AI facial analysis, government ID), linking to existing communities
- Login with 2FA, passwordless options (magic links, biometrics)
- User roles/permissions (admin, moderator, member)
- OAuth/social logins (Google, Facebook, Apple)

Posting content (Main feature; make sure we get this right.)
- Anonymous posting of "profiles" of an individual (i.e. someone they went on a date with recently); identity verification behind-the-scenes to prevent sockpuppets
- Text-based posts with rich formatting
- See docs/COMMUNITY_GUIDELINES.md for community guidelines
- See docs/RULES_POSTING_FRAMEWORK.md for posting rules
- See docs/INLINE_TOOLTIPS.md for inline tooltips and rewriting options to help users comply with posting rules
- Prompts to guide users on what to include (date details, behavior observed, context)
- Photo uploads on profiles and comments

Dashboard
- The first screen users see after logging in
- Overview of recent activity, alerts, comments, flags
- Quick actions (post new content, view alerts, manage profile)

Search
- Name search
- Image search (reverse image search for profile pics)
- Keyword search (for prompts)
- Location-based filtering
- Saved alerts for specific names

Privacy/Security
- Screenshot blocking
- Screen-record prevention

Third-party integrations
- Identity verification APIs
- Background checks (optional paid feature)
- Sex offender registries
- Reverse image search APIs

Moderation
- Reporting
- Admin tools
  - User management (ban, suspend, warn)
  - Post management (edit, remove, flag)
- Content review queues
- Automated moderation (AI-based content flagging)
- Moderation guidelines based on docs/BRAND_VOICE_GUIDE.md
- Moderator training materials
- Audit logs for moderator actions
- Appeals process for users

Notifications
- Push alerts for name matches, new comments, etc.

## TECH STACK

- Frontend
React Native + TypeScript

- Backend
Node.js + Express + TypeScript

- Hosting
Vercel

- Database
PostgreSQL + Drizzle ORM + full-text search

- Authentication
Supabase Auth + custom identity verification flow

- Content moderation
Automated flagging (OpenAI moderation API, Hive) + human review queue

- Real-time
WebSockets for live updates

- Legal/compliance
Solid data retention policies, GDPR/CCPA compliance, legal review process

- Trust & safety tooling
User reporting, appeals, audit logs


## Third-Party APIs
- Identity verification (Jumio, Onfido, or similar)
- Background check APIs (Checkr, GoodHire)
- Payment processing (Stripe, RevenueCat for subscriptions)
