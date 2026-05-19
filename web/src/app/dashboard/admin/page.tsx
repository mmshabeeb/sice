'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  Users,
  Store,
  Megaphone,
  Handshake,
  Star,
  UserPlus,
  Rocket,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  Globe,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/* ------------------------------------------------------------------ */
/* Constants                                                             */
/* ------------------------------------------------------------------ */

const GOLD = '#C9A84C';
const INDIGO = '#080D26';
const BG = '#F8F7F4';

/* ------------------------------------------------------------------ */
/* Mock data                                                             */
/* ------------------------------------------------------------------ */

const KPI = [
  {
    label: 'Gross Platform Volume',
    value: '₹42,80,000',
    icon: TrendingUp,
    sub: '+18.4% vs last month',
    positive: true,
  },
  {
    label: 'Active Creators',
    value: '147',
    icon: Users,
    sub: '+12 this month',
    positive: true,
  },
  {
    label: 'Active Merchants',
    value: '38',
    icon: Store,
    sub: '+3 this month',
    positive: true,
  },
  {
    label: 'Live Campaigns',
    value: '23',
    icon: Megaphone,
    sub: '5 ending this week',
    positive: false,
  },
  {
    label: 'Deals Completed (MTD)',
    value: '67',
    icon: Handshake,
    sub: 'Target: 80',
    positive: true,
  },
  {
    label: 'Avg Trust Index',
    value: '83.4',
    icon: Star,
    sub: '+2.1 pts vs last month',
    positive: true,
  },
];

const GPV_DATA = [
  { month: 'Jan', gpv: 2240000 },
  { month: 'Feb', gpv: 2810000 },
  { month: 'Mar', gpv: 3150000 },
  { month: 'Apr', gpv: 3740000 },
  { month: 'May', gpv: 4280000 },
];

const LANGUAGE_DATA = [
  { name: 'Malayalam', value: 42 },
  { name: 'Tamil', value: 28 },
  { name: 'Kannada', value: 18 },
  { name: 'Telugu', value: 12 },
];
const PIE_COLORS = ['#C9A84C', '#6366f1', '#22c55e', '#ec4899'];

const ACTIVITY = [
  {
    icon: UserPlus,
    color: '#6366f1',
    text: 'Fathima Noor joined as a new creator — Kozhikode chapter',
    time: '12 min ago',
  },
  {
    icon: Rocket,
    color: GOLD,
    text: 'Campaign launched — "Ather EV Awareness South India" by Ather Energy',
    time: '45 min ago',
  },
  {
    icon: CheckCircle2,
    color: '#22c55e',
    text: 'Deal completed — Arjun Menon × Malabar Gold "Kerala Onam Campaign" ₹1,40,000',
    time: '2 hrs ago',
  },
  {
    icon: DollarSign,
    color: '#22c55e',
    text: 'Secure deposit released — KFC India campaign payment ₹88,000 to Priya Nair',
    time: '3 hrs ago',
  },
  {
    icon: UserPlus,
    color: '#6366f1',
    text: 'Thomas Mathew completed onboarding — Chennai chapter',
    time: '5 hrs ago',
  },
  {
    icon: Megaphone,
    color: GOLD,
    text: 'New campaign posted — "Beauty Festive Edit" by Nykaa India (₹6,00,000 budget)',
    time: '7 hrs ago',
  },
  {
    icon: AlertCircle,
    color: '#ef4444',
    text: 'Arbitration opened — ARB-001 Missed Deadline: Arjun Menon vs Malabar Gold',
    time: '9 hrs ago',
  },
  {
    icon: Globe,
    color: '#3b82f6',
    text: 'Chapter activated — Hyderabad chapter now live with 10 creators onboarded',
    time: '1 day ago',
  },
];

/* ------------------------------------------------------------------ */
/* Sub-components                                                         */
/* ------------------------------------------------------------------ */

function GpvChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={GPV_DATA} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(240,235,224,0.05)" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: 'rgba(240,235,224,0.3)', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`}
          tick={{ fill: 'rgba(240,235,224,0.3)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={52}
        />
        <Tooltip
          formatter={(value) =>
            [`₹${(Number(value) / 100000).toFixed(2)}L`, 'Gross Platform Volume']
          }
          contentStyle={{
            background: '#080D26',
            borderColor: 'rgba(240,235,224,0.15)',
            borderRadius: 12,
          }}
          labelStyle={{ color: 'rgba(240,235,224,0.6)' }}
          itemStyle={{ color: '#F0EBE0' }}
        />
        <Bar dataKey="gpv" fill={GOLD} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function LanguagePieChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={LANGUAGE_DATA}
          cx="50%"
          cy="45%"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
        >
          {LANGUAGE_DATA.map((_, i) => (
            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [`${value}%`, 'Share']}
          contentStyle={{
            background: '#080D26',
            borderColor: 'rgba(240,235,224,0.15)',
            borderRadius: 12,
          }}
          itemStyle={{ color: '#F0EBE0' }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12, color: 'rgba(240,235,224,0.6)' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                  */
/* ------------------------------------------------------------------ */

export default function AdminCommandCenterPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight text-white font-bricolage"
          >
            Command Center
          </h1>
          <p className="text-sm mt-1 text-gray-400">
            Global Platform Overview — May 2026
          </p>
        </div>
        <Badge
          className="text-xs px-3 py-1 font-semibold"
          style={{
            background: 'rgba(201,168,76,0.12)',
            color: GOLD,
            border: '1px solid rgba(201,168,76,0.30)',
          }}
        >
          Chapter Admin
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {KPI.map(({ label, value, icon: Icon, sub, positive }) => (
          <Card
            key={label}
            className="border-0 shadow-sm col-span-1"
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(240, 235, 224, 0.08)',
            }}
          >
            <CardHeader className="pb-1 pt-4 px-4">
              <div className="flex items-center justify-between">
                <span
                  className="text-xs font-medium uppercase tracking-wider leading-tight text-gray-400"
                >
                  {label}
                </span>
                <div
                  className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0"
                  style={{
                    background: 'rgba(201,168,76,0.10)',
                    border: '1px solid rgba(201,168,76,0.20)',
                  }}
                >
                  <Icon size={14} style={{ color: GOLD }} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-1 px-4 pb-4">
              <div
                className="text-xl font-bold text-[#F0EBE0] font-bricolage"
              >
                {value}
              </div>
              <div
                className={`text-xs mt-0.5 ${positive ? 'text-emerald-400' : 'text-amber-400'}`}
              >
                {sub}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* GPV Bar Chart */}
        <Card
          className="border-0 shadow-sm lg:col-span-3"
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(240, 235, 224, 0.08)',
          }}
        >
          <CardHeader className="pb-2">
            <CardTitle
              className="text-sm font-semibold text-white font-bricolage"
            >
              Monthly Gross Platform Volume — 2026
            </CardTitle>
            <p className="text-xs text-gray-400">
              Jan through May (₹ in Lakhs)
            </p>
          </CardHeader>
          <CardContent>
            <GpvChart />
          </CardContent>
        </Card>

        {/* Language Pie Chart */}
        <Card
          className="border-0 shadow-sm lg:col-span-2"
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(240, 235, 224, 0.08)',
          }}
        >
          <CardHeader className="pb-2">
            <CardTitle
              className="text-sm font-semibold text-white font-bricolage"
            >
              Creator Distribution by Language
            </CardTitle>
            <p className="text-xs text-gray-400">
              Across all chapters
            </p>
          </CardHeader>
          <CardContent>
            <LanguagePieChart />
          </CardContent>
        </Card>
      </div>

      {/* Recent Platform Activity */}
      <div>
        <h2
          className="text-sm font-semibold uppercase tracking-wider mb-3 text-gray-400"
        >
          Recent Platform Activity
        </h2>
        <Card
          className="border-0 shadow-sm"
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(240, 235, 224, 0.08)',
          }}
        >
          <CardContent className="py-2 divide-y divide-white/5">
            {ACTIVITY.map(({ icon: Icon, color, text, time }, i) => (
              <div key={i} className="flex items-start gap-3 py-3">
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-full shrink-0 mt-0.5"
                  style={{
                    background: `${color}18`,
                    border: `1px solid ${color}25`,
                  }}
                >
                  <Icon size={14} style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-snug text-gray-200">
                    {text}
                  </p>
                  <p className="text-xs mt-0.5 text-gray-400">
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
