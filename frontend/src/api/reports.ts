import { apiGet } from './client'

export interface ReportStats {
  total_incidents: number
  avg_confidence: number
  critical_alerts: number
  active_time_hours: number
  incident_trend: number
}

export interface ReportEvent {
  id: string
  label: string
  severity: 'Low' | 'Medium' | 'High' | 'Critical'
  confidence: number
  timestamp: string
}

export interface ReportsResponse {
  stats: ReportStats
  chart: { date: string; count: number; severity?: string }[]
  events: ReportEvent[]
  total: number
}

export interface ReportsQuery {
  range?: '7d' | '30d' | '90d'
  page?: number
  limit?: number
}

export async function getReports(query?: ReportsQuery): Promise<ReportsResponse> {
  const params = new URLSearchParams()
  if (query?.range) params.set('range', query.range)
  if (query?.page) params.set('page', String(query.page))
  if (query?.limit) params.set('limit', String(query.limit))

  const qs = params.toString()
  return apiGet<ReportsResponse>(`/api/reports${qs ? `?${qs}` : ''}`)
}
