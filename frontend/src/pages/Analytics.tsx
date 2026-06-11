import Sidebar from '../components/Sidebar'



const chartBars = [
  { pct: 40, label: '12' },
  { pct: 60, label: '' },
  { pct: 55, label: '' },
  { pct: 85, label: '', critical: true },
  { pct: 70, label: '' },
  { pct: 45, label: '' },
  { pct: 30, label: '' },
  { pct: 65, label: '' },
  { pct: 90, label: '', high: true },
  { pct: 50, label: '' },
  { pct: 40, label: '' },
  { pct: 75, label: '' },
  { pct: 60, label: '' },
  { pct: 80, label: '', critical: true },
  { pct: 45, label: '' },
]

const tableData = [
  { id: 'PRC-9921', label: 'SQL Injection Attempt', severity: 'Critical' as const, confidence: '98.2%', timestamp: '2023-10-31 14:22:05' },
  { id: 'PRC-9918', label: 'Anomalous Data Export', severity: 'High' as const, confidence: '84.5%', timestamp: '2023-10-31 12:45:12' },
  { id: 'PRC-9915', label: 'Brute Force Attack', severity: 'Medium' as const, confidence: '92.1%', timestamp: '2023-10-31 10:15:33' },
  { id: 'PRC-9912', label: 'Unauthorized VPN Login', severity: 'Low' as const, confidence: '76.8%', timestamp: '2023-10-31 09:02:11' },
  { id: 'PRC-9909', label: 'Malware Execution Blocked', severity: 'Critical' as const, confidence: '99.9%', timestamp: '2023-10-30 22:15:45' },
]

const severityConfig = {
  Critical: { color: '#7C3AED', bg: 'rgba(124,58,237,0.2)', border: 'rgba(124,58,237,0.3)' },
  High: { color: '#EF4444', bg: 'rgba(239,68,68,0.2)', border: 'rgba(239,68,68,0.3)' },
  Medium: { color: '#F59E0B', bg: 'rgba(245,158,11,0.2)', border: 'rgba(245,158,11,0.3)' },
  Low: { color: '#22C55E', bg: 'rgba(34,197,94,0.2)', border: 'rgba(34,197,94,0.3)' },
}

export default function Analytics() {
  return (
    <div className="bg-background text-text-body min-h-screen font-body-md">
      {/* Atmosphere decor */}
      <div className="fixed top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-[120px] rounded-full -translate-y-1/4 translate-x-1/4 pointer-events-none" />
      <div className="fixed bottom-0 left-64 w-1/3 h-1/3 bg-threat-critical/5 blur-[100px] rounded-full translate-y-1/4 -translate-x-1/4 pointer-events-none" />

      <Sidebar />

      {/* Top Bar */}
      <header className="fixed top-0 right-0 w-[calc(100%-16rem)] flex justify-between items-center h-16 px-gutter ml-64 bg-surface-dim/80 backdrop-blur-xl border-b border-glass-stroke z-40">
        <div className="flex items-center gap-4">
          <h2 className="font-headline-md text-headline-md text-text-heading">Analytics Dashboard</h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative hidden lg:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
            <input
              className="bg-surface-container-low border border-glass-stroke rounded-full pl-10 pr-4 py-1.5 text-sm focus:ring-1 focus:ring-primary outline-none w-64 transition-all focus:w-80"
              placeholder="Search incidents..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-4 text-on-surface-variant">
            <button className="hover:text-text-heading transition-colors cursor-pointer">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="hover:text-text-heading transition-colors cursor-pointer">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="ml-64 pt-24 pb-12 px-container-margin min-h-screen relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto space-y-gutter">
          {/* Header */}
          <div className="flex justify-between items-end">
            <div>
              <p className="font-label-caps text-label-caps text-primary mb-1">DATA REPORTING</p>
              <h3 className="font-headline-lg text-headline-lg text-text-heading">System Performance Overview</h3>
            </div>
            <button className="px-6 py-2.5 flex items-center gap-2 text-primary font-bold hover:bg-primary/10 transition-all group active:scale-95 cursor-pointer"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '0.75rem',
              }}
            >
              <span className="material-symbols-outlined text-xl">download</span>
              <span>Download Report</span>
            </button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {/* Metric 1 */}
            <div className="rounded-xl p-glass-padding group relative overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 blur-2xl group-hover:bg-primary/20 transition-all" />
              <div className="flex justify-between items-start mb-4">
                <span className="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-lg">security</span>
                <span className="text-threat-low font-label-sm text-label-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">trending_down</span> 12%
                </span>
              </div>
              <p className="text-on-surface-variant font-label-caps text-label-caps mb-1">Total Incidents</p>
              <p className="text-text-heading font-headline-md text-headline-md">1,284</p>
            </div>

            {/* Metric 2 */}
            <div className="rounded-xl p-glass-padding group relative overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary/10 blur-2xl group-hover:bg-secondary/20 transition-all" />
              <div className="flex justify-between items-start mb-4">
                <span className="material-symbols-outlined text-secondary p-2 bg-secondary/10 rounded-lg">verified_user</span>
                <span className="text-on-surface-variant font-label-sm text-label-sm">AVG</span>
              </div>
              <p className="text-on-surface-variant font-label-caps text-label-caps mb-1">Average Confidence</p>
              <p className="text-text-heading font-headline-md text-headline-md">94.2%</p>
            </div>

            {/* Metric 3 */}
            <div className="rounded-xl p-glass-padding group relative overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-threat-high/10 blur-2xl group-hover:bg-threat-high/20 transition-all" />
              <div className="flex justify-between items-start mb-4">
                <span className="material-symbols-outlined text-threat-high p-2 bg-threat-high/10 rounded-lg">crisis_alert</span>
                <span className="text-threat-high font-label-sm text-label-sm flex items-center gap-1 animate-pulse-slow">
                  <span className="material-symbols-outlined text-sm">warning</span> LIVE
                </span>
              </div>
              <p className="text-on-surface-variant font-label-caps text-label-caps mb-1">Critical Alerts</p>
              <p className="text-text-heading font-headline-md text-headline-md">08</p>
            </div>

            {/* Metric 4 */}
            <div className="rounded-xl p-glass-padding group relative overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-container/10 blur-2xl group-hover:bg-primary-container/20 transition-all" />
              <div className="flex justify-between items-start mb-4">
                <span className="material-symbols-outlined text-primary-container p-2 bg-primary-container/10 rounded-lg">timer</span>
                <span className="text-on-surface-variant font-label-sm text-label-sm">UPTIME</span>
              </div>
              <p className="text-on-surface-variant font-label-caps text-label-caps mb-1">Active Time</p>
              <p className="text-text-heading font-headline-md text-headline-md">14d 6h</p>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="rounded-xl p-glass-padding h-96 flex flex-col"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="text-text-heading font-headline-md text-headline-md">Incident Frequency</h4>
                <p className="text-on-surface-variant text-sm">Aggregated threat activity over the last 30 days</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs font-bold rounded-full bg-primary-container text-white cursor-pointer">Daily</button>
                <button className="px-3 py-1 text-xs font-bold rounded-full border border-glass-stroke text-on-surface-variant hover:text-white cursor-pointer">Weekly</button>
              </div>
            </div>
            <div className="flex-1 w-full flex items-end gap-2 pb-4">
              {chartBars.map((bar, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm hover:brightness-150 transition-all cursor-help relative group"
                  style={{
                    height: `${bar.pct}%`,
                    backgroundColor: bar.critical
                      ? 'rgba(124, 58, 237, 0.4)'
                      : bar.high
                      ? 'rgba(239, 68, 68, 0.4)'
                      : 'rgba(210, 187, 255, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = bar.critical
                      ? 'rgba(124, 58, 237, 0.6)'
                      : bar.high
                      ? 'rgba(239, 68, 68, 0.6)'
                      : 'rgba(210, 187, 255, 0.5)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = bar.critical
                      ? 'rgba(124, 58, 237, 0.4)'
                      : bar.high
                      ? 'rgba(239, 68, 68, 0.4)'
                      : 'rgba(210, 187, 255, 0.3)'
                  }}
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-bright p-2 rounded text-[10px] hidden group-hover:block whitespace-nowrap z-10 border border-glass-stroke shadow-xl">
                    {bar.pct} Incidents
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-on-surface-variant uppercase tracking-widest pt-2 border-t border-glass-stroke">
              <span>Oct 01</span>
              <span>Oct 15</span>
              <span>Oct 30</span>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            <div className="p-glass-padding border-b border-glass-stroke flex justify-between items-center bg-white/5">
              <h4 className="text-text-heading font-headline-md text-headline-md">Detailed Incident History</h4>
              <div className="flex gap-4">
                <button className="flex items-center gap-1 text-sm text-on-surface-variant hover:text-white transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-lg">filter_list</span> Filter
                </button>
                <button className="flex items-center gap-1 text-sm text-on-surface-variant hover:text-white transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-lg">sort</span> Sort
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-on-surface-variant font-label-caps text-label-caps border-b border-glass-stroke/50 bg-surface-container/30">
                    <th className="px-6 py-4 font-bold">ID</th>
                    <th className="px-6 py-4 font-bold">Label</th>
                    <th className="px-6 py-4 font-bold">Severity</th>
                    <th className="px-6 py-4 font-bold">Confidence</th>
                    <th className="px-6 py-4 font-bold">Timestamp</th>
                    <th className="px-6 py-4 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-body-md divide-y divide-glass-stroke/30">
                  {tableData.map((row) => {
                    const config = severityConfig[row.severity]
                    return (
                      <tr key={row.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4 font-mono text-primary">{row.id}</td>
                        <td className="px-6 py-4 text-text-heading">{row.label}</td>
                        <td className="px-6 py-4">
                          <span
                            className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                            style={{ background: config.bg, color: config.color, border: `1px solid ${config.border}` }}
                          >
                            {row.severity}
                          </span>
                        </td>
                        <td className="px-6 py-4">{row.confidence}</td>
                        <td className="px-6 py-4 text-on-surface-variant">{row.timestamp}</td>
                        <td className="px-6 py-4">
                          <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer">visibility</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-glass-stroke/50 flex justify-center">
              <button className="text-sm text-on-surface-variant hover:text-white transition-all underline underline-offset-4 cursor-pointer">
                Load More Entries
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
