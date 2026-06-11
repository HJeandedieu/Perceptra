import { apiGet, apiPatch } from './client'

export interface Alert {
  id: string
  severity: 'Low' | 'Medium' | 'High' | 'Critical'
  title: string
  description: string
  location: string
  timestamp: string
  status: 'active' | 'dismissed'
  meta?: string
  metaIcon?: string
}

export interface AlertsQuery {
  severity?: string
  status?: string
  page?: number
  limit?: number
}

export interface AlertsResponse {
  alerts: Alert[]
  total: number
}

export async function getAlerts(query?: AlertsQuery): Promise<AlertsResponse> {
  const params = new URLSearchParams()
  if (query?.severity) params.set('severity', query.severity)
  if (query?.status) params.set('status', query.status)
  if (query?.page) params.set('page', String(query.page))
  if (query?.limit) params.set('limit', String(query.limit))

  const qs = params.toString()
  return apiGet<AlertsResponse>(`/api/alerts${qs ? `?${qs}` : ''}`)
}

export async function dismissAlert(id: string): Promise<Alert> {
  return apiPatch<Alert>(`/api/alerts/${id}/dismiss`)
}
