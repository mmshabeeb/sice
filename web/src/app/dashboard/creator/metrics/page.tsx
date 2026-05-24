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
    data: generateDays(0, 0),
    current: '0',
    growth: '0',
    pct: '0.00%',
    avgDaily: '0',
    unit: 'followers',
  },
  youtube: {
    label: 'YouTube',
    color: '#FF0000',
    data: generateDays(0, 0),
    current: '0',
    growth: '0',
    pct: '0.00%',
    avgDaily: '0',
    unit: 'subscribers',
  },
  x: {
    label: 'X (Twitter)',
    color: '#f8fafc', // readable white/light-gray instead of dark gray
    data: generateDays(0, 0),
    current: '0',
    growth: '0',
    pct: '0.00%',
    avgDaily: '0',
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
      className="px-3 py-2 rounded-xl text-xs shadow-lg border"
      style={{ background: 'rgba(15, 23, 42, 0.95)', borderColor: 'rgba(240, 235, 224, 0.08)', color: '#fff' }}
    >
      <div className="font-semibold">{label}</div>
      <div style={{ color: GOLD }} className="mt-0.5 font-bricolage font-bold">
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight text-white font-bricolage"
          >
            Follower Metrics
          </h1>
          <p className="text-sm mt-1 text-gray-400">
            30-day growth trends across your connected platforms.
          </p>
        </div>
        <div
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[#C9A84C]/30"
          style={{
            background: 'rgba(201,168,76,0.10)',
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
            className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all border border-white/5"
            style={
              active === key
                ? {
                    background: GOLD,
                    color: '#0f172a',
                    boxShadow: '0 2px 8px rgba(201,168,76,0.35)',
                    borderColor: GOLD,
                  }
                : {
                    background: 'rgba(255, 255, 255, 0.02)',
                    color: '#9ca3af',
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
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(240, 235, 224, 0.08)',
          borderRadius: '16px',
        }}
      >
        <CardHeader>
          <CardTitle className="text-base font-semibold text-white font-bricolage">
            {p.label} — 30-Day {p.unit === 'subscribers' ? 'Subscriber' : 'Follower'} Growth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={p.data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
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
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(240, 235, 224, 0.08)',
              borderRadius: '14px',
            }}
          >
            <CardContent className="py-4">
              <div className="text-xl font-bold text-[#C9A84C] font-bricolage">
                {value}
              </div>
              <div className="text-xs mt-1 text-gray-400">
                {label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trend indicator */}
      <div
        className="flex items-center gap-2 px-4 py-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10"
      >
        <TrendingUp size={16} className="text-emerald-400" />
        <span className="text-sm font-medium text-emerald-400">
          {p.label} is growing steadily — up {p.pct} over the last 30 days.
        </span>
      </div>
    </div>
  );
}
