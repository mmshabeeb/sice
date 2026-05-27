'use client';

import { useState, useEffect } from 'react';
import {
  MapPin,
  Building,
  CheckCircle2,
  Users,
  Info,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { apiFetch } from '@/utils/api';

const GOLD = '#C9A84C';

interface ChapterItem {
  id: string;
  name: string;
  city: string;
  state: string;
  creatorsCount: number;
  description: string;
  status: 'active' | 'inception';
}

const DEFAULT_DESCRIPTIONS: Record<string, string> = {
  'kozhikode': 'The founding chapter. Anchors the Malabar creator community and serves as the SICE operational base.',
  'kochi': 'Centering central Kerala\'s media and fashion content creators, with regular local brand integrations.',
  'bangalore-east': 'Tech and professional creators hub, bridging regional language publishing with tech startups.',
  'chennai-central': 'Tamil arts, entertainment, and culinary creators networking hub with active workspace meetups.',
  'hyderabad-gachibowli': 'Telugu cinema, gaming, and design creators community currently in local development phase.',
  'mumbai-colaba': 'SICE diaspora chapter connecting regional language publishers with central agency stakeholders.',
};

const CHAPTERS_DIRECTORY: ChapterItem[] = [
  {
    id: 'kozhikode',
    name: 'Kozhikode Chapter',
    city: 'Calicut',
    state: 'Kerala',
    creatorsCount: 52,
    description: 'The founding chapter. Anchors the Malabar creator community and serves as the SICE operational base.',
    status: 'active',
  },
  {
    id: 'kochi',
    name: 'Kochi Chapter',
    city: 'Kochi',
    state: 'Kerala',
    creatorsCount: 38,
    description: 'Centering central Kerala\'s media and fashion content creators, with regular local brand integrations.',
    status: 'active',
  },
  {
    id: 'bangalore-east',
    name: 'Bangalore East',
    city: 'Bengaluru',
    state: 'Karnataka',
    creatorsCount: 29,
    description: 'Tech and professional creators hub, bridging regional language publishing with tech startups.',
    status: 'active',
  },
  {
    id: 'chennai-central',
    name: 'Chennai Central',
    city: 'Chennai',
    state: 'Tamil Nadu',
    creatorsCount: 18,
    description: 'Tamil arts, entertainment, and culinary creators networking hub with active workspace meetups.',
    status: 'active',
  },
  {
    id: 'hyderabad-gachibowli',
    name: 'Hyderabad Gachibowli',
    city: 'Hyderabad',
    state: 'Telangana',
    creatorsCount: 10,
    description: 'Telugu cinema, gaming, and design creators community currently in local development phase.',
    status: 'inception',
  },
  {
    id: 'mumbai-colaba',
    name: 'Mumbai Colaba',
    city: 'Mumbai',
    state: 'Maharashtra',
    creatorsCount: 6,
    description: 'SICE diaspora chapter connecting regional language publishers with central agency stakeholders.',
    status: 'active',
  },
];

export default function CreatorChaptersPage() {
  const [chapters, setChapters] = useState<ChapterItem[]>([]);
  const [joinedChapters, setJoinedChapters] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load selections from localStorage and chapters from API
  useEffect(() => {
    async function loadData() {
      // 1. Load joined chapters
      try {
        const saved = localStorage.getItem('sice-joined-chapters');
        if (saved) {
          setJoinedChapters(JSON.parse(saved));
        }
      } catch (e) {
        console.error('Failed to load joined chapters', e);
      }
      setLoaded(true);

      // 2. Load active chapters from Firestore API
      try {
        const res = await apiFetch('/api/admin/applications?type=chapters');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.chapters) {
            const list = data.chapters
              .filter((ch: any) => ch.status === 'active')
              .map((ch: any) => {
                const cleanId = ch.id.toLowerCase();
                return {
                  id: ch.id,
                  name: ch.name,
                  city: ch.city,
                  state: ch.state,
                  creatorsCount: ch.creatorsCount || 0,
                  description: DEFAULT_DESCRIPTIONS[cleanId] || 'Regional SICE chapter supporting regional language content publishers and brand campaign integrations.',
                  status: ch.status,
                };
              });
            setChapters(list);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.error('Failed to fetch chapters from API:', e);
      }
      // Fallback
      setChapters(CHAPTERS_DIRECTORY.filter(ch => ch.status === 'active'));
      setLoading(false);
    }
    
    loadData();
  }, []);

  // Save selection helper
  const toggleChapter = (id: string) => {
    const nextJoined = joinedChapters.includes(id)
      ? joinedChapters.filter((cid) => cid !== id)
      : [...joinedChapters, id];
    
    setJoinedChapters(nextJoined);
    try {
      localStorage.setItem('sice-joined-chapters', JSON.stringify(nextJoined));
    } catch (e) {
      console.error('Failed to save joined chapters', e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-bricolage">
            SICE Regional Chapters
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Join local chapters to gain access to regional meetups, workshops, and location-targeted campaigns.
          </p>
        </div>
        
        {loaded && (
          <Badge
            variant="outline"
            className="border-amber-500/30 text-amber-400 bg-amber-500/5 px-3 py-1.5 text-xs font-semibold"
          >
            {joinedChapters.length} Chapter{joinedChapters.length !== 1 ? 's' : ''} Joined
          </Badge>
        )}
      </div>

      {/* Info Alert */}
      <div
        className="flex items-start gap-3 px-4 py-3.5 rounded-xl text-xs border border-[#C9A84C]/30 bg-[#C9A84C]/10"
        style={{ color: GOLD }}
      >
        <Info size={14} className="mt-0.5 shrink-0 text-[#C9A84C]" />
        <div className="space-y-1">
          <p className="font-semibold">Multi-Chapter Jurisdictions Allowed</p>
          <p className="text-gray-400">
            SICE supports regional mobility. You are allowed to participate in and receive deal streams for multiple chapters if you produce content or split operations across those cities.
          </p>
        </div>
      </div>

      {/* Chapters grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-gray-500 text-sm">
            Loading chapters...
          </div>
        ) : chapters.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500 text-sm">
            No regional chapters found.
          </div>
        ) : (
          chapters.map((ch) => {
            const isJoined = joinedChapters.includes(ch.id);
            return (
            <Card
              key={ch.id}
              className={`border-0 transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                isJoined ? 'ring-1 ring-[#C9A84C]/50 translate-y-[-2px]' : ''
              }`}
              style={{
                background: isJoined ? 'rgba(201, 168, 76, 0.04)' : 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(240, 235, 224, 0.08)',
                borderRadius: 14,
              }}
            >
              {/* Card top gradient indicator for joined chapters */}
              {isJoined && (
                <div 
                  className="absolute top-0 left-0 w-full h-[3px]"
                  style={{ background: `linear-gradient(to right, ${GOLD}, #b0913b)` }}
                />
              )}

              <CardContent className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  {/* Status & icon header */}
                  <div className="flex items-center justify-between">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center border"
                      style={{
                        background: isJoined ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.03)',
                        borderColor: isJoined ? 'rgba(201,168,76,0.3)' : 'rgba(240,235,224,0.08)',
                      }}
                    >
                      <Building size={14} style={{ color: isJoined ? GOLD : '#cbd5e1' }} />
                    </div>
                    
                    <div className="flex gap-1.5 items-center">
                      <Badge
                        variant="secondary"
                        className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                          ch.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                        }`}
                      >
                        {ch.status.toUpperCase()}
                      </Badge>

                      {isJoined && (
                        <Badge
                          variant="secondary"
                          className="text-[9px] font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 flex items-center gap-0.5"
                        >
                          <CheckCircle2 size={8} /> MEMBER
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Title & location */}
                  <div>
                    <h3 className="font-semibold text-base text-[#F0EBE0] font-bricolage">
                      {ch.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                      <MapPin size={11} className="text-gray-500" />
                      <span>{ch.city}, {ch.state}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-400 leading-relaxed pt-1">
                    {ch.description}
                  </p>
                </div>

                {/* Card footer metrics & button */}
                <div className="pt-4 border-t border-white/5 space-y-3.5 mt-4">
                  <div className="flex justify-between text-[11px] text-gray-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Users size={11} /> {ch.creatorsCount} Creators
                    </span>
                    <span>SICE jurisdiction</span>
                  </div>

                  <Button
                    onClick={() => toggleChapter(ch.id)}
                    className={`w-full h-8 text-xs font-bold transition-all duration-200 ${
                      isJoined 
                        ? 'border border-red-500/20 text-red-400 bg-transparent hover:bg-red-950/20 hover:text-red-300' 
                        : 'bg-[#C9A84C] hover:bg-[#b0913b] text-slate-950'
                    }`}
                    style={isJoined ? {} : { border: 'none' }}
                  >
                    {isJoined ? 'Leave Chapter' : 'Join Chapter'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
      </div>
    </div>
  );
}
