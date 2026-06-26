import { apiGet, wsUrl } from './client'

// ---------------------------------------------------------------------------
// Types — match backend event payload exactly
// ---------------------------------------------------------------------------

export interface BBox {
  x1: number
  y1: number
  x2: number
  y2: number
}

export type Severity = 'low' | 'medium' | 'high' | 'critical'

export interface DetectionEvent {
  id:            string
  eventId:       string
  timestamp:     string
  label:         string
  confidence:    number
  bbox:          BBox
  severity:      Severity
  threatScore:   number
  loiterSeconds: number
  frameId:       number
  source:        string
  identity:      string | null
  personName:    string | null
  alertSent:     boolean
  createdAt:     string
}

export interface EventsStats {
  total:    number
  critical: number
  high:     number
  medium:   number
  today:    number
}

export interface EventsMeta {
  total:      number
  page:       number
  limit:      number
  totalPages: number
}

export interface EventsResponse {
  data: DetectionEvent[]
  meta: EventsMeta
}

export interface EventsQuery {
  page?:     number
  limit?:    number
  severity?: Severity
  label?:    string
  from?:     string
  to?:       string
}

// ---------------------------------------------------------------------------
// REST
// ---------------------------------------------------------------------------

export async function getEvents(query?: EventsQuery): Promise<EventsResponse> {
  const params = new URLSearchParams()
  if (query?.page)     params.set('page',     String(query.page))
  if (query?.limit)    params.set('limit',    String(query.limit))
  if (query?.severity) params.set('severity', query.severity)
  if (query?.label)    params.set('label',    query.label)
  if (query?.from)     params.set('from',     query.from)
  if (query?.to)       params.set('to',       query.to)

  const qs = params.toString()
  return apiGet<EventsResponse>(`/api/events${qs ? `?${qs}` : ''}`)
}

export async function getEventById(id: string): Promise<{ event: DetectionEvent }> {
  return apiGet<{ event: DetectionEvent }>(`/api/events/${id}`)
}

export async function getStats(): Promise<{ stats: EventsStats }> {
  return apiGet<{ stats: EventsStats }>('/api/events/stats')
}

// ---------------------------------------------------------------------------
// WebSocket — real-time detection stream
// ---------------------------------------------------------------------------

export type DetectionCallback = (event: DetectionEvent) => void

/**
 * Connect to the WebSocket for real-time detection events.
 * Handles the { type, timestamp, data } wrapper from the backend.
 * Returns a cleanup function. Automatically reconnects on close.
 */
export function connectDetectionStream(
  onEvent: DetectionCallback,
  onError?: (err: Event) => void,
): () => void {
  let ws: WebSocket | null = null
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null
  let closed = false

  function connect() {
    if (closed) return
    ws = new WebSocket(wsUrl())

    ws.onmessage = (msg) => {
      try {
        const parsed = JSON.parse(msg.data)

        // Backend wraps events: { type: 'event', timestamp, data: DetectionEvent }
        if (parsed.type === 'event' && parsed.data) {
          onEvent(parsed.data as DetectionEvent)
        }
        // Ignore 'connected' handshake messages
      } catch {
        // ignore malformed messages
      }
    }

    ws.onerror = (err) => {
      onError?.(err)
    }

    ws.onclose = () => {
      if (!closed) {
        reconnectTimer = setTimeout(connect, 3000)
      }
    }
  }

  connect()

  return () => {
    closed = true
    if (reconnectTimer) clearTimeout(reconnectTimer)
    ws?.close()
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export const SEVERITY_COLORS: Record<Severity, string> = {
  low:      '#9ca3af',
  medium:   '#facc15',
  high:     '#f97316',
  critical: '#dc2626',
}

export function severityColor(severity: string): string {
  return SEVERITY_COLORS[severity.toLowerCase() as Severity] ?? '#9ca3af'
}

export function severityBg(severity: string): string {
  const map: Record<string, string> = {
    low:      '#f9fafb',
    medium:   '#fefce8',
    high:     '#fff7ed',
    critical: '#fef2f2',
  }
  return map[severity.toLowerCase()] ?? '#f9fafb'
}

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  return `${hrs}h ago`
}