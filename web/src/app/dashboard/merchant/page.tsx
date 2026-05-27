'use client';

import { useEffect, useState } from 'react';
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
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const GOLD = '#C9A84C';

interface MerchantStats {
  activeCampaigns: number;
  creatorsEngaged: number;
  totalDeposited: number;
  completedDeals: number;
}

const QUICK_ACTIONS = [
  { label: 'Create Campaign', href: '/dashboard/merchant/campaigns', icon: PlusCircle, desc: 'Launch a new creator campaign' },
  { label: 'Browse Talent', href: '/dashboard/merchant/discover', icon: Search, desc: 'Discover creators by niche & location' },
  { label: 'View Wallet', href: '/dashboard/merchant/wallet', icon: Wallet, desc: 'Manage secure deposits & payments' },
];

function formatCurrency(n: number) {
  return `₹${new Intl.NumberFormat('en-IN').format(n)}`;
}

export default function MerchantOverviewPage() {
  const [stats, setStats] = useState<MerchantStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

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

  const statCards = [
    {
      label: 'Active Campaigns',
      value: loading ? '—' : String(stats?.activeCampaigns ?? 0),
      icon: Megaphone,
      sub: loading ? '' : stats?.activeCampaigns ? `${stats.activeCampaigns} running` : 'No active campaigns',
      color: '#6366f1',
      bg: 'rgba(99,102,241,0.08)',
    },
    {
      label: 'Total Creators Engaged',
      value: loading ? '—' : String(stats?.creatorsEngaged ?? 0),
      icon: Users,
      sub: loading ? '' : stats?.creatorsEngaged ? `${stats.creatorsEngaged} creators` : '0 this month',
      color: '#0ea5e9',
      bg: 'rgba(14,165,233,0.08)',
    },
    {
      label: 'Securely Deposited',
      value: loading ? '—' : formatCurrency(stats?.totalDeposited ?? 0),
      icon: Lock,
      sub: loading ? '' : stats?.totalDeposited ? 'In escrow' : 'No active deals',
      color: GOLD,
      bg: 'rgba(201,168,76,0.08)',
    },
    {
      label: 'Deals Completed',
      value: loading ? '—' : String(stats?.completedDeals ?? 0),
      icon: CheckCircle2,
      sub: loading ? '' : stats?.completedDeals ? `${stats.completedDeals} released` : '₹0 released',
      color: '#22c55e',
      bg: 'rgba(34,197,94,0.08)',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-bricolage">{greeting} 👋</h1>
          <p className="text-sm mt-1 text-gray-400">Here&apos;s your campaign overview for today.</p>
        </div>
        <Badge
          className="text-xs px-3 py-1 font-semibold border"
          style={{ background: 'rgba(201,168,76,0.10)', color: GOLD, borderColor: 'rgba(201,168,76,0.28)' }}
        >
          Merchant Account
        </Badge>
      </div>

      {error && (
        <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-4 py-3">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, sub, color, bg }) => (
          <Card
            key={label}
            className="border-0 shadow-sm"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(240,235,224,0.08)', borderRadius: 14 }}
          >
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</span>
                <div className="flex items-center justify-center w-9 h-9 rounded-xl border border-white/5" style={{ background: bg }}>
                  <Icon size={18} style={{ color }} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              {loading ? (
                <Loader2 size={16} className="animate-spin text-gray-500 mt-1" />
              ) : (
                <>
                  <div className="text-3xl font-bold font-bricolage" style={{ color }}>{value}</div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                    <TrendingUp size={11} />
                    {sub}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {QUICK_ACTIONS.map(({ label, href, icon: Icon, desc }) => (
            <Link key={href} href={href} className="group">
              <Card
                className="border-0 shadow-sm cursor-pointer transition-all duration-200 group-hover:-translate-y-0.5"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(240,235,224,0.08)', borderRadius: 14 }}
              >
                <CardContent className="flex items-center gap-4 py-4">
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0 border border-white/5"
                    style={{ background: 'rgba(201,168,76,0.10)' }}
                  >
                    <Icon size={20} style={{ color: GOLD }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white">{label}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
                  </div>
                  <ArrowRight size={16} className="text-gray-500 group-hover:text-[#C9A84C] transition-colors shrink-0" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <Card
        className="border-0 shadow-sm"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(240,235,224,0.08)', borderRadius: 14 }}
      >
        <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 py-5">
          <div>
            <div className="text-white font-bold text-base font-bricolage">Campaign Performance Summary</div>
            <div className="text-xs mt-1 text-gray-400">
              {stats?.completedDeals
                ? `${stats.completedDeals} deals completed with ${stats.creatorsEngaged} creators.`
                : 'Launch your first campaign to start tracking performance.'}
            </div>
          </div>
          <Link href="/dashboard/merchant/campaigns">
            <Button className="shrink-0 font-bold text-sm px-5 bg-[#C9A84C] hover:bg-[#b0913b] text-slate-950" style={{ border: 'none' }}>
              View All Campaigns
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
