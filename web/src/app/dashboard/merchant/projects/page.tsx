'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  MessageSquare,
  RotateCcw,
  Eye,
  ThumbsUp,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

/* ------------------------------------------------------------------ */
/* Brand tokens                                                          */
/* ------------------------------------------------------------------ */
const GOLD = '#C9A84C';
const INDIGO = '#080D26';
const BG = '#F8F7F4';

/* ------------------------------------------------------------------ */
/* Types & mock data                                                     */
/* ------------------------------------------------------------------ */
type DeliverableStatus = 'pending' | 'submitted' | 'revision' | 'approved';

interface FeedbackEntry {
  author: string;
  role: 'merchant' | 'creator';
  message: string;
  timestamp: string;
}

interface Deliverable {
  id: string;
  creator: string;
  title: string;
  campaign: string;
  status: DeliverableStatus;
  dueDate?: string;
  submittedDate?: string;
  approvedDate?: string;
  feedback?: FeedbackEntry[];
  note?: string;
}

const ALL_DELIVERABLES: Deliverable[] = [];

const CAMPAIGNS = [
  'All Campaigns',
  'Kerala Onam Campaign',
  'South India Launch Series',
  'Festive Creator Program',
];

/* ------------------------------------------------------------------ */
/* Column config                                                         */
/* ------------------------------------------------------------------ */
const COLUMNS: {
  id: DeliverableStatus;
  label: string;
  color: string;
  bg: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
}[] = [
  { id: 'pending', label: 'Pending', color: '#fbbf24', bg: 'rgba(251,191,36,0.15)', icon: Clock },
  { id: 'submitted', label: 'Submitted', color: '#818cf8', bg: 'rgba(99,102,241,0.15)', icon: Eye },
  { id: 'revision', label: 'Revision Requested', color: '#f87171', bg: 'rgba(220,38,38,0.15)', icon: RotateCcw },
  { id: 'approved', label: 'Approved', color: '#4ade80', bg: 'rgba(34,197,94,0.15)', icon: CheckCircle2 },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                               */
/* ------------------------------------------------------------------ */
function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('');
}

/* ------------------------------------------------------------------ */
/* Deliverable card                                                      */
/* ------------------------------------------------------------------ */
function DeliverableCard({
  item,
  onAction,
}: {
  item: Deliverable;
  onAction: (id: string, action: 'approve' | 'requestRevision' | 'review') => void;
}) {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <Card
      className="border-0 shadow-sm mb-3"
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(240, 235, 224, 0.08)',
        borderRadius: 12,
      }}
    >
      <CardContent className="p-3.5 space-y-2.5">
        {/* Creator + deliverable */}
        <div className="flex items-start gap-2.5">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold text-white shrink-0 border border-white/10 bg-white/10"
          >
            {getInitials(item.creator)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm leading-tight text-white font-bricolage">
              {item.title}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">{item.creator}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">{item.campaign}</div>
          </div>
        </div>

        {/* Metadata */}
        <div className="space-y-1">
          {item.dueDate && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Clock size={11} className="text-amber-500" />
              Due {item.dueDate}
            </div>
          )}
          {item.submittedDate && item.status !== 'revision' && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <CheckCircle2 size={11} className="text-indigo-400" />
              Submitted {item.submittedDate}
            </div>
          )}
          {item.submittedDate && item.status === 'revision' && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Clock size={11} className="text-gray-500" />
              Submitted {item.submittedDate}
            </div>
          )}
          {item.approvedDate && (
            <div className="flex items-center gap-1.5 text-xs text-green-400 font-semibold">
              <CheckCircle2 size={11} /> Approved {item.approvedDate}
            </div>
          )}
          {item.note && (
            <div className="text-[10px] font-semibold text-indigo-400 flex items-center gap-1">
              <AlertCircle size={10} /> {item.note}
            </div>
          )}
        </div>

        {/* Feedback thread (revision card) */}
        {item.status === 'revision' && item.feedback && item.feedback.length > 0 && (
          <div>
            <button
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
              onClick={() => setFeedbackOpen((o) => !o)}
            >
              <MessageSquare size={11} />
              {item.feedback.length} message{item.feedback.length !== 1 ? 's' : ''}
              <ChevronDown
                size={11}
                className={`transition-transform ${feedbackOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {feedbackOpen && (
              <div className="mt-2 space-y-2 pl-1 border-l-2 border-white/10">
                {item.feedback.map((fb, idx) => (
                  <div key={idx} className="pl-2">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-slate-950"
                        style={{
                          background: fb.role === 'merchant' ? '#C9A84C' : '#818cf8',
                        }}
                      >
                        {fb.author[0]}
                      </div>
                      <span
                        className="text-[10px] font-semibold text-gray-300"
                      >
                        {fb.author}
                      </span>
                      <span className="text-[10px] text-gray-500">{fb.timestamp}</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{fb.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-1.5 pt-1">
          {item.status === 'pending' && (
            <Button
              variant="outline"
              className="h-7 text-xs flex-1 border-white/10 text-gray-500 bg-transparent cursor-default"
            >
              <Clock size={11} className="mr-1" /> Awaiting
            </Button>
          )}
          {item.status === 'submitted' && (
            <>
              <Button
                className="h-7 text-xs flex-1 font-bold bg-[#C9A84C] hover:bg-[#b0913b] text-slate-950"
                style={{ border: 'none' }}
                onClick={() => onAction(item.id, 'approve')}
              >
                <ThumbsUp size={11} className="mr-1" /> Approve
              </Button>
              <Button
                variant="outline"
                className="h-7 text-xs flex-1 border-red-500/20 text-red-400 bg-transparent hover:bg-red-950/20"
                onClick={() => onAction(item.id, 'requestRevision')}
              >
                <RotateCcw size={11} className="mr-1" /> Revise
              </Button>
            </>
          )}
          {item.status === 'revision' && (
            <Button
              variant="outline"
              className="h-7 text-xs flex-1 border-white/10 text-gray-300 hover:bg-white/5 hover:text-white bg-transparent"
              onClick={() => onAction(item.id, 'review')}
            >
              <Eye size={11} className="mr-1" /> View Submission
            </Button>
          )}
          {item.status === 'approved' && (
            <Button
              variant="outline"
              className="h-7 text-xs flex-1 border-green-500/20 text-green-400 bg-transparent hover:bg-green-950/20"
            >
              <CheckCircle2 size={11} className="mr-1" /> Payment Released
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                  */
/* ------------------------------------------------------------------ */
export default function ProjectsPage() {
  const [selectedCampaign, setSelectedCampaign] = useState('All Campaigns');
  const [deliverables, setDeliverables] = useState<Deliverable[]>(ALL_DELIVERABLES);

  const handleAction = (id: string, action: 'approve' | 'requestRevision' | 'review') => {
    if (action === 'approve') {
      setDeliverables((prev) =>
        prev.map((d) =>
          d.id === id
            ? { ...d, status: 'approved', approvedDate: 'May 2025' }
            : d
        )
      );
    } else if (action === 'requestRevision') {
      setDeliverables((prev) =>
        prev.map((d) =>
          d.id === id
            ? {
                ...d,
                status: 'revision',
                feedback: [
                  {
                    author: 'Malabar Gold',
                    role: 'merchant',
                    message: 'Please review and resubmit with the requested changes.',
                    timestamp: 'Just now',
                  },
                ],
              }
            : d
        )
      );
    }
  };

  const filtered =
    selectedCampaign === 'All Campaigns'
      ? deliverables
      : deliverables.filter((d) => d.campaign === selectedCampaign);

  const counts = COLUMNS.reduce(
    (acc, col) => ({
      ...acc,
      [col.id]: filtered.filter((d) => d.status === col.id).length,
    }),
    {} as Record<DeliverableStatus, number>
  );

  return (
    <div className="space-y-6">
      {/* ── Page header ── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-bricolage">
            Projects &amp; Deliverables
          </h1>
          <p className="text-sm mt-1 text-gray-400">
            Review, approve, or request revisions on creator-submitted content.
          </p>
        </div>

        {/* Campaign selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Filter by:</span>
          <Select value={selectedCampaign} onValueChange={(v) => setSelectedCampaign(v ?? "")}>
            <SelectTrigger className="h-9 text-sm min-w-52 bg-white/5 border-white/10 text-white focus:ring-[#C9A84C]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-950 border-white/10 text-white">
              {CAMPAIGNS.map((c) => (
                <SelectItem key={c} value={c} className="focus:bg-white/5 focus:text-white">
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Summary badges ── */}
      <div className="flex flex-wrap gap-2">
        {COLUMNS.map((col) => (
          <div
            key={col.id}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-white/5"
            style={{ background: col.bg, color: col.color }}
          >
            <col.icon size={12} />
            {col.label}: {counts[col.id]}
          </div>
        ))}
      </div>

      {/* ── Kanban board ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {COLUMNS.map((col) => {
          const items = filtered.filter((d) => d.status === col.id);
          return (
            <div key={col.id}>
              {/* Column header */}
              <div
                className="flex items-center gap-2 mb-3 px-1"
              >
                <div
                  className="flex items-center justify-center w-6 h-6 rounded-md border border-white/5"
                  style={{ background: col.bg }}
                >
                  <col.icon size={13} style={{ color: col.color }} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-300 font-bricolage">
                  {col.label}
                </span>
                <span
                  className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full border border-white/5"
                  style={{ background: col.bg, color: col.color }}
                >
                  {items.length}
                </span>
              </div>

              {/* Cards */}
              <div
                className="min-h-28 rounded-xl p-2 border border-white/5"
                style={{ background: 'rgba(255, 255, 255, 0.01)' }}
              >
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <col.icon size={20} style={{ color: col.color, opacity: 0.3 }} />
                    <p className="text-xs text-gray-500 mt-2">No deliverables</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <DeliverableCard key={item.id} item={item} onAction={handleAction} />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
