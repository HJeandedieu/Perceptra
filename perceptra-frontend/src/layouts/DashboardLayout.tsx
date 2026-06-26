import Sidebar from '../components/Sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  actions?: React.ReactNode
}

export default function DashboardLayout({ children, title, subtitle, actions }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen" style={{ background: '#F8F8F6' }}>
      <Sidebar />

      {/* Top Header Bar */}
      <header
        className="fixed top-0 left-64 right-0 z-40 flex items-center justify-between px-8 h-16"
        style={{
          background: '#FFFFFF',
          borderBottom: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.04)',
        }}
      >
        {/* Page identity */}
        <div className="flex flex-col justify-center">
          {subtitle && (
            <span className="section-label mb-0.5">{subtitle}</span>
          )}
          {title ? (
            <h1
              className="font-semibold leading-tight"
              style={{ fontSize: 17, color: '#1E1E1E', letterSpacing: '-0.01em' }}
            >
              {title}
            </h1>
          ) : (
            <div style={{ height: 24 }} />
          )}
        </div>

        {/* Right slot: custom actions + persistent system status */}
        <div className="flex items-center gap-4">
          {actions && <div className="flex items-center gap-2">{actions}</div>}

          {/* System status indicator */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-md"
            style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}
          >
            <span className="status-dot status-dot-online status-dot-pulse" />
            <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 500 }}>
              AI Engine Online
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="ml-64 pt-16 min-h-screen">
        <div
          className="max-w-[1440px] mx-auto px-8 py-8"
          style={{ animation: 'fade-in 0.2s ease-out' }}
        >
          {children}
        </div>
      </main>
    </div>
  )
}