'use client';

import { useState } from 'react';
import {
  Store,
  Search,
  CheckCircle2,
  Ban,
  Building2,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Award,
  X,
  FileText,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

/* ------------------------------------------------------------------ */
/* Constants                                                             */
/* ------------------------------------------------------------------ */

const GOLD = '#C9A84C';

interface MerchantItem {
  id: string;
  brandName: string;
  industry: string;
  activeCampaigns: number;
  escrowLocked: string;
  totalDeployed: string;
  trustScore: number;
  status: 'verified' | 'pending' | 'suspended';
  campaigns: { title: string; budget: string; status: string }[];
}

const INITIAL_MERCHANTS: MerchantItem[] = [
  {
    id: 'm-1',
    brandName: 'Malabar Gold & Diamonds',
    industry: 'Jewelry & Luxury',
    activeCampaigns: 4,
    escrowLocked: '₹8,20,000',
    totalDeployed: '₹42,00,000',
    trustScore: 97,
    status: 'verified',
    campaigns: [
      { title: 'Kerala Onam Campaign', budget: '₹1,40,000', status: 'completed' },
      { title: 'Bridal Edit 2026', budget: '₹3,50,000', status: 'active' },
      { title: 'Gold Rate Awareness', budget: '₹1,00,000', status: 'active' },
    ],
  },
  {
    id: 'm-2',
    brandName: 'Ather Energy',
    industry: 'Automotive & CleanTech',
    activeCampaigns: 2,
    escrowLocked: '₹4,50,000',
    totalDeployed: '₹18,00,000',
    trustScore: 91,
    status: 'verified',
    campaigns: [
      { title: 'Ather EV Awareness South India', budget: '₹2,50,000', status: 'active' },
      { title: 'Apex Launch Drive', budget: '₹2,00,000', status: 'completed' },
    ],
  },
  {
    id: 'm-3',
    brandName: 'Nykaa India',
    industry: 'E-commerce & Cosmetics',
    activeCampaigns: 1,
    escrowLocked: '₹6,00,000',
    totalDeployed: '₹6,00,000',
    trustScore: 84,
    status: 'pending',
    campaigns: [
      { title: 'Beauty Festive Edit', budget: '₹6,00,000', status: 'active' },
    ],
  },
  {
    id: 'm-4',
    brandName: 'KFC India',
    industry: 'Food & Beverage',
    activeCampaigns: 0,
    escrowLocked: '₹0',
    totalDeployed: '₹12,40,000',
    trustScore: 88,
    status: 'verified',
    campaigns: [
      { title: 'KFC Biryani Bucket Drive', budget: '₹3,80,000', status: 'completed' },
      { title: 'Friday Specials Release', budget: '₹4,00,000', status: 'completed' },
    ],
  },
  {
    id: 'm-5',
    brandName: 'Daily Delights',
    industry: 'Consumer Goods',
    activeCampaigns: 0,
    escrowLocked: '₹0',
    totalDeployed: '₹2,10,000',
    trustScore: 52,
    status: 'suspended',
    campaigns: [
      { title: 'Local Curry Paste Promo', budget: '₹2,10,000', status: 'cancelled' },
    ],
  },
];

export default function SuperAdminMerchants() {
  const [merchants, setMerchants] = useState<MerchantItem[]>(INITIAL_MERCHANTS);
  const [search, setSearch] = useState('');
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantItem | null>(null);

  // Filter roster
  const filteredMerchants = merchants.filter(
    (m) =>
      m.brandName.toLowerCase().includes(search.toLowerCase()) ||
      m.industry.toLowerCase().includes(search.toLowerCase())
  );

  // Toggle Verification
  const toggleVerification = (id: string) => {
    setMerchants(
      merchants.map((m) => {
        if (m.id !== id) return m;
        const newStatus = m.status === 'verified' ? 'pending' : 'verified';
        return { ...m, status: newStatus };
      })
    );
  };

  // Toggle Suspend
  const toggleSuspend = (id: string) => {
    setMerchants(
      merchants.map((m) => {
        if (m.id !== id) return m;
        const newStatus = m.status === 'suspended' ? 'pending' : 'suspended';
        return { ...m, status: newStatus };
      })
    );
  };

  // View campaigns
  const viewCampaigns = (m: MerchantItem) => {
    setSelectedMerchant(m);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white font-bricolage">
          Merchant Accounts & Secure Deposits
        </h1>
        <p className="text-sm text-gray-400">
          Verify corporate entities, review campaign audits, and manage secure deposit guarantees.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-3 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Search brand name or industry..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Merchants Table */}
      <Card
        className="border-0"
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(240, 235, 224, 0.08)',
        }}
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-white font-bricolage">
            Corporate Merchant Partners ({filteredMerchants.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow style={{ borderColor: 'rgba(240,235,224,0.06)' }}>
                  <TableHead className="pl-6 text-gray-400 text-xs">Brand Partner</TableHead>
                  <TableHead className="text-gray-400 text-xs text-center">Active Campaigns</TableHead>
                  <TableHead className="text-gray-400 text-xs text-right">Secure Deposit Balance</TableHead>
                  <TableHead className="text-gray-400 text-xs text-right">Total Deployed</TableHead>
                  <TableHead className="text-gray-400 text-xs text-center">Trust Index</TableHead>
                  <TableHead className="text-gray-400 text-xs text-center">Status</TableHead>
                  <TableHead className="pr-6 text-gray-400 text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMerchants.map((m) => {
                  const scoreColor =
                    m.trustScore >= 85
                      ? 'text-emerald-400'
                      : m.trustScore >= 70
                      ? 'text-amber-400'
                      : 'text-rose-400';
                  return (
                    <TableRow
                      key={m.id}
                      style={{ borderColor: 'rgba(240,235,224,0.04)' }}
                      className="hover:bg-white/[0.01] transition-colors"
                    >
                      {/* Avatar & Name */}
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                            style={{
                              background: 'rgba(201,168,76,0.06)',
                              border: '1px solid rgba(201,168,76,0.15)',
                            }}
                          >
                            <Building2 size={16} style={{ color: GOLD }} />
                          </div>
                          <div>
                            <span className="font-semibold text-sm text-[#F0EBE0] font-bricolage block">
                              {m.brandName}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {m.industry}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Active Campaigns count */}
                      <TableCell className="text-center font-bold text-sm text-[#F0EBE0] font-mono">
                        {m.activeCampaigns}
                      </TableCell>

                      {/* Escrow balance */}
                      <TableCell className="text-right text-sm font-semibold text-emerald-400 font-mono">
                        {m.escrowLocked}
                      </TableCell>

                      {/* Total deployed */}
                      <TableCell className="text-right text-sm text-gray-300 font-mono">
                        {m.totalDeployed}
                      </TableCell>

                      {/* Trust index score */}
                      <TableCell className="text-center">
                        <span className={`text-sm font-bold font-mono ${scoreColor}`}>
                          {m.trustScore}%
                        </span>
                      </TableCell>

                      {/* Compliance Status badge */}
                      <TableCell className="text-center">
                        <Badge
                          variant="secondary"
                          className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                            m.status === 'verified'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : m.status === 'pending'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {m.status.toUpperCase()}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="pr-6 text-right py-4">
                        <div className="flex items-center justify-end gap-3 text-xs">
                          <button
                            onClick={() => viewCampaigns(m)}
                            className="text-gray-400 hover:text-[#C9A84C] hover:underline"
                          >
                            View Campaigns
                          </button>

                          {/* Toggle Suspend */}
                          <button
                            onClick={() => toggleSuspend(m.id)}
                            className={`p-1.5 rounded-lg border transition-all ${
                              m.status === 'suspended'
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                                : 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20'
                            }`}
                            title={m.status === 'suspended' ? 'Re-activate Brand' : 'Block Brand'}
                          >
                            <Ban size={14} />
                          </button>

                          {/* Verify Toggle */}
                          <button
                            onClick={() => toggleVerification(m.id)}
                            className={`p-1.5 rounded-lg border transition-all ${
                              m.status === 'verified'
                                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                                : 'bg-[#C9A84C]/10 border-[#C9A84C]/20 text-[#C9A84C] hover:bg-[#C9A84C]/20'
                            }`}
                            title={m.status === 'verified' ? 'Revoke Verification' : 'Verify Brand'}
                          >
                            <Award size={14} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* CAMPAIGNS LIST DIALOG (MODAL) */}
      {selectedMerchant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div
            className="w-full max-w-md rounded-2xl border-0 p-6 space-y-6"
            style={{
              background: '#080D26',
              border: '1px solid rgba(240, 235, 224, 0.15)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-white font-bricolage">
                  {selectedMerchant.brandName}
                </h3>
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-mono">
                  Campaign Portfolio
                </span>
              </div>
              <button
                onClick={() => setSelectedMerchant(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              {selectedMerchant.campaigns.length === 0 ? (
                <p className="text-xs text-gray-400 italic text-center py-4">
                  No campaigns launched yet.
                </p>
              ) : (
                selectedMerchant.campaigns.map((camp, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-white/5 bg-white/[0.01] flex items-center justify-between text-xs"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-gray-200">{camp.title}</span>
                      <span className="text-[10px] text-gray-500 flex items-center gap-1">
                        <Clock size={10} />
                        Budget: {camp.budget}
                      </span>
                    </div>
                    <Badge
                      className={`text-[8px] font-bold uppercase rounded px-1.5 py-0.5 ${
                        camp.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : camp.status === 'completed'
                          ? 'bg-blue-500/10 text-blue-400'
                          : 'bg-gray-500/10 text-gray-400'
                      }`}
                    >
                      {camp.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
