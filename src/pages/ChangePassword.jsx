import { Shield, Lock } from 'lucide-react';

export default function ChangePassword({ onNavigate }) {
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
          <h1 className="text-xl font-bold text-white mb-2 text-center">Change password</h1>
          <p className="text-gray-500 text-sm mb-6 text-center">Enter your new password.</p>

          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onNavigate('login'); }}>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full bg-surface-800 border border-surface-600 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full bg-surface-800 border border-surface-600 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500 transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-accent-500 hover:bg-accent-400 text-white font-semibold py-2.5 rounded-lg transition-all shadow-lg shadow-accent-500/20"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
