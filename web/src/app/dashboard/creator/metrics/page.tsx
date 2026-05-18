'use client';

import { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const GOLD = '#C9A84C';
const INDIGO = '#080D26';
const BG = '#F8F7F4';

/* ------------------------------------------------------------------ */
/* Mock data generators                                                  */
/* ------------------------------------------------------------------ */

function generateDays(start: number, end: number, count = 30) {
  const step = (end - start) / (count - 1);
  const now = new Date('2026-05-18');
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (count - 1 - i));
    const label = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    return {
      date: label,
      followers: Math.round(start + step * i + (Math.random() - 0.5) * 200),
    };
  });
}

type PlatformKey = 'instagram' | 'youtube' | 'x';

const PLATFORM_DATA: Record<
  PlatformKey,
  {
    label: string;
    color: string;
    data: { date: string; followers: number }[];
    current: string;
    growth: string;
    pct: string;
    avgDaily: string;
    unit: string;
  }
> = {
  instagram: {
    label: 'Instagram',
    color: '#E1306C',
    data: generateDays(138000, 142000),
    current: '1,42,000',
    growth: '+4,000',
    pct: '+2.90%',
    avgDaily: '+133',
    unit: 'followers',
  },
  youtube: {
    label: 'YouTube',
    color: '#FF0000',
    data: generateDays(86200, 89500),
    current: '89,500',
    growth: '+3,300',
    pct: '+3.83%',
    avgDaily: '+110',
    unit: 'subscribers',
  },
  x: {
    label: 'X (Twitter)',
    color: '#14171A',
    data: generateDays(26800, 28000),
    current: '28,000',
    growth: '+1,200',
    pct: '+4.48%',
    avgDaily: '+40',
    unit: 'followers',
  },
};

const TABS: PlatformKey[] = ['instagram', 'youtube', 'x'];

/* ------------------------------------------------------------------ */
/* Custom tooltip                                                        */
/* ------------------------------------------------------------------ */

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2 rounded-xl text-xs shadow-lg"
      style={{ background: '#fff', border: '1px solid #e5e7eb', color: INDIGO }}
    >
      <div className="font-semibold">{label}</div>
      <div style={{ color: GOLD }} className="mt-0.5">
        {payload[0].value.toLocaleString('en-IN')}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                  */
/* ------------------------------------------------------------------ */

export default function MetricsPage() {
  const [active, setActive] = useState<PlatformKey>('instagram');
  const p = PLATFORM_DATA[active];

  return (
    <div style={{ background: BG, minHeight: '100%' }} className="p-6 rounded-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: INDIGO, fontFamily: 'var(--font-bricolage, sans-serif)' }}
          >
            Follower Metrics
          </h1>
          <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
            30-day growth trends across your connected platforms.
          </p>
        </div>
        <div
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
          style={{
            background: 'rgba(201,168,76,0.10)',
            border: '1px solid rgba(201,168,76,0.20)',
          }}
        >
          <Clock size={12} style={{ color: GOLD }} />
          <span style={{ color: GOLD }}>Last synced: 18 May 2026 · 00:00:00 IST</span>
        </div>
      </div>

      {/* Platform tab selector */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map((key) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
            style={
              active === key
                ? {
                    background: GOLD,
                    color: '#fff',
                    boxShadow: '0 2px 8px rgba(201,168,76,0.35)',
                  }
                : {
                    background: '#fff',
                    color: '#6b7280',
                    border: '1px solid #e5e7eb',
                  }
            }
          >
            {PLATFORM_DATA[key].label}
          </button>
        ))}
      </div>

      {/* Chart card */}
      <Card
        className="border-0 shadow-sm"
        style={{ background: '#fff', borderRadius: '16px' }}
      >
        <CardHeader>
          <CardTitle className="text-base font-semibold" style={{ color: INDIGO }}>
            {p.label} — 30-Day {p.unit === 'subscribers' ? 'Subscriber' : 'Follower'} Growth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={p.data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  tickLine={false}
                  axisLine={false}
                  interval={5}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  tickLine={false}
                  axisLine={false}
                  width={55}
                  tickFormatter={(v: number) =>
                    v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)
                  }
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="followers"
                  stroke={p.color}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: p.color }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: `Current ${p.unit}`, value: p.current },
          { label: '30-day growth', value: p.growth },
          { label: 'Growth %', value: p.pct },
          { label: 'Avg daily gain', value: p.avgDaily },
        ].map(({ label, value }) => (
          <Card
            key={label}
            className="border-0 shadow-sm text-center"
            style={{ background: '#fff', borderRadius: '14px' }}
          >
            <CardContent className="py-4">
              <div className="text-xl font-bold" style={{ color: GOLD }}>
                {value}
              </div>
              <div className="text-xs mt-1" style={{ color: '#9ca3af' }}>
                {label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trend indicator */}
      <div
        className="flex items-center gap-2 px-4 py-3 rounded-xl"
        style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.18)' }}
      >
        <TrendingUp size={16} style={{ color: '#16a34a' }} />
        <span className="text-sm font-medium" style={{ color: '#15803d' }}>
          {p.label} is growing steadily — up {p.pct} over the last 30 days.
        </span>
      </div>
    </div>
  );
}
