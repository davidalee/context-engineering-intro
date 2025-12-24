import axios, { AxiosError } from 'axios'
import { supabase } from '../lib/supabase'
import type { DashboardData, ActivityItem } from '@betweenus/shared'

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

export type ApiError = {
  success: false
  message: string
  errors?: Array<{ field: string; message: string }>
}

export type DashboardResponse = {
  success: boolean
  data: DashboardData
}

export type ActivityResponse = {
  success: boolean
  data: {
    activity: ActivityItem[]
    hasMore: boolean
    cursor?: string
  }
}

export async function getDashboard(): Promise<DashboardData> {
  const token = await getAuthToken()
  if (!token) {
    throw new Error('Not authenticated')
  }

  try {
    const response = await apiClient.get<DashboardResponse>('/dashboard', {
      headers: getAuthHeaders(token),
    })
    return response.data.data
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>
    throw new Error(axiosError.response?.data?.message || 'Failed to load dashboard')
  }
}

export async function getMoreActivity(cursor: string): Promise<ActivityItem[]> {
  const token = await getAuthToken()
  if (!token) {
    throw new Error('Not authenticated')
  }

  try {
    const response = await apiClient.get<ActivityResponse>('/dashboard/activity', {
      headers: getAuthHeaders(token),
      params: { cursor },
    })
    return response.data.data.activity
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>
    throw new Error(axiosError.response?.data?.message || 'Failed to load activity')
  }
}

export const dashboardService = {
  getDashboard,
  getMoreActivity,
}
