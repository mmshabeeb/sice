import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/server';

type ApplicationRecord = Record<string, unknown>;

const PLATFORMS = [
  { label: 'Facebook', urlKey: 'facebook_url', followersKey: 'facebook_followers' },
  { label: 'Instagram', urlKey: 'instagram_url', followersKey: 'instagram_followers' },
  { label: 'YouTube', urlKey: 'youtube_url', followersKey: 'youtube_followers' },
  { label: 'X', urlKey: 'x_url', followersKey: 'x_followers' },
  { label: 'LinkedIn', urlKey: 'linkedin_url', followersKey: 'linkedin_followers' },
] as const;

function clean(value: unknown) {
  return String(value ?? '').trim();
}

function parseFollowers(value: unknown) {
  const text = clean(value).toLowerCase();
  if (!text) return 0;

  const match = text.replace(/,/g, '').match(/([\d.]+)\s*([kmb])?/);
  if (!match) return 0;

  const amount = Number(match[1]);
  if (!Number.isFinite(amount)) return 0;

  const multiplier = match[2] === 'b' ? 1_000_000_000 : match[2] === 'm' ? 1_000_000 : match[2] === 'k' ? 1_000 : 1;
  return Math.round(amount * multiplier);
}

function formatCount(value: number) {
  return new Intl.NumberFormat('en-IN').format(value);
}

function hasToDate(value: unknown): value is { toDate: () => Date } {
  return typeof value === 'object' && value !== null && 'toDate' in value && typeof value.toDate === 'function';
}

function formatDate(value: unknown) {
  const date = hasToDate(value) ? value.toDate() : value ? new Date(String(value)) : null;
  if (!date || Number.isNaN(date.getTime())) return 'Unknown';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function getName(data: ApplicationRecord) {
  return clean(data.full_name || data.contact_person_name || data.brand_name || 'Unnamed Applicant');
}

function getLocation(data: ApplicationRecord) {
  const parts = [data.city, data.state, data.country].map(clean).filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : 'Kerala, India';
}

export async function GET() {
  try {
    const snapshot = await adminDb
      .collection('applications')
      .orderBy('submitted_at', 'desc')
      .limit(100)
      .get();

    const applications = snapshot.docs.map((doc) => {
      const data = doc.data();
      const socials = PLATFORMS.map((platform) => ({
        platform: platform.label,
        url: clean(data[platform.urlKey]),
        followers: clean(data[platform.followersKey]),
      })).filter((item) => item.url || item.followers);

      const totalFollowers = socials.reduce((sum, item) => sum + parseFollowers(item.followers), 0);
      const handles = socials.map((item) => item.url || item.platform).join(', ') || 'None';
      const followerSummary = socials
        .map((item) => `${item.platform}: ${item.followers || '0'}`)
        .join(', ');

      return {
        id: doc.id,
        name: getName(data),
        email: clean(data.email) || 'No email',
        type: clean(data.application_type || 'creator'),
        handles,
        followers: followerSummary || (totalFollowers > 0 ? formatCount(totalFollowers) : 'None'),
        totalFollowers: totalFollowers > 0 ? formatCount(totalFollowers) : 'None',
        socialAccounts: socials,
        bio: clean(data.statement_of_purpose) || `Creator application submitted on SICE. Contact: ${clean(data.contact_number) || 'N/A'}. WhatsApp: ${clean(data.whatsapp_number) || 'N/A'}.`,
        appliedDate: formatDate(data.submitted_at),
        status: clean(data.status || 'pending'),
        location: getLocation(data),
        languages: ['Malayalam', 'English'],
        niches: ['General', 'Lifestyle'],
      };
    });

    return NextResponse.json({ applications });
  } catch (err: unknown) {
    console.error('Applications API error:', err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `Failed to load applications: ${message}` },
      { status: 500 }
    );
  }
}
