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
