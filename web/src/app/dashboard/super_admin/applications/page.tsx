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
  Building,
  MapPin,
  Map,
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

const GOLD = '#C9A84C';

type AppStatus = 'Pending' | 'Under Review' | 'Identity Check' | 'Approved' | 'Rejected';

interface CreatorApplication {
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

interface ChapterApplication {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  whatsappNumber: string;
  chapterName: string;
  customChapterName: string | null;
  chapterRole: string;
  chapterProfileUrl: string;
  bio: string;
  status: AppStatus;
  appliedDate: string;
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
          <div className="text-xl font-bold text-[#F0EBE0] font-bricolage">{value}</div>
          <div className="text-xs text-gray-400">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Review Dialog for Creator Applications                             */
/* ------------------------------------------------------------------ */
function CreatorReviewDialog({
  app,
  open,
  onOpenChange,
  onApprove,
  onReject,
  onSaveDetails,
}: {
  app: CreatorApplication;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onSaveDetails: (id: string, details: any) => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [idCheckResult, setIdCheckResult] = useState<string | null>(null);
  const [isRunningCheck, setIsRunningCheck] = useState(false);

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
      <DialogContent className="sm:max-w-lg text-white border-white/10 bg-slate-950 rounded-2xl">
        <DialogHeader className="flex flex-row items-center justify-between pr-8">
          <DialogTitle className="text-white font-bricolage">
            Creator Application — {isEditing ? 'Edit Details' : app.name}
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

              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

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

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400">Instagram URL</label>
                  <input
                    type="text"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400">Instagram Followers</label>
                  <input
                    type="text"
                    value={instagramFollowers}
                    onChange={(e) => setInstagramFollowers(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400">X (Twitter) URL</label>
                  <input
                    type="text"
                    value={xUrl}
                    onChange={(e) => setXUrl(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400">X Followers</label>
                  <input
                    type="text"
                    value={xFollowers}
                    onChange={(e) => setXFollowers(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400">YouTube URL</label>
                  <input
                    type="text"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400">YouTube Subscribers</label>
                  <input
                    type="text"
                    value={youtubeFollowers}
                    onChange={(e) => setYoutubeFollowers(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400">Facebook URL</label>
                  <input
                    type="text"
                    value={facebookUrl}
                    onChange={(e) => setFacebookUrl(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400">Facebook Followers</label>
                  <input
                    type="text"
                    value={facebookFollowers}
                    onChange={(e) => setFacebookFollowers(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400">LinkedIn URL</label>
                  <input
                    type="text"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400">LinkedIn Connections</label>
                  <input
                    type="text"
                    value={linkedinFollowers}
                    onChange={(e) => setLinkedinFollowers(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs uppercase tracking-wider text-gray-400">Email</span>
                  <p className="font-medium mt-0.5 text-gray-200">{app.email}</p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-gray-400">Applied</span>
                  <p className="font-medium mt-0.5 text-gray-200">{app.appliedDate}</p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-gray-400">Location</span>
                  <p className="font-medium mt-0.5 text-gray-200">{app.location}</p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-gray-400">Social Handles</span>
                  <p className="font-medium mt-0.5 text-gray-200">{app.handles}</p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-gray-400">Followers</span>
                  <p className="font-medium mt-0.5 text-gray-200">{app.followers}</p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-gray-400">Languages</span>
                  <p className="font-medium mt-0.5 text-gray-200">{app.languages.join(', ')}</p>
                </div>
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider text-gray-400">Content Niches</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {app.niches.map((n) => (
                    <Badge
                      key={n}
                      className="text-xs bg-white/5 text-gray-300 border border-white/5"
                      style={{ color: GOLD }}
                    >
                      {n}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider text-gray-400">Creator Bio</span>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-300">{app.bio}</p>
              </div>

              <Separator className="bg-white/10" />

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
                  <div className="mt-2 p-3 rounded-lg flex gap-2.5 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
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
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                className="bg-[#C9A84C] hover:bg-[#b0913b] text-slate-950 font-bold border-none"
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
              >
                <UserX size={13} />
                Reject
              </Button>
              <Button
                size="sm"
                onClick={() => onApprove(app.id)}
                className="gap-1.5 bg-[#C9A84C] hover:bg-[#b0913b] text-slate-950 font-bold border-none"
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
/* Review Dialog for Chapter Applications                             */
/* ------------------------------------------------------------------ */
function ChapterReviewDialog({
  app,
  open,
  onOpenChange,
  onApprove,
  onReject,
}: {
  app: ChapterApplication;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-white border-white/10 bg-slate-950 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-white font-bricolage">
            Chapter Application — {app.chapterName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm mt-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-xs uppercase tracking-wider text-gray-400">Applicant</span>
              <p className="font-medium mt-0.5 text-gray-200">{app.name}</p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-gray-400">Email</span>
              <p className="font-medium mt-0.5 text-gray-200">{app.email}</p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-gray-400">Phone</span>
              <p className="font-medium mt-0.5 text-gray-200">{app.contactNumber}</p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-gray-400">WhatsApp</span>
              <p className="font-medium mt-0.5 text-gray-200">{app.whatsappNumber}</p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-gray-400">Role Requested</span>
              <p className="font-medium mt-0.5 text-gray-200">{app.chapterRole}</p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-gray-400">Applied Date</span>
              <p className="font-medium mt-0.5 text-gray-200">{app.appliedDate}</p>
            </div>
          </div>

          <div>
            <span className="text-xs uppercase tracking-wider text-gray-400">Profile URL</span>
            <p className="font-medium mt-0.5 text-gray-200 truncate">
              <a href={app.chapterProfileUrl} target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">
                {app.chapterProfileUrl}
              </a>
            </p>
          </div>

          {app.customChapterName && (
            <div>
              <span className="text-xs uppercase tracking-wider text-gray-400">Proposed Name</span>
              <p className="font-medium mt-0.5 text-amber-300">{app.customChapterName}</p>
            </div>
          )}

          <div>
            <span className="text-xs uppercase tracking-wider text-gray-400">Statement of Purpose</span>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-300 bg-white/5 p-3 rounded-lg border border-white/5">
              {app.bio}
            </p>
          </div>
        </div>

        <DialogFooter className="-mx-6 -mb-6 gap-2 rounded-b-lg px-6 py-4 flex-row justify-end border-t border-white/10 bg-white/[0.02] mt-6">
          <Button
            size="sm"
            onClick={() => onReject(app.id)}
            className="gap-1.5 bg-red-500/80 hover:bg-red-500 text-white font-bold"
          >
            <UserX size={13} />
            Reject
          </Button>
          <Button
            size="sm"
            onClick={() => onApprove(app.id)}
            className="gap-1.5 bg-[#C9A84C] hover:bg-[#b0913b] text-slate-950 font-bold border-none"
          >
            <Building size={13} />
            Approve &amp; Register Chapter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Page Main Component                                                   */
/* ------------------------------------------------------------------ */
export default function SuperAdminApplications() {
  const [activeTab, setActiveTab] = useState<'creator' | 'chapter'>('creator');
  
  const [creatorApps, setCreatorApps] = useState<CreatorApplication[]>([]);
  const [chapterApps, setChapterApps] = useState<ChapterApplication[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [selectedCreator, setSelectedCreator] = useState<CreatorApplication | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<ChapterApplication | null>(null);
  
  const [creatorDialogOpen, setCreatorDialogOpen] = useState(false);
  const [chapterDialogOpen, setChapterDialogOpen] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      // 1. Fetch Creator Applications
      const cRes = await fetch('/api/admin/applications?type=applications');
      if (cRes.ok) {
        const cData = await cRes.json();
        if (cData.success) {
          setCreatorApps(cData.applications || []);
        }
      }

      // 2. Fetch Chapter Applications
      const chRes = await fetch('/api/admin/applications?type=chapter_applications');
      if (chRes.ok) {
        const chData = await chRes.json();
        if (chData.success) {
          setChapterApps(chData.applications || []);
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

  const handleUpdateStatus = async (id: string, status: string, type: 'creator' | 'chapter') => {
    try {
      const res = await fetch('/api/admin/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', id, status }),
      });
      if (res.ok) {
        await fetchApplications();
        setCreatorDialogOpen(false);
        setChapterDialogOpen(false);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleSaveCreatorDetails = async (id: string, details: any) => {
    try {
      const res = await fetch('/api/admin/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_details', id, ...details }),
      });
      if (res.ok) {
        await fetchApplications();
        
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

        const updatedApp = {
          ...selectedCreator,
          ...details,
          name: details.name,
          email: details.email,
          location: details.location,
          bio: details.bio,
          handles: handlesList.join(', ') || 'None',
          followers: followersList.join(' | ') || 'None',
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
        setSelectedCreator(updatedApp as CreatorApplication);
      }
    } catch (err) {
      console.error('Failed to save details:', err);
    }
  };

  function openCreatorReview(app: CreatorApplication) {
    setSelectedCreator(app);
    setCreatorDialogOpen(true);
  }

  function openChapterReview(app: ChapterApplication) {
    setSelectedChapter(app);
    setChapterDialogOpen(true);
  }

  // Count stats
  const pendingCreatorsCount = creatorApps.filter((a) => a.status === 'Pending').length;
  const pendingChaptersCount = chapterApps.filter((a) => a.status === 'Pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white font-bricolage">
          Applications Queue
        </h1>
        <p className="text-sm mt-1 text-gray-400">
          Global Governance Review — Process creator and new chapter application requests.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={ClipboardList}
          iconBg="rgba(255,255,255,0.05)"
          iconColor="#F0EBE0"
          label="Pending Creators"
          value={pendingCreatorsCount}
        />
        <StatCard
          icon={Building}
          iconBg="rgba(99,102,241,0.10)"
          iconColor="#818cf8"
          label="Pending Chapters"
          value={pendingChaptersCount}
        />
        <StatCard
          icon={CheckCircle2}
          iconBg="rgba(34,197,94,0.10)"
          iconColor="#34d399"
          label="Total Handled (Roster)"
          value={creatorApps.filter(a => a.status === 'Approved').length + chapterApps.filter(a => a.status === 'Approved').length}
        />
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab('creator')}
          className={`px-6 py-3 font-semibold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'creator' ? 'border-[#C9A84C] text-[#F0EBE0]' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Creator Applications ({creatorApps.length})
        </button>
        <button
          onClick={() => setActiveTab('chapter')}
          className={`px-6 py-3 font-semibold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'chapter' ? 'border-[#C9A84C] text-[#F0EBE0]' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Chapter Applications ({chapterApps.length})
        </button>
      </div>

      {/* Applications Table */}
      <Card
        className="border-0 shadow-sm"
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(240, 235, 224, 0.08)',
        }}
      >
        <CardContent className="px-0 pb-0 pt-2">
          {activeTab === 'creator' ? (
            <Table>
              <TableHeader className="border-white/5">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="pl-6 text-xs text-gray-400">Applicant</TableHead>
                  <TableHead className="text-xs text-gray-400">Email</TableHead>
                  <TableHead className="text-xs text-gray-400">Social Handles</TableHead>
                  <TableHead className="text-xs text-gray-400">Applied Date</TableHead>
                  <TableHead className="text-xs text-gray-400">Status</TableHead>
                  <TableHead className="pr-6 text-xs text-gray-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-400 text-sm">
                      Loading creator applications...
                    </TableCell>
                  </TableRow>
                ) : creatorApps.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-400 text-sm">
                      No creator applications found.
                    </TableCell>
                  </TableRow>
                ) : (
                  creatorApps.map((app) => {
                    const sc = STATUS_CONFIG[app.status] || STATUS_CONFIG.Pending;
                    return (
                      <TableRow key={app.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                        <TableCell className="pl-6 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                              style={{
                                background: 'rgba(201,168,76,0.15)',
                                color: GOLD,
                                border: '1px solid rgba(201,168,76,0.25)',
                              }}
                            >
                              {app.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                            </div>
                            <span className="text-sm font-semibold text-white">{app.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-gray-400">{app.email}</TableCell>
                        <TableCell className="text-xs font-medium text-gray-200">{app.handles}</TableCell>
                        <TableCell className="text-xs text-gray-400">{app.appliedDate}</TableCell>
                        <TableCell>
                          <Badge className="text-xs font-semibold" style={{ background: sc.bg, color: sc.color, border: 'none' }}>
                            {sc.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="pr-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              className="h-7 px-2.5 text-xs gap-1 font-semibold text-[#080D26] hover:bg-[#b0923d] border-none"
                              onClick={() => openCreatorReview(app)}
                              style={{ background: GOLD }}
                            >
                              <Eye size={12} />
                              Review
                            </Button>
                            {app.status === 'Pending' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUpdateStatus(app.id, 'Approved', 'creator')}
                                  className="h-7 px-2 text-xs gap-1 border-emerald-500/30 text-emerald-400 bg-transparent hover:bg-emerald-500/10 hover:text-emerald-300"
                                >
                                  <UserCheck size={12} />
                                  Approve
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
          ) : (
            <Table>
              <TableHeader className="border-white/5">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="pl-6 text-xs text-gray-400">Proposed Chapter</TableHead>
                  <TableHead className="text-xs text-gray-400">Applicant</TableHead>
                  <TableHead className="text-xs text-gray-400">Email & Phone</TableHead>
                  <TableHead className="text-xs text-gray-400">Applied Date</TableHead>
                  <TableHead className="text-xs text-gray-400">Status</TableHead>
                  <TableHead className="pr-6 text-xs text-gray-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-400 text-sm">
                      Loading chapter applications...
                    </TableCell>
                  </TableRow>
                ) : chapterApps.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-400 text-sm">
                      No chapter applications found.
                    </TableCell>
                  </TableRow>
                ) : (
                  chapterApps.map((app) => {
                    const sc = STATUS_CONFIG[app.status] || STATUS_CONFIG.Pending;

                    return (
                      <TableRow key={app.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                        <TableCell className="pl-6 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                              style={{
                                background: 'rgba(99,102,241,0.15)',
                                color: '#818cf8',
                                border: '1px solid rgba(99,102,241,0.25)',
                              }}
                            >
                              <Building size={14} />
                            </div>
                            <div>
                              <span className="text-sm font-semibold text-white block">{app.chapterName}</span>
                              {app.customChapterName && (
                                <span className="text-[10px] text-amber-400 italic">Proposed: {app.customChapterName}</span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-gray-200 font-medium">{app.name} ({app.chapterRole})</TableCell>
                        <TableCell className="text-xs text-gray-400">
                          <div>{app.email}</div>
                          <div className="text-[10px] text-gray-500 mt-0.5">{app.contactNumber}</div>
                        </TableCell>
                        <TableCell className="text-xs text-gray-400">{app.appliedDate}</TableCell>
                        <TableCell>
                          <Badge className="text-xs font-semibold" style={{ background: sc.bg, color: sc.color, border: 'none' }}>
                            {sc.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="pr-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              className="h-7 px-2.5 text-xs gap-1 font-semibold text-[#080D26] hover:bg-[#b0923d] border-none"
                              onClick={() => openChapterReview(app)}
                              style={{ background: GOLD }}
                            >
                              <Eye size={12} />
                              Review
                            </Button>
                            {app.status === 'Pending' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUpdateStatus(app.id, 'Approved', 'chapter')}
                                  className="h-7 px-2 text-xs gap-1 border-emerald-500/30 text-emerald-400 bg-transparent hover:bg-emerald-500/10 hover:text-emerald-300"
                                >
                                  <UserCheck size={12} />
                                  Approve
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
          )}

          <div className="px-6 py-3 text-xs text-gray-500 border-t border-white/5">
            Showing {activeTab === 'creator' ? creatorApps.length : chapterApps.length} applications · Super Admin can verify digital metrics and launch chapters.
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      {selectedCreator && (
        <CreatorReviewDialog
          app={selectedCreator}
          open={creatorDialogOpen}
          onOpenChange={setCreatorDialogOpen}
          onApprove={(id) => handleUpdateStatus(id, 'Approved', 'creator')}
          onReject={(id) => handleUpdateStatus(id, 'Rejected', 'creator')}
          onSaveDetails={handleSaveCreatorDetails}
        />
      )}

      {selectedChapter && (
        <ChapterReviewDialog
          app={selectedChapter}
          open={chapterDialogOpen}
          onOpenChange={setChapterDialogOpen}
          onApprove={(id) => handleUpdateStatus(id, 'Approved', 'chapter')}
          onReject={(id) => handleUpdateStatus(id, 'Rejected', 'chapter')}
        />
      )}
    </div>
  );
}
