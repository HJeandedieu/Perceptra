import AuthLayout from '../components/AuthLayout';

export default function ChangePassword({ onNavigate }) {
  return (
    <AuthLayout imageTitle="Secure Your Account">
      <h1 className="text-2xl font-bold text-white mb-6">Change Password</h1>
      <form className="space-y-4">
        <input type="password" placeholder="New password" className="w-full bg-surface-800 border border-surface-600 rounded-lg p-3 text-white" />
        <input type="password" placeholder="Confirm new password" className="w-full bg-surface-800 border border-surface-600 rounded-lg p-3 text-white" />
        <button type="button" onClick={() => onNavigate('login')} className="w-full bg-accent-500 py-3 rounded-lg text-white font-semibold">Update</button>
      </form>
    </AuthLayout>
  );
}
