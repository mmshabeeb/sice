'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Medal, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

/* ------------------------------------------------------------------ */
/* Constants                                                             */
/* ------------------------------------------------------------------ */

const GOLD = '#C9A84C';
const INDIGO = '#080D26';
const BG = '#F8F7F4';

/* ------------------------------------------------------------------ */
/* Mock data                                                             */
/* ------------------------------------------------------------------ */

const CHAPTERS = [
  {
    rank: 1,
    chapter: 'Kozhikode',
    city: 'Calicut, Kerala',
    creators: 52,
    campaigns: 8,
    deals: 28,
    gpv: '₹18,40,000',
    engagement: '5.2%',
    score: 94,
  },
  {
    rank: 2,
    chapter: 'Kochi',
    city: 'Ernakulam, Kerala',
    creators: 38,
    campaigns: 6,
    deals: 19,
    gpv: '₹12,10,000',
    engagement: '4.8%',
    score: 87,
  },
  {
    rank: 3,
    chapter: 'Bangalore',
    city: 'Bengaluru, Karnataka',
    creators: 29,
    campaigns: 5,
    deals: 12,
    gpv: '₹8,20,000',
    engagement: '4.1%',
    score: 79,
  },
  {
    rank: 4,
    chapter: 'Chennai',
    city: 'Chennai, Tamil Nadu',
    creators: 18,
    campaigns: 3,
    deals: 8,
    gpv: '₹3,10,000',
    engagement: '3.9%',
    score: 71,
  },
  {
    rank: 5,
    chapter: 'Hyderabad',
    city: 'Hyderabad, Telangana',
    creators: 10,
    campaigns: 1,
    deals: 0,
    gpv: '₹0',
    engagement: '0%',
    score: 45,
  },
];

const ENGAGEMENT_TREND = [
  { month: 'Jan', Kozhikode: 3.8, Kochi: 3.2, Bangalore: 2.9, Chennai: 2.6, Hyderabad: 0 },
  { month: 'Feb', Kozhikode: 4.1, Kochi: 3.5, Bangalore: 3.2, Chennai: 2.9, Hyderabad: 0 },
  { month: 'Mar', Kozhikode: 4.5, Kochi: 3.9, Bangalore: 3.5, Chennai: 3.2, Hyderabad: 0.8 },
  { month: 'Apr', Kozhikode: 4.9, Kochi: 4.4, Bangalore: 3.8, Chennai: 3.6, Hyderabad: 1.2 },
  { month: 'May', Kozhikode: 5.2, Kochi: 4.8, Bangalore: 4.1, Chennai: 3.9, Hyderabad: 1.8 },
];

const CONTRACTS_DATA = [
  { chapter: 'Kozhikode', deployed: 28, active: 8, completed: 20 },
  { chapter: 'Kochi', deployed: 19, active: 6, completed: 13 },
  { chapter: 'Bangalore', deployed: 12, active: 5, completed: 7 },
  { chapter: 'Chennai', deployed: 8, active: 3, completed: 5 },
  { chapter: 'Hyderabad', deployed: 1, active: 1, completed: 0 },
];

const LINE_COLORS: Record<string, string> = {
  Kozhikode: '#C9A84C',
  Kochi: '#6366f1',
  Bangalore: '#22c55e',
  Chennai: '#f59e0b',
  Hyderabad: '#ef4444',
};

const CHAPTER_KEYS = ['Kozhikode', 'Kochi', 'Bangalore', 'Chennai', 'Hyderabad'];

/* ------------------------------------------------------------------ */
/* Rank badge                                                             */
/* ------------------------------------------------------------------ */

function RankBadge({ rank }: { rank: number }) {
  const configs: Record<number, { bg: string; color: string; icon?: boolean }> = {
    1: { bg: 'rgba(201,168,76,0.15)', color: '#C9A84C', icon: true },
    2: { bg: 'rgba(107,114,128,0.12)', color: '#6b7280', icon: true },
    3: { bg: 'rgba(180,83,9,0.12)', color: '#92400e', icon: true },
  };
  const cfg = configs[rank] ?? { bg: 'rgba(8,13,38,0.06)', color: '#6b7280' };
  return (
    <div
      className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      {rank <= 3 ? <Medal size={15} /> : rank}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Score bar                                                              */
/* ------------------------------------------------------------------ */

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? '#22c55e' : score >= 60 ? GOLD : '#ef4444';
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
      <span className="text-xs font-bold tabular-nums" style={{ color }}>
        {score}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                  */
/* ------------------------------------------------------------------ */

export default function ChapterPerformancePage() {
  return (
    <div style={{ background: BG, minHeight: '100%' }} className="p-6 rounded-xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: INDIGO, fontFamily: 'var(--font-bricolage, sans-serif)' }}
          >
            Chapter Performance
          </h1>
          <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
            Comparative analytics across all active SICE chapters — May 2026
          </p>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp size={16} style={{ color: GOLD }} />
          <span className="text-sm font-medium" style={{ color: GOLD }}>
            5 Active Chapters
          </span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="leaderboard">
        <TabsList className="mb-4">
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="engagement">Engagement Analytics</TabsTrigger>
          <TabsTrigger value="contracts">Contract Activity</TabsTrigger>
        </TabsList>

        {/* ── Leaderboard ── */}
        <TabsContent value="leaderboard">
          <Card className="border-0 shadow-sm" style={{ background: '#fff', borderRadius: 14 }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold" style={{ color: INDIGO }}>
                Chapter Leaderboard
              </CardTitle>
              <p className="text-xs" style={{ color: '#9ca3af' }}>
                Composite score based on GPV, engagement, creator count and deal velocity
              </p>
            </CardHeader>
            <CardContent className="px-0">
              <Table>
                <TableHeader>
                  <TableRow style={{ borderColor: 'rgba(8,13,38,0.06)' }}>
                    <TableHead className="pl-6 text-xs" style={{ color: '#9ca3af' }}>Rank</TableHead>
                    <TableHead className="text-xs" style={{ color: '#9ca3af' }}>Chapter</TableHead>
                    <TableHead className="text-xs" style={{ color: '#9ca3af' }}>City</TableHead>
                    <TableHead className="text-xs text-right" style={{ color: '#9ca3af' }}>Creators</TableHead>
                    <TableHead className="text-xs text-right" style={{ color: '#9ca3af' }}>Campaigns</TableHead>
                    <TableHead className="text-xs text-right" style={{ color: '#9ca3af' }}>Deals</TableHead>
                    <TableHead className="text-xs text-right" style={{ color: '#9ca3af' }}>GPV</TableHead>
                    <TableHead className="text-xs text-right" style={{ color: '#9ca3af' }}>Avg Eng.</TableHead>
                    <TableHead className="text-xs pr-6" style={{ color: '#9ca3af' }}>Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {CHAPTERS.map((ch) => (
                    <TableRow
                      key={ch.rank}
                      style={{ borderColor: 'rgba(8,13,38,0.04)' }}
                      className="hover:bg-amber-50/40 transition-colors"
                    >
                      <TableCell className="pl-6">
                        <RankBadge rank={ch.rank} />
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-sm" style={{ color: INDIGO }}>
                          {ch.chapter}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs" style={{ color: '#6b7280' }}>
                          {ch.city}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium" style={{ color: INDIGO }}>
                        {ch.creators}
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium" style={{ color: INDIGO }}>
                        {ch.campaigns}
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium" style={{ color: INDIGO }}>
                        {ch.deals}
                      </TableCell>
                      <TableCell className="text-right text-sm font-semibold" style={{ color: GOLD }}>
                        {ch.gpv}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          className="text-xs font-semibold ml-auto"
                          style={{
                            background:
                              parseFloat(ch.engagement) >= 4
                                ? 'rgba(34,197,94,0.12)'
                                : parseFloat(ch.engagement) >= 2
                                ? 'rgba(201,168,76,0.12)'
                                : 'rgba(239,68,68,0.10)',
                            color:
                              parseFloat(ch.engagement) >= 4
                                ? '#22c55e'
                                : parseFloat(ch.engagement) >= 2
                                ? GOLD
                                : '#ef4444',
                            border: 'none',
                          }}
                        >
                          {ch.engagement}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-6" style={{ minWidth: 110 }}>
                        <ScoreBar score={ch.score} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Engagement Analytics ── */}
        <TabsContent value="engagement">
          <Card className="border-0 shadow-sm" style={{ background: '#fff', borderRadius: 14 }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold" style={{ color: INDIGO }}>
                Engagement Score Trend by Chapter
              </CardTitle>
              <p className="text-xs" style={{ color: '#9ca3af' }}>
                Average engagement rate (%) across all creators per chapter — Jan to May 2026
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={ENGAGEMENT_TREND}
                  margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(8,13,38,0.06)" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={38}
                  />
                  <Tooltip
                    formatter={(value, name) => [`${value}%`, name]}
                    contentStyle={{
                      background: '#fff',
                      border: '1px solid rgba(8,13,38,0.10)',
                      borderRadius: 10,
                      fontSize: 13,
                    }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 12, color: '#6b7280' }}
                  />
                  {CHAPTER_KEYS.map((key) => (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={LINE_COLORS[key]}
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: LINE_COLORS[key] }}
                      activeDot={{ r: 5 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Contract Activity ── */}
        <TabsContent value="contracts">
          <Card className="border-0 shadow-sm" style={{ background: '#fff', borderRadius: 14 }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold" style={{ color: INDIGO }}>
                Contracts Deployed by Chapter
              </CardTitle>
              <p className="text-xs" style={{ color: '#9ca3af' }}>
                Total contracts deployed, currently active and completed — MTD
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={CONTRACTS_DATA}
                  margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(8,13,38,0.06)" />
                  <XAxis
                    dataKey="chapter"
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={30}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#fff',
                      border: '1px solid rgba(8,13,38,0.10)',
                      borderRadius: 10,
                      fontSize: 13,
                    }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 12, color: '#6b7280' }}
                  />
                  <Bar dataKey="deployed" name="Total Deployed" fill={INDIGO} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="active" name="Currently Active" fill={GOLD} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" name="Completed" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
