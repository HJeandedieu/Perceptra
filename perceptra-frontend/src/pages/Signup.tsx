import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LOGO_URL =
  'https://lh3.googleusercontent.com/aida/AP1WRLvIwfwhOrhaPU06b2fqE5zcqwt-2Hji0GL1dreeIQJfKNkRa1hDroUmKGVzs7VYNLPQA5R7T_CzSQc5yl7ydS7sRgtbqvRg0s0IY1MZ1zWDjx5mi7c1x4Q3raCbA9tvIh4Ir6Yd86Fo7uDdyrVh5uF4BHN_Nuj6RkeiVzVSMC4zGf4PQjgBDDlzrmGOvVEbJjAEkZC6uJB9wZvETKba9M2EncDsrwOIBxFyxLLLS1s17EcTMrOvW-08AgQ'

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: '', color: '#E5E7EB' }
  let score = 0
  if (password.length >= 8)  score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  if (score <= 1) return { score: 1, label: 'Weak',   color: '#DC2626' }
  if (score <= 3) return { score: 2, label: 'Fair',   color: '#FACC15' }
  if (score === 4) return { score: 3, label: 'Good',  color: '#10B981' }
  return { score: 4, label: 'Strong', color: '#10B981' }
}

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false)
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const navigate  = useNavigate()
  const { register } = useAuth() as any

  const strength = useMemo(() => getPasswordStrength(password), [password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    try {
      await register?.({ name, email, password })
      navigate('/live-feed')
    } catch (err: any) {
      setError(err?.message ?? 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#F8F8F6' }}>

      {/* ── Left brand panel ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 p-10"
        style={{ background: '#FFFFFF', borderRight: '1px solid #E5E7EB' }}
      >
        {/* Logo */}
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

        {/* Value props */}
        <div>
          <h2
            className="font-bold mb-6 leading-tight"
            style={{ fontSize: 28, color: '#1E1E1E', letterSpacing: '-0.02em' }}
          >
            Start monitoring<br />threats in minutes.
          </h2>

          <div className="space-y-4">
            {[
              {
                icon: 'sensors',
                title: 'Live AI Detection',
                desc: 'YOLOv8 engine streams detections in real time via WebSocket.',
              },
              {
                icon: 'notifications_active',
                title: 'Instant Alerts',
                desc: 'High and critical threats trigger immediate notifications.',
              },
              {
                icon: 'analytics',
                title: 'Threat Analytics',
                desc: 'Historical event data with severity trends and identity tracking.',
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 mt-0.5"
                  style={{ background: '#FEF3C7', border: '1px solid #FCD34D' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#D4A017' }}>
                    {item.icon}
                  </span>
                </div>
                <div>
                  <p className="font-semibold" style={{ fontSize: 13, color: '#1E1E1E' }}>{item.title}</p>
                  <p style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <p style={{ fontSize: 11, color: '#D1D5DB' }}>
          © {new Date().getFullYear()} Perceptra. Enterprise AI Surveillance.
        </p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 animate-fade-in">

        {/* Mobile logo */}
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
              Create your account
            </h1>
            <p style={{ fontSize: 14, color: '#6B7280' }}>
              Set up your operator profile to access the dashboard.
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

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="section-label">Full Name</label>
              <div className="relative">
                <span
                  className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ fontSize: 18, color: '#9CA3AF' }}
                >
                  person
                </span>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jean de Dieu"
                  required
                  className="p-input w-full py-2.5 pl-10 pr-4"
                  style={{ fontSize: 14 }}
                />
              </div>
            </div>

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
              <label htmlFor="password" className="section-label">Password</label>
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
                  placeholder="Min. 8 characters"
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

              {/* Password strength bar */}
              {password && (
                <div className="space-y-1 animate-fade-in">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className="h-1 flex-1 rounded-full transition-colors duration-300"
                        style={{
                          background: level <= strength.score ? strength.color : '#E5E7EB',
                        }}
                      />
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: strength.color, fontWeight: 500 }}>
                    {strength.label} password
                  </p>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="p-btn-primary w-full py-2.5 flex items-center justify-center gap-2 mt-2"
              style={{ fontSize: 14, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <>
                  <span
                    className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
                    style={{ display: 'inline-block' }}
                  />
                  <span>Creating account…</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1" style={{ background: '#E5E7EB' }} />
              <span className="section-label">or</span>
              <div className="h-px flex-1" style={{ background: '#E5E7EB' }} />
            </div>

            {/* Google OAuth */}
            <button
              type="button"
              className="p-btn-secondary w-full py-2.5 flex items-center justify-center gap-2.5"
              style={{ fontSize: 14 }}
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path d="M12 5.04c1.9 0 3.53.7 4.8 1.84l3.6-3.63C18.2 1.36 15.3 0 12 0 7.33 0 3.3 2.67 1.3 6.6l4.22 3.27C6.53 7.15 9.04 5.04 12 5.04z" fill="#EA4335" />
                <path d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.76 2.91c2.2-2.02 3.66-5.01 3.66-8.73z" fill="#4285F4" />
                <path d="M5.52 14.13c-.24-.72-.37-1.49-.37-2.13s.13-1.41.37-2.13L1.3 6.6C.47 8.23 0 10.06 0 12s.47 3.77 1.3 5.4l4.22-3.27z" fill="#FBBC05" />
                <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.76-2.91c-1.1.74-2.5 1.18-4.17 1.18-3.2 0-5.91-2.16-6.88-5.07l-4.22 3.27C3.3 21.33 7.33 24 12 24z" fill="#34A853" />
              </svg>
              Continue with Google
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-5 space-y-4" style={{ borderTop: '1px solid #E5E7EB' }}>
            <p className="text-center" style={{ fontSize: 13, color: '#6B7280' }}>
              Already have an account?{' '}
              <Link
                to="/login"
                style={{ color: '#D4A017', fontWeight: 600 }}
                className="hover:underline underline-offset-4"
              >
                Sign in
              </Link>
            </p>

            <div className="flex items-center justify-center gap-4">
              {['Privacy Policy', 'Terms of Service'].map((label) => (
                <a
                  key={label}
                  href="#"
                  style={{ fontSize: 11, color: '#9CA3AF' }}
                  className="hover:underline underline-offset-4"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}