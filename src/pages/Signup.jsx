import { useState } from 'react';
import AuthLayout from '../components/AuthLayout';

export default function Signup({ onNavigate }) {
  return (
    <AuthLayout imageTitle="Join the PERCEPTRA Network">
      <h1 className="text-2xl font-bold text-white mb-6">Create Account</h1>
      <form className="space-y-4">
        <input type="text" placeholder="Full Name" className="w-full bg-surface-800 border border-surface-600 rounded-lg p-3 text-white" />
        <input type="email" placeholder="Email" className="w-full bg-surface-800 border border-surface-600 rounded-lg p-3 text-white" />
        <input type="password" placeholder="Password" className="w-full bg-surface-800 border border-surface-600 rounded-lg p-3 text-white" />
        <button type="button" onClick={() => onNavigate('otp')} className="w-full bg-accent-500 py-3 rounded-lg text-white font-semibold">Sign Up</button>
      </form>
    </AuthLayout>
  );
}
