import { useState, useEffect, useRef } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import {
  getEvents,
  connectDetectionStream,
  severityColor,
  severityBg,
  formatRelativeTime,
} from '../api/events'
import type { DetectionEvent } from '../api/events'

const STREAM_URL =
  import.meta.env.VITE_STREAM_URL ?? 'https://redblue7-perceptra.hf.space/stream'

interface Feed {
  id:         number
  name:       string
  cam:        string
  resolution: string
  isLive:     boolean
}

const FEEDS: Feed[] = [
  { id: 1, name: 'Main Entrance', cam: 'CAM-01', resolution: '640x480 / 25fps', isLive: true },
]

interface DetectionDisplay {
  id:          string
  severity:    string
  title:       string
  description: string
  time:        string
  color:       string
  showActions: boolean
}

function eventToDisplay(e: DetectionEvent): DetectionDisplay {
  const who = e.personName
    ? `Identified: ${e.personName}`
    : e.identity === 'unknown'
    ? 'Unknown person'
    : e.label

  const loiter = e.loiterSeconds > 0
    ? ` · Loitering ${e.loiterSeconds.toFixed(0)}s`
    : ''

  return {
    id:          e.id,
    severity:    e.severity,
    title:       who,
    description: `${e.label} · ${(e.confidence * 100).toFixed(0)}% confidence${loiter}`,
    time:        formatRelativeTime(e.timestamp),
    color:       severityColor(e.severity),
    showActions: e.severity === 'high' || e.severity === 'critical',
  }
}

export default function LiveFeed() {
  const [time, setTime]               = useState(new Date())
  const [streamOk, setStreamOk]       = useState(true)
  const [wsConnected, setWsConnected] = useState(false)
  const [recentDetections, setRecentDetections] = useState<DetectionDisplay[]>([])
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    getEvents({ limit: 20, page: 1 })
      .then((res) => {
        if (res.data.length > 0) {
          setRecentDetections(res.data.map(eventToDisplay))
        }
      })
      .catch(() => {})

    const cleanup = connectDetectionStream(
      (event) => {
        setWsConnected(true)
        setRecentDetections((prev) => [
          eventToDisplay(event),
          ...prev.slice(0, 49),
        ])
      },
      () => setWsConnected(false),
    )

    return cleanup
  }, [])

  const timeStr = time.toLocaleTimeString('en-US', {
    hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit',
  })

  const feed = FEEDS[0]

  return (
    <DashboardLayout
      title="Live Feed"
      subtitle="Operational Oversight"
      actions={
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span
              style={{
                width: 8, height: 8, borderRadius: '50%',
                background: wsConnected ? '#22c55e' : '#ef4444',
                display: 'inline-block',
              }}
            />
            <span style={{ fontSize: 12, color: wsConnected ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
              {wsConnected ? 'Events Live' : 'Events Offline'}
            </span>
          </div>
        </div>
      }
    >
      <div className="flex gap-6" style={{ minHeight: 'calc(100vh - 160px)' }}>

        {/* Main Camera Feed */}
        <div className="flex-grow flex flex-col gap-5">
          <div className="p-card overflow-hidden flex flex-col">

            {/* Stream */}
            <div className="relative w-full" style={{ aspectRatio: '16 / 9', background: '#0f0f0f' }}>
              <img
                ref={imgRef}
                src={STREAM_URL}
                alt={feed.name}
                className="w-full h-full object-cover"
                onLoad={() => setStreamOk(true)}
                onError={() => setStreamOk(false)}
              />

              {/* Offline overlay */}
              {!streamOk && (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                  style={{ background: '#0f0f0f' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#374151' }}>
                    videocam_off
                  </span>
                  <p style={{ fontSize: 14, color: '#6B7280', fontWeight: 500 }}>
                    AI Engine Offline
                  </p>
                  <p style={{ fontSize: 12, color: '#4B5563' }}>
                    Start the engine and camera stream to connect
                  </p>
                  <button
                    onClick={() => {
                      setStreamOk(true)
                      if (imgRef.current) {
                        imgRef.current.src = `${STREAM_URL}?t=${Date.now()}`
                      }
                    }}
                    className="px-4 py-2 rounded-lg mt-1"
                    style={{
                      fontSize: 13, fontWeight: 600,
                      background: '#1F2937', color: '#D1D5DB',
                      border: '1px solid #374151',
                    }}
                  >
                    Retry Connection
                  </button>
                </div>
              )}

              {/* LIVE badge */}
              <div
                className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
                style={{ background: 'rgba(0,0,0,0.70)' }}
              >
                <span
                  style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: streamOk ? '#22c55e' : '#6B7280',
                    display: 'inline-block',
                    boxShadow: streamOk ? '0 0 6px #22c55e' : 'none',
                  }}
                />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#FFF', letterSpacing: '0.08em' }}>
                  {streamOk ? 'LIVE' : 'OFFLINE'}
                </span>
              </div>

              {/* Camera label */}
              <div
                className="absolute top-3 left-20 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
                style={{ background: 'rgba(0,0,0,0.70)' }}
              >
                <span style={{ fontSize: 11, fontWeight: 600, color: '#D4A017' }}>
                  {feed.cam}
                </span>
                <span style={{ fontSize: 11, color: '#9CA3AF' }}>
                  {feed.name}
                </span>
              </div>

              {/* WS indicator */}
              <div
                className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
                style={{ background: 'rgba(0,0,0,0.70)' }}
              >
                <span
                  style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: wsConnected ? '#22c55e' : '#ef4444',
                    display: 'inline-block',
                  }}
                />
                <span style={{ fontSize: 10, color: '#FFF', fontWeight: 600, letterSpacing: '0.05em' }}>
                  {wsConnected ? 'WS LIVE' : 'WS OFF'}
                </span>
              </div>

              {/* Timestamp */}
              <div
                className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg"
                style={{ background: 'rgba(0,0,0,0.70)' }}
              >
                <span style={{ fontSize: 12, fontWeight: 500, color: '#FFF', fontFamily: 'monospace' }}>
                  {timeStr}
                </span>
              </div>

              {/* Resolution */}
              <div
                className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg"
                style={{ background: 'rgba(0,0,0,0.70)' }}
              >
                <span style={{ fontSize: 11, color: '#9CA3AF' }}>
                  {feed.resolution}
                </span>
              </div>
            </div>

            {/* Feed footer */}
            <div
              className="px-4 py-3 flex items-center justify-between"
              style={{ borderTop: '1px solid #F3F4F6' }}
            >
              <div>
                <p className="font-semibold" style={{ fontSize: 14, color: '#1E1E1E' }}>{feed.name}</p>
                <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 1 }}>
                  {feed.cam} &bull; YOLOv8 Detection Active
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="px-2.5 py-1 rounded-full"
                  style={{
                    fontSize: 11, fontWeight: 700,
                    color: '#065F46', background: '#D1FAE5',
                    letterSpacing: '0.05em',
                  }}
                >
                  AI ACTIVE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Activity Log */}
        <aside className="w-80 flex-shrink-0">
          <div className="p-card flex flex-col" style={{ position: 'sticky', top: 0, maxHeight: 'calc(100vh - 120px)' }}>

            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3.5"
              style={{ borderBottom: '1px solid #E5E7EB' }}
            >
              <h2 className="font-semibold flex items-center gap-2" style={{ fontSize: 14, color: '#1E1E1E' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#D4A017' }}>
                  history
                </span>
                Recent Detections
              </h2>
              <span
                className="px-2 py-0.5 rounded-full"
                style={{
                  fontSize: 10, fontWeight: 700,
                  color: '#92400E', background: '#FEF3C7',
                  letterSpacing: '0.05em',
                }}
              >
                LIVE
              </span>
            </div>

            {/* Detection count summary */}
            {recentDetections.length > 0 && (
              <div
                className="px-4 py-2 flex items-center gap-3"
                style={{ borderBottom: '1px solid #F3F4F6', background: '#FAFAFA' }}
              >
                {(['critical', 'high', 'medium', 'low'] as const).map((sev) => {
                  const count = recentDetections.filter(d => d.severity === sev).length
                  if (count === 0) return null
                  return (
                    <div key={sev} className="flex items-center gap-1">
                      <span
                        style={{
                          width: 8, height: 8, borderRadius: '50%',
                          background: severityColor(sev),
                          display: 'inline-block',
                        }}
                      />
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#374151' }}>
                        {count}
                      </span>
                      <span style={{ fontSize: 10, color: '#9CA3AF', textTransform: 'capitalize' }}>
                        {sev}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}

            {/* List */}
            <div className="flex-grow overflow-y-auto custom-scrollbar p-3 space-y-2">
              {recentDetections.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <span className="material-symbols-outlined mb-2" style={{ fontSize: 28, color: '#D1D5DB' }}>
                    sensors
                  </span>
                  <p style={{ fontSize: 13, color: '#9CA3AF' }}>Waiting for detections…</p>
                  <p style={{ fontSize: 11, color: '#D1D5DB', marginTop: 4 }}>
                    Events appear here in real time
                  </p>
                </div>
              )}

              {recentDetections.map((evt) => (
                <div
                  key={evt.id}
                  className="rounded-lg p-3"
                  style={{
                    background:  severityBg(evt.severity),
                    borderLeft: `3px solid ${evt.color}`,
                  }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span
                      style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: '0.05em',
                        color: evt.color, textTransform: 'uppercase',
                      }}
                    >
                      {evt.severity}
                    </span>
                    <span style={{ fontSize: 11, color: '#9CA3AF' }}>{evt.time}</span>
                  </div>
                  <p className="font-semibold mb-0.5" style={{ fontSize: 13, color: '#1E1E1E' }}>
                    {evt.title}
                  </p>
                  <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.5 }}>
                    {evt.description}
                  </p>

                  {evt.showActions && (
                    <div className="mt-2 flex gap-2">
                      <button
                        className="px-2.5 py-1 rounded-md"
                        style={{
                          fontSize: 11, fontWeight: 600,
                          color: '#92400E', background: '#FEF3C7',
                          border: '1px solid #FCD34D',
                        }}
                      >
                        Isolate
                      </button>
                      <button
                        className="px-2.5 py-1 rounded-md"
                        style={{
                          fontSize: 11, fontWeight: 600,
                          color: '#6B7280', background: '#FFF',
                          border: '1px solid #E5E7EB',
                        }}
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-3" style={{ borderTop: '1px solid #E5E7EB' }}>
              <button className="p-btn-secondary w-full py-2" style={{ fontSize: 12, fontWeight: 600 }}>
                View All System Logs
              </button>
            </div>
          </div>
        </aside>
      </div>
    </DashboardLayout>
  )
}