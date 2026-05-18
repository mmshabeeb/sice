'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { UserRole } from '@/types/database';

const DEMO_ACCOUNTS = [
  {
    role: 'Creator',
    email: 'demo.creator@sice.media',
    password: 'Demo@1234',
    description: 'Social accounts, metrics, brand deals',
  },
  {
    role: 'Merchant',
    email: 'demo.merchant@sice.media',
    password: 'Demo@1234',
    description: 'Talent discovery, campaigns, wallet',
  },
  {
    role: 'Admin',
    email: 'demo.admin@sice.media',
    password: 'Demo@1234',
    description: 'Chapter mgmt, applications, arbitration',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({ email, password });

    if (authError || !authData.user) {
      setError(authError?.message ?? 'Sign in failed. Please try again.');
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .single() as { data: { role: UserRole } | null; error: unknown };

    if (profileError || !profile) {
      setError('Could not load your profile. Please contact support.');
      setLoading(false);
      return;
    }

    router.push(`/dashboard/${profile.role}`);
  }

  function fillDemo(email: string, password: string) {
    setEmail(email);
    setPassword(password);
    setError(null);
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: '#080D26' }}
    >
      {/* Brand */}
      <div className="mb-10 text-center">
        <div
          className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4"
          style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.35)' }}
        >
          {/* Wordmark icon placeholder */}
          <span
            className="text-2xl font-bold tracking-tighter select-none"
            style={{ color: '#C9A84C', fontFamily: 'var(--font-bricolage, sans-serif)' }}
          >
            S
          </span>
        </div>
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ color: '#F0EBE0', fontFamily: 'var(--font-bricolage, sans-serif)' }}
        >
          SICE
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'rgba(240,235,224,0.55)' }}>
          South Indian Creators Economy
        </p>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-sm rounded-2xl p-8"
        style={{
          background: 'rgba(255,255,255,0.035)',
          border: '1px solid rgba(240,235,224,0.10)',
        }}
      >
        <h2
          className="text-lg font-semibold mb-1"
          style={{ color: '#F0EBE0' }}
        >
          Sign in to your portal
        </h2>
        <p className="text-sm mb-6" style={{ color: 'rgba(240,235,224,0.50)' }}>
          Enter your credentials to continue.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-xs font-medium uppercase tracking-wider"
              style={{ color: 'rgba(240,235,224,0.55)' }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-colors"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(240,235,224,0.12)',
                color: '#F0EBE0',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.55)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(240,235,224,0.12)';
              }}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-xs font-medium uppercase tracking-wider"
              style={{ color: 'rgba(240,235,224,0.55)' }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-colors"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(240,235,224,0.12)',
                color: '#F0EBE0',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.55)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(240,235,224,0.12)';
              }}
            />
          </div>

          {/* Error */}
          {error && (
            <div
              className="rounded-lg px-3.5 py-2.5 text-sm"
              style={{
                background: 'rgba(220,38,38,0.12)',
                border: '1px solid rgba(220,38,38,0.30)',
                color: '#fca5a5',
              }}
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-opacity disabled:opacity-60"
            style={{
              background: '#C9A84C',
              color: '#080D26',
            }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        {/* Apply link */}
        <p className="mt-5 text-center text-sm" style={{ color: 'rgba(240,235,224,0.45)' }}>
          New creator?{' '}
          <Link
            href="/apply"
            className="font-medium underline underline-offset-2 transition-colors"
            style={{ color: '#C9A84C' }}
          >
            Apply for membership
          </Link>
        </p>
      </div>

      {/* Demo credentials */}
      <div className="mt-8 w-full max-w-sm">
        <p
          className="text-center text-xs font-medium uppercase tracking-widest mb-3"
          style={{ color: 'rgba(240,235,224,0.30)' }}
        >
          Demo accounts for reviewers
        </p>
        <div className="flex flex-col gap-2">
          {DEMO_ACCOUNTS.map((account) => (
            <button
              key={account.role}
              type="button"
              onClick={() => fillDemo(account.email, account.password)}
              className="w-full text-left rounded-xl px-4 py-3 transition-colors"
              style={{
                background: 'rgba(201,168,76,0.06)',
                border: '1px solid rgba(201,168,76,0.18)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(201,168,76,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(201,168,76,0.06)';
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: '#C9A84C' }}
                  >
                    {account.role}
                  </span>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(240,235,224,0.45)' }}>
                    {account.description}
                  </p>
                </div>
                <span className="text-xs shrink-0" style={{ color: 'rgba(240,235,224,0.30)' }}>
                  Click to fill
                </span>
              </div>
              <p className="text-xs mt-1.5 font-mono" style={{ color: 'rgba(240,235,224,0.55)' }}>
                {account.email}
              </p>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
