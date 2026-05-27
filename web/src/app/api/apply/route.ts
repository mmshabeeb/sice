import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/server';
import { FieldValue } from 'firebase-admin/firestore';
import { applicationSchema } from '@/lib/validation/schemas';
import { ZodError } from 'zod';

function formatE164(countryCode: string, number: string): string {
  const cleanCode = countryCode.replace(/[^0-9+]/g, '');
  const cleanNumber = number.replace(/[^0-9]/g, '');
  const raw = `${cleanCode}${cleanNumber}`;
  return raw.startsWith('+') ? raw : `+${raw}`;
}

async function resolveAuthUser(uid: string | undefined, email: string, phone: string, displayName: string) {
  // Try by UID first
  if (uid) {
    try { return await adminAuth.getUser(uid); } catch (e) {
      console.warn(`getUser(${uid}) failed:`, e instanceof Error ? e.message : String(e));
    }
  }
  // Try by email
  try { return await adminAuth.getUserByEmail(email); } catch { /* not found */ }
  // Try by phone
  try { return await adminAuth.getUserByPhoneNumber(phone); } catch { /* not found */ }
  // Create new user
  try {
    return await adminAuth.createUser({ email, phoneNumber: phone, displayName });
  } catch (e) {
    console.error('createUser failed:', e instanceof Error ? e.message : String(e));
    return null;
  }
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  // Default applicationType so discriminatedUnion can match
  if (typeof body === 'object' && body !== null && !('applicationType' in body)) {
    (body as Record<string, unknown>).applicationType = 'creator';
  }

  const parsed = applicationSchema.safeParse(body);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
    return NextResponse.json({ error: issues.join('; ') }, { status: 400 });
  }

  const data = parsed.data;

  try {
    if (data.applicationType === 'merchant') {
      const emailStr = data.email.trim().toLowerCase();
      const phoneStr = formatE164(data.contactCountryCode, data.contactNumber);
      const authUser = await resolveAuthUser(data.uid, emailStr, phoneStr, data.fullName.trim());

      const targetUid = authUser?.uid ?? data.uid ?? `user_${Date.now()}`;

      await adminDb.collection('users').doc(targetUid).set({
        uid: targetUid,
        role: 'merchant',
        full_name: data.fullName.trim(),
        email: emailStr,
        phone: phoneStr,
        brand_name: data.brandName.trim(),
        city: data.city.trim(),
        state: data.state.trim(),
        country: data.country.trim(),
        created_at: FieldValue.serverTimestamp(),
      }, { merge: true });

      await adminDb.collection('applications').add({
        submitted_at: FieldValue.serverTimestamp(),
        application_type: 'merchant',
        brand_name: data.brandName.trim(),
        city: data.city.trim(),
        state: data.state.trim(),
        country: data.country.trim(),
        contact_person_name: data.fullName.trim(),
        email: emailStr,
        contact_number: `${data.contactCountryCode} ${data.contactNumber}`.trim(),
        whatsapp_number: `${data.whatsappCountryCode} ${data.whatsappNumber}`.trim(),
        status: 'pending',
        google_verified: !!data.googleVerified,
        phone_verified: !!data.phoneVerified,
      });
    } else if (data.applicationType === 'chapter') {
      await adminDb.collection('applications').add({
        submitted_at: FieldValue.serverTimestamp(),
        application_type: 'chapter',
        full_name: data.fullName.trim(),
        email: data.email.trim(),
        contact_number: `${data.contactCountryCode} ${data.contactNumber}`.trim(),
        whatsapp_number: `${data.whatsappCountryCode} ${data.whatsappNumber}`.trim(),
        chapter_name: data.chapterName.trim(),
        custom_chapter_name: data.customChapterName?.trim() ?? null,
        chapter_role: data.chapterRole.trim(),
        chapter_profile_url: data.chapterProfileUrl.trim(),
        statement_of_purpose: data.statementOfPurpose.trim(),
        status: 'pending',
        google_verified: !!data.googleVerified,
        phone_verified: !!data.phoneVerified,
      });
    } else {
      // creator
      const socialUrls = [data.facebookUrl, data.instagramUrl, data.youtubeUrl, data.xUrl, data.linkedinUrl];
      if (!socialUrls.some((u) => u && u.trim())) {
        return NextResponse.json({ error: 'At least one social media URL is required.' }, { status: 400 });
      }

      await adminDb.collection('applications').add({
        submitted_at: FieldValue.serverTimestamp(),
        application_type: 'creator',
        full_name: data.fullName.trim(),
        email: data.email.trim(),
        contact_number: `${data.contactCountryCode} ${data.contactNumber}`.trim(),
        whatsapp_number: `${data.whatsappCountryCode} ${data.whatsappNumber}`.trim(),
        facebook_url: data.facebookUrl?.trim() ?? '',
        facebook_followers: data.facebookFollowers?.trim() ?? '',
        instagram_url: data.instagramUrl?.trim() ?? '',
        instagram_followers: data.instagramFollowers?.trim() ?? '',
        youtube_url: data.youtubeUrl?.trim() ?? '',
        youtube_followers: data.youtubeFollowers?.trim() ?? '',
        x_url: data.xUrl?.trim() ?? '',
        x_followers: data.xFollowers?.trim() ?? '',
        linkedin_url: data.linkedinUrl?.trim() ?? '',
        linkedin_followers: data.linkedinFollowers?.trim() ?? '',
        status: 'pending',
        google_verified: !!data.googleVerified,
        phone_verified: !!data.phoneVerified,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Apply API error:', message);
    return NextResponse.json({ error: `Failed to submit: ${message}` }, { status: 500 });
  }
}
