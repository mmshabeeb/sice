'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Globe,
  BarChart2,
  ShoppingBag,
  Briefcase,
  BookOpen,
  Zap,
  FileText,
  Users,
  DollarSign,
  Star,
  Map,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const GOLD = '#C9A84C';

interface CreatorStats {
  totalFollowers: number;
  activeDeals: number;
  pendingEarnings: number;
  trustIndex: number;
}

const QUICK_LINKS = [
  { label: 'Social Accounts', href: '/dashboard/creator/accounts', icon: Globe, desc: 'Manage connected platforms' },
  { label: 'My Chapters', href: '/dashboard/creator/chapters', icon: Map, desc: 'Join local regional chapters' },
  { label: 'Follower Metrics', href: '/dashboard/creator/metrics', icon: BarChart2, desc: 'Track growth analytics' },
  { label: 'Brand Marketplace', href: '/dashboard/creator/marketplace', icon: ShoppingBag, desc: 'Browse & apply for campaigns' },
  { label: 'My Deals', href: '/dashboard/creator/deals', icon: Briefcase, desc: 'Track secure deposit milestones' },
  { label: 'Studio & Learning', href: '/dashboard/creator/studio', icon: BookOpen, desc: 'Watch production tutorials' },
  { label: 'Automations', href: '/dashboard/creator/automation', icon: Zap, desc: 'Download n8n / Make blueprints' },
  { label: 'Legal & Invoicing', href: '/dashboard/creator/legal', icon: FileText, desc: 'Contracts & GST invoices' },
];

function formatFollowers(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function formatCurrency(n: number) {
  return `₹${new Intl.NumberFormat('en-IN').format(n)}`;
}

export default function CreatorOverviewPage() {
  const [stats, setStats] = useState<CreatorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setStats(data);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats
    ? [
        { label: 'Total Followers', value: formatFollowers(stats.totalFollowers), icon: Users, delta: stats.totalFollowers > 0 ? 'Across all platforms' : 'No accounts linked yet', positive: true },
        { label: 'Active Deals', value: String(stats.activeDeals), icon: Briefcase, delta: stats.activeDeals > 0 ? `${stats.activeDeals} in progress` : 'No pending deliverables', positive: true },
        { label: 'Pending Earnings', value: formatCurrency(stats.pendingEarnings), icon: DollarSign, delta: stats.pendingEarnings > 0 ? 'In escrow' : 'No pending release', positive: stats.pendingEarnings > 0 },
        { label: 'Trust Index', value: `${stats.trustIndex}/100`, icon: Star, delta: stats.trustIndex >= 70 ? 'Good standing' : 'Build your profile', positive: stats.trustIndex >= 70 },
      ]
    : [
        { label: 'Total Followers', value: '—', icon: Users, delta: '', positive: true },
        { label: 'Active Deals', value: '—', icon: Briefcase, delta: '', positive: true },
        { label: 'Pending Earnings', value: '—', icon: DollarSign, delta: '', positive: false },
        { label: 'Trust Index', value: '—', icon: Star, delta: '', positive: true },
      ];

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-bricolage">
            Welcome back 👋
          </h1>
          <p className="text-sm mt-1 text-gray-400">
            Here&apos;s a snapshot of your creator activity today.
          </p>
        </div>
        <Badge className="text-xs px-3 py-1 font-semibold bg-[#C9A84C]/12 text-[#C9A84C] border border-[#C9A84C]/30">
          Creator Account
        </Badge>
      </div>

      {error && (
        <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, delta, positive }) => (
          <Card
            key={label}
            className="border-0 shadow-sm"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(240,235,224,0.08)' }}
          >
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-gray-400">{label}</span>
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-lg border border-[#C9A84C]/15"
                  style={{ background: 'rgba(201,168,76,0.10)' }}
                >
                  <Icon size={16} style={{ color: GOLD }} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              {loading ? (
                <Loader2 size={16} className="animate-spin text-gray-500 mt-1" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-white font-bricolage">{value}</div>
                  {delta && (
                    <div className="text-xs mt-1 font-medium" style={{ color: positive ? '#34d399' : '#f59e0b' }}>
                      {delta}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-3 text-gray-400">Quick Access</h2>
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
                    <div className="text-sm font-semibold text-white group-hover:text-[#C9A84C] transition-colors">{label}</div>
                    <div className="text-xs mt-0.5 text-gray-400">{desc}</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-3 text-gray-400">Recent Activity</h2>
        <Card
          className="border-0 shadow-sm"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(240,235,224,0.08)' }}
        >
          <CardContent className="py-2">
            <p className="text-sm text-gray-500 text-center py-6">No recent activity found.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
