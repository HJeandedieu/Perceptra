import { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const LOGO_URL =
  'https://lh3.googleusercontent.com/aida/AP1WRLvIwfwhOrhaPU06b2fqE5zcqwt-2Hji0GL1dreeIQJfKNkRa1hDroUmKGVzs7VYNLPQA5R7T_CzSQc5yl7ydS7sRgtbqvRg0s0IY1MZ1zWDjx5mi7c1x4Q3raCbA9tvIh4Ir6Yd86Fo7uDdyrVh5uF4BHN_Nuj6RkeiVzVSMC4zGf4PQjgBDDlzrmGOvVEbJjAEkZC6uJB9wZvETKba9M2EncDsrwOIBxFyxLLLS1s17EcTMrOvW-08AgQ'

export default function VerifyIdentity() {
  const navigate = useNavigate()
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  const setInputRef = (el: HTMLInputElement | null, i: number) => {
    inputsRef.current[i] = el
  }

  const handleInput = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length === 1 && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  // Focus first input on mount
  useEffect(() => {
    inputsRef.current[0]?.focus()
  }, [])

  // Particles effect
  useEffect(() => {
    const interval = setInterval(() => {
      const particle = document.createElement('div')
      particle.className = 'particle'
      const size = Math.random() * 3 + 1
      particle.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        background: #d2bbff;
        border-radius: 50%;
        pointer-events: none;
        z-index: 0;
        left: ${Math.random() * 100}vw;
        top: ${Math.random() * 100}vh;
        opacity: ${Math.random() * 0.5};
      `
      document.body.appendChild(particle)

      const animation = particle.animate(
        [
          { transform: 'translate(0, 0)', opacity: parseFloat(particle.style.opacity) },
          {
            transform: `translate(${(Math.random() - 0.5) * 100}px, ${(Math.random() - 0.5) * 100}px)`,
            opacity: 0,
          },
        ],
        { duration: 3000 + Math.random() * 5000, easing: 'ease-out' }
      )
      animation.onfinish = () => particle.remove()
    }, 200)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-mesh min-h-screen flex flex-col items-center justify-center p-6 text-on-surface relative overflow-hidden">
      {/* Subtle background movement */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-[120px] animate-subtle-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-[30rem] h-[30rem] bg-threat-critical/5 rounded-full blur-[100px] animate-subtle-pulse-reverse" />
      </div>
      {/* Header */}
      <header className="fixed top-0 w-full flex justify-between items-center px-container-margin py-8 z-50">
        <div className="flex items-center gap-3">
          <img alt="Perceptra" className="h-8 w-auto" src={LOGO_URL} />
          <span className="font-headline-xl text-[24px] tracking-tighter text-on-surface">Perceptra</span>
        </div>
        <button className="text-primary hover:opacity-100 transition-opacity opacity-50 cursor-pointer">
          <span className="material-symbols-outlined">help_outline</span>
        </button>
      </header>

      {/* Main */}
      <main className="relative z-10 w-full max-w-lg">
        <div
          className="rounded-xl p-glass-padding md:p-10 relative overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.15)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.8)',
          }}
        >
          {/* Scan line */}
          <div className="scan-line" />

          <div className="flex flex-col items-center text-center space-y-6">
            {/* Icon */}
            <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(124,58,237,0.4)]">
              <span
                className="material-symbols-outlined text-4xl text-on-primary-container"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified_user
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="font-headline-lg text-headline-lg text-text-heading">Verify your identity</h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mx-auto">
                We&apos;ve sent a 6-digit code to <span className="text-primary font-medium">n***@perceptra.intel</span>
              </p>
            </div>

            {/* OTP Inputs */}
            <div className="flex gap-2 md:gap-4 justify-center py-4" id="otp-container">
              {Array.from({ length: 6 }).map((_, i) => (
                <input
                  key={i}
                  ref={(el) => setInputRef(el, i)}
                  autoComplete="one-time-code"
                  maxLength={1}
                  type="text"
                  className="otp-input w-12 h-14 md:w-16 md:h-20 text-center font-headline-md text-headline-md text-primary rounded-lg"
                  onChange={handleInput(i)}
                  onKeyDown={handleKeyDown(i)}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="w-full space-y-6 pt-4">
              <button
                className="w-full py-4 bg-primary-container hover:bg-opacity-90 text-on-primary-container font-headline-md text-headline-md rounded-lg transition-all transform active:scale-[0.98] shadow-lg cursor-pointer"
                onClick={() => navigate('/live-feed')}
              >
                Verify &amp; Continue
              </button>
              <div className="flex flex-col items-center space-y-2">
                <p className="font-label-sm text-label-sm text-on-surface-variant opacity-60">Didn&apos;t receive the code?</p>
                <button className="font-label-caps text-label-caps text-primary hover:underline underline-offset-4 transition-all cursor-pointer">
                  Resend code
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security badge */}
        <div className="mt-8 flex items-center justify-center space-x-2 text-on-surface-variant opacity-40">
          <span className="material-symbols-outlined text-sm">lock</span>
          <span className="font-label-sm text-label-sm">End-to-End Encrypted Verification Protocol</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full flex flex-col md:flex-row justify-between items-center px-container-margin py-6 z-50 opacity-60">
        <div className="font-label-caps text-label-caps text-primary">
          &copy; 2024 Perceptra Obsidian Vigil. Secured by Command Center Protocol.
        </div>
        <div className="flex space-x-6 mt-4 md:mt-0 font-label-sm text-label-sm text-on-surface-variant">
          <a className="hover:text-primary transition-colors hover:underline underline-offset-4" href="#">Privacy Policy</a>
          <a className="hover:text-primary transition-colors hover:underline underline-offset-4" href="#">Terms of Service</a>
          <a className="hover:text-primary transition-colors hover:underline underline-offset-4" href="#">System Status</a>
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
