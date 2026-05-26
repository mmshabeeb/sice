import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/server';
import { FieldValue } from 'firebase-admin/firestore';
import { sendMail, generateApplicationEmail } from '@/lib/email';

function formatE164(countryCode: string, number: string): string {
  const cleanCode = countryCode.replace(/[^0-9+]/g, '');
  const cleanNumber = number.replace(/[^0-9]/g, '');
  const raw = `${cleanCode}${cleanNumber}`;
  return raw.startsWith('+') ? raw : `+${raw}`;
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const {
      applicationType = 'creator',
      fullName,
      contactCountryCode,
      contactNumber,
      whatsappCountryCode,
      whatsappNumber,
      email,
      facebookUrl,
      facebookFollowers,
      instagramUrl,
      instagramFollowers,
      youtubeUrl,
      youtubeFollowers,
      xUrl,
      xFollowers,
      linkedinUrl,
      linkedinFollowers,
      googleVerified,
      phoneVerified,
      brandName,
      city,
      state,
      country,
      uid,
      // Chapter application fields
      chapterName,
      customChapterName,
      chapterRole,
      chapterProfileUrl,
      statementOfPurpose,
    } = data;

    if (applicationType === 'merchant') {
      if (!brandName || !city || !state || !country || !fullName || !contactNumber || !whatsappNumber || !email) {
        return NextResponse.json({ error: 'Missing required fields for merchant application.' }, { status: 400 });
      }

      // 1. Create or link Firebase Auth user
      let authUser = null;
      const emailStr = String(email).trim().toLowerCase();
      const phoneStr = formatE164(contactCountryCode || '', contactNumber || '');

      if (uid) {
        try {
          authUser = await adminAuth.getUser(uid);
        } catch {
          // ignore
        }
      }

      if (!authUser) {
        try {
          authUser = await adminAuth.getUserByEmail(emailStr);
        } catch {
          try {
            authUser = await adminAuth.getUserByPhoneNumber(phoneStr);
          } catch {
            // Neither exists, create a new user
            try {
              authUser = await adminAuth.createUser({
                email: emailStr,
                phoneNumber: phoneStr,
                displayName: String(fullName).trim(),
              });
            } catch (createErr: any) {
              console.error('Error creating auth user:', createErr);
            }
          }
        }
      }

      // Sync attributes to the user auth record if possible
      if (authUser) {
        const updates: any = {};
        if (!authUser.email) updates.email = emailStr;
        if (!authUser.phoneNumber) updates.phoneNumber = phoneStr;
        if (!authUser.displayName) updates.displayName = String(fullName).trim();

        if (Object.keys(updates).length > 0) {
          try {
            authUser = await adminAuth.updateUser(authUser.uid, updates);
          } catch (updateErr: any) {
            console.error('Error updating auth user:', updateErr);
          }
        }
      }

      // 2. Set user record in Firestore 'users' collection to enable logins
      const targetUid = authUser?.uid || uid || `user_${Date.now()}`;
      await adminDb.collection('users').doc(targetUid).set({
        uid: targetUid,
        role: 'merchant',
        full_name: String(fullName).trim(),
        email: emailStr,
        phone: phoneStr,
        contact_number: `${contactCountryCode ?? ''} ${contactNumber}`.trim(),
        brand_name: String(brandName).trim(),
        city: String(city).trim(),
        state: String(state).trim(),
        country: String(country).trim(),
        created_at: FieldValue.serverTimestamp(),
      }, { merge: true });

      // 3. Log the application in the queue
      await adminDb.collection('applications').add({
        submitted_at: FieldValue.serverTimestamp(),
        application_type: 'merchant',
        brand_name: String(brandName).trim(),
        city: String(city).trim(),
        state: String(state).trim(),
        country: String(country).trim(),
        contact_person_name: String(fullName).trim(),
        email: String(email).trim(),
        contact_number: `${contactCountryCode ?? ''} ${contactNumber}`.trim(),
        whatsapp_number: `${whatsappCountryCode ?? ''} ${whatsappNumber}`.trim(),
        status: 'pending',
        google_verified: !!googleVerified,
        phone_verified: !!phoneVerified,
      });
    } else if (applicationType === 'chapter') {
      if (!fullName || !contactNumber || !whatsappNumber || !email || !chapterName || !chapterRole || !chapterProfileUrl || !statementOfPurpose) {
        return NextResponse.json({ error: 'Missing required fields for chapter application.' }, { status: 400 });
      }

      await adminDb.collection('applications').add({
        submitted_at: FieldValue.serverTimestamp(),
        application_type: 'chapter',
        full_name: String(fullName).trim(),
        email: String(email).trim(),
        contact_number: `${contactCountryCode ?? ''} ${contactNumber}`.trim(),
        whatsapp_number: `${whatsappCountryCode ?? ''} ${whatsappNumber}`.trim(),
        chapter_name: String(chapterName).trim(),
        custom_chapter_name: customChapterName ? String(customChapterName).trim() : null,
        chapter_role: String(chapterRole).trim(),
        chapter_profile_url: String(chapterProfileUrl).trim(),
        statement_of_purpose: String(statementOfPurpose).trim(),
        status: 'pending',
        google_verified: !!googleVerified,
        phone_verified: !!phoneVerified,
      });
    } else {
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
        application_type: 'creator',
        full_name: String(fullName).trim(),
        email: String(email).trim(),
        contact_number: `${contactCountryCode ?? ''} ${contactNumber}`.trim(),
        whatsapp_number: `${whatsappCountryCode ?? ''} ${whatsappNumber}`.trim(),
        facebook_url: String(facebookUrl || '').trim(),
        facebook_followers: String(facebookFollowers || '').trim(),
        instagram_url: String(instagramUrl || '').trim(),
        instagram_followers: String(instagramFollowers || '').trim(),
        youtube_url: String(youtubeUrl || '').trim(),
        youtube_followers: String(youtubeFollowers || '').trim(),
        x_url: String(xUrl || '').trim(),
        x_followers: String(xFollowers || '').trim(),
        linkedin_url: String(linkedinUrl || '').trim(),
        linkedin_followers: String(linkedinFollowers || '').trim(),
        status: 'pending',
        google_verified: !!googleVerified,
        phone_verified: !!phoneVerified,
      });
    }

    // Send application confirmation email
    if (email && fullName) {
      try {
        const html = generateApplicationEmail(fullName, applicationType);
        await sendMail({
          to: String(email).trim().toLowerCase(),
          subject: 'SICE Application Received',
          html,
        });
      } catch (emailErr) {
        console.error('Failed to send application confirmation email:', emailErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Apply API error:', err);
    return NextResponse.json({ error: `Failed to submit: ${err?.message || String(err)}` }, { status: 500 });
  }
}
