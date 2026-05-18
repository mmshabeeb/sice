'use client';

import { Download, Link2, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const GOLD = '#C9A84C';
const INDIGO = '#080D26';
const BG = '#F8F7F4';

/* ------------------------------------------------------------------ */
/* Blueprint data                                                        */
/* ------------------------------------------------------------------ */

type Tool = 'n8n' | 'Make.com';

interface Blueprint {
  id: number;
  tool: Tool;
  title: string;
  description: string;
  webhookUrl: string;
  category: string;
}

const BLUEPRINTS: Blueprint[] = [
  {
    id: 1,
    tool: 'n8n',
    title: 'Long-form to Reels Clipper',
    description: 'Auto-clips 60-minute videos into 60-second vertical reels optimised for Instagram and YouTube Shorts.',
    webhookUrl: 'https://n8n.sice.app/webhook/reels-clipper',
    category: 'Video Production',
  },
  {
    id: 2,
    tool: 'Make.com',
    title: 'YouTube to Instagram Repurposer',
    description: 'Reformats YouTube uploads for IG Reels — resizes, adds captions, and schedules posting automatically.',
    webhookUrl: 'https://hook.make.com/yt-ig-repurpose',
    category: 'Content Repurposing',
  },
  {
    id: 3,
    tool: 'n8n',
    title: 'Caption Auto-Generator',
    description: 'Generates multilingual captions in Malayalam, Tamil, Telugu, and Kannada using AI transcription.',
    webhookUrl: 'https://n8n.sice.app/webhook/caption-gen',
    category: 'Language & Localisation',
  },
  {
    id: 4,
    tool: 'Make.com',
    title: 'Cross-platform Scheduler',
    description: 'Schedules and publishes posts across Instagram, YouTube, X, LinkedIn, and Facebook simultaneously.',
    webhookUrl: 'https://hook.make.com/cross-platform-schedule',
    category: 'Distribution',
  },
  {
    id: 5,
    tool: 'n8n',
    title: 'Engagement Monitor',
    description: 'Tracks comment sentiment across all platforms and flags brand mentions and negative comments in real time.',
    webhookUrl: 'https://n8n.sice.app/webhook/engagement-monitor',
    category: 'Analytics',
  },
  {
    id: 6,
    tool: 'Make.com',
    title: 'Invoice Auto-Sender',
    description: 'Triggers a GST-compliant invoice automatically on deal completion and sends it to the brand and creator.',
    webhookUrl: 'https://hook.make.com/invoice-auto-send',
    category: 'Finance',
  },
];

/* ------------------------------------------------------------------ */
/* Tool badge styles                                                     */
/* ------------------------------------------------------------------ */

const TOOL_STYLES: Record<Tool, { bg: string; color: string; border: string }> = {
  n8n: {
    bg: 'rgba(234,88,12,0.10)',
    color: '#c2410c',
    border: 'rgba(234,88,12,0.25)',
  },
  'Make.com': {
    bg: 'rgba(99,102,241,0.10)',
    color: '#4338ca',
    border: 'rgba(99,102,241,0.25)',
  },
};

/* ------------------------------------------------------------------ */
/* Blueprint card                                                        */
/* ------------------------------------------------------------------ */

function BlueprintCard({ bp }: { bp: Blueprint }) {
  const ts = TOOL_STYLES[bp.tool];

  function handleDownload() {
    alert(`Blueprint JSON download would start — "${bp.title}"`);
  }

  function handleCopyWebhook() {
    navigator.clipboard
      .writeText(bp.webhookUrl)
      .then(() => alert(`Webhook URL copied!\n${bp.webhookUrl}`))
      .catch(() => alert(`Webhook URL: ${bp.webhookUrl}`));
  }

  return (
    <Card
      className="border-0 shadow-sm flex flex-col"
      style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden' }}
    >
      {/* Top accent */}
      <div
        style={{
          height: '3px',
          background:
            bp.tool === 'n8n'
              ? 'linear-gradient(90deg, #ea580c, #f97316)'
              : 'linear-gradient(90deg, #6366f1, #8b5cf6)',
        }}
      />

      <CardHeader className="pb-0 pt-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-lg"
              style={{ background: ts.bg, border: `1px solid ${ts.border}` }}
            >
              <Zap size={16} style={{ color: ts.color }} />
            </div>
            <Badge
              className="text-xs font-semibold px-2"
              style={{ background: ts.bg, color: ts.color, border: `1px solid ${ts.border}` }}
            >
              {bp.tool}
            </Badge>
          </div>
          <Badge
            className="text-xs"
            style={{
              background: 'rgba(8,13,38,0.06)',
              color: '#6b7280',
              border: 'none',
              fontSize: '10px',
            }}
          >
            {bp.category}
          </Badge>
        </div>
        <CardTitle className="text-sm font-semibold mt-2" style={{ color: INDIGO }}>
          {bp.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-2 pb-4 flex flex-col gap-3 flex-1">
        <p className="text-xs leading-relaxed" style={{ color: '#6b7280', flexGrow: 1 }}>
          {bp.description}
        </p>

        {/* Webhook URL preview */}
        <div
          className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-mono truncate"
          style={{ background: '#f8f7f4', color: '#9ca3af' }}
        >
          <Link2 size={10} style={{ color: '#9ca3af', flexShrink: 0 }} />
          <span className="truncate">{bp.webhookUrl}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            className="flex-1 text-xs font-semibold h-8"
            style={{
              background: GOLD,
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
            }}
            onClick={handleDownload}
          >
            <Download size={12} />
            Download JSON
          </Button>
          <Button
            variant="outline"
            className="flex-1 text-xs font-semibold h-8"
            style={{ borderRadius: '8px' }}
            onClick={handleCopyWebhook}
          >
            <Link2 size={12} />
            Copy Webhook
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                  */
/* ------------------------------------------------------------------ */

export default function AutomationPage() {
  const n8nCount = BLUEPRINTS.filter((b) => b.tool === 'n8n').length;
  const makeCount = BLUEPRINTS.filter((b) => b.tool === 'Make.com').length;

  return (
    <div style={{ background: BG, minHeight: '100%' }} className="p-6 rounded-xl space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: INDIGO, fontFamily: 'var(--font-bricolage, sans-serif)' }}
        >
          Automation Blueprints
        </h1>
        <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
          Pre-built n8n and Make.com workflows for content repurposing, scheduling, and invoicing.
        </p>
      </div>

      {/* Summary pills */}
      <div className="flex flex-wrap gap-3">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{
            background: 'rgba(234,88,12,0.10)',
            color: '#c2410c',
            border: '1px solid rgba(234,88,12,0.20)',
          }}
        >
          <Zap size={12} />
          {n8nCount} n8n blueprints
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{
            background: 'rgba(99,102,241,0.10)',
            color: '#4338ca',
            border: '1px solid rgba(99,102,241,0.20)',
          }}
        >
          <Zap size={12} />
          {makeCount} Make.com blueprints
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{
            background: 'rgba(201,168,76,0.10)',
            color: GOLD,
            border: '1px solid rgba(201,168,76,0.20)',
          }}
        >
          {BLUEPRINTS.length} total blueprints ready
        </div>
      </div>

      {/* Blueprint grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {BLUEPRINTS.map((bp) => (
          <BlueprintCard key={bp.id} bp={bp} />
        ))}
      </div>
    </div>
  );
}
