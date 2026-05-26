'use client';

import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  Users,
  Store,
  Map,
  ShieldAlert,
  ShieldCheck,
  Megaphone,
  Plus,
  MapPin,
  Clock,
  CheckCircle2,
  Award,
  UserPlus,
  Building,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiFetch } from '@/utils/api';

/* ------------------------------------------------------------------ */
/* Constants                                                             */
/* ------------------------------------------------------------------ */

const GOLD = '#C9A84C';
const INDIGO = '#080D26';
const PIE_COLORS = ['#C9A84C', '#6366f1', '#22c55e', '#ec4899', '#f59e0b', '#3b82f6'];

/* ------------------------------------------------------------------ */
/* Mock data                                                             */
/* ------------------------------------------------------------------ */

const KPI = [
  {
    label: 'Gross Platform Volume',
    value: '₹0.00 Cr',
    icon: TrendingUp,
    sub: '0% vs last quarter',
    positive: true,
  },
  {
    label: 'Total Chapters',
    value: '0',
    icon: Map,
    sub: '0 Active, 0 Inception',
    positive: true,
  },
  {
    label: 'Platform Creators',
    value: '0',
    icon: Users,
    sub: '0 this month',
    positive: true,
  },
  {
    label: 'Registered Brands',
    value: '0',
    icon: Store,
    sub: '0 this month',
    positive: true,
  },
];

const GPV_TREND: { month: string; gpv: number }[] = [];

export default function SuperAdminOverview() {
  const [creatorsCount, setCreatorsCount] = useState(0);
  const [pendingCreatorsCount, setPendingCreatorsCount] = useState(0);
  const [chaptersCount, setChaptersCount] = useState(0);
  const [pendingChaptersCount, setPendingChaptersCount] = useState(0);
  const [merchantsCount, setMerchantsCount] = useState(0);
  const [platformDist, setPlatformDist] = useState<{ name: string; value: number }[]>([]);
  const [chapterGpv, setChapterGpv] = useState<{ name: string; gpv: number; creators: number }[]>([]);
  const [systemLogs, setSystemLogs] = useState<{ id: number; type: string; text: string; time: string; color: string }[]>([]);

  useEffect(() => {
    async function loadStats() {
      try {
        // 1. Fetch Creator applications for stats and platform distribution
        const cRes = await apiFetch('/api/admin/applications?type=super_admin');
        let rawCreators: any[] = [];
        if (cRes.ok) {
          const cData = await cRes.json();
          if (cData.success) {
            rawCreators = cData.creators || [];
            const verified = rawCreators.filter((c: any) => c.status === 'verified').length;
            const pending = rawCreators.filter((c: any) => c.status === 'pending').length;
            setCreatorsCount(verified);
            setPendingCreatorsCount(pending);

            // Compute platform distribution
            const platCounts: Record<string, number> = {};
            rawCreators.forEach((c: any) => {
              const p = c.platform || 'Instagram';
              platCounts[p] = (platCounts[p] || 0) + 1;
            });
            const dist = Object.keys(platCounts).map(name => ({
              name,
              value: platCounts[name]
            })).filter(d => d.value > 0);
            setPlatformDist(dist);
          }
        }

        // 2. Fetch Chapter applications count
        const chAppRes = await apiFetch('/api/admin/applications?type=chapter_applications');
        let rawChapterApps: any[] = [];
        if (chAppRes.ok) {
          const chAppData = await chAppRes.json();
          if (chAppData.success) {
            rawChapterApps = chAppData.applications || [];
            const pendingCh = rawChapterApps.filter((a: any) => a.status === 'Pending').length;
            setPendingChaptersCount(pendingCh);
          }
        }

        // 3. Fetch active Chapters
        const chRes = await apiFetch('/api/admin/applications?type=chapters');
        if (chRes.ok) {
          const chData = await chRes.json();
          if (chData.success) {
            const list = chData.chapters || [];
            setChaptersCount(list.length);
            
            // Map chapters to performance chart (using creators count as proxy for activity)
            const gpvData = list.map((ch: any) => ({
              name: ch.name,
              gpv: (ch.creatorsCount || 0) * 150000, 
              creators: ch.creatorsCount || 0
            }));
            setChapterGpv(gpvData);
          }
        }

        // 4. Fetch Merchants
        const mRes = await apiFetch('/api/admin/applications?type=merchants');
        if (mRes.ok) {
          const mData = await mRes.json();
          if (mData.success) {
            setMerchantsCount((mData.merchants || []).length);
          }
        }

        // 5. Fetch Creator applications detailed queue for Global Activity Stream
        const cAppRes = await apiFetch('/api/admin/applications?type=applications');
        let rawCreatorApps: any[] = [];
        if (cAppRes.ok) {
          const cAppData = await cAppRes.json();
          if (cAppData.success) {
            rawCreatorApps = cAppData.applications || [];
          }
        }

        // 6. Build activity stream from pending applications
        const logs: any[] = [];
        let logId = 1;

        // Add pending creator applications to logs
        rawCreatorApps.filter((a: any) => a.status === 'Pending' || a.status === 'Under Review').forEach((a: any) => {
          logs.push({
            id: logId++,
            type: 'creator_app',
            text: `New creator application: ${a.name} (${a.handles})`,
            time: a.appliedDate || 'Recent',
            color: GOLD,
          });
        });

        // Add pending chapter applications to logs
        rawChapterApps.filter((a: any) => a.status === 'Pending').forEach((a: any) => {
          logs.push({
            id: logId++,
            type: 'chapter_app',
            text: `Proposed chapter organizer: ${a.name} requested role ${a.chapterRole} for "${a.chapterName}"`,
            time: a.appliedDate || 'Recent',
            color: '#818cf8',
          });
        });

        // Add approved ones as recent achievements
        rawCreatorApps.filter((a: any) => a.status === 'Approved').slice(0, 3).forEach((a: any) => {
          logs.push({
            id: logId++,
            type: 'creator_approved',
            text: `Creator onboarding completed: ${a.name} is now active`,
            time: a.appliedDate || 'Approved',
            color: '#34d399',
          });
        });

        setSystemLogs(logs.slice(0, 10)); 
      } catch (err) {
        console.error('Failed to load super admin stats:', err);
      }
    }
    loadStats();
  }, []);

  const dynamicKPI = [
    {
      label: 'Gross Platform Volume',
      value: '₹0.00 Cr',
      icon: TrendingUp,
      sub: '0% vs last quarter',
      positive: true,
    },
    {
      label: 'Total Chapters',
      value: String(chaptersCount),
      icon: Map,
      sub: `${chaptersCount} Active (${pendingChaptersCount} pending)`,
      positive: true,
    },
    {
      label: 'Platform Creators',
      value: String(creatorsCount),
      icon: Users,
      sub: `${creatorsCount} Onboarded (${pendingCreatorsCount} pending)`,
      positive: true,
    },
    {
      label: 'Registered Brands',
      value: String(merchantsCount),
      icon: Store,
      sub: `${merchantsCount} Active brands`,
      positive: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-bricolage">
            Super Admin Control Center
          </h1>
          <p className="text-sm text-gray-400">
            Platform-wide governance, chapter growth, and financial operations.
          </p>
        </div>
        <div className="flex gap-2">
          <Badge
            variant="outline"
            className="border-amber-500/30 text-amber-400 bg-amber-500/5 px-3 py-1 text-xs"
          >
            Live Monitor Mode
          </Badge>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {dynamicKPI.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={kpi.label}
              className="border-0"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(240, 235, 224, 0.08)',
              }}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
                      {kpi.label}
                    </p>
                    <h3
                      className="text-2xl font-bold mt-2"
                      style={{ color: '#F0EBE0', fontFamily: 'var(--font-bricolage)' }}
                    >
                      {kpi.value}
                    </h3>
                  </div>
                  <div
                    className="p-2.5 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: 'rgba(201, 168, 76, 0.10)',
                      border: '1px solid rgba(201, 168, 76, 0.20)',
                    }}
                  >
                    <Icon size={18} style={{ color: GOLD }} />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-4">
                  <span
                    className={`text-xs font-semibold ${
                      kpi.positive ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {kpi.sub}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GPV Trend Area Chart */}
        <Card
          className="border-0 lg:col-span-2"
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(240, 235, 224, 0.08)',
          }}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-white font-bricolage">
              Platform Gross Volume (GPV) Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={GPV_TREND}>
                  <defs>
                    <linearGradient id="gpvGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={GOLD} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={GOLD} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(240,235,224,0.05)" vertical={false} />
                  <XAxis
                    dataKey="month"
                    stroke="rgba(240,235,224,0.3)"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="rgba(240,235,224,0.3)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#080D26',
                      borderColor: 'rgba(240,235,224,0.15)',
                      borderRadius: 12,
                    }}
                    labelStyle={{ color: 'rgba(240,235,224,0.6)' }}
                    itemStyle={{ color: GOLD }}
                    formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'GPV']}
                  />
                  <Area
                    type="monotone"
                    dataKey="gpv"
                    stroke={GOLD}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#gpvGlow)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Platform breakdown Pie Chart */}
        <Card
          className="border-0"
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(240, 235, 224, 0.08)',
          }}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-white font-bricolage">
              Creators by Platform
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-center h-full">
            <div className="h-56 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformDist}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {platformDist.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#080D26',
                      borderColor: 'rgba(240,235,224,0.15)',
                      borderRadius: 12,
                    }}
                    itemStyle={{ color: '#F0EBE0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-white font-bricolage">
                  {platformDist.reduce((sum, item) => sum + item.value, 0)}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-gray-400">Total</span>
              </div>
            </div>

            {/* Legend breakdown */}
            <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
              {platformDist.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: PIE_COLORS[idx % PIE_COLORS.length] }}
                  />
                  <span className="text-gray-300 truncate">{item.name}</span>
                  <span className="text-gray-500 ml-auto font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chapter GPV Bar Chart */}
        <Card
          className="border-0 lg:col-span-2"
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(240, 235, 224, 0.08)',
          }}
        >
          <CardHeader>
            <CardTitle className="text-base font-semibold text-white font-bricolage">
              Chapter Performance & Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chapterGpv}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(240,235,224,0.05)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="rgba(240,235,224,0.3)"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="rgba(240,235,224,0.3)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#080D26',
                      borderColor: 'rgba(240,235,224,0.15)',
                      borderRadius: 12,
                    }}
                    formatter={(value: any, name?: any) => {
                      if (name === 'gpv') return [`₹${(value / 100000).toFixed(1)} Lakhs`, 'Gross Volume'];
                      return [value, 'Active Creators'];
                    }}
                  />
                  <Bar dataKey="gpv" fill={GOLD} radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Global System Audit Log */}
        <Card
          className="border-0"
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(240, 235, 224, 0.08)',
          }}
        >
          <CardHeader>
            <CardTitle className="text-base font-semibold text-white font-bricolage">
              Global Activity Stream
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500 text-center">
                  <Clock size={24} className="mb-2 opacity-40" />
                  <p className="text-xs">No activity logged yet.</p>
                </div>
              ) : (
                systemLogs.map((log) => {
                  const Icon = log.type === 'creator_app' ? UserPlus : log.type === 'chapter_app' ? Building : CheckCircle2;
                  return (
                    <div key={log.id} className="flex gap-3 text-xs leading-normal">
                      <div
                        className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center mt-0.5"
                        style={{
                          background: `${log.color}15`,
                          border: `1px solid ${log.color}25`,
                        }}
                      >
                        <Icon size={12} style={{ color: log.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-300 font-medium leading-relaxed">{log.text}</p>
                        <div className="flex items-center gap-1.5 mt-1 text-gray-500">
                          <Clock size={10} />
                          <span>{log.time}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
