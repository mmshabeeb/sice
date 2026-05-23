import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/server';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
  try {
    const { name, email, reason, message } = await request.json();

    if (!name || !email || !reason || !message) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    await adminDb.collection('contacts').add({
      submitted_at: FieldValue.serverTimestamp(),
      name: String(name).trim(),
      email: String(email).trim(),
      subject: String(reason).trim(),
      message: String(message).trim(),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Contact API error:', err);
    return NextResponse.json({ error: `Failed to submit: ${err?.message || String(err)}` }, { status: 500 });
  }
}
