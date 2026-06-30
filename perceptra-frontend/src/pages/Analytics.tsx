import { useState, useEffect } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import { getStats, getEvents, severityColor } from '../api/events'
import type { EventsStats, DetectionEvent } from '../api/events'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'

// ---------------------------------------------------------------------------
// Stat card
// ---------------------------------------------------------------------------

interface StatCardProps {
  label:    string
  value:    number | string
  icon:     string
  color:    string
  sublabel?: string
}

function StatCard({ label, value, icon, color, sublabel }: StatCardProps) {
  return (
    <div className="p-card px-5 py-4 flex items-center gap-4">
      <div
        className="flex items-center justify-center rounded-xl"
        style={{ width: 44, height: 44, background: `${color}18` }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 22, color }}>
          {icon}
        </span>
      </div>
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </p>
        <p style={{ fontSize: 26, fontWeight: 700, color: '#1E1E1E', lineHeight: 1.1 }}>
          {value}
        </p>
        {sublabel && (
          <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{sublabel}</p>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function groupByHour(events: DetectionEvent[]) {
  const map: Record<string, number> = {}
  events.forEach((e) => {
    const hour = new Date(e.timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', hour12: false,
    })
    map[hour] = (map[hour] ?? 0) + 1
  })
  return Object.entries(map)
    .map(([time, count]) => ({ time, count }))
    .slice(-12)
}

function groupBySeverity(events: DetectionEvent[]) {
  const map: Record<string, number> = { low: 0, medium: 0, high: 0, critical: 0 }
  events.forEach((e) => { map[e.severity] = (map[e.severity] ?? 0) + 1 })
  return Object.entries(map).map(([name, value]) => ({ name, value }))
}

function groupByLabel(events: DetectionEvent[]) {
  const map: Record<string, number> = {}
  events.forEach((e) => { map[e.label] = (map[e.label] ?? 0) + 1 })
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([label, count]) => ({ label, count }))
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Analytics() {
  const [stats, setStats]       = useState<EventsStats | null>(null)
  const [events, setEvents]     = useState<DetectionEvent[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [statsRes, eventsRes] = await Promise.all([
          getStats(),
          getEvents({ limit: 200, page: 1 }),
        ])
        setStats(statsRes.stats)
        setEvents(eventsRes.data)
      } catch {
        setError('Failed to load analytics. Is the backend running?')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const hourlyData   = groupByHour(events)
  const severityData = groupBySeverity(events)
  const labelData    = groupByLabel(events)

  return (
    <DashboardLayout
      title="Analytics"
      subtitle="System Performance & Threat Intelligence"
    >
      {/* Error */}
      {error && (
        <div
          className="mb-5 px-4 py-3 rounded-lg flex items-center gap-2"
          style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: 13 }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>
          {error}
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard
          label="Total Events"
          value={loading ? '…' : (stats?.total ?? 0)}
          icon="sensors"
          color="#6366f1"
          sublabel="all time"
        />
        <StatCard
          label="Today"
          value={loading ? '…' : (stats?.today ?? 0)}
          icon="today"
          color="#0ea5e9"
          sublabel="last 24h"
        />
        <StatCard
          label="Critical"
          value={loading ? '…' : (stats?.critical ?? 0)}
          icon="emergency"
          color="#dc2626"
        />
        <StatCard
          label="High"
          value={loading ? '…' : (stats?.high ?? 0)}
          icon="warning"
          color="#f97316"
        />
        <StatCard
          label="Medium"
          value={loading ? '…' : (stats?.medium ?? 0)}
          icon="info"
          color="#facc15"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">

        {/* Detections over time */}
        <div className="p-card px-5 py-4 lg:col-span-2">
          <h2 className="font-semibold mb-4" style={{ fontSize: 14, color: '#1E1E1E' }}>
            Detections Over Time
          </h2>
          {loading ? (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: 13 }}>
              Loading…
            </div>
          ) : hourlyData.length === 0 ? (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: 13 }}>
              No data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={hourlyData} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid #E5E7EB' }}
                />
                <Bar dataKey="count" fill="#D4A017" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Severity breakdown */}
        <div className="p-card px-5 py-4">
          <h2 className="font-semibold mb-4" style={{ fontSize: 14, color: '#1E1E1E' }}>
            Severity Breakdown
          </h2>
          {loading ? (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: 13 }}>
              Loading…
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {severityData.map((entry) => (
                    <Cell key={entry.name} fill={severityColor(entry.name)} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid #E5E7EB' }}
                />
                <Legend
                  formatter={(value) => (
                    <span style={{ fontSize: 11, textTransform: 'capitalize', color: '#374151' }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Top detected labels */}
      <div className="p-card px-5 py-4">
        <h2 className="font-semibold mb-4" style={{ fontSize: 14, color: '#1E1E1E' }}>
          Top Detected Objects
        </h2>
        {loading ? (
          <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: 13 }}>
            Loading…
          </div>
        ) : labelData.length === 0 ? (
          <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: 13 }}>
            No data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={labelData}
              layout="vertical"
              margin={{ top: 4, right: 20, bottom: 4, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#9CA3AF' }} allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="label"
                tick={{ fontSize: 11, fill: '#374151', textTransform: 'capitalize' }}
                width={80}
              />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid #E5E7EB' }}
              />
              <Bar dataKey="count" fill="#6366f1" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </DashboardLayout>
  )
}