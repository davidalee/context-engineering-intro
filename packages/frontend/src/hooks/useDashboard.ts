import { useState, useEffect, useCallback } from 'react'
import { dashboardService } from '../services/dashboard.service'
import type { DashboardData } from '@betweenus/shared'

interface UseDashboardResult {
  data: DashboardData | null
  isLoading: boolean
  error: Error | null
  refresh: () => Promise<void>
  loadMoreActivity: () => Promise<void>
  isLoadingMore: boolean
}

export function useDashboard(): UseDashboardResult {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchDashboard = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await dashboardService.getDashboard()
      setData(response)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load dashboard'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refresh = useCallback(async () => {
    await fetchDashboard()
  }, [fetchDashboard])

  const loadMoreActivity = useCallback(async () => {
    if (!data?.hasMore || !data?.cursor || isLoadingMore) return

    try {
      setIsLoadingMore(true)
      const moreActivity = await dashboardService.getMoreActivity(data.cursor)
      setData((prev) => prev ? {
        ...prev,
        activity: [...prev.activity, ...moreActivity],
        hasMore: moreActivity.length >= 10,
        cursor: moreActivity.length > 0 ? moreActivity[moreActivity.length - 1].id : prev.cursor,
      } : prev)
    } catch (err) {
      console.error('Failed to load more activity:', err)
    } finally {
      setIsLoadingMore(false)
    }
  }, [data, isLoadingMore])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  return {
    data,
    isLoading,
    error,
    refresh,
    loadMoreActivity,
    isLoadingMore,
  }
}
