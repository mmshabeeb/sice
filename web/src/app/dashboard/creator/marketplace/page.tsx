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
    <div style={{ background: BG, minHeight: '100%' }} className="p-6 rounded-xl space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: INDIGO, fontFamily: 'var(--font-bricolage, sans-serif)' }}
        >
          Brand Marketplace
        </h1>
        <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
          Discover and apply for campaigns that match your audience.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: '#9ca3af' }} />
          <Input
            placeholder="Search brand or campaign…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 text-sm"
            style={{ background: '#fff', borderRadius: '10px', height: '38px' }}
          />
        </div>

        {/* Language filter */}
        <FilterPills label="Language" options={ALL_LANGUAGES} value={language} onChange={setLanguage} />

        {/* Category filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-gray-500 flex items-center gap-1"><Tag size={12} />Category:</span>
          {ALL_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className="text-xs px-2.5 py-1 rounded-full transition-all"
              style={
                category === c
                  ? { background: INDIGO, color: '#fff' }
                  : { background: '#fff', color: '#6b7280', border: '1px solid #e5e7eb' }
              }
            >
              {c}
            </button>
          ))}
        </div>

        {/* Budget filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-gray-500 flex items-center gap-1"><IndianRupee size={12} />Budget:</span>
          {BUDGET_RANGES.map((b) => (
            <button
              key={b}
              onClick={() => setBudget(b)}
              className="text-xs px-2.5 py-1 rounded-full transition-all"
              style={
                budget === b
                  ? { background: GOLD, color: '#fff' }
                  : { background: '#fff', color: '#6b7280', border: '1px solid #e5e7eb' }
              }
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm" style={{ color: '#6b7280' }}>
        Showing <span className="font-semibold" style={{ color: INDIGO }}>{filtered.length}</span> campaigns
      </p>

      {/* Campaign grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <Card
            key={c.id}
            className="border-0 shadow-sm flex flex-col"
            style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden' }}
          >
            <div style={{ height: '4px', background: c.color }} />
            <CardHeader className="pb-0 pt-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-xl text-xl"
                  style={{ background: `${c.color}15` }}
                >
                  {c.logo}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold" style={{ color: '#9ca3af' }}>
                    {c.brand}
                  </div>
                  <CardTitle className="text-sm font-semibold mt-0.5 leading-snug" style={{ color: INDIGO }}>
                    {c.title}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-3 pb-4 flex-1 flex flex-col gap-3">
              {/* Budget */}
              <div
                className="flex items-center justify-between rounded-xl px-3 py-2.5"
                style={{ background: 'rgba(201,168,76,0.08)' }}
              >
                <span className="text-xs" style={{ color: '#92400e' }}>Campaign Budget</span>
                <span className="text-base font-bold" style={{ color: GOLD }}>
                  {c.budget}
                </span>
              </div>

              {/* Languages */}
              <div className="flex flex-wrap gap-1.5">
                {c.languages.map((l) => (
                  <Badge
                    key={l}
                    className="text-xs"
                    style={{
                      background: 'rgba(8,13,38,0.07)',
                      color: INDIGO,
                      border: 'none',
                    }}
                  >
                    {l}
                  </Badge>
                ))}
              </div>

              {/* Deadline */}
              <div className="flex items-center gap-1.5 text-xs" style={{ color: '#6b7280' }}>
                <Calendar size={12} />
                <span>Deadline: {c.deadline}</span>
              </div>

              {/* Apply button */}
              <Button
                className="w-full mt-auto font-semibold"
                style={{
                  background: GOLD,
                  color: '#fff',
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
        <DialogContent className="sm:max-w-sm" style={{ borderRadius: '16px' }}>
          <DialogHeader>
            <DialogTitle>Apply for Campaign</DialogTitle>
            <DialogDescription>
              You&apos;re applying for{' '}
              <span className="font-semibold" style={{ color: INDIGO }}>
                {applyTarget?.title}
              </span>{' '}
              by{' '}
              <span className="font-semibold" style={{ color: INDIGO }}>
                {applyTarget?.brand}
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          <div
            className="rounded-xl px-4 py-3 text-sm"
            style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.20)' }}
          >
            <p className="font-medium" style={{ color: GOLD }}>
              Your media kit will be attached automatically.
            </p>
            <p className="text-xs mt-1" style={{ color: '#92400e' }}>
              SICE will share your verified follower stats, engagement rate, and platform data with the brand.
            </p>
          </div>

          <DialogFooter>
            <DialogClose
              render={
                <Button variant="outline" />
              }
            >
              Cancel
            </DialogClose>
            <Button
              style={{ background: GOLD, color: '#fff', border: 'none' }}
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
      <span className="text-xs text-gray-500">{label}:</span>
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className="text-xs px-2.5 py-1 rounded-full transition-all"
          style={
            value === o
              ? { background: '#3b82f6', color: '#fff' }
              : { background: '#fff', color: '#6b7280', border: '1px solid #e5e7eb' }
          }
        >
          {o}
        </button>
      ))}
    </div>
  );
}
