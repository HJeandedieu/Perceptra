import AuthLayout from '../components/AuthLayout';

export default function TokenVerification({ onNavigate }) {
  return (
    <AuthLayout imageTitle="Reset Your Password">
      <h1 className="text-2xl font-bold text-white mb-2">Reset token</h1>
      <p className="text-gray-400 mb-6">Enter the token from your email.</p>
      <form className="space-y-4">
        <input type="text" maxLength={8} placeholder="XX-XXXX-XX" className="w-full text-center tracking-widest bg-surface-800 border border-surface-600 rounded-lg p-4 text-white" />
        <button type="button" onClick={() => onNavigate('change-password')} className="w-full bg-accent-500 py-3 rounded-lg text-white font-semibold">Verify Token</button>
      </form>
    </AuthLayout>
  );
}
