import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase/server';

export interface SessionUser {
  uid: string;
  role: string;
  chapterId: string | null;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  if (!sessionCookie) return null;

  if (sessionCookie.startsWith('mock-session-')) {
    const role = sessionCookie.replace('mock-session-', '');
    return { uid: `mock-uid-${role}`, role, chapterId: null };
  }

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    const userSnap = await adminDb.collection('users').doc(decoded.uid).get();
    if (!userSnap.exists) return null;
    const data = userSnap.data()!;
    return {
      uid: decoded.uid,
      role: data.role ?? 'creator',
      chapterId: data.chapter_id ?? null,
    };
  } catch {
    return null;
  }
}
