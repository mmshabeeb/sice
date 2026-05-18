-- SICE Platform Database Schema
-- Run this in Supabase SQL Editor: https://app.supabase.com/project/_/sql

-- Enable extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- CHAPTERS
-- ============================================================
create table public.chapters (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  city text not null,
  language text not null check (language in ('Malayalam', 'Tamil', 'Telugu', 'Kannada', 'Multi')),
  state text not null,
  status text not null default 'active' check (status in ('active', 'opening_soon', 'planning', 'exploring')),
  lead_id uuid references auth.users(id),
  created_at timestamptz default now()
);

insert into public.chapters (name, city, language, state, status) values
  ('Kozhikode Chapter', 'Kozhikode', 'Malayalam', 'Kerala', 'active'),
  ('Kochi Chapter', 'Kochi', 'Malayalam', 'Kerala', 'opening_soon'),
  ('Bangalore Chapter', 'Bangalore', 'Kannada', 'Karnataka', 'opening_soon'),
  ('Chennai Chapter', 'Chennai', 'Tamil', 'Tamil Nadu', 'planning'),
  ('Hyderabad Chapter', 'Hyderabad', 'Telugu', 'Telangana', 'planning'),
  ('GCC Digital Chapter', 'GCC', 'Multi', 'International', 'exploring');

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('creator', 'merchant', 'admin')),
  full_name text,
  avatar_url text,
  chapter_id uuid references public.chapters(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- CREATOR PROFILES
-- ============================================================
create table public.creator_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  bio text,
  languages text[] default '{}',
  niche text,
  trust_index_score numeric(5,2) default 0,
  engagement_rate numeric(5,2) default 0,
  total_followers integer default 0,
  media_kit_url text,
  gst_number text,
  pan_number text,
  bank_account_name text,
  bank_account_number text,
  bank_ifsc text,
  razorpay_contact_id text,
  razorpay_fund_account_id text,
  updated_at timestamptz default now()
);

-- ============================================================
-- SOCIAL ACCOUNTS
-- ============================================================
create table public.social_accounts (
  id uuid primary key default uuid_generate_v4(),
  creator_id uuid not null references public.creator_profiles(id) on delete cascade,
  platform text not null check (platform in ('instagram', 'youtube', 'facebook', 'x', 'linkedin', 'tiktok')),
  platform_user_id text,
  username text,
  profile_url text,
  follower_count integer default 0,
  subscriber_count integer default 0,
  post_count integer default 0,
  avg_views integer default 0,
  engagement_rate numeric(5,2) default 0,
  access_token text,
  refresh_token text,
  token_expires_at timestamptz,
  is_verified boolean default false,
  last_synced_at timestamptz,
  created_at timestamptz default now(),
  unique(creator_id, platform)
);

-- ============================================================
-- MERCHANT PROFILES
-- ============================================================
create table public.merchant_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  company_name text,
  industry text,
  website_url text,
  gst_number text,
  pan_number text,
  wallet_balance numeric(12,2) default 0,
  total_spent numeric(12,2) default 0,
  razorpay_customer_id text,
  updated_at timestamptz default now()
);

-- ============================================================
-- CAMPAIGNS
-- ============================================================
create table public.campaigns (
  id uuid primary key default uuid_generate_v4(),
  merchant_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  language_targets text[] default '{}',
  chapter_targets text[] default '{}',
  niche_targets text[] default '{}',
  budget numeric(12,2) not null default 0,
  escrow_amount numeric(12,2) default 0,
  min_followers integer default 0,
  min_engagement_rate numeric(5,2) default 0,
  deliverables jsonb default '[]',
  deadline date,
  status text not null default 'draft' check (status in ('draft', 'active', 'in_progress', 'completed', 'cancelled', 'paused')),
  applications_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- CAMPAIGN APPLICATIONS
-- ============================================================
create table public.campaign_applications (
  id uuid primary key default uuid_generate_v4(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  creator_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'shortlisted', 'accepted', 'rejected', 'withdrawn')),
  proposal_note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(campaign_id, creator_id)
);

-- ============================================================
-- CONTRACTS
-- ============================================================
create table public.contracts (
  id uuid primary key default uuid_generate_v4(),
  campaign_id uuid not null references public.campaigns(id),
  creator_id uuid not null references public.profiles(id),
  merchant_id uuid not null references public.profiles(id),
  amount numeric(12,2) not null,
  platform_fee numeric(12,2) default 0,
  gst_amount numeric(12,2) default 0,
  escrow_status text not null default 'pending' check (escrow_status in ('pending', 'deposited', 'in_escrow', 'content_approved', 'released', 'refunded', 'disputed')),
  razorpay_payment_id text,
  razorpay_payout_id text,
  milestones jsonb default '[]',
  signed_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz default now()
);

-- ============================================================
-- DELIVERABLES
-- ============================================================
create table public.deliverables (
  id uuid primary key default uuid_generate_v4(),
  contract_id uuid not null references public.contracts(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'pending' check (status in ('pending', 'submitted', 'revision_requested', 'approved', 'rejected')),
  submitted_url text,
  feedback_logs jsonb default '[]',
  due_date date,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  created_at timestamptz default now()
);

-- ============================================================
-- EVENTS
-- ============================================================
create table public.events (
  id uuid primary key default uuid_generate_v4(),
  chapter_id uuid not null references public.chapters(id),
  created_by uuid references public.profiles(id),
  title text not null,
  description text,
  venue text,
  address text,
  scheduled_at timestamptz not null,
  max_attendees integer,
  status text default 'upcoming' check (status in ('upcoming', 'ongoing', 'completed', 'cancelled')),
  attendee_ids uuid[] default '{}',
  created_at timestamptz default now()
);

-- ============================================================
-- ONBOARDING APPLICATIONS (from /apply page)
-- ============================================================
create table public.onboarding_applications (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  email text not null,
  contact_number text,
  whatsapp_number text,
  facebook_url text,
  instagram_url text,
  youtube_url text,
  x_url text,
  linkedin_url text,
  chapter_preference text,
  status text not null default 'pending' check (status in ('pending', 'reviewing', 'identity_check', 'approved', 'rejected')),
  reviewed_by uuid references public.profiles(id),
  review_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- ROW-LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.creator_profiles enable row level security;
alter table public.social_accounts enable row level security;
alter table public.merchant_profiles enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_applications enable row level security;
alter table public.contracts enable row level security;
alter table public.deliverables enable row level security;
alter table public.events enable row level security;
alter table public.onboarding_applications enable row level security;
alter table public.chapters enable row level security;

-- Helper function: get current user role
create or replace function public.get_user_role()
returns text language sql security definer stable as $$
  select role from public.profiles where id = auth.uid();
$$;

-- Helper function: get current user chapter
create or replace function public.get_user_chapter()
returns uuid language sql security definer stable as $$
  select chapter_id from public.profiles where id = auth.uid();
$$;

-- CHAPTERS: public read
create policy "Chapters are publicly readable" on public.chapters for select using (true);

-- PROFILES: own profile + admins see all
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Admins can view all profiles" on public.profiles for select using (get_user_role() = 'admin');
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Profiles created on signup" on public.profiles for insert with check (auth.uid() = id);

-- CREATOR PROFILES
create policy "Creators manage own profile" on public.creator_profiles for all using (auth.uid() = id);
create policy "Merchants can view creator profiles" on public.creator_profiles for select using (get_user_role() in ('merchant', 'admin'));

-- SOCIAL ACCOUNTS
create policy "Creators manage own social accounts" on public.social_accounts for all using (auth.uid() = creator_id);
create policy "Merchants can view social accounts" on public.social_accounts for select using (get_user_role() in ('merchant', 'admin'));

-- MERCHANT PROFILES
create policy "Merchants manage own profile" on public.merchant_profiles for all using (auth.uid() = id);
create policy "Admins can view merchant profiles" on public.merchant_profiles for select using (get_user_role() = 'admin');

-- CAMPAIGNS: merchants own, creators browse active
create policy "Merchants manage own campaigns" on public.campaigns for all using (auth.uid() = merchant_id);
create policy "Creators view active campaigns" on public.campaigns for select using (status = 'active' and get_user_role() = 'creator');
create policy "Admins view all campaigns" on public.campaigns for select using (get_user_role() = 'admin');

-- APPLICATIONS
create policy "Creators manage own applications" on public.campaign_applications for all using (auth.uid() = creator_id);
create policy "Merchants view applications to their campaigns" on public.campaign_applications for select
  using (exists (select 1 from public.campaigns where id = campaign_id and merchant_id = auth.uid()));
create policy "Merchants update application status" on public.campaign_applications for update
  using (exists (select 1 from public.campaigns where id = campaign_id and merchant_id = auth.uid()));

-- CONTRACTS
create policy "Parties view own contracts" on public.contracts for select using (auth.uid() in (creator_id, merchant_id));
create policy "Admins view all contracts" on public.contracts for select using (get_user_role() = 'admin');
create policy "System can insert contracts" on public.contracts for insert with check (auth.uid() in (creator_id, merchant_id));

-- DELIVERABLES
create policy "Contract parties view deliverables" on public.deliverables for select
  using (exists (select 1 from public.contracts where id = contract_id and auth.uid() in (creator_id, merchant_id)));
create policy "Creators submit deliverables" on public.deliverables for update
  using (exists (select 1 from public.contracts where id = contract_id and creator_id = auth.uid()));

-- EVENTS: chapter leads manage their chapter events
create policy "Anyone can view events" on public.events for select using (true);
create policy "Chapter leads manage their events" on public.events for all
  using (auth.uid() = created_by or get_user_role() = 'admin');

-- ONBOARDING APPLICATIONS
create policy "Public can insert applications" on public.onboarding_applications for insert with check (true);
create policy "Admins manage all applications" on public.onboarding_applications for all using (get_user_role() = 'admin');
create policy "Chapter leads view their chapter applications" on public.onboarding_applications for select
  using (get_user_role() = 'admin');

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, role, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'creator'),
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
