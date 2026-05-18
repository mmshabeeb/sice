export type UserRole = 'creator' | 'merchant' | 'admin';
export type EscrowStatus = 'pending' | 'deposited' | 'in_escrow' | 'content_approved' | 'released' | 'refunded' | 'disputed';
export type CampaignStatus = 'draft' | 'active' | 'in_progress' | 'completed' | 'cancelled' | 'paused';
export type Platform = 'instagram' | 'youtube' | 'facebook' | 'x' | 'linkedin' | 'tiktok';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string | null;
  avatar_url: string | null;
  chapter_id: string | null;
  created_at: string;
}

export interface Chapter {
  id: string;
  name: string;
  city: string;
  language: string;
  state: string;
  status: string;
}

export interface CreatorProfile {
  id: string;
  bio: string | null;
  languages: string[];
  niche: string | null;
  trust_index_score: number;
  engagement_rate: number;
  total_followers: number;
  media_kit_url: string | null;
}

export interface SocialAccount {
  id: string;
  creator_id: string;
  platform: Platform;
  username: string | null;
  profile_url: string | null;
  follower_count: number;
  subscriber_count: number;
  engagement_rate: number;
  is_verified: boolean;
  last_synced_at: string | null;
}

export interface Campaign {
  id: string;
  merchant_id: string;
  title: string;
  description: string | null;
  language_targets: string[];
  chapter_targets: string[];
  budget: number;
  escrow_amount: number;
  min_followers: number;
  deadline: string | null;
  status: CampaignStatus;
  applications_count: number;
  created_at: string;
  deliverables: Deliverable[];
}

export interface Contract {
  id: string;
  campaign_id: string;
  creator_id: string;
  merchant_id: string;
  amount: number;
  escrow_status: EscrowStatus;
  milestones: Milestone[];
  created_at: string;
}

export interface Milestone {
  label: string;
  status: 'pending' | 'active' | 'done';
  date?: string;
}

export interface Deliverable {
  id: string;
  title: string;
  status: 'pending' | 'submitted' | 'revision_requested' | 'approved' | 'rejected';
  due_date: string | null;
  submitted_url: string | null;
  feedback_logs: FeedbackLog[];
}

export interface FeedbackLog {
  author: string;
  message: string;
  timestamp: string;
}

export interface Event {
  id: string;
  chapter_id: string;
  title: string;
  description: string | null;
  venue: string | null;
  scheduled_at: string;
  max_attendees: number | null;
  status: string;
  attendee_ids: string[];
}

export interface OnboardingApplication {
  id: string;
  full_name: string;
  email: string;
  contact_number: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  status: 'pending' | 'reviewing' | 'identity_check' | 'approved' | 'rejected';
  created_at: string;
}

// Supabase Database generic type (simplified)
export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> };
      chapters: { Row: Chapter; Insert: Partial<Chapter>; Update: Partial<Chapter> };
      creator_profiles: { Row: CreatorProfile; Insert: Partial<CreatorProfile>; Update: Partial<CreatorProfile> };
      social_accounts: { Row: SocialAccount; Insert: Partial<SocialAccount>; Update: Partial<SocialAccount> };
      campaigns: { Row: Campaign; Insert: Partial<Campaign>; Update: Partial<Campaign> };
      contracts: { Row: Contract; Insert: Partial<Contract>; Update: Partial<Contract> };
      deliverables: { Row: Deliverable; Insert: Partial<Deliverable>; Update: Partial<Deliverable> };
      events: { Row: Event; Insert: Partial<Event>; Update: Partial<Event> };
      onboarding_applications: { Row: OnboardingApplication; Insert: Partial<OnboardingApplication>; Update: Partial<OnboardingApplication> };
    };
  };
};
