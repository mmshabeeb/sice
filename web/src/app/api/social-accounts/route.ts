import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/server';
import { getSessionUser } from '@/lib/auth/session';

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const snap = await adminDb
      .collection('social_accounts')
      .where('creator_id', '==', user.uid)
      .get();

    const accounts = snap.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        platform: String(d.platform ?? ''),
        username: d.username ?? null,
        profileUrl: d.profile_url ?? null,
        followerCount: d.follower_count ?? 0,
        subscriberCount: d.subscriber_count ?? 0,
        engagementRate: d.engagement_rate ?? 0,
        isVerified: d.is_verified ?? false,
        lastSyncedAt: d.last_synced_at ?? null,
      };
    });

    return NextResponse.json({ accounts });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Social accounts error:', message);
    return NextResponse.json({ error: `Failed to load accounts: ${message}` }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { platform, username, profileUrl, followerCount } = await request.json();

    if (!platform || !username) {
      return NextResponse.json({ error: 'Platform and username are required.' }, { status: 400 });
    }

    const platformLower = platform.toLowerCase();
    const docId = `${user.uid}_${platformLower}`;

    // Clean follower count into integer
    let parsedCount = 0;
    if (followerCount) {
      const clean = String(followerCount).replace(/[^0-9.KMBkmb]/g, '').toUpperCase();
      if (clean.endsWith('M')) {
        parsedCount = Math.floor(parseFloat(clean.slice(0, -1)) * 1_000_000);
      } else if (clean.endsWith('K')) {
        parsedCount = Math.floor(parseFloat(clean.slice(0, -1)) * 1_000);
      } else {
        parsedCount = parseInt(clean) || 0;
      }
    }

    const data: any = {
      creator_id: user.uid,
      platform: platformLower,
      username,
      profile_url: profileUrl || '',
      is_verified: true,
      last_synced_at: new Date().toISOString(),
      engagement_rate: '4.2%',
    };

    if (platformLower === 'youtube') {
      data.subscriber_count = parsedCount;
      data.follower_count = 0;
    } else {
      data.follower_count = parsedCount;
      data.subscriber_count = 0;
    }

    await adminDb.collection('social_accounts').doc(docId).set(data, { merge: true });

    // Also sync the follower count back to the users collection if the platform is their primary one (Instagram)
    if (platformLower === 'instagram') {
      try {
        await adminDb.collection('users').doc(user.uid).update({
          instagram_url: profileUrl || '',
          instagram_followers: String(followerCount || '0'),
        });
      } catch (userErr) {
        console.warn('Failed to sync instagram followers to user profile doc:', userErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Save social account error:', message);
    return NextResponse.json({ error: `Failed to save account: ${message}` }, { status: 500 });
  }
}

