import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/server';
import { FieldValue } from 'firebase-admin/firestore';
import { contactSchema } from '@/lib/validation/schemas';

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
    return NextResponse.json({ error: issues.join('; ') }, { status: 400 });
  }

  const { name, email, reason, message } = parsed.data;

  try {
    await adminDb.collection('contacts').add({
      submitted_at: FieldValue.serverTimestamp(),
      name: name.trim(),
      email: email.trim(),
      subject: reason.trim(),
      message: message.trim(),
    });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Contact API error:', message);
    return NextResponse.json({ error: `Failed to submit: ${message}` }, { status: 500 });
  }
}
