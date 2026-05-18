'use client';

import { useState } from 'react';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  ShieldCheck,
  UserCheck,
  UserX,
  Info,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

type AppStatus = 'Pending' | 'Under Review' | 'Identity Check' | 'Approved' | 'Rejected';

/* ------------------------------------------------------------------ */
/* Mock data                                                             */
/* ------------------------------------------------------------------ */

interface Application {
  id: number;
  name: string;
  email: string;
  handles: string;
  followers: string;
  bio: string;
  appliedDate: string;
  status: AppStatus;
  location: string;
  languages: string[];
  niches: string[];
}

const APPLICATIONS: Application[] = [
  {
    id: 1,
    name: 'Fathima Noor',
    email: 'fathima@gmail.com',
    handles: 'IG: @fathima.creates',
    followers: '32,100 (IG)',
    bio: 'Lifestyle & food content creator based in Calicut. 4 years of creating authentic Kerala cuisine content.',
    appliedDate: 'May 15, 2026',
    status: 'Pending',
    location: 'Kozhikode, Kerala',
    languages: ['Malayalam', 'English'],
    niches: ['Food', 'Lifestyle'],
  },
  {
    id: 2,
    name: 'Krishnan Pillai',
    email: 'krishnan@gmail.com',
    handles: 'YT: 45K subs',
    followers: '45,000 (YT)',
    bio: 'Tech reviewer focusing on budget smartphones and gadgets for the South Indian market.',
    appliedDate: 'May 14, 2026',
    status: 'Under Review',
    location: 'Kozhikode, Kerala',
    languages: ['Malayalam'],
    niches: ['Tech', 'Reviews'],
  },
  {
    id: 3,
    name: 'Sana Rashid',
    email: 'sana@gmail.com',
    handles: 'IG: 28K followers',
    followers: '28,000 (IG)',
    bio: 'Fashion & modest wear creator with strong engagement among Kerala Muslim community.',
    appliedDate: 'May 13, 2026',
    status: 'Identity Check',
    location: 'Malappuram, Kerala',
    languages: ['Malayalam', 'Urdu'],
    niches: ['Fashion', 'Modest Wear'],
  },
  {
    id: 4,
    name: 'Thomas Mathew',
    email: 'thomas@gmail.com',
    handles: 'YT: 12K, IG: 8K',
    followers: '12,000 (YT) · 8,000 (IG)',
    bio: 'Travel vlogger covering hidden gems in Kerala and Coorg. Authentic storytelling approach.',
    appliedDate: 'May 12, 2026',
    status: 'Pending',
    location: 'Thrissur, Kerala',
    languages: ['Malayalam', 'English'],
    niches: ['Travel', 'Vlogging'],
  },
  {
    id: 5,
    name: 'Lakshmi Devi',
    email: 'lakshmi@gmail.com',
    handles: 'IG: 92K followers',
    followers: '92,000 (IG)',
    bio: 'Yoga instructor and wellness influencer. Certified nutritionist with 6 years of content creation.',
    appliedDate: 'May 11, 2026',
    status: 'Under Review',
    location: 'Kochi, Kerala',
    languages: ['Malayalam', 'Tamil', 'English'],
    niches: ['Wellness', 'Fitness', 'Yoga'],
  },
  {
    id: 6,
    name: 'Anish Kumar',
    email: 'anish@gmail.com',
    handles: 'X: 15K followers',
    followers: '15,000 (X)',
    bio: 'Finance educator breaking down complex investment topics for Kerala millennials.',
    appliedDate: 'May 10, 2026',
    status: 'Pending',
    location: 'Kozhikode, Kerala',
    languages: ['Malayalam', 'English'],
    niches: ['Finance', 'Education'],
  },
];

const STATUS_CONFIG: Record<AppStatus, { bg: string; color: string; label: string }> = {
  Pending: { bg: 'rgba(8,13,38,0.08)', color: '#6b7280', label: 'Pending' },
  'Under Review': { bg: 'rgba(99,102,241,0.12)', color: '#6366f1', label: 'Under Review' },
  'Identity Check': { bg: 'rgba(245,158,11,0.12)', color: '#d97706', label: 'Identity Check' },
  Approved: { bg: 'rgba(34,197,94,0.12)', color: '#16a34a', label: 'Approved' },
  Rejected: { bg: 'rgba(239,68,68,0.10)', color: '#dc2626', label: 'Rejected' },
};

/* ------------------------------------------------------------------ */
/* Stat card                                                              */
/* ------------------------------------------------------------------ */

function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
}: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  label: string;
  value: number | string;
}) {
  return (
    <Card className="border-0 shadow-sm" style={{ background: '#fff', borderRadius: 14 }}>
      <CardContent className="flex items-center gap-4 py-4 px-5">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
          style={{ background: iconBg }}
        >
          <Icon size={18} style={{ color: iconColor }} />
        </div>
        <div>
          <div
            className="text-xl font-bold"
            style={{ color: INDIGO, fontFamily: 'var(--font-bricolage, sans-serif)' }}
          >
            {value}
          </div>
          <div className="text-xs" style={{ color: '#9ca3af' }}>
            {label}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Review Dialog                                                          */
/* ------------------------------------------------------------------ */

function ReviewDialog({
  app,
  open,
  onOpenChange,
}: {
  app: Application;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [idCheckResult, setIdCheckResult] = useState<string | null>(null);
  const [isRunningCheck, setIsRunningCheck] = useState(false);

  function runIdentityCheck() {
    setIsRunningCheck(true);
    setTimeout(() => {
      setIdCheckResult(
        'Identity verification API would be called here (Digilocker / Aadhaar). Documents: Aadhaar UID linked, PAN verified, address confirmed.'
      );
      setIsRunningCheck(false);
    }, 1200);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-lg"
        style={{ background: '#fff', borderRadius: 16 }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: INDIGO }}>
            Application — {app.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          {/* Basic info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-xs uppercase tracking-wider" style={{ color: '#9ca3af' }}>
                Email
              </span>
              <p className="font-medium mt-0.5" style={{ color: INDIGO }}>
                {app.email}
              </p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider" style={{ color: '#9ca3af' }}>
                Applied
              </span>
              <p className="font-medium mt-0.5" style={{ color: INDIGO }}>
                {app.appliedDate}
              </p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider" style={{ color: '#9ca3af' }}>
                Location
              </span>
              <p className="font-medium mt-0.5" style={{ color: INDIGO }}>
                {app.location}
              </p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider" style={{ color: '#9ca3af' }}>
                Social Handles
              </span>
              <p className="font-medium mt-0.5" style={{ color: INDIGO }}>
                {app.handles}
              </p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider" style={{ color: '#9ca3af' }}>
                Followers
              </span>
              <p className="font-medium mt-0.5" style={{ color: INDIGO }}>
                {app.followers}
              </p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider" style={{ color: '#9ca3af' }}>
                Languages
              </span>
              <p className="font-medium mt-0.5" style={{ color: INDIGO }}>
                {app.languages.join(', ')}
              </p>
            </div>
          </div>

          {/* Content niches */}
          <div>
            <span className="text-xs uppercase tracking-wider" style={{ color: '#9ca3af' }}>
              Content Niches
            </span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {app.niches.map((n) => (
                <Badge
                  key={n}
                  className="text-xs"
                  style={{ background: 'rgba(201,168,76,0.12)', color: GOLD, border: 'none' }}
                >
                  {n}
                </Badge>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <span className="text-xs uppercase tracking-wider" style={{ color: '#9ca3af' }}>
              Creator Bio
            </span>
            <p className="mt-1.5 text-sm leading-relaxed" style={{ color: '#374151' }}>
              {app.bio}
            </p>
          </div>

          <Separator />

          {/* Identity check */}
          <div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 w-full justify-center"
              onClick={runIdentityCheck}
              disabled={isRunningCheck}
              style={{
                border: '1px solid rgba(8,13,38,0.15)',
                borderRadius: 8,
                color: INDIGO,
              }}
            >
              <ShieldCheck size={14} />
              {isRunningCheck ? 'Running Verification…' : 'Run Identity Check'}
            </Button>
            {idCheckResult && (
              <div
                className="mt-2 p-3 rounded-lg flex gap-2.5 text-xs"
                style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.20)' }}
              >
                <Info size={13} className="shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                <p style={{ color: '#15803d' }}>{idCheckResult}</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="-mx-4 -mb-4 gap-2 rounded-b-2xl px-4 py-3 flex-row justify-end border-t bg-gray-50/60">
          <Button
            size="sm"
            className="gap-1.5"
            style={{
              background: 'rgba(239,68,68,0.90)',
              color: '#fff',
              borderRadius: 8,
              border: 'none',
            }}
          >
            <UserX size={13} />
            Reject
          </Button>
          <Button
            size="sm"
            className="gap-1.5"
            style={{
              background: GOLD,
              color: INDIGO,
              borderRadius: 8,
              border: 'none',
              fontWeight: 600,
            }}
          >
            <UserCheck size={13} />
            Approve &amp; Onboard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                  */
/* ------------------------------------------------------------------ */

export default function ApplicationsPage() {
  const [selected, setSelected] = useState<Application | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  function openReview(app: Application) {
    setSelected(app);
    setDialogOpen(true);
  }

  return (
    <div style={{ background: BG, minHeight: '100%' }} className="p-6 rounded-xl space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: INDIGO, fontFamily: 'var(--font-bricolage, sans-serif)' }}
        >
          Application Queue
        </h1>
        <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
          Local Roster Onboarding Queue — Kozhikode Chapter
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={ClipboardList}
          iconBg="rgba(8,13,38,0.06)"
          iconColor={INDIGO}
          label="Pending"
          value={12}
        />
        <StatCard
          icon={Clock}
          iconBg="rgba(99,102,241,0.10)"
          iconColor="#6366f1"
          label="Under Review"
          value={4}
        />
        <StatCard
          icon={CheckCircle2}
          iconBg="rgba(34,197,94,0.10)"
          iconColor="#22c55e"
          label="Approved This Month"
          value={8}
        />
        <StatCard
          icon={XCircle}
          iconBg="rgba(239,68,68,0.08)"
          iconColor="#dc2626"
          label="Rejected"
          value={3}
        />
      </div>

      {/* Applications table */}
      <Card className="border-0 shadow-sm" style={{ background: '#fff', borderRadius: 14 }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold" style={{ color: INDIGO }}>
            Pending Applications
          </CardTitle>
          <p className="text-xs" style={{ color: '#9ca3af' }}>
            Review and process creator applications for the Kozhikode chapter
          </p>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader>
              <TableRow style={{ borderColor: 'rgba(8,13,38,0.06)' }}>
                <TableHead className="pl-6 text-xs" style={{ color: '#9ca3af' }}>Applicant</TableHead>
                <TableHead className="text-xs" style={{ color: '#9ca3af' }}>Email</TableHead>
                <TableHead className="text-xs" style={{ color: '#9ca3af' }}>Social Handles</TableHead>
                <TableHead className="text-xs" style={{ color: '#9ca3af' }}>Applied Date</TableHead>
                <TableHead className="text-xs" style={{ color: '#9ca3af' }}>Status</TableHead>
                <TableHead className="text-xs pr-6" style={{ color: '#9ca3af' }}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {APPLICATIONS.map((app) => {
                const sc = STATUS_CONFIG[app.status];
                return (
                  <TableRow
                    key={app.id}
                    style={{ borderColor: 'rgba(8,13,38,0.04)' }}
                    className="hover:bg-amber-50/30 transition-colors"
                  >
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                          style={{
                            background: 'rgba(201,168,76,0.12)',
                            color: GOLD,
                          }}
                        >
                          {app.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)}
                        </div>
                        <span className="text-sm font-semibold" style={{ color: INDIGO }}>
                          {app.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs" style={{ color: '#6b7280' }}>
                        {app.email}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-medium" style={{ color: INDIGO }}>
                        {app.handles}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs" style={{ color: '#6b7280' }}>
                        {app.appliedDate}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className="text-xs font-semibold"
                        style={{ background: sc.bg, color: sc.color, border: 'none' }}
                      >
                        {sc.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6">
                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          className="h-7 px-2.5 text-xs gap-1 font-semibold"
                          onClick={() => openReview(app)}
                          style={{
                            background: GOLD,
                            color: INDIGO,
                            borderRadius: 7,
                            border: 'none',
                          }}
                        >
                          <Eye size={12} />
                          Review
                        </Button>
                        {app.status === 'Pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-xs gap-1"
                              style={{
                                border: '1px solid rgba(34,197,94,0.30)',
                                color: '#16a34a',
                                borderRadius: 7,
                              }}
                            >
                              <UserCheck size={12} />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-xs gap-1"
                              style={{
                                border: '1px solid rgba(239,68,68,0.25)',
                                color: '#dc2626',
                                borderRadius: 7,
                              }}
                            >
                              <UserX size={12} />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div
            className="px-6 py-3 text-xs"
            style={{ borderTop: '1px solid rgba(8,13,38,0.06)', color: '#9ca3af' }}
          >
            Showing {APPLICATIONS.length} applications · Chapter admin can approve, reject, or escalate
          </div>
        </CardContent>
      </Card>

      {/* Review dialog */}
      {selected && (
        <ReviewDialog
          app={selected}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </div>
  );
}
