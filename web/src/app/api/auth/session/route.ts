import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/server';

// Session cookie duration: 5 days
const SESSION_DURATION_MS = 60 * 60 * 24 * 5 * 1000;

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();
    if (!idToken) {
      return NextResponse.json({ error: 'Missing ID token.' }, { status: 400 });
    }

    let sessionCookie: string;
    if (idToken.startsWith('mock-id-token-')) {
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
      }
      const role = idToken.replace('mock-id-token-', '');
      sessionCookie = `mock-session-${role}`;
    } else {
      sessionCookie = await adminAuth.createSessionCookie(idToken, {
        expiresIn: SESSION_DURATION_MS,
      });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_DURATION_MS / 1000,
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('Session creation error:', err);
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('session', '', { maxAge: 0, path: '/' });
  return response;
}
