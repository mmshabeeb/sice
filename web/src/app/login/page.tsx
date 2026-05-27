'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/client';
import { usePhoneVerification } from '@/hooks/use-phone-verification';
import { DEMO_ACCOUNTS, findDemoByEmail, findDemoByPhone, isMockFirebase } from '@/lib/demo/accounts';
import type { UserRole } from '@/types/database';

const countryCodes = [
  { label: 'India +91', value: '+91' },
  { label: 'United States +1', value: '+1' },
  { label: 'United Kingdom +44', value: '+44' },
  { label: 'UAE +971', value: '+971' },
  { label: 'Saudi Arabia +966', value: '+966' },
  { label: 'Singapore +65', value: '+65' },
];

async function fetchRoleByEmail(emailStr: string): Promise<UserRole | null> {
  try {
    const snap = await getDocs(query(collection(db, 'users'), where('email', '==', emailStr)));
    return snap.empty ? null : (snap.docs[0].data().role as UserRole);
  } catch (e) {
    console.error('fetchRoleByEmail:', e instanceof Error ? e.message : String(e));
    return null;
  }
}

async function fetchRoleByPhone(phoneStr: string): Promise<UserRole | null> {
  try {
    const snap1 = await getDocs(query(collection(db, 'users'), where('phone', '==', phoneStr)));
    if (!snap1.empty) return snap1.docs[0].data().role as UserRole;

    const snap2 = await getDocs(query(collection(db, 'users'), where('contact_number', '==', phoneStr)));
    if (!snap2.empty) return snap2.docs[0].data().role as UserRole;

    const allUsers = await getDocs(collection(db, 'users'));
    const cleanTarget = phoneStr.replace(/[^0-9]/g, '');
    for (const d of allUsers.docs) {
      const udata = d.data();
      const uPhone = String(udata.phone || udata.contact_number || '').replace(/[^0-9]/g, '');
      if (uPhone && cleanTarget && (uPhone.includes(cleanTarget) || cleanTarget.includes(uPhone))) {
        return udata.role as UserRole;
      }
    }
  } catch (e) {
    console.error('fetchRoleByPhone:', e instanceof Error ? e.message : String(e));
  }
  return null;
}

export default function LoginPage() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const phone = usePhoneVerification('recaptcha-container-login');

  async function createSession(idToken: string): Promise<boolean> {
    const res = await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
    return res.ok;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const demo = findDemoByEmail(email);
      let idToken: string;
      let role: UserRole;

      if (demo && demo.password === password) {
        idToken = `mock-id-token-${demo.label}`;
        role = demo.label;
      } else {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        idToken = await user.getIdToken();
        const profileSnap = await getDoc(doc(db, 'users', user.uid));
        const resolvedRole = profileSnap.exists()
          ? (profileSnap.data().role as UserRole)
          : await fetchRoleByEmail(email);
        if (!resolvedRole) { setError('Profile not found. Please contact support.'); setLoading(false); return; }
        role = resolvedRole;
      }

      if (!await createSession(idToken)) throw new Error('Session creation failed. Please try again.');
      router.push(`/dashboard/${role}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign in failed.';
      setError(msg.replace('Firebase: ', '').replace(/\(auth\/.*\)\.?/, '').trim());
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);
    setError(null);
    try {
      let emailStr: string;
      let idToken: string;
      let role: UserRole | null = null;

      if (isMockFirebase()) {
        emailStr = DEMO_ACCOUNTS[0].email;
        idToken = `mock-id-token-${DEMO_ACCOUNTS[0].label}`;
        role = DEMO_ACCOUNTS[0].label;
      } else {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        const result = await signInWithPopup(auth, provider);
        if (!result.user?.email) throw new Error('Could not retrieve email from Google Sign-In.');
        emailStr = result.user.email;
        idToken = await result.user.getIdToken();
        const docSnap = await getDoc(doc(db, 'users', result.user.uid));
        role = docSnap.exists() ? (docSnap.data().role as UserRole) : await fetchRoleByEmail(emailStr);
      }

      if (!role) {
        const demo = findDemoByEmail(emailStr);
        if (demo) { role = demo.label; idToken = `mock-id-token-${demo.label}`; }
      }
      if (!role) throw new Error(`Access Denied: No account linked to ${emailStr}.`);

      if (!await createSession(idToken)) throw new Error('Session creation failed. Please try again.');
      router.push(`/dashboard/${role}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Google Login failed.');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp() {
    const result = await phone.verifyOtp();
    if (!result) return;
    try {
      let role: UserRole | null = result.demoRole as UserRole | null;
      if (!role) {
        role = await fetchRoleByPhone(result.phone);
        const demo = findDemoByPhone(result.phone);
        if (!role && demo) role = demo.label;
      }
      if (!role) throw new Error(`Access Denied: No account linked to ${result.phone}.`);
      if (!await createSession(result.idToken)) throw new Error('Session creation failed. Please try again.');
      router.push(`/dashboard/${role}`);
    } catch (err: unknown) {
      phone.clearError();
      setError(err instanceof Error ? err.message : 'Login failed.');
    }
  }

  return (
    <>
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
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
          <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,169,104,0.10), transparent 70%)', top: -200, left: -200, filter: 'blur(80px)' }} />
          <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,136,74,0.08), transparent 70%)', bottom: -150, right: -150, filter: 'blur(80px)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420 }}>
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

          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(240,235,224,0.08)',
            borderRadius: 16,
            padding: 36,
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#F0EBE0', marginBottom: 6, fontFamily: 'var(--font-bricolage, sans-serif)' }}>
              Sign in
            </h2>
            <p style={{ fontSize: 13, color: 'rgba(240,235,224,0.45)', marginBottom: 24 }}>
              Access your creator, merchant or admin portal.
            </p>

            {/* Google Sign-in Button */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                style={{
                  background: 'white',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: 100,
                  padding: '11px 24px',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.2s',
                  width: '100%',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" style={{ display: 'block' }}>
                  <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.91c1.7-1.56 2.69-3.86 2.69-6.6z"/>
                  <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.2l-2.91-2.26c-.8.54-1.84.86-3.05.86-2.34 0-4.32-1.58-5.03-3.7H.95v2.32A9 9 0 0 0 9 18z"/>
                  <path fill="#FBBC05" d="M3.97 10.7a5.4 5.4 0 0 1 0-3.4V4.98H.95a9 9 0 0 0 0 8.04l3.02-2.32z"/>
                  <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35L15 2.1A9 9 0 0 0 .95 4.98l3.02 2.32C4.68 5.16 6.66 3.58 9 3.58z"/>
                </svg>
                <span>{loading && loginMethod === 'password' ? 'Connecting...' : 'Sign in with Google'}</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0' }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(240, 235, 224, 0.1)' }} />
                <span style={{ fontSize: 11, color: 'rgba(240, 235, 224, 0.35)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>or</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(240, 235, 224, 0.1)' }} />
              </div>
            </div>

            {/* Login Tab Selector */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(240,235,224,0.1)', marginBottom: 20 }}>
              <button
                type="button"
                onClick={() => { setLoginMethod('password'); setError(null); }}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  background: 'none',
                  border: 'none',
                  borderBottom: loginMethod === 'password' ? '2px solid #C8A968' : '2px solid transparent',
                  color: loginMethod === 'password' ? '#F0EBE0' : 'rgba(240,235,224,0.4)',
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => { setLoginMethod('otp'); setError(null); }}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  background: 'none',
                  border: 'none',
                  borderBottom: loginMethod === 'otp' ? '2px solid #C8A968' : '2px solid transparent',
                  color: loginMethod === 'otp' ? '#F0EBE0' : 'rgba(240,235,224,0.4)',
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                Mobile OTP
              </button>
            </div>

            {/* Password Login Form */}
            {loginMethod === 'password' && (
              <form onSubmit={handleSubmit} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <input type="text" name="prevent_autofill_email" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
                <input type="password" name="prevent_autofill_password" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(240,235,224,0.45)' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    autoComplete="off"
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
                    autoComplete="new-password"
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
            )}

            {/* OTP Login Form */}
            {loginMethod === 'otp' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {!phone.otpSent ? (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(240,235,224,0.45)' }}>
                        Mobile Number
                      </label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <select
                          value={phone.countryCode}
                          onChange={(e) => phone.setCountryCode(e.target.value)}
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(240,235,224,0.10)', borderRadius: 8, padding: '11px 14px', fontSize: 14, color: '#F0EBE0', outline: 'none', width: '40%' }}
                        >
                          {countryCodes.map((c) => (
                            <option key={c.value} value={c.value} style={{ background: '#080D26', color: '#F0EBE0' }}>{c.label}</option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          required
                          value={phone.phoneInput}
                          onChange={(e) => phone.setPhoneInput(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="9876543210"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(240,235,224,0.10)', borderRadius: 8, padding: '11px 14px', fontSize: 14, color: '#F0EBE0', outline: 'none', flex: 1 }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(200,169,104,0.50)'; }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(240,235,224,0.10)'; }}
                        />
                      </div>
                    </div>

                    {(phone.error || error) && (
                      <div style={{ background: 'rgba(220,38,38,0.10)', border: '1px solid rgba(220,38,38,0.25)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#fca5a5' }}>
                        {phone.error ?? error}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={phone.sendOtp}
                      disabled={phone.loading || !phone.phoneInput}
                      style={{ background: '#C8A968', color: '#080D26', border: 'none', borderRadius: 100, padding: '12px 24px', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', cursor: (phone.loading || !phone.phoneInput) ? 'not-allowed' : 'pointer', opacity: (phone.loading || !phone.phoneInput) ? 0.6 : 1, transition: 'all 0.3s', width: '100%' }}
                    >
                      {phone.loading ? 'Sending Code...' : 'Send OTP Code'}
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(240,235,224,0.45)' }}>
                        Enter 6-digit OTP
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={phone.otpCode}
                        onChange={(e) => phone.setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="123456"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(240,235,224,0.10)', borderRadius: 8, padding: '11px 14px', fontSize: 16, color: '#F0EBE0', outline: 'none', textAlign: 'center', letterSpacing: '0.3em', fontFamily: 'monospace', width: '100%' }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(200,169,104,0.50)'; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(240,235,224,0.10)'; }}
                      />
                    </div>

                    {(phone.error || error) && (
                      <div style={{ background: 'rgba(220,38,38,0.10)', border: '1px solid rgba(220,38,38,0.25)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#fca5a5' }}>
                        {phone.error ?? error}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: 10 }}>
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={phone.loading || phone.otpCode.length !== 6}
                        style={{ background: '#C8A968', color: '#080D26', border: 'none', borderRadius: 100, padding: '12px 24px', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', cursor: (phone.loading || phone.otpCode.length !== 6) ? 'not-allowed' : 'pointer', opacity: (phone.loading || phone.otpCode.length !== 6) ? 0.6 : 1, transition: 'all 0.3s', flex: 2 }}
                      >
                        {phone.loading ? 'Verifying...' : 'Verify & Login'}
                      </button>
                      <button
                        type="button"
                        onClick={phone.reset}
                        style={{ background: 'rgba(255,255,255,0.05)', color: '#F0EBE0', border: '1px solid rgba(240,235,224,0.10)', borderRadius: 100, padding: '12px 24px', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', cursor: 'pointer', flex: 1 }}
                      >
                        Back
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            <p style={{ marginTop: 28, textAlign: 'center', fontSize: 13, color: 'rgba(240,235,224,0.40)' }}>
              New creator?{' '}
              <Link href="/apply" style={{ color: '#C8A968', textDecoration: 'underline', textUnderlineOffset: 3 }}>
                Apply for membership
              </Link>
            </p>
          </div>
        </div>

        {/* Recaptcha hidden container */}
        <div id="recaptcha-container-login"></div>
      </main>
    </>
  );
}
