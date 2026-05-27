'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2, ClipboardList, Eye, Info, Loader2,
  ShieldCheck, UserCheck, UserX, XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const GOLD = '#C9A84C';

interface SocialAccount { platform: string; url: string; followers: string; }
interface Application {
  id: string; name: string; email: string; type: string; handles: string;
  followers: string; totalFollowers: string; socialAccounts: SocialAccount[];
  bio: string; appliedDate: string; status: string; location: string;
  languages: string[]; niches: string[];
}

const STATUS_CONFIG: Record<string, { bg: string; color: string; label: string }> = {
  pending: { bg: 'rgba(255,255,255,0.05)', color: '#d1d5db', label: 'Pending' },
  under_review: { bg: 'rgba(99,102,241,0.15)', color: '#a5b4fc', label: 'Under Review' },
  identity_check: { bg: 'rgba(245,158,11,0.15)', color: '#fcd34d', label: 'Identity Check' },
  approved: { bg: 'rgba(34,197,94,0.15)', color: '#86efac', label: 'Approved' },
  rejected: { bg: 'rgba(239,68,68,0.15)', color: '#fca5a5', label: 'Rejected' },
};

function statusConfig(status: string) { return STATUS_CONFIG[status] ?? STATUS_CONFIG.pending; }

function StatCard({ icon: Icon, iconBg, iconColor, label, value }: { icon: React.ElementType; iconBg: string; iconColor: string; label: string; value: number | string }) {
  return (
    <Card className="border-0 shadow-sm" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(240,235,224,0.08)' }}>
      <CardContent className="flex items-center gap-4 py-4 px-5">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0" style={{ background: iconBg, border: `1px solid ${iconColor}20` }}>
          <Icon size={18} style={{ color: iconColor }} />
        </div>
        <div>
          <div className="text-xl font-bold text-[#F0EBE0] font-bricolage">{value}</div>
          <div className="text-xs text-gray-400">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function ReviewDialog({ app, open, onOpenChange }: { app: Application; open: boolean; onOpenChange: (v: boolean) => void }) {
  const [idCheckResult, setIdCheckResult] = useState<string | null>(null);
  const [isRunningCheck, setIsRunningCheck] = useState(false);

  function runIdentityCheck() {
    setIsRunningCheck(true);
    setTimeout(() => {
      setIdCheckResult('Identity verification API would be called here (Digilocker / Aadhaar). Documents: Aadhaar UID linked, PAN verified, address confirmed.');
      setIsRunningCheck(false);
    }, 1200);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg text-white border-white/10 bg-slate-950 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-white font-bricolage">Application — {app.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm mt-4">
          <div className="grid grid-cols-2 gap-3">
            <div><span className="text-xs uppercase tracking-wider text-gray-400">Email</span><p className="font-medium mt-0.5 text-gray-200">{app.email}</p></div>
            <div><span className="text-xs uppercase tracking-wider text-gray-400">Applied</span><p className="font-medium mt-0.5 text-gray-200">{app.appliedDate}</p></div>
            <div><span className="text-xs uppercase tracking-wider text-gray-400">Location</span><p className="font-medium mt-0.5 text-gray-200">{app.location}</p></div>
            <div><span className="text-xs uppercase tracking-wider text-gray-400">Total Followers</span><p className="font-medium mt-0.5 text-gray-200">{app.totalFollowers}</p></div>
            <div className="col-span-2"><span className="text-xs uppercase tracking-wider text-gray-400">Social Handles</span><p className="font-medium mt-0.5 text-gray-200 break-words">{app.handles}</p></div>
          </div>
          <div><span className="text-xs uppercase tracking-wider text-gray-400">Creator Bio</span><p className="mt-1.5 text-sm leading-relaxed text-gray-300">{app.bio}</p></div>
          <Separator className="bg-white/10" />
          <div>
            <Button variant="outline" size="sm" className="gap-2 w-full justify-center text-gray-300 border-white/10 hover:bg-white/5 hover:text-white bg-transparent" onClick={runIdentityCheck} disabled={isRunningCheck}>
              <ShieldCheck size={14} className="text-emerald-400" />
              {isRunningCheck ? 'Running Verification...' : 'Run Identity Check'}
            </Button>
            {idCheckResult && (
              <div className="mt-2 p-3 rounded-lg flex gap-2.5 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                <Info size={13} className="shrink-0 mt-0.5 text-emerald-400" /><p>{idCheckResult}</p>
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="-mx-6 -mb-6 gap-2 rounded-b-lg px-6 py-4 flex-row justify-end border-t border-white/10 bg-white/[0.02]">
          <Button size="sm" className="gap-1.5 bg-red-500/80 hover:bg-red-500 text-white font-bold rounded-lg"><UserX size={13} />Reject</Button>
          <Button size="sm" className="gap-1.5 bg-[#C9A84C] hover:bg-[#b0913b] text-slate-950 font-bold rounded-lg border-0"><UserCheck size={13} />Approve &amp; Onboard</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Application | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetch('/api/applications')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setApplications(data.applications ?? []);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Failed to load applications'))
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(() => ({
    pending: applications.filter((a) => a.status === 'pending').length,
    approved: applications.filter((a) => a.status === 'approved').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
    total: applications.length,
  }), [applications]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white font-bricolage">Application Queue</h1>
        <p className="text-sm mt-1 text-gray-400">Local Roster Onboarding Queue — Chapter Applications</p>
      </div>

      {error && (
        <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-4 py-3">{error}</div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ClipboardList} iconBg="rgba(255,255,255,0.05)" iconColor="#F0EBE0" label="Total" value={loading ? '—' : counts.total} />
        <StatCard icon={Loader2} iconBg="rgba(245,158,11,0.10)" iconColor="#fcd34d" label="Pending" value={loading ? '—' : counts.pending} />
        <StatCard icon={CheckCircle2} iconBg="rgba(34,197,94,0.10)" iconColor="#34d399" label="Approved" value={loading ? '—' : counts.approved} />
        <StatCard icon={XCircle} iconBg="rgba(239,68,68,0.08)" iconColor="#f87171" label="Rejected" value={loading ? '—' : counts.rejected} />
      </div>

      <Card className="border-0 shadow-sm" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(240,235,224,0.08)' }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-white font-bricolage">Pending Applications</CardTitle>
          <p className="text-xs text-gray-400">Review and process creator applications for your chapter.</p>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader className="border-white/5">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="pl-6 text-xs text-gray-400">Applicant</TableHead>
                <TableHead className="text-xs text-gray-400">Email</TableHead>
                <TableHead className="text-xs text-gray-400">Social Handles</TableHead>
                <TableHead className="text-xs text-gray-400">Applied Date</TableHead>
                <TableHead className="text-xs text-gray-400">Status</TableHead>
                <TableHead className="text-xs pr-6 text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-400 text-sm"><Loader2 size={16} className="inline animate-spin mr-2" />Loading applications...</TableCell></TableRow>
              ) : error ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-rose-400 text-sm">{error}</TableCell></TableRow>
              ) : applications.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-400 text-sm">No applications found.</TableCell></TableRow>
              ) : (
                applications.map((app) => {
                  const sc = statusConfig(app.status);
                  return (
                    <TableRow key={app.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: 'rgba(201,168,76,0.15)', color: GOLD, border: '1px solid rgba(201,168,76,0.25)' }}>
                            {app.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </div>
                          <span className="text-sm font-semibold text-white">{app.name}</span>
                        </div>
                      </TableCell>
                      <TableCell><span className="text-xs text-gray-400">{app.email}</span></TableCell>
                      <TableCell className="max-w-xs"><span className="block text-xs font-medium text-gray-200 truncate">{app.handles}</span></TableCell>
                      <TableCell><span className="text-xs text-gray-400">{app.appliedDate}</span></TableCell>
                      <TableCell>
                        <Badge className="text-xs font-semibold" style={{ background: sc.bg, color: sc.color, border: 'none' }}>{sc.label}</Badge>
                      </TableCell>
                      <TableCell className="pr-6">
                        <div className="flex items-center gap-1.5">
                          <Button size="sm" className="h-7 px-2.5 text-xs gap-1 font-semibold text-[#080D26] hover:bg-[#b0923d]" onClick={() => { setSelected(app); setDialogOpen(true); }} style={{ background: GOLD, borderRadius: 7, border: 'none' }}>
                            <Eye size={12} />Review
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
          <div className="px-6 py-3 text-xs text-gray-500" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            Showing {applications.length} applications
          </div>
        </CardContent>
      </Card>

      {selected && <ReviewDialog app={selected} open={dialogOpen} onOpenChange={setDialogOpen} />}
    </div>
  );
}
