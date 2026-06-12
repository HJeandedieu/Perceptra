import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { path: '/live-feed', icon: 'sensors',              label: 'Live Feed' },
  { path: '/alerts',    icon: 'notifications_active', label: 'Alerts' },
  { path: '/analytics', icon: 'monitoring',           label: 'Analytics' },
  { path: '/settings',  icon: 'settings',             label: 'Settings' },
]

const PERCEPTRA_LOGO =
'../../public/favicon.svg'
const DEFAULT_AVATAR =
'../../public/favicon.svg'
export default function Sidebar() {
  const location  = useLocation()
  const navigate  = useNavigate()
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
    navigate('/login')
  }

  const userName = user?.name ?? 'Operator'
  const userRole = user?.role ?? 'Analyst'

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-64 flex flex-col z-50"
      style={{
        background: '#FFFFFF',
        borderRight: '1px solid #E5E7EB',
        boxShadow: '1px 0 0 0 #E5E7EB',
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 h-16" style={{ borderBottom: '1px solid #E5E7EB' }}>
        <div
          className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
          style={{ background: '#FEF3C7', border: '1px solid #FCD34D' }}
        >
          <img alt="Perceptra" className="h-5 w-5 object-contain" src={PERCEPTRA_LOGO} />
        </div>
        <div>
          <h1 className="font-bold leading-tight" style={{ fontSize: 15, color: '#1E1E1E', letterSpacing: '-0.01em' }}>
            Perceptra
          </h1>
          <p className="section-label" style={{ letterSpacing: '0.06em' }}>
            Threat Intelligence
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto custom-scrollbar">
        <p className="section-label px-3 mb-3">System</p>

        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg relative transition-all duration-150 group"
              style={
                isActive
                  ? {
                      background: '#FEF3C7',
                      color: '#92400E',
                    }
                  : {
                      color: '#6B7280',
                    }
              }
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = '#F9FAFB'
                  ;(e.currentTarget as HTMLElement).style.color = '#1E1E1E'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent'
                  ;(e.currentTarget as HTMLElement).style.color = '#6B7280'
                }
              }}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                  style={{ background: '#D4A017' }}
                />
              )}

              <span
                className="material-symbols-outlined flex-shrink-0"
                style={{
                  fontSize: 20,
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {item.icon}
              </span>

              <span className="font-medium" style={{ fontSize: 14 }}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* System status chip */}
      <div className="px-4 pb-3">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ background: '#F0FDF4', border: '1px solid #A7F3D0' }}
        >
          <span className="status-dot status-dot-online status-dot-pulse" />
          <span style={{ fontSize: 11, fontWeight: 600, color: '#065F46', letterSpacing: '0.04em' }}>
            ALL SYSTEMS OPERATIONAL
          </span>
        </div>
      </div>

      {/* User footer */}
      <div className="px-3 pb-4" style={{ borderTop: '1px solid #E5E7EB', paddingTop: 12 }}>
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150 cursor-pointer text-left"
            style={{ background: showUserMenu ? '#F9FAFB' : 'transparent' }}
            onMouseEnter={(e) => {
              if (!showUserMenu) (e.currentTarget as HTMLElement).style.background = '#F9FAFB'
            }}
            onMouseLeave={(e) => {
              if (!showUserMenu) (e.currentTarget as HTMLElement).style.background = 'transparent'
            }}
          >
            <img
              alt={userName}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              style={{ border: '2px solid #E5E7EB' }}
              src={DEFAULT_AVATAR}
            />
            <div className="flex-1 overflow-hidden">
              <p className="font-semibold truncate" style={{ fontSize: 13, color: '#1E1E1E' }}>
                {userName}
              </p>
              <p className="truncate capitalize" style={{ fontSize: 11, color: '#9CA3AF' }}>
                {userRole}
              </p>
            </div>
            <span className="material-symbols-outlined flex-shrink-0" style={{ fontSize: 18, color: '#9CA3AF' }}>
              {showUserMenu ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {/* Dropdown */}
          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
              <div
                className="absolute bottom-full left-0 right-0 mb-2 rounded-xl overflow-hidden z-20 animate-slide-up"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 8px 24px 0 rgb(0 0 0 / 0.10), 0 2px 6px -1px rgb(0 0 0 / 0.06)',
                }}
              >
                {/* User info header */}
                <div className="px-4 py-3" style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <p className="font-semibold" style={{ fontSize: 13, color: '#1E1E1E' }}>{userName}</p>
                  <p style={{ fontSize: 11, color: '#9CA3AF' }}>{user?.email ?? 'operator@perceptra.io'}</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 transition-colors duration-150 cursor-pointer"
                  style={{ color: '#DC2626' }}
                  onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = '#FEF2F2'}
                  onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
                  <span className="font-medium" style={{ fontSize: 13 }}>Sign Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  )
}