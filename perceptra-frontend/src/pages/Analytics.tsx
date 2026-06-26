import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { getReports } from '../api/reports'
import type { ReportStats } from '../api/reports'

const defaultStats: ReportStats = {
  total_incidents: 1284,
  avg_confidence: 94.2,
  critical_alerts: 8,
  active_time_hours: 342,
  incident_trend: -12,
}

const chartBars = [
  { pct: 40, critical: false, high: false },
  { pct: 60, critical: false, high: false },
  { pct: 55, critical: false, high: false },
  { pct: 85, critical: true,  high: false },
  { pct: 70, critical: false, high: false },
  { pct: 45, critical: false, high: false },
  { pct: 30, critical: false, high: false },
  { pct: 65, critical: false, high: false },
  { pct: 90, critical: false, high: true  },
  { pct: 50, critical: false, high: false },
  { pct: 40, critical: false, high: false },
  { pct: 75, critical: false, high: false },
  { pct: 60, critical: false, high: false },
  { pct: 80, critical: true,  high: false },
  { pct: 45, critical: false, high: false },
]

const tableData = [
  { id: 'PRC-9921', label: 'SQL Injection Attempt',   severity: 'Critical' as const, confidence: '98.2%', timestamp: '2023-10-31 14:22:05' },
  { id: 'PRC-9918', label: 'Anomalous Data Export',   severity: 'High'     as const, confidence: '84.5%', timestamp: '2023-10-31 12:45:12' },
  { id: 'PRC-9915', label: 'Brute Force Attack',      severity: 'Medium'   as const, confidence: '92.1%', timestamp: '2023-10-31 10:15:33' },
  { id: 'PRC-9912', label: 'Unauthorized VPN Login',  severity: 'Low'      as const, confidence: '76.8%', timestamp: '2023-10-31 09:02:11' },
  { id: 'PRC-9909', label: 'Malware Execution Blocked',severity: 'Critical' as const, confidence: '99.9%', timestamp: '2023-10-30 22:15:45' },
]

const severityConfig = {
  Critical: { color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', text: '#991B1B', bar: '#DC2626' },
  High:     { color: '#F97316', bg: '#FFF7ED', border: '#FED7AA', text: '#9A3412', bar: '#F97316' },
  Medium:   { color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', text: '#92400E', bar: '#FACC15' },
  Low:      { color: '#6B7280', bg: '#F9FAFB', border: '#E5E7EB', text: '#374151', bar: '#9CA3AF' },
}

export default function Analytics() {
  const [stats, setStats] = useState(defaultStats)
  const [events, setEvents] = useState(tableData)
  const [chartData, setChartData] = useState(chartBars)
  const [chartPeriod, setChartPeriod] = useState<'Daily' | 'Weekly'>('Daily')
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    getReports()
      .then((res) => {
        if (cancelled) return
        if (res.stats) setStats(res.stats)
        if (res.events?.length) {
          setEvents(res.events.map((e) => ({
            id: e.id ?? 'N/A',
            label: e.label,
            severity: e.severity as 'Critical' | 'High' | 'Medium' | 'Low',
            confidence: (e.confidence * 100).toFixed(1) + '%',
            timestamp: new Date(e.timestamp).toLocaleString('en-US', {
              year: 'numeric', month: '2-digit', day: '2-digit',
              hour: '2-digit', minute: '2-digit', second: '2-digit',
            }),
          })))
        }
        if (res.chart?.length) {
          setChartData(res.chart.map((c) => ({
            pct: Math.min(Math.round(c.count * 10), 100),
            critical: c.severity === 'Critical',
            high: c.severity === 'High',
          })))
        }
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  const kpiCards = [
    {
      icon: 'security', label: 'Total Incidents',
      value: stats.total_incidents.toLocaleString(),
      sub: `${Math.abs(stats.incident_trend)}% vs last month`,
      subIcon: 'trending_down', subColor: '#10B981',
      accent: '#D4A017', accentBg: '#FFFBEB',
    },
    {
      icon: 'verified_user', label: 'Avg. Confidence',
      value: `${stats.avg_confidence}%`,
      sub: 'Detection accuracy', subIcon: 'analytics', subColor: '#6B7280',
      accent: '#10B981', accentBg: '#F0FDF4',
    },
    {
      icon: 'crisis_alert', label: 'Critical Alerts',
      value: String(stats.critical_alerts).padStart(2, '0'),
      sub: 'Requires immediate action', subIcon: 'warning', subColor: '#DC2626',
      accent: '#DC2626', accentBg: '#FEF2F2', live: true,
    },
    {
      icon: 'timer', label: 'Active Uptime',
      value: '14d 6h',
      sub: `${stats.active_time_hours}h total`, subIcon: 'check_circle', subColor: '#10B981',
      accent: '#6366F1', accentBg: '#EEF2FF',
    },
  ]

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
              Analytics
            </h1>
            <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>System performance overview</p>
          </div>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 16px', backgroundColor: '#1E1E1E', color: '#FFFFFF',
            border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>download</span>
            Download Report
          </button>
        </header>

        <main style={{ padding: '28px 32px 48px', flex: 1 }}>

          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
            {kpiCards.map((card) => (
              <div key={card.label} style={{
                backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px',
                padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    backgroundColor: card.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '20px', color: card.accent, fontVariationSettings: "'FILL' 1" }}>
                      {card.icon}
                    </span>
                  </div>
                  {card.live && (
                    <span style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      fontSize: '11px', fontWeight: 700, color: '#DC2626',
                      backgroundColor: '#FEF2F2', padding: '3px 8px', borderRadius: '20px',
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#DC2626', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                      LIVE
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 4px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {card.label}
                </p>
                <p style={{ fontSize: '28px', fontWeight: 800, color: '#1E1E1E', margin: '0 0 8px', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {card.value}
                </p>
                <p style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: card.subColor, margin: 0 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{card.subIcon}</span>
                  {card.sub}
                </p>
              </div>
            ))}
          </div>

          {/* Bar Chart */}
          <div style={{
            backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px',
            padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1E1E1E', margin: '0 0 4px' }}>Incident Frequency</h3>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>Aggregated threat activity — last 30 days</p>
              </div>
              <div style={{ display: 'flex', gap: '4px', backgroundColor: '#F3F4F6', borderRadius: '8px', padding: '4px' }}>
                {(['Daily', 'Weekly'] as const).map((p) => (
                  <button key={p} onClick={() => setChartPeriod(p)} style={{
                    padding: '5px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                    cursor: 'pointer', border: 'none',
                    backgroundColor: chartPeriod === p ? '#FFFFFF' : 'transparent',
                    color: chartPeriod === p ? '#1E1E1E' : '#6B7280',
                    boxShadow: chartPeriod === p ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.15s ease',
                  }}>{p}</button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
              {[{ color: '#D1D5DB', label: 'Low / Medium' }, { color: '#F97316', label: 'High' }, { color: '#DC2626', label: 'Critical' }].map(({ color, label }) => (
                <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6B7280' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: color, display: 'inline-block' }} />
                  {label}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '180px', position: 'relative', paddingLeft: '32px' }}>
              {[100, 75, 50, 25].map((y) => (
                <div key={y} style={{
                  position: 'absolute', left: 0, right: 0, bottom: `${y}%`,
                  borderTop: '1px dashed #F3F4F6', pointerEvents: 'none',
                }}>
                  <span style={{ position: 'absolute', left: 0, top: '-8px', fontSize: '10px', color: '#D1D5DB' }}>{y}</span>
                </div>
              ))}
              {chartData.map((bar, i) => {
                const base = bar.critical ? '#DC2626' : bar.high ? '#F97316' : '#D1D5DB'
                const hover = bar.critical ? '#B91C1C' : bar.high ? '#EA580C' : '#9CA3AF'
                return (
                  <div
                    key={i}
                    onMouseEnter={() => setHoveredBar(i)}
                    onMouseLeave={() => setHoveredBar(null)}
                    style={{
                      flex: 1, height: `${bar.pct}%`, borderRadius: '4px 4px 0 0',
                      backgroundColor: hoveredBar === i ? hover : base,
                      transition: 'background-color 0.15s ease', cursor: 'default', position: 'relative',
                    }}
                  >
                    {hoveredBar === i && (
                      <div style={{
                        position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)',
                        backgroundColor: '#1E1E1E', color: '#FFFFFF', fontSize: '11px', fontWeight: 600,
                        padding: '4px 8px', borderRadius: '6px', whiteSpace: 'nowrap', zIndex: 10,
                      }}>
                        {bar.pct} incidents
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #F3F4F6' }}>
              {['Oct 01', 'Oct 08', 'Oct 15', 'Oct 22', 'Oct 30'].map((d) => (
                <span key={d} style={{ fontSize: '11px', color: '#9CA3AF' }}>{d}</span>
              ))}
            </div>
          </div>

          {/* Table */}
          <div style={{
            backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px',
            overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}>
            <div style={{
              padding: '18px 24px', borderBottom: '1px solid #E5E7EB',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1E1E1E', margin: '0 0 2px' }}>Incident History</h3>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>Detailed log of all detected events</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[{ icon: 'filter_list', label: 'Filter' }, { icon: 'sort', label: 'Sort' }].map(({ icon, label }) => (
                  <button key={label} style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    padding: '7px 12px', fontSize: '13px', fontWeight: 500,
                    color: '#374151', backgroundColor: '#F9FAFB',
                    border: '1px solid #E5E7EB', borderRadius: '8px', cursor: 'pointer',
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{icon}</span>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F9FAFB' }}>
                    {['ID', 'Incident Label', 'Severity', 'Confidence', 'Timestamp', ''].map((h) => (
                      <th key={h} style={{
                        padding: '11px 20px', textAlign: 'left', fontSize: '11px',
                        fontWeight: 700, color: '#6B7280', textTransform: 'uppercase',
                        letterSpacing: '0.06em', borderBottom: '1px solid #E5E7EB',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {events.map((row, idx) => {
                    const cfg = severityConfig[row.severity]
                    return (
                      <tr
                        key={row.id}
                        style={{ borderBottom: idx < events.length - 1 ? '1px solid #F3F4F6' : 'none' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = '#FAFAFA' }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'transparent' }}
                      >
                        <td style={{ padding: '13px 20px', fontFamily: 'monospace', fontSize: '13px', color: '#D4A017', fontWeight: 600 }}>{row.id}</td>
                        <td style={{ padding: '13px 20px', fontSize: '14px', color: '#1E1E1E', fontWeight: 500 }}>{row.label}</td>
                        <td style={{ padding: '13px 20px' }}>
                          <span style={{
                            fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                            color: cfg.text, backgroundColor: cfg.bg, padding: '3px 8px',
                            borderRadius: '4px', border: `1px solid ${cfg.border}`,
                          }}>{row.severity}</span>
                        </td>
                        <td style={{ padding: '13px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '60px', height: '4px', backgroundColor: '#F3F4F6', borderRadius: '2px' }}>
                              <div style={{ height: '100%', borderRadius: '2px', backgroundColor: cfg.bar, width: row.confidence }} />
                            </div>
                            <span style={{ fontSize: '13px', color: '#374151', fontWeight: 600 }}>{row.confidence}</span>
                          </div>
                        </td>
                        <td style={{ padding: '13px 20px', fontSize: '13px', color: '#6B7280' }}>{row.timestamp}</td>
                        <td style={{ padding: '13px 20px' }}>
                          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex', alignItems: 'center' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>visibility</span>
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ padding: '14px 24px', borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'center' }}>
              <button style={{
                fontSize: '13px', fontWeight: 500, color: '#6B7280',
                backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '4px',
              }}>
                Load more entries
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>expand_more</span>
              </button>
            </div>
          </div>
        </main>
      </div>

      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </div>
  )
}