import { useState } from 'react'
import { Link } from 'react-router-dom'

const LOGO_URL =
  'https://lh3.googleusercontent.com/aida/AP1WRLvIwfwhOrhaPU06b2fqE5zcqwt-2Hji0GL1dreeIQJfKNkRa1hDroUmKGVzs7VYNLPQA5R7T_CzSQc5yl7ydS7sRgtbqvRg0s0IY1MZ1zWDjx5mi7c1x4Q3raCbA9tvIh4Ir6Yd86Fo7uDdyrVh5uF4BHN_Nuj6RkeiVzVSMC4zGf4PQjgBDDlzrmGOvVEbJjAEkZC6uJB9wZvETKba9M2EncDsrwOIBxFyxLLLS1s17EcTMrOvW-08AgQ'

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="bg-mesh text-on-surface flex flex-col min-h-screen items-center justify-center relative px-6 py-20 font-body-md overflow-hidden">
      {/* Subtle background movement */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-[120px] animate-subtle-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-[30rem] h-[30rem] bg-threat-critical/5 rounded-full blur-[100px] animate-subtle-pulse-reverse" />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full flex justify-between items-center px-container-margin py-6 z-50">
        <div className="flex items-center gap-3">
          <img alt="Perceptra" className="h-7 w-auto" src={LOGO_URL} />
          <span className="font-headline-xl text-[22px] tracking-tighter text-on-surface">Perceptra</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a className="font-label-sm text-label-sm text-on-surface-variant opacity-50 hover:opacity-100 transition-opacity" href="#">
            System Support
          </a>
          <span className="material-symbols-outlined text-on-surface-variant opacity-50 cursor-pointer hover:opacity-100 transition-opacity">
            help_outline
          </span>
        </div>
      </header>

      {/* Page Header — centered above the card */}
      <div className="text-center mb-10 z-10">
        <div className="flex justify-center mb-5">
          <div className="p-4 rounded-full bg-primary/10 border border-primary/20">
            <img alt="Perceptra" className="h-14 w-14" src={LOGO_URL} />
          </div>
        </div>
        <h1 className="font-headline-xl text-[56px] leading-[64px] text-text-heading mb-3 tracking-tight">
          Create your terminal account
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mx-auto">
          Initialize your secure access point to the Obsidian Vigil protocol.
        </p>
      </div>

      {/* Main Card */}
      <main className="w-full max-w-[420px] z-10">
        <div
          className="rounded-xl relative overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.8)',
          }}
        >
          {/* Top edge light */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-glass-stroke to-transparent" />

          <div className="p-6">
            {/* Form */}
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              {/* Email */}
              <div className="space-y-1.5">
                <label className="font-label-caps text-label-caps text-on-surface-variant block ml-1">Work Email</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-50 text-lg">
                    alternate_email
                  </span>
                  <input
                    type="email"
                    placeholder="name@corporation.com"
                    className="w-full py-3 pl-10 pr-4 rounded-lg text-on-surface font-body-md text-sm placeholder:opacity-30 outline-none transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#7c3aed'
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'
                      e.currentTarget.style.boxShadow = '0 0 15px rgba(124, 58, 237, 0.2)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="font-label-caps text-label-caps text-on-surface-variant block ml-1">Create Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-50 text-lg">
                    lock_open
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    className="w-full py-3 pl-10 pr-10 rounded-lg text-on-surface font-body-md text-sm placeholder:opacity-30 outline-none transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#7c3aed'
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'
                      e.currentTarget.style.boxShadow = '0 0 15px rgba(124, 58, 237, 0.2)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  />
                  <button
                    type="button"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
                <p className="text-[10px] text-on-surface-variant opacity-60 ml-1">Minimum 12 characters with security symbols.</p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 rounded-lg font-headline-md text-[15px] text-on-primary-container flex items-center justify-center gap-2 group cursor-pointer transition-all"
                style={{ background: '#7c3aed' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = 'brightness(1.2)'
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(124, 58, 237, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = 'brightness(1)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                Initialize Deployment
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 pt-1">
                <div className="h-px flex-grow bg-glass-stroke" />
                <span className="font-label-caps text-[11px] text-on-surface-variant opacity-40">OR</span>
                <div className="h-px flex-grow bg-glass-stroke" />
              </div>

              {/* Google OAuth */}
              <button
                type="button"
                className="w-full py-3 rounded-lg flex items-center justify-center gap-3 text-sm font-medium text-on-surface transition-all cursor-pointer"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'
                }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M12 5.04c1.9 0 3.53.7 4.8 1.84l3.6-3.63C18.2 1.36 15.3 0 12 0 7.33 0 3.3 2.67 1.3 6.6l4.22 3.27C6.53 7.15 9.04 5.04 12 5.04z" fill="#EA4335" />
                  <path d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.76 2.91c2.2-2.02 3.66-5.01 3.66-8.73z" fill="#4285F4" />
                  <path d="M5.52 14.13c-.24-.72-.37-1.49-.37-2.13s.13-1.41.37-2.13L1.3 6.6C.47 8.23 0 10.06 0 12s.47 3.77 1.3 5.4l4.22-3.27z" fill="#FBBC05" />
                  <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.76-2.91c-1.1.74-2.5 1.18-4.17 1.18-3.2 0-5.91-2.16-6.88-5.07l-4.22 3.27C3.3 21.33 7.33 24 12 24z" fill="#34A853" />
                </svg>
                Continue with Google
              </button>
            </form>

            {/* Footer */}
            <div className="mt-5 pt-4 border-t border-glass-stroke text-center">
              <p className="font-body-md text-sm text-on-surface-variant">
                Already have a terminal?{' '}
                <Link className="text-primary font-semibold hover:underline underline-offset-4" to="/login">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* External Links */}
        <div className="mt-6 flex justify-center gap-5 opacity-60">
          <a className="font-label-sm text-[10px] text-on-surface-variant hover:text-primary transition-colors" href="#">
            Privacy Policy
          </a>
          <a className="font-label-sm text-[10px] text-on-surface-variant hover:text-primary transition-colors" href="#">
            Terms of Service
          </a>
          <a className="font-label-sm text-[10px] text-on-surface-variant hover:text-primary transition-colors" href="#">
            System Status
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full flex flex-col md:flex-row justify-between items-center px-container-margin py-4 opacity-60 pointer-events-none">
        <p className="font-label-sm text-[10px] text-on-surface-variant">
          &copy; 2024 Perceptra Obsidian Vigil. Secured by Command Center Protocol.
        </p>
        <div className="flex gap-3 mt-1 md:mt-0 font-label-caps text-[10px] text-primary">
          <span>READY_FOR_INITIALIZATION</span>
          <span className="animate-pulse">_</span>
        </div>
      </footer>

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
