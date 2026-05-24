import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let _app: App | null = null;

function getAdminApp(): App {
  if (_app) return _app;
  if (getApps().length > 0) {
    _app = getApps()[0];
    return _app;
  }

  const rawKey = process.env.FIREBASE_PRIVATE_KEY ?? '';
  
  // Format the private key cleanly into a standard PEM key (with 64-char lines)
  // to avoid issues with how Hostinger stores, strips, or escapes newlines in the panel.
  const cleanKey = rawKey.trim().replace(/^["']|["']$/g, '').replace(/\\n/g, '\n');
  const header = '-----BEGIN PRIVATE KEY-----';
  const footer = '-----END PRIVATE KEY-----';
  
  let base64Body = cleanKey;
  if (base64Body.includes(header)) base64Body = base64Body.replace(header, '');
  if (base64Body.includes(footer)) base64Body = base64Body.replace(footer, '');
  base64Body = base64Body.replace(/\s+/g, ''); // strip all whitespace, spaces, and newlines
  
  const chunks: string[] = [];
  for (let i = 0; i < base64Body.length; i += 64) {
    chunks.push(base64Body.substring(i, i + 64));
  }
  const privateKey = `${header}\n${chunks.join('\n')}\n${footer}\n`;

  _app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  });

  return _app;
}

export function getAdminAuth(): Auth {
  return getAuth(getAdminApp());
}

export function getAdminDb(): Firestore {
  return getFirestore(getAdminApp());
}

// Lazy proxies — evaluated on first use, not at import time
export const adminAuth: Auth = new Proxy({} as Auth, {
  get(_target, prop) {
    return (getAdminAuth() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export const adminDb: Firestore = new Proxy({} as Firestore, {
  get(_target, prop) {
    return (getAdminDb() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
