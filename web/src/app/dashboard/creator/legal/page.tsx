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
  Paid: { bg: 'rgba(34,197,94,0.10)', color: '#15803d' },
  Pending: { bg: 'rgba(245,158,11,0.10)', color: '#b45309' },
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
    <div style={{ background: BG, minHeight: '100%' }} className="p-6 rounded-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: INDIGO, fontFamily: 'var(--font-bricolage, sans-serif)' }}
          >
            Legal &amp; Invoicing
          </h1>
          <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
            Contract templates and GST-compliant invoicing for creator campaigns.
          </p>
        </div>
        <Button
          className="flex items-center gap-2 font-semibold"
          style={{ background: GOLD, color: '#fff', border: 'none', borderRadius: '10px' }}
          onClick={() => setNewInvoiceOpen(true)}
        >
          <Plus size={15} />
          Generate New Invoice
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="contracts">
        <TabsList className="mb-4">
          <TabsTrigger value="contracts">
            <FileText size={14} />
            Contracts
          </TabsTrigger>
          <TabsTrigger value="invoices">
            <IndianRupee size={14} />
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
                style={{ background: '#fff', borderRadius: '14px' }}
              >
                <CardHeader className="pb-0">
                  <div className="flex items-start gap-3">
                    <div
                      className="flex items-center justify-center w-10 h-10 rounded-xl text-xl shrink-0"
                      style={{ background: 'rgba(8,13,38,0.06)' }}
                    >
                      {c.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm font-semibold" style={{ color: INDIGO }}>
                        {c.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge
                          style={{
                            background: 'rgba(8,13,38,0.06)',
                            color: '#6b7280',
                            border: 'none',
                            fontSize: '10px',
                          }}
                        >
                          {c.pages} pages
                        </Badge>
                        <span className="text-xs" style={{ color: '#9ca3af' }}>
                          Updated {c.updated}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-2 pb-4">
                  <p className="text-xs leading-relaxed mb-3" style={{ color: '#6b7280' }}>
                    {c.desc}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="text-xs font-semibold h-8 gap-1.5"
                      style={{ borderRadius: '8px' }}
                      onClick={() => alert(`Opening preview for "${c.title}"`)}
                    >
                      <Eye size={13} />
                      Preview
                    </Button>
                    <Button
                      className="text-xs font-semibold h-8 gap-1.5"
                      style={{
                        background: GOLD,
                        color: '#fff',
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
          <Card className="border-0 shadow-sm" style={{ background: '#fff', borderRadius: '14px' }}>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow style={{ borderBottomColor: '#f3f4f6' }}>
                    {['Invoice #', 'Brand', 'Amount', 'GST (18%)', 'Total', 'Status', 'Date', 'Action'].map(
                      (h) => (
                        <TableHead key={h} className="text-xs font-semibold" style={{ color: '#9ca3af' }}>
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
                      <TableRow key={inv.id} style={{ borderBottomColor: '#f9fafb' }}>
                        <TableCell>
                          <span className="font-mono text-xs font-medium" style={{ color: INDIGO }}>
                            {inv.id}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium" style={{ color: INDIGO }}>
                            {inv.brand}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm" style={{ color: '#374151' }}>
                            {fmt(inv.amount)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm" style={{ color: '#374151' }}>
                            {fmt(inv.gst)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-bold" style={{ color: GOLD }}>
                            {fmt(inv.total)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className="text-xs font-semibold px-2"
                            style={{ background: s.bg, color: s.color, border: 'none' }}
                          >
                            {inv.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs" style={{ color: '#6b7280' }}>
                            {inv.date}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            className="h-7 text-xs px-2 gap-1"
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
        <DialogContent className="sm:max-w-sm" style={{ borderRadius: '16px' }}>
          <DialogHeader>
            <DialogTitle>Generate New Invoice</DialogTitle>
            <DialogDescription>
              Fill in the details below. A GST-compliant invoice PDF will be created automatically.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium" style={{ color: INDIGO }}>
                Brand Name
              </Label>
              <Input
                placeholder="e.g. Malabar Gold"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium" style={{ color: INDIGO }}>
                Amount (₹)
              </Label>
              <Input
                type="number"
                placeholder="e.g. 85000"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium" style={{ color: INDIGO }}>
                GST %
              </Label>
              <Input
                type="number"
                placeholder="18"
                value={form.gst}
                onChange={(e) => setForm({ ...form, gst: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium" style={{ color: INDIGO }}>
                Description
              </Label>
              <Input
                placeholder="e.g. Content creation for Onam Campaign"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            {/* GST preview */}
            {form.amount && form.gst && (
              <div
                className="rounded-xl px-3 py-2.5 text-xs space-y-1"
                style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.20)' }}
              >
                <div className="flex justify-between">
                  <span style={{ color: '#92400e' }}>Base amount</span>
                  <span className="font-semibold" style={{ color: INDIGO }}>
                    {fmt(Number(form.amount))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#92400e' }}>GST ({form.gst}%)</span>
                  <span className="font-semibold" style={{ color: INDIGO }}>
                    {fmt(Math.round((Number(form.amount) * Number(form.gst)) / 100))}
                  </span>
                </div>
                <div className="flex justify-between font-bold pt-1" style={{ borderTop: '1px solid rgba(201,168,76,0.20)' }}>
                  <span style={{ color: GOLD }}>Total</span>
                  <span style={{ color: GOLD }}>
                    {fmt(
                      Math.round(Number(form.amount) * (1 + Number(form.gst) / 100))
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button
              disabled={generating}
              style={{ background: GOLD, color: '#fff', border: 'none' }}
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
