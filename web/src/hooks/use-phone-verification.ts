'use client';

import { useRef, useState } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { findDemoByPhone, isMockFirebase } from '@/lib/demo/accounts';

export interface PhoneVerificationState {
  phoneInput: string;
  setPhoneInput: (v: string) => void;
  countryCode: string;
  setCountryCode: (v: string) => void;
  otpCode: string;
  setOtpCode: (v: string) => void;
  otpSent: boolean;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  sendOtp: () => Promise<void>;
  verifyOtp: () => Promise<{ phone: string; idToken: string; demoRole: string | null } | null>;
  reset: () => void;
}

export function usePhoneVerification(recaptchaContainerId: string): PhoneVerificationState {
  const [phoneInput, setPhoneInput] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

  const fullPhone = `${countryCode}${phoneInput}`;

  function clearError() { setError(null); }

  async function sendOtp() {
    if (!/^[0-9]{7,15}$/.test(phoneInput)) {
      setError('Please enter a valid phone number (7–15 digits).');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const mock = isMockFirebase();
      const demo = findDemoByPhone(phoneInput);

      if (mock || demo) {
        setOtpSent(true);
      } else {
        if (!recaptchaRef.current) {
          recaptchaRef.current = new RecaptchaVerifier(auth, recaptchaContainerId, {
            size: 'invisible',
            callback: () => {},
          });
        }
        const result = await signInWithPhoneNumber(auth, fullPhone, recaptchaRef.current);
        confirmationRef.current = result;
        setOtpSent(true);
      }
    } catch (err: unknown) {
      const e = err as { message?: string; code?: string };
      let msg = e.message ?? 'Failed to send OTP.';
      if (e.code === 'auth/unauthorized-domain') {
        msg = 'Unauthorized domain. Authorize this domain in the Firebase Console.';
      }
      setError(msg);
      recaptchaRef.current?.clear();
      recaptchaRef.current = null;
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(): Promise<{ phone: string; idToken: string; demoRole: string | null } | null> {
    if (otpCode.length !== 6) {
      setError('Please enter a 6-digit OTP code.');
      return null;
    }
    setLoading(true);
    setError(null);
    try {
      const mock = isMockFirebase();
      const demo = findDemoByPhone(phoneInput);

      if (mock || demo) {
        if (otpCode !== '123456') {
          throw new Error('Invalid OTP. Use 123456 for demo mode.');
        }
        return {
          phone: fullPhone,
          idToken: `mock-id-token-${demo?.label ?? 'creator'}`,
          demoRole: demo?.label ?? null,
        };
      }

      if (!confirmationRef.current) {
        throw new Error('No active session. Please request OTP again.');
      }
      const result = await confirmationRef.current.confirm(otpCode);
      if (!result.user) throw new Error('SMS verification failed.');
      const idToken = await result.user.getIdToken();
      return { phone: result.user.phoneNumber ?? fullPhone, idToken, demoRole: null };
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'OTP verification failed.');
      return null;
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setPhoneInput('');
    setOtpCode('');
    setOtpSent(false);
    setError(null);
    confirmationRef.current = null;
  }

  return {
    phoneInput, setPhoneInput,
    countryCode, setCountryCode,
    otpCode, setOtpCode,
    otpSent, loading, error,
    clearError, sendOtp, verifyOtp, reset,
  };
}
