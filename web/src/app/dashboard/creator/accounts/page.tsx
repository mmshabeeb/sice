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
    connected: false,
  },
  {
    name: 'YouTube',
    emoji: '▶️',
    color: '#FF0000',
    connected: false,
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
    connected: false,
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight text-white font-bricolage"
          >
            Social Accounts
          </h1>
          <p className="text-sm mt-1 text-gray-400">
            Connect and manage your creator platforms in one place.
          </p>
        </div>
        <div
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[#C9A84C]/30"
          style={{ background: 'rgba(201,168,76,0.10)', color: GOLD }}
        >
          <Clock size={12} style={{ color: GOLD }} />
          <span>Last synced: {SYNC_TIME}</span>
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
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(240, 235, 224, 0.08)',
        borderRadius: '14px',
        overflow: 'hidden',
      }}
    >
      {/* Color bar */}
      <div style={{ height: '4px', background: p.color }} />

      <CardHeader className="pb-0 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl leading-none">{p.emoji}</span>
            <div>
              <CardTitle
                className="text-base font-semibold leading-tight text-white font-bricolage"
              >
                {p.name}
              </CardTitle>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs text-gray-400">
                  {p.username}
                </span>
                {p.verified && (
                  <CheckCircle2 size={11} className="text-[#818cf8]" />
                )}
              </div>
            </div>
          </div>
          <Badge
            className="text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
          >
            Connected
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-3 pb-4">
        <div
          className="flex items-end justify-between rounded-xl p-3 border border-white/5"
          style={{ background: 'rgba(255, 255, 255, 0.02)' }}
        >
          <div>
            <div className="text-xl font-bold text-[#C9A84C] font-bricolage">
              {p.followers}
            </div>
            <div className="text-xs text-gray-450">
              {p.unit}
            </div>
          </div>
          <button
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md transition-colors border border-white/10 hover:border-white/20 text-gray-300 hover:text-white bg-white/5"
            onClick={() => alert(`Opening ${p.name} profile — ${p.username}`)}
          >
            <ExternalLink size={11} />
            View
          </button>
        </div>

        <div className="mt-2 text-xs text-gray-500">
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
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(240, 235, 224, 0.04)',
        borderRadius: '14px',
        overflow: 'hidden',
        opacity: 0.75,
      }}
    >
      <div style={{ height: '4px', background: '#374151' }} />

      <CardHeader className="pb-0 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl leading-none grayscale" style={{ opacity: 0.5 }}>
              {p.emoji}
            </span>
            <CardTitle className="text-base font-semibold text-gray-500 font-bricolage">
              {p.name}
            </CardTitle>
          </div>
          <Badge
            className="text-xs font-medium bg-white/5 text-gray-500 border border-white/10"
          >
            Not connected
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-3 pb-4">
        <p className="text-xs mb-3 text-gray-400">
          Connect your {p.name} account to track followers, sync posts, and apply for brand deals.
        </p>
        <Button
          className="w-full text-sm font-bold bg-[#C9A84C] hover:bg-[#b0913b] text-slate-950"
          style={{
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
