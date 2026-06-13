import { useState, useEffect, useRef } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import { useAuth } from '../context/AuthContext'
import {
  getPersons,
  createPerson,
  deletePerson,
  fileToBase64,
} from '../api/persons'
import type { PersonWithFace } from '../api/persons'

// ---------------------------------------------------------------------------
// Tab type
// ---------------------------------------------------------------------------
type Tab = 'account' | 'persons' | 'system'

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function Settings() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('account')

  return (
    <DashboardLayout title="Settings" subtitle="System Configuration">
      {/* Tab bar */}
      <div className="flex gap-1 mb-6" style={{ borderBottom: '1px solid #E5E7EB' }}>
        {([
          { id: 'account', label: 'Account',          icon: 'person' },
          { id: 'persons', label: 'Registered Persons', icon: 'badge' },
          { id: 'system',  label: 'System',            icon: 'settings' },
        ] as { id: Tab; label: string; icon: string }[]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-1.5 px-4 py-2.5 transition-colors"
            style={{
              fontSize: 13,
              fontWeight: activeTab === tab.id ? 700 : 500,
              color: activeTab === tab.id ? '#D4A017' : '#6B7280',
              borderBottom: activeTab === tab.id ? '2px solid #D4A017' : '2px solid transparent',
              marginBottom: -1,
              background: 'none',
              border: 'none',
              borderBottomStyle: 'solid',
              borderBottomWidth: 2,
              borderBottomColor: activeTab === tab.id ? '#D4A017' : 'transparent',
              cursor: 'pointer',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'account' && <AccountTab user={user} />}
      {activeTab === 'persons' && <PersonsTab userRole={user?.role} />}
      {activeTab === 'system'  && <SystemTab />}
    </DashboardLayout>
  )
}

// ---------------------------------------------------------------------------
// Account tab
// ---------------------------------------------------------------------------
function AccountTab({ user }: { user: { name: string; email: string; role: string } | null }) {
  return (
    <div className="max-w-lg">
      <div className="p-card px-6 py-5 space-y-4">
        <h2 className="font-semibold" style={{ fontSize: 15, color: '#1E1E1E' }}>
          Account Information
        </h2>

        {[
          { label: 'Name',  value: user?.name  ?? '—' },
          { label: 'Email', value: user?.email ?? '—' },
          { label: 'Role',  value: user?.role  ?? '—' },
        ].map(({ label, value }) => (
          <div key={label}>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
              {label}
            </p>
            <p
              className="px-3 py-2 rounded-lg"
              style={{ fontSize: 14, color: '#1E1E1E', background: '#F9FAFB', border: '1px solid #E5E7EB' }}
            >
              {value}
            </p>
          </div>
        ))}

        <div
          className="px-3 py-2 rounded-lg flex items-center gap-2"
          style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', fontSize: 12, color: '#15803D' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check_circle</span>
          Session active — JWT stored securely in localStorage
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Persons tab
// ---------------------------------------------------------------------------
function PersonsTab({ userRole }: { userRole?: string }) {
  const [persons, setPersons]       = useState<PersonWithFace[]>([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState<string | null>(null)
  const [success, setSuccess]       = useState<string | null>(null)

  // Register form
  const [name, setName]             = useState('')
  const [role, setRole]             = useState('staff')
  const [imageFile, setImageFile]   = useState<File | null>(null)
  const [preview, setPreview]       = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const isAdmin = userRole === 'ADMIN'

  const loadPersons = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getPersons()
      setPersons(data)
    } catch {
      setError('Failed to load registered persons.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadPersons() }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleRegister = async () => {
    if (!name.trim()) { setError('Name is required.'); return }
    if (!imageFile)   { setError('Face image is required.'); return }

    setSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const faceImageB64 = await fileToBase64(imageFile)
      await createPerson({ name: name.trim(), role, faceImageB64 })
      setSuccess(`${name} registered successfully.`)
      setName('')
      setRole('staff')
      setImageFile(null)
      setPreview(null)
      if (fileRef.current) fileRef.current.value = ''
      await loadPersons()
    } catch (err: unknown) {
      setError((err as { message?: string })?.message ?? 'Registration failed.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string, personName: string) => {
    if (!confirm(`Remove ${personName} from the system?`)) return
    setError(null)
    try {
      await deletePerson(id)
      setSuccess(`${personName} removed.`)
      setPersons((prev) => prev.filter((p) => p.id !== id))
    } catch (err: unknown) {
      setError((err as { message?: string })?.message ?? 'Delete failed.')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Register form */}
      <div className="p-card px-6 py-5">
        <h2 className="font-semibold mb-4" style={{ fontSize: 15, color: '#1E1E1E' }}>
          Register New Person
        </h2>

        {error && (
          <div className="mb-3 px-3 py-2 rounded-lg flex items-center gap-2"
            style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: 13 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>error</span>
            {error}
          </div>
        )}
        {success && (
          <div className="mb-3 px-3 py-2 rounded-lg flex items-center gap-2"
            style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#15803D', fontSize: 13 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check_circle</span>
            {success}
          </div>
        )}

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jean de Dieu"
              className="p-input w-full mt-1"
              style={{ fontSize: 13 }}
            />
          </div>

          {/* Role */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="p-input w-full mt-1"
              style={{ fontSize: 13 }}
            >
              {['staff', 'student', 'visitor', 'security', 'admin'].map((r) => (
                <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Face image */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Face Photo
            </label>
            <div
              className="mt-1 flex flex-col items-center justify-center rounded-lg cursor-pointer"
              style={{ border: '2px dashed #E5E7EB', padding: 16, background: '#F9FAFB' }}
              onClick={() => fileRef.current?.click()}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }}
                />
              ) : (
                <span className="material-symbols-outlined mb-2" style={{ fontSize: 32, color: '#D1D5DB' }}>
                  add_a_photo
                </span>
              )}
              <p style={{ fontSize: 12, color: '#9CA3AF' }}>
                {imageFile ? imageFile.name : 'Click to upload a clear face photo'}
              </p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          <button
            onClick={handleRegister}
            disabled={submitting}
            className="p-btn-primary w-full py-2.5 disabled:opacity-50"
            style={{ fontSize: 13, fontWeight: 600 }}
          >
            {submitting ? 'Registering…' : 'Register Person'}
          </button>
        </div>
      </div>

      {/* Persons list */}
      <div className="p-card px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold" style={{ fontSize: 15, color: '#1E1E1E' }}>
            Registered Persons
            <span
              className="ml-2 px-2 py-0.5 rounded-full"
              style={{ fontSize: 11, fontWeight: 700, background: '#F3F4F6', color: '#6B7280' }}
            >
              {persons.length}
            </span>
          </h2>
          <button onClick={loadPersons} className="p-btn-secondary py-1 px-2.5" style={{ fontSize: 12 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12" style={{ color: '#9CA3AF', fontSize: 13 }}>
            Loading…
          </div>
        ) : persons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <span className="material-symbols-outlined mb-2" style={{ fontSize: 32, color: '#D1D5DB' }}>
              person_off
            </span>
            <p style={{ fontSize: 13, color: '#9CA3AF' }}>No registered persons yet.</p>
            <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>
              Register someone on the left to enable face recognition.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 overflow-y-auto" style={{ maxHeight: 480 }}>
            {persons.map((person) => (
              <div
                key={person.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}
              >
                {/* Avatar */}
                <div
                  className="flex-shrink-0 rounded-full overflow-hidden"
                  style={{ width: 40, height: 40, background: '#E5E7EB' }}
                >
                  {person.face_image_b64 ? (
                    <img
                      src={`data:image/jpeg;base64,${person.face_image_b64}`}
                      alt={person.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span className="material-symbols-outlined flex items-center justify-center h-full"
                      style={{ fontSize: 22, color: '#9CA3AF' }}>
                      person
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-grow min-w-0">
                  <p className="font-semibold truncate" style={{ fontSize: 13, color: '#1E1E1E' }}>
                    {person.name}
                  </p>
                  <p style={{ fontSize: 11, color: '#9CA3AF', textTransform: 'capitalize' }}>
                    {person.role} · {new Date(person.registeredAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Delete — admin only */}
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(person.id, person.name)}
                    className="flex-shrink-0 p-1 rounded transition-colors"
                    style={{ color: '#9CA3AF' }}
                    title="Remove person"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                      delete
                    </span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// System tab
// ---------------------------------------------------------------------------
function SystemTab() {
  return (
    <div className="max-w-lg space-y-4">
      <div className="p-card px-6 py-5">
        <h2 className="font-semibold mb-4" style={{ fontSize: 15, color: '#1E1E1E' }}>
          System Endpoints
        </h2>
        <div className="space-y-3">
          {[
            { label: 'Backend API',       value: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000' },
            { label: 'WebSocket',         value: import.meta.env.VITE_WS_URL       ?? 'ws://localhost:5000/ws/events' },
            { label: 'AI Engine Health',  value: 'http://localhost:8080/health' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                {label}
              </p>
              <p
                className="px-3 py-2 rounded-lg font-mono"
                style={{ fontSize: 12, color: '#374151', background: '#F9FAFB', border: '1px solid #E5E7EB' }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-card px-6 py-5">
        <h2 className="font-semibold mb-3" style={{ fontSize: 15, color: '#1E1E1E' }}>
          AI Engine
        </h2>
        <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 12 }}>
          Check the AI engine heartbeat directly.
        </p>
        <a
          href="http://localhost:8080/health"
          target="_blank"
          rel="noreferrer"
          className="p-btn-secondary inline-flex items-center gap-1.5 py-2 px-4"
          style={{ fontSize: 13 }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>open_in_new</span>
          Open /health
        </a>
      </div>
    </div>
  )
}