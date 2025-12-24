import { z } from 'zod'

export const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
})

export const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const magicLinkSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export const verifyOtpSchema = z.object({
  email: z.string().email(),
  token: z.string().length(6, 'Code must be 6 digits'),
})

export const mfaEnrollSchema = z.object({
  factorType: z.enum(['totp']),
  friendlyName: z.string().optional(),
})

export const mfaVerifySchema = z.object({
  factorId: z.string().uuid(),
  challengeId: z.string().uuid(),
  code: z.string().length(6, 'Code must be 6 digits'),
})

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  avatarUrl: z.string().url().optional(),
  bio: z.string().max(500).optional(),
})

export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type MagicLinkInput = z.infer<typeof magicLinkSchema>
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>
export type MFAEnrollInput = z.infer<typeof mfaEnrollSchema>
export type MFAVerifyInput = z.infer<typeof mfaVerifySchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
