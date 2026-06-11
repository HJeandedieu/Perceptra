import { useState } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LOGO_URL =
  'https://lh3.googleusercontent.com/aida/AP1WRLvIwfwhOrhaPU06b2fqE5zcqwt-2Hji0GL1dreeIQJfKNkRa1hDroUmKGVzs7VYNLPQA5R7T_CzSQc5yl7ydS7sRgtbqvRg0s0IY1MZ1zWDjx5mi7c1x4Q3raCbA9tvIh4Ir6Yd86Fo7uDdyrVh5uF4BHN_Nuj6RkeiVzVSMC4zGf4PQjgBDDlzrmGOvVEbJjAEkZC6uJB9wZvETKba9M2EncDsrwOIBxFyxLLLS1s17EcTMrOvW-08AgQ'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('niel@perceptra.intel')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { isAuthenticated, login } = useAuth()

  // Already logged in — go straight to dashboard
  if (isAuthenticated) {
    return <Navigate to="/live-feed" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email, password)
    navigate('/live-feed')
  }

  return (
    <div className="bg-mesh min-h-screen flex flex-col items-center justify-center p-gutter overflow-hidden font-body-md text-text-body relative">
      {/* Subtle background movement */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-[120px] animate-subtle-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-[30rem] h-[30rem] bg-threat-critical/5 rounded-full blur-[100px] animate-subtle-pulse-reverse" />
      </div>

      {/* Page Header — centered above the card */}
      <div className="text-center mb-10 z-10">
        <div className="flex justify-center mb-5">
          <div className="p-4 rounded-full bg-primary/10 border border-primary/20">
            <img alt="Perceptra" className="h-14 w-14 object-contain" src={LOGO_URL} />
          </div>
        </div>
        <h1 className="font-headline-xl text-[56px] leading-[64px] text-text-heading mb-3 tracking-tight">
          Perceptra
        </h1>
        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-[0.2em] max-w-md mx-auto">
          Secure Access Terminal
        </p>
      </div>

      {/* Login Container */}
      <main className="relative z-10 w-full max-w-[420px]">
        {/* Glass Card */}
        <section className="bg-glass-surface backdrop-blur-[30px] border border-glass-stroke rounded-xl glass-glow p-8 flex flex-col gap-6 shadow-2xl">
          {/* Login Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="space-y-1.5 group">
              <label className="font-label-caps text-label-caps text-on-surface-variant ml-1" htmlFor="email">
                Work Email
              </label>
              <div className="relative input-glow transition-all duration-300 rounded-lg">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                  alternate_email
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-surface-container/30 border border-glass-stroke rounded-lg py-3 pl-12 pr-4 text-text-body font-body-md focus:ring-0 focus:border-primary/40 placeholder:text-outline/50 transition-all backdrop-blur-sm outline-none"
                  onFocus={(e) => (e.currentTarget.parentElement!.style.transform = 'scale(1.01)')}
                  onBlur={(e) => (e.currentTarget.parentElement!.style.transform = 'scale(1)')}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5 group">
              <div className="flex justify-between items-center px-1">
                <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="password">
                  Security Key
                </label>
                <Link className="font-label-sm text-label-sm text-primary hover:text-text-heading transition-colors" to="/reset-password">
                  Forgot Key?
                </Link>
              </div>
              <div className="relative input-glow transition-all duration-300 rounded-lg">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                  lock
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your security key"
                  className="w-full bg-surface-container/30 border border-glass-stroke rounded-lg py-3 pl-12 pr-12 text-text-body font-body-md focus:ring-0 focus:border-primary/40 placeholder:text-outline/50 transition-all backdrop-blur-sm outline-none"
                  onFocus={(e) => (e.currentTarget.parentElement!.style.transform = 'scale(1.01)')}
                  onBlur={(e) => (e.currentTarget.parentElement!.style.transform = 'scale(1)')}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-text-heading transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-primary-container hover:bg-inverse-primary text-on-primary-container font-headline-md text-[16px] py-3.5 rounded-lg transition-all duration-300 transform active:scale-[0.98] shadow-[0_10px_30px_-10px_rgba(124,58,237,0.5)] flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Sign In</span>
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
            </button>
          </form>

          {/* Footer Links */}
          <div className="pt-4 border-t border-glass-stroke text-center space-y-3">
            <p className="font-body-md text-sm text-on-surface-variant">
              Don&apos;t have a terminal?{' '}
              <Link className="text-primary font-semibold hover:underline underline-offset-4" to="/signup">
                Create one
              </Link>
            </p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              Internal System.{' '}
              <a
                className="text-text-heading underline decoration-primary/30 underline-offset-4 hover:decoration-primary transition-all"
                href="#"
              >
                Report unauthorized access
              </a>
            </p>
          </div>
        </section>

        {/* System Status */}
        <div className="mt-6 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-threat-low shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <span className="font-label-sm text-label-sm text-on-surface-variant">Global Nodes Online</span>
          </div>
          <div className="w-px h-3 bg-glass-stroke" />
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Encryption: 256-bit AES</span>
          </div>
        </div>
      </main>

      {/* SVG Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern height="40" id="grid" patternUnits="userSpaceOnUse" width="40">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect fill="url(#grid)" height="100%" width="100%" />
        </svg>
      </div>
    </div>
  )
}
