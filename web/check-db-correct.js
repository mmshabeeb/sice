const fs = require('fs');
const path = require('path');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
  if (match) {
    let value = match[2].trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.substring(1, value.length - 1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.substring(1, value.length - 1);
    env[match[1]] = value;
  }
});

const projectId = env.FIREBASE_PROJECT_ID;
const clientEmail = env.FIREBASE_CLIENT_EMAIL;
const rawKey = env.FIREBASE_PRIVATE_KEY;

const cleanKey = rawKey.trim().replace(/\\n/g, '\n');
const header = '-----BEGIN PRIVATE KEY-----';
const footer = '-----END PRIVATE KEY-----';
let base64Body = cleanKey;
if (base64Body.includes(header)) base64Body = base64Body.replace(header, '');
if (base64Body.includes(footer)) base64Body = base64Body.replace(footer, '');
base64Body = base64Body.replace(/\s+/g, '');
const chunks = [];
for (let i = 0; i < base64Body.length; i += 64) {
  chunks.push(base64Body.substring(i, i + 64));
}
const privateKey = `${header}\n${chunks.join('\n')}\n${footer}\n`;

const app = initializeApp({
  credential: cert({ projectId, clientEmail, privateKey })
});

const db = getFirestore(app);

async function checkCollections() {
  try {
    console.log("Listing all collections in the database...");
    const collections = await db.listCollections();
    console.log("Collections found:", collections.map(c => c.id));
    
    console.log("\nFetching all documents from 'applications'...");
    const snapshot = await db.collection('applications').get();
    if (snapshot.empty) {
      console.log("Collection 'applications' is completely empty.");
    } else {
      console.log(`Found ${snapshot.size} documents in 'applications':`);
      snapshot.forEach(doc => {
        const data = doc.data();
        console.log(`- ID: ${doc.id}`);
        console.log(`  Type: ${data.application_type}`);
        console.log(`  Name: ${data.full_name || data.contact_person_name}`);
        console.log(`  Status: ${data.status}`);
        console.log(`  Chapter: ${data.chapter}`);
      });
    }
  } catch (err) {
    console.error("Error occurred:", err);
  } finally {
    process.exit(0);
  }
}

checkCollections();
