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

const CASES: ArbitrationCase[] = [];

/* ------------------------------------------------------------------ */
/* Config maps                                                            */
/* ------------------------------------------------------------------ */

const SEVERITY_CONFIG: Record<Severity, { bg: string; color: string }> = {
  HIGH: { bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
  MEDIUM: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
  LOW: { bg: 'rgba(34,197,94,0.15)', color: '#34d399' },
};

const STATUS_CONFIG: Record<CaseStatus, { bg: string; color: string }> = {
  Open: { bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
  'Under Review': { bg: 'rgba(99,102,241,0.15)', color: '#818cf8' },
  Monitoring: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
  Resolved: { bg: 'rgba(34,197,94,0.15)', color: '#34d399' },
};

const TYPE_ICONS: Record<CaseType, React.ElementType> = {
  'Missed Deadline': AlertTriangle,
  'Repeated Content Rejection': FileSearch,
  'Payment Dispute': DollarSign,
};

const FILE_STATUS_CONFIG: Record<string, { color: string }> = {
  Approved: { color: '#34d399' },
  Rejected: { color: '#f87171' },
  'Under Review': { color: '#fbbf24' },
  'Pending Review': { color: '#818cf8' },
  Submitted: { color: '#9ca3af' },
  Disputed: { color: '#f87171' },
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
        className="sm:max-w-2xl text-white border-white/10 bg-slate-950"
        style={{
          borderRadius: '16px',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <DialogHeader>
          <div className="flex items-center gap-3 flex-wrap">
            <Scale size={18} style={{ color: GOLD }} />
            <DialogTitle className="text-white font-bricolage">
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
            className="flex items-center gap-2 p-3 rounded-xl text-sm bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
          >
            <CheckCircle2 size={15} />
            Case resolved. Both parties have been notified and secure deposit action has been executed.
          </div>
        )}

        <div className="space-y-5 mt-4">
          {/* Contract Summary */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-2.5 text-gray-400">
              Contract Summary
            </h3>
            <div
              className="p-4 rounded-xl space-y-2.5"
              style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(240, 235, 224, 0.08)' }}
            >
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-xs text-gray-400">Creator</span>
                  <p className="font-semibold mt-0.5 text-white">{arbitrationCase.creator}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Merchant</span>
                  <p className="font-semibold mt-0.5 text-white">{arbitrationCase.merchant}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Campaign</span>
                  <p className="font-semibold mt-0.5 text-white">{arbitrationCase.campaign}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Secure Deposit Amount</span>
                  <p className="font-bold mt-0.5" style={{ color: GOLD }}>{arbitrationCase.amount}</p>
                </div>
              </div>
              <div>
                <span className="text-xs text-gray-400">Deliverables</span>
                <p className="text-sm mt-0.5 text-gray-300">{arbitrationCase.deliverables}</p>
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
                <span className="text-xs text-gray-400">
                  Open for {arbitrationCase.daysOpen} day{arbitrationCase.daysOpen !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* Communication Log */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-2.5 text-gray-400">
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
                          ? 'rgba(99,102,241,0.15)'
                          : 'rgba(255,255,255,0.08)',
                        color: isAdmin ? GOLD : isCreator ? '#818cf8' : '#F0EBE0',
                        border: isAdmin
                          ? '1px solid rgba(201,168,76,0.25)'
                          : isCreator
                          ? '1px solid rgba(99,102,241,0.25)'
                          : '1px solid rgba(255,255,255,0.15)',
                      }}
                    >
                      {entry.sender[0]}
                    </div>
                    <div
                      className="flex-1 p-3 rounded-xl text-sm"
                      style={{
                        background: isCreator
                          ? 'rgba(99,102,241,0.08)'
                          : isAdmin
                          ? 'rgba(201,168,76,0.12)'
                          : 'rgba(255,255,255,0.03)',
                        border: isAdmin
                          ? '1px solid rgba(201,168,76,0.20)'
                          : isCreator
                          ? '1px solid rgba(99,102,241,0.15)'
                          : '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <div className="flex items-center justify-between mb-1 flex-wrap gap-1">
                        <span
                          className="text-xs font-semibold"
                          style={{ color: isAdmin ? GOLD : isCreator ? '#818cf8' : '#fff' }}
                        >
                          {entry.sender}
                        </span>
                        <span className="text-xs text-gray-400">
                          {entry.time}
                        </span>
                      </div>
                      <p className="text-gray-200" style={{ lineHeight: 1.5 }}>{entry.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* File Submission History */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-2.5 text-gray-400">
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
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(240,235,224,0.06)' }}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Upload size={12} style={{ color: '#9ca3af' }} />
                      <span className="font-medium truncate text-white">
                        {file.name}
                      </span>
                      <span className="text-xs shrink-0 text-gray-400">
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

          <Separator className="bg-white/10" />

          {/* Resolution section */}
          {!resolved && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-2.5 text-gray-400">
                Resolution
              </h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs font-semibold text-gray-300">
                    Resolution Notes / Reason
                  </Label>
                  <Textarea
                    value={resolveReason}
                    onChange={(e) => setResolveReason(e.target.value)}
                    placeholder="Document your arbitration decision, findings, and reasoning…"
                    rows={3}
                    className="mt-1.5 bg-white/5 border-white/15 text-white focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]"
                    style={{ resize: 'none' }}
                  />
                </div>

                {confirmAction && (
                  <div
                    className="p-3 rounded-xl space-y-2"
                    style={{
                      background:
                        confirmAction === 'release'
                          ? 'rgba(34,197,94,0.10)'
                          : 'rgba(239,68,68,0.10)',
                      border: `1px solid ${confirmAction === 'release' ? 'rgba(34,197,94,0.20)' : 'rgba(239,68,68,0.20)'}`,
                    }}
                  >
                    <p className="text-sm font-semibold text-white">
                      {confirmAction === 'release'
                        ? `Confirm: Release ${arbitrationCase.amount} to ${arbitrationCase.creator}?`
                        : `Confirm: Issue ${arbitrationCase.amount} refund to ${arbitrationCase.merchant}?`}
                    </p>
                    <p className="text-xs text-gray-400">
                      This action is irreversible and will be logged in the platform audit trail.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="gap-1.5 font-bold"
                        onClick={handleConfirm}
                        style={{
                          background: confirmAction === 'release' ? '#10b981' : '#ef4444',
                          color: '#fff',
                          borderRadius: '8px',
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
                        className="border-white/10 text-gray-300 hover:bg-white/5 hover:text-white bg-transparent"
                        style={{ borderRadius: '8px' }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {!confirmAction && (
                  <div className="flex gap-3 flex-wrap">
                    <Button
                      className="gap-2 flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                      style={{
                        borderRadius: '8px',
                        border: 'none',
                      }}
                      onClick={() => setConfirmAction('release')}
                    >
                      <DollarSign size={14} />
                      Release Payment to Creator
                    </Button>
                    <Button
                      className="gap-2 flex-1 bg-red-600 hover:bg-red-700 text-white font-bold"
                      style={{
                        borderRadius: '8px',
                        border: 'none',
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
          className="h-7 px-3 text-xs font-semibold gap-1 bg-red-500/80 hover:bg-red-500 text-white"
          onClick={() => openWorkspace(c)}
          style={{ borderRadius: 7, border: 'none' }}
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
          className="h-7 px-3 text-xs gap-1 border-[#C9A84C]/30 text-[#C9A84C] bg-transparent hover:bg-[#C9A84C]/10 hover:text-white"
          onClick={() => openWorkspace(c)}
          style={{ borderRadius: 7 }}
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
        className="h-7 px-3 text-xs gap-1 border-white/10 text-gray-300 bg-transparent hover:bg-white/5 hover:text-white"
        onClick={() => openWorkspace(c)}
        style={{ borderRadius: 7 }}
      >
        <Eye size={11} />
        View
      </Button>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-bold tracking-tight text-white font-bricolage"
        >
          Arbitration &amp; Conflict Resolution
        </h1>
        <p className="text-sm mt-1 text-gray-400">
          Review, mediate, and resolve disputes between creators and merchants
        </p>
      </div>

      {/* Alert banner */}
      {urgentCases.length > 0 && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25"
        >
          <AlertCircle size={18} className="shrink-0 text-red-400" />
          <div>
            <p className="text-sm font-semibold text-red-400">
              {urgentCases.length} case{urgentCases.length > 1 ? 's' : ''} require immediate attention
            </p>
            <p className="text-xs mt-0.5 text-red-300/80">
              {urgentCases.map((c) => c.id).join(', ')} — HIGH severity disputes are open and unresolved
            </p>
          </div>
        </div>
      )}

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Open Cases', value: CASES.filter((c) => c.status === 'Open').length, color: '#f87171', bg: 'rgba(239,68,68,0.10)' },
          { label: 'Under Review', value: CASES.filter((c) => c.status === 'Under Review').length, color: '#818cf8', bg: 'rgba(99,102,241,0.10)' },
          { label: 'Monitoring', value: CASES.filter((c) => c.status === 'Monitoring').length, color: '#fbbf24', bg: 'rgba(245,158,11,0.10)' },
          { label: 'HIGH Severity', value: CASES.filter((c) => c.severity === 'HIGH').length, color: '#f87171', bg: 'rgba(239,68,68,0.08)' },
        ].map(({ label, value, color, bg }) => (
          <Card
            key={label}
            className="border-0 shadow-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(240, 235, 224, 0.08)',
            }}
          >
            <CardContent className="flex items-center gap-3 py-4 px-5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border"
                style={{ background: bg, borderColor: `${color}15` }}
              >
                <AlertTriangle size={16} style={{ color }} />
              </div>
              <div>
                <div className="text-xl font-bold text-[#F0EBE0] font-bricolage">{value}</div>
                <div className="text-xs text-gray-400">{label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cases table */}
      <Card
        className="border-0 shadow-sm"
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(240, 235, 224, 0.08)',
        }}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-white font-bricolage">
            Active Cases
          </CardTitle>
          <p className="text-xs text-gray-400">
            All open and in-progress arbitration cases across the platform
          </p>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader className="border-white/5">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="pl-6 text-xs text-gray-400">Case #</TableHead>
                <TableHead className="text-xs text-gray-400">Type</TableHead>
                <TableHead className="text-xs text-gray-400">Campaign</TableHead>
                <TableHead className="text-xs text-gray-400">Parties</TableHead>
                <TableHead className="text-xs text-center text-gray-400">Days Open</TableHead>
                <TableHead className="text-xs text-gray-400">Severity</TableHead>
                <TableHead className="text-xs text-gray-400">Status</TableHead>
                <TableHead className="text-xs pr-6 text-gray-400">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CASES.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-400 text-sm">
                    No arbitration cases found.
                  </TableCell>
                </TableRow>
              ) : (
                CASES.map((c) => {
                  const TypeIcon = TYPE_ICONS[c.type];
                  const sev = SEVERITY_CONFIG[c.severity];
                  const sta = STATUS_CONFIG[c.status];
                  return (
                    <TableRow
                      key={c.id}
                      className="border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                    <TableCell className="pl-6">
                      <span className="font-mono text-sm font-bold" style={{ color: GOLD }}>
                        {c.id}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <TypeIcon size={13} className="text-gray-400" />
                        <span className="text-xs font-medium text-white">
                          {c.type}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-gray-400">
                        {c.campaign}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-gray-200">
                        <span className="font-medium">{c.creator}</span>
                        <span className="text-gray-400"> vs </span>
                        <span className="font-medium">{c.merchant}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`text-sm font-bold ${c.daysOpen >= 5 ? 'text-red-400' : c.daysOpen >= 3 ? 'text-amber-400' : 'text-gray-200'}`}
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
                  })
                )}
              </TableBody>
          </Table>

          <div
            className="px-6 py-3 text-xs flex items-center justify-between text-gray-500"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
          >
            <span>{CASES.length} total cases · {urgentCases.length} require immediate resolution</span>
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
