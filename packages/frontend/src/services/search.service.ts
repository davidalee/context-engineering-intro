import axios, { AxiosError } from 'axios'
import { supabase } from '../lib/supabase'
import type { SearchResponse, ImageSearchResponse, SearchType } from '@betweenus/shared'

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

export interface SearchParams {
  query: string
  location?: string
  cursor?: string
  limit?: number
}

export interface ImageSearchParams {
  imageData: string
  location?: string
  limit?: number
}

export async function searchByName(params: SearchParams): Promise<SearchResponse> {
  const token = await getAuthToken()
  if (!token) {
    throw new Error('Not authenticated')
  }

  try {
    const queryParams = new URLSearchParams()
    queryParams.set('query', params.query)
    if (params.location) queryParams.set('location', params.location)
    if (params.cursor) queryParams.set('cursor', params.cursor)
    if (params.limit) queryParams.set('limit', String(params.limit))

    const response = await apiClient.get<{ success: boolean; data: SearchResponse }>(
      `/search/name?${queryParams.toString()}`,
      { headers: getAuthHeaders(token) }
    )
    return response.data.data
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>
    throw new Error(axiosError.response?.data?.message || 'Search failed')
  }
}

export async function searchByKeyword(params: SearchParams): Promise<SearchResponse> {
  const token = await getAuthToken()
  if (!token) {
    throw new Error('Not authenticated')
  }

  try {
    const queryParams = new URLSearchParams()
    queryParams.set('query', params.query)
    if (params.location) queryParams.set('location', params.location)
    if (params.cursor) queryParams.set('cursor', params.cursor)
    if (params.limit) queryParams.set('limit', String(params.limit))

    const response = await apiClient.get<{ success: boolean; data: SearchResponse }>(
      `/search/keyword?${queryParams.toString()}`,
      { headers: getAuthHeaders(token) }
    )
    return response.data.data
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>
    throw new Error(axiosError.response?.data?.message || 'Search failed')
  }
}

export async function searchByImage(params: ImageSearchParams): Promise<ImageSearchResponse> {
  const token = await getAuthToken()
  if (!token) {
    throw new Error('Not authenticated')
  }

  try {
    const response = await apiClient.post<{ success: boolean; data: ImageSearchResponse }>(
      '/search/image',
      params,
      { headers: getAuthHeaders(token) }
    )
    return response.data.data
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>
    throw new Error(axiosError.response?.data?.message || 'Image search failed')
  }
}

export async function search(
  type: SearchType,
  params: SearchParams | ImageSearchParams
): Promise<SearchResponse | ImageSearchResponse> {
  switch (type) {
    case 'name':
      return searchByName(params as SearchParams)
    case 'keyword':
      return searchByKeyword(params as SearchParams)
    case 'image':
      return searchByImage(params as ImageSearchParams)
    default:
      throw new Error(`Unknown search type: ${type}`)
  }
}
