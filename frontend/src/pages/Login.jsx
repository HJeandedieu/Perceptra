import { useState } from 'react';
import { Shield, Eye, Lock, Mail } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout';

export default function Login({ onLogin, onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLogin) onLogin({ email, role: 'operator' });
  };

  return (
    <AuthLayout imageTitle="Monitor. Detect. Respond.">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-perceptra-critical flex items-center justify-center">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <span className="text-lg font-bold text-white">PERCEPTRA</span>
      </div>

      <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
      <p className="text-gray-500 text-sm mb-8">Sign in to your operator account.</p>

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
              className="glass-input w-full rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-all"
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
              className="glass-input w-full rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-all"
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
          <button type="button" onClick={() => onNavigate?.('forgot-password')} className="text-sm text-accent-400 hover:text-accent-300 transition-colors">
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-accent-500 hover:bg-accent-400 text-white font-semibold py-2.5 rounded-lg transition-all shadow-lg shadow-accent-500/20"
        >
          Sign In
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Don't have an account?{' '}
        <button type="button" onClick={() => onNavigate?.('signup')} className="text-accent-400 hover:text-accent-300 transition-colors">
          Sign up
        </button>
      </p>

      <div className="mt-6 pt-5 border-t border-surface-700 flex items-center justify-center gap-2 text-xs text-gray-600">
        <Lock className="w-3 h-3" />
        <span>Secured with 256-bit encryption</span>
      </div>
    </AuthLayout>
  );
}
