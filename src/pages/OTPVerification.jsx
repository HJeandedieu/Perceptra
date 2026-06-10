import AuthLayout from '../components/AuthLayout';

export default function OTPVerification({ onNavigate }) {
  return (
    <AuthLayout imageTitle="Verify Your Email">
      <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
      <p className="text-gray-400 mb-6">We've sent a 6-digit code to your inbox.</p>
      <form className="space-y-4">
        <input type="text" maxLength={6} placeholder="000000" className="w-full text-center text-2xl tracking-widest bg-surface-800 border border-surface-600 rounded-lg p-4 text-white" />
        <button type="button" onClick={() => onNavigate('analytics')} className="w-full bg-accent-500 py-3 rounded-lg text-white font-semibold">Verify</button>
      </form>
    </AuthLayout>
  );
}
