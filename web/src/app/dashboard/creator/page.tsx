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
  Map,
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
    value: '0',
    icon: Users,
    delta: '0% this month',
    positive: true,
  },
  {
    label: 'Active Deals',
    value: '0',
    icon: Briefcase,
    delta: 'No pending deliverables',
    positive: true,
  },
  {
    label: 'Pending Earnings',
    value: '₹0',
    icon: DollarSign,
    delta: 'No pending release',
    positive: false,
  },
  {
    label: 'Trust Index',
    value: '0/100',
    icon: Star,
    delta: 'No changes',
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
    label: 'My Chapters',
    href: '/dashboard/creator/chapters',
    icon: Map,
    desc: 'Join local regional chapters',
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
    desc: 'Track secure deposit milestones',
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

const ACTIVITY: any[] = [];

/* ------------------------------------------------------------------ */
/* Page                                                                  */
/* ------------------------------------------------------------------ */

export default function CreatorOverviewPage() {
  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight text-white font-bricolage"
          >
            Welcome back 👋
          </h1>
          <p className="text-sm mt-1 text-gray-400">
            Here&apos;s a snapshot of your creator activity today.
          </p>
        </div>
        <Badge
          className="text-xs px-3 py-1 font-semibold bg-[#C9A84C]/12 text-[#C9A84C] border border-[#C9A84C]/30"
        >
          Creator Account
        </Badge>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map(({ label, value, icon: Icon, delta, positive }) => (
          <Card
            key={label}
            className="border-0 shadow-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(240, 235, 224, 0.08)',
            }}
          >
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  {label}
                </span>
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-lg border border-[#C9A84C]/15"
                  style={{ background: 'rgba(201,168,76,0.10)' }}
                >
                  <Icon size={16} style={{ color: GOLD }} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-2xl font-bold text-white font-bricolage">
                {value}
              </div>
              <div
                className="text-xs mt-1 font-medium"
                style={{ color: positive ? '#34d399' : '#f59e0b' }}
              >
                {delta}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-3 text-gray-400">
          Quick Access
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {QUICK_LINKS.map(({ label, href, icon: Icon, desc }) => (
            <Link key={href} href={href} className="group">
              <Card
                className="border-0 shadow-sm cursor-pointer transition-all duration-200 hover:scale-[1.02] bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-[#C9A84C]/30"
                style={{ borderRadius: '14px' }}
              >
                <CardContent className="flex items-start gap-3 py-4">
                  <div
                    className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0 border border-white/10 group-hover:border-[#C9A84C]/30 transition-colors"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                  >
                    <Icon size={18} className="text-gray-300 group-hover:text-[#C9A84C] transition-colors" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white group-hover:text-[#C9A84C] transition-colors">
                      {label}
                    </div>
                    <div className="text-xs mt-0.5 text-gray-400">
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
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-3 text-gray-400">
          Recent Activity
        </h2>
        <Card
          className="border-0 shadow-sm"
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(240, 235, 224, 0.08)',
          }}
        >
          <CardContent className="py-2 divide-y divide-white/5">
            {ACTIVITY.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">
                No recent activity found.
              </p>
            ) : (
              ACTIVITY.map(({ icon: Icon, color, text, time }, i) => (
                <div key={i} className="flex items-start gap-3 py-3">
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-full shrink-0 mt-0.5 border"
                    style={{
                      background: `${color}18`,
                      borderColor: `${color}35`,
                    }}
                  >
                    <Icon size={14} style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">
                      {text}
                    </p>
                    <p className="text-xs mt-0.5 text-gray-500">
                      {time}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
