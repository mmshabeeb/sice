import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/server';
import { getSessionUser } from '@/lib/auth/session';

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const allowed = ['merchant', 'admin', 'super_admin'];
  if (!allowed.includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const [usersSnap, socialSnap] = await Promise.all([
      adminDb.collection('users').where('role', '==', 'creator').limit(200).get(),
      adminDb.collection('social_accounts').get(),
    ]);

    const socialByCreator = new Map<
      string,
      { platform: string; followerCount: number; subscriberCount: number }[]
    >();
    for (const doc of socialSnap.docs) {
      const d = doc.data();
      const cid = String(d.creator_id ?? '');
      if (!cid) continue;
      if (!socialByCreator.has(cid)) socialByCreator.set(cid, []);
      socialByCreator.get(cid)!.push({
        platform: String(d.platform ?? ''),
        followerCount: d.follower_count ?? 0,
        subscriberCount: d.subscriber_count ?? 0,
      });
    }

    const creators = usersSnap.docs.map((doc) => {
      const d = doc.data();
      const accounts = socialByCreator.get(doc.id) ?? [];
      const totalFollowers = accounts.reduce(
        (s, a) => s + a.followerCount + a.subscriberCount,
        0
      );
      const primaryPlatform = accounts[0]?.platform ?? 'instagram';

      return {
        uid: doc.id,
        name: String(d.full_name ?? 'Unknown'),
        chapterId: d.chapter_id ?? null,
        avatarUrl: d.avatar_url ?? null,
        totalFollowers,
        primaryPlatform,
        accounts,
        status: String(d.status ?? 'pending'),
        trustScore: d.trust_index_score ?? 0,
        engagementRate: d.engagement_rate ?? 0,
        niche: d.niche ?? 'General',
        languages: d.languages ?? [],
      };
    });

    return NextResponse.json({ creators });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Creators list error:', message);
    return NextResponse.json({ error: `Failed to load creators: ${message}` }, { status: 500 });
  }
}
