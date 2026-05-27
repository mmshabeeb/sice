import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/server';
import { getSessionUser } from '@/lib/auth/session';

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { uid, role, chapterId } = user;

  try {
    if (role === 'creator') {
      const [socialSnap, contractsSnap, profileSnap] = await Promise.all([
        adminDb.collection('social_accounts').where('creator_id', '==', uid).get(),
        adminDb.collection('contracts').where('creator_id', '==', uid).get(),
        adminDb.collection('creator_profiles').doc(uid).get(),
      ]);

      const totalFollowers = socialSnap.docs.reduce((sum, doc) => {
        const d = doc.data();
        return sum + (d.follower_count ?? 0) + (d.subscriber_count ?? 0);
      }, 0);

      const activeStatuses = new Set(['deposited', 'in_escrow', 'content_approved']);
      const activeDeals = contractsSnap.docs.filter((doc) =>
        activeStatuses.has(doc.data().escrow_status)
      ).length;

      const pendingEarnings = contractsSnap.docs
        .filter((doc) => doc.data().escrow_status === 'in_escrow')
        .reduce((sum, doc) => sum + (doc.data().amount ?? 0), 0);

      const trustIndex = profileSnap.exists
        ? (profileSnap.data()?.trust_index_score ?? 0)
        : 0;

      return NextResponse.json({ totalFollowers, activeDeals, pendingEarnings, trustIndex });
    }

    if (role === 'merchant') {
      const [campaignsSnap, contractsSnap] = await Promise.all([
        adminDb.collection('campaigns').where('merchant_id', '==', uid).get(),
        adminDb.collection('contracts').where('merchant_id', '==', uid).get(),
      ]);

      const activeCampaigns = campaignsSnap.docs.filter((doc) =>
        ['active', 'in_progress'].includes(doc.data().status)
      ).length;

      const activeContracts = contractsSnap.docs.filter((doc) =>
        ['deposited', 'in_escrow', 'content_approved'].includes(doc.data().escrow_status)
      );

      const totalDeposited = activeContracts.reduce(
        (sum, doc) => sum + (doc.data().escrow_amount ?? 0),
        0
      );
      const completedDeals = contractsSnap.docs.filter(
        (doc) => doc.data().escrow_status === 'released'
      ).length;
      const creatorsEngaged = new Set(contractsSnap.docs.map((doc) => doc.data().creator_id))
        .size;

      return NextResponse.json({
        activeCampaigns,
        creatorsEngaged,
        totalDeposited,
        completedDeals,
      });
    }

    if (role === 'admin') {
      const queries: Promise<FirebaseFirestore.QuerySnapshot>[] = [
        adminDb.collection('users').where('role', '==', 'creator').where('chapter_id', '==', chapterId).get(),
        adminDb.collection('users').where('role', '==', 'merchant').where('chapter_id', '==', chapterId).get(),
        adminDb.collection('campaigns').where('status', 'in', ['active', 'in_progress']).get(),
        adminDb.collection('contracts').where('escrow_status', '==', 'released').get(),
      ];

      const [creatorsSnap, merchantsSnap, campaignsSnap, completedSnap] =
        await Promise.all(queries);

      return NextResponse.json({
        activeCreators: creatorsSnap.size,
        activeMerchants: merchantsSnap.size,
        liveCampaigns: campaignsSnap.size,
        dealsCompleted: completedSnap.size,
        avgTrustIndex: 0,
        grossVolume: 0,
      });
    }

    if (role === 'super_admin') {
      const [chaptersSnap, creatorsSnap, merchantsSnap, campaignsSnap] = await Promise.all([
        adminDb.collection('chapters').get(),
        adminDb.collection('users').where('role', '==', 'creator').get(),
        adminDb.collection('users').where('role', '==', 'merchant').get(),
        adminDb.collection('campaigns').where('status', 'in', ['active', 'in_progress']).get(),
      ]);

      const activeChapters = chaptersSnap.docs.filter(
        (d) => d.data().status === 'active'
      ).length;

      return NextResponse.json({
        totalChapters: chaptersSnap.size,
        activeChapters,
        inceptionChapters: chaptersSnap.size - activeChapters,
        totalCreators: creatorsSnap.size,
        totalMerchants: merchantsSnap.size,
        liveCampaigns: campaignsSnap.size,
        grossVolume: 0,
      });
    }

    return NextResponse.json({ error: 'Unknown role' }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Dashboard stats error:', message);
    return NextResponse.json({ error: `Failed to load stats: ${message}` }, { status: 500 });
  }
}
