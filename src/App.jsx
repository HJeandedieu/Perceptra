import { useState } from 'react';
import { BarChart3, Camera, Bell, Settings, LogOut } from 'lucide-react';
import Login from './pages/Login';
import Analytics from './pages/Analytics';
import Landing from './pages/Landing';

const navItems = [
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'live-feed', label: 'Live Feed', icon: Camera },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
];

function App() {
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState('landing'); // 'landing', 'login', 'dashboard'

  const handleLogin = (userData) => {
    setUser(userData);
    setActivePage('analytics');
  };

  const handleLogout = () => {
    setUser(null);
    setActivePage('landing');
  };

  if (activePage === 'landing') {
    return <Landing onNavigate={setActivePage} />;
  }

  if (activePage === 'login') {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-surface-950 flex">
      <aside className="w-16 lg:w-60 bg-surface-900 border-r border-surface-800 flex flex-col shrink-0">
        <div className="h-14 flex items-center gap-3 px-4 border-b border-surface-800">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-perceptra-critical flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          <span className="text-sm font-semibold text-white hidden lg:block">PERCEPTRA</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.id}
              active={activePage === item.id}
              label={item.label}
              Icon={item.icon}
              onClick={() => setActivePage(item.id)}
            />
          ))}
        </nav>
        <div className="p-3 border-t border-surface-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-gray-300 hover:bg-surface-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden lg:block">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {activePage === 'analytics' && <Analytics user={user} onLogout={handleLogout} />}
        {/* Dorcas to implement Live Feed/Alerts components here */}
      </main>
    </div>
  );
}

function NavItem({ label, Icon, active, onClick }) {
  return (
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); onClick?.(); }}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
        active
          ? 'bg-accent-500/10 text-accent-400'
          : 'text-gray-500 hover:text-gray-300 hover:bg-surface-800'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden lg:block">{label}</span>
    </a>
  );
}

export default App;
