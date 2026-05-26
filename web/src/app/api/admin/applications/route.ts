import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase/server';

function extractHandle(url: string): string {
  try {
    if (!url) return '';
    const parts = url.split('/').filter(Boolean);
    return parts[parts.length - 1] || url;
  } catch {
    return url;
  }
}

function formatFirebaseDate(timestamp: any): string {
  if (!timestamp) return 'N/A';
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return 'N/A';
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'applications';
    const chapterParam = searchParams.get('chapter') || 'Kozhikode';

    if (type === 'chapters') {
      const snap = await adminDb.collection('chapters').get();
      const chapters = snap.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || 'Unnamed Chapter',
          city: data.city || 'N/A',
          state: data.state || 'N/A',
          creatorsCount: data.creatorsCount || 0,
          adminName: data.adminName || null,
          status: data.status || 'active',
        };
      });
      return NextResponse.json({ success: true, chapters });
    }

    if (type === 'merchants') {
      const snap = await adminDb
        .collection('users')
        .where('role', '==', 'merchant')
        .get();
      const merchants = snap.docs.map(doc => {
        const data = doc.data();
        return {
          uid: doc.id,
          name: data.full_name || data.brand_name || 'Anonymous Brand',
          email: data.email || 'N/A',
        };
      });
      return NextResponse.json({ success: true, merchants });
    }

    if (type === 'admins') {
      const snap = await adminDb
        .collection('users')
        .where('role', 'in', ['admin', 'super_admin'])
        .get();
      const admins = snap.docs.map(doc => {
        const data = doc.data();
        return {
          uid: doc.id,
          name: data.full_name || 'Unnamed Admin',
          email: data.email || 'N/A',
        };
      });
      return NextResponse.json({ success: true, admins });
    }

    if (type === 'all_users') {
      const snap = await adminDb.collection('users').get();
      const users = snap.docs.map(doc => {
        const data = doc.data();
        return {
          uid: doc.id,
          name: data.full_name || data.brand_name || 'Unnamed User',
          email: data.email || 'N/A',
          role: data.role || 'N/A',
        };
      });
      return NextResponse.json({ success: true, users });
    }

    if (type === 'chapter_applications') {
      const snap = await adminDb
        .collection('applications')
        .where('application_type', '==', 'chapter')
        .get();
      const applications = snap.docs.map(doc => {
        const data = doc.data();
        let status = 'Pending';
        if (data.status === 'Approved' || data.status === 'approved') status = 'Approved';
        else if (data.status === 'Rejected' || data.status === 'rejected') status = 'Rejected';

        return {
          id: doc.id,
          name: data.full_name || 'Anonymous',
          email: data.email || 'N/A',
          contactNumber: data.contact_number || 'N/A',
          whatsappNumber: data.whatsapp_number || 'N/A',
          chapterName: data.chapter_name || 'N/A',
          customChapterName: data.custom_chapter_name || null,
          chapterRole: data.chapter_role || 'N/A',
          chapterProfileUrl: data.chapter_profile_url || 'N/A',
          bio: data.statement_of_purpose || 'N/A',
          status,
          appliedDate: formatFirebaseDate(data.submitted_at),
        };
      });
      return NextResponse.json({ success: true, applications });
    }

    // Retrieve all creator applications
    const querySnapshot = await adminDb
      .collection('applications')
      .where('application_type', '==', 'creator')
      .get();

    const docs = querySnapshot.docs;

    if (type === 'applications') {
      const applications = docs.map((doc) => {
        const data = doc.data();
        
        // Social handles summary
        const handlesList: string[] = [];
        if (data.instagram_url) handlesList.push(`Instagram: @${extractHandle(data.instagram_url)}`);
        if (data.x_url) handlesList.push(`X: @${extractHandle(data.x_url)}`);
        if (data.youtube_url) handlesList.push(`YouTube: @${extractHandle(data.youtube_url)}`);
        if (data.facebook_url) handlesList.push(`Facebook: @${extractHandle(data.facebook_url)}`);
        if (data.linkedin_url) handlesList.push(`LinkedIn: @${extractHandle(data.linkedin_url)}`);
        const handles = handlesList.join(', ') || 'None';

        // Followers list summary
        const followersList: string[] = [];
        if (data.instagram_followers) followersList.push(`IG: ${data.instagram_followers}`);
        if (data.x_followers) followersList.push(`X: ${data.x_followers}`);
        if (data.youtube_followers) followersList.push(`YT: ${data.youtube_followers}`);
        if (data.facebook_followers) followersList.push(`FB: ${data.facebook_followers}`);
        if (data.linkedin_followers) followersList.push(`LI: ${data.linkedin_followers}`);
        const followers = followersList.join(' | ') || 'None';

        // Status mapping
        let status = 'Pending';
        if (data.status === 'Approved' || data.status === 'approved') status = 'Approved';
        else if (data.status === 'Rejected' || data.status === 'rejected') status = 'Rejected';
        else if (data.status === 'Under Review' || data.status === 'under_review') status = 'Under Review';
        else if (data.status === 'Identity Check' || data.status === 'identity_check') status = 'Identity Check';

        return {
          id: doc.id,
          name: data.full_name || 'Anonymous Creator',
          email: data.email || 'N/A',
          handles,
          followers,
          bio: data.statement_of_purpose || `Creator application submitted on SICE. Contact: ${data.contact_number || 'N/A'}. WhatsApp: ${data.whatsapp_number || 'N/A'}.`,
          appliedDate: formatFirebaseDate(data.submitted_at),
          status,
          location: data.location || 'Kerala, India',
          languages: ['Malayalam', 'English'],
          niches: data.niches || ['General', 'Lifestyle'],
          
          // Raw values for editing
          raw_full_name: data.full_name || '',
          raw_email: data.email || '',
          raw_location: data.location || '',
          raw_statement_of_purpose: data.statement_of_purpose || '',
          raw_instagram_url: data.instagram_url || '',
          raw_instagram_followers: data.instagram_followers || '',
          raw_x_url: data.x_url || '',
          raw_x_followers: data.x_followers || '',
          raw_youtube_url: data.youtube_url || '',
          raw_youtube_followers: data.youtube_followers || '',
          raw_facebook_url: data.facebook_url || '',
          raw_facebook_followers: data.facebook_followers || '',
          raw_linkedin_url: data.linkedin_url || '',
          raw_linkedin_followers: data.linkedin_followers || '',
        };
      });

      return NextResponse.json({ success: true, applications });
    }

    if (type === 'roster') {
      const approvedDocs = docs.filter((doc) => {
        const data = doc.data();
        const isApproved = data.status === 'Approved' || data.status === 'approved';
        const belongsToChapter = (data.chapter || 'Kozhikode').toLowerCase() === chapterParam.toLowerCase();
        return isApproved && belongsToChapter;
      });

      const creators = approvedDocs.map((doc) => {
        const data = doc.data();
        
        const platforms: string[] = [];
        if (data.instagram_url) platforms.push('Instagram');
        if (data.x_url) platforms.push('X');
        if (data.youtube_url) platforms.push('YouTube');
        if (data.facebook_url) platforms.push('Facebook');
        if (data.linkedin_url) platforms.push('LinkedIn');

        const followers = data.instagram_followers || data.x_followers || data.youtube_followers || data.facebook_followers || data.linkedin_followers || '0';

        let status = 'Active';
        if (data.status === 'suspended') status = 'Suspended';
        else if (data.status === 'onboarding') status = 'Onboarding';

        return {
          id: doc.id,
          name: data.full_name || 'Anonymous Creator',
          email: data.email || 'N/A',
          platforms,
          followers,
          trustIndex: data.trust_index || 88,
          status,
          joined: formatFirebaseDate(data.submitted_at),
        };
      });

      return NextResponse.json({ success: true, creators });
    }

    if (type === 'super_admin') {
      const creators = docs.map((doc) => {
        const data = doc.data();

        let platform = 'Instagram';
        let followers = '0';
        if (data.instagram_url) {
          platform = 'Instagram';
          followers = data.instagram_followers || '0';
        } else if (data.x_url) {
          platform = 'X';
          followers = data.x_followers || '0';
        } else if (data.youtube_url) {
          platform = 'YouTube';
          followers = data.youtube_followers || '0';
        } else if (data.facebook_url) {
          platform = 'Facebook';
          followers = data.facebook_followers || '0';
        } else if (data.linkedin_url) {
          platform = 'LinkedIn';
          followers = data.linkedin_followers || '0';
        }

        let status = 'pending';
        if (data.status === 'Approved' || data.status === 'approved') status = 'verified';
        else if (data.status === 'suspended') status = 'suspended';

        return {
          uid: doc.id,
          name: data.full_name || 'Anonymous Creator',
          niche: data.niches ? data.niches.join(', ') : 'General',
          platform,
          followers,
          engagement: data.engagement_rate || '4.2%',
          trustScore: data.trust_index || 88,
          chapter: data.chapter || 'Kozhikode',
          status,
        };
      });

      return NextResponse.json({ success: true, creators });
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });

  } catch (err: any) {
    console.error('Admin Applications GET error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, id, status, chapter, name, city, state, adminName } = body;

    if (action === 'create_creator') {
      const { email, full_name, password, platform, followers, niche, chapter: creatorChapter, instagram_url, instagram_followers } = body;
      if (!email || !full_name || !password) {
        return NextResponse.json({ error: 'Missing email, full_name, or password' }, { status: 400 });
      }

      // 1. Create Firebase Auth user so they can log in
      let uid: string;
      try {
        const userRecord = await adminAuth.createUser({
          email,
          password,
          displayName: full_name,
        });
        uid = userRecord.uid;
      } catch (authErr: any) {
        // If user already exists in Auth, get their UID
        if (authErr.code === 'auth/email-already-exists') {
          const existingUser = await adminAuth.getUserByEmail(email);
          uid = existingUser.uid;
        } else {
          console.error('Firebase Auth createUser error:', authErr);
          return NextResponse.json({ error: `Auth error: ${authErr.message}` }, { status: 500 });
        }
      }

      // 2. Create the 'users' collection doc (keyed by uid) — login checks this for the role
      await adminDb.collection('users').doc(uid).set({
        role: 'creator',
        full_name,
        email,
        platform: platform || 'Instagram',
        instagram_url: instagram_url || '',
        instagram_followers: instagram_followers || followers || '0',
        chapter: creatorChapter || 'Kozhikode',
        status: 'active',
        created_at: new Date(),
        created_manually: true,
      }, { merge: true });

      // 3. Also create in 'applications' collection so they appear in the super admin creators list
      const docId = `manual-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      await adminDb.collection('applications').doc(docId).set({
        application_type: 'creator',
        full_name,
        email,
        instagram_url: instagram_url || '',
        instagram_followers: instagram_followers || followers || '0',
        niches: niche ? [niche] : ['General'],
        chapter: creatorChapter || 'Kozhikode',
        status: 'Approved',
        trust_index: 88,
        engagement_rate: '4.2%',
        submitted_at: new Date(),
        created_manually: true,
        auth_uid: uid,
      });

      return NextResponse.json({ success: true, uid });
    }

    if (action === 'create_chapter') {
      const chapterId = name.toLowerCase().trim().replace(/\s+/g, '-');
      await adminDb.collection('chapters').doc(chapterId).set({
        id: chapterId,
        name,
        city,
        state,
        adminName: adminName || null,
        status: 'active',
        creatorsCount: 0,
        created_at: new Date(),
      }, { merge: true });
      return NextResponse.json({ success: true });
    }

    if (action === 'toggle_chapter_status') {
      const chRef = adminDb.collection('chapters').doc(id);
      const chSnap = await chRef.get();
      if (chSnap.exists) {
        const currentStatus = chSnap.data()?.status;
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        await chRef.update({ status: newStatus });
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    if (action === 'assign_chapter_admin') {
      await adminDb.collection('chapters').doc(id).update({ adminName });
      return NextResponse.json({ success: true });
    }

    if (!id) {
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
    }

    const docRef = adminDb.collection('applications').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    if (action === 'update_status') {
      const updateData: any = { status };
      const appData = docSnap.data();
      if (status === 'Approved' && !appData?.chapter) {
        updateData.chapter = 'Kozhikode'; // Default chapter on first approval
      }
      await docRef.update(updateData);

      // If chapter application is approved, also create the chapter in 'chapters'
      if (appData?.application_type === 'chapter' && status === 'Approved') {
        const chapterId = (appData.chapter_name || 'new-chapter').toLowerCase().trim().replace(/\s+/g, '-');
        await adminDb.collection('chapters').doc(chapterId).set({
          id: chapterId,
          name: appData.chapter_name,
          city: appData.chapter_name,
          state: 'Kerala',
          adminName: appData.full_name || 'Unassigned',
          status: 'active',
          creatorsCount: 0,
          created_at: new Date(),
        }, { merge: true });
      }

      return NextResponse.json({ success: true });
    }

    if (action === 'transfer_chapter') {
      await docRef.update({ chapter });
      return NextResponse.json({ success: true });
    }

    if (action === 'toggle_verify') {
      const currentStatus = docSnap.data()?.status;
      const newStatus = (currentStatus === 'Approved' || currentStatus === 'approved') ? 'pending' : 'Approved';
      await docRef.update({ status: newStatus });
      return NextResponse.json({ success: true });
    }

    if (action === 'toggle_suspend') {
      const currentStatus = docSnap.data()?.status;
      const newStatus = currentStatus === 'suspended' ? 'Approved' : 'suspended';
      await docRef.update({ status: newStatus });
      return NextResponse.json({ success: true });
    }

    if (action === 'update_details') {
      const {
        name,
        email,
        location,
        bio,
        instagramUrl,
        instagramFollowers,
        xUrl,
        xFollowers,
        youtubeUrl,
        youtubeFollowers,
        facebookUrl,
        facebookFollowers,
        linkedinUrl,
        linkedinFollowers
      } = body;

      await docRef.update({
        full_name: name || '',
        email: email || '',
        location: location || '',
        statement_of_purpose: bio || '',
        instagram_url: instagramUrl || '',
        instagram_followers: instagramFollowers || '',
        x_url: xUrl || '',
        x_followers: xFollowers || '',
        youtube_url: youtubeUrl || '',
        youtube_followers: youtubeFollowers || '',
        facebook_url: facebookUrl || '',
        facebook_followers: facebookFollowers || '',
        linkedin_url: linkedinUrl || '',
        linkedin_followers: linkedinFollowers || ''
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action parameter' }, { status: 400 });

  } catch (err: any) {
    console.error('Admin Applications POST error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
