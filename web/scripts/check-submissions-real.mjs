import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

const db = getFirestore();

async function run() {
  try {
    const snapshot = await db.collection('applications').get();
    console.log(`Found ${snapshot.size} documents in applications:`);
    snapshot.forEach(doc => {
      const data = doc.data();
      console.log(`- ID: ${doc.id}`);
      console.log(`  Type: ${data.application_type}`);
      console.log(`  Name: ${data.full_name || data.contact_person_name}`);
      console.log(`  Status: ${data.status}`);
      console.log(`  Chapter: ${data.chapter}`);
    });
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}

run();
