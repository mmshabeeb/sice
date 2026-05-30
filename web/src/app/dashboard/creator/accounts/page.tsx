'use client';

import { useEffect, useState } from 'react';
import { Clock, CheckCircle2, ExternalLink, Loader2, X, AlertCircle, Link2 } from 'lucide-react';
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

const PLATFORM_META: Record<string, { emoji: string; color: string; unit: string; placeholder: string }> = {
  instagram: { emoji: '📸', color: '#E1306C', unit: 'Followers', placeholder: 'e.g. _razii___ or instagram profile URL' },
  youtube: { emoji: '▶️', color: '#FF0000', unit: 'Subscribers', placeholder: 'e.g. @sice_media or youtube channel URL' },
  facebook: { emoji: '🔵', color: '#1877F2', unit: 'Followers', placeholder: 'e.g. sice.media or facebook profile URL' },
  x: { emoji: '🐦', color: '#14171A', unit: 'Followers', placeholder: 'e.g. sice_media or x.com profile URL' },
  linkedin: { emoji: '💼', color: '#0A66C2', unit: 'Connections', placeholder: 'e.g. company/sice or linkedin profile URL' },
  tiktok: { emoji: '🎵', color: '#010101', unit: 'Followers', placeholder: 'e.g. sice_media or tiktok profile URL' },
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

  // Connect Modal state
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [connectPlatform, setConnectPlatform] = useState<string | null>(null);
  const [usernameOrUrl, setUsernameOrUrl] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifiedCount, setVerifiedCount] = useState<string | null>(null);
  const [followerCountInput, setFollowerCountInput] = useState('');
  const [connectError, setConnectError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAccounts = () => {
    setLoading(true);
    fetch('/api/social-accounts')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setAccounts(data.accounts ?? []);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Failed to load accounts'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const linkedMap = new Map(accounts.map((a) => [a.platform.toLowerCase(), a]));
  const lastSync = accounts[0]?.lastSyncedAt ?? null;

  const openConnect = (platform: string) => {
    setConnectPlatform(platform);
    setUsernameOrUrl('');
    setVerifiedCount(null);
    setFollowerCountInput('');
    setConnectError(null);
    setIsConnectOpen(true);
  };

  function getProfileDetails(platform: string, input: string) {
    let username = input.trim();
    let profileUrl = input.trim();
    
    if (profileUrl.includes('//') || profileUrl.includes('.')) {
      // Extract username from URL
      try {
        const parts = profileUrl.split('/').filter(Boolean);
        const lastPart = parts[parts.length - 1].split('?')[0].replace(/^@/, '');
        username = lastPart || input;
      } catch {
        username = input;
      }
    } else {
      // Construct URL from handle
      username = username.replace(/^@/, '');
      if (platform === 'instagram') profileUrl = `https://instagram.com/${username}`;
      else if (platform === 'youtube') profileUrl = `https://youtube.com/@${username}`;
      else if (platform === 'facebook') profileUrl = `https://facebook.com/${username}`;
      else if (platform === 'x') profileUrl = `https://x.com/${username}`;
      else if (platform === 'linkedin') profileUrl = `https://linkedin.com/in/${username}`;
      else if (platform === 'tiktok') profileUrl = `https://tiktok.com/@${username}`;
    }
    return { username, profileUrl };
  }

  const handleVerify = async () => {
    if (!usernameOrUrl.trim() || !connectPlatform) return;
    setVerifying(true);
    setConnectError(null);
    setVerifiedCount(null);

    const { profileUrl } = getProfileDetails(connectPlatform, usernameOrUrl);

    try {
      const res = await fetch('/api/social/followers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: connectPlatform, url: profileUrl }),
      });
      const data = await res.json();
      if (data.success && data.count) {
        setVerifiedCount(data.count);
        setFollowerCountInput(data.count);
      } else {
        setConnectError(data.error || 'Failed to verify account followers. Please try again.');
      }
    } catch (err) {
      setConnectError('Verification request failed. Please check your network and try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleConnectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectPlatform || !usernameOrUrl.trim() || actionLoading) return;
    
    setActionLoading(true);
    setConnectError(null);

    const { username, profileUrl } = getProfileDetails(connectPlatform, usernameOrUrl);

    try {
      const res = await fetch('/api/social-accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: connectPlatform,
          username,
          profileUrl,
          followerCount: followerCountInput || '0',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsConnectOpen(false);
        fetchAccounts();
      } else {
        setConnectError(data.error || 'Failed to connect social account.');
      }
    } catch (err) {
      setConnectError('Connect request failed.');
    } finally {
      setActionLoading(false);
    }
  };

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
            const meta = PLATFORM_META[key] ?? { emoji: '🔗', color: '#6b7280', unit: 'Followers', placeholder: '' };
            const linked = linkedMap.get(key);
            const count = linked
              ? (key === 'youtube' ? linked.subscriberCount : linked.followerCount)
              : 0;

            return linked ? (
              <Card
                key={key}
                className="border-0 shadow-sm animate-in fade-in duration-300"
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
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(240,235,224,0.04)', borderRadius: '14px', overflow: 'hidden', opacity: 0.85 }}
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
                    className="w-full text-sm font-bold bg-[#C9A84C] hover:bg-[#b0913b] text-slate-950 transition-all hover:scale-[1.02]"
                    style={{ border: 'none', height: '36px', borderRadius: '10px' }}
                    onClick={() => openConnect(key)}
                  >
                    Connect Account
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* CONNECT PLATFORM MODAL */}
      {isConnectOpen && connectPlatform && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div
            className="w-full max-w-md rounded-2xl border-0 p-6 space-y-6 animate-in zoom-in-95 duration-200"
            style={{
              background: '#080D26',
              border: '1px solid rgba(240, 235, 224, 0.15)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
            }}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-2xl leading-none">
                  {PLATFORM_META[connectPlatform]?.emoji}
                </span>
                <h3 className="text-lg font-bold text-white font-bricolage capitalize">
                  Connect {connectPlatform === 'x' ? 'X (Twitter)' : connectPlatform}
                </h3>
              </div>
              <button
                onClick={() => setIsConnectOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
                disabled={actionLoading || verifying}
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleConnectSubmit} className="space-y-4">
              {connectError && (
                <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl flex items-start gap-2 animate-in shake duration-300">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>{connectError}</span>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Profile Username or Link *
                </label>
                <div className="relative flex items-center">
                  <Link2 size={14} className="absolute left-3.5 text-gray-500" />
                  <input
                    type="text"
                    required
                    disabled={verifying || actionLoading}
                    placeholder={PLATFORM_META[connectPlatform]?.placeholder}
                    value={usernameOrUrl}
                    onChange={(e) => setUsernameOrUrl(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors disabled:opacity-55"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {PLATFORM_META[connectPlatform]?.unit} Count *
                  </label>
                  <button
                    type="button"
                    disabled={verifying || actionLoading || !usernameOrUrl.trim()}
                    onClick={handleVerify}
                    className="text-xs font-semibold text-[#C9A84C] hover:text-[#b0913b] disabled:opacity-40 transition-colors flex items-center gap-1"
                  >
                    {verifying ? (
                      <>
                        <Loader2 size={11} className="animate-spin" /> Fetching...
                      </>
                    ) : (
                      '🔍 Auto-Fetch Count'
                    )}
                  </button>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    required
                    disabled={actionLoading}
                    placeholder="e.g. 12.5K, 3933, or 1.2M"
                    value={followerCountInput}
                    onChange={(e) => setFollowerCountInput(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors disabled:opacity-55"
                  />
                  {verifiedCount && verifiedCount === followerCountInput && (
                    <Badge className="absolute right-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[9px] pointer-events-none">
                      VERIFIED
                    </Badge>
                  )}
                </div>
                <p className="text-[10px] text-gray-500">
                  You can enter your exact count manually or click &quot;Auto-Fetch Count&quot; to fetch it automatically.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  disabled={actionLoading || verifying}
                  onClick={() => setIsConnectOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-55"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || verifying || !usernameOrUrl.trim() || !followerCountInput.trim()}
                  className="px-4 py-2 rounded-xl text-xs font-semibold disabled:opacity-50 transition-all hover:scale-[1.02]"
                  style={{ background: GOLD, color: '#080D26' }}
                >
                  {actionLoading ? (
                    <span className="flex items-center gap-1.5">
                      <Loader2 size={12} className="animate-spin" /> Connecting...
                    </span>
                  ) : (
                    'Connect Account'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
