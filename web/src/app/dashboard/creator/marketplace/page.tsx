'use client';

import { useState } from 'react';
import { Search, Calendar, Tag, IndianRupee } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
/* Campaign data                                                         */
/* ------------------------------------------------------------------ */

const CAMPAIGNS = [
  {
    id: 1,
    brand: 'Malabar Gold',
    title: 'Kerala Onam Campaign',
    budget: '₹85,000',
    budgetNum: 85000,
    languages: ['Malayalam'],
    category: 'Jewellery',
    deadline: 'June 15, 2026',
    logo: '🪙',
    color: '#C9A84C',
  },
  {
    id: 2,
    brand: 'KFC India',
    title: 'South India Launch',
    budget: '₹1,20,000',
    budgetNum: 120000,
    languages: ['Tamil', 'Telugu', 'Kannada', 'Malayalam'],
    category: 'Food & Beverage',
    deadline: 'June 30, 2026',
    logo: '🍗',
    color: '#E4002B',
  },
  {
    id: 3,
    brand: "Byju's",
    title: 'Education Creator Program',
    budget: '₹60,000',
    budgetNum: 60000,
    languages: ['Malayalam', 'Tamil'],
    category: 'EdTech',
    deadline: 'July 10, 2026',
    logo: '📚',
    color: '#7B2FF7',
  },
  {
    id: 4,
    brand: 'Ather Energy',
    title: 'EV Awareness',
    budget: '₹95,000',
    budgetNum: 95000,
    languages: ['Tamil', 'Kannada'],
    category: 'Automotive',
    deadline: 'June 20, 2026',
    logo: '⚡',
    color: '#1DB954',
  },
  {
    id: 5,
    brand: 'Nykaa',
    title: 'South Beauty Edit',
    budget: '₹75,000',
    budgetNum: 75000,
    languages: ['Tamil', 'Telugu', 'Kannada', 'Malayalam'],
    category: 'Beauty',
    deadline: 'July 5, 2026',
    logo: '💄',
    color: '#FC2779',
  },
  {
    id: 6,
    brand: 'Flipkart',
    title: 'Regional Creator Drive',
    budget: '₹1,10,000',
    budgetNum: 110000,
    languages: ['Tamil', 'Telugu', 'Kannada', 'Malayalam'],
    category: 'E-commerce',
    deadline: 'July 15, 2026',
    logo: '🛒',
    color: '#2874F0',
  },
];

const ALL_LANGUAGES = ['All', 'Malayalam', 'Tamil', 'Telugu', 'Kannada'];
const ALL_CATEGORIES = ['All', 'Jewellery', 'Food & Beverage', 'EdTech', 'Automotive', 'Beauty', 'E-commerce'];
const BUDGET_RANGES = ['All', 'Under ₹75K', '₹75K–₹1L', 'Over ₹1L'];

/* ------------------------------------------------------------------ */
/* Page                                                                  */
/* ------------------------------------------------------------------ */

export default function MarketplacePage() {
  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState('All');
  const [category, setCategory] = useState('All');
  const [budget, setBudget] = useState('All');
  const [applyTarget, setApplyTarget] = useState<(typeof CAMPAIGNS)[0] | null>(null);

  const filtered = CAMPAIGNS.filter((c) => {
    const matchSearch =
      search === '' ||
      c.brand.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase());
    const matchLang =
      language === 'All' || c.languages.includes(language);
    const matchCat = category === 'All' || c.category === category;
    const matchBudget =
      budget === 'All' ||
      (budget === 'Under ₹75K' && c.budgetNum < 75000) ||
      (budget === '₹75K–₹1L' && c.budgetNum >= 75000 && c.budgetNum <= 100000) ||
      (budget === 'Over ₹1L' && c.budgetNum > 100000);
    return matchSearch && matchLang && matchCat && matchBudget;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-bold tracking-tight text-white font-bricolage"
        >
          Brand Marketplace
        </h1>
        <p className="text-sm mt-1 text-gray-400">
          Discover and apply for campaigns that match your audience.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search brand or campaign…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 text-sm bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-[#C9A84C]"
            style={{ borderRadius: '10px', height: '38px' }}
          />
        </div>

        {/* Language filter */}
        <FilterPills label="Language" options={ALL_LANGUAGES} value={language} onChange={setLanguage} />

        {/* Category filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-gray-400 flex items-center gap-1"><Tag size={12} />Category:</span>
          {ALL_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className="text-xs px-2.5 py-1 rounded-full transition-all border border-white/5"
              style={
                category === c
                  ? { background: 'rgba(201, 168, 76, 0.25)', color: GOLD, borderColor: 'rgba(201, 168, 76, 0.35)' }
                  : { background: 'rgba(255, 255, 255, 0.02)', color: '#9ca3af' }
              }
            >
              {c}
            </button>
          ))}
        </div>

        {/* Budget filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-gray-400 flex items-center gap-1"><IndianRupee size={12} />Budget:</span>
          {BUDGET_RANGES.map((b) => (
            <button
              key={b}
              onClick={() => setBudget(b)}
              className="text-xs px-2.5 py-1 rounded-full transition-all border border-white/5"
              style={
                budget === b
                  ? { background: GOLD, color: '#0f172a', border: 'none', fontWeight: 'bold' }
                  : { background: 'rgba(255, 255, 255, 0.02)', color: '#9ca3af' }
              }
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-400">
        Showing <span className="font-semibold text-white">{filtered.length}</span> campaigns
      </p>

      {/* Campaign grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <Card
            key={c.id}
            className="border-0 shadow-sm flex flex-col"
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(240, 235, 224, 0.08)',
              borderRadius: '16px',
              overflow: 'hidden',
            }}
          >
            <div style={{ height: '4px', background: c.color }} />
            <CardHeader className="pb-0 pt-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-xl text-xl border border-white/5"
                  style={{ background: 'rgba(255, 255, 255, 0.02)' }}
                >
                  {c.logo}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-gray-400">
                    {c.brand}
                  </div>
                  <CardTitle className="text-sm font-semibold mt-0.5 leading-snug text-white font-bricolage">
                    {c.title}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-3 pb-4 flex-1 flex flex-col gap-3">
              {/* Budget */}
              <div
                className="flex items-center justify-between rounded-xl px-3 py-2.5 border border-[#C9A84C]/25"
                style={{ background: 'rgba(201,168,76,0.1)' }}
              >
                <span className="text-xs text-[#C9A84C]">Campaign Budget</span>
                <span className="text-base font-bold text-[#C9A84C] font-bricolage">
                  {c.budget}
                </span>
              </div>

              {/* Languages */}
              <div className="flex flex-wrap gap-1.5">
                {c.languages.map((l) => (
                  <Badge
                    key={l}
                    className="text-xs bg-white/5 text-gray-300 border border-white/5"
                  >
                    {l}
                  </Badge>
                ))}
              </div>

              {/* Deadline */}
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Calendar size={12} />
                <span>Deadline: {c.deadline}</span>
              </div>

              {/* Apply button */}
              <Button
                className="w-full mt-auto font-bold bg-[#C9A84C] hover:bg-[#b0913b] text-slate-950"
                style={{
                  border: 'none',
                  borderRadius: '10px',
                }}
                onClick={() => setApplyTarget(c)}
              >
                Apply Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Apply Dialog */}
      <Dialog open={!!applyTarget} onOpenChange={(open) => { if (!open) setApplyTarget(null); }}>
        <DialogContent className="sm:max-w-sm bg-slate-950 border border-white/10 text-white" style={{ borderRadius: '16px' }}>
          <DialogHeader>
            <DialogTitle className="text-white font-bricolage text-lg">Apply for Campaign</DialogTitle>
            <DialogDescription className="text-gray-400 text-xs">
              You&apos;re applying for{' '}
              <span className="font-semibold text-white">
                {applyTarget?.title}
              </span>{' '}
              by{' '}
              <span className="font-semibold text-white">
                {applyTarget?.brand}
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          <div
            className="rounded-xl px-4 py-3 text-sm border border-[#C9A84C]/30 bg-[#C9A84C]/10"
          >
            <p className="font-semibold text-[#C9A84C] font-bricolage">
              Your media kit will be attached automatically.
            </p>
            <p className="text-xs mt-1 text-[#C9A84C]/80">
              SICE will share your verified follower stats, engagement rate, and platform data with the brand.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose render={<Button variant="outline" className="border-white/10 text-gray-300 hover:bg-white/5 hover:text-white bg-transparent" />}>
              Cancel
            </DialogClose>
            <Button
              className="bg-[#C9A84C] hover:bg-[#b0913b] text-slate-950 font-bold"
              style={{ border: 'none' }}
              onClick={() => {
                alert(`Application submitted for "${applyTarget?.title}"! Your media kit has been attached.`);
                setApplyTarget(null);
              }}
            >
              Confirm Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FilterPills helper                                                    */
/* ------------------------------------------------------------------ */

function FilterPills({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="text-xs text-gray-400">{label}:</span>
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className="text-xs px-2.5 py-1 rounded-full transition-all border border-white/5"
          style={
            value === o
              ? { background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', borderColor: 'rgba(59, 130, 246, 0.3)' }
              : { background: 'rgba(255, 255, 255, 0.02)', color: '#9ca3af' }
          }
        >
          {o}
        </button>
      ))}
    </div>
  );
}
