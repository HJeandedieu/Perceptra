import AuthLayout from '../components/AuthLayout';

export default function PasswordReset({ onNavigate }) {
  return (
    <AuthLayout imageTitle="Reset Your Password">
      <h1 className="text-2xl font-bold text-white mb-6">Request Password Reset</h1>
      <form className="space-y-4">
        <input type="email" placeholder="Enter your email" className="w-full bg-surface-800 border border-surface-600 rounded-lg p-3 text-white" />
        <button type="button" onClick={() => onNavigate('token-verify')} className="w-full bg-accent-500 py-3 rounded-lg text-white font-semibold">Send Token</button>
      </form>
    </AuthLayout>
  );
}
