'use client';

import { useState } from 'react';
import { FileText, Download, Eye, Plus, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

const GOLD = '#C9A84C';
const INDIGO = '#080D26';
const BG = '#F8F7F4';

/* ------------------------------------------------------------------ */
/* Contract templates                                                    */
/* ------------------------------------------------------------------ */

const CONTRACTS = [
  {
    id: 1,
    title: 'Creator–Brand Collaboration Agreement (South India)',
    desc: 'Standard collaboration agreement covering deliverables, timelines, exclusivity, payment terms, and dispute resolution for South Indian creators.',
    pages: 12,
    updated: 'March 2026',
    icon: '🤝',
  },
  {
    id: 2,
    title: 'Content Usage Rights & Licensing Agreement',
    desc: 'Governs brand rights to repurpose creator content across digital and traditional media with duration and territory clauses.',
    pages: 8,
    updated: 'January 2026',
    icon: '📋',
  },
  {
    id: 3,
    title: 'Influencer Campaign Non-Disclosure Agreement',
    desc: 'Mutual NDA protecting campaign strategies, audience data, creative briefs, and unreleased product information.',
    pages: 5,
    updated: 'April 2026',
    icon: '🔒',
  },
];

/* ------------------------------------------------------------------ */
/* Invoice data                                                          */
/* ------------------------------------------------------------------ */

type InvoiceStatus = 'Paid' | 'Pending';

interface Invoice {
  id: string;
  brand: string;
  amount: number;
  gst: number;
  total: number;
  status: InvoiceStatus;
  date: string;
}

const INVOICES: Invoice[] = [
  {
    id: 'INV-2026-041',
    brand: 'Malabar Gold',
    amount: 85000,
    gst: 15300,
    total: 100300,
    status: 'Paid',
    date: '10 May 2026',
  },
  {
    id: 'INV-2026-038',
    brand: 'KFC India',
    amount: 120000,
    gst: 21600,
    total: 141600,
    status: 'Pending',
    date: '2 May 2026',
  },
  {
    id: 'INV-2026-031',
    brand: "Byju's",
    amount: 60000,
    gst: 10800,
    total: 70800,
    status: 'Pending',
    date: '22 April 2026',
  },
];

const STATUS_STYLE: Record<InvoiceStatus, { bg: string; color: string }> = {
  Paid: { bg: 'rgba(52,211,153,0.15)', color: '#34d399' },
  Pending: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
};

function fmt(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

/* ------------------------------------------------------------------ */
/* Invoice dialog form state                                             */
/* ------------------------------------------------------------------ */

interface InvoiceForm {
  brand: string;
  amount: string;
  gst: string;
  description: string;
}

const EMPTY_FORM: InvoiceForm = { brand: '', amount: '', gst: '18', description: '' };

/* ------------------------------------------------------------------ */
/* Page                                                                  */
/* ------------------------------------------------------------------ */

export default function LegalPage() {
  const [newInvoiceOpen, setNewInvoiceOpen] = useState(false);
  const [form, setForm] = useState<InvoiceForm>(EMPTY_FORM);
  const [generating, setGenerating] = useState(false);

  function handleGenerate() {
    if (!form.brand || !form.amount) {
      toast.error('Please fill in brand name and amount.');
      return;
    }
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setNewInvoiceOpen(false);
      setForm(EMPTY_FORM);
      toast.success(`Invoice generated for ${form.brand}!`, {
        description: `Amount: ₹${Number(form.amount).toLocaleString('en-IN')} + ${form.gst}% GST`,
      });
    }, 900);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight text-white font-bricolage"
          >
            Legal &amp; Invoicing
          </h1>
          <p className="text-sm mt-1 text-gray-400">
            Contract templates and GST-compliant invoicing for creator campaigns.
          </p>
        </div>
        <Button
          className="flex items-center gap-2 bg-[#C9A84C] hover:bg-[#b0913b] text-slate-950 font-bold"
          style={{ border: 'none', borderRadius: '10px' }}
          onClick={() => setNewInvoiceOpen(true)}
        >
          <Plus size={15} />
          Generate New Invoice
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="contracts">
        <TabsList className="mb-4 bg-white/5 border border-white/10 p-1">
          <TabsTrigger value="contracts" className="data-[state=active]:bg-[#C9A84C] data-[state=active]:text-slate-950 text-gray-300">
            <FileText size={14} className="mr-2" />
            Contracts
          </TabsTrigger>
          <TabsTrigger value="invoices" className="data-[state=active]:bg-[#C9A84C] data-[state=active]:text-slate-950 text-gray-300">
            <IndianRupee size={14} className="mr-2" />
            Invoices
          </TabsTrigger>
        </TabsList>

        {/* ── Contracts tab ── */}
        <TabsContent value="contracts">
          <div className="space-y-4">
            {CONTRACTS.map((c) => (
              <Card
                key={c.id}
                className="border-0 shadow-sm"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(240, 235, 224, 0.08)',
                  borderRadius: '14px',
                }}
              >
                <CardHeader className="pb-0">
                  <div className="flex items-start gap-3">
                    <div
                      className="flex items-center justify-center w-10 h-10 rounded-xl text-xl shrink-0 border border-white/5"
                      style={{ background: 'rgba(255, 255, 255, 0.02)' }}
                    >
                      {c.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm font-semibold text-white font-bricolage">
                        {c.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge
                          className="bg-white/5 text-gray-400 border-0 text-[10px]"
                        >
                          {c.pages} pages
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Updated {c.updated}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-2 pb-4">
                  <p className="text-xs leading-relaxed mb-3 text-gray-400">
                    {c.desc}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="text-xs font-semibold h-8 gap-1.5 border-white/10 text-gray-300 hover:bg-white/5 hover:text-white bg-transparent"
                      style={{ borderRadius: '8px' }}
                      onClick={() => alert(`Opening preview for "${c.title}"`)}
                    >
                      <Eye size={13} />
                      Preview
                    </Button>
                    <Button
                      className="text-xs bg-[#C9A84C] hover:bg-[#b0913b] text-slate-950 font-bold h-8 gap-1.5"
                      style={{
                        border: 'none',
                        borderRadius: '8px',
                      }}
                      onClick={() => alert(`Downloading PDF: "${c.title}"`)}
                    >
                      <Download size={13} />
                      Download PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ── Invoices tab ── */}
        <TabsContent value="invoices">
          <Card
            className="border-0 shadow-sm overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(240, 235, 224, 0.08)',
              borderRadius: '14px',
            }}
          >
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-white/5 hover:bg-transparent">
                    {['Invoice #', 'Brand', 'Amount', 'GST (18%)', 'Total', 'Status', 'Date', 'Action'].map(
                      (h) => (
                        <TableHead key={h} className="text-xs font-semibold text-gray-400">
                          {h}
                        </TableHead>
                      )
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {INVOICES.map((inv) => {
                    const s = STATUS_STYLE[inv.status];
                    return (
                      <TableRow key={inv.id} className="border-b border-white/5 hover:bg-white/[0.01]">
                        <TableCell>
                          <span className="font-mono text-xs font-medium text-white">
                            {inv.id}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium text-white">
                            {inv.brand}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-300">
                            {fmt(inv.amount)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-300">
                            {fmt(inv.gst)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-bold text-[#C9A84C] font-bricolage">
                            {fmt(inv.total)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className="text-xs font-semibold px-2 border-0"
                            style={{ background: s.bg, color: s.color }}
                          >
                            {inv.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-gray-400">
                            {inv.date}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            className="h-7 text-xs px-2 gap-1 text-gray-300 hover:text-white hover:bg-white/5"
                            onClick={() => alert(`Downloading invoice ${inv.id}`)}
                          >
                            <Download size={12} />
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── Generate invoice dialog ── */}
      <Dialog open={newInvoiceOpen} onOpenChange={setNewInvoiceOpen}>
        <DialogContent className="sm:max-w-sm bg-slate-950 border border-white/10 text-white" style={{ borderRadius: '16px' }}>
          <DialogHeader>
            <DialogTitle className="text-white font-bricolage text-lg">Generate New Invoice</DialogTitle>
            <DialogDescription className="text-gray-400 text-xs">
              Fill in the details below. A GST-compliant invoice PDF will be created automatically.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-300">
                Brand Name
              </Label>
              <Input
                placeholder="e.g. Malabar Gold"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-[#C9A84C]"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-300">
                Amount (₹)
              </Label>
              <Input
                type="number"
                placeholder="e.g. 85000"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-[#C9A84C]"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-300">
                GST %
              </Label>
              <Input
                type="number"
                placeholder="18"
                value={form.gst}
                onChange={(e) => setForm({ ...form, gst: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-[#C9A84C]"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-300">
                Description
              </Label>
              <Input
                placeholder="e.g. Content creation for Onam Campaign"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-[#C9A84C]"
              />
            </div>

            {/* GST preview */}
            {form.amount && form.gst && (
              <div
                className="rounded-xl px-3 py-2.5 text-xs space-y-1 border border-[#C9A84C]/20 bg-[#C9A84C]/5"
              >
                <div className="flex justify-between">
                  <span className="text-gray-400">Base amount</span>
                  <span className="font-semibold text-white">
                    {fmt(Number(form.amount))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">GST ({form.gst}%)</span>
                  <span className="font-semibold text-white">
                    {fmt(Math.round((Number(form.amount) * Number(form.gst)) / 100))}
                  </span>
                </div>
                <div className="flex justify-between font-bold pt-1.5 border-t border-[#C9A84C]/25">
                  <span className="text-[#C9A84C]">Total</span>
                  <span className="text-[#C9A84C] font-bricolage">
                    {fmt(
                      Math.round(Number(form.amount) * (1 + Number(form.gst) / 100))
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose render={<Button variant="outline" className="border-white/10 text-gray-300 hover:bg-white/5 hover:text-white bg-transparent" />}>Cancel</DialogClose>
            <Button
              disabled={generating}
              className="bg-[#C9A84C] hover:bg-[#b0913b] text-slate-950 font-bold"
              style={{ border: 'none' }}
              onClick={handleGenerate}
            >
              {generating ? 'Generating…' : 'Generate Invoice'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
