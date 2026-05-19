'use client';

import { CheckCircle2, Circle, Clock, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const GOLD = '#C9A84C';
const INDIGO = '#080D26';
const BG = '#F8F7F4';
const GREEN = '#34d399';
const GRAY = 'rgba(255, 255, 255, 0.15)';

/* ------------------------------------------------------------------ */
/* Types & data                                                          */
/* ------------------------------------------------------------------ */

type MilestoneKey = 'Deposited' | 'In Secure Deposit' | 'Content Approved' | 'Released';

const MILESTONES: MilestoneKey[] = ['Deposited', 'In Secure Deposit', 'Content Approved', 'Released'];

interface Deal {
  id: number;
  brand: string;
  campaign: string;
  amount: string;
  currentStep: MilestoneKey;
  deadline: string;
  deliverables: number;
  logo: string;
  color: string;
}

const DEALS: Deal[] = [
  {
    id: 1,
    brand: 'Malabar Gold',
    campaign: 'Kerala Onam Campaign',
    amount: '₹85,000',
    currentStep: 'Content Approved',
    deadline: 'June 15, 2026',
    deliverables: 3,
    logo: '🪙',
    color: '#C9A84C',
  },
  {
    id: 2,
    brand: 'KFC India',
    campaign: 'South India Launch',
    amount: '₹1,20,000',
    currentStep: 'In Secure Deposit',
    deadline: 'June 30, 2026',
    deliverables: 5,
    logo: '🍗',
    color: '#E4002B',
  },
  {
    id: 3,
    brand: "Byju's",
    campaign: 'Education Creator Program',
    amount: '₹60,000',
    currentStep: 'Deposited',
    deadline: 'July 10, 2026',
    deliverables: 2,
    logo: '📚',
    color: '#7B2FF7',
  },
];

/* ------------------------------------------------------------------ */
/* Milestone stepper                                                     */
/* ------------------------------------------------------------------ */

function MilestoneStepper({ currentStep }: { currentStep: MilestoneKey }) {
  const currentIdx = MILESTONES.indexOf(currentStep);

  return (
    <div className="flex items-center w-full mt-2">
      {MILESTONES.map((step, i) => {
        const isCompleted = i < currentIdx;
        const isCurrent = i === currentIdx;
        const isPending = i > currentIdx;

        const dotColor = isCompleted ? GREEN : isCurrent ? GOLD : 'rgba(255,255,255,0.2)';
        const lineColor = isCompleted ? GREEN : 'rgba(255,255,255,0.06)';

        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            {/* Node */}
            <div className="flex flex-col items-center">
              <div
                className="flex items-center justify-center w-7 h-7 rounded-full transition-all"
                style={{
                  background: isCompleted
                    ? 'rgba(52,211,153,0.12)'
                    : isCurrent
                    ? 'rgba(201,168,76,0.15)'
                    : 'rgba(255,255,255,0.03)',
                  border: `2px solid ${dotColor}`,
                }}
              >
                {isCompleted ? (
                  <CheckCircle2 size={13} style={{ color: GREEN }} />
                ) : isCurrent ? (
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: GOLD }} />
                ) : (
                  <Circle size={13} className="text-gray-600" />
                )}
              </div>
              <span
                className="text-xs mt-1 font-medium text-center leading-tight"
                style={{
                  color: isCompleted ? GREEN : isCurrent ? GOLD : '#6b7280',
                  fontSize: '10px',
                  maxWidth: '64px',
                  lineHeight: '1.2',
                }}
              >
                {step}
              </span>
            </div>

            {/* Connector line */}
            {i < MILESTONES.length - 1 && (
              <div
                className="flex-1 h-0.5 mx-1 -mt-4"
                style={{ background: lineColor, transition: 'background 0.3s' }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Status badge                                                          */
/* ------------------------------------------------------------------ */

function StepBadge({ step }: { step: MilestoneKey }) {
  const styles: Record<MilestoneKey, { bg: string; color: string }> = {
    Deposited: { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
    'In Secure Deposit': { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
    'Content Approved': { bg: 'rgba(201,168,76,0.15)', color: GOLD },
    Released: { bg: 'rgba(34,197,94,0.15)', color: '#34d399' },
  };
  const s = styles[step];
  return (
    <Badge
      className="text-xs font-semibold px-2 py-0.5 border-0"
      style={{ background: s.bg, color: s.color }}
    >
      {step}
    </Badge>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                  */
/* ------------------------------------------------------------------ */

export default function DealsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-bold tracking-tight text-white font-bricolage"
        >
          My Deals
        </h1>
        <p className="text-sm mt-1 text-gray-400">
          Track secure deposit milestones and deliverables for your active campaigns.
        </p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Active Deals', value: '3', color: 'white' },
          { label: 'Total Securely Deposited', value: '₹2,65,000', color: GOLD },
          { label: 'Deliverables Remaining', value: '8', color: '#9ca3af' },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="text-center rounded-xl py-3 border"
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              borderColor: 'rgba(240, 235, 224, 0.08)',
            }}
          >
            <div className="text-lg font-bold font-bricolage" style={{ color }}>
              {value}
            </div>
            <div className="text-xs mt-0.5 text-gray-400">
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Deal cards */}
      <div className="space-y-4">
        {DEALS.map((deal) => (
          <Card
            key={deal.id}
            className="border-0 shadow-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(240, 235, 224, 0.08)',
              borderRadius: '16px',
              overflow: 'hidden',
            }}
          >
            <div style={{ height: '4px', background: deal.color }} />
            <CardHeader className="pb-2 pt-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center w-11 h-11 rounded-xl text-xl border border-white/5"
                    style={{ background: 'rgba(255, 255, 255, 0.02)' }}
                  >
                    {deal.logo}
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-400">
                      {deal.brand}
                    </div>
                    <CardTitle className="text-base font-semibold text-white font-bricolage">
                      {deal.campaign}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg font-bold" style={{ color: GOLD }}>
                        {deal.amount}
                      </span>
                      <StepBadge step={deal.currentStep} />
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0 pb-4 space-y-4">
              {/* Milestone stepper */}
              <div className="px-2 pt-2">
                <MilestoneStepper currentStep={deal.currentStep} />
              </div>

              {/* Footer info */}
              <div
                className="flex items-center justify-between gap-4 pt-3 flex-wrap"
                style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} />
                    <span>Deadline: {deal.deadline}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileText size={12} />
                    <span>{deal.deliverables} deliverables</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="text-xs font-semibold h-7 px-3 bg-transparent hover:text-white"
                  style={{
                    borderColor: deal.color,
                    color: deal.color,
                    borderRadius: '8px',
                  }}
                  onClick={() => alert(`Opening deal details for "${deal.campaign}"`)}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
