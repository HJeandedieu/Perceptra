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
  { id: 1, name: 'Main Entrance',    cam: 'CAM-01', resolution: '640x480 / 25fps', isLive: true  },
  { id: 2, name: 'South Corridor',   cam: 'CAM-04', resolution: '1080P / 60fps',   isLive: false },
  { id: 3, name: 'Server Room A',    cam: 'CAM-09', resolution: '4K / 30fps',      isLive: false },
  { id: 4, name: 'Loading Dock',     cam: 'CAM-12', resolution: '1080P / 60fps',   isLive: false },
  { id: 5, name: 'Parking B2',       cam: 'CAM-22', resolution: '1080P / 30fps',   isLive: false },
  { id: 6, name: 'Executive Lounge', cam: 'CAM-30', resolution: '4K / 30fps',      isLive: false },
]

const PLACEHOLDER_SRCS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCd4Y6S-3triut_Coy5e9W330_bgYZ7fGK5NgspFgldWMco6WKsDWHSdqMIGehoTb30Uzgzd0KmNpl4jSeGiIjOai-BjFeFOemU1P1VHB3Vf_2UMRlGyM3mzv63KYx5aqqJ98S0lPIIgSMfjB7QDKo4f2rLc15e_6OQP2EOQMbDuPIrKkxibuLBSIlHfUmEPkkEZudLNQvE2rJJFL4lqiIZbRXPwI8v-xR_WPB2uJa158TR94-7nbuLOjblbcrcLerGwCCLApJx1T8',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA8LHJ3lCz_H25UcnjmSUNDrzXneQL0CGZjMA_O8sDK6f0ksvexp4bqhGNi09NodJSOUld_q5a-VhtcPxVMX3Ru1FFYcJLrknr-bU6B31clQzIKJNfjboAfbiFa1OxshLuyKh43WCprzphZB8DMo--x1JIQvbQDYAXiJya-zl14Z9C4kC6XvTzdR0p-5p6C-CMX6TlfTpvHPT-6r2CipHcJapSqYxTvDQcVi-yyl-CfJqvwdDmob0t4pq3tlJEs8d9J2oOnSE_0-sE',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBCQNvlFr2f2q4Ihl2etfRKAV_F9nSzbvUQqdeASjSwosJY0XssGbUF-icmg8Wqc7kmlaDSfeZsZjg36GHen6BN0QQOBPxSi5yJdRluHBqgVRNyuKBxFqkcBuewRJXH8OuRNLtBYHwbufX_IbVUYtvfV4qPVpiVeNdyPxwR8WfMxurJvm0445e_0_tG4Iwo7oU2XBImyhm64Os-bwDo06dkAo6nGxEgMApn-5zEN0dvtRUSnip-Vz6HTNIZ37nhMbLOKMghVExGTv8',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDhMsFPHc1NgctObrfBRPc6BscY8jLGtySxSRFkgtCBs2vpHHhtBWrLOucLUY3aLPW_GxFzmI3HcVNrxfnwB73bw_0yRzfW-EZjrSlIL5Br_b2au78Psl7oe2cs9jQuSx8bpWwEE1HZSxSQuqb2YmvwJ4HNtMNtnawkjvSdX65YdtbAgm2FlWuCDX7C9T0s7eq79wl5lJbtBkq6gwkfXEnoIFRjaOG_eASZRBEBtyMvbPGZESFG45pqjIz2UXgCtdkihfIW9pKlsKk',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB0cLIzyKQSoYhznuykqDvu3jaI4bQ8hlhU8EbDv1TZ9bKE1IqWYkE8-Pmy3BPiBJKir7qKPZp6om2rhQ5EgOVzHIQIgXBgsIvKeQBWsedGGtFBgMdkValB-yfoEK4TmmzsffX_IkpGyY0-Cdka-o6tADmMS_oXaZuoU8SXIBIzrWFlb3Yf8x7_3G_HOe-zoyJ9WK6MqZeMyZy9e7ix_6j0SEJiRm2t-IMBp26-xhbw0rea21ObClw_XBWd2WhP_oomDJ3MoahJ9wU',
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
  const [search, setSearch]           = useState('')
  const [streamOk, setStreamOk]       = useState(true)
  const [wsConnected, setWsConnected] = useState(false)
  const [recentDetections, setRecentDetections] = useState<DetectionDisplay[]>([])
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    getEvents({ limit: 10, page: 1 })
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
          ...prev.slice(0, 19),
        ])
      },
      () => setWsConnected(false),
    )

    return cleanup
  }, [])

  const timeStr = time.toLocaleTimeString('en-US', {
    hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit',
  })

  const filteredFeeds = search.trim()
    ? FEEDS.filter((f) =>
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.cam.toLowerCase().includes(search.toLowerCase()),
      )
    : FEEDS

  return (
    <DashboardLayout
      title="Live Feed"
      subtitle="Operational Oversight"
      actions={
        <div className="relative">
          <span
            className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ fontSize: 16, color: '#9CA3AF' }}
          >
            search
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-input pl-9 pr-3 py-1.5 w-56"
            style={{ fontSize: 13 }}
            placeholder="Search by camera or location…"
          />
        </div>
      }
    >
      <div className="flex gap-6" style={{ minHeight: 'calc(100vh - 160px)' }}>

        {/* Video Wall */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 content-start">
          {filteredFeeds.map((feed, idx) => (
            <div key={feed.id} className="p-card overflow-hidden flex flex-col">
              <div className="relative" style={{ aspectRatio: '16 / 10', background: '#0f0f0f' }}>

                {feed.isLive ? (
                  <>
                    <img
                      ref={imgRef}
                      src={STREAM_URL}
                      alt={feed.name}
                      className="w-full h-full object-cover"
                      onLoad={() => setStreamOk(true)}
                      onError={() => setStreamOk(false)}
                    />
                    {!streamOk && (
                      <div
                        className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                        style={{ background: '#0f0f0f' }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 32, color: '#4B5563' }}>
                          videocam_off
                        </span>
                        <p style={{ fontSize: 12, color: '#6B7280' }}>AI engine offline</p>
                        <button
                          onClick={() => {
                            setStreamOk(true)
                            if (imgRef.current) {
                              imgRef.current.src = `${STREAM_URL}?t=${Date.now()}`
                            }
                          }}
                          className="px-3 py-1 rounded-md"
                          style={{ fontSize: 11, background: '#1F2937', color: '#9CA3AF', border: '1px solid #374151' }}
                        >
                          Retry
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <img
                    alt={feed.name}
                    src={PLACEHOLDER_SRCS[idx - 1] ?? PLACEHOLDER_SRCS[0]}
                    className="w-full h-full object-cover opacity-60"
                  />
                )}

                {/* LIVE / OFFLINE badge */}
                <div
                  className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-1 rounded-md"
                  style={{ background: 'rgba(0,0,0,0.65)' }}
                >
                  <span
                    style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: feed.isLive && streamOk ? '#22c55e' : '#6B7280',
                      display: 'inline-block',
                    }}
                  />
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#FFF', letterSpacing: '0.06em' }}>
                    {feed.isLive && streamOk ? 'LIVE' : 'OFFLINE'}
                  </span>
                </div>

                {/* WS indicator on main feed */}
                {feed.isLive && (
                  <div
                    className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-md"
                    style={{ background: 'rgba(0,0,0,0.65)' }}
                  >
                    <span
                      style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: wsConnected ? '#22c55e' : '#ef4444',
                        display: 'inline-block',
                      }}
                    />
                    <span style={{ fontSize: 9, color: '#FFF', fontWeight: 600 }}>
                      {wsConnected ? 'EVENTS' : 'NO WS'}
                    </span>
                  </div>
                )}

                {/* Timestamp */}
                <div
                  className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded"
                  style={{ background: 'rgba(0,0,0,0.65)' }}
                >
                  <span style={{ fontSize: 11, fontWeight: 500, color: '#FFF', fontFamily: 'monospace' }}>
                    {timeStr}
                  </span>
                </div>
              </div>

              <div className="px-3.5 py-2.5">
                <p className="font-semibold" style={{ fontSize: 13, color: '#1E1E1E' }}>{feed.name}</p>
                <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>
                  {feed.cam} &bull; {feed.resolution}
                </p>
              </div>
            </div>
          ))}

          {filteredFeeds.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
              <span className="material-symbols-outlined mb-2" style={{ fontSize: 32, color: '#D1D5DB' }}>
                videocam_off
              </span>
              <p style={{ fontSize: 14, color: '#9CA3AF' }}>No cameras match "{search}".</p>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <aside className="w-80 flex-shrink-0">
          <div className="p-card flex flex-col h-full" style={{ position: 'sticky', top: 0 }}>
            <div
              className="flex items-center justify-between px-4 py-3.5"
              style={{ borderBottom: '1px solid #E5E7EB' }}
            >
              <h2 className="font-semibold flex items-center gap-2" style={{ fontSize: 14, color: '#1E1E1E' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#D4A017' }}>history</span>
                Recent Detections
              </h2>
              <span
                className="px-2 py-0.5 rounded-full"
                style={{ fontSize: 10, fontWeight: 700, color: '#92400E', background: '#FEF3C7', letterSpacing: '0.05em' }}
              >
                LIVE
              </span>
            </div>

            <div
              className="flex-grow overflow-y-auto custom-scrollbar p-3 space-y-2.5"
              style={{ maxHeight: 560 }}
            >
              {recentDetections.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <span className="material-symbols-outlined mb-2" style={{ fontSize: 28, color: '#D1D5DB' }}>
                    sensors
                  </span>
                  <p style={{ fontSize: 13, color: '#9CA3AF' }}>Waiting for detections…</p>
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
                    <div className="mt-2.5 flex gap-2">
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