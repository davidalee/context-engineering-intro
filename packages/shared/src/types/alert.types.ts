export interface Alert {
  id: number
  searchName: string
  location: string | null
  isActive: boolean
  lastMatchedAt: string | null
  createdAt: string
}

export interface AlertsResponse {
  alerts: Alert[]
  limit: number
  current: number
}
