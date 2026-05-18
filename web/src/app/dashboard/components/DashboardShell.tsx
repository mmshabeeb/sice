'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart2,
  Users,
  ShoppingBag,
  Briefcase,
  BookOpen,
  Zap,
  FileText,
  Search,
  Kanban,
  Wallet,
  Globe,
  Map,
  ClipboardList,
  Calendar,
  AlertTriangle,
  LogOut,
  Menu,
  ChevronLeft,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { createClient } from '@/lib/supabase/client';

/* ------------------------------------------------------------------ */
/* Nav config                                                            */
/* ------------------------------------------------------------------ */

type NavItem = { label: string; href: string; icon: React.ElementType };

const NAV: Record<string, NavItem[]> = {
  creator: [
    { label: 'Overview', href: '/dashboard/creator', icon: BarChart2 },
    { label: 'Social Accounts', href: '/dashboard/creator/accounts', icon: Globe },
    { label: 'Follower Metrics', href: '/dashboard/creator/metrics', icon: BarChart2 },
    { label: 'Brand Marketplace', href: '/dashboard/creator/marketplace', icon: ShoppingBag },
    { label: 'My Deals', href: '/dashboard/creator/deals', icon: Briefcase },
    { label: 'Studio & Learning', href: '/dashboard/creator/studio', icon: BookOpen },
    { label: 'Automations', href: '/dashboard/creator/automation', icon: Zap },
    { label: 'Legal & Invoicing', href: '/dashboard/creator/legal', icon: FileText },
  ],
  merchant: [
    { label: 'Overview', href: '/dashboard/merchant', icon: BarChart2 },
    { label: 'Talent Discovery', href: '/dashboard/merchant/discover', icon: Search },
    { label: 'Campaigns', href: '/dashboard/merchant/campaigns', icon: Kanban },
    { label: 'Projects', href: '/dashboard/merchant/projects', icon: Briefcase },
    { label: 'Wallet & Escrow', href: '/dashboard/merchant/wallet', icon: Wallet },
  ],
  admin: [
    { label: 'Command Center', href: '/dashboard/admin', icon: BarChart2 },
    { label: 'Chapter Performance', href: '/dashboard/admin/chapters', icon: Map },
    { label: 'My Chapter', href: '/dashboard/admin/roster', icon: Users },
    { label: 'Application Queue', href: '/dashboard/admin/applications', icon: ClipboardList },
    { label: 'Events', href: '/dashboard/admin/events', icon: Calendar },
    { label: 'Arbitration', href: '/dashboard/admin/arbitration', icon: AlertTriangle },
  ],
};

const ROLE_LABELS: Record<string, string> = {
  creator: 'Creator',
  merchant: 'Merchant',
  admin: 'Chapter Admin',
};

/* ------------------------------------------------------------------ */
/* Sub-components                                                         */
/* ------------------------------------------------------------------ */

interface SidebarContentProps {
  role: string;
  fullName: string | null;
  avatarUrl: string | null;
  pathname: string;
  onNavigate?: () => void;
}

function SidebarContent({
  role,
  fullName,
  avatarUrl,
  pathname,
  onNavigate,
}: SidebarContentProps) {
  const router = useRouter();
  const navItems = NAV[role] ?? NAV.creator;

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  }

  const initials = fullName
    ? fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '??';

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: '#080D26', borderRight: '1px solid rgba(240,235,224,0.08)' }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-5 py-5"
        style={{ borderBottom: '1px solid rgba(240,235,224,0.08)' }}
      >
        <div
          className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
          style={{ background: 'rgba(201,168,76,0.18)', border: '1px solid rgba(201,168,76,0.35)' }}
        >
          <span
            className="text-sm font-bold"
            style={{ color: '#C9A84C', fontFamily: 'var(--font-bricolage, sans-serif)' }}
          >
            S
          </span>
        </div>
        <span
          className="text-base font-bold tracking-tight"
          style={{ color: '#F0EBE0', fontFamily: 'var(--font-bricolage, sans-serif)' }}
        >
          SICE
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-0.5">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || (href !== `/dashboard/${role}` && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative"
              style={{
                color: isActive ? '#C9A84C' : 'rgba(240,235,224,0.60)',
                background: isActive ? 'rgba(201,168,76,0.10)' : 'transparent',
                borderLeft: isActive ? '2px solid #C9A84C' : '2px solid transparent',
              }}
            >
              <Icon size={16} strokeWidth={1.8} style={{ color: isActive ? '#C9A84C' : 'rgba(240,235,224,0.45)' }} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div
        className="px-4 py-4"
        style={{ borderTop: '1px solid rgba(240,235,224,0.08)' }}
      >
        {/* Avatar + name */}
        <div className="flex items-center gap-3 mb-3">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={fullName ?? 'User'}
              className="w-8 h-8 rounded-full object-cover shrink-0"
              style={{ border: '1px solid rgba(201,168,76,0.40)' }}
            />
          ) : (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
              style={{
                background: 'rgba(201,168,76,0.15)',
                border: '1px solid rgba(201,168,76,0.35)',
                color: '#C9A84C',
              }}
            >
              {initials}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span
              className="text-sm font-medium truncate"
              style={{ color: '#F0EBE0' }}
            >
              {fullName ?? 'User'}
            </span>
            <span
              className="text-xs px-1.5 py-0.5 rounded font-medium w-fit mt-0.5"
              style={{
                background: 'rgba(201,168,76,0.15)',
                color: '#C9A84C',
                fontSize: '10px',
                letterSpacing: '0.04em',
              }}
            >
              {ROLE_LABELS[role] ?? role}
            </span>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors"
          style={{ color: 'rgba(240,235,224,0.45)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#fca5a5';
            e.currentTarget.style.background = 'rgba(220,38,38,0.10)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(240,235,224,0.45)';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <LogOut size={15} strokeWidth={1.8} />
          Sign out
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main shell                                                             */
/* ------------------------------------------------------------------ */

interface DashboardShellProps {
  children: React.ReactNode;
  role: string;
  fullName: string | null;
  avatarUrl: string | null;
}

export default function DashboardShell({
  children,
  role,
  fullName,
  avatarUrl,
}: DashboardShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarProps: SidebarContentProps = {
    role,
    fullName,
    avatarUrl,
    pathname,
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0c1230' }}>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 h-full">
        <SidebarContent {...sidebarProps} />
      </aside>

      {/* Mobile sidebar via Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <button
            className="lg:hidden fixed top-4 left-4 z-30 flex items-center justify-center w-9 h-9 rounded-lg"
            style={{
              background: 'rgba(240,235,224,0.08)',
              border: '1px solid rgba(240,235,224,0.12)',
              color: '#F0EBE0',
            }}
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="p-0 w-60 border-0"
          style={{ background: '#080D26' }}
        >
          <SidebarContent
            {...sidebarProps}
            onNavigate={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <main
        className="flex-1 overflow-y-auto"
        style={{ background: '#0c1230' }}
      >
        {/* Mobile top bar spacer so content isn't hidden behind the menu button */}
        <div className="lg:hidden h-14" aria-hidden />
        <div className="px-4 sm:px-6 lg:px-8 py-6">{children}</div>
      </main>
    </div>
  );
}
