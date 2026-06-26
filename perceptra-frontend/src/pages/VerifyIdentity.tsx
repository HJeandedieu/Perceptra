import { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function VerifyIdentity() {
  const navigate = useNavigate()
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])
  const [verifying, setVerifying] = useState(false)
  const [resent, setResent] = useState(false)

  const setInputRef = (el: HTMLInputElement | null, i: number) => {
    inputsRef.current[i] = el
  }

  const handleInput = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '')
    e.target.value = val
    if (val.length === 1 && index < 5) inputsRef.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    pasted.split('').forEach((char, i) => {
      if (inputsRef.current[i]) {
        inputsRef.current[i]!.value = char
      }
    })
    inputsRef.current[Math.min(pasted.length, 5)]?.focus()
  }

  useEffect(() => {
    inputsRef.current[0]?.focus()
  }, [])

  const handleVerify = () => {
    setVerifying(true)
    setTimeout(() => navigate('/live-feed'), 1500)
  }

  const handleResend = () => {
    setResent(true)
    setTimeout(() => setResent(false), 3000)
  }

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#F8F8F6',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', fontFamily: "'Inter', sans-serif", padding: '24px',
    }}>

      {/* Header */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 40px', height: '64px',
        backgroundColor: 'rgba(248,248,246,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E5E7EB', zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            backgroundColor: '#1E1E1E', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#D4A017', fontVariationSettings: "'FILL' 1" }}>
              visibility
            </span>
          </div>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#1E1E1E', letterSpacing: '-0.02em' }}>
            Perceptra
          </span>
        </div>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#6B7280', textDecoration: 'none' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>help_outline</span>
          Help
        </a>
      </header>

      {/* Card */}
      <main style={{ width: '100%', maxWidth: '420px', marginTop: '64px' }}>
        <div style={{
          backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB',
          borderRadius: '16px', padding: '40px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          textAlign: 'center',
        }}>

          {/* Icon */}
          <div style={{
            width: '56px', height: '56px', borderRadius: '14px',
            backgroundColor: '#FFFBEB', border: '1px solid #FDE68A',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#D4A017', fontVariationSettings: "'FILL' 1" }}>
              shield_lock
            </span>
          </div>

          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1E1E1E', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
            Verify Your Identity
          </h1>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 32px', lineHeight: 1.6 }}>
            We sent a 6-digit code to{' '}
            <span style={{ color: '#1E1E1E', fontWeight: 600 }}>n***@perceptra.ai</span>
          </p>

          {/* OTP Inputs */}
          <div
            onPaste={handlePaste}
            style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '32px' }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <input
                key={i}
                ref={(el) => setInputRef(el, i)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                autoComplete="one-time-code"
                onChange={handleInput(i)}
                onKeyDown={handleKeyDown(i)}
                style={{
                  width: '48px', height: '56px', textAlign: 'center',
                  fontSize: '22px', fontWeight: 700, color: '#1E1E1E',
                  border: '1.5px solid #E5E7EB', borderRadius: '10px',
                  backgroundColor: '#F9FAFB', outline: 'none',
                  transition: 'border-color 0.15s ease, background-color 0.15s ease',
                  fontFamily: "'Inter', sans-serif",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#D4A017'
                  e.currentTarget.style.backgroundColor = '#FFFBEB'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212,160,23,0.12)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#E5E7EB'
                  e.currentTarget.style.backgroundColor = '#F9FAFB'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={verifying}
            style={{
              width: '100%', padding: '13px',
              backgroundColor: verifying ? '#9CA3AF' : '#1E1E1E',
              color: '#FFFFFF', border: 'none', borderRadius: '9px',
              fontSize: '14px', fontWeight: 700,
              cursor: verifying ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'background-color 0.2s ease', marginBottom: '20px',
            }}
          >
            {verifying ? (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', animation: 'spin 1s linear infinite' }}>sync</span>
                Verifying...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                Verify & Continue
              </>
            )}
          </button>

          {/* Resend */}
          <div>
            <p style={{ fontSize: '13px', color: '#9CA3AF', margin: '0 0 8px' }}>
              Didn't receive the code?
            </p>
            <button
              onClick={handleResend}
              disabled={resent}
              style={{
                background: 'none', border: 'none', cursor: resent ? 'default' : 'pointer',
                fontSize: '13px', fontWeight: 700,
                color: resent ? '#10B981' : '#D4A017',
                display: 'inline-flex', alignItems: 'center', gap: '4px',
              }}
            >
              {resent ? (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>check_circle</span>
                  Code sent!
                </>
              ) : 'Resend code'}
            </button>
          </div>
        </div>

        {/* Security note */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '20px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#9CA3AF' }}>lock</span>
          <span style={{ fontSize: '12px', color: '#9CA3AF' }}>End-to-end encrypted verification</span>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 40px', height: '52px',
        borderTop: '1px solid #E5E7EB', backgroundColor: 'rgba(248,248,246,0.95)',
      }}>
        <span style={{ fontSize: '12px', color: '#9CA3AF' }}>© 2026 Perceptra. All rights reserved.</span>
        <div style={{ display: 'flex', gap: '20px' }}>
          {['Privacy Policy', 'Terms', 'System Status'].map((l) => (
            <a key={l} href="#" style={{ fontSize: '12px', color: '#9CA3AF', textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
      </footer>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}