import { describe, it, expect } from 'vitest';

// --- parseFollowers (copied from api/applications/route.ts) ---
function parseFollowers(value: unknown): number {
  const text = String(value ?? '').trim().toLowerCase();
  if (!text) return 0;
  const match = text.replace(/,/g, '').match(/([\d.]+)\s*([kmb])?/);
  if (!match) return 0;
  const amount = Number(match[1]);
  if (!Number.isFinite(amount)) return 0;
  const multiplier =
    match[2] === 'b' ? 1_000_000_000 :
    match[2] === 'm' ? 1_000_000 :
    match[2] === 'k' ? 1_000 : 1;
  return Math.round(amount * multiplier);
}

describe('parseFollowers', () => {
  it('returns 0 for empty string', () => expect(parseFollowers('')).toBe(0));
  it('returns 0 for null', () => expect(parseFollowers(null)).toBe(0));
  it('parses plain number', () => expect(parseFollowers('5000')).toBe(5000));
  it('parses K suffix', () => expect(parseFollowers('12K')).toBe(12_000));
  it('parses M suffix', () => expect(parseFollowers('2.5M')).toBe(2_500_000));
  it('parses B suffix', () => expect(parseFollowers('1B')).toBe(1_000_000_000));
  it('parses lowercase k', () => expect(parseFollowers('500k')).toBe(500_000));
  it('parses number with commas', () => expect(parseFollowers('1,200')).toBe(1200));
  it('parses decimal M', () => expect(parseFollowers('1.1M')).toBe(1_100_000));
  it('returns 0 for non-numeric', () => expect(parseFollowers('N/A')).toBe(0));
});

// --- cn (from lib/utils.ts) ---
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(inputs));
}

describe('cn (class merger)', () => {
  it('merges simple classes', () => expect(cn('a', 'b')).toBe('a b'));
  it('handles conditional classes', () => expect(cn('a', false && 'b', 'c')).toBe('a c'));
  it('deduplicates tailwind conflicts', () => expect(cn('p-2', 'p-4')).toBe('p-4'));
  it('handles undefined', () => expect(cn(undefined, 'a')).toBe('a'));
  it('handles empty input', () => expect(cn()).toBe(''));
});

// --- formatFollowers (dashboard display helper) ---
function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

describe('formatFollowers', () => {
  it('displays raw number under 1K', () => expect(formatFollowers(500)).toBe('500'));
  it('formats thousands as K', () => expect(formatFollowers(12_000)).toBe('12.0K'));
  it('formats millions as M', () => expect(formatFollowers(2_500_000)).toBe('2.5M'));
  it('handles zero', () => expect(formatFollowers(0)).toBe('0'));
  it('rounds to 1 decimal', () => expect(formatFollowers(1_234_567)).toBe('1.2M'));
});

// --- formatCurrency ---
function formatCurrency(n: number): string {
  return `₹${new Intl.NumberFormat('en-IN').format(n)}`;
}

describe('formatCurrency', () => {
  it('formats zero', () => expect(formatCurrency(0)).toBe('₹0'));
  it('formats thousands', () => expect(formatCurrency(50_000)).toBe('₹50,000'));
  it('formats lakhs', () => expect(formatCurrency(100_000)).toBe('₹1,00,000'));
});

// --- getLocation helper (from api/applications/route.ts) ---
function getLocation(data: Record<string, unknown>): string {
  const parts = [data.city, data.state, data.country]
    .map((v) => String(v ?? '').trim())
    .filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : 'Kerala, India';
}

describe('getLocation', () => {
  it('joins city, state, country', () => expect(getLocation({ city: 'Kochi', state: 'Kerala', country: 'India' })).toBe('Kochi, Kerala, India'));
  it('skips empty fields', () => expect(getLocation({ city: 'Kochi', state: '', country: 'India' })).toBe('Kochi, India'));
  it('returns default when all empty', () => expect(getLocation({})).toBe('Kerala, India'));
  it('handles null values', () => expect(getLocation({ city: null, state: null })).toBe('Kerala, India'));
});
