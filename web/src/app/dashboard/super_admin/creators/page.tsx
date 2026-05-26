'use client';

import { useState, useEffect } from 'react';
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
  Plus,
  UserPlus,
  Lock,
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
import { apiFetch } from '@/utils/api';

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
  email?: string;
  location?: string;
  bio?: string;
  contact_number?: string;
  whatsapp_number?: string;
  niches?: string[];
  instagram_url?: string;
  instagram_followers?: string;
  x_url?: string;
  x_followers?: string;
  youtube_url?: string;
  youtube_followers?: string;
  facebook_url?: string;
  facebook_followers?: string;
  linkedin_url?: string;
  linkedin_followers?: string;
  auth_uid?: string | null;
}

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
  const [creators, setCreators] = useState<CreatorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [chapterFilter, setChapterFilter] = useState('All Chapters');
  
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [selectedCreatorUid, setSelectedCreatorUid] = useState<string | null>(null);

  // View & Manage Creator modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewCreator, setViewCreator] = useState<CreatorItem | null>(null);
  
  // Manage tabs: 'details' | 'edit' | 'security'
  const [activeManageTab, setActiveManageTab] = useState<'details' | 'edit' | 'security'>('details');

  // Edit Creator profile form states
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    location: '',
    bio: '',
    contactNumber: '',
    whatsappNumber: '',
    niches: '',
    instagramUrl: '',
    instagramFollowers: '',
    xUrl: '',
    xFollowers: '',
    youtubeUrl: '',
    youtubeFollowers: '',
    facebookUrl: '',
    facebookFollowers: '',
    linkedinUrl: '',
    linkedinFollowers: '',
    trustIndex: 88,
    engagementRate: '4.2%'
  });
  
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Security password reset states
  const [newPassword, setNewPassword] = useState('');
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
  const [passwordResetError, setPasswordResetError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Create Creator modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    full_name: '',
    email: '',
    password: '',
    instagram_url: '',
    instagram_followers: '',
    niche: '',
    chapter: 'Kozhikode',
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const handleCreateCreator = async () => {
    if (!createForm.full_name || !createForm.email || !createForm.password) return;
    if (createForm.password.length < 6) {
      setCreateError('Password must be at least 6 characters');
      return;
    }
    setCreateLoading(true);
    setCreateError(null);
    try {
      const res = await apiFetch('/api/admin/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_creator',
          ...createForm,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsCreateModalOpen(false);
        setCreateForm({ full_name: '', email: '', password: '', instagram_url: '', instagram_followers: '', niche: '', chapter: 'Kozhikode' });
        setCreateError(null);
        fetchCreators();
      } else {
        setCreateError(data.error || 'Failed to create creator');
      }
    } catch (err) {
      console.error('Failed to create creator:', err);
      setCreateError('Network error. Please try again.');
    } finally {
      setCreateLoading(false);
    }
  };

  const [dynamicChapters, setDynamicChapters] = useState<string[]>([]);

  const fetchChapters = async () => {
    try {
      const res = await apiFetch('/api/admin/applications?type=chapters');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.chapters) {
          const names = data.chapters.map((ch: any) => ch.name);
          setDynamicChapters(names);
          return;
        }
      }
    } catch (err) {
      console.error('Failed to fetch chapters:', err);
    }
    // Fallback
    setDynamicChapters(CHAPTERS_LIST.filter((ch) => ch !== 'All Chapters'));
  };

  const fetchCreators = async () => {
    try {
      const res = await apiFetch('/api/admin/applications?type=super_admin');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setCreators(data.creators || []);
        }
      }
    } catch (err) {
      console.error('Failed to fetch creators:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreators();
    fetchChapters();
  }, []);

  // Filtered roster
  const filteredCreators = creators.filter((cr) => {
    const matchesSearch = cr.name.toLowerCase().includes(search.toLowerCase()) || 
                          cr.niche.toLowerCase().includes(search.toLowerCase());
    const matchesChapter = chapterFilter === 'All Chapters' || cr.chapter === chapterFilter;
    return matchesSearch && matchesChapter;
  });

  // Toggle Verification on Backend
  const toggleVerification = async (uid: string) => {
    try {
      const res = await apiFetch('/api/admin/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_verify', id: uid }),
      });
      if (res.ok) {
        fetchCreators();
      }
    } catch (err) {
      console.error('Failed to toggle verification:', err);
    }
  };

  // Toggle Suspend on Backend
  const toggleSuspend = async (uid: string) => {
    try {
      const res = await apiFetch('/api/admin/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_suspend', id: uid }),
      });
      if (res.ok) {
        fetchCreators();
      }
    } catch (err) {
      console.error('Failed to toggle suspend:', err);
    }
  };

  // Open chapter transfer modal
  const openChapterTransfer = (uid: string) => {
    setSelectedCreatorUid(uid);
    setIsChapterModalOpen(true);
  };

  // Change chapter on Backend
  const changeChapter = async (chapter: string) => {
    if (!selectedCreatorUid) return;
    try {
      const res = await apiFetch('/api/admin/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'transfer_chapter', id: selectedCreatorUid, chapter }),
      });
      if (res.ok) {
        fetchCreators();
        setIsChapterModalOpen(false);
        setSelectedCreatorUid(null);
      }
    } catch (err) {
      console.error('Failed to transfer chapter:', err);
    }
  };

  const handleOpenViewCreator = (creator: CreatorItem) => {
    setViewCreator(creator);
    setEditForm({
      name: creator.name || '',
      email: creator.email || '',
      location: creator.location || '',
      bio: creator.bio || '',
      contactNumber: creator.contact_number || '',
      whatsappNumber: creator.whatsapp_number || '',
      niches: creator.niches ? creator.niches.join(', ') : creator.niche || '',
      instagramUrl: creator.instagram_url || '',
      instagramFollowers: creator.instagram_followers || '',
      xUrl: creator.x_url || '',
      xFollowers: creator.x_followers || '',
      youtubeUrl: creator.youtube_url || '',
      youtubeFollowers: creator.youtube_followers || '',
      facebookUrl: creator.facebook_url || '',
      facebookFollowers: creator.facebook_followers || '',
      linkedinUrl: creator.linkedin_url || '',
      linkedinFollowers: creator.linkedin_followers || '',
      trustIndex: creator.trustScore || 88,
      engagementRate: creator.engagement || '4.2%'
    });
    setNewPassword('');
    setPasswordResetSuccess(false);
    setPasswordResetError(null);
    setEditError(null);
    setActiveManageTab('details');
    setIsViewModalOpen(true);
  };

  const handleUpdateCreatorProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewCreator) return;
    setEditLoading(true);
    setEditError(null);

    const nichesArray = editForm.niches.split(',').map(s => s.trim()).filter(Boolean);

    try {
      const res = await apiFetch('/api/admin/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_details',
          id: viewCreator.uid,
          name: editForm.name,
          email: editForm.email,
          location: editForm.location,
          bio: editForm.bio,
          contactNumber: editForm.contactNumber,
          whatsappNumber: editForm.whatsappNumber,
          niches: nichesArray,
          instagramUrl: editForm.instagramUrl,
          instagramFollowers: editForm.instagramFollowers,
          xUrl: editForm.xUrl,
          xFollowers: editForm.xFollowers,
          youtubeUrl: editForm.youtubeUrl,
          youtubeFollowers: editForm.youtubeFollowers,
          facebookUrl: editForm.facebookUrl,
          facebookFollowers: editForm.facebookFollowers,
          linkedinUrl: editForm.linkedinUrl,
          linkedinFollowers: editForm.linkedinFollowers,
          trustIndex: editForm.trustIndex,
          engagementRate: editForm.engagementRate
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Refresh the list
        await fetchCreators();
        
        // Find and update currently viewCreator state to show updated values in modal
        setViewCreator({
          ...viewCreator,
          name: editForm.name,
          email: editForm.email,
          location: editForm.location,
          bio: editForm.bio,
          contact_number: editForm.contactNumber,
          whatsapp_number: editForm.whatsappNumber,
          niches: nichesArray,
          niche: nichesArray.join(', '),
          instagram_url: editForm.instagramUrl,
          instagram_followers: editForm.instagramFollowers,
          x_url: editForm.xUrl,
          x_followers: editForm.xFollowers,
          youtube_url: editForm.youtubeUrl,
          youtube_followers: editForm.youtubeFollowers,
          facebook_url: editForm.facebookUrl,
          facebook_followers: editForm.facebookFollowers,
          linkedin_url: editForm.linkedinUrl,
          linkedin_followers: editForm.linkedinFollowers,
          trustScore: Number(editForm.trustIndex),
          engagement: editForm.engagementRate
        });
        
        setActiveManageTab('details');
      } else {
        setEditError(data.error || 'Failed to update profile details.');
      }
    } catch (err) {
      console.error(err);
      setEditError('An unexpected error occurred.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewCreator || !newPassword) return;
    if (newPassword.length < 6) {
      setPasswordResetError('Password must be at least 6 characters.');
      return;
    }

    setFormLoading(true);
    setPasswordResetError(null);
    setPasswordResetSuccess(false);

    try {
      const res = await apiFetch('/api/admin/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reset_creator_password',
          id: viewCreator.uid,
          newPassword
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPasswordResetSuccess(true);
        setNewPassword('');
      } else {
        setPasswordResetError(data.error || 'Failed to reset password.');
      }
    } catch (err) {
      console.error(err);
      setPasswordResetError('An unexpected error occurred.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-bricolage">
            Creator Directory & Compliance
          </h1>
          <p className="text-sm text-gray-400">
            Verify digital credentials, audit engagement trust indices, and adjust regional assignments.
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all"
          style={{
            background: 'linear-gradient(135deg, #C9A84C 0%, #a88a3a 100%)',
            color: '#080D26',
            boxShadow: '0 2px 12px rgba(201, 168, 76, 0.25)',
          }}
        >
          <UserPlus size={14} />
          Create Creator
        </button>
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
            {['All Chapters', ...dynamicChapters].map((chap) => (
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
                {loading ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={6} className="text-center py-12 text-gray-500 text-sm">
                      Loading creator talent pool...
                    </TableCell>
                  </TableRow>
                ) : filteredCreators.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={6} className="text-center py-12 text-gray-500 text-sm">
                      No creators found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCreators.map((cr) => {
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
                              onClick={() => handleOpenViewCreator(cr)}
                              className="text-[#C9A84C] hover:underline font-semibold"
                            >
                              View
                            </button>

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
                  })
                )}
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
                {dynamicChapters.map((ch) => (
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

      {/* CREATE CREATOR MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div
            className="w-full max-w-md rounded-2xl border-0 p-6 space-y-5"
            style={{
              background: '#080D26',
              border: '1px solid rgba(240, 235, 224, 0.15)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-xl"
                  style={{
                    background: 'rgba(201, 168, 76, 0.10)',
                    border: '1px solid rgba(201, 168, 76, 0.20)',
                  }}
                >
                  <UserPlus size={16} style={{ color: GOLD }} />
                </div>
                <h3 className="text-base font-bold text-white font-bricolage">
                  Create New Creator
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-400">
              Manually onboard a creator to the platform. They will be added as a verified creator immediately.
            </p>

            <div className="space-y-3">
              {/* Full Name */}
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Full Name *</label>
                <input
                  type="text"
                  value={createForm.full_name}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="e.g. Shabeeb Muhammed"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50 transition-colors placeholder:text-gray-600"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Email Address *</label>
                <input
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="e.g. creator@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50 transition-colors placeholder:text-gray-600"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Login Password *</label>
                <input
                  type="password"
                  value={createForm.password}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Min 6 characters"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50 transition-colors placeholder:text-gray-600"
                />
              </div>

              {/* Error message */}
              {createError && (
                <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
                  {createError}
                </div>
              )}

              {/* Instagram URL */}
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Instagram URL</label>
                <input
                  type="url"
                  value={createForm.instagram_url}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, instagram_url: e.target.value }))}
                  placeholder="e.g. https://instagram.com/username"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50 transition-colors placeholder:text-gray-600"
                />
              </div>

              {/* Followers + Niche row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Followers</label>
                  <input
                    type="text"
                    value={createForm.instagram_followers}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, instagram_followers: e.target.value }))}
                    placeholder="e.g. 10K"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50 transition-colors placeholder:text-gray-600"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Niche</label>
                  <input
                    type="text"
                    value={createForm.niche}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, niche: e.target.value }))}
                    placeholder="e.g. Food, Travel"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50 transition-colors placeholder:text-gray-600"
                  />
                </div>
              </div>

              {/* Chapter */}
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Assign Chapter</label>
                <select
                  value={createForm.chapter}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, chapter: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50 transition-colors cursor-pointer"
                  style={{ colorScheme: 'dark' }}
                >
                  {dynamicChapters.map((ch) => (
                    <option key={ch} value={ch} style={{ background: '#080D26' }}>
                      {ch}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-medium text-gray-400 border border-white/10 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCreator}
                disabled={createLoading || !createForm.full_name || !createForm.email || !createForm.password}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #C9A84C 0%, #a88a3a 100%)',
                  color: '#080D26',
                }}
              >
                {createLoading ? (
                  <span className="animate-pulse">Creating...</span>
                ) : (
                  <>
                    <Plus size={14} />
                    Create Creator
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* VIEW & MANAGE CREATOR MODAL */}
      {isViewModalOpen && viewCreator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div
            className="w-full max-w-2xl rounded-2xl border-0 p-6 space-y-5 my-8 animate-in fade-in zoom-in-95 duration-200"
            style={{
              background: '#080D26',
              border: '1px solid rgba(240, 235, 224, 0.15)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                  style={{
                    background: 'rgba(201,168,76,0.12)',
                    border: '1px solid rgba(201,168,76,0.25)',
                    color: GOLD,
                  }}
                >
                  {viewCreator.name ? viewCreator.name.split(' ').map((n) => n[0]).join('') : '??'}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-bricolage flex items-center gap-2">
                    {viewCreator.name}
                    <span className="text-[10px] font-mono text-gray-500 font-normal">({viewCreator.uid})</span>
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400">{viewCreator.email || 'No email'}</span>
                    <span className="text-gray-600">•</span>
                    <span className="text-xs text-gray-400 capitalize">{viewCreator.chapter} Chapter</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-white/10 gap-4">
              <button
                type="button"
                onClick={() => setActiveManageTab('details')}
                className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
                  activeManageTab === 'details'
                    ? 'border-[#C9A84C] text-[#C9A84C]'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                Profile Details
              </button>
              <button
                type="button"
                onClick={() => setActiveManageTab('edit')}
                className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
                  activeManageTab === 'edit'
                    ? 'border-[#C9A84C] text-[#C9A84C]'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                Edit Info
              </button>
              <button
                type="button"
                onClick={() => setActiveManageTab('security')}
                className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
                  activeManageTab === 'security'
                    ? 'border-[#C9A84C] text-[#C9A84C]'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                Security & Password
              </button>
            </div>

            {/* TAB CONTENT: DETAILS */}
            {activeManageTab === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-gray-300 max-h-96 overflow-y-auto pr-1">
                {/* General Stats */}
                <div className="space-y-3 bg-white/[0.01] border border-white/5 rounded-xl p-4">
                  <h4 className="text-[10px] uppercase font-bold text-[#C9A84C] tracking-widest border-b border-white/5 pb-1">
                    Compliance & Overview
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-gray-500 block text-[9px] uppercase tracking-wider">Niche(s)</span>
                      <span className="font-semibold text-white">{viewCreator.niche || 'General'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[9px] uppercase tracking-wider">Location</span>
                      <span className="font-semibold text-white">{viewCreator.location || 'Kerala, India'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[9px] uppercase tracking-wider">Reach</span>
                      <span className="font-semibold text-white font-mono">{viewCreator.followers} Followers</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[9px] uppercase tracking-wider">Engagement Rate</span>
                      <span className="font-semibold text-white font-mono">{viewCreator.engagement}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[9px] uppercase tracking-wider">Trust Index</span>
                      <span className="font-semibold text-white font-mono">{viewCreator.trustScore}%</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[9px] uppercase tracking-wider">Status</span>
                      <span className="font-semibold capitalize text-emerald-400">{viewCreator.status}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-3 bg-white/[0.01] border border-white/5 rounded-xl p-4">
                  <h4 className="text-[10px] uppercase font-bold text-[#C9A84C] tracking-widest border-b border-white/5 pb-1">
                    Contact Details
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-500 block text-[9px] uppercase tracking-wider">Email</span>
                      <span className="font-semibold text-white font-mono">{viewCreator.email || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[9px] uppercase tracking-wider">Contact Number</span>
                      <span className="font-semibold text-white font-mono">{viewCreator.contact_number || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[9px] uppercase tracking-wider">WhatsApp Number</span>
                      <span className="font-semibold text-white font-mono">{viewCreator.whatsapp_number || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Social Handles */}
                <div className="space-y-3 bg-white/[0.01] border border-white/5 rounded-xl p-4 md:col-span-2">
                  <h4 className="text-[10px] uppercase font-bold text-[#C9A84C] tracking-widest border-b border-white/5 pb-1">
                    Social Accounts & Links
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <span className="text-gray-500 block text-[9px] uppercase tracking-wider font-semibold">Instagram</span>
                      {viewCreator.instagram_url ? (
                        <a href={viewCreator.instagram_url} target="_blank" rel="noreferrer" className="text-amber-400 hover:underline break-all">
                          {viewCreator.instagram_url}
                        </a>
                      ) : <span className="text-gray-600">Not linked</span>}
                      {viewCreator.instagram_followers && <span className="text-[10px] text-gray-500 block mt-0.5">Followers: {viewCreator.instagram_followers}</span>}
                    </div>

                    <div>
                      <span className="text-gray-500 block text-[9px] uppercase tracking-wider font-semibold">X (Twitter)</span>
                      {viewCreator.x_url ? (
                        <a href={viewCreator.x_url} target="_blank" rel="noreferrer" className="text-amber-400 hover:underline break-all">
                          {viewCreator.x_url}
                        </a>
                      ) : <span className="text-gray-600">Not linked</span>}
                      {viewCreator.x_followers && <span className="text-[10px] text-gray-500 block mt-0.5">Followers: {viewCreator.x_followers}</span>}
                    </div>

                    <div>
                      <span className="text-gray-500 block text-[9px] uppercase tracking-wider font-semibold">YouTube</span>
                      {viewCreator.youtube_url ? (
                        <a href={viewCreator.youtube_url} target="_blank" rel="noreferrer" className="text-amber-400 hover:underline break-all">
                          {viewCreator.youtube_url}
                        </a>
                      ) : <span className="text-gray-600">Not linked</span>}
                      {viewCreator.youtube_followers && <span className="text-[10px] text-gray-500 block mt-0.5">Subscribers: {viewCreator.youtube_followers}</span>}
                    </div>

                    <div>
                      <span className="text-gray-500 block text-[9px] uppercase tracking-wider font-semibold">LinkedIn</span>
                      {viewCreator.linkedin_url ? (
                        <a href={viewCreator.linkedin_url} target="_blank" rel="noreferrer" className="text-amber-400 hover:underline break-all">
                          {viewCreator.linkedin_url}
                        </a>
                      ) : <span className="text-gray-600">Not linked</span>}
                      {viewCreator.linkedin_followers && <span className="text-[10px] text-gray-500 block mt-0.5">Connections: {viewCreator.linkedin_followers}</span>}
                    </div>

                    <div>
                      <span className="text-gray-500 block text-[9px] uppercase tracking-wider font-semibold">Facebook</span>
                      {viewCreator.facebook_url ? (
                        <a href={viewCreator.facebook_url} target="_blank" rel="noreferrer" className="text-amber-400 hover:underline break-all">
                          {viewCreator.facebook_url}
                        </a>
                      ) : <span className="text-gray-600">Not linked</span>}
                      {viewCreator.facebook_followers && <span className="text-[10px] text-gray-500 block mt-0.5">Followers: {viewCreator.facebook_followers}</span>}
                    </div>
                  </div>
                </div>

                {/* Statement of Purpose / Bio */}
                <div className="space-y-2 bg-white/[0.01] border border-white/5 rounded-xl p-4 md:col-span-2">
                  <h4 className="text-[10px] uppercase font-bold text-[#C9A84C] tracking-widest border-b border-white/5 pb-1">
                    Creator Biography / Bio
                  </h4>
                  <p className="text-gray-300 leading-relaxed italic">
                    "{viewCreator.bio || 'No biography details provided.'}"
                  </p>
                </div>
              </div>
            )}

            {/* TAB CONTENT: EDIT INFO */}
            {activeManageTab === 'edit' && (
              <form onSubmit={handleUpdateCreatorProfile} className="space-y-4 max-h-96 overflow-y-auto pr-1">
                {editError && (
                  <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-xl flex items-center gap-2">
                    <AlertCircle size={14} />
                    {editError}
                  </div>
                )}

                {/* Core Profile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Contact Number</label>
                    <input
                      type="text"
                      value={editForm.contactNumber}
                      onChange={(e) => setEditForm(prev => ({ ...prev, contactNumber: e.target.value }))}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">WhatsApp Number</label>
                    <input
                      type="text"
                      value={editForm.whatsappNumber}
                      onChange={(e) => setEditForm(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Niche(s) (Comma separated)</label>
                    <input
                      type="text"
                      value={editForm.niches}
                      onChange={(e) => setEditForm(prev => ({ ...prev, niches: e.target.value }))}
                      placeholder="e.g. Food, Tech, Fashion"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Location</label>
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g. Calicut, Kerala"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Trust Score (%)</label>
                    <input
                      type="number"
                      max={100}
                      value={editForm.trustIndex}
                      onChange={(e) => setEditForm(prev => ({ ...prev, trustIndex: Number(e.target.value) }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Engagement Rate</label>
                    <input
                      type="text"
                      value={editForm.engagementRate}
                      onChange={(e) => setEditForm(prev => ({ ...prev, engagementRate: e.target.value }))}
                      placeholder="e.g. 4.2%"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                </div>

                {/* Bio / statement_of_purpose */}
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Creator Bio</label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    placeholder="Short description of the creator..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50 resize-none text-xs"
                  />
                </div>

                {/* Social links URL & Followers */}
                <h4 className="text-[10px] uppercase font-bold text-[#C9A84C] tracking-widest border-b border-white/5 pb-1 pt-2">
                  Social Channels
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Instagram */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-0.5 block">Instagram URL</label>
                    <input
                      type="url"
                      value={editForm.instagramUrl}
                      onChange={(e) => setEditForm(prev => ({ ...prev, instagramUrl: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-0.5 block">Instagram Followers</label>
                    <input
                      type="text"
                      value={editForm.instagramFollowers}
                      onChange={(e) => setEditForm(prev => ({ ...prev, instagramFollowers: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>

                  {/* X */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-0.5 block">X (Twitter) URL</label>
                    <input
                      type="url"
                      value={editForm.xUrl}
                      onChange={(e) => setEditForm(prev => ({ ...prev, xUrl: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-0.5 block">X Followers</label>
                    <input
                      type="text"
                      value={editForm.xFollowers}
                      onChange={(e) => setEditForm(prev => ({ ...prev, xFollowers: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>

                  {/* YouTube */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-0.5 block">YouTube Channel URL</label>
                    <input
                      type="url"
                      value={editForm.youtubeUrl}
                      onChange={(e) => setEditForm(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-0.5 block">YouTube Subscribers</label>
                    <input
                      type="text"
                      value={editForm.youtubeFollowers}
                      onChange={(e) => setEditForm(prev => ({ ...prev, youtubeFollowers: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>

                  {/* LinkedIn */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-0.5 block">LinkedIn URL</label>
                    <input
                      type="url"
                      value={editForm.linkedinUrl}
                      onChange={(e) => setEditForm(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-0.5 block">LinkedIn Connections</label>
                    <input
                      type="text"
                      value={editForm.linkedinFollowers}
                      onChange={(e) => setEditForm(prev => ({ ...prev, linkedinFollowers: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveManageTab('details')}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 border border-white/10 hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="px-4 py-2 rounded-xl text-xs font-semibold disabled:opacity-50 transition-transform active:scale-[0.98]"
                    style={{ background: GOLD, color: '#080D26' }}
                  >
                    {editLoading ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            )}

            {/* TAB CONTENT: SECURITY & PASSWORD */}
            {activeManageTab === 'security' && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                {passwordResetSuccess && (
                  <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2.5 rounded-xl flex items-center gap-2">
                    <Check size={14} />
                    Password reset successfully. The creator can now log in with the new credentials.
                  </div>
                )}

                {passwordResetError && (
                  <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2.5 rounded-xl flex items-center gap-2">
                    <AlertCircle size={14} />
                    {passwordResetError}
                  </div>
                )}

                <p className="text-xs text-gray-400">
                  You can set a new login credentials password for this creator's SICE system account.
                </p>

                <div className="flex flex-col gap-1.5 max-w-sm">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">New Login Password *</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      required
                      placeholder="Min 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setActiveManageTab('details')}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading || !newPassword}
                    className="px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-50 transition-transform active:scale-[0.98]"
                    style={{ background: GOLD, color: '#080D26' }}
                  >
                    {formLoading ? 'Resetting...' : 'Change Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
