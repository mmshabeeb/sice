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

const CHAPTERS: any[] = [];

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
  Kochi: '#818cf8',
  Bangalore: '#34d399',
  Chennai: '#fbbf24',
  Hyderabad: '#f87171',
};

const CHAPTER_KEYS = ['Kozhikode', 'Kochi', 'Bangalore', 'Chennai', 'Hyderabad'];

/* ------------------------------------------------------------------ */
/* Rank badge                                                             */
/* ------------------------------------------------------------------ */

function RankBadge({ rank }: { rank: number }) {
  const configs: Record<number, { bg: string; color: string; icon?: boolean }> = {
    1: { bg: 'rgba(201,168,76,0.20)', color: '#C9A84C', icon: true },
    2: { bg: 'rgba(255,255,255,0.12)', color: '#e5e7eb', icon: true },
    3: { bg: 'rgba(245,158,11,0.20)', color: '#fbbf24', icon: true },
  };
  const cfg = configs[rank] ?? { bg: 'rgba(255,255,255,0.06)', color: '#9ca3af' };
  return (
    <div
      className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border border-white/5"
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
  const color = score >= 80 ? '#34d399' : score >= 60 ? GOLD : '#f87171';
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight text-white font-bricolage"
          >
            Chapter Performance
          </h1>
          <p className="text-sm mt-1 text-gray-400">
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
      <Tabs defaultValue="leaderboard" className="w-full">
        <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl">
          <TabsTrigger
            value="leaderboard"
            className="rounded-lg data-[state=active]:bg-[#C9A84C] data-[state=active]:text-slate-950 text-gray-300 font-medium"
          >
            Leaderboard
          </TabsTrigger>
          <TabsTrigger
            value="engagement"
            className="rounded-lg data-[state=active]:bg-[#C9A84C] data-[state=active]:text-slate-950 text-gray-300 font-medium"
          >
            Engagement Analytics
          </TabsTrigger>
          <TabsTrigger
            value="contracts"
            className="rounded-lg data-[state=active]:bg-[#C9A84C] data-[state=active]:text-slate-950 text-gray-300 font-medium"
          >
            Contract Activity
          </TabsTrigger>
        </TabsList>

        {/* ── Leaderboard ── */}
        <TabsContent value="leaderboard" className="mt-4">
          <Card
            className="border-0 shadow-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(240, 235, 224, 0.08)',
            }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-white font-bricolage">
                Chapter Leaderboard
              </CardTitle>
              <p className="text-xs text-gray-400">
                Composite score based on GPV, engagement, creator count and deal velocity
              </p>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <Table>
                <TableHeader className="border-white/5">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="pl-6 text-xs text-gray-400">Rank</TableHead>
                    <TableHead className="text-xs text-gray-400">Chapter</TableHead>
                    <TableHead className="text-xs text-gray-400">City</TableHead>
                    <TableHead className="text-xs text-right text-gray-400">Creators</TableHead>
                    <TableHead className="text-xs text-right text-gray-400">Campaigns</TableHead>
                    <TableHead className="text-xs text-right text-gray-400">Deals</TableHead>
                    <TableHead className="text-xs text-right text-gray-400">GPV</TableHead>
                    <TableHead className="text-xs text-right text-gray-400">Avg Eng.</TableHead>
                    <TableHead className="text-xs pr-6 text-gray-400">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {CHAPTERS.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-gray-400 text-sm">
                        No chapters found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    CHAPTERS.map((ch) => (
                      <TableRow
                        key={ch.rank}
                      className="border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <TableCell className="pl-6">
                        <RankBadge rank={ch.rank} />
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-sm text-white">
                          {ch.chapter}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-gray-400">
                          {ch.city}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium text-[#F0EBE0]">
                        {ch.creators}
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium text-[#F0EBE0]">
                        {ch.campaigns}
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium text-[#F0EBE0]">
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
                                ? 'rgba(34,197,94,0.15)'
                                : parseFloat(ch.engagement) >= 2
                                ? 'rgba(201,168,76,0.15)'
                                : 'rgba(239,68,68,0.15)',
                            color:
                              parseFloat(ch.engagement) >= 4
                                ? '#34d399'
                                : parseFloat(ch.engagement) >= 2
                                ? GOLD
                                : '#f87171',
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
                  ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Engagement Analytics ── */}
        <TabsContent value="engagement" className="mt-4">
          <Card
            className="border-0 shadow-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(240, 235, 224, 0.08)',
            }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-white font-bricolage">
                Engagement Score Trend by Chapter
              </CardTitle>
              <p className="text-xs text-gray-400">
                Average engagement rate (%) across all creators per chapter — Jan to May 2026
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={ENGAGEMENT_TREND}
                  margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fill: '#9ca3af', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={38}
                  />
                  <Tooltip
                    formatter={(value, name) => [`${value}%`, name]}
                    contentStyle={{
                      background: '#080D26',
                      border: '1px solid rgba(240, 235, 224, 0.15)',
                      borderRadius: 10,
                      fontSize: 13,
                      color: '#F0EBE0',
                    }}
                    labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 12, color: '#9ca3af' }}
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
        <TabsContent value="contracts" className="mt-4">
          <Card
            className="border-0 shadow-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(240, 235, 224, 0.08)',
            }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-white font-bricolage">
                Contracts Deployed by Chapter
              </CardTitle>
              <p className="text-xs text-gray-400">
                Total contracts deployed, currently active and completed — MTD
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={CONTRACTS_DATA}
                  margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="chapter"
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#9ca3af', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={30}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#080D26',
                      border: '1px solid rgba(240, 235, 224, 0.15)',
                      borderRadius: 10,
                      fontSize: 13,
                      color: '#F0EBE0',
                    }}
                    labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 12, color: '#9ca3af' }}
                  />
                  <Bar dataKey="deployed" name="Total Deployed" fill="#818cf8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="active" name="Currently Active" fill={GOLD} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" name="Completed" fill="#34d399" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
