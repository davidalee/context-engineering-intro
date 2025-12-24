import axios, { AxiosError } from 'axios'
import { supabase } from '../lib/supabase'
import type { Alert, AlertsResponse } from '@betweenus/shared'

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

type ApiError = {
  success: false
  message: string
}

export interface CreateAlertParams {
  name: string
  location?: string
}

export async function createAlert(params: CreateAlertParams): Promise<Alert> {
  const token = await getAuthToken()
  if (!token) {
    throw new Error('Not authenticated')
  }

  try {
    const response = await apiClient.post<{ success: boolean; message: string; data: Alert }>(
      '/alerts',
      params,
      { headers: getAuthHeaders(token) }
    )
    return response.data.data
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>
    throw new Error(axiosError.response?.data?.message || 'Failed to create alert')
  }
}

export async function getAlerts(): Promise<AlertsResponse> {
  const token = await getAuthToken()
  if (!token) {
    throw new Error('Not authenticated')
  }

  try {
    const response = await apiClient.get<{ success: boolean; data: AlertsResponse }>(
      '/alerts',
      { headers: getAuthHeaders(token) }
    )
    return response.data.data
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>
    throw new Error(axiosError.response?.data?.message || 'Failed to fetch alerts')
  }
}

export async function deleteAlert(alertId: number): Promise<void> {
  const token = await getAuthToken()
  if (!token) {
    throw new Error('Not authenticated')
  }

  try {
    await apiClient.delete(`/alerts/${alertId}`, {
      headers: getAuthHeaders(token),
    })
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>
    throw new Error(axiosError.response?.data?.message || 'Failed to delete alert')
  }
}
