import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { UserRole } from '@/types/database';
import DashboardShell from './components/DashboardShell';

interface ProfileRow {
  role: UserRole;
  full_name: string | null;
  avatar_url: string | null;
  chapter_id: string | null;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, avatar_url, chapter_id')
    .eq('id', user.id)
    .single() as { data: ProfileRow | null; error: unknown };

  if (!profile) {
    redirect('/login');
  }

  return (
    <DashboardShell
      role={profile.role}
      fullName={profile.full_name}
      avatarUrl={profile.avatar_url}
    >
      {children}
    </DashboardShell>
  );
}
