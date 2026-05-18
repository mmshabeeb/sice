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
    value: '3',
    icon: Megaphone,
    sub: '2 accepting applications',
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.08)',
  },
  {
    label: 'Total Creators Engaged',
    value: '18',
    icon: Users,
    sub: '+4 this month',
    color: '#0ea5e9',
    bg: 'rgba(14,165,233,0.08)',
  },
  {
    label: 'Escrow Locked',
    value: '₹3,45,000',
    icon: Lock,
    sub: 'Across 4 active deals',
    color: GOLD,
    bg: 'rgba(201,168,76,0.08)',
  },
  {
    label: 'Deals Completed',
    value: '12',
    icon: CheckCircle2,
    sub: '₹8,20,000 released',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.08)',
  },
];

const ACTIVITY = [
  {
    campaign: 'Kerala Onam Campaign',
    creator: 'Arjun Menon',
    status: 'Content Approved',
    statusType: 'approved',
    amount: '₹85,000',
    time: '2 hours ago',
  },
  {
    campaign: 'South India Launch Series',
    creator: 'Priya Nair',
    status: 'In Review',
    statusType: 'review',
    amount: '₹1,20,000',
    time: '5 hours ago',
  },
  {
    campaign: 'Festive Creator Program',
    creator: 'Rahul Suresh',
    status: 'Revision Requested',
    statusType: 'revision',
    amount: '₹95,000',
    time: 'Yesterday',
  },
  {
    campaign: 'Kerala Onam Campaign',
    creator: 'Meera Pillai',
    status: 'Submitted',
    statusType: 'submitted',
    amount: '₹45,000',
    time: 'Yesterday',
  },
  {
    campaign: 'South India Launch Series',
    creator: 'Divya Krishnan',
    status: 'Active',
    statusType: 'active',
    amount: '₹60,000',
    time: '2 days ago',
  },
];

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  approved: { bg: 'rgba(34,197,94,0.10)', color: '#16a34a', label: 'Content Approved' },
  review: { bg: 'rgba(99,102,241,0.10)', color: '#6366f1', label: 'In Review' },
  revision: { bg: 'rgba(251,191,36,0.12)', color: '#d97706', label: 'Revision Requested' },
  submitted: { bg: 'rgba(14,165,233,0.10)', color: '#0284c7', label: 'Submitted' },
  active: { bg: 'rgba(201,168,76,0.10)', color: GOLD, label: 'Active' },
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
    desc: 'Manage escrow & payments',
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
    <div style={{ background: BG, minHeight: '100%' }} className="p-6 space-y-8">
      {/* ── Welcome header ── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: INDIGO }}
          >
            {greeting}, Malabar Gold &amp; Diamonds
          </h1>
          <p className="text-sm mt-1 text-gray-500">
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
          Merchant · Brand Account
        </Badge>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map(({ label, value, icon: Icon, sub, color, bg }) => (
          <Card
            key={label}
            className="border-0 shadow-sm"
            style={{ background: '#fff', borderRadius: 14 }}
          >
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {label}
                </span>
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-xl"
                  style={{ background: bg }}
                >
                  <Icon size={18} style={{ color }} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-3xl font-bold" style={{ color }}>
                {value}
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                <TrendingUp size={11} />
                {sub}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Quick actions ── */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {QUICK_ACTIONS.map(({ label, href, icon: Icon, desc }) => (
            <Link key={href} href={href} className="group">
              <Card
                className="border-0 shadow-sm cursor-pointer transition-all duration-200 group-hover:shadow-md group-hover:-translate-y-0.5"
                style={{ background: '#fff', borderRadius: 14 }}
              >
                <CardContent className="flex items-center gap-4 py-4">
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
                    style={{ background: 'rgba(201,168,76,0.10)' }}
                  >
                    <Icon size={20} style={{ color: GOLD }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold" style={{ color: INDIGO }}>
                      {label}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
                  </div>
                  <ArrowRight
                    size={16}
                    className="text-gray-300 group-hover:text-gray-500 transition-colors shrink-0"
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
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
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
          style={{ background: '#fff', borderRadius: 14 }}
        >
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-100">
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
                {ACTIVITY.map((row, i) => {
                  const s = STATUS_STYLES[row.statusType];
                  return (
                    <TableRow key={i} className="border-b border-gray-50">
                      <TableCell className="pl-5">
                        <span className="font-medium text-sm" style={{ color: INDIGO }}>
                          {row.campaign}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white shrink-0"
                            style={{ background: INDIGO }}
                          >
                            {row.creator
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <span className="text-sm text-gray-700">{row.creator}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{ background: s.bg, color: s.color }}
                        >
                          {s.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-semibold" style={{ color: INDIGO }}>
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
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* ── Performance summary footer ── */}
      <Card
        className="border-0 shadow-sm"
        style={{ background: INDIGO, borderRadius: 14 }}
      >
        <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 py-5">
          <div>
            <div className="text-white font-semibold text-base">
              Campaign Performance Summary
            </div>
            <div className="text-xs mt-1" style={{ color: 'rgba(240,235,224,0.65)' }}>
              Your campaigns are performing 28% above industry average this quarter.
            </div>
          </div>
          <Link href="/dashboard/merchant/campaigns">
            <Button
              className="shrink-0 font-semibold text-sm px-5"
              style={{ background: GOLD, color: INDIGO, border: 'none' }}
            >
              View All Campaigns
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
