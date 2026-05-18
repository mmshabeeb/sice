'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  Scale,
  Eye,
  FileSearch,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Upload,
  DollarSign,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

/* ------------------------------------------------------------------ */
/* Constants                                                             */
/* ------------------------------------------------------------------ */

const GOLD = '#C9A84C';
const INDIGO = '#080D26';
const BG = '#F8F7F4';

type Severity = 'HIGH' | 'MEDIUM' | 'LOW';
type CaseStatus = 'Open' | 'Under Review' | 'Monitoring' | 'Resolved';
type CaseType = 'Missed Deadline' | 'Repeated Content Rejection' | 'Payment Dispute';

/* ------------------------------------------------------------------ */
/* Mock data                                                             */
/* ------------------------------------------------------------------ */

interface ArbitrationCase {
  id: string;
  type: CaseType;
  campaign: string;
  creator: string;
  merchant: string;
  daysOpen: number;
  severity: Severity;
  status: CaseStatus;
  amount: string;
  deliverables: string;
  commLog: { sender: string; time: string; message: string }[];
  fileHistory: { name: string; submittedBy: string; date: string; status: string }[];
}

const CASES: ArbitrationCase[] = [
  {
    id: 'ARB-001',
    type: 'Missed Deadline',
    campaign: 'Kerala Onam Campaign',
    creator: 'Arjun Menon',
    merchant: 'Malabar Gold',
    daysOpen: 3,
    severity: 'HIGH',
    status: 'Open',
    amount: '₹1,40,000',
    deliverables: '3 Instagram Reels + 2 Stories within 7 days of contract execution',
    commLog: [
      {
        sender: 'Malabar Gold',
        time: 'May 15, 2026 — 10:22 AM',
        message:
          'The deadline for all 3 reels was May 14th. We have received only 1 reel so far. Please clarify the delay.',
      },
      {
        sender: 'Arjun Menon',
        time: 'May 15, 2026 — 2:48 PM',
        message:
          'Apologies for the delay. I had a family emergency. The remaining 2 reels will be submitted by May 18th.',
      },
      {
        sender: 'Malabar Gold',
        time: 'May 16, 2026 — 9:15 AM',
        message:
          'We understand, but per contract clause 4.2, a 15% penalty applies per missed day. We are raising this for arbitration.',
      },
    ],
    fileHistory: [
      { name: 'reel_draft_1.mp4', submittedBy: 'Arjun Menon', date: 'May 12, 2026', status: 'Approved' },
      { name: 'reel_draft_2.mp4', submittedBy: 'Arjun Menon', date: 'May 16, 2026', status: 'Pending Review' },
    ],
  },
  {
    id: 'ARB-002',
    type: 'Repeated Content Rejection',
    campaign: 'South India Launch',
    creator: 'Priya Nair',
    merchant: 'KFC India',
    daysOpen: 5,
    severity: 'HIGH',
    status: 'Under Review',
    amount: '₹88,000',
    deliverables: '5 Instagram Posts (product showcase) within 10 days',
    commLog: [
      {
        sender: 'KFC India',
        time: 'May 13, 2026 — 11:00 AM',
        message: 'Draft 1 rejected — image quality does not meet brand standards. Please resubmit.',
      },
      {
        sender: 'Priya Nair',
        time: 'May 13, 2026 — 3:00 PM',
        message: 'Resubmitting with professional lighting as requested.',
      },
      {
        sender: 'KFC India',
        time: 'May 14, 2026 — 10:30 AM',
        message: 'Draft 2 also rejected — caption does not include required hashtags per brief.',
      },
      {
        sender: 'Priya Nair',
        time: 'May 14, 2026 — 5:00 PM',
        message:
          'I have reviewed the brief multiple times. The hashtags were included. This feels arbitrary. Requesting admin review.',
      },
    ],
    fileHistory: [
      { name: 'post_draft_1.jpg', submittedBy: 'Priya Nair', date: 'May 13, 2026', status: 'Rejected' },
      { name: 'post_draft_2.jpg', submittedBy: 'Priya Nair', date: 'May 13, 2026', status: 'Rejected' },
      { name: 'post_draft_3.jpg', submittedBy: 'Priya Nair', date: 'May 14, 2026', status: 'Under Review' },
    ],
  },
  {
    id: 'ARB-003',
    type: 'Payment Dispute',
    campaign: 'Beauty Edit',
    creator: 'Meera Pillai',
    merchant: 'Nykaa',
    daysOpen: 1,
    severity: 'MEDIUM',
    status: 'Open',
    amount: '₹62,000',
    deliverables: '4 YouTube reviews (min. 8 min each) + affiliate link tracking for 30 days',
    commLog: [
      {
        sender: 'Meera Pillai',
        time: 'May 17, 2026 — 8:45 AM',
        message:
          'All 4 reviews have been published and verified. Affiliate link period ended on May 10th. Payment of ₹62,000 is overdue by 7 days.',
      },
      {
        sender: 'Nykaa',
        time: 'May 17, 2026 — 1:30 PM',
        message:
          'We are disputing the affiliate tracking numbers. Our internal dashboard shows different click counts than what was submitted.',
      },
    ],
    fileHistory: [
      { name: 'youtube_analytics_export.pdf', submittedBy: 'Meera Pillai', date: 'May 10, 2026', status: 'Submitted' },
      { name: 'affiliate_clicks_report.xlsx', submittedBy: 'Meera Pillai', date: 'May 10, 2026', status: 'Disputed' },
    ],
  },
  {
    id: 'ARB-004',
    type: 'Missed Deadline',
    campaign: 'Education Program',
    creator: 'Rahul Suresh',
    merchant: "Byju's",
    daysOpen: 7,
    severity: 'LOW',
    status: 'Monitoring',
    amount: '₹45,000',
    deliverables: '2 YouTube Videos + 3 Shorts within 14 days',
    commLog: [
      {
        sender: "Byju's",
        time: 'May 11, 2026 — 9:00 AM',
        message: 'Deadline passed on May 10th. No content submitted yet. Please provide an update.',
      },
      {
        sender: 'Rahul Suresh',
        time: 'May 12, 2026 — 11:00 AM',
        message:
          'The scripts were approved on May 8th but re-editing was requested on May 9th by the brand team. Content will be ready by May 20th.',
      },
      {
        sender: 'Admin',
        time: 'May 13, 2026 — 10:00 AM',
        message:
          'Reviewing internal communications. Both parties agreed to extend deadline to May 20th verbally. Monitoring in progress.',
      },
    ],
    fileHistory: [
      { name: 'script_v1.docx', submittedBy: 'Rahul Suresh', date: 'May 6, 2026', status: 'Approved' },
      { name: 'script_v2.docx', submittedBy: 'Rahul Suresh', date: 'May 9, 2026', status: 'Under Review' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Config maps                                                            */
/* ------------------------------------------------------------------ */

const SEVERITY_CONFIG: Record<Severity, { bg: string; color: string }> = {
  HIGH: { bg: 'rgba(239,68,68,0.12)', color: '#dc2626' },
  MEDIUM: { bg: 'rgba(245,158,11,0.12)', color: '#d97706' },
  LOW: { bg: 'rgba(34,197,94,0.12)', color: '#16a34a' },
};

const STATUS_CONFIG: Record<CaseStatus, { bg: string; color: string }> = {
  Open: { bg: 'rgba(239,68,68,0.10)', color: '#dc2626' },
  'Under Review': { bg: 'rgba(99,102,241,0.12)', color: '#6366f1' },
  Monitoring: { bg: 'rgba(245,158,11,0.10)', color: '#d97706' },
  Resolved: { bg: 'rgba(34,197,94,0.12)', color: '#16a34a' },
};

const TYPE_ICONS: Record<CaseType, React.ElementType> = {
  'Missed Deadline': AlertTriangle,
  'Repeated Content Rejection': FileSearch,
  'Payment Dispute': DollarSign,
};

const FILE_STATUS_CONFIG: Record<string, { color: string }> = {
  Approved: { color: '#16a34a' },
  Rejected: { color: '#dc2626' },
  'Under Review': { color: '#d97706' },
  'Pending Review': { color: '#6366f1' },
  Submitted: { color: '#6b7280' },
  Disputed: { color: '#dc2626' },
};

/* ------------------------------------------------------------------ */
/* Arbitration Workspace Dialog                                           */
/* ------------------------------------------------------------------ */

function ArbitrationWorkspaceDialog({
  arbitrationCase,
  open,
  onOpenChange,
}: {
  arbitrationCase: ArbitrationCase;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [confirmAction, setConfirmAction] = useState<'release' | 'refund' | null>(null);
  const [resolveReason, setResolveReason] = useState('');
  const [resolved, setResolved] = useState(false);

  function handleConfirm() {
    setResolved(true);
    setConfirmAction(null);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-2xl"
        style={{ background: '#fff', borderRadius: 16, maxHeight: '90vh', overflowY: 'auto' }}
      >
        <DialogHeader>
          <div className="flex items-center gap-3 flex-wrap">
            <Scale size={18} style={{ color: GOLD }} />
            <DialogTitle style={{ color: INDIGO }}>
              Arbitration Workspace — {arbitrationCase.id}
            </DialogTitle>
            <Badge
              className="text-xs"
              style={{
                background: SEVERITY_CONFIG[arbitrationCase.severity].bg,
                color: SEVERITY_CONFIG[arbitrationCase.severity].color,
                border: 'none',
              }}
            >
              {arbitrationCase.severity}
            </Badge>
          </div>
        </DialogHeader>

        {resolved && (
          <div
            className="flex items-center gap-2 p-3 rounded-xl text-sm"
            style={{ background: 'rgba(34,197,94,0.10)', border: '1px solid rgba(34,197,94,0.20)', color: '#16a34a' }}
          >
            <CheckCircle2 size={15} />
            Case resolved. Both parties have been notified and escrow action has been executed.
          </div>
        )}

        <div className="space-y-5">
          {/* Contract Summary */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: '#9ca3af' }}>
              Contract Summary
            </h3>
            <div
              className="p-4 rounded-xl space-y-2.5"
              style={{ background: 'rgba(8,13,38,0.03)', border: '1px solid rgba(8,13,38,0.07)' }}
            >
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-xs" style={{ color: '#9ca3af' }}>Creator</span>
                  <p className="font-semibold mt-0.5" style={{ color: INDIGO }}>{arbitrationCase.creator}</p>
                </div>
                <div>
                  <span className="text-xs" style={{ color: '#9ca3af' }}>Merchant</span>
                  <p className="font-semibold mt-0.5" style={{ color: INDIGO }}>{arbitrationCase.merchant}</p>
                </div>
                <div>
                  <span className="text-xs" style={{ color: '#9ca3af' }}>Campaign</span>
                  <p className="font-semibold mt-0.5" style={{ color: INDIGO }}>{arbitrationCase.campaign}</p>
                </div>
                <div>
                  <span className="text-xs" style={{ color: '#9ca3af' }}>Escrow Amount</span>
                  <p className="font-bold mt-0.5" style={{ color: GOLD }}>{arbitrationCase.amount}</p>
                </div>
              </div>
              <div>
                <span className="text-xs" style={{ color: '#9ca3af' }}>Deliverables</span>
                <p className="text-sm mt-0.5" style={{ color: INDIGO }}>{arbitrationCase.deliverables}</p>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Badge
                  className="text-xs font-semibold"
                  style={{
                    background: STATUS_CONFIG[arbitrationCase.status].bg,
                    color: STATUS_CONFIG[arbitrationCase.status].color,
                    border: 'none',
                  }}
                >
                  {arbitrationCase.status}
                </Badge>
                <span className="text-xs" style={{ color: '#6b7280' }}>
                  Open for {arbitrationCase.daysOpen} day{arbitrationCase.daysOpen !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Communication Log */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: '#9ca3af' }}>
              <MessageSquare size={12} className="inline mr-1.5" />
              Communication Log
            </h3>
            <div className="space-y-3">
              {arbitrationCase.commLog.map((entry, i) => {
                const isAdmin = entry.sender === 'Admin';
                const isCreator = entry.sender === arbitrationCase.creator;
                return (
                  <div
                    key={i}
                    className="flex gap-3"
                    style={{ flexDirection: isCreator ? 'row' : 'row-reverse' }}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{
                        background: isAdmin
                          ? 'rgba(201,168,76,0.15)'
                          : isCreator
                          ? 'rgba(99,102,241,0.12)'
                          : 'rgba(8,13,38,0.08)',
                        color: isAdmin ? GOLD : isCreator ? '#6366f1' : INDIGO,
                      }}
                    >
                      {entry.sender[0]}
                    </div>
                    <div
                      className="flex-1 p-3 rounded-xl text-sm"
                      style={{
                        background: isCreator
                          ? 'rgba(99,102,241,0.07)'
                          : isAdmin
                          ? 'rgba(201,168,76,0.08)'
                          : 'rgba(8,13,38,0.04)',
                        border: isAdmin ? '1px solid rgba(201,168,76,0.20)' : '1px solid rgba(8,13,38,0.06)',
                      }}
                    >
                      <div className="flex items-center justify-between mb-1 flex-wrap gap-1">
                        <span
                          className="text-xs font-semibold"
                          style={{ color: isAdmin ? GOLD : isCreator ? '#6366f1' : INDIGO }}
                        >
                          {entry.sender}
                        </span>
                        <span className="text-xs" style={{ color: '#9ca3af' }}>
                          {entry.time}
                        </span>
                      </div>
                      <p style={{ color: '#374151', lineHeight: 1.5 }}>{entry.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* File Submission History */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: '#9ca3af' }}>
              <Upload size={12} className="inline mr-1.5" />
              File Submission History
            </h3>
            <div className="space-y-1.5">
              {arbitrationCase.fileHistory.map((file, i) => {
                const fc = FILE_STATUS_CONFIG[file.status] ?? { color: '#6b7280' };
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 rounded-lg text-sm"
                    style={{ background: 'rgba(8,13,38,0.03)', border: '1px solid rgba(8,13,38,0.05)' }}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Upload size={12} style={{ color: '#9ca3af' }} />
                      <span className="font-medium truncate" style={{ color: INDIGO }}>
                        {file.name}
                      </span>
                      <span className="text-xs shrink-0" style={{ color: '#9ca3af' }}>
                        by {file.submittedBy} · {file.date}
                      </span>
                    </div>
                    <Badge
                      className="text-xs shrink-0"
                      style={{ background: `${fc.color}18`, color: fc.color, border: 'none' }}
                    >
                      {file.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Resolution section */}
          {!resolved && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: '#9ca3af' }}>
                Resolution
              </h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs font-semibold" style={{ color: '#374151' }}>
                    Resolution Notes / Reason
                  </Label>
                  <Textarea
                    value={resolveReason}
                    onChange={(e) => setResolveReason(e.target.value)}
                    placeholder="Document your arbitration decision, findings, and reasoning…"
                    rows={3}
                    className="mt-1.5"
                    style={{ border: '1px solid rgba(8,13,38,0.15)', borderRadius: 8, resize: 'none' }}
                  />
                </div>

                {confirmAction && (
                  <div
                    className="p-3 rounded-xl space-y-2"
                    style={{
                      background:
                        confirmAction === 'release'
                          ? 'rgba(34,197,94,0.08)'
                          : 'rgba(239,68,68,0.08)',
                      border: `1px solid ${confirmAction === 'release' ? 'rgba(34,197,94,0.20)' : 'rgba(239,68,68,0.20)'}`,
                    }}
                  >
                    <p className="text-sm font-semibold" style={{ color: INDIGO }}>
                      {confirmAction === 'release'
                        ? `Confirm: Release ${arbitrationCase.amount} to ${arbitrationCase.creator}?`
                        : `Confirm: Issue ${arbitrationCase.amount} refund to ${arbitrationCase.merchant}?`}
                    </p>
                    <p className="text-xs" style={{ color: '#6b7280' }}>
                      This action is irreversible and will be logged in the platform audit trail.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="gap-1.5"
                        onClick={handleConfirm}
                        style={{
                          background: confirmAction === 'release' ? '#22c55e' : '#ef4444',
                          color: '#fff',
                          borderRadius: 7,
                          border: 'none',
                        }}
                      >
                        <CheckCircle2 size={12} />
                        Confirm &amp; Execute
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setConfirmAction(null)}
                        style={{ borderRadius: 7, color: '#6b7280' }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {!confirmAction && (
                  <div className="flex gap-3 flex-wrap">
                    <Button
                      className="gap-2 flex-1"
                      style={{
                        background: '#22c55e',
                        color: '#fff',
                        borderRadius: 9,
                        border: 'none',
                        fontWeight: 600,
                      }}
                      onClick={() => setConfirmAction('release')}
                    >
                      <DollarSign size={14} />
                      Release Payment to Creator
                    </Button>
                    <Button
                      className="gap-2 flex-1"
                      style={{
                        background: '#ef4444',
                        color: '#fff',
                        borderRadius: 9,
                        border: 'none',
                        fontWeight: 600,
                      }}
                      onClick={() => setConfirmAction('refund')}
                    >
                      <RotateCcw size={14} />
                      Issue Merchant Refund
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                  */
/* ------------------------------------------------------------------ */

export default function ArbitrationPage() {
  const [selectedCase, setSelectedCase] = useState<ArbitrationCase | null>(null);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);

  const urgentCases = CASES.filter(
    (c) => c.severity === 'HIGH' && (c.status === 'Open' || c.status === 'Under Review')
  );

  function openWorkspace(c: ArbitrationCase) {
    setSelectedCase(c);
    setWorkspaceOpen(true);
  }

  function getActionButton(c: ArbitrationCase) {
    if (c.status === 'Open') {
      return (
        <Button
          size="sm"
          className="h-7 px-3 text-xs font-semibold gap-1"
          onClick={() => openWorkspace(c)}
          style={{ background: '#ef4444', color: '#fff', borderRadius: 7, border: 'none' }}
        >
          <Scale size={11} />
          Resolve
        </Button>
      );
    }
    if (c.status === 'Under Review') {
      return (
        <Button
          size="sm"
          variant="outline"
          className="h-7 px-3 text-xs gap-1"
          onClick={() => openWorkspace(c)}
          style={{ border: '1px solid rgba(201,168,76,0.35)', color: GOLD, borderRadius: 7 }}
        >
          <FileSearch size={11} />
          Audit
        </Button>
      );
    }
    return (
      <Button
        size="sm"
        variant="outline"
        className="h-7 px-3 text-xs gap-1"
        onClick={() => openWorkspace(c)}
        style={{ border: '1px solid rgba(8,13,38,0.15)', color: INDIGO, borderRadius: 7 }}
      >
        <Eye size={11} />
        View
      </Button>
    );
  }

  return (
    <div style={{ background: BG, minHeight: '100%' }} className="p-6 rounded-xl space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: INDIGO, fontFamily: 'var(--font-bricolage, sans-serif)' }}
        >
          Arbitration &amp; Conflict Resolution
        </h1>
        <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
          Review, mediate, and resolve disputes between creators and merchants
        </p>
      </div>

      {/* Alert banner */}
      {urgentCases.length > 0 && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.25)',
          }}
        >
          <AlertCircle size={18} style={{ color: '#dc2626' }} className="shrink-0" />
          <div>
            <p className="text-sm font-semibold" style={{ color: '#dc2626' }}>
              {urgentCases.length} case{urgentCases.length > 1 ? 's' : ''} require immediate attention
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#ef4444' }}>
              {urgentCases.map((c) => c.id).join(', ')} — HIGH severity disputes are open and unresolved
            </p>
          </div>
        </div>
      )}

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Open Cases', value: CASES.filter((c) => c.status === 'Open').length, color: '#dc2626', bg: 'rgba(239,68,68,0.08)' },
          { label: 'Under Review', value: CASES.filter((c) => c.status === 'Under Review').length, color: '#6366f1', bg: 'rgba(99,102,241,0.08)' },
          { label: 'Monitoring', value: CASES.filter((c) => c.status === 'Monitoring').length, color: '#d97706', bg: 'rgba(245,158,11,0.08)' },
          { label: 'HIGH Severity', value: CASES.filter((c) => c.severity === 'HIGH').length, color: '#dc2626', bg: 'rgba(239,68,68,0.06)' },
        ].map(({ label, value, color, bg }) => (
          <Card key={label} className="border-0 shadow-sm" style={{ background: '#fff', borderRadius: 14 }}>
            <CardContent className="flex items-center gap-3 py-4 px-5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: bg }}
              >
                <AlertTriangle size={16} style={{ color }} />
              </div>
              <div>
                <div className="text-xl font-bold" style={{ color: INDIGO }}>{value}</div>
                <div className="text-xs" style={{ color: '#9ca3af' }}>{label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cases table */}
      <Card className="border-0 shadow-sm" style={{ background: '#fff', borderRadius: 14 }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold" style={{ color: INDIGO }}>
            Active Cases
          </CardTitle>
          <p className="text-xs" style={{ color: '#9ca3af' }}>
            All open and in-progress arbitration cases across the platform
          </p>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader>
              <TableRow style={{ borderColor: 'rgba(8,13,38,0.06)' }}>
                <TableHead className="pl-6 text-xs" style={{ color: '#9ca3af' }}>Case #</TableHead>
                <TableHead className="text-xs" style={{ color: '#9ca3af' }}>Type</TableHead>
                <TableHead className="text-xs" style={{ color: '#9ca3af' }}>Campaign</TableHead>
                <TableHead className="text-xs" style={{ color: '#9ca3af' }}>Parties</TableHead>
                <TableHead className="text-xs text-center" style={{ color: '#9ca3af' }}>Days Open</TableHead>
                <TableHead className="text-xs" style={{ color: '#9ca3af' }}>Severity</TableHead>
                <TableHead className="text-xs" style={{ color: '#9ca3af' }}>Status</TableHead>
                <TableHead className="text-xs pr-6" style={{ color: '#9ca3af' }}>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CASES.map((c) => {
                const TypeIcon = TYPE_ICONS[c.type];
                const sev = SEVERITY_CONFIG[c.severity];
                const sta = STATUS_CONFIG[c.status];
                return (
                  <TableRow
                    key={c.id}
                    style={{ borderColor: 'rgba(8,13,38,0.04)' }}
                    className="hover:bg-red-50/20 transition-colors"
                  >
                    <TableCell className="pl-6">
                      <span className="font-mono text-sm font-bold" style={{ color: GOLD }}>
                        {c.id}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <TypeIcon size={13} style={{ color: '#6b7280' }} />
                        <span className="text-xs font-medium" style={{ color: INDIGO }}>
                          {c.type}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs" style={{ color: '#6b7280' }}>
                        {c.campaign}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs" style={{ color: INDIGO }}>
                        <span className="font-medium">{c.creator}</span>
                        <span style={{ color: '#9ca3af' }}> vs </span>
                        <span className="font-medium">{c.merchant}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className="text-sm font-bold"
                        style={{ color: c.daysOpen >= 5 ? '#dc2626' : c.daysOpen >= 3 ? '#d97706' : INDIGO }}
                      >
                        {c.daysOpen}d
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className="text-xs font-bold"
                        style={{ background: sev.bg, color: sev.color, border: 'none' }}
                      >
                        {c.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className="text-xs font-semibold"
                        style={{ background: sta.bg, color: sta.color, border: 'none' }}
                      >
                        {c.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6">
                      {getActionButton(c)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div
            className="px-6 py-3 text-xs flex items-center justify-between"
            style={{ borderTop: '1px solid rgba(8,13,38,0.06)', color: '#9ca3af' }}
          >
            <span>{CASES.length} total cases · 2 require immediate resolution</span>
            <span>All actions are logged in the platform audit trail</span>
          </div>
        </CardContent>
      </Card>

      {/* Workspace dialog */}
      {selectedCase && (
        <ArbitrationWorkspaceDialog
          arbitrationCase={selectedCase}
          open={workspaceOpen}
          onOpenChange={setWorkspaceOpen}
        />
      )}
    </div>
  );
}
