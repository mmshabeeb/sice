/**
 * One-time script: creates the 3 SICE demo accounts in Firebase Auth + Firestore.
 * Run from the web/ directory:
 *   node --env-file=.env.local scripts/seed-demo-users.mjs
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// ── Init Admin SDK ────────────────────────────────────────────────────────────
initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

const auth = getAuth();
const db = getFirestore();

// ── Demo accounts ─────────────────────────────────────────────────────────────
const DEMO_USERS = [
  {
    email: 'demo.creator@sice.media',
    password: 'Demo@1234',
    displayName: 'Arjun Menon',
    role: 'creator',
    chapter_id: 'kozhikode',
  },
  {
    email: 'demo.merchant@sice.media',
    password: 'Demo@1234',
    displayName: 'Malabar Gold Ads',
    role: 'merchant',
    chapter_id: null,
  },
  {
    email: 'demo.admin@sice.media',
    password: 'Demo@1234',
    displayName: 'Chapter Admin',
    role: 'admin',
    chapter_id: 'kozhikode',
  },
  {
    email: 'demo.superadmin@sice.media',
    password: 'Demo@1234',
    displayName: 'Global Super Admin',
    role: 'super_admin',
    chapter_id: null,
  },
];

// ── Seed ─────────────────────────────────────────────────────────────────────
async function seedUser(user) {
  const { email, password, displayName, role, chapter_id } = user;

  // Create or update Auth user
  let uid;
  try {
    const existing = await auth.getUserByEmail(email);
    uid = existing.uid;
    await auth.updateUser(uid, { displayName, password });
    console.log(`  ↺  Updated Auth user: ${email} (${uid})`);
  } catch {
    const created = await auth.createUser({ email, password, displayName });
    uid = created.uid;
    console.log(`  ✓  Created Auth user: ${email} (${uid})`);
  }

  // Write Firestore profile (merge so we don't overwrite extra fields)
  await db.collection('users').doc(uid).set(
    {
      uid,
      role,
      full_name: displayName,
      avatar_url: null,
      chapter_id,
      email,
      created_at: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
  console.log(`  ✓  Firestore users/${uid} → role: ${role}`);
}

console.log('\n🌱  Seeding SICE demo users…\n');
for (const user of DEMO_USERS) {
  console.log(`→  ${user.role.toUpperCase()} — ${user.email}`);
  await seedUser(user);
}
console.log('\n✅  All demo users ready.\n');
process.exit(0);
