import { useState } from 'react';
import { BarChart3, Camera, Bell, Settings, LogOut } from 'lucide-react';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OTPVerification from './pages/OTPVerification';
import PasswordReset from './pages/PasswordReset';
import TokenVerification from './pages/TokenVerification';
import ChangePassword from './pages/ChangePassword';
import Analytics from './pages/Analytics';

const navItems = [
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'live-feed', label: 'Live Feed', icon: Camera },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
];

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('landing');

  const navigate = (target) => setPage(target);

  const handleLogin = (userData) => {
    setUser(userData);
    setPage('analytics');
  };

  const handleLogout = () => {
    setUser(null);
    setPage('landing');
  };

  if (page === 'landing') {
    return <Landing onNavigate={navigate} />;
  }

  if (page === 'login') return <Login onLogin={handleLogin} onNavigate={navigate} />;
  if (page === 'signup') return <Signup onNavigate={navigate} />;
  if (page === 'otp') return <OTPVerification onNavigate={navigate} />;
  if (page === 'forgot-password') return <PasswordReset onNavigate={navigate} />;
  if (page === 'token-verify') return <TokenVerification onNavigate={navigate} />;
  if (page === 'change-password') return <ChangePassword onNavigate={navigate} />;

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0a0b10' }}>
      {/* Sidebar - glass */}
      <aside className="glass-sidebar w-16 lg:w-60 flex flex-col shrink-0">
        <div className="h-14 flex items-center gap-3 px-4 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-perceptra-critical flex items-center justify-center shrink-0 shadow-lg shadow-accent-500/20">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          <span className="text-sm font-semibold text-white hidden lg:block">PERCEPTRA</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.id}
              active={page === item.id}
              label={item.label}
              Icon={item.icon}
              onClick={() => setPage(item.id)}
            />
          ))}
        </nav>
        <div className="p-3 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden lg:block">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {page === 'analytics' && <Analytics user={user} onLogout={handleLogout} />}
      </main>
    </div>
  );
}

function NavItem({ label, Icon, active, onClick }) {
  return (
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); onClick?.(); }}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
        active
          ? 'glass text-accent-400'
          : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden lg:block">{label}</span>
    </a>
  );
}

export default App;
