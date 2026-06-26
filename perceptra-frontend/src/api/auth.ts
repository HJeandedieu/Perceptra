import { apiPost, apiGet } from './client'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  message: string
  token: string
  user: {
    id: string
    name: string
    email: string
    role: 'ADMIN' | 'OPERATOR'
  }
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  role?: 'ADMIN' | 'OPERATOR'
}

export interface RegisterResponse {
  message: string
  token: string
  user: {
    id: string
    name: string
    email: string
    role: 'ADMIN' | 'OPERATOR'
  }
}

export interface MeResponse {
  user: {
    id: string
    name: string
    email: string
    role: 'ADMIN' | 'OPERATOR'
    createdAt: string
  }
}

export async function loginApi(credentials: LoginRequest): Promise<LoginResponse> {
  return apiPost<LoginResponse>('/api/auth/login', credentials)
}

export async function registerApi(data: RegisterRequest): Promise<RegisterResponse> {
  return apiPost<RegisterResponse>('/api/auth/register', data)
}

export async function getMeApi(): Promise<MeResponse> {
  return apiGet<MeResponse>('/api/auth/me')
}