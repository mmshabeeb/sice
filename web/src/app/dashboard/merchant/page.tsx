'use client';

import Link from 'next/link';
import {
  Megaphone,
  Users,
  Lock,
  CheckCircle2,
  PlusCircle,
  Search,
  Wallet,
  TrendingUp,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

/* ------------------------------------------------------------------ */
/* Brand tokens                                                          */
/* ------------------------------------------------------------------ */
const GOLD = '#C9A84C';
const INDIGO = '#080D26';
const BG = '#F8F7F4';

/* ------------------------------------------------------------------ */
/* Mock data                                                             */
/* ------------------------------------------------------------------ */

const STATS = [
  {
    label: 'Active Campaigns',
    value: '0',
    icon: Megaphone,
    sub: 'No active campaigns',
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.08)',
  },
  {
    label: 'Total Creators Engaged',
    value: '0',
    icon: Users,
    sub: '0 this month',
    color: '#0ea5e9',
    bg: 'rgba(14,165,233,0.08)',
  },
  {
    label: 'Securely Deposited',
    value: '₹0',
    icon: Lock,
    sub: 'No active deals',
    color: GOLD,
    bg: 'rgba(201,168,76,0.08)',
  },
  {
    label: 'Deals Completed',
    value: '0',
    icon: CheckCircle2,
    sub: '₹0 released',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.08)',
  },
];

const ACTIVITY: any[] = [];

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  approved: { bg: 'rgba(34,197,94,0.15)', color: '#4ade80', label: 'Content Approved' },
  review: { bg: 'rgba(99,102,241,0.15)', color: '#818cf8', label: 'In Review' },
  revision: { bg: 'rgba(251,191,36,0.15)', color: '#fbbf24', label: 'Revision Requested' },
  submitted: { bg: 'rgba(14,165,233,0.15)', color: '#38bdf8', label: 'Submitted' },
  active: { bg: 'rgba(201,168,76,0.15)', color: GOLD, label: 'Active' },
};

const QUICK_ACTIONS = [
  {
    label: 'Create Campaign',
    href: '/dashboard/merchant/campaigns',
    icon: PlusCircle,
    desc: 'Launch a new creator campaign',
  },
  {
    label: 'Browse Talent',
    href: '/dashboard/merchant/discover',
    icon: Search,
    desc: 'Discover creators by niche & location',
  },
  {
    label: 'View Wallet',
    href: '/dashboard/merchant/wallet',
    icon: Wallet,
    desc: 'Manage secure deposits & payments',
  },
];

/* ------------------------------------------------------------------ */
/* Page                                                                  */
/* ------------------------------------------------------------------ */

export default function MerchantOverviewPage() {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-8">
      {/* ── Welcome header ── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight text-white font-bricolage"
          >
            {greeting} 👋
          </h1>
          <p className="text-sm mt-1 text-gray-400">
            Here&apos;s your campaign overview for today.
          </p>
        </div>
        <Badge
          className="text-xs px-3 py-1 font-semibold border"
          style={{
            background: 'rgba(201,168,76,0.10)',
            color: GOLD,
            borderColor: 'rgba(201,168,76,0.28)',
          }}
        >
          Merchant Account
        </Badge>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map(({ label, value, icon: Icon, sub, color, bg }) => (
          <Card
            key={label}
            className="border-0 shadow-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(240, 235, 224, 0.08)',
              borderRadius: 14,
            }}
          >
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {label}
                </span>
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-xl border border-white/5"
                  style={{ background: bg }}
                >
                  <Icon size={18} style={{ color }} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-3xl font-bold font-bricolage" style={{ color }}>
                {value}
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                <TrendingUp size={11} />
                {sub}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Quick actions ── */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {QUICK_ACTIONS.map(({ label, href, icon: Icon, desc }) => (
            <Link key={href} href={href} className="group">
              <Card
                className="border-0 shadow-sm cursor-pointer transition-all duration-200 group-hover:-translate-y-0.5"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(240, 235, 224, 0.08)',
                  borderRadius: 14,
                }}
              >
                <CardContent className="flex items-center gap-4 py-4">
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0 border border-white/5"
                    style={{ background: 'rgba(201,168,76,0.10)' }}
                  >
                    <Icon size={20} style={{ color: GOLD }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white">
                      {label}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
                  </div>
                  <ArrowRight
                    size={16}
                    className="text-gray-500 group-hover:text-[#C9A84C] transition-colors shrink-0"
                  />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Recent activity table ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
            Recent Campaign Activity
          </h2>
          <Link
            href="/dashboard/merchant/campaigns"
            className="text-xs font-medium flex items-center gap-1 hover:underline"
            style={{ color: GOLD }}
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <Card
          className="border-0 shadow-sm overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(240, 235, 224, 0.08)',
            borderRadius: 14,
          }}
        >
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-white/10 hover:bg-transparent">
                  <TableHead className="pl-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Campaign
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Creator
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Amount
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Time
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ACTIVITY.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-400 text-sm">
                      No campaign activity found.
                    </TableCell>
                  </TableRow>
                ) : (
                  ACTIVITY.map((row, i) => {
                    const s = STATUS_STYLES[row.statusType];
                    return (
                      <TableRow key={i} className="border-b border-white/5 hover:bg-white/5">
                      <TableCell className="pl-5">
                        <span className="font-semibold text-sm text-white font-bricolage">
                          {row.campaign}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white shrink-0 border border-white/10 bg-white/10"
                          >
                            {row.creator
                              .split(' ')
                              .map((n: string) => n[0])
                              .join('')}
                          </div>
                          <span className="text-sm text-gray-300">{row.creator}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-white/5"
                          style={{ background: s.bg, color: s.color }}
                        >
                          {s.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-bold text-[#C9A84C] font-bricolage">
                          {row.amount}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock size={11} />
                          {row.time}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* ── Performance summary footer ── */}
      <Card
        className="border-0 shadow-sm"
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(240, 235, 224, 0.08)',
          borderRadius: 14,
        }}
      >
        <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 py-5">
          <div>
            <div className="text-white font-bold text-base font-bricolage">
              Campaign Performance Summary
            </div>
            <div className="text-xs mt-1 text-gray-400">
              Your campaigns are performing 28% above industry average this quarter.
            </div>
          </div>
          <Link href="/dashboard/merchant/campaigns">
            <Button
              className="shrink-0 font-bold text-sm px-5 bg-[#C9A84C] hover:bg-[#b0913b] text-slate-950"
              style={{ border: 'none' }}
            >
              View All Campaigns
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
