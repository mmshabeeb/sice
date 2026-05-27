'use client';

import { useState, useEffect } from 'react';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  ShieldCheck,
  UserCheck,
  UserX,
  Info,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
/* Constants / Helpers                                                    */
/* ------------------------------------------------------------------ */

const GOLD = '#C9A84C';
const INDIGO = '#080D26';
const BG = '#F8F7F4';

type AppStatus = 'Pending' | 'Under Review' | 'Identity Check' | 'Approved' | 'Rejected';

interface Application {
  id: string;
  name: string;
  email: string;
  handles: string;
  followers: string;
  bio: string;
  appliedDate: string;
  status: AppStatus;
  location: string;
  languages: string[];
  niches: string[];
  
  // Raw values for editing
  raw_full_name?: string;
  raw_email?: string;
  raw_location?: string;
  raw_statement_of_purpose?: string;
  raw_instagram_url?: string;
  raw_instagram_followers?: string;
  raw_x_url?: string;
  raw_x_followers?: string;
  raw_youtube_url?: string;
  raw_youtube_followers?: string;
  raw_facebook_url?: string;
  raw_facebook_followers?: string;
  raw_linkedin_url?: string;
  raw_linkedin_followers?: string;
}

const STATUS_CONFIG: Record<AppStatus, { bg: string; color: string; label: string }> = {
  Pending: { bg: 'rgba(255,255,255,0.05)', color: '#9ca3af', label: 'Pending' },
  'Under Review': { bg: 'rgba(99,102,241,0.15)', color: '#a5b4fc', label: 'Under Review' },
  'Identity Check': { bg: 'rgba(245,158,11,0.15)', color: '#fcd34d', label: 'Identity Check' },
  Approved: { bg: 'rgba(34,197,94,0.15)', color: '#86efac', label: 'Approved' },
  Rejected: { bg: 'rgba(239,68,68,0.15)', color: '#fca5a5', label: 'Rejected' },
};

function extractHandle(url: string): string {
  try {
    if (!url) return '';
    const parts = url.split('/').filter(Boolean);
    return parts[parts.length - 1] || url;
  } catch {
    return url;
  }
}

/* ------------------------------------------------------------------ */
/* Stat card                                                              */
/* ------------------------------------------------------------------ */

function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
}: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  label: string;
  value: number | string;
}) {
  return (
    <Card
      className="border-0 shadow-sm"
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(240, 235, 224, 0.08)',
      }}
    >
      <CardContent className="flex items-center gap-4 py-4 px-5">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
          style={{ background: iconBg, border: `1px solid ${iconColor}20` }}
        >
          <Icon size={18} style={{ color: iconColor }} />
        </div>
        <div>
          <div
            className="text-xl font-bold text-[#F0EBE0] font-bricolage"
          >
            {value}
          </div>
          <div className="text-xs text-gray-400">
            {label}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Review Dialog                                                          */
/* ------------------------------------------------------------------ */

function ReviewDialog({
  app,
  open,
  onOpenChange,
  onApprove,
  onReject,
  onSaveDetails,
}: {
  app: Application;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onSaveDetails: (id: string, details: any) => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [idCheckResult, setIdCheckResult] = useState<string | null>(null);
  const [isRunningCheck, setIsRunningCheck] = useState(false);

  // Form states for edit mode
  const [name, setName] = useState(app.raw_full_name || app.name);
  const [email, setEmail] = useState(app.raw_email || app.email);
  const [location, setLocation] = useState(app.raw_location || app.location);
  const [bio, setBio] = useState(app.raw_statement_of_purpose || app.bio);
  
  const [instagramUrl, setInstagramUrl] = useState(app.raw_instagram_url || '');
  const [instagramFollowers, setInstagramFollowers] = useState(app.raw_instagram_followers || '');
  const [xUrl, setXUrl] = useState(app.raw_x_url || '');
  const [xFollowers, setXFollowers] = useState(app.raw_x_followers || '');
  const [youtubeUrl, setYoutubeUrl] = useState(app.raw_youtube_url || '');
  const [youtubeFollowers, setYoutubeFollowers] = useState(app.raw_youtube_followers || '');
  const [facebookUrl, setFacebookUrl] = useState(app.raw_facebook_url || '');
  const [facebookFollowers, setFacebookFollowers] = useState(app.raw_facebook_followers || '');
  const [linkedinUrl, setLinkedinUrl] = useState(app.raw_linkedin_url || '');
  const [linkedinFollowers, setLinkedinFollowers] = useState(app.raw_linkedin_followers || '');

  // Reset form states when app changes
  useEffect(() => {
    setName(app.raw_full_name || app.name);
    setEmail(app.raw_email || app.email);
    setLocation(app.raw_location || app.location);
    setBio(app.raw_statement_of_purpose || app.bio);
    setInstagramUrl(app.raw_instagram_url || '');
    setInstagramFollowers(app.raw_instagram_followers || '');
    setXUrl(app.raw_x_url || '');
    setXFollowers(app.raw_x_followers || '');
    setYoutubeUrl(app.raw_youtube_url || '');
    setYoutubeFollowers(app.raw_youtube_followers || '');
    setFacebookUrl(app.raw_facebook_url || '');
    setFacebookFollowers(app.raw_facebook_followers || '');
    setLinkedinUrl(app.raw_linkedin_url || '');
    setLinkedinFollowers(app.raw_linkedin_followers || '');
    setIsEditing(false);
  }, [app]);

  function runIdentityCheck() {
    setIsRunningCheck(true);
    setTimeout(() => {
      setIdCheckResult(
        'Identity verification API would be called here (Digilocker / Aadhaar). Documents: Aadhaar UID linked, PAN verified, address confirmed.'
      );
      setIsRunningCheck(false);
    }, 1200);
  }

  const handleSave = async () => {
    await onSaveDetails(app.id, {
      name,
      email,
      location,
      bio,
      instagramUrl,
      instagramFollowers,
      xUrl,
      xFollowers,
      youtubeUrl,
      youtubeFollowers,
      facebookUrl,
      facebookFollowers,
      linkedinUrl,
      linkedinFollowers
    });
    setIsEditing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-lg text-white border-white/10 bg-slate-950"
        style={{
          borderRadius: '16px',
        }}
      >
        <DialogHeader className="flex flex-row items-center justify-between pr-8">
          <DialogTitle className="text-white font-bricolage">
            Application — {isEditing ? 'Edit Details' : app.name}
          </DialogTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs h-7 px-2 border-white/10 text-gray-300 hover:bg-white/5 hover:text-white bg-transparent ml-auto"
          >
            {isEditing ? 'Cancel Edit' : 'Edit Info'}
          </Button>
        </DialogHeader>

        <div className="space-y-4 text-sm mt-4 max-h-[60vh] overflow-y-auto pr-1">
          {isEditing ? (
            <div className="space-y-3.5">
              {/* Name & Email */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              {/* Statement of Purpose / Bio */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400">Creator Bio / SOP</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-amber-500/50 resize-none"
                />
              </div>

              <Separator className="bg-white/10" />
              <p className="text-xs font-semibold text-amber-400">Social Handles & Followers Count</p>

              {/* Instagram URL & Followers */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400">Instagram URL</label>
                  <input
                    type="text"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    placeholder="https://instagram.com/username"
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400">Instagram Followers</label>
                  <input
                    type="text"
                    value={instagramFollowers}
                    onChange={(e) => setInstagramFollowers(e.target.value)}
                    placeholder="Followers count"
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              {/* X URL & Followers */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400">X (Twitter) URL</label>
                  <input
                    type="text"
                    value={xUrl}
                    onChange={(e) => setXUrl(e.target.value)}
                    placeholder="https://x.com/username"
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400">X Followers</label>
                  <input
                    type="text"
                    value={xFollowers}
                    onChange={(e) => setXFollowers(e.target.value)}
                    placeholder="Followers count"
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              {/* YouTube URL & Followers */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400">YouTube URL</label>
                  <input
                    type="text"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://youtube.com/@channel"
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400">YouTube Subscribers</label>
                  <input
                    type="text"
                    value={youtubeFollowers}
                    onChange={(e) => setYoutubeFollowers(e.target.value)}
                    placeholder="Subscribers count"
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              {/* Facebook URL & Followers */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400">Facebook URL</label>
                  <input
                    type="text"
                    value={facebookUrl}
                    onChange={(e) => setFacebookUrl(e.target.value)}
                    placeholder="https://facebook.com/username"
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400">Facebook Followers</label>
                  <input
                    type="text"
                    value={facebookFollowers}
                    onChange={(e) => setFacebookFollowers(e.target.value)}
                    placeholder="Followers/Likes count"
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              {/* LinkedIn URL & Followers */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400">LinkedIn URL</label>
                  <input
                    type="text"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400">LinkedIn Connections</label>
                  <input
                    type="text"
                    value={linkedinFollowers}
                    onChange={(e) => setLinkedinFollowers(e.target.value)}
                    placeholder="Connections count"
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Basic info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs uppercase tracking-wider text-gray-400">
                    Email
                  </span>
                  <p className="font-medium mt-0.5 text-gray-200">
                    {app.email}
                  </p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-gray-400">
                    Applied
                  </span>
                  <p className="font-medium mt-0.5 text-gray-200">
                    {app.appliedDate}
                  </p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-gray-400">
                    Location
                  </span>
                  <p className="font-medium mt-0.5 text-gray-200">
                    {app.location}
                  </p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-gray-400">
                    Social Handles
                  </span>
                  <p className="font-medium mt-0.5 text-gray-200">
                    {app.handles}
                  </p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-gray-400">
                    Followers
                  </span>
                  <p className="font-medium mt-0.5 text-gray-200">
                    {app.followers}
                  </p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-gray-400">
                    Languages
                  </span>
                  <p className="font-medium mt-0.5 text-gray-200">
                    {app.languages.join(', ')}
                  </p>
                </div>
              </div>

              {/* Content niches */}
              <div>
                <span className="text-xs uppercase tracking-wider text-gray-400">
                  Content Niches
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {app.niches.map((n) => (
                    <Badge
                      key={n}
                      className="text-xs bg-white/5 text-gray-300 border border-white/5"
                      style={{
                        color: GOLD,
                      }}
                    >
                      {n}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <div>
                <span className="text-xs uppercase tracking-wider text-gray-400">
                  Creator Bio
                </span>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-300">
                  {app.bio}
                </p>
              </div>

              <Separator className="bg-white/10" />

              {/* Identity check */}
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 w-full justify-center text-gray-300 border-white/10 hover:bg-white/5 hover:text-white bg-transparent"
                  onClick={runIdentityCheck}
                  disabled={isRunningCheck}
                >
                  <ShieldCheck size={14} className="text-emerald-400" />
                  {isRunningCheck ? 'Running Verification…' : 'Run Identity Check'}
                </Button>
                {idCheckResult && (
                  <div
                    className="mt-2 p-3 rounded-lg flex gap-2.5 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
                  >
                    <Info size={13} className="shrink-0 mt-0.5 text-emerald-400" />
                    <p>{idCheckResult}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <DialogFooter className="-mx-6 -mb-6 gap-2 rounded-b-lg px-6 py-4 flex-row justify-end border-t border-white/10 bg-white/[0.02]">
          {isEditing ? (
            <>
              <Button
                size="sm"
                onClick={() => setIsEditing(false)}
                variant="outline"
                className="text-gray-300 border-white/10 hover:bg-white/5 hover:text-white bg-transparent"
                style={{ borderRadius: '8px' }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                className="bg-[#C9A84C] hover:bg-[#b0913b] text-slate-950 font-bold"
                style={{ borderRadius: '8px', border: 'none' }}
              >
                Save Details
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                onClick={() => onReject(app.id)}
                className="gap-1.5 bg-red-500/80 hover:bg-red-500 text-white font-bold"
                style={{ borderRadius: '8px' }}
              >
                <UserX size={13} />
                Reject
              </Button>
              <Button
                size="sm"
                onClick={() => onApprove(app.id)}
                className="gap-1.5 bg-[#C9A84C] hover:bg-[#b0913b] text-slate-950 font-bold"
                style={{ borderRadius: '8px', border: 'none' }}
              >
                <UserCheck size={13} />
                Approve &amp; Onboard
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                  */
/* ------------------------------------------------------------------ */

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Application | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/admin/applications?type=applications');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setApplications(data.applications || []);
        }
      }
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', id, status }),
      });
      if (res.ok) {
        fetchApplications();
        setDialogOpen(false);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleSaveDetails = async (id: string, details: any) => {
    try {
      const res = await fetch('/api/admin/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_details', id, ...details }),
      });
      if (res.ok) {
        await fetchApplications();
        
        // Dynamic re-mapping of handles and followers count
        const handlesList = [];
        if (details.instagramUrl) handlesList.push(`Instagram: @${extractHandle(details.instagramUrl)}`);
        if (details.xUrl) handlesList.push(`X: @${extractHandle(details.xUrl)}`);
        if (details.youtubeUrl) handlesList.push(`YouTube: @${extractHandle(details.youtubeUrl)}`);
        if (details.facebookUrl) handlesList.push(`Facebook: @${extractHandle(details.facebookUrl)}`);
        if (details.linkedinUrl) handlesList.push(`LinkedIn: @${extractHandle(details.linkedinUrl)}`);
        
        const followersList = [];
        if (details.instagramFollowers) followersList.push(`IG: ${details.instagramFollowers}`);
        if (details.xFollowers) followersList.push(`X: ${details.xFollowers}`);
        if (details.youtubeFollowers) followersList.push(`YT: ${details.youtubeFollowers}`);
        if (details.facebookFollowers) followersList.push(`FB: ${details.facebookFollowers}`);
        if (details.linkedinFollowers) followersList.push(`LI: ${details.linkedinFollowers}`);

        // Keep the modal open but update the displayed details in real time
        const updatedApp = {
          ...selected,
          ...details,
          name: details.name,
          email: details.email,
          location: details.location,
          bio: details.bio,
          handles: handlesList.join(', ') || 'None',
          followers: followersList.join(' | ') || 'None',
          
          // Re-update raw fields as well
          raw_full_name: details.name,
          raw_email: details.email,
          raw_location: details.location,
          raw_statement_of_purpose: details.bio,
          raw_instagram_url: details.instagramUrl,
          raw_instagram_followers: details.instagramFollowers,
          raw_x_url: details.xUrl,
          raw_x_followers: details.xFollowers,
          raw_youtube_url: details.youtubeUrl,
          raw_youtube_followers: details.youtubeFollowers,
          raw_facebook_url: details.facebookUrl,
          raw_facebook_followers: details.facebookFollowers,
          raw_linkedin_url: details.linkedinUrl,
          raw_linkedin_followers: details.linkedinFollowers,
        };
        setSelected(updatedApp as Application);
      }
    } catch (err) {
      console.error('Failed to save details:', err);
    }
  };

  function openReview(app: Application) {
    setSelected(app);
    setDialogOpen(true);
  }

  // Count filters
  const pendingCount = applications.filter((a) => a.status === 'Pending').length;
  const underReviewCount = applications.filter((a) => a.status === 'Under Review').length;
  const approvedCount = applications.filter((a) => a.status === 'Approved').length;
  const rejectedCount = applications.filter((a) => a.status === 'Rejected').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-bold tracking-tight text-white font-bricolage"
        >
          Application Queue
        </h1>
        <p className="text-sm mt-1 text-gray-400">
          Local Roster Onboarding Queue — Kozhikode Chapter
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={ClipboardList}
          iconBg="rgba(255,255,255,0.05)"
          iconColor="#F0EBE0"
          label="Pending"
          value={pendingCount}
        />
        <StatCard
          icon={Clock}
          iconBg="rgba(99,102,241,0.10)"
          iconColor="#818cf8"
          label="Under Review"
          value={underReviewCount}
        />
        <StatCard
          icon={CheckCircle2}
          iconBg="rgba(34,197,94,0.10)"
          iconColor="#34d399"
          label="Approved"
          value={approvedCount}
        />
        <StatCard
          icon={XCircle}
          iconBg="rgba(239,68,68,0.08)"
          iconColor="#f87171"
          label="Rejected"
          value={rejectedCount}
        />
      </div>

      {/* Applications table */}
      <Card
        className="border-0 shadow-sm"
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(240, 235, 224, 0.08)',
        }}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-white font-bricolage">
            Pending Applications
          </CardTitle>
          <p className="text-xs text-gray-400">
            Review and process creator applications for the Kozhikode chapter
          </p>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader className="border-white/5">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="pl-6 text-xs text-gray-400">Applicant</TableHead>
                <TableHead className="text-xs text-gray-400">Email</TableHead>
                <TableHead className="text-xs text-gray-400">Social Handles</TableHead>
                <TableHead className="text-xs text-gray-400">Applied Date</TableHead>
                <TableHead className="text-xs text-gray-400">Status</TableHead>
                <TableHead className="text-xs pr-6 text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-400 text-sm">
                    Loading applications...
                  </TableCell>
                </TableRow>
              ) : applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-400 text-sm">
                    No applications found.
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((app) => {
                  const sc = STATUS_CONFIG[app.status] || STATUS_CONFIG.Pending;
                  return (
                    <TableRow
                      key={app.id}
                      className="border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                          style={{
                            background: 'rgba(201,168,76,0.15)',
                            color: GOLD,
                            border: '1px solid rgba(201,168,76,0.25)',
                          }}
                        >
                          {app.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)}
                        </div>
                        <span className="text-sm font-semibold text-white">
                          {app.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-gray-400">
                        {app.email}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-medium text-gray-200">
                        {app.handles}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-gray-400">
                        {app.appliedDate}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className="text-xs font-semibold"
                        style={{ background: sc.bg, color: sc.color, border: 'none' }}
                      >
                        {sc.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6">
                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          className="h-7 px-2.5 text-xs gap-1 font-semibold text-[#080D26] hover:bg-[#b0923d]"
                          onClick={() => openReview(app)}
                          style={{
                            background: GOLD,
                            borderRadius: 7,
                            border: 'none',
                          }}
                        >
                          <Eye size={12} />
                          Review
                        </Button>
                        {app.status === 'Pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(app.id, 'Approved')}
                              className="h-7 px-2 text-xs gap-1 border-emerald-500/30 text-emerald-400 bg-transparent hover:bg-emerald-500/10 hover:text-emerald-300"
                            >
                              <UserCheck size={12} />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(app.id, 'Rejected')}
                              className="h-7 px-2 text-xs gap-1 border-red-500/30 text-red-400 bg-transparent hover:bg-red-500/10 hover:text-red-300"
                            >
                              <UserX size={12} />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          <div
            className="px-6 py-3 text-xs text-gray-500"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
          >
            Showing {applications.length} applications · Chapter admin can approve, reject, or escalate
          </div>
        </CardContent>
      </Card>

      {/* Review dialog */}
      {selected && (
        <ReviewDialog
          app={selected}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onApprove={(id) => handleUpdateStatus(id, 'Approved')}
          onReject={(id) => handleUpdateStatus(id, 'Rejected')}
          onSaveDetails={handleSaveDetails}
        />
      )}
    </div>
  );
}
