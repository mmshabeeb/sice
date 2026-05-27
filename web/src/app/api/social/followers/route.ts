import { NextResponse } from 'next/server';

const PLATFORM_HOSTS: Record<string, string[]> = {
  facebook: ['facebook.com', 'fb.com'],
  instagram: ['instagram.com'],
  youtube: ['youtube.com', 'youtu.be'],
  x: ['x.com', 'twitter.com'],
  linkedin: ['linkedin.com'],
};

function normalizeProfileUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    return new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
  } catch {
    return null;
  }
}

function hostMatchesPlatform(platform: string, url: URL) {
  const hosts = PLATFORM_HOSTS[platform];
  if (!hosts) return false;

  const hostname = url.hostname.replace(/^www\./, '').toLowerCase();
  return hosts.some((host) => hostname === host || hostname.endsWith(`.${host}`));
}

function extractUsername(platform: string, url: URL): string {
  const segments = url.pathname.split('/').filter(Boolean);
  if (segments.length === 0) return '';

  if (platform === 'youtube') {
    if (['channel', 'c', 'user'].includes(segments[0])) return segments[1] || '';
    return segments[0] || '';
  }

  if (platform === 'linkedin') {
    if (['in', 'company'].includes(segments[0])) return segments[1] || '';
    return segments[0] || '';
  }

  return segments[0] || '';
}

function compactNumber(value: number) {
  if (value >= 1_000_000_000) return `${Number((value / 1_000_000_000).toFixed(1))}B`;
  if (value >= 1_000_000) return `${Number((value / 1_000_000).toFixed(1))}M`;
  if (value >= 1_000) return `${Number((value / 1_000).toFixed(1))}K`;
  return new Intl.NumberFormat('en-IN').format(value);
}

function normalizeCount(value: string) {
  const cleaned = value.replace(/\\u002c/g, ',').replace(/,/g, '').trim();
  const match = cleaned.match(/(\d+(?:\.\d+)?)\s*([kmb])?/i);
  if (!match) return null;

  const amount = Number(match[1]);
  if (!Number.isFinite(amount)) return null;

  const suffix = match[2]?.toLowerCase();
  const multiplier = suffix === 'b' ? 1_000_000_000 : suffix === 'm' ? 1_000_000 : suffix === 'k' ? 1_000 : 1;
  return compactNumber(Math.round(amount * multiplier));
}

function extractCountFromHtml(platform: string, html: string) {
  const decoded = html.replace(/&quot;/g, '"').replace(/&#x27;/g, "'");

  const jsonPatterns =
    platform === 'youtube'
      ? [
          /"subscriberCountText"\s*:\s*\{\s*"simpleText"\s*:\s*"([^"]+)"/i,
          /"subscriberCountText"\s*:\s*\{\s*"runs"\s*:\s*\[\s*\{\s*"text"\s*:\s*"([^"]+)"/i,
        ]
      : [
          /"edge_followed_by"\s*:\s*\{\s*"count"\s*:\s*(\d+)/i,
          /"followers_count"\s*:\s*(\d+)/i,
          /"followerCount"\s*:\s*(\d+)/i,
          /"followers"\s*:\s*\{\s*"count"\s*:\s*(\d+)/i,
        ];

  for (const pattern of jsonPatterns) {
    const match = decoded.match(pattern);
    if (match?.[1]) {
      const count = normalizeCount(match[1]);
      if (count) return count;
    }
  }

  const label = platform === 'youtube' ? 'subscribers' : 'followers';
  const textPatterns = [
    new RegExp(`([\\d.,]+\\s*[KMB]?)\\s+${label}`, 'i'),
    new RegExp(`content=["'][^"']*?([\\d.,]+\\s*[KMB]?)\\s+${label}`, 'i'),
  ];

  for (const pattern of textPatterns) {
    const match = decoded.match(pattern);
    if (match?.[1]) {
      const count = normalizeCount(match[1]);
      if (count) return count;
    }
  }

  return null;
}

async function fetchProfileHtml(url: URL) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: controller.signal,
      cache: 'no-store',
    });

    if (!response.ok) return null;
    return response.text();
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function POST(request: Request) {
  try {
    const { platform, url } = await request.json();
    const platformKey = String(platform || '').toLowerCase();
    const profileUrl = normalizeProfileUrl(String(url || ''));

    if (!platformKey || !profileUrl) {
      return NextResponse.json({ success: false, error: 'Enter a valid social profile URL.' }, { status: 400 });
    }

    if (!hostMatchesPlatform(platformKey, profileUrl)) {
      return NextResponse.json({ success: false, error: 'The URL does not match the selected platform.' }, { status: 400 });
    }

    const username = extractUsername(platformKey, profileUrl);
    if (!username) {
      return NextResponse.json({ success: false, error: 'Could not read the profile username from this URL.' }, { status: 400 });
    }

    const html = await fetchProfileHtml(profileUrl);
    const count = html ? extractCountFromHtml(platformKey, html) : null;

    if (!count) {
      return NextResponse.json(
        {
          success: false,
          error: 'Follower count is not publicly available for this profile. Enter the count manually.',
        },
        { status: 422 }
      );
    }

    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error('Error fetching social followers:', error);
    return NextResponse.json(
      { success: false, error: 'Unable to fetch follower count right now. Enter the count manually.' },
      { status: 502 }
    );
  }
}
