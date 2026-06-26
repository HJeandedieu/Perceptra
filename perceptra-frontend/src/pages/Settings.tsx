import { useState } from 'react'
import Sidebar from '../components/Sidebar'

type Section = 'profile' | 'notifications' | 'system' | 'api' | 'security'

const NAV: { id: Section; icon: string; label: string }[] = [
  { id: 'profile',       icon: 'manage_accounts', label: 'Profile' },
  { id: 'notifications', icon: 'notifications',   label: 'Notifications' },
  { id: 'system',        icon: 'tune',            label: 'System' },
  { id: 'api',           icon: 'api',             label: 'API & Integration' },
  { id: 'security',      icon: 'shield',          label: 'Security' },
]

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      style={{
        width: '44px', height: '24px', borderRadius: '12px', border: 'none',
        backgroundColor: enabled ? '#D4A017' : '#E5E7EB', cursor: 'pointer',
        position: 'relative', transition: 'background-color 0.2s ease', flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: '3px',
        left: enabled ? '22px' : '3px',
        width: '18px', height: '18px', borderRadius: '50%',
        backgroundColor: '#FFFFFF', transition: 'left 0.2s ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  )
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 0', borderBottom: '1px solid #F3F4F6', gap: '24px',
    }}>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#1E1E1E', margin: '0 0 2px' }}>{label}</p>
        {description && <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>{description}</p>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  )
}

function SectionCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div style={{
      backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px',
      overflow: 'hidden', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      <div style={{ padding: '18px 24px', borderBottom: '1px solid #F3F4F6' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1E1E1E', margin: '0 0 2px' }}>{title}</h3>
        {description && <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>{description}</p>}
      </div>
      <div style={{ padding: '0 24px 4px' }}>{children}</div>
    </div>
  )
}

function InputField({ label, defaultValue, type = 'text', placeholder, readOnly }: {
  label: string; defaultValue?: string; type?: string; placeholder?: string; readOnly?: boolean
}) {
  return (
    <div style={{ padding: '16px 0', borderBottom: '1px solid #F3F4F6' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '7px' }}>
        {label}
      </label>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        readOnly={readOnly}
        style={{
          width: '100%', padding: '9px 12px', fontSize: '14px',
          border: '1px solid #E5E7EB', borderRadius: '8px',
          color: '#1E1E1E', backgroundColor: readOnly ? '#F3F4F6' : '#F9FAFB',
          outline: 'none', boxSizing: 'border-box',
          fontFamily: type === 'password' ? 'monospace' : 'inherit',
        }}
      />
    </div>
  )
}

export default function Settings() {
  const [section, setSection] = useState<Section>('profile')
  const [notifs, setNotifs] = useState({ email: true, sms: false, critical: true, high: true, medium: false, low: false, digest: true })
  const [system, setSystem] = useState({ autoRetrain: true, loiterDetect: true, nightMode: false, auditLog: true })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ backgroundColor: '#F8F8F6', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>

      <Sidebar />

      <div style={{ marginLeft: '256px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* Top Bar */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 40,
          height: '64px', backgroundColor: 'rgba(248,248,246,0.97)',
          backdropFilter: 'blur(12px)', borderBottom: '1px solid #E5E7EB',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px',
        }}>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#1E1E1E', margin: 0, letterSpacing: '-0.01em' }}>
              Settings
            </h1>
            <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>System configuration & preferences</p>
          </div>
          <button
            onClick={handleSave}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 18px', borderRadius: '8px', border: 'none',
              backgroundColor: saved ? '#10B981' : '#1E1E1E', color: '#FFFFFF',
              fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              transition: 'background-color 0.2s ease',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
              {saved ? 'check' : 'save'}
            </span>
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </header>

        <main style={{ padding: '28px 32px 48px', flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '24px', maxWidth: '1100px' }}>

            {/* Settings Nav */}
            <div style={{
              backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px',
              padding: '8px', height: 'fit-content', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
              {NAV.map((item) => {
                const active = section === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setSection(item.id)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '10px 12px', borderRadius: '8px', border: 'none',
                      cursor: 'pointer', textAlign: 'left', fontSize: '13px', fontWeight: 500,
                      backgroundColor: active ? '#FFFBEB' : 'transparent',
                      color: active ? '#D4A017' : '#6B7280',
                      transition: 'all 0.15s ease', marginBottom: '2px',
                    }}
                  >
                    <span className="material-symbols-outlined" style={{
                      fontSize: '18px', fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
                    }}>{item.icon}</span>
                    {item.label}
                  </button>
                )
              })}
            </div>

            {/* Content */}
            <div>

              {section === 'profile' && (
                <>
                  <SectionCard title="Personal Information" description="Update your account details and display name.">
                    <InputField label="Full Name" defaultValue="Jean de Dieu Hashimweyesu" />
                    <InputField label="Email Address" defaultValue="jean@perceptra.ai" type="email" />
                    <InputField label="Job Title" defaultValue="System Administrator" />
                    <InputField label="Organization" defaultValue="Perceptra Security Operations" />
                  </SectionCard>
                  <SectionCard title="Avatar & Display">
                    <div style={{ padding: '20px 0', display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <div style={{
                        width: '64px', height: '64px', borderRadius: '50%',
                        backgroundColor: '#FFFBEB', border: '2px solid #D4A017',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#D4A017', fontVariationSettings: "'FILL' 1" }}>
                          account_circle
                        </span>
                      </div>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#1E1E1E', margin: '0 0 4px' }}>Profile Photo</p>
                        <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 12px' }}>JPG or PNG, max 2MB</p>
                        <button style={{
                          padding: '7px 14px', fontSize: '13px', fontWeight: 500,
                          color: '#374151', backgroundColor: '#F9FAFB',
                          border: '1px solid #E5E7EB', borderRadius: '8px', cursor: 'pointer',
                        }}>Upload Photo</button>
                      </div>
                    </div>
                  </SectionCard>
                </>
              )}

              {section === 'notifications' && (
                <>
                  <SectionCard title="Alert Channels" description="Choose how you receive security notifications.">
                    <SettingRow label="Email Notifications" description="Receive alerts to your registered email">
                      <Toggle enabled={notifs.email} onChange={(v) => setNotifs((p) => ({ ...p, email: v }))} />
                    </SettingRow>
                    <SettingRow label="SMS Alerts" description="Critical threats sent via text message">
                      <Toggle enabled={notifs.sms} onChange={(v) => setNotifs((p) => ({ ...p, sms: v }))} />
                    </SettingRow>
                    <SettingRow label="Daily Digest" description="Summarized report every morning at 8:00 AM">
                      <Toggle enabled={notifs.digest} onChange={(v) => setNotifs((p) => ({ ...p, digest: v }))} />
                    </SettingRow>
                  </SectionCard>
                  <SectionCard title="Severity Thresholds" description="Select which severity levels trigger notifications.">
                    {(['critical', 'high', 'medium', 'low'] as const).map((s) => {
                      const cfg = {
                        critical: { label: 'Critical', color: '#DC2626', bg: '#FEF2F2' },
                        high:     { label: 'High',     color: '#F97316', bg: '#FFF7ED' },
                        medium:   { label: 'Medium',   color: '#D97706', bg: '#FFFBEB' },
                        low:      { label: 'Low',      color: '#6B7280', bg: '#F9FAFB' },
                      }[s]
                      return (
                        <SettingRow key={s} label={cfg.label} description={`Notify on ${cfg.label.toLowerCase()} severity events`}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{
                              fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em',
                              textTransform: 'uppercase', color: cfg.color,
                              backgroundColor: cfg.bg, padding: '2px 8px', borderRadius: '4px',
                            }}>{cfg.label}</span>
                            <Toggle enabled={notifs[s]} onChange={(v) => setNotifs((p) => ({ ...p, [s]: v }))} />
                          </div>
                        </SettingRow>
                      )
                    })}
                  </SectionCard>
                </>
              )}

              {section === 'system' && (
                <>
                  <SectionCard title="AI Engine Configuration" description="Control how the detection model behaves.">
                    <SettingRow label="Auto Model Retraining" description="Automatically retrain YOLOv8 on new confirmed threats">
                      <Toggle enabled={system.autoRetrain} onChange={(v) => setSystem((p) => ({ ...p, autoRetrain: v }))} />
                    </SettingRow>
                    <SettingRow label="Loiter Detection" description="Flag subjects remaining stationary beyond threshold">
                      <Toggle enabled={system.loiterDetect} onChange={(v) => setSystem((p) => ({ ...p, loiterDetect: v }))} />
                    </SettingRow>
                    <SettingRow label="Night Mode Processing" description="Enable low-light AI enhancement after 20:00">
                      <Toggle enabled={system.nightMode} onChange={(v) => setSystem((p) => ({ ...p, nightMode: v }))} />
                    </SettingRow>
                    <SettingRow label="Full Audit Logging" description="Log all detections to persistent storage">
                      <Toggle enabled={system.auditLog} onChange={(v) => setSystem((p) => ({ ...p, auditLog: v }))} />
                    </SettingRow>
                  </SectionCard>
                  <SectionCard title="Detection Thresholds">
                    <InputField label="Minimum Confidence Score (%)" defaultValue="75" type="number" />
                    <InputField label="Loiter Threshold (seconds)" defaultValue="30" type="number" />
                    <InputField label="Max Concurrent Streams" defaultValue="8" type="number" />
                  </SectionCard>
                </>
              )}

              {section === 'api' && (
                <>
                  <SectionCard title="Backend Connection" description="Configure API and WebSocket endpoints.">
                    <InputField label="API Base URL" defaultValue="http://localhost:5000" />
                    <InputField label="WebSocket URL" defaultValue="ws://localhost:5000/ws/events" />
                    <InputField label="Request Timeout (ms)" defaultValue="5000" type="number" />
                  </SectionCard>
                  <SectionCard title="API Key">
                    <div style={{ padding: '16px 0' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '7px' }}>
                        Current API Key
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="password"
                          defaultValue="sk-perceptra-xxxxxxxxxxxxxxxxxxx"
                          readOnly
                          style={{
                            flex: 1, padding: '9px 12px', fontSize: '14px',
                            border: '1px solid #E5E7EB', borderRadius: '8px',
                            color: '#1E1E1E', backgroundColor: '#F3F4F6',
                            outline: 'none', fontFamily: 'monospace',
                          }}
                        />
                        <button style={{
                          padding: '9px 14px', backgroundColor: '#F9FAFB',
                          border: '1px solid #E5E7EB', borderRadius: '8px',
                          cursor: 'pointer', color: '#374151', fontSize: '13px', fontWeight: 500,
                        }}>Regenerate</button>
                      </div>
                      <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '8px 0 0' }}>
                        Last rotated: June 1, 2026 · Expires: September 1, 2026
                      </p>
                    </div>
                  </SectionCard>
                </>
              )}

              {section === 'security' && (
                <>
                  <SectionCard title="Change Password" description="Manage your login credentials.">
                    <InputField label="Current Password" type="password" placeholder="Enter current password" />
                    <InputField label="New Password" type="password" placeholder="At least 12 characters" />
                    <InputField label="Confirm New Password" type="password" placeholder="Repeat new password" />
                  </SectionCard>
                  <SectionCard title="Session & Access">
                    <SettingRow label="Two-Factor Authentication" description="Require OTP on every login">
                      <Toggle enabled={true} onChange={() => {}} />
                    </SettingRow>
                    <SettingRow label="Session Timeout" description="Auto-logout after 30 minutes of inactivity">
                      <Toggle enabled={true} onChange={() => {}} />
                    </SettingRow>
                    <div style={{ padding: '16px 0' }}>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#1E1E1E', margin: '0 0 12px' }}>Active Sessions</p>
                      {[
                        { device: 'Chrome on Windows', location: 'Kigali, RW', time: 'Now', current: true },
                        { device: 'Safari on iPhone', location: 'Kigali, RW', time: '2 hours ago', current: false },
                      ].map((s) => (
                        <div key={s.device} style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '8px',
                          border: '1px solid #F3F4F6', marginBottom: '8px',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#9CA3AF' }}>devices</span>
                            <div>
                              <p style={{ fontSize: '13px', fontWeight: 600, color: '#1E1E1E', margin: 0 }}>{s.device}</p>
                              <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>{s.location} · {s.time}</p>
                            </div>
                          </div>
                          {s.current
                            ? <span style={{ fontSize: '11px', fontWeight: 700, color: '#10B981', backgroundColor: '#F0FDF4', padding: '2px 8px', borderRadius: '4px' }}>Current</span>
                            : <button style={{ fontSize: '12px', color: '#DC2626', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Revoke</button>
                          }
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                </>
              )}

            </div>
          </div>
        </main>
      </div>
    </div>
  )
}