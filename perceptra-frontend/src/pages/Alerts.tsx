import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import { getEvents, severityColor, severityBg, formatRelativeTime } from '../api/events'
import type { DetectionEvent, EventsQuery, Severity } from '../api/events'

const SEVERITY_OPTIONS: { label: string; value: Severity | '' }[] = [
  { label: 'All Severities', value: '' },
  { label: 'Critical',       value: 'critical' },
  { label: 'High',           value: 'high' },
  { label: 'Medium',         value: 'medium' },
  { label: 'Low',            value: 'low' },
]

export default function Alerts() {
  const [events, setEvents]       = useState<DetectionEvent[]>([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<string | null>(null)

  // Filters
  const [severity, setSeverity]   = useState<Severity | ''>('')
  const [label, setLabel]         = useState('')
  const [from, setFrom]           = useState('')
  const [to, setTo]               = useState('')

  // Pagination
  const [page, setPage]           = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal]         = useState(0)
  const LIMIT = 20

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const query: EventsQuery = { page, limit: LIMIT }
      if (severity) query.severity = severity
      if (label.trim()) query.label = label.trim()
      if (from) query.from = new Date(from).toISOString()
      if (to)   query.to   = new Date(to).toISOString()

      const res = await getEvents(query)
      setEvents(res.data)
      setTotalPages(res.meta.totalPages)
      setTotal(res.meta.total)
    } catch {
      setError('Failed to load events. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }, [page, severity, label, from, to])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1)
  }, [severity, label, from, to])

  return (
    <DashboardLayout
      title="Alerts"
      subtitle="Detection Event History"
      actions={
        <button
          onClick={fetchEvents}
          className="p-btn-secondary flex items-center gap-1.5 py-1.5 px-3"
          style={{ fontSize: 13 }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>refresh</span>
          Refresh
        </button>
      }
    >
      {/* Filters */}
      <div
        className="p-card mb-5 flex flex-wrap gap-3 items-end px-4 py-3"
        style={{ borderBottom: '1px solid #E5E7EB' }}
      >
        {/* Severity */}
        <div className="flex flex-col gap-1">
          <label style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Severity
          </label>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value as Severity | '')}
            className="p-input py-1.5 pr-8"
            style={{ fontSize: 13, minWidth: 140 }}
          >
            {SEVERITY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Label */}
        <div className="flex flex-col gap-1">
          <label style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Label
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. knife, person"
            className="p-input py-1.5"
            style={{ fontSize: 13, minWidth: 160 }}
          />
        </div>

        {/* From */}
        <div className="flex flex-col gap-1">
          <label style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            From
          </label>
          <input
            type="datetime-local"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="p-input py-1.5"
            style={{ fontSize: 13 }}
          />
        </div>

        {/* To */}
        <div className="flex flex-col gap-1">
          <label style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            To
          </label>
          <input
            type="datetime-local"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="p-input py-1.5"
            style={{ fontSize: 13 }}
          />
        </div>

        {/* Clear */}
        {(severity || label || from || to) && (
          <button
            onClick={() => { setSeverity(''); setLabel(''); setFrom(''); setTo('') }}
            className="p-btn-secondary py-1.5 px-3"
            style={{ fontSize: 13 }}
          >
            Clear filters
          </button>
        )}

        {/* Total count */}
        <div className="ml-auto flex items-center" style={{ fontSize: 12, color: '#9CA3AF' }}>
          {total} event{total !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          className="mb-4 px-4 py-3 rounded-lg flex items-center gap-2"
          style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: 13 }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>
          {error}
        </div>
      )}

      {/* Table */}
      <div className="p-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" style={{ fontSize: 13, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                {['Time', 'Label', 'Severity', 'Confidence', 'Identity', 'Loiter', 'Alert Sent'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '10px 14px', textAlign: 'left',
                      fontSize: 11, fontWeight: 700, color: '#6B7280',
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} style={{ padding: '40px 14px', textAlign: 'center', color: '#9CA3AF' }}>
                    Loading…
                  </td>
                </tr>
              )}

              {!loading && events.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '40px 14px', textAlign: 'center', color: '#9CA3AF' }}>
                    No events found.
                  </td>
                </tr>
              )}

              {!loading && events.map((evt) => (
                <tr
                  key={evt.id}
                  style={{
                    borderBottom: '1px solid #F3F4F6',
                    background: severityBg(evt.severity),
                  }}
                >
                  {/* Time */}
                  <td style={{ padding: '10px 14px', whiteSpace: 'nowrap', color: '#6B7280' }}>
                    {formatRelativeTime(evt.timestamp)}
                    <br />
                    <span style={{ fontSize: 11, color: '#9CA3AF' }}>
                      {new Date(evt.timestamp).toLocaleTimeString()}
                    </span>
                  </td>

                  {/* Label */}
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1E1E1E', textTransform: 'capitalize' }}>
                    {evt.label}
                  </td>

                  {/* Severity */}
                  <td style={{ padding: '10px 14px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: '#FFF',
                        background: severityColor(evt.severity),
                      }}
                    >
                      {evt.severity}
                    </span>
                  </td>

                  {/* Confidence */}
                  <td style={{ padding: '10px 14px', color: '#374151' }}>
                    {(evt.confidence * 100).toFixed(0)}%
                  </td>

                  {/* Identity */}
                  <td style={{ padding: '10px 14px' }}>
                    {evt.personName ? (
                      <span style={{ fontWeight: 600, color: '#059669' }}>{evt.personName}</span>
                    ) : evt.identity === 'unknown' ? (
                      <span style={{ color: '#DC2626', fontWeight: 600 }}>Unknown</span>
                    ) : (
                      <span style={{ color: '#9CA3AF' }}>—</span>
                    )}
                  </td>

                  {/* Loiter */}
                  <td style={{ padding: '10px 14px', color: '#374151' }}>
                    {evt.loiterSeconds > 0 ? `${evt.loiterSeconds.toFixed(0)}s` : '—'}
                  </td>

                  {/* Alert Sent */}
                  <td style={{ padding: '10px 14px' }}>
                    {evt.alertSent ? (
                      <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#059669' }}>
                        check_circle
                      </span>
                    ) : (
                      <span style={{ color: '#9CA3AF' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderTop: '1px solid #E5E7EB' }}
          >
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-btn-secondary py-1.5 px-3 disabled:opacity-40"
              style={{ fontSize: 13 }}
            >
              ← Previous
            </button>
            <span style={{ fontSize: 13, color: '#6B7280' }}>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-btn-secondary py-1.5 px-3 disabled:opacity-40"
              style={{ fontSize: 13 }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}