'use client';

import { Clock, CheckCircle2, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const GOLD = '#C9A84C';
const INDIGO = '#080D26';
const BG = '#F8F7F4';

/* ------------------------------------------------------------------ */
/* Platform config                                                       */
/* ------------------------------------------------------------------ */

type Platform = {
  name: string;
  emoji: string;
  color: string;
  connected: boolean;
  username?: string;
  followers?: string;
  followersRaw?: number;
  verified?: boolean;
  unit?: string;
};

const PLATFORMS: Platform[] = [
  {
    name: 'Instagram',
    emoji: '📸',
    color: '#E1306C',
    connected: true,
    username: '@arjunmenon.kl',
    followers: '1,42,000',
    followersRaw: 142000,
    verified: true,
    unit: 'followers',
  },
  {
    name: 'YouTube',
    emoji: '▶️',
    color: '#FF0000',
    connected: true,
    username: '@ArjunMenon',
    followers: '89,500',
    followersRaw: 89500,
    verified: true,
    unit: 'subscribers',
  },
  {
    name: 'Facebook',
    emoji: '🔵',
    color: '#1877F2',
    connected: false,
  },
  {
    name: 'X (Twitter)',
    emoji: '🐦',
    color: '#14171A',
    connected: true,
    username: '@arjun_creates',
    followers: '28,000',
    followersRaw: 28000,
    verified: true,
    unit: 'followers',
  },
  {
    name: 'LinkedIn',
    emoji: '💼',
    color: '#0A66C2',
    connected: false,
  },
  {
    name: 'TikTok',
    emoji: '🎵',
    color: '#010101',
    connected: false,
  },
];

const SYNC_TIME = 'Today · 00:00:00 IST';

/* ------------------------------------------------------------------ */
/* Page                                                                  */
/* ------------------------------------------------------------------ */

export default function SocialAccountsPage() {
  return (
    <div style={{ background: BG, minHeight: '100%' }} className="p-6 rounded-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: INDIGO, fontFamily: 'var(--font-bricolage, sans-serif)' }}
          >
            Social Accounts
          </h1>
          <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
            Connect and manage your creator platforms in one place.
          </p>
        </div>
        <div
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(201,168,76,0.10)', color: '#92400e', border: '1px solid rgba(201,168,76,0.20)' }}
        >
          <Clock size={12} style={{ color: GOLD }} />
          <span style={{ color: GOLD }}>Last synced: {SYNC_TIME}</span>
        </div>
      </div>

      {/* Platform cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {PLATFORMS.map((p) =>
          p.connected ? (
            <ConnectedCard key={p.name} platform={p} />
          ) : (
            <DisconnectedCard key={p.name} platform={p} />
          )
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Connected card                                                        */
/* ------------------------------------------------------------------ */

function ConnectedCard({ platform: p }: { platform: Platform }) {
  return (
    <Card
      className="border-0 shadow-sm"
      style={{ background: '#fff', borderRadius: '14px', overflow: 'hidden' }}
    >
      {/* Color bar */}
      <div style={{ height: '4px', background: p.color }} />

      <CardHeader className="pb-0 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl leading-none">{p.emoji}</span>
            <div>
              <CardTitle
                className="text-base font-semibold leading-tight"
                style={{ color: INDIGO }}
              >
                {p.name}
              </CardTitle>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs" style={{ color: '#6b7280' }}>
                  {p.username}
                </span>
                {p.verified && (
                  <CheckCircle2 size={11} style={{ color: '#3b82f6' }} />
                )}
              </div>
            </div>
          </div>
          <Badge
            className="text-xs font-medium"
            style={{
              background: 'rgba(34,197,94,0.10)',
              color: '#15803d',
              border: '1px solid rgba(34,197,94,0.25)',
            }}
          >
            Connected
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-3 pb-4">
        <div
          className="flex items-end justify-between rounded-xl p-3"
          style={{ background: 'rgba(8,13,38,0.04)' }}
        >
          <div>
            <div className="text-xl font-bold" style={{ color: GOLD }}>
              {p.followers}
            </div>
            <div className="text-xs" style={{ color: '#9ca3af' }}>
              {p.unit}
            </div>
          </div>
          <button
            className="flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-colors"
            style={{ color: '#6b7280', background: 'rgba(0,0,0,0.04)' }}
            onClick={() => alert(`Opening ${p.name} profile — ${p.username}`)}
          >
            <ExternalLink size={11} />
            View
          </button>
        </div>

        <div className="mt-2 text-xs" style={{ color: '#9ca3af' }}>
          Last synced: {SYNC_TIME}
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Disconnected card                                                     */
/* ------------------------------------------------------------------ */

function DisconnectedCard({ platform: p }: { platform: Platform }) {
  return (
    <Card
      className="border-0 shadow-sm"
      style={{
        background: '#fff',
        borderRadius: '14px',
        overflow: 'hidden',
        opacity: 0.85,
      }}
    >
      <div style={{ height: '4px', background: '#e5e7eb' }} />

      <CardHeader className="pb-0 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl leading-none" style={{ filter: 'grayscale(0.5)' }}>
              {p.emoji}
            </span>
            <CardTitle className="text-base font-semibold" style={{ color: '#9ca3af' }}>
              {p.name}
            </CardTitle>
          </div>
          <Badge
            className="text-xs font-medium"
            style={{
              background: 'rgba(156,163,175,0.12)',
              color: '#9ca3af',
              border: '1px solid rgba(156,163,175,0.25)',
            }}
          >
            Not connected
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-3 pb-4">
        <p className="text-xs mb-3" style={{ color: '#9ca3af' }}>
          Connect your {p.name} account to track followers, sync posts, and apply for brand deals.
        </p>
        <Button
          className="w-full text-sm font-semibold"
          style={{
            background: GOLD,
            color: '#fff',
            border: 'none',
            height: '36px',
            borderRadius: '10px',
          }}
          onClick={() => alert('OAuth flow would open here')}
        >
          Connect Account
        </Button>
      </CardContent>
    </Card>
  );
}
