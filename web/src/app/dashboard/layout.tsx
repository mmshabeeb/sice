import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase/server';
import type { UserRole } from '@/types/database';
import DashboardShell from './components/DashboardShell';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) {
    redirect('/login');
  }

  let uid: string;
  let profile: {
    role: UserRole;
    full_name: string | null;
    avatar_url: string | null;
  };

  if (sessionCookie.startsWith('mock-session-')) {
    if (process.env.NODE_ENV === 'production') {
      redirect('/login');
    }
    const role = sessionCookie.replace('mock-session-', '') as UserRole;
    uid = `mock-uid-${role}`;
    
    let fullName = `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`;
    if (role === 'super_admin') {
      fullName = 'Global Super Admin';
    } else if (role === 'admin') {
      fullName = 'Chapter Admin';
    } else if (role === 'merchant') {
      fullName = 'Malabar Gold';
    } else if (role === 'creator') {
      fullName = 'Arjun Menon';
    }

    profile = {
      role,
      full_name: fullName,
      avatar_url: null,
    };
  } else {
    try {
      const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
      uid = decoded.uid;
    } catch {
      redirect('/login');
    }

    const profileSnap = await adminDb.collection('users').doc(uid).get();
    if (!profileSnap.exists) {
      redirect('/login');
    }

    profile = profileSnap.data() as {
      role: UserRole;
      full_name: string | null;
      avatar_url: string | null;
    };
  }

  return (
    <DashboardShell
      role={profile.role}
      fullName={profile.full_name}
      avatarUrl={profile.avatar_url}
    >
      {children}
    </DashboardShell>
  );
}
