'use client';

import { useState } from 'react';
import axios from 'axios';
import { signIn } from 'next-auth/react';

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export default function AuthPage() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');

  const requestOtp = async () => {
    await axios.post(`${apiBase}/auth/request-otp`, { phone });
    setStep('otp');
  };

  const verify = async () => {
    await signIn('credentials', { phone, otp, redirect: true, callbackUrl: '/' });
  };

  return (
    <div className="mx-auto max-w-md space-y-4 rounded-xl bg-slate-800 p-6">
      <h1 className="text-2xl font-semibold">Staff Login</h1>
      {step === 'phone' ? (
        <div className="space-y-2">
          <label className="text-sm">Phone</label>
          <input className="w-full rounded border border-slate-600 bg-slate-900 p-2" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <button onClick={requestOtp} className="w-full rounded bg-brand px-4 py-2 font-semibold">
            Send OTP
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <label className="text-sm">OTP</label>
          <input className="w-full rounded border border-slate-600 bg-slate-900 p-2" value={otp} onChange={(e) => setOtp(e.target.value)} />
          <button onClick={verify} className="w-full rounded bg-brand px-4 py-2 font-semibold">
            Verify
          </button>
        </div>
      )}
    </div>
  );
}
