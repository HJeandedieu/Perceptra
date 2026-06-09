import { useState } from 'react';
import Login from './pages/Login';
import Analytics from './pages/Analytics';

function App() {
  const [user, setUser] = useState(null);

  // Handles successful login — in production, token is validated against JWT
  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-surface-950 flex">
      {/* Simple sidebar placeholder — will be shared across all pages by Dorcas */}
      <aside className="w-16 lg:w-60 bg-surface-900 border-r border-surface-800 flex flex-col shrink-0">
        <div className="h-14 flex items-center gap-3 px-4 border-b border-surface-800">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-perceptra-critical flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          <span className="text-sm font-semibold text-white hidden lg:block">PERCEPTRA</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <NavItem active label="Analytics" icon="📊" />
          <NavItem label="Live Feed" icon="📹" />
          <NavItem label="Alerts" icon="🔔" />
          <NavItem label="Settings" icon="⚙️" />
        </nav>
        <div className="p-3 border-t border-surface-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-gray-300 hover:bg-surface-800 transition-colors"
          >
            <span className="text-base">🚪</span>
            <span className="hidden lg:block">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 overflow-auto">
        <Analytics user={user} onLogout={handleLogout} />
      </main>
    </div>
  );
}

function NavItem({ label, icon, active }) {
  return (
    <a
      href="#"
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
        active
          ? 'bg-accent-500/10 text-accent-400'
          : 'text-gray-500 hover:text-gray-300 hover:bg-surface-800'
      }`}
    >
      <span className="text-base">{icon}</span>
      <span className="hidden lg:block">{label}</span>
    </a>
  );
}

export default App;
