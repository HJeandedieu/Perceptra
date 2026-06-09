import { useState } from 'react';
import { Shield, Eye, Lock, Mail } from 'lucide-react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production: POST /api/auth/login with { email, password }
    // Returns { token, role, expires_at }
    if (onLogin) onLogin({ email, role: 'operator' });
  };

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-500 to-perceptra-critical mb-4 shadow-lg shadow-accent-500/20">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">PERCEPTRA</h1>
          <p className="text-gray-500 text-sm mt-1">Threat Detection Platform</p>
        </div>

        {/* Login Card */}
        <div className="bg-surface-900 rounded-2xl border border-surface-700 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@perceptra.io"
                  className="w-full bg-surface-800 border border-surface-600 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-surface-800 border border-surface-600 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500 transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-surface-600 bg-surface-800 text-accent-500 focus:ring-accent-500/40"
                />
                <span className="text-sm text-gray-500">Remember me</span>
              </label>
              <a href="#" className="text-sm text-accent-400 hover:text-accent-300 transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-accent-500 hover:bg-accent-400 text-white font-semibold py-2.5 rounded-lg transition-all shadow-lg shadow-accent-500/20 hover:shadow-accent-500/30"
            >
              Sign In
            </button>
          </form>

          {/* Secure connection indicator */}
          <div className="mt-6 pt-5 border-t border-surface-700 flex items-center justify-center gap-2 text-xs text-gray-600">
            <Lock className="w-3 h-3" />
            <span>Secured with 256-bit encryption</span>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-700 mt-6">
          &copy; 2026 PERCEPTRA &middot; All rights reserved
        </p>
      </div>
    </div>
  );
}
