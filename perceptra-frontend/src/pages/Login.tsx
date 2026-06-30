import { useState } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LOGO_URL =
  'https://perceptra-phi.vercel.app/favicon.svg'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail]       = useState('niel@perceptra.intel')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const navigate = useNavigate()
  const { isAuthenticated, login } = useAuth()

  if (isAuthenticated) return <Navigate to="/live-feed" replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/live-feed')
    } catch {
      setError('Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#F8F8F6' }}>

      {/* ── Left brand panel ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 p-10"
        style={{
          background: '#FFFFFF',
          borderRight: '1px solid #E5E7EB',
        }}
      >
        {/* Logo + wordmark */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-xl"
            style={{ background: '#FEF3C7', border: '1px solid #FCD34D' }}
          >
            <img alt="Perceptra" className="h-5 w-5 object-contain" src={LOGO_URL} />
          </div>
          <span className="font-bold" style={{ fontSize: 16, color: '#1E1E1E', letterSpacing: '-0.01em' }}>
            Perceptra
          </span>
        </div>

        {/* Center copy */}
        <div>
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
            style={{ background: '#F0FDF4', border: '1px solid #A7F3D0' }}
          >
            <span className="status-dot status-dot-online status-dot-pulse" />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#065F46', letterSpacing: '0.05em' }}>
              AI ENGINE ONLINE
            </span>
          </div>

          <h2
            className="font-bold mb-4 leading-tight"
            style={{ fontSize: 28, color: '#1E1E1E', letterSpacing: '-0.02em' }}
          >
            Real-time threat<br />detection for the<br />modern enterprise.
          </h2>

          <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.6 }}>
            Perceptra combines computer vision AI with live surveillance feeds to detect, classify, and alert on threats as they happen.
          </p>
        </div>

        {/* Bottom system info */}
        <div className="space-y-2">
          {[
            { icon: 'sensors',     label: 'YOLOv8 Detection Engine' },
            { icon: 'lock',        label: 'JWT Secured API Layer' },
            { icon: 'bolt',        label: 'WebSocket Live Streaming' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2.5">
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#D4A017' }}>
                {item.icon}
              </span>
              <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500 }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 animate-fade-in">

        {/* Mobile logo (shown only on small screens) */}
        <div className="flex items-center gap-3 mb-10 lg:hidden">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-xl"
            style={{ background: '#FEF3C7', border: '1px solid #FCD34D' }}
          >
            <img alt="Perceptra" className="h-5 w-5 object-contain" src={LOGO_URL} />
          </div>
          <span className="font-bold" style={{ fontSize: 16, color: '#1E1E1E' }}>Perceptra</span>
        </div>

        <div className="w-full max-w-[380px]">
          {/* Heading */}
          <div className="mb-8">
            <h1
              className="font-bold mb-1 leading-tight"
              style={{ fontSize: 24, color: '#1E1E1E', letterSpacing: '-0.02em' }}
            >
              Sign in to your account
            </h1>
            <p style={{ fontSize: 14, color: '#6B7280' }}>
              Enter your credentials to access the dashboard.
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-lg mb-6 animate-fade-in"
              style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}
            >
              <span className="material-symbols-outlined flex-shrink-0" style={{ fontSize: 18, color: '#DC2626' }}>
                error
              </span>
              <p style={{ fontSize: 13, color: '#991B1B' }}>{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="section-label">Work Email</label>
              <div className="relative">
                <span
                  className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ fontSize: 18, color: '#9CA3AF' }}
                >
                  alternate_email
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="p-input w-full py-2.5 pl-10 pr-4"
                  style={{ fontSize: 14 }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="section-label">Password</label>
                <Link
                  to="/reset-password"
                  style={{ fontSize: 12, color: '#D4A017', fontWeight: 500 }}
                  className="hover:underline underline-offset-4"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <span
                  className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ fontSize: 18, color: '#9CA3AF' }}
                >
                  lock
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="p-input w-full py-2.5 pl-10 pr-11"
                  style={{ fontSize: 14 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: '#9CA3AF', lineHeight: 1 }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="p-btn-primary w-full py-2.5 flex items-center justify-center gap-2"
              style={{ fontSize: 14, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <>
                  <span
                    className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
                    style={{ display: 'inline-block' }}
                  />
                  <span>Signing in…</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 space-y-3" style={{ borderTop: '1px solid #E5E7EB' }}>
            <p className="text-center" style={{ fontSize: 13, color: '#6B7280' }}>
              Don't have an account?{' '}
              <Link
                to="/signup"
                style={{ color: '#D4A017', fontWeight: 600 }}
                className="hover:underline underline-offset-4"
              >
                Create account
              </Link>
            </p>
          </div>

          {/* Trust badges */}
          <div className="mt-8 flex items-center justify-center gap-5">
            <div className="flex items-center gap-1.5">
              <span className="status-dot status-dot-online" />
              <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500 }}>Systems Online</span>
            </div>
            <div style={{ width: 1, height: 12, background: '#E5E7EB' }} />
            <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500 }}>AES-256 Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  )
}