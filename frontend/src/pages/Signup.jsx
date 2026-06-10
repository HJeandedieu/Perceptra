import { useState } from 'react';
import { Shield, Eye, Lock, Mail, User } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout';

export default function Signup({ onNavigate }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onNavigate('otp');
  };

  return (
    <AuthLayout imageTitle="Join the PERCEPTRA Network">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-perceptra-critical flex items-center justify-center">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <span className="text-lg font-bold text-white">PERCEPTRA</span>
      </div>

      <h1 className="text-2xl font-bold text-white mb-1">Create account</h1>
      <p className="text-gray-500 text-sm mb-8">Register as a new operator.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full bg-surface-800 border border-surface-600 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500 transition-all"
              required
            />
          </div>
        </div>

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
              placeholder="Create a strong password"
              className="w-full bg-surface-800 border border-surface-600 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500 transition-all"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-accent-500 hover:bg-accent-400 text-white font-semibold py-2.5 rounded-lg transition-all shadow-lg shadow-accent-500/20"
        >
          Create Account
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Already have an account?{' '}
        <button type="button" onClick={() => onNavigate('login')} className="text-accent-400 hover:text-accent-300 transition-colors">
          Sign in
        </button>
      </p>
    </AuthLayout>
  );
}
