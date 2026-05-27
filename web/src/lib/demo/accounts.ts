import type { UserRole } from '@/types/database';

export interface DemoAccount {
  role: string;
  label: UserRole;
  email: string;
  password: string;
  phone: string;
  description: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: 'Creator',
    label: 'creator',
    email: process.env.NEXT_PUBLIC_DEMO_CREATOR_EMAIL ?? 'demo.creator@thesice.com',
    password: process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? 'Demo@1234',
    phone: process.env.NEXT_PUBLIC_DEMO_CREATOR_PHONE ?? '9876543210',
    description: 'Social accounts, metrics, brand deals',
  },
  {
    role: 'Merchant',
    label: 'merchant',
    email: process.env.NEXT_PUBLIC_DEMO_MERCHANT_EMAIL ?? 'demo.merchant@thesice.com',
    password: process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? 'Demo@1234',
    phone: process.env.NEXT_PUBLIC_DEMO_MERCHANT_PHONE ?? '9876543211',
    description: 'Talent discovery, campaigns, wallet',
  },
  {
    role: 'Admin',
    label: 'admin',
    email: process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL ?? 'demo.admin@thesice.com',
    password: process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? 'Demo@1234',
    phone: process.env.NEXT_PUBLIC_DEMO_ADMIN_PHONE ?? '9876543212',
    description: 'Chapter mgmt, applications, arbitration',
  },
  {
    role: 'Super Admin',
    label: 'super_admin',
    email: process.env.NEXT_PUBLIC_DEMO_SUPERADMIN_EMAIL ?? 'demo.superadmin@thesice.com',
    password: process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? 'Demo@1234',
    phone: process.env.NEXT_PUBLIC_DEMO_SUPERADMIN_PHONE ?? '9876543213',
    description: 'Manage chapters, creators, and merchants',
  },
];

export function findDemoByEmail(email: string): DemoAccount | undefined {
  return DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === email.toLowerCase());
}

export function findDemoByPhone(phone: string): DemoAccount | undefined {
  const digits = phone.replace(/[^0-9]/g, '');
  return DEMO_ACCOUNTS.find((a) => {
    const demoDigits = a.phone.replace(/[^0-9]/g, '');
    return digits.endsWith(demoDigits) || demoDigits.endsWith(digits);
  });
}

export function isMockFirebase(): boolean {
  return (
    !process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY === 'mock-api-key-for-prerendering'
  );
}
