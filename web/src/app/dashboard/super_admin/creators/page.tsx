'use client';

import { useEffect, useState } from 'react';
import { Users, Search, Globe, Star, MapPin, Award, Ban, UserCheck, Loader2, X, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const GOLD = '#C9A84C';

interface Creator {
  uid: string;
  name: string;
  niche: string;
  primaryPlatform: string;
  totalFollowers: number;
  engagementRate: number;
  trustScore: number;
  chapterId: string | null;
  status: string;
  languages: string[];
}

const CHAPTERS_LIST = ['All Chapters', 'Kozhikode', 'Kochi', 'Bangalore East', 'Chennai Central', 'Hyderabad Gachibowli', 'Mumbai Colaba'];

function formatFollowers(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export default function SuperAdminCreators() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [chapterFilter, setChapterFilter] = useState('All Chapters');
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [selectedCreatorUid, setSelectedCreatorUid] = useState<string | null>(null);

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

  const filtered = creators.filter((cr) => {
    const matchesSearch = cr.name.toLowerCase().includes(search.toLowerCase()) || cr.niche.toLowerCase().includes(search.toLowerCase());
    const matchesChapter = chapterFilter === 'All Chapters' || cr.chapterId === chapterFilter;
    return matchesSearch && matchesChapter;
  });

  const toggleVerification = (uid: string) =>
    setCreators((prev) => prev.map((cr) => cr.uid !== uid ? cr : { ...cr, status: cr.status === 'verified' ? 'pending' : 'verified' }));

  const toggleSuspend = (uid: string) =>
    setCreators((prev) => prev.map((cr) => cr.uid !== uid ? cr : { ...cr, status: cr.status === 'suspended' ? 'pending' : 'suspended' }));

  const changeChapter = (chapter: string) => {
    if (!selectedCreatorUid) return;
    setCreators((prev) => prev.map((cr) => cr.uid === selectedCreatorUid ? { ...cr, chapterId: chapter } : cr));
    setIsChapterModalOpen(false);
    setSelectedCreatorUid(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white font-bricolage">Creator Directory &amp; Compliance</h1>
        <p className="text-sm text-gray-400">Verify digital credentials, audit engagement trust indices, and adjust regional assignments.</p>
      </div>

      {error && (
        <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-4 py-3">{error}</div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-3 text-gray-500" size={16} />
          <input type="text" placeholder="Search creator name or niche..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50 transition-colors" />
        </div>
        <select value={chapterFilter} onChange={(e) => setChapterFilter(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50 transition-colors cursor-pointer" style={{ colorScheme: 'dark' }}>
          {CHAPTERS_LIST.map((ch) => <option key={ch} value={ch} style={{ background: '#080D26' }}>{ch}</option>)}
        </select>
      </div>

      <Card className="border-0" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(240,235,224,0.08)' }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-white font-bricolage">Verified Talent Pool ({loading ? '…' : filtered.length})</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-400">
              <Loader2 size={20} className="animate-spin mr-2" /> Loading creators…
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow style={{ borderColor: 'rgba(240,235,224,0.06)' }}>
                    <TableHead className="pl-6 text-gray-400 text-xs">Creator Profile</TableHead>
                    <TableHead className="text-gray-400 text-xs">Reach &amp; Platform</TableHead>
                    <TableHead className="text-gray-400 text-xs text-center">Trust Index</TableHead>
                    <TableHead className="text-gray-400 text-xs">Chapter</TableHead>
                    <TableHead className="text-gray-400 text-xs text-center">Status</TableHead>
                    <TableHead className="pr-6 text-gray-400 text-xs text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={6} className="text-center py-12 text-gray-500 text-sm">
                        {creators.length === 0 ? 'No creators registered yet.' : 'No creators match your filters.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((cr) => {
                      const scoreColor = cr.trustScore >= 85 ? 'text-emerald-400' : cr.trustScore >= 70 ? 'text-amber-400' : 'text-rose-400';
                      return (
                        <TableRow key={cr.uid} style={{ borderColor: 'rgba(240,235,224,0.04)' }} className="hover:bg-white/[0.01] transition-colors">
                          <TableCell className="pl-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold text-xs" style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)', color: GOLD }}>
                                {cr.name.split(' ').map((n) => n[0]).join('')}
                              </div>
                              <div>
                                <span className="font-semibold text-sm text-[#F0EBE0] font-bricolage block">{cr.name}</span>
                                <span className="text-[10px] text-gray-400">{cr.niche}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-200 font-bold font-mono">{formatFollowers(cr.totalFollowers)} Followers</span>
                              <span className="text-[10px] text-gray-500 flex items-center gap-1.5 mt-0.5"><Globe size={10} />{cr.primaryPlatform} (Eng: {cr.engagementRate.toFixed(1)}%)</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="inline-flex flex-col items-center">
                              <span className={`text-sm font-bold font-mono ${scoreColor}`}>{cr.trustScore}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5 text-xs text-gray-300"><MapPin size={11} style={{ color: GOLD }} /><span>{cr.chapterId ?? 'Unassigned'}</span></div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary" className={`text-[9px] font-bold px-2 py-0.5 rounded ${cr.status === 'verified' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : cr.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                              {cr.status.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="pr-6 text-right py-4">
                            <div className="flex items-center justify-end gap-3 text-xs">
                              <button onClick={() => { setSelectedCreatorUid(cr.uid); setIsChapterModalOpen(true); }} className="text-gray-400 hover:text-[#C9A84C] hover:underline">Transfer</button>
                              <button onClick={() => toggleSuspend(cr.uid)} className={`p-1.5 rounded-lg border transition-all ${cr.status === 'suspended' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20'}`} title={cr.status === 'suspended' ? 'Re-activate' : 'Suspend'}>
                                {cr.status === 'suspended' ? <UserCheck size={14} /> : <Ban size={14} />}
                              </button>
                              <button onClick={() => toggleVerification(cr.uid)} className={`p-1.5 rounded-lg border transition-all ${cr.status === 'verified' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20' : 'bg-[#C9A84C]/10 border-[#C9A84C]/20 text-[#C9A84C] hover:bg-[#C9A84C]/20'}`} title={cr.status === 'verified' ? 'Revoke' : 'Verify'}>
                                <Award size={14} />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {isChapterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl p-6 space-y-6" style={{ background: '#080D26', border: '1px solid rgba(240,235,224,0.15)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}>
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white font-bricolage">Transfer Creator Chapter</h3>
              <button onClick={() => setIsChapterModalOpen(false)} className="text-gray-400 hover:text-white transition-colors"><X size={18} /></button>
            </div>
            <p className="text-xs text-gray-400">Select a new local jurisdiction for this creator.</p>
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
              {CHAPTERS_LIST.filter((ch) => ch !== 'All Chapters').map((ch) => (
                <button key={ch} onClick={() => changeChapter(ch)} className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-colors text-left">
                  <span className="text-xs text-gray-200">{ch}</span>
                  <Check size={14} className="text-[#C9A84C] opacity-60" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
