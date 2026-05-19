'use client';

import { useState } from 'react';
import {
  Plus,
  Pencil,
  Pause,
  Trash2,
  Calendar,
  Users,
  IndianRupee,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

/* ------------------------------------------------------------------ */
/* Brand tokens                                                          */
/* ------------------------------------------------------------------ */
const GOLD = '#C9A84C';
const INDIGO = '#080D26';
const BG = '#F8F7F4';

/* ------------------------------------------------------------------ */
/* Types & mock data                                                     */
/* ------------------------------------------------------------------ */
type CampaignStatus = 'Active' | 'Draft' | 'Paused' | 'Completed';

interface Campaign {
  id: number;
  title: string;
  status: CampaignStatus;
  budget: string;
  applications: number;
  deadline: string;
}

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 1,
    title: 'Kerala Onam Campaign',
    status: 'Active',
    budget: '₹85,000',
    applications: 12,
    deadline: 'Jun 15, 2025',
  },
  {
    id: 2,
    title: 'South India Launch Series',
    status: 'Active',
    budget: '₹1,20,000',
    applications: 8,
    deadline: 'Jun 30, 2025',
  },
  {
    id: 3,
    title: 'Festive Creator Program',
    status: 'Draft',
    budget: '₹95,000',
    applications: 0,
    deadline: 'Jul 10, 2025',
  },
];

const STATUS_STYLES: Record<CampaignStatus, { bg: string; color: string }> = {
  Active: { bg: 'rgba(34,197,94,0.15)', color: '#4ade80' },
  Draft: { bg: 'rgba(156,163,175,0.15)', color: '#9ca3af' },
  Paused: { bg: 'rgba(251,191,36,0.15)', color: '#fbbf24' },
  Completed: { bg: 'rgba(99,102,241,0.15)', color: '#818cf8' },
};

const LANGUAGE_OPTIONS = ['Malayalam', 'Tamil', 'Telugu', 'Kannada'];
const CHAPTER_OPTIONS = ['Kozhikode', 'Kochi', 'Bangalore', 'Chennai', 'Hyderabad'];

/* ------------------------------------------------------------------ */
/* Campaign form state                                                   */
/* ------------------------------------------------------------------ */
interface CampaignForm {
  title: string;
  description: string;
  languages: string[];
  chapters: string[];
  budget: string;
  escrow: string;
  deadline: string;
  deliverables: string;
}

const EMPTY_FORM: CampaignForm = {
  title: '',
  description: '',
  languages: [],
  chapters: [],
  budget: '',
  escrow: '',
  deadline: '',
  deliverables: '',
};

/* ------------------------------------------------------------------ */
/* Page                                                                  */
/* ------------------------------------------------------------------ */
export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [form, setForm] = useState<CampaignForm>(EMPTY_FORM);
  const [dialogOpen, setDialogOpen] = useState(false);

  const toggleMulti = (
    field: 'languages' | 'chapters',
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const handleSaveDraft = () => {
    if (!form.title.trim()) return;
    setCampaigns((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: form.title,
        status: 'Draft',
        budget: form.budget ? `₹${parseInt(form.budget).toLocaleString('en-IN')}` : '—',
        applications: 0,
        deadline: form.deadline || '—',
      },
    ]);
    setForm(EMPTY_FORM);
    setDialogOpen(false);
  };

  const handlePublish = () => {
    if (!form.title.trim()) return;
    setCampaigns((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: form.title,
        status: 'Active',
        budget: form.budget ? `₹${parseInt(form.budget).toLocaleString('en-IN')}` : '—',
        applications: 0,
        deadline: form.deadline || '—',
      },
    ]);
    setForm(EMPTY_FORM);
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  };

  const handlePause = (id: number) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === 'Paused' ? 'Active' : 'Paused' }
          : c
      )
    );
  };

  const activeCampaigns = campaigns.filter((c) => c.status === 'Active').length;
  const totalBudget = campaigns.reduce((sum, c) => {
    const num = parseInt(c.budget.replace(/[₹,]/g, ''));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  return (
    <div className="space-y-7">
      {/* ── Page header ── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-bricolage">
            Campaigns
          </h1>
          <p className="text-sm mt-1 text-gray-400">
            Build, publish, and manage your creator campaigns in one place.
          </p>
        </div>

        {/* Create campaign dialog trigger */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            render={
              <Button
                className="h-9 px-5 text-sm font-bold gap-2 bg-[#C9A84C] hover:bg-[#b0913b] text-slate-950"
                style={{ border: 'none' }}
              />
            }
          >
            <Plus size={15} /> Create New Campaign
          </DialogTrigger>

          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-950 border border-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="text-white font-bricolage">Create New Campaign</DialogTitle>
            </DialogHeader>

            <div className="space-y-5 py-2">
              {/* Campaign title */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-300">Campaign Title *</Label>
                <Input
                  placeholder="e.g. Kerala Onam Campaign 2025"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-[#C9A84C]"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-300">Description</Label>
                <Textarea
                  placeholder="Describe your campaign goals, brand voice, and creator expectations..."
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-[#C9A84C]"
                />
              </div>

              <Separator className="bg-white/10" />

              {/* Language targets */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-gray-300">Language Targets</Label>
                <div className="flex flex-wrap gap-3">
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <label key={lang} className="flex items-center gap-2 cursor-pointer text-gray-300">
                      <Checkbox
                        checked={form.languages.includes(lang)}
                        onCheckedChange={() => toggleMulti('languages', lang)}
                        className="border-white/20 data-[state=checked]:bg-[#C9A84C] data-[state=checked]:border-[#C9A84C] data-[state=checked]:text-slate-950"
                      />
                      <span className="text-sm">{lang}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Chapter targets */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-gray-300">Chapter Targets</Label>
                <div className="flex flex-wrap gap-3">
                  {CHAPTER_OPTIONS.map((ch) => (
                    <label key={ch} className="flex items-center gap-2 cursor-pointer text-gray-300">
                      <Checkbox
                        checked={form.chapters.includes(ch)}
                        onCheckedChange={() => toggleMulti('chapters', ch)}
                        className="border-white/20 data-[state=checked]:bg-[#C9A84C] data-[state=checked]:border-[#C9A84C] data-[state=checked]:text-slate-950"
                      />
                      <span className="text-sm">{ch}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Separator className="bg-white/10" />

              {/* Budget + Secure Deposit */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-300">Total Budget (₹)</Label>
                  <div className="relative">
                    <IndianRupee
                      size={13}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    <Input
                      type="number"
                      placeholder="0"
                      className="pl-7 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-[#C9A84C]"
                      value={form.budget}
                      onChange={(e) => setForm({ ...form, budget: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-300">Secure Deposit Amount (₹)</Label>
                  <div className="relative">
                    <IndianRupee
                      size={13}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    <Input
                      type="number"
                      placeholder="0"
                      className="pl-7 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-[#C9A84C]"
                      value={form.escrow}
                      onChange={(e) => setForm({ ...form, escrow: e.target.value })}
                    />
                  </div>
                  <p className="text-[10px] text-amber-500 font-medium">
                    Funds locked until content approved
                  </p>
                </div>
              </div>

              {/* Deadline */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-300">Campaign Deadline</Label>
                <Input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-[#C9A84C] [color-scheme:dark]"
                />
              </div>

              {/* Deliverables */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-300">Deliverables</Label>
                <Textarea
                  placeholder="e.g. 2 Instagram Reels, 1 YouTube integration, 3 Instagram Stories"
                  rows={2}
                  value={form.deliverables}
                  onChange={(e) => setForm({ ...form, deliverables: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-[#C9A84C]"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" className="gap-2 border-white/10 text-gray-300 hover:bg-white/5 hover:text-white bg-transparent" onClick={handleSaveDraft}>
                <FileText size={14} /> Save as Draft
              </Button>
              <Button
                className="gap-2 font-bold bg-[#C9A84C] hover:bg-[#b0913b] text-slate-950"
                style={{ border: 'none' }}
                onClick={handlePublish}
              >
                <Plus size={14} /> Publish Campaign
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: 'Total Campaigns',
            value: campaigns.length,
            icon: FileText,
            color: '#818cf8',
            bg: 'rgba(99,102,241,0.08)',
          },
          {
            label: 'Active Campaigns',
            value: activeCampaigns,
            icon: ChevronRight,
            color: '#4ade80',
            bg: 'rgba(34,197,94,0.08)',
          },
          {
            label: 'Total Budget Allocated',
            value: `₹${totalBudget.toLocaleString('en-IN')}`,
            icon: IndianRupee,
            color: GOLD,
            bg: 'rgba(201,168,76,0.08)',
          },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <Card
            key={label}
            className="border-0 shadow-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(240, 235, 224, 0.08)',
              borderRadius: 14,
            }}
          >
            <CardContent className="flex items-center gap-4 py-4">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0 border border-white/5"
                style={{ background: bg }}
              >
                <Icon size={18} style={{ color }} />
              </div>
              <div>
                <div className="text-xs text-gray-450">{label}</div>
                <div className="text-xl font-bold mt-0.5 font-bricolage" style={{ color }}>
                  {value}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Campaign table ── */}
      <Card
        className="border-0 shadow-sm overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(240, 235, 224, 0.08)',
          borderRadius: 14,
        }}
      >
        <CardHeader className="border-b border-white/10 pb-3">
          <CardTitle className="text-sm font-semibold text-white font-bricolage">
            All Campaigns
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-white/10 hover:bg-transparent">
                <TableHead className="pl-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Campaign Title
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Budget
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Applications
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Deadline
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-400 uppercase tracking-wider pr-5">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-sm text-gray-500 py-10"
                  >
                    No campaigns yet. Create your first campaign above.
                  </TableCell>
                </TableRow>
              )}
              {campaigns.map((campaign) => {
                const s = STATUS_STYLES[campaign.status];
                return (
                  <TableRow key={campaign.id} className="border-b border-white/5 hover:bg-white/5">
                    {/* Title */}
                    <TableCell className="pl-5">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 border border-white/5"
                          style={{ background: 'rgba(255, 255, 255, 0.02)' }}
                        >
                          <FileText size={14} className="text-white" />
                        </div>
                        <span
                          className="font-semibold text-sm text-white font-bricolage"
                        >
                          {campaign.title}
                        </span>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border border-white/5"
                        style={{ background: s.bg, color: s.color }}
                      >
                        {campaign.status}
                      </span>
                    </TableCell>

                    {/* Budget */}
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm font-bold text-[#C9A84C] font-bricolage">
                        {campaign.budget}
                      </div>
                    </TableCell>

                    {/* Applications */}
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-gray-300">
                        <Users size={13} className="text-gray-500" />
                        {campaign.applications}
                        <span className="text-gray-500 text-xs">applied</span>
                      </div>
                    </TableCell>

                    {/* Deadline */}
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Calendar size={12} />
                        {campaign.deadline}
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="pr-5">
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="h-7 w-7 text-gray-400 hover:text-white hover:bg-white/5"
                          title="Edit"
                        >
                          <Pencil size={13} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="h-7 w-7 text-gray-400 hover:text-white hover:bg-white/5"
                          title={campaign.status === 'Paused' ? 'Resume' : 'Pause'}
                          onClick={() => handlePause(campaign.id)}
                        >
                          <Pause size={13} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="h-7 w-7 text-gray-400 hover:text-red-400 hover:bg-white/5"
                          title="Delete"
                          onClick={() => handleDelete(campaign.id)}
                        >
                          <Trash2 size={13} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
