import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { loginApi, registerApi } from '../api/auth'
import type { RegisterRequest } from '../api/auth'

interface UserState {
  id?:   string
  name:  string
  email: string
  role:  string
}

interface AuthState {
  isAuthenticated: boolean
  user:            UserState | null
  login:           (email: string, password: string) => Promise<void>
  register:        (data: RegisterRequest) => Promise<void>
  logout:          () => void
  apiError:        string | null
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem('perceptra_token'),
  )

  const [user, setUser] = useState<UserState | null>(() => {
    const stored = localStorage.getItem('perceptra_user')
    return stored ? JSON.parse(stored) : null
  })

  const [apiError, setApiError] = useState<string | null>(null)

  // ------------------------------------------------------------------
  // Login
  // ------------------------------------------------------------------
  const login = useCallback(async (email: string, password: string) => {
    setApiError(null)
    try {
      const res = await loginApi({ email, password })

      const userData: UserState = {
        id:    res.user.id,
        name:  res.user.name,
        email: res.user.email,
        role:  res.user.role,
      }

      localStorage.setItem('perceptra_token', res.token)
      localStorage.setItem('perceptra_user',  JSON.stringify(userData))
      setUser(userData)
      setIsAuthenticated(true)

    } catch (err: unknown) {
      const message =
        (err as { message?: string })?.message ?? 'Login failed. Please try again.'
      setApiError(message)
      throw err
    }
  }, [])

  // ------------------------------------------------------------------
  // Register
  // ------------------------------------------------------------------
  const register = useCallback(async (data: RegisterRequest) => {
    setApiError(null)
    try {
      const res = await registerApi(data)

      const userData: UserState = {
        id:    res.user.id,
        name:  res.user.name,
        email: res.user.email,
        role:  res.user.role,
      }

      localStorage.setItem('perceptra_token', res.token)
      localStorage.setItem('perceptra_user',  JSON.stringify(userData))
      setUser(userData)
      setIsAuthenticated(true)

    } catch (err: unknown) {
      const message =
        (err as { message?: string })?.message ?? 'Registration failed. Please try again.'
      setApiError(message)
      throw err
    }
  }, [])

  // ------------------------------------------------------------------
  // Logout
  // ------------------------------------------------------------------
  const logout = useCallback(() => {
    localStorage.removeItem('perceptra_token')
    localStorage.removeItem('perceptra_user')
    setUser(null)
    setIsAuthenticated(false)
    setApiError(null)
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout, apiError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}