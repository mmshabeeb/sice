import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/server';
import { FieldValue } from 'firebase-admin/firestore';
import { sendMail, generateApplicationEmail, generateActivationEmail, generateSecurePassword } from '@/lib/email';
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

      const emailStr = data.email.trim().toLowerCase();
      const phoneStr = formatE164(data.contactCountryCode || '', data.contactNumber || '');

      let authUser = null;
      let generatedPassword = '';

      // Check if user already exists in Firebase Auth
      try {
        authUser = await adminAuth.getUserByEmail(emailStr);
      } catch {
        try {
          authUser = await adminAuth.getUserByPhoneNumber(phoneStr);
        } catch {
          // Create new user in Auth with secure password
          try {
            generatedPassword = generateSecurePassword();
            authUser = await adminAuth.createUser({
              email: emailStr,
              phoneNumber: phoneStr,
              displayName: data.fullName.trim(),
              password: generatedPassword,
            });
          } catch (createErr: any) {
            console.error('Error creating auth user for creator:', createErr);
          }
        }
      }

      const targetUid = authUser?.uid || `creator_${Date.now()}`;

      // Create users collection document to allow login
      await adminDb.collection('users').doc(targetUid).set({
        uid: targetUid,
        role: 'creator',
        full_name: data.fullName.trim(),
        email: emailStr,
        phone: phoneStr,
        contact_number: `${data.contactCountryCode ?? ''} ${data.contactNumber}`.trim(),
        whatsapp_number: `${data.whatsappCountryCode ?? ''} ${data.whatsappNumber}`.trim(),
        status: 'pending',
        created_at: FieldValue.serverTimestamp(),
      }, { merge: true });

      // Save application document
      await adminDb.collection('applications').add({
        submitted_at: FieldValue.serverTimestamp(),
        application_type: 'creator',
        full_name: data.fullName.trim(),
        email: emailStr,
        contact_number: `${data.contactCountryCode ?? ''} ${data.contactNumber}`.trim(),
        whatsapp_number: `${data.whatsappCountryCode ?? ''} ${data.whatsappNumber}`.trim(),
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
        auth_uid: targetUid,
      });

      // Send Welcome/Activation email with credentials
      if (emailStr && data.fullName) {
        try {
          const mailHtml = generatedPassword
            ? generateActivationEmail(data.fullName.trim(), 'creator', emailStr, generatedPassword)
            : generateActivationEmail(data.fullName.trim(), 'creator', emailStr);
          await sendMail({
            to: emailStr,
            subject: 'Welcome to SICE - Creator Account Credentials',
            html: mailHtml,
          });
        } catch (emailErr) {
          console.error('Failed to send creator activation email:', emailErr);
        }
      }
    }

    // Send application confirmation email for non-creators
    if (data.applicationType !== 'creator' && data.email && data.fullName) {
      try {
        const html = generateApplicationEmail(data.fullName.trim(), data.applicationType);
        await sendMail({
          to: data.email.trim().toLowerCase(),
          subject: 'SICE Application Received',
          html,
        });
      } catch (emailErr) {
        console.error('Failed to send application confirmation email:', emailErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Apply API error:', message);
    return NextResponse.json({ error: `Failed to submit: ${message}` }, { status: 500 });
  }
}
