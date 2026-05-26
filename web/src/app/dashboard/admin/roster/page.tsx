'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Users,
  Megaphone,
  ClipboardList,
  Eye,
  Ban,
  MessageSquare,
  Lock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
const INDIGO = '#080D26';
const BG = '#F8F7F4';

type StatusType = 'Active' | 'Onboarding' | 'Suspended';

interface Creator {
  id: string;
  name: string;
  email: string;
  platforms: string[];
  followers: string;
  trustIndex: number;
  status: StatusType;
  joined: string;
}

const STATUS_CONFIG: Record<StatusType, { bg: string; color: string }> = {
  Active: { bg: 'rgba(34,197,94,0.15)', color: '#34d399' },
  Onboarding: { bg: 'rgba(201,168,76,0.15)', color: '#C9A84C' },
  Suspended: { bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
};

/* ------------------------------------------------------------------ */
/* Sub-components                                                         */
/* ------------------------------------------------------------------ */

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <Card
      className="border-0 shadow-sm"
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(240, 235, 224, 0.08)',
      }}
    >
      <CardContent className="flex items-center gap-4 py-4 px-5">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0 border border-[#C9A84C]/15"
          style={{ background: 'rgba(201,168,76,0.10)' }}
        >
          <Icon size={18} style={{ color: GOLD }} />
        </div>
        <div>
          <div
            className="text-xl font-bold text-white font-bricolage"
          >
            {value}
          </div>
          <div className="text-xs text-gray-400">
            {label}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TrustBar({ score }: { score: number }) {
  const color = score >= 80 ? '#34d399' : score >= 60 ? GOLD : '#f87171';
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
      <span className="text-xs font-semibold tabular-nums" style={{ color }}>
        {score}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                  */
/* ------------------------------------------------------------------ */

export default function RosterPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchRoster = async () => {
    try {
      const res = await apiFetch('/api/admin/applications?type=roster&chapter=Kozhikode');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setCreators(data.creators || []);
        }
      }
    } catch (err) {
      console.error('Failed to fetch roster:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoster();
  }, []);

  const handleToggleSuspend = async (id: string) => {
    try {
      const res = await apiFetch('/api/admin/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_suspend', id }),
      });
      if (res.ok) {
        fetchRoster();
      }
    } catch (err) {
      console.error('Failed to toggle suspend:', err);
    }
  };

  const filtered = creators.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1
              className="text-2xl font-bold tracking-tight text-white font-bricolage"
            >
              My Chapter — Kozhikode
            </h1>
            <Badge
              className="text-xs px-2.5 py-1 font-semibold flex items-center gap-1.5 bg-red-500/10 border-red-500/20 text-red-400"
            >
              <Lock size={10} />
              Restricted to your chapter only
            </Badge>
          </div>
          <p className="text-sm mt-1 text-gray-400">
            Isolated chapter management console — Kozhikode, Kerala
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Users} label="Total Creators" value={creators.length} />
        <StatCard icon={Megaphone} label="Active Campaigns" value="8" />
        <StatCard icon={ClipboardList} label="Suspended Accounts" value={creators.filter(c => c.status === 'Suspended').length} />
      </div>

      {/* Table card */}
      <Card
        className="border-0 shadow-sm"
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(240, 235, 224, 0.08)',
        }}
      >
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-sm font-semibold text-white font-bricolage">
              Creator Roster
            </CardTitle>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <Input
                  placeholder="Search creator or email…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-8 text-sm w-56 bg-white/5 border-white/10 text-white focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]"
                />
              </div>
              {/* Status filter */}
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? '')}>
                <SelectTrigger
                  size="sm"
                  className="w-36 text-xs bg-white/5 border-white/10 text-white"
                >
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent className="bg-[#080D26] border-white/10 text-[#F0EBE0]">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Onboarding">Onboarding</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader className="border-white/5">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="pl-6 text-xs text-gray-400">Name</TableHead>
                <TableHead className="text-xs text-gray-400">Email</TableHead>
                <TableHead className="text-xs text-gray-400">Platforms</TableHead>
                <TableHead className="text-xs text-right text-gray-400">Followers</TableHead>
                <TableHead className="text-xs text-gray-400">Trust Index</TableHead>
                <TableHead className="text-xs text-gray-400">Status</TableHead>
                <TableHead className="text-xs text-gray-400">Joined</TableHead>
                <TableHead className="text-xs pr-6 text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableCell colSpan={8} className="text-center py-10 text-sm text-gray-500">
                    Loading roster...
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableCell colSpan={8} className="text-center py-10 text-sm text-gray-500">
                    No creators match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((creator) => {
                  const sc = STATUS_CONFIG[creator.status] || STATUS_CONFIG.Active;
                  return (
                    <TableRow
                      key={creator.id}
                      className="border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border border-[#C9A84C]/25"
                            style={{
                              background: 'rgba(201,168,76,0.15)',
                              color: GOLD,
                            }}
                          >
                            {creator.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)}
                          </div>
                          <span className="text-sm font-semibold text-white">
                            {creator.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-gray-400">
                          {creator.email}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {creator.platforms.map((p) => (
                            <Badge
                              key={p}
                              className="text-xs px-1.5 bg-white/5 text-gray-300 border-0"
                            >
                              {p}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-sm font-medium text-[#F0EBE0]">
                          {creator.followers}
                        </span>
                      </TableCell>
                      <TableCell>
                        <TrustBar score={creator.trustIndex} />
                      </TableCell>
                      <TableCell>
                        <Badge
                          className="text-xs font-semibold"
                          style={{ background: sc.bg, color: sc.color, border: 'none' }}
                        >
                          {creator.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-gray-400">
                          {creator.joined}
                        </span>
                      </TableCell>
                      <TableCell className="pr-6">
                        <div className="flex items-center gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-xs gap-1 border-white/10 text-gray-300 hover:bg-white/5 hover:text-white bg-transparent"
                          >
                            <Eye size={12} />
                            Profile
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleSuspend(creator.id)}
                            className={`h-7 px-2 text-xs gap-1 bg-transparent hover:text-white ${
                              creator.status === 'Suspended'
                                ? 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                                : 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                            }`}
                          >
                            <Ban size={12} />
                            {creator.status === 'Suspended' ? 'Activate' : 'Suspend'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-xs gap-1 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 hover:text-white bg-transparent"
                          >
                            <MessageSquare size={12} />
                            Msg
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          <div
            className="flex items-center justify-between px-6 py-3 text-xs text-gray-500"
            style={{
              borderTop: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <span>
              Showing {filtered.length} of {creators.length} creators
            </span>
            <span>Chapter RLS enforced — only Kozhikode data visible</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
