import { apiPost } from './client'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  role: 'admin' | 'operator'
  expires_at: string
  user: {
    name: string
    email: string
    role: string
  }
}

export async function loginApi(credentials: LoginRequest): Promise<LoginResponse> {
  return apiPost<LoginResponse>('/api/auth/login', credentials)
}

export async function logoutApi(): Promise<void> {
  await apiPost<void>('/api/auth/logout', {})
}

export interface RegisterRequest {
  email: string
  password: string
}

export interface RegisterResponse {
  id: string
  email: string
  role: string
}

export async function registerApi(data: RegisterRequest): Promise<RegisterResponse> {
  return apiPost<RegisterResponse>('/api/auth/register', data)
}
