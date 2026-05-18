import { NextRequest, NextResponse } from 'next/server';
import { appendToSheet } from '@/lib/google-sheets';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const {
      fullName,
      contactCountryCode,
      contactNumber,
      whatsappCountryCode,
      whatsappNumber,
      email,
      facebookUrl,
      instagramUrl,
      youtubeUrl,
      xUrl,
      linkedinUrl,
    } = data;

    if (!fullName || !contactNumber || !whatsappNumber || !email) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const socialUrls = [facebookUrl, instagramUrl, youtubeUrl, xUrl, linkedinUrl];
    const hasSocial = socialUrls.some((u) => String(u || '').trim());
    if (!hasSocial) {
      return NextResponse.json({ error: 'At least one social media URL is required.' }, { status: 400 });
    }

    await appendToSheet('Applications', [
      new Date().toISOString(),
      String(fullName).trim(),
      String(email).trim(),
      `${contactCountryCode} ${contactNumber}`.trim(),
      `${whatsappCountryCode} ${whatsappNumber}`.trim(),
      String(facebookUrl || '').trim(),
      String(instagramUrl || '').trim(),
      String(youtubeUrl || '').trim(),
      String(xUrl || '').trim(),
      String(linkedinUrl || '').trim(),
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Apply API error:', err);
    return NextResponse.json({ error: 'Failed to submit. Please try again.' }, { status: 500 });
  }
}
