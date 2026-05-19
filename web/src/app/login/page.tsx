'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/client';
import type { UserRole } from '@/types/database';

const DEMO_ACCOUNTS = [
  { role: 'Creator', email: 'demo.creator@sice.media', password: 'Demo@1234', description: 'Social accounts, metrics, brand deals' },
  { role: 'Merchant', email: 'demo.merchant@sice.media', password: 'Demo@1234', description: 'Talent discovery, campaigns, wallet' },
  { role: 'Admin', email: 'demo.admin@sice.media', password: 'Demo@1234', description: 'Chapter mgmt, applications, arbitration' },
  { role: 'Super Admin', email: 'demo.superadmin@sice.media', password: 'Demo@1234', description: 'Manage chapters, creators, and merchants' },
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

    try {
      const isMockFirebase = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === 'mock-api-key-for-prerendering';
      const isDemo = DEMO_ACCOUNTS.find(
        (acc) => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password
      );

      let idToken: string;
      let role: UserRole;

      if (isMockFirebase && isDemo) {
        idToken = `mock-id-token-${isDemo.role.replace(' ', '_').toLowerCase()}`;
        role = isDemo.role.replace(' ', '_').toLowerCase() as UserRole;
      } else {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        idToken = await user.getIdToken();

        const profileSnap = await getDoc(doc(db, 'users', user.uid));
        if (!profileSnap.exists()) {
          setError('Profile not found. Please contact support.');
          setLoading(false);
          return;
        }
        role = profileSnap.data().role as UserRole;
      }

      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) throw new Error('Session creation failed. Please try again.');

      router.push(`/dashboard/${role}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign in failed. Please try again.';
      setError(msg.replace('Firebase: ', '').replace(/\(auth\/.*\)\.?/, '').trim());
      setLoading(false);
    }
  }

  function fillDemo(demoEmail: string, demoPassword: string) {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError(null);
  }

  return (
    <>
      {/* Reuse the same nav style as landing page */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(8, 13, 38, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(240, 235, 224, 0.06)',
      }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '18px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-bricolage, sans-serif)', fontWeight: 600, fontSize: 22, letterSpacing: '-0.05em', color: '#F0EBE0' }}>
            SICE
          </Link>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <Link href="/" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(240,235,224,0.65)' }}>
              Home
            </Link>
            <Link href="/apply" style={{
              fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em',
              color: '#080D26', background: '#C8A968',
              padding: '9px 18px', borderRadius: 100, fontWeight: 500,
            }}>
              Apply
            </Link>
          </div>
        </div>
      </nav>

      <main style={{ minHeight: '100vh', background: '#080D26', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 60px' }}>

        {/* Subtle background orbs matching hero */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
          <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,169,104,0.10), transparent 70%)', top: -200, left: -200, filter: 'blur(80px)' }} />
          <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,136,74,0.08), transparent 70%)', bottom: -150, right: -150, filter: 'blur(80px)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420 }}>

          {/* Wordmark */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ height: 1, width: 40, background: 'rgba(200,169,104,0.4)' }} />
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#C8A968' }} />
                <div style={{ height: 1, width: 40, background: 'rgba(200,169,104,0.4)' }} />
              </div>
              <div style={{ fontFamily: 'var(--font-bricolage, sans-serif)', fontSize: 48, fontWeight: 700, letterSpacing: '-0.05em', color: '#F0EBE0', lineHeight: 1 }}>
                SICE
              </div>
              <div style={{ height: 1, width: 80, background: 'rgba(200,169,104,0.3)' }} />
            </div>
            <p style={{ fontSize: 13, color: 'rgba(240,235,224,0.45)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Member Portal
            </p>
          </div>

          {/* Card */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(240,235,224,0.08)',
            borderRadius: 16,
            padding: 36,
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#F0EBE0', marginBottom: 6, fontFamily: 'var(--font-bricolage, sans-serif)' }}>
              Sign in
            </h2>
            <p style={{ fontSize: 13, color: 'rgba(240,235,224,0.45)', marginBottom: 28 }}>
              Access your creator, merchant or admin portal.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(240,235,224,0.45)' }}>
                  Email
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(240,235,224,0.10)',
                    borderRadius: 8,
                    padding: '11px 14px',
                    fontSize: 14,
                    color: '#F0EBE0',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    width: '100%',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(200,169,104,0.50)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(240,235,224,0.10)'; }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(240,235,224,0.45)' }}>
                  Password
                </label>
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(240,235,224,0.10)',
                    borderRadius: 8,
                    padding: '11px 14px',
                    fontSize: 14,
                    color: '#F0EBE0',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    width: '100%',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(200,169,104,0.50)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(240,235,224,0.10)'; }}
                />
              </div>

              {error && (
                <div style={{
                  background: 'rgba(220,38,38,0.10)',
                  border: '1px solid rgba(220,38,38,0.25)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  fontSize: 13,
                  color: '#fca5a5',
                }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: '#C8A968',
                  color: '#080D26',
                  border: 'none',
                  borderRadius: 100,
                  padding: '12px 24px',
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  transition: 'all 0.3s',
                  width: '100%',
                  marginTop: 4,
                }}
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            <p style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: 'rgba(240,235,224,0.40)' }}>
              New creator?{' '}
              <Link href="/apply" style={{ color: '#C8A968', textDecoration: 'underline', textUnderlineOffset: 3 }}>
                Apply for membership
              </Link>
            </p>
          </div>

          {/* Demo accounts — development only */}
          {process.env.NODE_ENV === 'development' && <div style={{ marginTop: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(240,235,224,0.08)' }} />
              <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(240,235,224,0.25)' }}>
                Demo accounts
              </span>
              <div style={{ flex: 1, height: 1, background: 'rgba(240,235,224,0.08)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => fillDemo(account.email, account.password)}
                  style={{
                    background: 'rgba(200,169,104,0.05)',
                    border: '1px solid rgba(200,169,104,0.15)',
                    borderRadius: 10,
                    padding: '12px 16px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                    width: '100%',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(200,169,104,0.10)';
                    e.currentTarget.style.borderColor = 'rgba(200,169,104,0.30)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(200,169,104,0.05)';
                    e.currentTarget.style.borderColor = 'rgba(200,169,104,0.15)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#C8A968' }}>
                        {account.role}
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(240,235,224,0.40)', marginTop: 2 }}>
                        {account.description}
                      </div>
                    </div>
                    <span style={{ fontSize: 10, color: 'rgba(240,235,224,0.25)', flexShrink: 0, marginLeft: 12 }}>
                      Click to fill
                    </span>
                  </div>
                  <div style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(240,235,224,0.45)', marginTop: 6 }}>
                    {account.email}
                  </div>
                </button>
              ))}
            </div>
          </div>}

        </div>
      </main>
    </>
  );
}
