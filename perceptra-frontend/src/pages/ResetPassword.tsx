import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ResetPassword() {
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [strength, setStrength] = useState(0)

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    let score = 0
    if (val.length >= 8) score++
    if (/[A-Z]/.test(val)) score++
    if (/[0-9]/.test(val)) score++
    if (/[^A-Za-z0-9]/.test(val)) score++
    setStrength(score)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      setDone(true)
      setSubmitting(false)
    }, 1500)
  }

  const strengthColors = ['#E5E7EB', '#DC2626', '#F97316', '#FACC15', '#10B981']
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong']

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
      <main style={{ width: '100%', maxWidth: '440px', marginTop: '64px' }}>
        {!done ? (
          <div style={{
            backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB',
            borderRadius: '16px', padding: '40px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          }}>
            {/* Icon */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '14px',
                backgroundColor: '#FFFBEB', border: '1px solid #FDE68A',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#D4A017', fontVariationSettings: "'FILL' 1" }}>
                  lock_reset
                </span>
              </div>
              <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1E1E1E', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                Reset Password
              </h1>
              <p style={{ fontSize: '14px', color: '#6B7280', margin: 0, lineHeight: 1.5 }}>
                Create a new secure password for your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Old Password */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Current Password
                </label>
                <div style={{ position: 'relative' }}>
                  <span className="material-symbols-outlined" style={{
                    position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                    fontSize: '18px', color: '#9CA3AF', pointerEvents: 'none',
                  }}>key</span>
                  <input
                    type="password"
                    required
                    placeholder="Enter current password"
                    style={{
                      width: '100%', padding: '11px 12px 11px 40px',
                      fontSize: '14px', border: '1px solid #E5E7EB', borderRadius: '9px',
                      color: '#1E1E1E', backgroundColor: '#F9FAFB', outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#D4A017'; e.currentTarget.style.backgroundColor = '#FFFFFF' }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.backgroundColor = '#F9FAFB' }}
                  />
                </div>
              </div>

              {/* New Password */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  New Password
                </label>
                <div style={{ position: 'relative' }}>
                  <span className="material-symbols-outlined" style={{
                    position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                    fontSize: '18px', color: '#9CA3AF', pointerEvents: 'none',
                  }}>shield_lock</span>
                  <input
                    type="password"
                    required
                    placeholder="At least 12 characters"
                    onChange={handlePasswordChange}
                    style={{
                      width: '100%', padding: '11px 12px 11px 40px',
                      fontSize: '14px', border: '1px solid #E5E7EB', borderRadius: '9px',
                      color: '#1E1E1E', backgroundColor: '#F9FAFB', outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#D4A017'; e.currentTarget.style.backgroundColor = '#FFFFFF' }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.backgroundColor = '#F9FAFB' }}
                  />
                </div>
                {/* Strength meter */}
                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} style={{
                        flex: 1, height: '3px', borderRadius: '2px',
                        backgroundColor: strength >= i ? strengthColors[strength] : '#E5E7EB',
                        transition: 'background-color 0.2s ease',
                      }} />
                    ))}
                  </div>
                  {strength > 0 && (
                    <p style={{ fontSize: '12px', color: strengthColors[strength], margin: 0, fontWeight: 600 }}>
                      {strengthLabels[strength]}
                    </p>
                  )}
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Confirm New Password
                </label>
                <div style={{ position: 'relative' }}>
                  <span className="material-symbols-outlined" style={{
                    position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                    fontSize: '18px', color: '#9CA3AF', pointerEvents: 'none',
                  }}>verified_user</span>
                  <input
                    type="password"
                    required
                    placeholder="Repeat new password"
                    style={{
                      width: '100%', padding: '11px 12px 11px 40px',
                      fontSize: '14px', border: '1px solid #E5E7EB', borderRadius: '9px',
                      color: '#1E1E1E', backgroundColor: '#F9FAFB', outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#D4A017'; e.currentTarget.style.backgroundColor = '#FFFFFF' }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.backgroundColor = '#F9FAFB' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: '100%', padding: '13px',
                  backgroundColor: submitting ? '#9CA3AF' : '#1E1E1E',
                  color: '#FFFFFF', border: 'none', borderRadius: '9px',
                  fontSize: '14px', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'background-color 0.2s ease', marginTop: '4px',
                }}
              >
                {submitting ? (
                  <>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', animation: 'spin 1s linear infinite' }}>sync</span>
                    Updating...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>security</span>
                    Update Password
                  </>
                )}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Link to="/login" style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                fontSize: '13px', color: '#6B7280', textDecoration: 'none', fontWeight: 500,
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span>
                Back to login
              </Link>
            </div>
          </div>
        ) : (
          <div style={{
            backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB',
            borderRadius: '16px', padding: '48px 40px', textAlign: 'center',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#10B981', fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1E1E1E', margin: '0 0 8px', letterSpacing: '-0.01em' }}>
              Password Updated
            </h2>
            <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 28px' }}>
              Your password has been changed successfully.
            </p>
            <Link to="/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '11px 24px', backgroundColor: '#1E1E1E', color: '#FFFFFF',
              borderRadius: '9px', fontSize: '14px', fontWeight: 700, textDecoration: 'none',
            }}>
              Back to Login
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
            </Link>
          </div>
        )}
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