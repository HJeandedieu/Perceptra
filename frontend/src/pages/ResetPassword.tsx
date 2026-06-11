import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

const LOGO_URL =
  'https://lh3.googleusercontent.com/aida/AP1WRLvIwfwhOrhaPU06b2fqE5zcqwt-2Hji0GL1dreeIQJfKNkRa1hDroUmKGVzs7VYNLPQA5R7T_CzSQc5yl7ydS7sRgtbqvRg0s0IY1MZ1zWDjx5mi7c1x4Q3raCbA9tvIh4Ir6Yd86Fo7uDdyrVh5uF4BHN_Nuj6RkeiVzVSMC4zGf4PQjgBDDlzrmGOvVEbJjAEkZC6uJB9wZvETKba9M2EncDsrwOIBxFyxLLLS1s17EcTMrOvW-08AgQ'

export default function ResetPassword() {
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const glowRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (!glowRef.current) return
      const x = (e.clientX / window.innerWidth) * 20 - 10
      const y = (e.clientY / window.innerHeight) * 20 - 10
      glowRef.current.style.transform = `translate(${x}px, ${y}px)`
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      setDone(true)
      setSubmitting(false)
      setTimeout(() => setDone(false), 2000)
    }, 1500)
  }

  return (
    <div className="flex items-center justify-center min-h-screen relative bg-background text-on-surface overflow-hidden">
      {/* Ambient glow */}
      <div
        ref={glowRef}
        className="absolute"
        style={{
          width: 600,
          height: 600,
          borderRadius: '50%',
          top: -150,
          left: -150,
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, rgba(124, 58, 237, 0) 70%)',
          filter: 'blur(80px)',
          zIndex: -1,
          transition: 'transform 0.1s ease-out',
        }}
      />
      <div
        className="absolute"
        style={{
          width: 600,
          height: 600,
          borderRadius: '50%',
          bottom: -150,
          right: -150,
          background: 'radial-gradient(circle, rgba(115, 46, 228, 0.12) 0%, rgba(115, 46, 228, 0) 70%)',
          filter: 'blur(80px)',
          zIndex: -1,
        }}
      />

      {/* Scanline */}
      <div
        className="absolute z-0 pointer-events-none"
        style={{
          width: '100%',
          height: 100,
          background: 'linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(210,187,255,0.03) 50%, rgba(0,0,0,0) 100%)',
          opacity: 0.1,
          animation: 'scanline 8s linear infinite',
        }}
      />

      {/* Header */}
      <header className="fixed top-0 w-full flex justify-between items-center px-container-margin py-8 z-50">
        <div className="flex items-center gap-3">
          <img alt="Perceptra" className="h-8 w-auto" src={LOGO_URL} />
          <span className="font-headline-xl text-[24px] tracking-tighter text-on-surface">Perceptra</span>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant opacity-50 cursor-pointer hover:opacity-100 transition-opacity">
          help_outline
        </span>
      </header>

      {/* Main */}
      <main className="w-full max-w-[480px] px-6 relative z-10">
        <div
          className="rounded-xl p-glass-padding md:p-8 space-y-8 animate-[fadeIn_0.7s_ease]"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary-container/20 flex items-center justify-center border border-primary/20">
                <span className="material-symbols-outlined text-primary text-4xl">lock_reset</span>
              </div>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-text-heading">Reset Terminal Password</h1>
            <p className="font-body-md text-body-md text-on-surface-variant opacity-70">
              Execute protocol to re-establish secure access.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Old Password */}
            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-primary block px-1" htmlFor="old_password">
                Old Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-xl">key</span>
                <input
                  id="old_password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-surface-container-low border border-glass-stroke rounded-lg py-3.5 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/30 outline-none transition-all"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#d2bbff'
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(210, 187, 255, 0.2)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = ''
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-primary block px-1" htmlFor="new_password">
                New Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-xl">shield_lock</span>
                <input
                  id="new_password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-surface-container-low border border-glass-stroke rounded-lg py-3.5 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/30 outline-none transition-all"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#d2bbff'
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(210, 187, 255, 0.2)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = ''
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              </div>
              {/* Strength bar */}
              <div className="flex gap-1 mt-2 px-1">
                <div className="h-1 flex-1 bg-threat-low/20 rounded-full overflow-hidden">
                  <div className="h-full bg-threat-low w-full" />
                </div>
                <div className="h-1 flex-1 bg-surface-variant rounded-full" />
                <div className="h-1 flex-1 bg-surface-variant rounded-full" />
                <div className="h-1 flex-1 bg-surface-variant rounded-full" />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-primary block px-1" htmlFor="confirm_password">
                Confirm New Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-xl">verified_user</span>
                <input
                  id="confirm_password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-surface-container-low border border-glass-stroke rounded-lg py-3.5 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/30 outline-none transition-all"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#d2bbff'
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(210, 187, 255, 0.2)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = ''
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              ref={btnRef}
              type="submit"
              disabled={submitting}
              className={`w-full font-headline-md text-headline-md py-4 rounded-lg flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-70 ${
                done ? 'bg-threat-low' : 'bg-primary-container'
              } text-on-primary-container shadow-lg shadow-primary-container/20`}
            >
              {submitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin">sync</span>
                  <span>Syncing...</span>
                </>
              ) : done ? (
                <>
                  <span className="material-symbols-outlined">check_circle</span>
                  <span>Protocol Confirmed</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">security</span>
                  <span>Update Password</span>
                </>
              )}
            </button>
          </form>

          {/* Back link */}
          <div className="pt-2 text-center">
            <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center gap-1 group" to="/login">
              <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
              Return to Mission Hub
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full flex flex-col md:flex-row justify-between items-center px-container-margin py-6 opacity-60 z-50">
        <div className="font-label-caps text-label-caps text-primary">
          &copy; 2024 Perceptra Obsidian Vigil. Secured by Command Center Protocol.
        </div>
        <div className="flex gap-6 mt-4 md:mt-0 font-label-sm text-label-sm text-on-surface-variant">
          <a className="hover:text-primary transition-colors underline-offset-4 hover:underline" href="#">Privacy Policy</a>
          <a className="hover:text-primary transition-colors underline-offset-4 hover:underline" href="#">Terms of Service</a>
          <a className="hover:text-primary transition-colors underline-offset-4 hover:underline" href="#">System Status</a>
        </div>
      </footer>

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  )
}
