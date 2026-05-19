'use client';

import { useState } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  Ban,
  UserX,
  UserCheck,
  Globe,
  Star,
  MapPin,
  ChevronDown,
  Award,
  AlertCircle,
  X,
  Check,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

/* ------------------------------------------------------------------ */
/* Constants                                                             */
/* ------------------------------------------------------------------ */

const GOLD = '#C9A84C';

interface CreatorItem {
  uid: string;
  name: string;
  niche: string;
  platform: string;
  followers: string;
  engagement: string;
  trustScore: number;
  chapter: string;
  status: 'verified' | 'pending' | 'suspended';
}

const INITIAL_CREATORS: CreatorItem[] = [
  { uid: 'cr-1', name: 'Arjun Menon', niche: 'Tech & Lifestyle', platform: 'YouTube', followers: '145K', engagement: '4.8%', trustScore: 92, chapter: 'Kochi', status: 'verified' },
  { uid: 'cr-2', name: 'Fathima Noor', niche: 'Travel & Food', platform: 'Instagram', followers: '88K', engagement: '5.6%', trustScore: 89, chapter: 'Kozhikode', status: 'verified' },
  { uid: 'cr-3', name: 'Rohan Sharma', niche: 'Finance & Career', platform: 'LinkedIn', followers: '34K', engagement: '3.9%', trustScore: 78, chapter: 'Bangalore East', status: 'pending' },
  { uid: 'cr-4', name: 'Meera Pillai', niche: 'Fashion & Beauty', platform: 'Instagram', followers: '220K', engagement: '6.1%', trustScore: 95, chapter: 'Kozhikode', status: 'verified' },
  { uid: 'cr-5', name: 'Vikram Seth', niche: 'Photography', platform: 'Instagram', followers: '12K', engagement: '8.4%', trustScore: 64, chapter: 'Chennai Central', status: 'pending' },
  { uid: 'cr-6', name: 'Devika Nair', niche: 'Automotive & EVs', platform: 'YouTube', followers: '75K', engagement: '4.2%', trustScore: 82, chapter: 'Kochi', status: 'suspended' },
];

const CHAPTERS_LIST = [
  'All Chapters',
  'Kozhikode',
  'Kochi',
  'Bangalore East',
  'Chennai Central',
  'Hyderabad Gachibowli',
  'Mumbai Colaba',
];

export default function SuperAdminCreators() {
  const [creators, setCreators] = useState<CreatorItem[]>(INITIAL_CREATORS);
  const [search, setSearch] = useState('');
  const [chapterFilter, setChapterFilter] = useState('All Chapters');
  
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [selectedCreatorUid, setSelectedCreatorUid] = useState<string | null>(null);

  // Filtered roster
  const filteredCreators = creators.filter((cr) => {
    const matchesSearch = cr.name.toLowerCase().includes(search.toLowerCase()) || 
                          cr.niche.toLowerCase().includes(search.toLowerCase());
    const matchesChapter = chapterFilter === 'All Chapters' || cr.chapter === chapterFilter;
    return matchesSearch && matchesChapter;
  });

  // Toggle Verification
  const toggleVerification = (uid: string) => {
    setCreators(
      creators.map((cr) => {
        if (cr.uid !== uid) return cr;
        const newStatus = cr.status === 'verified' ? 'pending' : 'verified';
        return { ...cr, status: newStatus };
      })
    );
  };

  // Toggle Suspend
  const toggleSuspend = (uid: string) => {
    setCreators(
      creators.map((cr) => {
        if (cr.uid !== uid) return cr;
        const newStatus = cr.status === 'suspended' ? 'pending' : 'suspended';
        return { ...cr, status: newStatus };
      })
    );
  };

  // Open chapter transfer modal
  const openChapterTransfer = (uid: string) => {
    setSelectedCreatorUid(uid);
    setIsChapterModalOpen(true);
  };

  // Change chapter
  const changeChapter = (chapter: string) => {
    if (!selectedCreatorUid) return;
    setCreators(
      creators.map((cr) => (cr.uid === selectedCreatorUid ? { ...cr, chapter } : cr))
    );
    setIsChapterModalOpen(false);
    setSelectedCreatorUid(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white font-bricolage">
          Creator Directory & Compliance
        </h1>
        <p className="text-sm text-gray-400">
          Verify digital credentials, audit engagement trust indices, and adjust regional assignments.
        </p>
      </div>

      {/* Roster Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-3 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Search creator name or niche..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50 transition-colors"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <select
            value={chapterFilter}
            onChange={(e) => setChapterFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50 transition-colors cursor-pointer"
            style={{ colorScheme: 'dark' }}
          >
            {CHAPTERS_LIST.map((chap) => (
              <option key={chap} value={chap} style={{ background: '#080D26' }}>
                {chap}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Creators Table */}
      <Card
        className="border-0"
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(240, 235, 224, 0.08)',
        }}
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-white font-bricolage">
            Verified Talent Pool ({filteredCreators.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow style={{ borderColor: 'rgba(240,235,224,0.06)' }}>
                  <TableHead className="pl-6 text-gray-400 text-xs">Creator Profile</TableHead>
                  <TableHead className="text-gray-400 text-xs">Reach & Platform</TableHead>
                  <TableHead className="text-gray-400 text-xs text-center">Trust Index</TableHead>
                  <TableHead className="text-gray-400 text-xs">Jurisdiction</TableHead>
                  <TableHead className="text-gray-400 text-xs text-center">Compliance Status</TableHead>
                  <TableHead className="pr-6 text-gray-400 text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCreators.map((cr) => {
                  const scoreColor = cr.trustScore >= 85 ? 'text-emerald-400' : cr.trustScore >= 70 ? 'text-amber-400' : 'text-rose-400';
                  return (
                    <TableRow
                      key={cr.uid}
                      style={{ borderColor: 'rgba(240,235,224,0.04)' }}
                      className="hover:bg-white/[0.01] transition-colors"
                    >
                      {/* Avatar & Name */}
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold text-xs"
                            style={{
                              background: 'rgba(201,168,76,0.12)',
                              border: '1px solid rgba(201,168,76,0.25)',
                              color: GOLD,
                            }}
                          >
                            {cr.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div>
                            <span className="font-semibold text-sm text-[#F0EBE0] font-bricolage block">
                              {cr.name}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {cr.niche}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Reach & Platform */}
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-200 font-bold font-mono">
                            {cr.followers} Followers
                          </span>
                          <span className="text-[10px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                            <Globe size={10} />
                            {cr.platform} (Eng. Rate: {cr.engagement})
                          </span>
                        </div>
                      </TableCell>

                      {/* Trust index score */}
                      <TableCell className="text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className={`text-sm font-bold font-mono ${scoreColor}`}>
                            {cr.trustScore}%
                          </span>
                          <div className="flex gap-0.5 mt-0.5">
                            {[1, 2, 3].map((s) => (
                              <Star key={s} size={8} className="fill-amber-400 text-amber-400 shrink-0" />
                            ))}
                          </div>
                        </div>
                      </TableCell>

                      {/* Chapter */}
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs text-gray-300">
                          <MapPin size={11} style={{ color: GOLD }} />
                          <span>{cr.chapter}</span>
                        </div>
                      </TableCell>

                      {/* Compliance Status badge */}
                      <TableCell className="text-center">
                        <Badge
                          variant="secondary"
                          className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                            cr.status === 'verified'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : cr.status === 'pending'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {cr.status.toUpperCase()}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="pr-6 text-right py-4">
                        <div className="flex items-center justify-end gap-3 text-xs">
                          <button
                            onClick={() => openChapterTransfer(cr.uid)}
                            className="text-gray-400 hover:text-[#C9A84C] hover:underline"
                          >
                            Transfer Chapter
                          </button>
                          
                          {/* Toggle Suspend */}
                          <button
                            onClick={() => toggleSuspend(cr.uid)}
                            className={`p-1.5 rounded-lg border transition-all ${
                              cr.status === 'suspended'
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                                : 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20'
                            }`}
                            title={cr.status === 'suspended' ? 'Re-activate Account' : 'Suspend Account'}
                          >
                            {cr.status === 'suspended' ? <UserCheck size={14} /> : <Ban size={14} />}
                          </button>

                          {/* Verify Toggle */}
                          <button
                            onClick={() => toggleVerification(cr.uid)}
                            className={`p-1.5 rounded-lg border transition-all ${
                              cr.status === 'verified'
                                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                                : 'bg-[#C9A84C]/10 border-[#C9A84C]/20 text-[#C9A84C] hover:bg-[#C9A84C]/20'
                            }`}
                            title={cr.status === 'verified' ? 'Revoke Verification' : 'Verify Creator'}
                          >
                            <Award size={14} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* TRANSFER CHAPTER DIALOG (MODAL) */}
      {isChapterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div
            className="w-full max-w-sm rounded-2xl border-0 p-6 space-y-6"
            style={{
              background: '#080D26',
              border: '1px solid rgba(240, 235, 224, 0.15)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white font-bricolage">
                Transfer Creator Chapter
              </h3>
              <button
                onClick={() => setIsChapterModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-gray-400">
                Select a new local jurisdiction to handle operations and event roster placement for this creator.
              </p>

              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                {CHAPTERS_LIST.filter((ch) => ch !== 'All Chapters').map((ch) => (
                  <button
                    key={ch}
                    onClick={() => changeChapter(ch)}
                    className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-colors text-left"
                  >
                    <span className="text-xs text-gray-200">{ch}</span>
                    <Check size={14} className="text-[#C9A84C] opacity-60 hover:opacity-100" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
