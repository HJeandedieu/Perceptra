import { Shield } from 'lucide-react';

export default function TokenVerification({ onNavigate }) {
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
          <h1 className="text-xl font-bold text-white mb-2 text-center">Reset token</h1>
          <p className="text-gray-500 text-sm mb-6 text-center">Enter the token from your email.</p>

          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onNavigate('change-password'); }}>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 text-center">Token</label>
              <input
                type="text"
                maxLength={8}
                placeholder="XX-XXXX-XX"
                className="glass-input w-full text-center tracking-widest rounded-lg py-3 text-white placeholder-gray-600 outline-none transition-all"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-accent-500 hover:bg-accent-400 text-white font-semibold py-2.5 rounded-lg transition-all shadow-lg shadow-accent-500/20"
            >
              Verify Token
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Didn't get a token?{' '}
            <button type="button" className="text-accent-400 hover:text-accent-300 transition-colors">
              Resend
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
