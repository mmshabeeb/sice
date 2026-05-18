'use client';

import { useState } from 'react';
import {
  Wallet,
  Lock,
  CheckCircle2,
  Plus,
  FileText,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  TrendingUp,
  Clock,
  IndianRupee,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
/* Brand tokens                                                          */
/* ------------------------------------------------------------------ */
const GOLD = '#C9A84C';
const INDIGO = '#080D26';
const BG = '#F8F7F4';

/* ------------------------------------------------------------------ */
/* Types & mock data                                                     */
/* ------------------------------------------------------------------ */
type EscrowStatus = 'deposited' | 'in_escrow' | 'content_approved';

interface EscrowRow {
  id: number;
  campaign: string;
  creator: string;
  amount: string;
  amountRaw: number;
  status: EscrowStatus;
  contractId: string;
}

type TxType = 'credit' | 'debit';
type TxStatus = 'completed' | 'pending' | 'failed';

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: string;
  type: TxType;
  status: TxStatus;
}

const ESCROW_ROWS: EscrowRow[] = [
  {
    id: 1,
    campaign: 'Kerala Onam Campaign',
    creator: 'Arjun Menon',
    amount: '₹85,000',
    amountRaw: 85000,
    status: 'content_approved',
    contractId: 'CTR-2025-0041',
  },
  {
    id: 2,
    campaign: 'South India Launch',
    creator: 'Priya Nair',
    amount: '₹1,20,000',
    amountRaw: 120000,
    status: 'in_escrow',
    contractId: 'CTR-2025-0038',
  },
  {
    id: 3,
    campaign: 'Festive Creator Program',
    creator: 'Rahul Suresh',
    amount: '₹95,000',
    amountRaw: 95000,
    status: 'deposited',
    contractId: 'CTR-2025-0035',
  },
  {
    id: 4,
    campaign: 'Beauty Edit',
    creator: 'Meera Pillai',
    amount: '₹45,000',
    amountRaw: 45000,
    status: 'content_approved',
    contractId: 'CTR-2025-0033',
  },
];

const TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    date: 'May 19, 2025',
    description: 'Payment released — Arun Vijay · Kerala Onam',
    amount: '₹1,20,000',
    type: 'debit',
    status: 'completed',
  },
  {
    id: 2,
    date: 'May 15, 2025',
    description: 'Escrow deposit — South India Launch Series',
    amount: '₹1,20,000',
    type: 'debit',
    status: 'completed',
  },
  {
    id: 3,
    date: 'May 10, 2025',
    description: 'Funds added via Razorpay',
    amount: '₹2,00,000',
    type: 'credit',
    status: 'completed',
  },
  {
    id: 4,
    date: 'May 8, 2025',
    description: 'Payment released — Karthik Raja · Festive Program',
    amount: '₹70,000',
    type: 'debit',
    status: 'completed',
  },
  {
    id: 5,
    date: 'May 5, 2025',
    description: 'Escrow deposit — Kerala Onam Campaign',
    amount: '₹85,000',
    type: 'debit',
    status: 'completed',
  },
  {
    id: 6,
    date: 'Apr 30, 2025',
    description: 'Funds added via Razorpay',
    amount: '₹5,00,000',
    type: 'credit',
    status: 'completed',
  },
  {
    id: 7,
    date: 'Apr 25, 2025',
    description: 'GST Platform Fee',
    amount: '₹4,500',
    type: 'debit',
    status: 'completed',
  },
  {
    id: 8,
    date: 'Apr 20, 2025',
    description: 'Payment released — Anjali Menon · Brand Edit',
    amount: '₹55,000',
    type: 'debit',
    status: 'completed',
  },
];

const ESCROW_STATUS_LABELS: Record<EscrowStatus, { label: string; bg: string; color: string }> = {
  deposited: { label: 'Deposited', bg: 'rgba(14,165,233,0.10)', color: '#0284c7' },
  in_escrow: { label: 'In Escrow', bg: 'rgba(251,191,36,0.12)', color: '#d97706' },
  content_approved: { label: 'Content Approved', bg: 'rgba(34,197,94,0.10)', color: '#16a34a' },
};

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
/* Page                                                                  */
/* ------------------------------------------------------------------ */
export default function WalletPage() {
  const [addFundsOpen, setAddFundsOpen] = useState(false);
  const [fundAmount, setFundAmount] = useState('');
  const [escrowRows, setEscrowRows] = useState<EscrowRow[]>(ESCROW_ROWS);
  const [releasedIds, setReleasedIds] = useState<number[]>([]);

  const handleReleasePayment = (id: number) => {
    setReleasedIds((prev) => [...prev, id]);
    setEscrowRows((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: 'deposited' as EscrowStatus } : r
      )
    );
  };

  const handleRazorpay = () => {
    alert('Razorpay payment gateway would open here.\nAmount: ₹' + (fundAmount || '0'));
  };

  const totalReleased = releasedIds.reduce((sum, id) => {
    const row = ESCROW_ROWS.find((r) => r.id === id);
    return sum + (row?.amountRaw ?? 0);
  }, 0);

  const displayReleased = 820000 + totalReleased;

  return (
    <div style={{ background: BG, minHeight: '100%' }} className="p-6 space-y-7">
      {/* ── Page header ── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: INDIGO }}>
            Wallet &amp; Escrow
          </h1>
          <p className="text-sm mt-1 text-gray-500">
            Manage your funds, escrow deposits, and creator payment releases.
          </p>
        </div>

        {/* Add Funds dialog */}
        <Dialog open={addFundsOpen} onOpenChange={setAddFundsOpen}>
          <DialogTrigger
            render={
              <Button
                className="h-9 px-5 text-sm font-semibold gap-2"
                style={{ background: GOLD, color: INDIGO, border: 'none' }}
              />
            }
          >
            <Plus size={15} /> Add Funds
          </DialogTrigger>

          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Add Funds to Wallet</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Amount (₹)</Label>
                <div className="relative">
                  <IndianRupee
                    size={13}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    className="pl-7"
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                  />
                </div>
              </div>

              <div
                className="rounded-xl p-3 text-xs space-y-1"
                style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.20)' }}
              >
                <div className="flex justify-between text-gray-600">
                  <span>Amount</span>
                  <span>₹{fundAmount ? parseInt(fundAmount).toLocaleString('en-IN') : '0'}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Platform Fee (1.5%)</span>
                  <span>₹{fundAmount ? Math.round(parseInt(fundAmount) * 0.015).toLocaleString('en-IN') : '0'}</span>
                </div>
                <Separator className="my-1" />
                <div className="flex justify-between font-semibold" style={{ color: INDIGO }}>
                  <span>Total Payable</span>
                  <span>₹{fundAmount ? Math.round(parseInt(fundAmount) * 1.015).toLocaleString('en-IN') : '0'}</span>
                </div>
              </div>

              <Button
                className="w-full h-10 text-sm font-semibold gap-2"
                style={{ background: INDIGO, color: '#fff', border: 'none' }}
                onClick={handleRazorpay}
              >
                <CreditCard size={15} /> Pay via Razorpay
              </Button>
            </div>

            <DialogFooter showCloseButton />
          </DialogContent>
        </Dialog>
      </div>

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Available balance */}
        <Card
          className="border-0 shadow-sm"
          style={{ background: '#fff', borderRadius: 14 }}
        >
          <CardContent className="flex items-center gap-4 py-5">
            <div
              className="flex items-center justify-center w-12 h-12 rounded-xl shrink-0"
              style={{ background: 'rgba(34,197,94,0.08)' }}
            >
              <Wallet size={22} style={{ color: '#22c55e' }} />
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium">Available Balance</div>
              <div className="text-2xl font-bold mt-0.5" style={{ color: '#16a34a' }}>
                ₹1,25,000
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                <TrendingUp size={9} /> Ready to deploy
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Locked in escrow */}
        <Card
          className="border-0 shadow-sm"
          style={{ background: '#fff', borderRadius: 14 }}
        >
          <CardContent className="flex items-center gap-4 py-5">
            <div
              className="flex items-center justify-center w-12 h-12 rounded-xl shrink-0"
              style={{ background: 'rgba(201,168,76,0.08)' }}
            >
              <Lock size={22} style={{ color: GOLD }} />
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium">Locked in Escrow</div>
              <div className="text-2xl font-bold mt-0.5" style={{ color: GOLD }}>
                ₹3,45,000
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                <Clock size={9} /> 4 active contracts
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total released */}
        <Card
          className="border-0 shadow-sm"
          style={{ background: '#fff', borderRadius: 14 }}
        >
          <CardContent className="flex items-center gap-4 py-5">
            <div
              className="flex items-center justify-center w-12 h-12 rounded-xl shrink-0"
              style={{ background: 'rgba(99,102,241,0.08)' }}
            >
              <CheckCircle2 size={22} style={{ color: '#6366f1' }} />
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium">Total Released</div>
              <div className="text-2xl font-bold mt-0.5" style={{ color: '#6366f1' }}>
                ₹{displayReleased.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                <CheckCircle2 size={9} /> 12 payments completed
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Active escrow table ── */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Active Escrow Contracts
        </h2>
        <Card
          className="border-0 shadow-sm overflow-hidden"
          style={{ background: '#fff', borderRadius: 14 }}
        >
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-100">
                  <TableHead className="pl-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Campaign
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Creator
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Amount Locked
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Contract
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-400 uppercase tracking-wider pr-5">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {escrowRows.map((row) => {
                  const s = ESCROW_STATUS_LABELS[row.status];
                  const released = releasedIds.includes(row.id);
                  return (
                    <TableRow key={row.id} className="border-b border-gray-50">
                      {/* Campaign */}
                      <TableCell className="pl-5">
                        <span className="font-medium text-sm" style={{ color: INDIGO }}>
                          {row.campaign}
                        </span>
                      </TableCell>

                      {/* Creator */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white shrink-0"
                            style={{ background: INDIGO }}
                          >
                            {getInitials(row.creator)}
                          </div>
                          <span className="text-sm text-gray-700">{row.creator}</span>
                        </div>
                      </TableCell>

                      {/* Amount */}
                      <TableCell>
                        <span className="text-sm font-bold" style={{ color: INDIGO }}>
                          {row.amount}
                        </span>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <span
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                          style={{ background: s.bg, color: s.color }}
                        >
                          {released ? 'Payment Released' : s.label}
                        </span>
                      </TableCell>

                      {/* Contract ID */}
                      <TableCell>
                        <div className="flex items-center gap-1 text-xs text-gray-500 font-mono">
                          <FileText size={11} />
                          {row.contractId}
                        </div>
                      </TableCell>

                      {/* Action */}
                      <TableCell className="pr-5">
                        {!released && row.status === 'content_approved' ? (
                          <Button
                            className="h-8 px-3 text-xs font-semibold gap-1"
                            style={{ background: GOLD, color: INDIGO, border: 'none' }}
                            onClick={() => handleReleasePayment(row.id)}
                          >
                            <ArrowUpRight size={12} /> Release Payment
                          </Button>
                        ) : released ? (
                          <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                            <CheckCircle2 size={12} /> Released
                          </span>
                        ) : (
                          <Button
                            variant="outline"
                            className="h-8 px-3 text-xs gap-1"
                          >
                            <ExternalLink size={12} /> View Contract
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* ── Transaction history ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Transaction History
          </h2>
          <Button variant="outline" className="h-7 px-3 text-xs gap-1">
            <FileText size={11} /> Export CSV
          </Button>
        </div>
        <Card
          className="border-0 shadow-sm overflow-hidden"
          style={{ background: '#fff', borderRadius: 14 }}
        >
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-100">
                  <TableHead className="pl-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Date
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Description
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Amount
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Type
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-400 uppercase tracking-wider pr-5">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TRANSACTIONS.map((tx) => (
                  <TableRow key={tx.id} className="border-b border-gray-50">
                    {/* Date */}
                    <TableCell className="pl-5">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Clock size={11} />
                        {tx.date}
                      </div>
                    </TableCell>

                    {/* Description */}
                    <TableCell>
                      <span className="text-sm text-gray-700">{tx.description}</span>
                    </TableCell>

                    {/* Amount */}
                    <TableCell>
                      <div
                        className="flex items-center gap-1 text-sm font-semibold"
                        style={{ color: tx.type === 'credit' ? '#16a34a' : INDIGO }}
                      >
                        {tx.type === 'credit' ? (
                          <ArrowDownLeft size={13} style={{ color: '#16a34a' }} />
                        ) : (
                          <ArrowUpRight size={13} style={{ color: '#dc2626' }} />
                        )}
                        {tx.amount}
                      </div>
                    </TableCell>

                    {/* Type */}
                    <TableCell>
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                        style={
                          tx.type === 'credit'
                            ? { background: 'rgba(34,197,94,0.10)', color: '#16a34a' }
                            : { background: 'rgba(239,68,68,0.08)', color: '#dc2626' }
                        }
                      >
                        {tx.type === 'credit' ? 'Credit' : 'Debit'}
                      </span>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="pr-5">
                      <span
                        className="inline-flex items-center gap-1 text-xs font-medium"
                        style={{
                          color:
                            tx.status === 'completed'
                              ? '#16a34a'
                              : tx.status === 'pending'
                              ? '#d97706'
                              : '#dc2626',
                        }}
                      >
                        {tx.status === 'completed' && <CheckCircle2 size={11} />}
                        {tx.status === 'pending' && <Clock size={11} />}
                        <span className="capitalize">{tx.status}</span>
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* ── Escrow info banner ── */}
      <Card
        className="border-0 shadow-sm"
        style={{
          background: INDIGO,
          borderRadius: 14,
        }}
      >
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4 px-5">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
            style={{ background: 'rgba(201,168,76,0.15)' }}
          >
            <Lock size={20} style={{ color: GOLD }} />
          </div>
          <div className="flex-1">
            <div className="text-white font-semibold text-sm">
              How SICE Escrow Works
            </div>
            <div className="text-xs mt-1" style={{ color: 'rgba(240,235,224,0.65)' }}>
              Funds are locked in SICE-managed escrow when a campaign is created. Payment is released automatically once you approve the creator&apos;s deliverables. This protects both parties and ensures fair compensation.
            </div>
          </div>
          <Button
            variant="outline"
            className="shrink-0 text-xs h-8 px-4 border-white/20 text-white hover:bg-white/10"
          >
            Learn More
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
