'use client';

import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { TrendingUp, Users, Store, Map, Clock, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const GOLD = '#C9A84C';
const PIE_COLORS = ['#C9A84C', '#6366f1', '#22c55e', '#ec4899', '#f59e0b', '#3b82f6'];

interface SuperAdminStats {
  totalChapters: number;
  activeChapters: number;
  inceptionChapters: number;
  totalCreators: number;
  totalMerchants: number;
  liveCampaigns: number;
  grossVolume: number;
}

export default function SuperAdminOverview() {
  const [stats, setStats] = useState<SuperAdminStats | null>(null);
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

  const kpis = [
    {
      label: 'Gross Platform Volume',
      value: stats ? `₹${(stats.grossVolume / 10_000_000).toFixed(2)} Cr` : '—',
      icon: TrendingUp,
      sub: 'All-time',
    },
    {
      label: 'Total Chapters',
      value: stats ? String(stats.totalChapters) : '—',
      icon: Map,
      sub: stats ? `${stats.activeChapters} Active, ${stats.inceptionChapters} Inception` : '',
    },
    {
      label: 'Platform Creators',
      value: stats ? String(stats.totalCreators) : '—',
      icon: Users,
      sub: 'Registered creators',
    },
    {
      label: 'Registered Brands',
      value: stats ? String(stats.totalMerchants) : '—',
      icon: Store,
      sub: 'Merchant accounts',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-bricolage">Super Admin Control Center</h1>
          <p className="text-sm text-gray-400">Platform-wide governance, chapter growth, and financial operations.</p>
        </div>
      </div>

      {error && (
        <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-4 py-3">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={kpi.label}
              className="border-0"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(240,235,224,0.08)' }}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-gray-400">{kpi.label}</p>
                    <h3 className="text-2xl font-bold mt-2" style={{ color: '#F0EBE0', fontFamily: 'var(--font-bricolage)' }}>
                      {loading ? <Loader2 size={18} className="animate-spin text-gray-500 mt-1" /> : kpi.value}
                    </h3>
                  </div>
                  <div
                    className="p-2.5 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(201,168,76,0.10)', border: '1px solid rgba(201,168,76,0.20)' }}
                  >
                    <Icon size={18} style={{ color: GOLD }} />
                  </div>
                </div>
                {!loading && kpi.sub && (
                  <div className="flex items-center gap-1.5 mt-4">
                    <span className="text-xs font-semibold text-emerald-400">{kpi.sub}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card
          className="border-0 lg:col-span-2"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(240,235,224,0.08)' }}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-white font-bricolage">
              Platform Gross Volume (GPV) Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-80 text-gray-500 text-sm">
              No volume data yet — transactions will appear here once campaigns run.
            </div>
          </CardContent>
        </Card>

        <Card
          className="border-0"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(240,235,224,0.08)' }}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-white font-bricolage">Creators by Platform</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-center h-full">
            <div className="flex items-center justify-center h-56 text-gray-500 text-sm text-center px-4">
              Social account distribution will appear once creators connect their profiles.
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card
          className="border-0 lg:col-span-2"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(240,235,224,0.08)' }}
        >
          <CardHeader>
            <CardTitle className="text-base font-semibold text-white font-bricolage">
              Chapter Performance &amp; Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
              Chapter GPV data will populate as campaigns are completed.
            </div>
          </CardContent>
        </Card>

        <Card
          className="border-0"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(240,235,224,0.08)' }}
        >
          <CardHeader>
            <CardTitle className="text-base font-semibold text-white font-bricolage">Global Activity Stream</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 text-center">
              <Clock size={24} className="mb-2 opacity-40" />
              <p className="text-xs">No activity logged yet.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
