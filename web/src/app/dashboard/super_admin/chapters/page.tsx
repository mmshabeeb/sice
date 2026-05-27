'use client';

import { useState } from 'react';
import {
  Map,
  Plus,
  ToggleLeft,
  ToggleRight,
  User,
  MapPin,
  X,
  Check,
  AlertCircle,
  Building,
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

interface ChapterItem {
  id: string;
  name: string;
  city: string;
  state: string;
  creatorsCount: number;
  adminName: string | null;
  status: 'active' | 'inactive';
}

const INITIAL_CHAPTERS: ChapterItem[] = [];

const AVAILABLE_ADMINS = [
  'Fathima Noor',
  'Arjun Menon',
  'Suresh Kumar',
  'Thomas Mathew',
  'Rahul Mehta',
  'Priya Nair',
  'Anjali Sharma',
];

import { useEffect } from 'react';

export default function SuperAdminChapters() {
  const [chapters, setChapters] = useState<ChapterItem[]>(INITIAL_CHAPTERS);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);

  // New chapter form state
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [adminName, setAdminName] = useState('');

  const fetchChapters = async () => {
    try {
      const res = await fetch('/api/admin/applications?type=chapters');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setChapters(data.chapters || []);
        }
      }
    } catch (err) {
      console.error('Failed to fetch chapters:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  // Toggle chapter status
  const toggleStatus = async (id: string) => {
    try {
      const res = await fetch('/api/admin/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_chapter_status', id }),
      });
      if (res.ok) {
        fetchChapters();
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  // Open assign admin modal
  const openAssignAdmin = (id: string) => {
    setSelectedChapterId(id);
    setIsAdminModalOpen(true);
  };

  // Assign admin
  const assignAdmin = async (admin: string | null) => {
    if (!selectedChapterId) return;
    try {
      const res = await fetch('/api/admin/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'assign_chapter_admin', id: selectedChapterId, adminName: admin }),
      });
      if (res.ok) {
        fetchChapters();
        setIsAdminModalOpen(false);
        setSelectedChapterId(null);
      }
    } catch (err) {
      console.error('Failed to assign admin:', err);
    }
  };

  // Create chapter
  const handleCreateChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !city || !state) return;

    try {
      const res = await fetch('/api/admin/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_chapter', name, city, state, adminName: adminName || null }),
      });
      if (res.ok) {
        fetchChapters();
        setIsModalOpen(false);
        // Reset form
        setName('');
        setCity('');
        setState('');
        setAdminName('');
      }
    } catch (err) {
      console.error('Failed to create chapter:', err);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-bricolage">
            Chapter Governance
          </h1>
          <p className="text-sm text-gray-400">
            Define local chapter jurisdictions, assign regional directors, and review performance metrics.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all text-xs"
          style={{
            background: GOLD,
            color: '#080D26',
            boxShadow: '0 4px 12px rgba(201,168,76,0.15)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          <Plus size={15} />
          Create Chapter
        </button>
      </div>

      {/* Chapters Table */}
      <Card
        className="border-0"
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(240, 235, 224, 0.08)',
        }}
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-white font-bricolage">
            Active Jurisdictions ({chapters.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow style={{ borderColor: 'rgba(240,235,224,0.06)' }}>
                  <TableHead className="pl-6 text-gray-400 text-xs">Chapter Name</TableHead>
                  <TableHead className="text-gray-400 text-xs">City & State</TableHead>
                  <TableHead className="text-gray-400 text-xs text-center">Creators</TableHead>
                  <TableHead className="text-gray-400 text-xs">Chapter Admin</TableHead>
                  <TableHead className="text-gray-400 text-xs text-center">Status</TableHead>
                  <TableHead className="pr-6 text-gray-400 text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={6} className="text-center py-12 text-gray-500 text-sm">
                      Loading chapters...
                    </TableCell>
                  </TableRow>
                ) : chapters.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={6} className="text-center py-12 text-gray-500 text-sm">
                      No chapters registered yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  chapters.map((ch) => (
                    <TableRow
                      key={ch.id}
                      style={{ borderColor: 'rgba(240,235,224,0.04)' }}
                      className="hover:bg-white/[0.01] transition-colors"
                    >
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                            style={{
                              background: 'rgba(201,168,76,0.06)',
                              border: '1px solid rgba(201,168,76,0.15)',
                            }}
                          >
                            <Building size={14} style={{ color: GOLD }} />
                          </div>
                          <div>
                            <span className="font-semibold text-sm text-[#F0EBE0] font-bricolage block">
                              {ch.name}
                            </span>
                            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-mono">
                              ID: {ch.id}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-gray-300">
                          {ch.city}, {ch.state}
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-semibold text-sm text-[#F0EBE0] font-mono">
                        {ch.creatorsCount}
                      </TableCell>
                      <TableCell>
                        {ch.adminName ? (
                          <div className="flex items-center gap-2 text-xs text-gray-200">
                            <User size={12} style={{ color: GOLD }} />
                            <span>{ch.adminName}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-rose-400/80 italic flex items-center gap-1.5">
                            <AlertCircle size={12} />
                            Unassigned
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="secondary"
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            ch.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                          }`}
                        >
                          {ch.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-6 text-right py-4">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => openAssignAdmin(ch.id)}
                            className="text-xs font-medium hover:underline text-gray-400 hover:text-[#C9A84C]"
                          >
                            Assign Admin
                          </button>
                          <button
                            onClick={() => toggleStatus(ch.id)}
                            className="flex items-center transition-opacity"
                            title={ch.status === 'active' ? 'Suspend Chapter' : 'Activate Chapter'}
                          >
                            {ch.status === 'active' ? (
                              <ToggleRight size={24} className="text-emerald-500 cursor-pointer" />
                            ) : (
                              <ToggleLeft size={24} className="text-gray-600 cursor-pointer" />
                            )}
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* CREATE CHAPTER DIALOG (MODAL) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div
            className="w-full max-w-md rounded-2xl border-0 p-6 space-y-6"
            style={{
              background: '#080D26',
              border: '1px solid rgba(240, 235, 224, 0.15)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white font-bricolage">
                Create New Jurisdiction
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateChapter} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Chapter Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kozhikode East"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Calicut"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kerala"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Initial Director / Admin
                </label>
                <select
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors cursor-pointer"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="" style={{ background: '#080D26' }}>
                    Leave Unassigned
                  </option>
                  {AVAILABLE_ADMINS.map((adm) => (
                    <option key={adm} value={adm} style={{ background: '#080D26' }}>
                      {adm}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold"
                  style={{ background: GOLD, color: '#080D26' }}
                >
                  Create Jurisdiction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN ADMIN DIALOG (MODAL) */}
      {isAdminModalOpen && (
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
                Assign Chapter Director
              </h3>
              <button
                onClick={() => setIsAdminModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-gray-400">
                Select an administrator to assign as the official regional representative.
              </p>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => assignAdmin(null)}
                  className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-colors text-left"
                >
                  <span className="text-xs text-rose-400 font-medium">Remove / Unassign Director</span>
                  <X size={14} className="text-rose-400" />
                </button>

                {AVAILABLE_ADMINS.map((adm) => (
                  <button
                    key={adm}
                    onClick={() => assignAdmin(adm)}
                    className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-colors text-left"
                  >
                    <span className="text-xs text-gray-200">{adm}</span>
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
