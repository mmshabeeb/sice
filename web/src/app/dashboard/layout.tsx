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

  const profile = profileSnap.data() as {
    role: UserRole;
    full_name: string | null;
    avatar_url: string | null;
  };

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
