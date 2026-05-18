import { NextRequest, NextResponse } from 'next/server';
import { appendToSheet } from '@/lib/google-sheets';

export async function POST(request: NextRequest) {
  try {
    const { name, email, reason, message } = await request.json();

    if (!name || !email || !reason || !message) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    await appendToSheet('Contact', [
      new Date().toISOString(),
      String(name).trim(),
      String(email).trim(),
      String(reason).trim(),
      String(message).trim(),
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'Failed to submit. Please try again.' }, { status: 500 });
  }
}
