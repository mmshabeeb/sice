'use client';

import Link from 'next/link';
import {
  Globe,
  BarChart2,
  ShoppingBag,
  Briefcase,
  BookOpen,
  Zap,
  FileText,
  TrendingUp,
  CheckCircle2,
  Bell,
  DollarSign,
  Star,
  Users,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const GOLD = '#C9A84C';
const INDIGO = '#080D26';
const CREAM = '#F0EBE0';
const BG = '#F8F7F4';

/* ------------------------------------------------------------------ */
/* Mock data                                                             */
/* ------------------------------------------------------------------ */

const STATS = [
  {
    label: 'Total Followers',
    value: '2,84,500',
    icon: Users,
    delta: '+3.2% this month',
    positive: true,
  },
  {
    label: 'Active Deals',
    value: '3',
    icon: Briefcase,
    delta: '2 pending deliverables',
    positive: true,
  },
  {
    label: 'Pending Earnings',
    value: '₹45,200',
    icon: DollarSign,
    delta: 'Release in 7 days',
    positive: false,
  },
  {
    label: 'Trust Index',
    value: '87/100',
    icon: Star,
    delta: '+5 pts last 30 days',
    positive: true,
  },
];

const QUICK_LINKS = [
  {
    label: 'Social Accounts',
    href: '/dashboard/creator/accounts',
    icon: Globe,
    desc: 'Manage connected platforms',
  },
  {
    label: 'Follower Metrics',
    href: '/dashboard/creator/metrics',
    icon: BarChart2,
    desc: 'Track growth analytics',
  },
  {
    label: 'Brand Marketplace',
    href: '/dashboard/creator/marketplace',
    icon: ShoppingBag,
    desc: 'Browse & apply for campaigns',
  },
  {
    label: 'My Deals',
    href: '/dashboard/creator/deals',
    icon: Briefcase,
    desc: 'Track escrow milestones',
  },
  {
    label: 'Studio & Learning',
    href: '/dashboard/creator/studio',
    icon: BookOpen,
    desc: 'Watch production tutorials',
  },
  {
    label: 'Automations',
    href: '/dashboard/creator/automation',
    icon: Zap,
    desc: 'Download n8n / Make blueprints',
  },
  {
    label: 'Legal & Invoicing',
    href: '/dashboard/creator/legal',
    icon: FileText,
    desc: 'Contracts & GST invoices',
  },
];

const ACTIVITY = [
  {
    icon: CheckCircle2,
    color: '#22c55e',
    text: 'Deal approved — Malabar Gold "Kerala Onam Campaign"',
    time: '2 hours ago',
  },
  {
    icon: Users,
    color: GOLD,
    text: 'Milestone reached — 1,42,000 followers on Instagram',
    time: '1 day ago',
  },
  {
    icon: DollarSign,
    color: '#22c55e',
    text: 'Payment released — KFC India campaign ₹1,20,000',
    time: '3 days ago',
  },
  {
    icon: Bell,
    color: '#3b82f6',
    text: 'New campaign match — Ather Energy "EV Awareness"',
    time: '4 days ago',
  },
  {
    icon: TrendingUp,
    color: GOLD,
    text: 'Trust Index updated — scored 87/100 after peer reviews',
    time: '6 days ago',
  },
];

/* ------------------------------------------------------------------ */
/* Page                                                                  */
/* ------------------------------------------------------------------ */

export default function CreatorOverviewPage() {
  return (
    <div style={{ background: BG, minHeight: '100%' }} className="p-6 rounded-xl space-y-8">
      {/* Welcome header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: INDIGO, fontFamily: 'var(--font-bricolage, sans-serif)' }}
          >
            Welcome back, Arjun 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
            Here&apos;s a snapshot of your creator activity today.
          </p>
        </div>
        <Badge
          className="text-xs px-3 py-1 font-semibold"
          style={{ background: 'rgba(201,168,76,0.12)', color: GOLD, border: `1px solid rgba(201,168,76,0.30)` }}
        >
          Creator · Arjun Menon
        </Badge>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map(({ label, value, icon: Icon, delta, positive }) => (
          <Card
            key={label}
            className="border-0 shadow-sm"
            style={{ background: '#fff', borderRadius: '14px' }}
          >
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider" style={{ color: '#9ca3af' }}>
                  {label}
                </span>
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-lg"
                  style={{ background: 'rgba(201,168,76,0.10)' }}
                >
                  <Icon size={16} style={{ color: GOLD }} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-2xl font-bold" style={{ color: GOLD }}>
                {value}
              </div>
              <div
                className="text-xs mt-1"
                style={{ color: positive ? '#22c55e' : '#f59e0b' }}
              >
                {delta}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: '#6b7280' }}>
          Quick Access
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {QUICK_LINKS.map(({ label, href, icon: Icon, desc }) => (
            <Link key={href} href={href} className="group">
              <Card
                className="border-0 shadow-sm cursor-pointer transition-all duration-200 group-hover:shadow-md"
                style={{ background: '#fff', borderRadius: '14px' }}
              >
                <CardContent className="flex items-start gap-3 py-4">
                  <div
                    className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0"
                    style={{ background: 'rgba(8,13,38,0.06)' }}
                  >
                    <Icon size={18} style={{ color: INDIGO }} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold" style={{ color: INDIGO }}>
                      {label}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>
                      {desc}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: '#6b7280' }}>
          Recent Activity
        </h2>
        <Card className="border-0 shadow-sm" style={{ background: '#fff', borderRadius: '14px' }}>
          <CardContent className="py-2 divide-y divide-gray-100">
            {ACTIVITY.map(({ icon: Icon, color, text, time }, i) => (
              <div key={i} className="flex items-start gap-3 py-3">
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-full shrink-0 mt-0.5"
                  style={{ background: `${color}18` }}
                >
                  <Icon size={14} style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm" style={{ color: INDIGO }}>
                    {text}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>
                    {time}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
