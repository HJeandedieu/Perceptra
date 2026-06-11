import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'

const FEED_SRC_1 =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBwFmHcj1n5D5IQVMoO1TEx2fcwHQ_yo1dch5-KADfJdsdxi59Ktqao11NcIALxfvj3uIoJAPCQEBxcMdkzTL8LCDdY6rORzO6V_kgJbl8kSafHgYcAqAEbeh6ffLkh9TgwP7QBXgGzf6u-9IYU6mkIX7P_Iin36JPOGHeELTrxxx7gqeQ-R60BPFu2NtAfzxVXDNwRSAUB2onDBvBzO8Xr0HDOFx5rOaRF_4GJVKJ5ud1dCwUPfGwHqg9dTV4aiU06fu7AnGwgQBw'
const FEED_SRC_2 =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCd4Y6S-3triut_Coy5e9W330_bgYZ7fGK5NgspFgldWMco6WKsDWHSdqMIGehoTb30Uzgzd0KmNpl4jSeGiIjOai-BjFeFOemU1P1VHB3Vf_2UMRlGyM3mzv63KYx5aqqJ98S0lPIIgSMfjB7QDKo4f2rLc15e_6OQP2EOQMbDuPIrKkxibuLBSIlHfUmEPkkEZudLNQvE2rJJFL4lqiIZbRXPwI8v-xR_WPB2uJa158TR94-7nbuLOjblbcrcLerGwCCLApJx1T8'
const FEED_SRC_3 =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA8LHJ3lCz_H25UcnjmSUNDrzXneQL0CGZjMA_O8sDK6f0ksvexp4bqhGNi09NodJSOUld_q5a-VhtcPxVMX3Ru1FFYcJLrknr-bU6B31clQzIKJNfjboAfbiFa1OxshLuyKh43WCprzphZB8DMo--x1JIQvbQDYAXiJya-zl14Z9C4kC6XvTzdR0p-5p6C-CMX6TlfTpvHPT-6r2CipHcJapSqYxTvDQcVi-yyl-CfJqvwdDmob0t4pq3tlJEs8d9J2oOnSE_0-sE'
const FEED_SRC_4 =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBCQNvlFr2f2q4Ihl2etfRKAV_F9nSzbvUQqdeASjSwosJY0XssGbUF-icmg8Wqc7kmlaDSfeZsZjg36GHen6BN0QQOBPxSi5yJdRluHBqgVRNyuKBxFqkcBuewRJXH8OuRNLtBYHwbufX_IbVUYtvfV4qPVpiVeNdyPxwR8WfMxurJvm0445e_0_tG4Iwo7oU2XBImyhm64Os-bwDo06dkAo6nGxEgMApn-5zEN0dvtRUSnip-Vz6HTNIZ37nhMbLOKMghVExGTv8'
const FEED_SRC_5 =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDhMsFPHc1NgctObrfBRPc6BscY8jLGtySxSRFkgtCBs2vpHHhtBWrLOucLUY3aLPW_GxFzmI3HcVNrxfnwB73bw_0yRzfW-EZjrSlIL5Br_b2au78Psl7oe2cs9jQuSx8bpWwEE1HZSxSQuqb2YmvwJ4HNtMNtnawkjvSdX65YdtbAgm2FlWuCDX7C9T0s7eq79wl5lJbtBkq6gwkfXEnoIFRjaOG_eASZRBEBtyMvbPGZESFG45pqjIz2UXgCtdkihfIW9pKlsKk'
const FEED_SRC_6 =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB0cLIzyKQSoYhznuykqDvu3jaI4bQ8hlhU8EbDv1TZ9bKE1IqWYkE8-Pmy3BPiBJKir7qKPZp6om2rhQ5EgOVzHIQIgXBgsIvKeQBWsedGGtFBgMdkValB-yfoEK4TmmzsffX_IkpGyY0-Cdka-o6tADmMS_oXaZuoU8SXIBIzrWFlb3Yf8x7_3G_HOe-zoyJ9WK6MqZeMyZy9e7ix_6j0SEJiRm2t-IMBp26-xhbw0rea21ObClw_XBWd2WhP_oomDJ3MoahJ9wU'

interface Feed {
  id: number
  name: string
  cam: string
  resolution: string
  threat: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  src: string
  color: string
}

const feeds: Feed[] = [
  { id: 1, name: 'Main Entrance', cam: 'CAM-01', resolution: '1080P/60fps', threat: 'CRITICAL', src: FEED_SRC_1, color: '#7C3AED' },
  { id: 2, name: 'South Corridor', cam: 'CAM-04', resolution: '1080P/60fps', threat: 'HIGH', src: FEED_SRC_2, color: '#EF4444' },
  { id: 3, name: 'Server Room A', cam: 'CAM-09', resolution: '4K/30fps', threat: 'MEDIUM', src: FEED_SRC_3, color: '#F59E0B' },
  { id: 4, name: 'Loading Dock', cam: 'CAM-12', resolution: '1080P/60fps', threat: 'LOW', src: FEED_SRC_4, color: '#22C55E' },
  { id: 5, name: 'Parking B2', cam: 'CAM-22', resolution: '1080P/30fps', threat: 'LOW', src: FEED_SRC_5, color: '#22C55E' },
  { id: 6, name: 'Executive Lounge', cam: 'CAM-30', resolution: '4K/30fps', threat: 'MEDIUM', src: FEED_SRC_6, color: '#F59E0B' },
]

export default function LiveFeed() {
  const [time, setTime] = useState(new Date())
  const [selected, setSelected] = useState<Set<number>>(new Set())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const toggleSelect = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const timeStr = time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })

  return (
    <div className="bg-background text-text-body min-h-screen font-body-md">
      {/* BG decor */}
      <div className="fixed top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-[120px] rounded-full -translate-y-1/4 translate-x-1/4 pointer-events-none" />
      <div className="fixed bottom-0 left-64 w-1/3 h-1/3 bg-threat-critical/5 blur-[100px] rounded-full translate-y-1/4 -translate-x-1/4 pointer-events-none" />

      <Sidebar />

      {/* Top Bar */}
      <header className="fixed top-0 right-0 w-[calc(100%-16rem)] backdrop-blur-xl border-b border-glass-stroke flex justify-between items-center h-16 px-gutter z-40 bg-surface-dim/80">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-primary">sensors</span>
          <span className="font-headline-md text-headline-md text-text-heading">Operational Oversight</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative group">
            <input
              className="bg-surface-container-low border border-glass-stroke rounded-lg px-4 py-1.5 text-sm w-64 focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
              placeholder="Search entity..."
              type="text"
            />
            <span className="material-symbols-outlined absolute right-3 top-2 text-on-surface-variant text-sm">search</span>
          </div>
          <div className="flex gap-4">
            <button className="material-symbols-outlined text-on-surface-variant hover:text-text-heading transition-colors cursor-pointer relative">
              notifications
              <span className="absolute top-0 right-0 w-2 h-2 bg-threat-high rounded-full border border-surface" />
            </button>
            <button className="material-symbols-outlined text-on-surface-variant hover:text-text-heading transition-colors cursor-pointer">
              account_circle
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="ml-64 mt-16 p-gutter flex h-[calc(100vh-4rem)] gap-gutter">
        {/* Video Wall Grid */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto custom-scrollbar pr-2">
          {feeds.map((feed) => (
            <div
              key={feed.id}
              onClick={() => toggleSelect(feed.id)}
              className={`rounded-xl overflow-hidden group cursor-pointer transition-all flex flex-col ${
                selected.has(feed.id) ? 'ring-2 ring-primary' : ''
              }`}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* Feed Image — flex-1 so it takes remaining space */}
              <div className="relative bg-surface-container-highest flex-1 min-h-0">
                <div
                  className="scanline-overlay"
                  style={{ animationDelay: `${feed.id * 0.7}s` }}
                />
                <div className="h-full w-full">
                  <img
                    alt={feed.name}
                    className="w-full h-full object-cover brightness-75 group-hover:brightness-100 transition-all duration-700"
                    style={{ filter: 'grayscale(0.3)' }}
                    src={feed.src}
                  />
                </div>
                {/* Only the elapsing time on the feed */}
                <div className="absolute bottom-3 right-3 pointer-events-none">
                  <p className="font-label-caps text-label-caps text-white/90 drop-shadow-lg">{timeStr}</p>
                </div>
              </div>

              {/* Description section — tinted by risk level, only as tall as content */}
              <div
                className="px-3 py-1.5 flex flex-col gap-0.5"
                style={{ backgroundColor: feed.color + '18' }}
              >
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-1 px-1.5 py-0.5 bg-black/30 rounded backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 bg-threat-low rounded-full animate-pulse" />
                    <span className="font-label-caps text-[9px] text-white">LIVE</span>
                  </div>
                  <span
                    className="px-1.5 py-0.5 rounded text-[9px] font-bold backdrop-blur-sm"
                    style={{
                      backgroundColor: feed.color + '44',
                      color: feed.color,
                      border: `1px solid ${feed.color}66`,
                    }}
                  >
                    {feed.threat}
                  </span>
                </div>
                <div className="flex flex-col gap-0">
                  <span className="font-headline-md text-xs text-text-heading">{feed.name}</span>
                  <span className="font-label-sm text-[10px] text-on-surface-variant">
                    {feed.cam} &bull; {feed.resolution}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Sidebar: Activity Log */}
        <aside className="w-80 flex flex-col gap-4">
          <div
            className="rounded-xl p-4 flex flex-col h-full border border-glass-stroke shadow-xl"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.1)',
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-headline-md text-base text-text-heading flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">history</span>
                Recent Detections
              </h2>
              <span className="font-label-sm text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full">REAL-TIME</span>
            </div>
            <div className="flex-grow space-y-4 overflow-y-auto custom-scrollbar pr-2">
              {/* Event 1 */}
              <div className="p-3 border-l-2 border-threat-critical bg-white/5 rounded-r-lg group hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-label-caps text-[10px] text-threat-critical">CRITICAL</span>
                  <span className="text-[10px] text-on-surface-variant">2m ago</span>
                </div>
                <p className="text-sm font-semibold text-text-heading mb-1">Unauthorized Access Attempt</p>
                <p className="text-xs text-on-surface-variant leading-tight">Main Entrance: Biometric mismatch detected on secondary relay.</p>
                <div className="mt-2 flex gap-2">
                  <button className="text-[10px] bg-primary/20 hover:bg-primary/40 text-primary px-2 py-0.5 rounded transition-colors cursor-pointer">ISOLATE</button>
                  <button className="text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded transition-colors cursor-pointer">DISMISS</button>
                </div>
              </div>
              {/* Event 2 */}
              <div className="p-3 border-l-2 border-threat-high bg-white/5 rounded-r-lg group hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-label-caps text-[10px] text-threat-high">HIGH</span>
                  <span className="text-[10px] text-on-surface-variant">14m ago</span>
                </div>
                <p className="text-sm font-semibold text-text-heading mb-1">Motion Detected - South Corridor</p>
                <p className="text-xs text-on-surface-variant leading-tight">Unexpected kinetic activity during restricted hours.</p>
              </div>
              {/* Event 3 */}
              <div className="p-3 border-l-2 border-threat-medium bg-white/5 rounded-r-lg group hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-label-caps text-[10px] text-threat-medium">MEDIUM</span>
                  <span className="text-[10px] text-on-surface-variant">42m ago</span>
                </div>
                <p className="text-sm font-semibold text-text-heading mb-1">Object Left Behind</p>
                <p className="text-xs text-on-surface-variant leading-tight">Stationary entity detected in Server Room A for &gt; 15 mins.</p>
              </div>
              {/* Event 4 */}
              <div className="p-3 border-l-2 border-threat-low bg-white/5 rounded-r-lg group hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-label-caps text-[10px] text-threat-low">LOW</span>
                  <span className="text-[10px] text-on-surface-variant">1h ago</span>
                </div>
                <p className="text-sm font-semibold text-text-heading mb-1">Routine Shift Change</p>
                <p className="text-xs text-on-surface-variant leading-tight">Cleaning crew authorized access to Level B2.</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-glass-stroke">
              <button className="w-full py-2 bg-glass-surface hover:bg-glass-stroke border border-glass-stroke rounded-lg font-label-caps text-label-caps text-primary transition-all cursor-pointer">
                VIEW ALL SYSTEM LOGS
              </button>
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}
