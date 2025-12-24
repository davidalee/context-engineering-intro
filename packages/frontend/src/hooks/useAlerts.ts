import { useState, useCallback, useEffect } from 'react'
import type { Alert } from '@betweenus/shared'
import {
  getAlerts,
  createAlert as createAlertApi,
  deleteAlert as deleteAlertApi,
} from '../services/alerts.service'

interface UseAlertsState {
  alerts: Alert[]
  isLoading: boolean
  error: string | null
  limit: number
  current: number
}

interface UseAlertsReturn extends UseAlertsState {
  fetchAlerts: () => Promise<void>
  createAlert: (name: string, location?: string) => Promise<Alert | null>
  deleteAlert: (alertId: number) => Promise<boolean>
  canCreateMore: boolean
}

export function useAlerts(): UseAlertsReturn {
  const [state, setState] = useState<UseAlertsState>({
    alerts: [],
    isLoading: false,
    error: null,
    limit: 5,
    current: 0,
  })

  const fetchAlerts = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await getAlerts()
      setState(prev => ({
        ...prev,
        alerts: response.alerts,
        limit: response.limit,
        current: response.current,
        isLoading: false,
      }))
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to fetch alerts',
        isLoading: false,
      }))
    }
  }, [])

  const createAlert = useCallback(async (name: string, location?: string): Promise<Alert | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const alert = await createAlertApi({ name, location })
      setState(prev => ({
        ...prev,
        alerts: [...prev.alerts, alert],
        current: prev.current + 1,
        isLoading: false,
      }))
      return alert
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to create alert',
        isLoading: false,
      }))
      return null
    }
  }, [])

  const deleteAlert = useCallback(async (alertId: number): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      await deleteAlertApi(alertId)
      setState(prev => ({
        ...prev,
        alerts: prev.alerts.filter(a => a.id !== alertId),
        current: Math.max(0, prev.current - 1),
        isLoading: false,
      }))
      return true
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to delete alert',
        isLoading: false,
      }))
      return false
    }
  }, [])

  useEffect(() => {
    fetchAlerts()
  }, [fetchAlerts])

  return {
    ...state,
    fetchAlerts,
    createAlert,
    deleteAlert,
    canCreateMore: state.current < state.limit,
  }
}
