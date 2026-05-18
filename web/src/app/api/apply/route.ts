import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/server';
import { FieldValue } from 'firebase-admin/firestore';

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

    await adminDb.collection('applications').add({
      submitted_at: FieldValue.serverTimestamp(),
      full_name: String(fullName).trim(),
      email: String(email).trim(),
      contact_number: `${contactCountryCode ?? ''} ${contactNumber}`.trim(),
      whatsapp_number: `${whatsappCountryCode ?? ''} ${whatsappNumber}`.trim(),
      facebook_url: String(facebookUrl || '').trim(),
      instagram_url: String(instagramUrl || '').trim(),
      youtube_url: String(youtubeUrl || '').trim(),
      x_url: String(xUrl || '').trim(),
      linkedin_url: String(linkedinUrl || '').trim(),
      status: 'pending',
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Apply API error:', err);
    return NextResponse.json({ error: 'Failed to submit. Please try again.' }, { status: 500 });
  }
}
