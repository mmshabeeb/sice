import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

const auth = getAuth();
const db = getFirestore();

const ACCOUNTS = [
  {
    email: 'supadmin@thesice.com',
    password: 'Fathima@1988###',
    displayName: 'Super Admin Fathima',
    role: 'super_admin',
    chapter_id: null,
  },
  {
    email: 'admin@thesice.com',
    password: 'Fathima@1988###',
    displayName: 'Common Admin Fathima',
    role: 'admin',
    chapter_id: null, // common to all chapters
  },
  {
    email: 'merchant@thesice.com',
    password: 'Fathima@1988###',
    displayName: 'Merchant Fathima',
    role: 'merchant',
    chapter_id: null,
  }
];

async function seedUser(user) {
  const { email, password, displayName, role, chapter_id } = user;

  let uid;
  try {
    const existing = await auth.getUserByEmail(email);
    uid = existing.uid;
    await auth.updateUser(uid, { displayName, password });
    console.log(`  ↺  Updated Auth user: ${email} (${uid})`);
  } catch (error) {
    const created = await auth.createUser({ email, password, displayName });
    uid = created.uid;
    console.log(`  ✓  Created Auth user: ${email} (${uid})`);
  }

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

async function run() {
  console.log('\n🌱 Creating requested accounts...\n');
  try {
    for (const acc of ACCOUNTS) {
      await seedUser(acc);
    }
    console.log('\n✅ All requested accounts ready.\n');
  } catch (err) {
    console.error('Error creating accounts:', err);
  }
  process.exit(0);
}

run();
