import axios, { AxiosError } from 'axios'
import { supabase } from '../lib/supabase'
import type { VerificationStatus } from '@betweenus/shared'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api'

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

async function getAuthToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token || null
}

function getAuthHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
  }
}

export interface InitiateVerificationResponse {
  success: boolean
  data: {
    sessionId: string
    verificationUrl: string
  }
}

export interface VerificationStatusData {
  status: VerificationStatus
  provider?: string
  idType?: string
  idCountry?: string
  verifiedAt?: string
  declineReason?: string
}

export interface VerificationStatusResponse {
  success: boolean
  data: VerificationStatusData | null
}

export interface ApiError {
  success: false
  message: string
}

export async function initiateVerification(): Promise<InitiateVerificationResponse> {
  const token = await getAuthToken()
  if (!token) {
    throw new Error('Not authenticated')
  }

  try {
    const response = await apiClient.post<InitiateVerificationResponse>(
      '/verification',
      {},
      { headers: getAuthHeaders(token) }
    )
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>
    throw new Error(axiosError.response?.data?.message || 'Failed to initiate verification')
  }
}

export async function getVerificationStatus(): Promise<VerificationStatusData | null> {
  const token = await getAuthToken()
  if (!token) {
    throw new Error('Not authenticated')
  }

  try {
    const response = await apiClient.get<VerificationStatusResponse>(
      '/verification/status',
      { headers: getAuthHeaders(token) }
    )
    return response.data.data
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>
    throw new Error(axiosError.response?.data?.message || 'Failed to get verification status')
  }
}

export function getStatusDisplayInfo(status: VerificationStatus | null): {
  label: string
  description: string
  color: 'success' | 'warning' | 'error' | 'info'
  canRetry: boolean
} {
  if (!status || status === 'pending') {
    return {
      label: 'Not Verified',
      description: 'Verify your identity to unlock all features',
      color: 'info',
      canRetry: true,
    }
  }

  switch (status) {
    case 'processing':
      return {
        label: 'In Progress',
        description: 'Your verification is being processed',
        color: 'warning',
        canRetry: false,
      }
    case 'approved':
      return {
        label: 'Verified',
        description: 'Your identity has been verified',
        color: 'success',
        canRetry: false,
      }
    case 'denied':
      return {
        label: 'Verification Failed',
        description: 'Your verification was not approved. You can try again.',
        color: 'error',
        canRetry: true,
      }
    case 'error':
      return {
        label: 'Verification Expired',
        description: 'Your session expired. Please try again.',
        color: 'error',
        canRetry: true,
      }
    default:
      return {
        label: 'Unknown',
        description: 'Please contact support',
        color: 'info',
        canRetry: true,
      }
  }
}
