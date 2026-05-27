'use client';

import { useEffect, useState } from 'react';
import {
  MapPin, Users, TrendingUp, Star, SlidersHorizontal, RotateCcw,
  Info, Link2, Play, AtSign, Eye, Send, Loader2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

const GOLD = '#C9A84C';

interface CreatorAccount {
  platform: string;
  followerCount: number;
  subscriberCount: number;
}

interface Creator {
  uid: string;
  name: string;
  chapterId: string | null;
  totalFollowers: number;
  primaryPlatform: string;
  accounts: CreatorAccount[];
  status: string;
  trustScore: number;
  engagementRate: number;
  niche: string;
  languages: string[];
}

const PLATFORM_ICON: Record<string, React.ReactNode> = {
  instagram: <Link2 size={11} />,
  youtube: <Play size={11} />,
  x: <AtSign size={11} />,
};
const PLATFORM_STYLE: Record<string, { bg: string; color: string }> = {
  instagram: { bg: 'rgba(225,48,108,0.15)', color: '#f43f5e' },
  youtube: { bg: 'rgba(255,0,0,0.15)', color: '#ef4444' },
  x: { bg: 'rgba(255,255,255,0.08)', color: '#cbd5e1' },
};

function TrustPill({ score }: { score: number }) {
  const color = score >= 80 ? '#4ade80' : score >= 60 ? '#fbbf24' : '#f87171';
  const bg = score >= 80 ? 'rgba(34,197,94,0.15)' : score >= 60 ? 'rgba(217,119,6,0.15)' : 'rgba(220,38,38,0.15)';
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-white/5" style={{ background: bg, color }}>
      <Star size={10} fill={color} />{score}
    </span>
  );
}

function formatFollowers(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function CreatorCard({ creator }: { creator: Creator }) {
  const initials = creator.name.split(' ').map((n) => n[0]).join('').slice(0, 2);
  const topAccounts = creator.accounts.slice(0, 3);

  return (
    <Card
      className="border-0 shadow-sm transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(240,235,224,0.08)', borderRadius: 14 }}
    >
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-full text-sm font-bold text-white shrink-0 border border-white/10 bg-white/10">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm leading-tight text-white font-bricolage">{creator.name}</div>
            <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-400">
              <MapPin size={10} />{creator.chapterId ?? 'No chapter'}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">{creator.languages.join(' · ') || 'N/A'}</div>
          </div>
          <Badge className="text-xs px-2 py-0.5 shrink-0 bg-white/5 text-gray-300 border border-white/5">{creator.niche}</Badge>
        </div>

        {topAccounts.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {topAccounts.map((a) => {
              const style = PLATFORM_STYLE[a.platform] ?? { bg: 'rgba(255,255,255,0.08)', color: '#cbd5e1' };
              const icon = PLATFORM_ICON[a.platform] ?? <Link2 size={11} />;
              const count = a.platform === 'youtube' ? a.subscriberCount : a.followerCount;
              return (
                <span key={a.platform} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border border-white/5" style={style}>
                  {icon}{a.platform.toUpperCase()} {formatFollowers(count)}
                </span>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/10">
          <div className="text-center">
            <div className="flex items-center justify-center gap-0.5 text-gray-500 mb-0.5">
              <Users size={10} /><span className="text-[10px]">Reach</span>
            </div>
            <div className="text-xs font-bold text-white font-bricolage">{formatFollowers(creator.totalFollowers)}</div>
          </div>
          <div className="text-center border-x border-white/10">
            <div className="flex items-center justify-center gap-0.5 text-gray-500 mb-0.5">
              <TrendingUp size={10} /><span className="text-[10px]">Eng.</span>
            </div>
            <div className="text-xs font-bold text-[#C9A84C] font-bricolage">{creator.engagementRate.toFixed(1)}%</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-0.5 text-gray-500 mb-0.5">
              <Star size={10} /><span className="text-[10px]">Trust</span>
            </div>
            <TrustPill score={creator.trustScore} />
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <Button variant="outline" className="flex-1 h-8 text-xs gap-1 border-white/10 text-gray-300 hover:bg-white/5 hover:text-white bg-transparent">
            <Eye size={12} /> View Profile
          </Button>
          <Button className="flex-1 h-8 text-xs gap-1 font-bold bg-[#C9A84C] hover:bg-[#b0913b] text-slate-950" style={{ border: 'none' }}>
            <Send size={12} /> Invite
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TalentDiscoveryPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [langFilter, setLangFilter] = useState('all');
  const [nicheFilter, setNicheFilter] = useState('all');
  const [minFollowers, setMinFollowers] = useState('');
  const [minEngagement, setMinEngagement] = useState('');

  useEffect(() => {
    fetch('/api/users/creators')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setCreators(data.creators ?? []);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Failed to load creators'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = creators.filter((c) => {
    if (langFilter !== 'all' && !c.languages.includes(langFilter)) return false;
    if (nicheFilter !== 'all' && c.niche !== nicheFilter) return false;
    if (minFollowers) {
      const min = parseInt(minFollowers.replace(/,/g, ''), 10);
      if (!isNaN(min) && c.totalFollowers < min) return false;
    }
    if (minEngagement) {
      const min = parseFloat(minEngagement);
      if (!isNaN(min) && c.engagementRate < min) return false;
    }
    return true;
  });

  const handleReset = () => { setLangFilter('all'); setNicheFilter('all'); setMinFollowers(''); setMinEngagement(''); };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white font-bricolage">Talent Discovery</h1>
        <p className="text-sm mt-1 text-gray-400">Find the right creators for your campaign — filtered by language, niche, and performance signals.</p>
      </div>

      <div className="flex items-start gap-3 px-4 py-3 rounded-xl text-xs border border-[#C9A84C]/30 bg-[#C9A84C]/10" style={{ color: GOLD }}>
        <Info size={14} className="mt-0.5 shrink-0 text-[#C9A84C]" />
        <span><strong>Sorted by Audience Engagement Velocity</strong> · High engagement rate with a smaller, loyal audience outperforms inflated follower counts.</span>
      </div>

      {error && (
        <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-4 py-3">{error}</div>
      )}

      <Card className="border-0 shadow-sm" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(240,235,224,0.08)', borderRadius: 14 }}>
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-2 mb-3">
            <SlidersHorizontal size={15} style={{ color: GOLD }} />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A84C] font-bricolage">Filters</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-400">Language</Label>
              <Select value={langFilter} onValueChange={(v) => setLangFilter(v ?? 'all')}>
                <SelectTrigger className="w-full h-9 text-sm bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="All Languages" />
                </SelectTrigger>
                <SelectContent className="bg-slate-950 border-white/10 text-white">
                  {['all', 'Malayalam', 'Tamil', 'Telugu', 'Kannada'].map((v) => (
                    <SelectItem key={v} value={v} className="focus:bg-white/5 focus:text-white">{v === 'all' ? 'All Languages' : v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-400">Niche</Label>
              <Select value={nicheFilter} onValueChange={(v) => setNicheFilter(v ?? 'all')}>
                <SelectTrigger className="w-full h-9 text-sm bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="All Niches" />
                </SelectTrigger>
                <SelectContent className="bg-slate-950 border-white/10 text-white">
                  {['all', 'Lifestyle', 'Tech', 'Food', 'Fashion', 'Gaming', 'Education'].map((v) => (
                    <SelectItem key={v} value={v} className="focus:bg-white/5 focus:text-white">{v === 'all' ? 'All Niches' : v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-400">Min Followers</Label>
              <Input type="number" placeholder="e.g. 50000" value={minFollowers} onChange={(e) => setMinFollowers(e.target.value)} className="h-9 text-sm bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-400">Min Engagement (%)</Label>
              <Input type="number" step="0.1" placeholder="e.g. 3.5" value={minEngagement} onChange={(e) => setMinEngagement(e.target.value)} className="h-9 text-sm bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Button variant="outline" className="h-9 px-4 text-sm gap-1.5 border-white/10 text-gray-300 hover:bg-white/5 hover:text-white bg-transparent" onClick={handleReset}>
              <RotateCcw size={13} /> Reset
            </Button>
            <span className="ml-auto text-xs text-gray-400">{filtered.length} creator{filtered.length !== 1 ? 's' : ''} found</span>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 size={20} className="animate-spin mr-2" /> Loading creators…
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Users size={40} className="mb-3 opacity-40" />
          <p className="text-sm font-medium">{creators.length === 0 ? 'No approved creators yet.' : 'No creators match your filters.'}</p>
          <p className="text-xs mt-1">{creators.length === 0 ? 'Creators will appear here once approved.' : 'Try adjusting or resetting the filters above.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((creator) => <CreatorCard key={creator.uid} creator={creator} />)}
        </div>
      )}
    </div>
  );
}
