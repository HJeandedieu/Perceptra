import { Shield } from 'lucide-react';

export default function PasswordReset({ onNavigate }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#0a0b10' }}>
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-perceptra-critical flex items-center justify-center shadow-lg shadow-accent-500/20">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white">PERCEPTRA</span>
        </div>

        <div className="glass-strong rounded-2xl p-8">
          <h1 className="text-xl font-bold text-white mb-2 text-center">Reset password</h1>
          <p className="text-gray-500 text-sm mb-6 text-center">Enter your email to receive a reset token.</p>

          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onNavigate('token-verify'); }}>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="operator@perceptra.io"
                className="glass-input w-full rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-all"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-accent-500 hover:bg-accent-400 text-white font-semibold py-2.5 rounded-lg transition-all shadow-lg shadow-accent-500/20"
            >
              Send Token
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Remember your password?{' '}
            <button type="button" onClick={() => onNavigate('login')} className="text-accent-400 hover:text-accent-300 transition-colors">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
