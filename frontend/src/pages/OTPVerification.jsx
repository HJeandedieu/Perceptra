import { Shield } from 'lucide-react';

export default function OTPVerification({ onNavigate }) {
  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-perceptra-critical flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white">PERCEPTRA</span>
        </div>

        <div className="bg-surface-900 rounded-2xl border border-surface-700 p-8 shadow-2xl">
          <h1 className="text-xl font-bold text-white mb-2 text-center">Check your email</h1>
          <p className="text-gray-500 text-sm mb-6 text-center">We sent a 6-digit code to your inbox.</p>

          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onNavigate('analytics'); }}>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 text-center">Verification Code</label>
              <input
                type="text"
                maxLength={6}
                placeholder="000000"
                className="w-full text-center text-2xl tracking-widest bg-surface-800 border border-surface-600 rounded-lg py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500 transition-all"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-accent-500 hover:bg-accent-400 text-white font-semibold py-2.5 rounded-lg transition-all shadow-lg shadow-accent-500/20"
            >
              Verify
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Didn't get a code?{' '}
            <button type="button" className="text-accent-400 hover:text-accent-300 transition-colors">
              Resend
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
