'use client';

import { useEffect, useState } from 'react';
import { Clock, CheckCircle2, ExternalLink, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const GOLD = '#C9A84C';

interface LinkedAccount {
  id: string;
  platform: string;
  username: string | null;
  profileUrl: string | null;
  followerCount: number;
  subscriberCount: number;
  engagementRate: number;
  isVerified: boolean;
  lastSyncedAt: string | null;
}

const PLATFORM_META: Record<string, { emoji: string; color: string; unit: string }> = {
  instagram: { emoji: '📸', color: '#E1306C', unit: 'Followers' },
  youtube: { emoji: '▶️', color: '#FF0000', unit: 'Subscribers' },
  facebook: { emoji: '🔵', color: '#1877F2', unit: 'Followers' },
  x: { emoji: '🐦', color: '#14171A', unit: 'Followers' },
  linkedin: { emoji: '💼', color: '#0A66C2', unit: 'Connections' },
  tiktok: { emoji: '🎵', color: '#010101', unit: 'Followers' },
};

const ALL_PLATFORMS = ['instagram', 'youtube', 'facebook', 'x', 'linkedin', 'tiktok'];

function formatCount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function formatSyncTime(iso: string | null) {
  if (!iso) return 'Never synced';
  const d = new Date(iso);
  return isNaN(d.getTime()) ? 'Unknown' : d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function SocialAccountsPage() {
  const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/social-accounts')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setAccounts(data.accounts ?? []);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Failed to load accounts'))
      .finally(() => setLoading(false));
  }, []);

  const linkedMap = new Map(accounts.map((a) => [a.platform.toLowerCase(), a]));
  const lastSync = accounts[0]?.lastSyncedAt ?? null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-bricolage">Social Accounts</h1>
          <p className="text-sm mt-1 text-gray-400">Connect and manage your creator platforms in one place.</p>
        </div>
        <div
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[#C9A84C]/30"
          style={{ background: 'rgba(201,168,76,0.10)', color: GOLD }}
        >
          <Clock size={12} style={{ color: GOLD }} />
          <span>Last synced: {formatSyncTime(lastSync)}</span>
        </div>
      </div>

      {error && (
        <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 size={20} className="animate-spin mr-2" /> Loading accounts…
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {ALL_PLATFORMS.map((key) => {
            const meta = PLATFORM_META[key] ?? { emoji: '🔗', color: '#6b7280', unit: 'Followers' };
            const linked = linkedMap.get(key);
            const count = linked
              ? (key === 'youtube' ? linked.subscriberCount : linked.followerCount)
              : 0;

            return linked ? (
              <Card
                key={key}
                className="border-0 shadow-sm"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(240,235,224,0.08)', borderRadius: '14px', overflow: 'hidden' }}
              >
                <div style={{ height: '4px', background: meta.color }} />
                <CardHeader className="pb-0 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl leading-none">{meta.emoji}</span>
                      <div>
                        <CardTitle className="text-base font-semibold leading-tight text-white font-bricolage capitalize">
                          {key === 'x' ? 'X (Twitter)' : key.charAt(0).toUpperCase() + key.slice(1)}
                        </CardTitle>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs text-gray-400">{linked.username ?? 'Connected'}</span>
                          {linked.isVerified && <CheckCircle2 size={11} className="text-[#818cf8]" />}
                        </div>
                      </div>
                    </div>
                    <Badge className="text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      Connected
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-3 pb-4">
                  <div
                    className="flex items-end justify-between rounded-xl p-3 border border-white/5"
                    style={{ background: 'rgba(255,255,255,0.02)' }}
                  >
                    <div>
                      <div className="text-xl font-bold font-bricolage" style={{ color: GOLD }}>
                        {formatCount(count)}
                      </div>
                      <div className="text-xs text-gray-400">{meta.unit}</div>
                    </div>
                    {linked.profileUrl && (
                      <a
                        href={linked.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md transition-colors border border-white/10 hover:border-white/20 text-gray-300 hover:text-white bg-white/5"
                      >
                        <ExternalLink size={11} />
                        View
                      </a>
                    )}
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Last synced: {formatSyncTime(linked.lastSyncedAt)}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card
                key={key}
                className="border-0 shadow-sm"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(240,235,224,0.04)', borderRadius: '14px', overflow: 'hidden', opacity: 0.75 }}
              >
                <div style={{ height: '4px', background: '#374151' }} />
                <CardHeader className="pb-0 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl leading-none grayscale" style={{ opacity: 0.5 }}>{meta.emoji}</span>
                      <CardTitle className="text-base font-semibold text-gray-500 font-bricolage capitalize">
                        {key === 'x' ? 'X (Twitter)' : key.charAt(0).toUpperCase() + key.slice(1)}
                      </CardTitle>
                    </div>
                    <Badge className="text-xs font-medium bg-white/5 text-gray-500 border border-white/10">
                      Not connected
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-3 pb-4">
                  <p className="text-xs mb-3 text-gray-400">
                    Connect your {key === 'x' ? 'X (Twitter)' : key} account to track followers, sync posts, and apply for brand deals.
                  </p>
                  <Button
                    className="w-full text-sm font-bold bg-[#C9A84C] hover:bg-[#b0913b] text-slate-950"
                    style={{ border: 'none', height: '36px', borderRadius: '10px' }}
                    onClick={() => alert('OAuth flow would open here')}
                  >
                    Connect Account
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
