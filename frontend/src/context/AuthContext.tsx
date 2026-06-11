import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface AuthState {
  isAuthenticated: boolean
  user: { name: string; role: string; email: string } | null
  login: (email: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('perceptra_token'))
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('perceptra_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = useCallback((email: string) => {
    // Placeholder — will call POST /api/auth/login in integration
    localStorage.setItem('perceptra_token', 'placeholder-jwt')
    const userData = { name: email.split('@')[0], role: 'operator', email }
    localStorage.setItem('perceptra_user', JSON.stringify(userData))
    setUser(userData)
    setIsAuthenticated(true)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('perceptra_token')
    localStorage.removeItem('perceptra_user')
    setUser(null)
    setIsAuthenticated(false)
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
