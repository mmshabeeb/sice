'use client';

import { useState } from 'react';
import {
  MapPin,
  Users,
  TrendingUp,
  Star,
  SlidersHorizontal,
  RotateCcw,
  Info,
  Link2,
  Play,
  AtSign,
  Eye,
  Send,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/* ------------------------------------------------------------------ */
/* Brand tokens                                                          */
/* ------------------------------------------------------------------ */
const GOLD = '#C9A84C';
const INDIGO = '#080D26';
const BG = '#F8F7F4';

/* ------------------------------------------------------------------ */
/* Types & mock data                                                     */
/* ------------------------------------------------------------------ */
type Platform = 'IG' | 'YT' | 'X';

interface Creator {
  id: number;
  name: string;
  location: string;
  languages: string[];
  niche: string;
  platforms: { name: Platform; followers: string }[];
  engagementRate: number;
  trustIndex: number;
  chapter: string;
}

const CREATORS: Creator[] = [
  {
    id: 1,
    name: 'Arjun Menon',
    location: 'Kozhikode',
    languages: ['Malayalam'],
    niche: 'Lifestyle',
    platforms: [
      { name: 'IG', followers: '142K' },
      { name: 'YT', followers: '89.5K' },
    ],
    engagementRate: 4.8,
    trustIndex: 87,
    chapter: 'Kozhikode',
  },
  {
    id: 2,
    name: 'Priya Nair',
    location: 'Kochi',
    languages: ['Malayalam', 'Tamil'],
    niche: 'Fashion',
    platforms: [{ name: 'IG', followers: '225K' }],
    engagementRate: 6.2,
    trustIndex: 92,
    chapter: 'Kochi',
  },
  {
    id: 3,
    name: 'Rahul Suresh',
    location: 'Bangalore',
    languages: ['Kannada'],
    niche: 'Tech',
    platforms: [{ name: 'YT', followers: '310K' }],
    engagementRate: 3.9,
    trustIndex: 78,
    chapter: 'Bangalore',
  },
  {
    id: 4,
    name: 'Divya Krishnan',
    location: 'Chennai',
    languages: ['Tamil'],
    niche: 'Food',
    platforms: [
      { name: 'IG', followers: '185K' },
      { name: 'YT', followers: '95K' },
    ],
    engagementRate: 5.1,
    trustIndex: 85,
    chapter: 'Chennai',
  },
  {
    id: 5,
    name: 'Arun Vijay',
    location: 'Hyderabad',
    languages: ['Telugu'],
    niche: 'Gaming',
    platforms: [{ name: 'YT', followers: '420K' }],
    engagementRate: 4.3,
    trustIndex: 81,
    chapter: 'Hyderabad',
  },
  {
    id: 6,
    name: 'Meera Pillai',
    location: 'Kozhikode',
    languages: ['Malayalam'],
    niche: 'Lifestyle',
    platforms: [{ name: 'IG', followers: '98K' }],
    engagementRate: 7.1,
    trustIndex: 94,
    chapter: 'Kozhikode',
  },
  {
    id: 7,
    name: 'Karthik Raja',
    location: 'Chennai',
    languages: ['Tamil', 'Telugu'],
    niche: 'Education',
    platforms: [
      { name: 'IG', followers: '156K' },
      { name: 'X', followers: '45K' },
    ],
    engagementRate: 3.7,
    trustIndex: 72,
    chapter: 'Chennai',
  },
  {
    id: 8,
    name: 'Anjali Menon',
    location: 'Kochi',
    languages: ['Malayalam'],
    niche: 'Lifestyle',
    platforms: [
      { name: 'YT', followers: '67K' },
      { name: 'IG', followers: '112K' },
    ],
    engagementRate: 5.8,
    trustIndex: 89,
    chapter: 'Kochi',
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                               */
/* ------------------------------------------------------------------ */
function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('');
}

function TrustPill({ score }: { score: number }) {
  const color =
    score >= 80 ? '#4ade80' : score >= 60 ? '#fbbf24' : '#f87171';
  const bg =
    score >= 80
      ? 'rgba(34,197,94,0.15)'
      : score >= 60
      ? 'rgba(217,119,6,0.15)'
      : 'rgba(220,38,38,0.15)';
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-white/5"
      style={{ background: bg, color }}
    >
      <Star size={10} fill={color} />
      {score}
    </span>
  );
}

const PLATFORM_ICON: Record<Platform, React.ReactNode> = {
  IG: <Link2 size={11} />,
  YT: <Play size={11} />,
  X: <AtSign size={11} />,
};

const PLATFORM_STYLE: Record<Platform, { bg: string; color: string }> = {
  IG: { bg: 'rgba(225,48,108,0.15)', color: '#f43f5e' },
  YT: { bg: 'rgba(255,0,0,0.15)', color: '#ef4444' },
  X: { bg: 'rgba(255,255,255,0.08)', color: '#cbd5e1' },
};

/* ------------------------------------------------------------------ */
/* Page                                                                  */
/* ------------------------------------------------------------------ */
export default function TalentDiscoveryPage() {
  const [langFilter, setLangFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [nicheFilter, setNicheFilter] = useState('all');
  const [minFollowers, setMinFollowers] = useState('');
  const [minEngagement, setMinEngagement] = useState('');

  const parseFollowerCount = (str: string): number => {
    const num = parseFloat(str);
    if (str.endsWith('K')) return num * 1000;
    if (str.endsWith('M')) return num * 1_000_000;
    return num;
  };

  const getMaxFollowers = (creator: Creator): number => {
    return Math.max(...creator.platforms.map((p) => parseFollowerCount(p.followers)));
  };

  const filtered = CREATORS.filter((c) => {
    if (langFilter !== 'all' && !c.languages.includes(langFilter)) return false;
    if (locationFilter !== 'all' && c.chapter !== locationFilter) return false;
    if (nicheFilter !== 'all' && c.niche !== nicheFilter) return false;
    if (minFollowers) {
      const min = parseInt(minFollowers.replace(/,/g, ''), 10);
      if (!isNaN(min) && getMaxFollowers(c) < min) return false;
    }
    if (minEngagement) {
      const min = parseFloat(minEngagement);
      if (!isNaN(min) && c.engagementRate < min) return false;
    }
    return true;
  });

  const handleReset = () => {
    setLangFilter('all');
    setLocationFilter('all');
    setNicheFilter('all');
    setMinFollowers('');
    setMinEngagement('');
  };

  return (
    <div className="space-y-6">
      {/* ── Page title ── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white font-bricolage">
          Talent Discovery
        </h1>
        <p className="text-sm mt-1 text-gray-400">
          Find the right creators for your campaign — filtered by language, chapter, niche, and performance signals.
        </p>
      </div>

      {/* ── Psychographic banner ── */}
      <div
        className="flex items-start gap-3 px-4 py-3 rounded-xl text-xs border border-[#C9A84C]/30 bg-[#C9A84C]/10"
        style={{
          color: GOLD,
        }}
      >
        <Info size={14} className="mt-0.5 shrink-0 text-[#C9A84C]" />
        <span>
          <strong>Sorted by Audience Engagement Velocity</strong> · Follower count is a secondary signal. High engagement rate with a smaller, loyal audience outperforms inflated follower counts.
        </span>
      </div>

      {/* ── Filter bar ── */}
      <Card
        className="border-0 shadow-sm"
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(240, 235, 224, 0.08)',
          borderRadius: 14,
        }}
      >
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-2 mb-3">
            <SlidersHorizontal size={15} style={{ color: GOLD }} />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A84C] font-bricolage">
              Filters
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 items-end">
            {/* Language chapter */}
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-400">Language Chapter</Label>
              <Select value={langFilter} onValueChange={(v) => setLangFilter(v ?? "")}>
                <SelectTrigger className="w-full h-9 text-sm bg-white/5 border-white/10 text-white focus:ring-[#C9A84C]">
                  <SelectValue placeholder="All Languages" />
                </SelectTrigger>
                <SelectContent className="bg-slate-950 border-white/10 text-white">
                  <SelectItem value="all" className="focus:bg-white/5 focus:text-white">All Languages</SelectItem>
                  <SelectItem value="Malayalam" className="focus:bg-white/5 focus:text-white">Malayalam</SelectItem>
                  <SelectItem value="Tamil" className="focus:bg-white/5 focus:text-white">Tamil</SelectItem>
                  <SelectItem value="Telugu" className="focus:bg-white/5 focus:text-white">Telugu</SelectItem>
                  <SelectItem value="Kannada" className="focus:bg-white/5 focus:text-white">Kannada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location chapter */}
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-400">Location Chapter</Label>
              <Select value={locationFilter} onValueChange={(v) => setLocationFilter(v ?? "")}>
                <SelectTrigger className="w-full h-9 text-sm bg-white/5 border-white/10 text-white focus:ring-[#C9A84C]">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent className="bg-slate-950 border-white/10 text-white">
                  <SelectItem value="all" className="focus:bg-white/5 focus:text-white">All Locations</SelectItem>
                  <SelectItem value="Kozhikode" className="focus:bg-white/5 focus:text-white">Kozhikode</SelectItem>
                  <SelectItem value="Kochi" className="focus:bg-white/5 focus:text-white">Kochi</SelectItem>
                  <SelectItem value="Bangalore" className="focus:bg-white/5 focus:text-white">Bangalore</SelectItem>
                  <SelectItem value="Chennai" className="focus:bg-white/5 focus:text-white">Chennai</SelectItem>
                  <SelectItem value="Hyderabad" className="focus:bg-white/5 focus:text-white">Hyderabad</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Niche */}
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-400">Niche</Label>
              <Select value={nicheFilter} onValueChange={(v) => setNicheFilter(v ?? "")}>
                <SelectTrigger className="w-full h-9 text-sm bg-white/5 border-white/10 text-white focus:ring-[#C9A84C]">
                  <SelectValue placeholder="All Niches" />
                </SelectTrigger>
                <SelectContent className="bg-slate-950 border-white/10 text-white">
                  <SelectItem value="all" className="focus:bg-white/5 focus:text-white">All Niches</SelectItem>
                  <SelectItem value="Lifestyle" className="focus:bg-white/5 focus:text-white">Lifestyle</SelectItem>
                  <SelectItem value="Tech" className="focus:bg-white/5 focus:text-white">Tech</SelectItem>
                  <SelectItem value="Food" className="focus:bg-white/5 focus:text-white">Food</SelectItem>
                  <SelectItem value="Fashion" className="focus:bg-white/5 focus:text-white">Fashion</SelectItem>
                  <SelectItem value="Gaming" className="focus:bg-white/5 focus:text-white">Gaming</SelectItem>
                  <SelectItem value="Education" className="focus:bg-white/5 focus:text-white">Education</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Min followers */}
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-400">Min Followers</Label>
              <Input
                type="number"
                placeholder="e.g. 50000"
                value={minFollowers}
                onChange={(e) => setMinFollowers(e.target.value)}
                className="h-9 text-sm bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-[#C9A84C]"
              />
            </div>

            {/* Min engagement */}
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-400">Min Engagement Rate (%)</Label>
              <Input
                type="number"
                step="0.1"
                placeholder="e.g. 3.5"
                value={minEngagement}
                onChange={(e) => setMinEngagement(e.target.value)}
                className="h-9 text-sm bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-[#C9A84C]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Button
              className="h-9 px-5 text-sm font-bold bg-[#C9A84C] hover:bg-[#b0913b] text-slate-950"
              style={{ border: 'none' }}
            >
              Search
            </Button>
            <Button
              variant="outline"
              className="h-9 px-4 text-sm gap-1.5 border-white/10 text-gray-300 hover:bg-white/5 hover:text-white bg-transparent"
              onClick={handleReset}
            >
              <RotateCcw size={13} /> Reset Filters
            </Button>
            <span className="ml-auto text-xs text-gray-400">
              {filtered.length} creator{filtered.length !== 1 ? 's' : ''} found
            </span>
          </div>
        </CardContent>
      </Card>

      {/* ── Creator grid ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Users size={40} className="mb-3 opacity-40" />
          <p className="text-sm font-medium">No creators match your filters.</p>
          <p className="text-xs mt-1">Try adjusting or resetting the filters above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Creator card                                                          */
/* ------------------------------------------------------------------ */
function CreatorCard({ creator }: { creator: Creator }) {
  return (
    <Card
      className="border-0 shadow-sm transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(240, 235, 224, 0.08)',
        borderRadius: 14,
      }}
    >
      <CardContent className="p-4 flex flex-col gap-3">
        {/* Avatar + name */}
        <div className="flex items-start gap-3">
          <div
            className="flex items-center justify-center w-11 h-11 rounded-full text-sm font-bold text-white shrink-0 border border-white/10 bg-white/10"
          >
            {getInitials(creator.name)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm leading-tight text-white font-bricolage">
              {creator.name}
            </div>
            <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-400">
              <MapPin size={10} />
              {creator.location}
            </div>
            <div className="text-xs text-gray-550 mt-0.5">
              {creator.languages.join(' · ')}
            </div>
          </div>
          <Badge
            className="text-xs px-2 py-0.5 shrink-0 bg-white/5 text-gray-300 border border-white/5"
          >
            {creator.niche}
          </Badge>
        </div>

        {/* Platform badges */}
        <div className="flex flex-wrap gap-1.5">
          {creator.platforms.map((p) => (
            <span
              key={p.name}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border border-white/5"
              style={{
                background: PLATFORM_STYLE[p.name].bg,
                color: PLATFORM_STYLE[p.name].color,
              }}
            >
              {PLATFORM_ICON[p.name]}
              {p.name} {p.followers}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/10">
          <div className="text-center">
            <div className="flex items-center justify-center gap-0.5 text-gray-500 mb-0.5">
              <Users size={10} />
              <span className="text-[10px]">Reach</span>
            </div>
            <div className="text-xs font-bold text-white font-bricolage">
              {creator.platforms[0].followers}
            </div>
          </div>
          <div className="text-center border-x border-white/10">
            <div className="flex items-center justify-center gap-0.5 text-gray-500 mb-0.5">
              <TrendingUp size={10} />
              <span className="text-[10px]">Eng.</span>
            </div>
            <div className="text-xs font-bold text-[#C9A84C] font-bricolage">
              {creator.engagementRate}%
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-0.5 text-gray-500 mb-0.5">
              <Star size={10} />
              <span className="text-[10px]">Trust</span>
            </div>
            <TrustPill score={creator.trustIndex} />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-1">
          <Button
            variant="outline"
            className="flex-1 h-8 text-xs gap-1 border-white/10 text-gray-300 hover:bg-white/5 hover:text-white bg-transparent"
          >
            <Eye size={12} /> View Profile
          </Button>
          <Button
            className="flex-1 h-8 text-xs gap-1 font-bold bg-[#C9A84C] hover:bg-[#b0913b] text-slate-950"
            style={{ border: 'none' }}
          >
            <Send size={12} /> Invite
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
