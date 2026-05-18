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
    score >= 80 ? '#16a34a' : score >= 60 ? '#d97706' : '#dc2626';
  const bg =
    score >= 80
      ? 'rgba(22,163,74,0.10)'
      : score >= 60
      ? 'rgba(217,119,6,0.10)'
      : 'rgba(220,38,38,0.10)';
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
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
  IG: { bg: 'rgba(225,48,108,0.08)', color: '#e1306c' },
  YT: { bg: 'rgba(255,0,0,0.08)', color: '#ff0000' },
  X: { bg: 'rgba(0,0,0,0.06)', color: '#14171a' },
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
    <div style={{ background: BG, minHeight: '100%' }} className="p-6 space-y-6">
      {/* ── Page title ── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: INDIGO }}>
          Talent Discovery
        </h1>
        <p className="text-sm mt-1 text-gray-500">
          Find the right creators for your campaign — filtered by language, chapter, niche, and performance signals.
        </p>
      </div>

      {/* ── Psychographic banner ── */}
      <div
        className="flex items-start gap-3 px-4 py-3 rounded-xl text-xs"
        style={{
          background: 'rgba(201,168,76,0.08)',
          border: '1px solid rgba(201,168,76,0.22)',
          color: '#92702a',
        }}
      >
        <Info size={14} className="mt-0.5 shrink-0" style={{ color: GOLD }} />
        <span>
          <strong>Sorted by Audience Engagement Velocity</strong> · Follower count is a secondary signal. High engagement rate with a smaller, loyal audience outperforms inflated follower counts.
        </span>
      </div>

      {/* ── Filter bar ── */}
      <Card className="border-0 shadow-sm" style={{ background: '#fff', borderRadius: 14 }}>
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-2 mb-3">
            <SlidersHorizontal size={15} style={{ color: GOLD }} />
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Filters
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 items-end">
            {/* Language chapter */}
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500">Language Chapter</Label>
              <Select value={langFilter} onValueChange={(v) => setLangFilter(v ?? "")}>
                <SelectTrigger className="w-full h-9 text-sm">
                  <SelectValue placeholder="All Languages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  <SelectItem value="Malayalam">Malayalam</SelectItem>
                  <SelectItem value="Tamil">Tamil</SelectItem>
                  <SelectItem value="Telugu">Telugu</SelectItem>
                  <SelectItem value="Kannada">Kannada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location chapter */}
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500">Location Chapter</Label>
              <Select value={locationFilter} onValueChange={(v) => setLocationFilter(v ?? "")}>
                <SelectTrigger className="w-full h-9 text-sm">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Kozhikode">Kozhikode</SelectItem>
                  <SelectItem value="Kochi">Kochi</SelectItem>
                  <SelectItem value="Bangalore">Bangalore</SelectItem>
                  <SelectItem value="Chennai">Chennai</SelectItem>
                  <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Niche */}
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500">Niche</Label>
              <Select value={nicheFilter} onValueChange={(v) => setNicheFilter(v ?? "")}>
                <SelectTrigger className="w-full h-9 text-sm">
                  <SelectValue placeholder="All Niches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Niches</SelectItem>
                  <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                  <SelectItem value="Tech">Tech</SelectItem>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Fashion">Fashion</SelectItem>
                  <SelectItem value="Gaming">Gaming</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Min followers */}
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500">Min Followers</Label>
              <Input
                type="number"
                placeholder="e.g. 50000"
                value={minFollowers}
                onChange={(e) => setMinFollowers(e.target.value)}
                className="h-9 text-sm"
              />
            </div>

            {/* Min engagement */}
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500">Min Engagement Rate (%)</Label>
              <Input
                type="number"
                step="0.1"
                placeholder="e.g. 3.5"
                value={minEngagement}
                onChange={(e) => setMinEngagement(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Button
              className="h-9 px-5 text-sm font-semibold"
              style={{ background: GOLD, color: INDIGO, border: 'none' }}
            >
              Search
            </Button>
            <Button
              variant="outline"
              className="h-9 px-4 text-sm gap-1.5"
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
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
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
      className="border-0 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: '#fff', borderRadius: 14 }}
    >
      <CardContent className="p-4 flex flex-col gap-3">
        {/* Avatar + name */}
        <div className="flex items-start gap-3">
          <div
            className="flex items-center justify-center w-11 h-11 rounded-full text-sm font-bold text-white shrink-0"
            style={{ background: INDIGO }}
          >
            {getInitials(creator.name)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm leading-tight" style={{ color: INDIGO }}>
              {creator.name}
            </div>
            <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-500">
              <MapPin size={10} />
              {creator.location}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              {creator.languages.join(' · ')}
            </div>
          </div>
          <Badge
            className="text-xs px-2 py-0.5 shrink-0"
            style={{
              background: 'rgba(8,13,38,0.06)',
              color: INDIGO,
              border: 'none',
            }}
          >
            {creator.niche}
          </Badge>
        </div>

        {/* Platform badges */}
        <div className="flex flex-wrap gap-1.5">
          {creator.platforms.map((p) => (
            <span
              key={p.name}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium"
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
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-gray-100">
          <div className="text-center">
            <div className="flex items-center justify-center gap-0.5 text-gray-400 mb-0.5">
              <Users size={10} />
              <span className="text-[10px]">Reach</span>
            </div>
            <div className="text-xs font-semibold" style={{ color: INDIGO }}>
              {creator.platforms[0].followers}
            </div>
          </div>
          <div className="text-center border-x border-gray-100">
            <div className="flex items-center justify-center gap-0.5 text-gray-400 mb-0.5">
              <TrendingUp size={10} />
              <span className="text-[10px]">Eng.</span>
            </div>
            <div className="text-xs font-semibold" style={{ color: GOLD }}>
              {creator.engagementRate}%
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-0.5 text-gray-400 mb-0.5">
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
            className="flex-1 h-8 text-xs gap-1"
            style={{ borderColor: INDIGO, color: INDIGO }}
          >
            <Eye size={12} /> View Profile
          </Button>
          <Button
            className="flex-1 h-8 text-xs gap-1 font-semibold"
            style={{ background: GOLD, color: INDIGO, border: 'none' }}
          >
            <Send size={12} /> Invite
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
