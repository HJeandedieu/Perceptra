import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { path: '/live-feed', icon: 'sensors', label: 'Live Feed' },
  { path: '/alerts', icon: 'notifications_active', label: 'Alerts' },
  { path: '/analytics', icon: 'monitoring', label: 'Analytics' },
  { path: '/settings', icon: 'settings', label: 'Settings' },
]

const PERCEPTRA_LOGO =
  'https://lh3.googleusercontent.com/aida/AP1WRLvIwfwhOrhaPU06b2fqE5zcqwt-2Hji0GL1dreeIQJfKNkRa1hDroUmKGVzs7VYNLPQA5R7T_CzSQc5yl7ydS7sRgtbqvRg0s0IY1MZ1zWDjx5mi7c1x4Q3raCbA9tvIh4Ir6Yd86Fo7uDdyrVh5uF4BHN_Nuj6RkeiVzVSMC4zGf4PQjgBDDlzrmGOvVEbJjAEkZC6uJB9wZvETKba9M2EncDsrwOIBxFyxLLLS1s17EcTMrOvW-08AgQ'

const DEFAULT_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC8nqhkBo-kDEfQ51QolrcaV6ZiO8rV7C5vj3sKSkpqNuG45REVmd2teQ9XvQkPUTZF_bhC-3W1KraLbt4GOUZ6bgbEcASdw5dxG4ziJtSZTG4Q9YpyNzeDOyBCdY7sxYJIbJ6zgq9EhcQvCIIO9VPVYctXhYyteaj7lt1ouzsvlsg01PBHr1wN5JBknULFEBwD7ipmH0NfyJENg-g310pm5Rbt1YDlLNzQD6vk60dqfaTPJjOqGAHmtDmV5jvVVj9qu_PDjfLpFRo'

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
    navigate('/login')
  }

  const userName = user?.name ?? 'Niel'
  const userRole = user?.role ?? 'Lead Analyst'

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-glass-surface backdrop-blur-md border-r border-glass-stroke shadow-2xl flex flex-col p-gutter z-50">
      {/* Brand */}
      <div className="mb-10">
        <div className="flex items-center gap-3">
          <img alt="Perceptra" className="h-10 w-10 object-contain" src={PERCEPTRA_LOGO} />
          <div>
            <h1 className="font-headline-md text-headline-md text-primary tracking-tight leading-tight">Perceptra</h1>
            <p className="font-label-caps text-label-caps text-on-surface-variant opacity-60">Threat Intelligence</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 font-body-md text-body-md transition-all rounded-lg group ${
                isActive
                  ? 'text-text-heading bg-primary-container rounded-lg font-bold'
                  : 'text-on-surface-variant opacity-50 hover:bg-glass-surface hover:opacity-100'
              }`}
            >
              <span
                className={`material-symbols-outlined ${isActive ? '' : 'group-hover:text-primary transition-colors'}`}
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User footer with logout dropdown */}
      <div className="mt-auto pt-6 border-t border-glass-stroke relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-glass-surface transition-colors cursor-pointer text-left"
        >
          <img alt={userName} className="w-10 h-10 rounded-full border border-primary/30 object-cover flex-shrink-0" src={DEFAULT_AVATAR} />
          <div className="overflow-hidden flex-1">
            <p className="text-text-heading font-bold text-sm truncate">{userName}</p>
            <p className="text-on-surface-variant text-xs truncate capitalize">{userRole}</p>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant text-lg">
            {showUserMenu ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {showUserMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
            <div className="absolute bottom-full left-0 right-0 mb-2 rounded-lg overflow-hidden border border-glass-stroke shadow-xl z-20"
              style={{ background: 'rgba(26, 32, 38, 0.98)', backdropFilter: 'blur(20px)' }}
            >
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-on-surface-variant hover:text-text-heading hover:bg-white/5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
                <span>Sign Out</span>
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  )
}
