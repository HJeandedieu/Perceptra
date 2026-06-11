const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export interface ApiError {
  status: number
  message: string
}

export async function apiGet<T>(path: string): Promise<T> {
  const token = localStorage.getItem('perceptra_token')
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, { headers })
  if (!res.ok) {
    throw { status: res.status, message: res.statusText } satisfies ApiError
  }
  return res.json() as Promise<T>
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const token = localStorage.getItem('perceptra_token')
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    throw { status: res.status, message: res.statusText } satisfies ApiError
  }
  return res.json() as Promise<T>
}

export async function apiPatch<T>(path: string, body?: unknown): Promise<T> {
  const token = localStorage.getItem('perceptra_token')
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PATCH',
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    throw { status: res.status, message: res.statusText } satisfies ApiError
  }
  return res.json() as Promise<T>
}

export function wsUrl(): string {
  const base = import.meta.env.VITE_WS_URL ?? 'ws://localhost:8000'
  return base
}
