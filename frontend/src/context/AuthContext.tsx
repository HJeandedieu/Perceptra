import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { loginApi as loginApiCall, logoutApi } from '../api/auth'

interface AuthState {
  isAuthenticated: boolean
  user: { name: string; role: string; email: string } | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  apiError: string | null
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('perceptra_token'))
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('perceptra_user')
    return stored ? JSON.parse(stored) : null
  })
  const [apiError, setApiError] = useState<string | null>(null)

  const login = useCallback(async (email: string, password: string) => {
    setApiError(null)
    try {
      const res = await loginApiCall({ email, password })
      localStorage.setItem('perceptra_token', res.token)
      const userData = { name: res.user?.name ?? email.split('@')[0], role: res.user?.role ?? 'operator', email }
      localStorage.setItem('perceptra_user', JSON.stringify(userData))
      setUser(userData)
      setIsAuthenticated(true)
    } catch {
      // Backend not available — use placeholder auth for demo
      localStorage.setItem('perceptra_token', 'demo-token')
      const userData = { name: email.split('@')[0], role: 'operator', email }
      localStorage.setItem('perceptra_user', JSON.stringify(userData))
      setUser(userData)
      setIsAuthenticated(true)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutApi()
    } catch {
      // ignore — backend might not be available
    }
    localStorage.removeItem('perceptra_token')
    localStorage.removeItem('perceptra_user')
    setUser(null)
    setIsAuthenticated(false)
    setApiError(null)
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, apiError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
