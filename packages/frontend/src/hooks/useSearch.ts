import { useState, useCallback, useRef } from 'react'
import type { SearchType, SearchResult, ImageSearchResult, SearchResponse } from '@betweenus/shared'
import {
  searchByName,
  searchByKeyword,
  searchByImage,
  type SearchParams,
  type ImageSearchParams,
} from '../services/search.service'

interface UseSearchState {
  results: SearchResult[] | ImageSearchResult[]
  isLoading: boolean
  error: string | null
  hasMore: boolean
  cursor: string | undefined
  searchType: SearchType
}

interface UseSearchReturn extends UseSearchState {
  search: (type: SearchType, query: string, location?: string) => Promise<void>
  searchImage: (imageData: string, location?: string) => Promise<void>
  loadMore: () => Promise<void>
  clearResults: () => void
  setSearchType: (type: SearchType) => void
}

export function useSearch(): UseSearchReturn {
  const [state, setState] = useState<UseSearchState>({
    results: [],
    isLoading: false,
    error: null,
    hasMore: false,
    cursor: undefined,
    searchType: 'name',
  })

  const lastQueryRef = useRef<string>('')
  const lastLocationRef = useRef<string | undefined>()

  const search = useCallback(async (type: SearchType, query: string, location?: string) => {
    if (!query.trim()) {
      setState(prev => ({ ...prev, results: [], hasMore: false, cursor: undefined }))
      return
    }

    setState(prev => ({ ...prev, isLoading: true, error: null, searchType: type }))
    lastQueryRef.current = query
    lastLocationRef.current = location

    try {
      const params: SearchParams = { query, location }
      let response: SearchResponse

      if (type === 'name') {
        response = await searchByName(params)
      } else {
        response = await searchByKeyword(params)
      }

      setState(prev => ({
        ...prev,
        results: response.results,
        hasMore: response.hasMore,
        cursor: response.cursor,
        isLoading: false,
      }))
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Search failed',
        isLoading: false,
      }))
    }
  }, [])

  const searchImage = useCallback(async (imageData: string, location?: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null, searchType: 'image' }))
    lastLocationRef.current = location

    try {
      const params: ImageSearchParams = { imageData, location }
      const response = await searchByImage(params)

      setState(prev => ({
        ...prev,
        results: response.results,
        hasMore: false,
        cursor: undefined,
        isLoading: false,
      }))
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Image search failed',
        isLoading: false,
      }))
    }
  }, [])

  const loadMore = useCallback(async () => {
    if (!state.hasMore || state.isLoading || !state.cursor) {
      return
    }

    setState(prev => ({ ...prev, isLoading: true }))

    try {
      const params: SearchParams = {
        query: lastQueryRef.current,
        location: lastLocationRef.current,
        cursor: state.cursor,
      }

      let response: SearchResponse
      if (state.searchType === 'name') {
        response = await searchByName(params)
      } else {
        response = await searchByKeyword(params)
      }

      setState(prev => ({
        ...prev,
        results: [...prev.results, ...response.results],
        hasMore: response.hasMore,
        cursor: response.cursor,
        isLoading: false,
      }))
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to load more results',
        isLoading: false,
      }))
    }
  }, [state.hasMore, state.isLoading, state.cursor, state.searchType])

  const clearResults = useCallback(() => {
    setState(prev => ({
      ...prev,
      results: [],
      hasMore: false,
      cursor: undefined,
      error: null,
    }))
    lastQueryRef.current = ''
    lastLocationRef.current = undefined
  }, [])

  const setSearchType = useCallback((type: SearchType) => {
    setState(prev => ({ ...prev, searchType: type }))
  }, [])

  return {
    ...state,
    search,
    searchImage,
    loadMore,
    clearResults,
    setSearchType,
  }
}
