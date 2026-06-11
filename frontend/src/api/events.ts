import { apiGet, wsUrl } from './client'

export interface DetectionEvent {
  id: string
  timestamp: string
  label: string
  confidence: number
  severity: 'Low' | 'Medium' | 'High' | 'Critical'
  camera_id: string
  camera_name?: string
}

export interface EventsQuery {
  from?: string
  to?: string
  severity?: string
  page?: number
  limit?: number
}

export interface EventsResponse {
  events: DetectionEvent[]
  total: number
  page: number
  limit: number
}

export async function getEvents(query?: EventsQuery): Promise<EventsResponse> {
  const params = new URLSearchParams()
  if (query?.from) params.set('from', query.from)
  if (query?.to) params.set('to', query.to)
  if (query?.severity) params.set('severity', query.severity)
  if (query?.page) params.set('page', String(query.page))
  if (query?.limit) params.set('limit', String(query.limit))

  const qs = params.toString()
  return apiGet<EventsResponse>(`/api/events${qs ? `?${qs}` : ''}`)
}

export type DetectionCallback = (event: DetectionEvent) => void

/**
 * Connect to the WebSocket for real-time detection events.
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
        const event: DetectionEvent = JSON.parse(msg.data)
        onEvent(event)
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
