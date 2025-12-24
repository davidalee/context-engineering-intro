export type AppRole = 'admin' | 'moderator' | 'member'

export type VerificationStatus =
  | 'not_started'
  | 'in_progress'
  | 'approved'
  | 'declined'
  | 'kyc_expired'
  | 'in_review'
  | 'expired'
  | 'abandoned'

export interface AuthUser {
  id: string
  email: string
  emailConfirmedAt?: string
  phone?: string
  createdAt: string
  updatedAt: string
  appMetadata: Record<string, unknown>
  userMetadata: Record<string, unknown>
}

export interface UserProfile {
  id: string
  email: string
  fullName: string | null
  avatarUrl: string | null
  bio: string | null
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface UserWithRole extends AuthUser {
  role: AppRole
}

export interface AuthSession {
  accessToken: string
  refreshToken: string
  expiresIn: number
  expiresAt?: number
  tokenType: string
  user: AuthUser
}

export interface MFAFactor {
  id: string
  friendlyName: string | null
  factorType: 'totp' | 'phone'
  status: 'verified' | 'unverified'
  createdAt: string
  updatedAt: string
}

export interface MFAChallenge {
  id: string
  factorId: string
  expiresAt: string
}

export interface VerificationResult {
  status: VerificationStatus
  provider: string
  idType?: string
  idCountry?: string
  verifiedAt?: string
  rejectReason?: string
}
