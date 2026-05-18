'use client';

import { useState } from 'react';
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

/* ------------------------------------------------------------------ */
/* Constants                                                             */
/* ------------------------------------------------------------------ */

const GOLD = '#C9A84C';
const INDIGO = '#080D26';
const BG = '#F8F7F4';

type StatusType = 'Active' | 'Onboarding' | 'Suspended';

/* ------------------------------------------------------------------ */
/* Mock data                                                             */
/* ------------------------------------------------------------------ */

interface Creator {
  id: number;
  name: string;
  email: string;
  platforms: string[];
  followers: string;
  trustIndex: number;
  status: StatusType;
  joined: string;
}

const CREATORS: Creator[] = [
  {
    id: 1,
    name: 'Arjun Menon',
    email: 'arjun@gmail.com',
    platforms: ['Instagram', 'YouTube'],
    followers: '2,84,500',
    trustIndex: 91,
    status: 'Active',
    joined: 'Jan 10, 2026',
  },
  {
    id: 2,
    name: 'Meera Pillai',
    email: 'meera@gmail.com',
    platforms: ['Instagram'],
    followers: '1,42,000',
    trustIndex: 87,
    status: 'Active',
    joined: 'Jan 22, 2026',
  },
  {
    id: 3,
    name: 'Rahul Suresh',
    email: 'rahul@gmail.com',
    platforms: ['YouTube'],
    followers: '98,200',
    trustIndex: 83,
    status: 'Active',
    joined: 'Feb 5, 2026',
  },
  {
    id: 4,
    name: 'Nisha Krishnan',
    email: 'nisha@gmail.com',
    platforms: ['Instagram', 'X'],
    followers: '67,400',
    trustIndex: 79,
    status: 'Active',
    joined: 'Feb 18, 2026',
  },
  {
    id: 5,
    name: 'Fathima Noor',
    email: 'fathima@gmail.com',
    platforms: ['Instagram'],
    followers: '32,100',
    trustIndex: 64,
    status: 'Onboarding',
    joined: 'May 15, 2026',
  },
  {
    id: 6,
    name: 'Vishnu Ramachandran',
    email: 'vishnu@gmail.com',
    platforms: ['YouTube', 'Instagram'],
    followers: '1,12,800',
    trustIndex: 88,
    status: 'Active',
    joined: 'Mar 3, 2026',
  },
  {
    id: 7,
    name: 'Ananya Bose',
    email: 'ananya@gmail.com',
    platforms: ['Instagram'],
    followers: '44,600',
    trustIndex: 45,
    status: 'Suspended',
    joined: 'Jan 30, 2026',
  },
  {
    id: 8,
    name: 'Mohammed Irfan',
    email: 'irfan@gmail.com',
    platforms: ['YouTube'],
    followers: '28,900',
    trustIndex: 71,
    status: 'Onboarding',
    joined: 'May 10, 2026',
  },
];

const STATUS_CONFIG: Record<StatusType, { bg: string; color: string }> = {
  Active: { bg: 'rgba(34,197,94,0.12)', color: '#16a34a' },
  Onboarding: { bg: 'rgba(201,168,76,0.15)', color: '#C9A84C' },
  Suspended: { bg: 'rgba(239,68,68,0.10)', color: '#dc2626' },
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
    <Card className="border-0 shadow-sm" style={{ background: '#fff', borderRadius: 14 }}>
      <CardContent className="flex items-center gap-4 py-4 px-5">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
          style={{ background: 'rgba(201,168,76,0.10)' }}
        >
          <Icon size={18} style={{ color: GOLD }} />
        </div>
        <div>
          <div
            className="text-xl font-bold"
            style={{ color: INDIGO, fontFamily: 'var(--font-bricolage, sans-serif)' }}
          >
            {value}
          </div>
          <div className="text-xs" style={{ color: '#9ca3af' }}>
            {label}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TrustBar({ score }: { score: number }) {
  const color = score >= 80 ? '#22c55e' : score >= 60 ? GOLD : '#ef4444';
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
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
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = CREATORS.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ background: BG, minHeight: '100%' }} className="p-6 rounded-xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ color: INDIGO, fontFamily: 'var(--font-bricolage, sans-serif)' }}
            >
              My Chapter — Kozhikode
            </h1>
            <Badge
              className="text-xs px-2.5 py-1 font-semibold flex items-center gap-1.5"
              style={{
                background: 'rgba(239,68,68,0.08)',
                color: '#dc2626',
                border: '1px solid rgba(239,68,68,0.20)',
              }}
            >
              <Lock size={10} />
              Restricted to your chapter only
            </Badge>
          </div>
          <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
            Isolated chapter management console — Kozhikode, Kerala
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Users} label="Total Creators" value="52" />
        <StatCard icon={Megaphone} label="Active Campaigns" value="8" />
        <StatCard icon={ClipboardList} label="Pending Reviews" value="3" />
      </div>

      {/* Table card */}
      <Card className="border-0 shadow-sm" style={{ background: '#fff', borderRadius: 14 }}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-sm font-semibold" style={{ color: INDIGO }}>
              Creator Roster
            </CardTitle>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2"
                  style={{ color: '#9ca3af' }}
                />
                <Input
                  placeholder="Search creator or email…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-8 text-sm w-56"
                  style={{ border: '1px solid rgba(8,13,38,0.12)', borderRadius: 8 }}
                />
              </div>
              {/* Status filter */}
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? '')}>
                <SelectTrigger
                  size="sm"
                  className="w-36 text-xs"
                  style={{ border: '1px solid rgba(8,13,38,0.12)', borderRadius: 8 }}
                >
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
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
            <TableHeader>
              <TableRow style={{ borderColor: 'rgba(8,13,38,0.06)' }}>
                <TableHead className="pl-6 text-xs" style={{ color: '#9ca3af' }}>Name</TableHead>
                <TableHead className="text-xs" style={{ color: '#9ca3af' }}>Email</TableHead>
                <TableHead className="text-xs" style={{ color: '#9ca3af' }}>Platforms</TableHead>
                <TableHead className="text-xs text-right" style={{ color: '#9ca3af' }}>Followers</TableHead>
                <TableHead className="text-xs" style={{ color: '#9ca3af' }}>Trust Index</TableHead>
                <TableHead className="text-xs" style={{ color: '#9ca3af' }}>Status</TableHead>
                <TableHead className="text-xs" style={{ color: '#9ca3af' }}>Joined</TableHead>
                <TableHead className="text-xs pr-6" style={{ color: '#9ca3af' }}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-sm" style={{ color: '#9ca3af' }}>
                    No creators match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((creator) => {
                  const sc = STATUS_CONFIG[creator.status];
                  return (
                    <TableRow
                      key={creator.id}
                      style={{ borderColor: 'rgba(8,13,38,0.04)' }}
                      className="hover:bg-amber-50/30 transition-colors"
                    >
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                            style={{
                              background: 'rgba(201,168,76,0.12)',
                              color: GOLD,
                            }}
                          >
                            {creator.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)}
                          </div>
                          <span className="text-sm font-semibold" style={{ color: INDIGO }}>
                            {creator.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs" style={{ color: '#6b7280' }}>
                          {creator.email}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {creator.platforms.map((p) => (
                            <Badge
                              key={p}
                              className="text-xs px-1.5"
                              style={{
                                background: 'rgba(8,13,38,0.06)',
                                color: INDIGO,
                                border: 'none',
                              }}
                            >
                              {p}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-sm font-medium" style={{ color: INDIGO }}>
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
                        <span className="text-xs" style={{ color: '#6b7280' }}>
                          {creator.joined}
                        </span>
                      </TableCell>
                      <TableCell className="pr-6">
                        <div className="flex items-center gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-xs gap-1"
                            style={{
                              border: '1px solid rgba(8,13,38,0.15)',
                              color: INDIGO,
                              borderRadius: 7,
                            }}
                          >
                            <Eye size={12} />
                            Profile
                          </Button>
                          {creator.status !== 'Suspended' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-xs gap-1"
                              style={{
                                border: '1px solid rgba(239,68,68,0.25)',
                                color: '#dc2626',
                                borderRadius: 7,
                              }}
                            >
                              <Ban size={12} />
                              Suspend
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-xs gap-1"
                            style={{
                              border: '1px solid rgba(99,102,241,0.25)',
                              color: '#6366f1',
                              borderRadius: 7,
                            }}
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
            className="flex items-center justify-between px-6 py-3 text-xs"
            style={{
              borderTop: '1px solid rgba(8,13,38,0.06)',
              color: '#9ca3af',
            }}
          >
            <span>
              Showing {filtered.length} of {CREATORS.length} creators
            </span>
            <span>Chapter RLS enforced — only Kozhikode data visible</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
