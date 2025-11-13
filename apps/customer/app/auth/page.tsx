'use client';

import { useState } from 'react';
import axios from 'axios';
import { signIn } from 'next-auth/react';

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export default function AuthPage() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [message, setMessage] = useState('');

  const requestOtp = async () => {
    await axios.post(`${apiBase}/auth/request-otp`, { phone });
    setStep('otp');
    setMessage('OTP sent. Check your phone.');
  };

  const verify = async () => {
    await signIn('credentials', { phone, otp, redirect: true, callbackUrl: '/' });
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Secure Login</h1>
      {step === 'phone' ? (
        <div className="space-y-2">
          <label className="block text-sm font-medium">Phone number</label>
          <input
            className="w-full rounded border border-slate-300 p-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button onClick={requestOtp} className="w-full rounded bg-brand px-4 py-2 font-semibold text-white">
            Send OTP
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <label className="block text-sm font-medium">OTP</label>
          <input className="w-full rounded border border-slate-300 p-2" value={otp} onChange={(e) => setOtp(e.target.value)} />
          <button onClick={verify} className="w-full rounded bg-brand px-4 py-2 font-semibold text-white">
            Verify & Continue
          </button>
        </div>
      )}
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}
