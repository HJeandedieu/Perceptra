import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { getAlerts as getAlertsApi, dismissAlert as dismissAlertApi } from '../api/alerts'
import type { Alert as ApiAlert } from '../api/alerts'

const MAP_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCt68MFHmQ9f7U-iDU1bBuhnSmxuQ2IHA6Nf7WW9j90NZPmxKVHwcBhxnPx1_qD7Gxx9meXgEt6ddEyJsOp63TUa7M81uoFQNFXVkt5c6kiysBh0clv5W9j4TAp9eh4vhAx8v8SAtHV6XmWYEeLFuPyKEp3cIeiY2xzpsI5eHQHu3zDoKZ0UWVlnfPVxnSC2w8ckmJkEXuuL1yuWyqX1QjonGhI5in5J1XmvNYJihYllOCeBoH4n5otIsTJeywYylqwqtX1z5b1PiI'

interface LocalAlert {
  id: number
  severity: 'Critical' | 'High' | 'Medium' | 'Low'
  title: string
  time: string
  location: string
  meta: string
  metaIcon: string
  icon: string
  color: string
  bgColor: string
  apiId?: string
}

const fallbackAlerts: LocalAlert[] = [
  { id: 1, severity: 'Critical', title: 'Unauthorized Perimeter Breach', time: '2 mins ago', location: 'North Gate - Sector 4', meta: 'Multiple Subjects', metaIcon: 'group', icon: 'warning', color: '#7C3AED', bgColor: 'rgba(124,58,237,0.2)' },
  { id: 2, severity: 'High', title: 'Aggressive Behavior Detected', time: '14 mins ago', location: 'Main Lobby - Zone B', meta: 'Single Subject', metaIcon: 'person', icon: 'running_with_errors', color: '#EF4444', bgColor: 'rgba(239,68,68,0.2)' },
  { id: 3, severity: 'Medium', title: 'Person Detected: Restricted Area', time: '32 mins ago', location: 'Server Room - Level 2', meta: 'Authorized Personnel Search', metaIcon: 'verified_user', icon: 'person_search', color: '#F59E0B', bgColor: 'rgba(245,158,11,0.2)' },
  { id: 4, severity: 'Low', title: 'Sensor Calibration Required', time: '1 hour ago', location: 'Rooftop - Cam 09', meta: 'Maintenance Task', metaIcon: 'build', icon: 'check_circle', color: '#22C55E', bgColor: 'rgba(34,197,94,0.2)' },
  { id: 5, severity: 'High', title: 'Hardware Thermal Warning', time: '2 hours ago', location: 'Data Hub - Core 1', meta: 'Over 85°C Detected', metaIcon: 'thermostat', icon: 'fire_extinguisher', color: '#EF4444', bgColor: 'rgba(239,68,68,0.2)' },
]

const severityMap: Record<string, LocalAlert['severity']> = {
  Low: 'Low', Medium: 'Medium', High: 'High', Critical: 'Critical',
}

function apiToLocal(a: ApiAlert, index: number): LocalAlert {
  const s = severityMap[a.severity] ?? 'Medium'
  const colorMap: Record<string, string> = { Low: '#22C55E', Medium: '#F59E0B', High: '#EF4444', Critical: '#7C3AED' }
  const iconMap: Record<string, string> = { Low: 'check_circle', Medium: 'person_search', High: 'running_with_errors', Critical: 'warning' }
  return {
    id: index + 1,
    severity: s,
    title: a.title,
    time: formatRelativeTime(a.timestamp),
    location: a.location,
    meta: a.meta ?? '',
    metaIcon: a.metaIcon ?? 'info',
    icon: iconMap[s] ?? 'warning',
    color: colorMap[s] ?? '#7C3AED',
    bgColor: `${colorMap[s] ?? '#7C3AED'}33`,
    apiId: a.id,
  }
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} mins ago`
  const hrs = Math.floor(mins / 60)
  return `${hrs} hour${hrs > 1 ? 's' : ''} ago`
}



export default function Alerts() {
  const [alerts, setAlerts] = useState<LocalAlert[]>(fallbackAlerts)
  const [filter, setFilter] = useState<string>('All')
  const [exiting, setExiting] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)

  // Fetch alerts from API on mount — fall back to static data if unavailable
  useEffect(() => {
    let cancelled = false
    getAlertsApi()
      .then((res) => {
        if (!cancelled && res.alerts.length > 0) {
          setAlerts(res.alerts.map((a, i) => apiToLocal(a, i)))
        }
      })
      .catch(() => { /* API not available — keep fallback */ })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const dismiss = async (id: number) => {
    const alert = alerts.find((a) => a.id === id)
    setExiting((prev) => new Set(prev).add(id))
    // Call API if we have an apiId
    if (alert?.apiId) {
      dismissAlertApi(alert.apiId).catch(() => { /* ignore */ })
    }
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id))
      setExiting((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }, 300)
  }

  const filtered = filter === 'All' ? alerts : alerts.filter((a) => a.severity === filter)

  return (
    <div className="bg-background text-text-body min-h-screen antialiased font-body-md">
      {/* Atmospherics */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" />

      <Sidebar />

      {/* Top Bar */}
      <header className="fixed top-0 right-0 w-[calc(100%-16rem)] flex justify-between items-center h-16 px-gutter backdrop-blur-xl border-b border-glass-stroke bg-surface-dim/80 z-40">
        <div className="flex items-center gap-4">
          <h2 className="font-headline-md text-headline-md text-text-heading">Alerts Center</h2>
          <div className="h-4 w-[1px] bg-glass-stroke" />
          <span className="font-label-caps text-label-caps text-primary">14 Active Threats</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-50">search</span>
            <input
              className="bg-glass-surface border border-glass-stroke rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary w-64 transition-all focus:w-80"
              placeholder="Search incidents..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined text-on-surface-variant hover:text-text-heading transition-colors cursor-pointer">notifications</button>
            <button className="material-symbols-outlined text-on-surface-variant hover:text-text-heading transition-colors cursor-pointer">account_circle</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="ml-64 mt-16 p-container-margin mr-[380px] relative z-10">
        {/* Filters */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-6">
          <div className="segmented-track flex p-1 rounded-xl w-fit">
            {['All', 'Low', 'Medium', 'High', 'Critical'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                  filter === f
                    ? 'text-text-heading bg-glass-surface shadow-sm'
                    : 'text-on-surface-variant hover:text-text-heading font-medium'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium hover:bg-glass-surface cursor-pointer"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              <span className="material-symbols-outlined text-sm">filter_list</span>
              More Filters
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary-container text-white rounded-lg text-sm font-bold shadow-lg shadow-primary-container/20 cursor-pointer">
              <span className="material-symbols-outlined text-sm">download</span>
              Export PDF
            </button>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {filtered.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-xl flex items-center gap-6 p-glass-padding transition-all duration-300 relative overflow-hidden ${
                exiting.has(alert.id) ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
              style={{
                background: alert.bgColor,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              {/* Top edge glow */}
              <div
                className="absolute top-0 left-0 w-full h-px"
                style={{
                  background: `linear-gradient(to right, transparent, ${alert.color}66, transparent)`,
                }}
              />
              <div
                className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ background: alert.bgColor }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ color: alert.color, fontVariationSettings: "'FILL' 1" }}
                >
                  {alert.icon}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span
                    className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider"
                    style={{
                      background: alert.bgColor,
                      color: alert.color,
                      border: `1px solid ${alert.color}33`,
                    }}
                  >
                    {alert.severity}
                  </span>
                  <h3 className="font-headline-md text-lg text-text-heading">{alert.title}</h3>
                </div>
                <div className="flex items-center gap-4 text-sm text-on-surface-variant opacity-70">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    {alert.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    {alert.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">{alert.metaIcon}</span>
                    {alert.meta}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => dismiss(alert.id)}
                  className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-text-heading transition-colors cursor-pointer rounded-lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                  }}
                >
                  Dismiss
                </button>
                <a className="px-4 py-2 text-sm font-bold text-primary hover:text-text-heading transition-colors flex items-center gap-1" href="#">
                  View Details
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-8 flex justify-center">
          <button className="group px-8 py-3 rounded-full text-sm font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            Load Historical Alerts
            <span className="material-symbols-outlined group-hover:translate-y-1 transition-transform">expand_more</span>
          </button>
        </div>
      </main>

      {/* Side Intelligence Panel */}
      <div className="fixed right-6 top-24 w-80 h-[calc(100vh-8rem)] flex flex-col gap-6 pointer-events-none">
        {/* AI Insights */}
        <div className="rounded-2xl p-glass-padding pointer-events-auto"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
          }}
        >
          <h4 className="font-headline-md text-sm text-primary mb-4 flex items-center gap-2 uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            AI Insights
          </h4>
          <div className="space-y-4">
            <div className="p-3 bg-primary-container/10 border border-primary/20 rounded-lg">
              <p className="text-xs leading-relaxed opacity-90">
                Incidents in <span className="text-primary font-bold">Sector 4</span> have increased by 25% in the last 2 hours. Recommend increasing drone patrol frequency.
              </p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant">System Load</span>
                <span className="text-[10px] font-bold text-threat-low">Stable</span>
              </div>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className="bg-threat-low h-full w-[40%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Active Zones */}
        <div className="rounded-2xl p-glass-padding flex-1 overflow-hidden pointer-events-auto"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
          }}
        >
          <h4 className="font-headline-md text-sm text-primary mb-4 flex items-center gap-2 uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">map</span>
            Active Zones
          </h4>
          <div className="relative w-full h-full rounded-lg overflow-hidden grayscale contrast-125 opacity-50">
            <img alt="Map" className="w-full h-full object-cover" src={MAP_IMG} />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-3 h-3 bg-threat-critical rounded-full animate-ping" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
