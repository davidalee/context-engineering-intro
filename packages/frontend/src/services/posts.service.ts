import axios, { AxiosError } from 'axios'
import { supabase } from '../lib/supabase'
import type { CreatePostInput, TriggerCategory } from '@betweenus/shared'

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

export type TriggerTooltip = {
  category: TriggerCategory
  message: string
  rewriteOptions: string[]
  matchedText: string
  position: number
}

export type PostData = {
  id: number
  originalText: string
  rewrittenText: string | null
  status: string
  createdAt: string
  footer: string
}

export type CreatePostResponse = {
  success: boolean
  message: string
  data: {
    post: PostData
    analysis: {
      triggerCount: number
      tooltips: TriggerTooltip[]
      requiresReview: boolean
    }
  }
}

export type AnalyzeResponse = {
  success: boolean
  data: {
    triggerCount: number
    tooltips: TriggerTooltip[]
    hasBlockingContent: boolean
    requiresReview: boolean
  }
}

export type RewriteResponse = {
  success: boolean
  message: string
  data: {
    suggestions: string[]
    originalText: string
    triggerCategory: TriggerCategory
  }
}

export type ApiError = {
  success: false
  message: string
  errors?: Array<{ field: string; message: string }>
}

export async function createPost(data: CreatePostInput): Promise<CreatePostResponse> {
  const token = await getAuthToken()
  if (!token) {
    throw new Error('Not authenticated')
  }

  try {
    const response = await apiClient.post<CreatePostResponse>('/posts', data, {
      headers: getAuthHeaders(token),
    })
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>
    throw new Error(axiosError.response?.data?.message || 'Failed to create post')
  }
}

export async function analyzeContent(text: string): Promise<AnalyzeResponse> {
  const token = await getAuthToken()
  if (!token) {
    throw new Error('Not authenticated')
  }

  try {
    const response = await apiClient.post<AnalyzeResponse>(
      '/posts/analyze',
      { text },
      { headers: getAuthHeaders(token) }
    )
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>
    throw new Error(axiosError.response?.data?.message || 'Failed to analyze content')
  }
}

export async function requestRewrite(
  text: string,
  triggerCategory: TriggerCategory
): Promise<RewriteResponse> {
  const token = await getAuthToken()
  if (!token) {
    throw new Error('Not authenticated')
  }

  try {
    const response = await apiClient.post<RewriteResponse>(
      '/posts/rewrite',
      { text, triggerCategory },
      { headers: getAuthHeaders(token) }
    )
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>
    throw new Error(axiosError.response?.data?.message || 'Failed to get rewrite suggestions')
  }
}

export async function getMyPosts(): Promise<PostData[]> {
  const token = await getAuthToken()
  if (!token) {
    throw new Error('Not authenticated')
  }

  try {
    const response = await apiClient.get<{ success: boolean; data: { posts: PostData[] } }>(
      '/posts/me',
      { headers: getAuthHeaders(token) }
    )
    return response.data.data.posts
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>
    throw new Error(axiosError.response?.data?.message || 'Failed to fetch posts')
  }
}
