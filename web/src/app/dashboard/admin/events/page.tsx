'use client';

import { useState } from 'react';
import {
  CalendarDays,
  MapPin,
  Users,
  Clock,
  Plus,
  CheckCircle2,
  Send,
  Download,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

/* ------------------------------------------------------------------ */
/* Constants                                                             */
/* ------------------------------------------------------------------ */

const GOLD = '#C9A84C';
const INDIGO = '#080D26';
const BG = '#F8F7F4';

/* ------------------------------------------------------------------ */
/* Mock data                                                             */
/* ------------------------------------------------------------------ */

interface Event {
  id: number;
  title: string;
  venue: string;
  address: string;
  date: string;
  time: string;
  registered: number;
  capacity: number;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  attendees?: string[];
}

const UPCOMING_EVENTS: Event[] = [
  {
    id: 1,
    title: 'May Creator Meetup',
    venue: 'HiLite Business Park',
    address: 'Calicut, Kerala 673014',
    date: 'May 28, 2026',
    time: '6:30 PM',
    registered: 45,
    capacity: 60,
    status: 'Upcoming',
    attendees: [
      'Arjun Menon', 'Meera Pillai', 'Rahul Suresh', 'Nisha Krishnan',
      'Vishnu Ramachandran', 'Fathima Noor', 'Mohammed Irfan', 'Priya Nair',
      'Suresh Kumar', 'Asha Mohan', 'Deepak Raj', 'Sunita Varma',
    ],
  },
  {
    id: 2,
    title: 'Brand Partnership Workshop',
    venue: 'The Marriott Calicut',
    address: 'Beach Road, Calicut, Kerala 673020',
    date: 'June 8, 2026',
    time: '3:00 PM',
    registered: 22,
    capacity: 40,
    status: 'Upcoming',
    attendees: [
      'Arjun Menon', 'Vishnu Ramachandran', 'Lakshmi Devi', 'Krishnan Pillai',
      'Thomas Mathew', 'Sana Rashid', 'Anish Kumar',
    ],
  },
  {
    id: 3,
    title: 'OBS Production Masterclass',
    venue: 'SICE Studio Calicut',
    address: 'Palayam, Kozhikode, Kerala 673002',
    date: 'June 20, 2026',
    time: '10:00 AM',
    registered: 18,
    capacity: 25,
    status: 'Upcoming',
    attendees: [
      'Rahul Suresh', 'Mohammed Irfan', 'Arjun Menon', 'Nisha Krishnan',
      'Deepak Raj', 'Sunita Varma',
    ],
  },
];

const PAST_EVENTS: Event[] = [
  {
    id: 4,
    title: 'April Kickoff Meetup',
    venue: 'Calicut Beach Hotel',
    address: 'Beach Road, Calicut',
    date: 'Apr 20, 2026',
    time: '5:00 PM',
    registered: 58,
    capacity: 60,
    status: 'Completed',
    attendees: [],
  },
  {
    id: 5,
    title: 'Instagram Reels Workshop',
    venue: 'SICE Studio Calicut',
    address: 'Palayam, Kozhikode',
    date: 'Mar 15, 2026',
    time: '11:00 AM',
    registered: 24,
    capacity: 25,
    status: 'Completed',
    attendees: [],
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                                */
/* ------------------------------------------------------------------ */

function attendancePct(registered: number, capacity: number) {
  return Math.round((registered / capacity) * 100);
}

const STATUS_CONFIG: Record<Event['status'], { bg: string; color: string }> = {
  Upcoming: { bg: 'rgba(99,102,241,0.15)', color: '#818cf8' },
  Completed: { bg: 'rgba(34,197,94,0.15)', color: '#34d399' },
  Cancelled: { bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
};

/* ------------------------------------------------------------------ */
/* Create Event Dialog                                                    */
/* ------------------------------------------------------------------ */

function CreateEventDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md text-[#F0EBE0] border-white/10"
        style={{ background: '#080D26', border: '1px solid rgba(240, 235, 224, 0.15)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}
      >
        <DialogHeader>
          <DialogTitle className="text-white font-bricolage">Schedule New Event</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-gray-300">
              Event Title
            </Label>
            <Input
              placeholder="e.g. June Creator Meetup"
              className="bg-white/5 border-white/15 text-white focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-gray-300">
              Venue Name
            </Label>
            <Input
              placeholder="e.g. HiLite Business Park"
              className="bg-white/5 border-white/15 text-white focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-gray-300">
              Full Address
            </Label>
            <Input
              placeholder="Street, City, State, PIN"
              className="bg-white/5 border-white/15 text-white focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-300">
                Date
              </Label>
              <Input
                type="date"
                className="bg-white/5 border-white/15 text-white focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-300">
                Time
              </Label>
              <Input
                type="time"
                className="bg-white/5 border-white/15 text-white focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-gray-300">
              Max Attendees
            </Label>
            <Input
              type="number"
              placeholder="e.g. 60"
              className="bg-white/5 border-white/15 text-white focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-gray-300">
              Description
            </Label>
            <Textarea
              placeholder="Describe the event agenda, speakers, and what attendees can expect…"
              rows={3}
              className="bg-white/5 border-white/15 text-white focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]"
              style={{ resize: 'none' }}
            />
          </div>
        </div>

        <DialogFooter showCloseButton className="-mx-6 -mb-6 bg-white/[0.02] border-t border-white/10 p-4">
          <Button
            className="gap-2 bg-[#C9A84C] hover:bg-[#b0913b] text-slate-950 font-bold"
            style={{ borderRadius: 8, border: 'none' }}
          >
            <CalendarDays size={14} />
            Create Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Manage Event Dialog                                                    */
/* ------------------------------------------------------------------ */

function ManageEventDialog({
  event,
  open,
  onOpenChange,
}: {
  event: Event;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md text-[#F0EBE0] border-white/10"
        style={{ background: '#080D26', border: '1px solid rgba(240, 235, 224, 0.15)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}
      >
        <DialogHeader>
          <DialogTitle className="text-white font-bricolage">Manage — {event.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm mt-2">
          {/* Event details */}
          <div className="p-3 rounded-xl space-y-1.5" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(240, 235, 224, 0.08)' }}>
            <div className="flex items-center gap-2 text-gray-300">
              <MapPin size={13} style={{ color: GOLD }} />
              {event.venue} · {event.address}
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <CalendarDays size={13} style={{ color: GOLD }} />
              {event.date} at {event.time}
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Users size={13} style={{ color: GOLD }} />
              {event.registered} / {event.capacity} registered ({attendancePct(event.registered, event.capacity)}%)
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* Attendee list */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-2 text-gray-400">
              Registered Attendees ({event.attendees?.length ?? 0} shown)
            </h3>
            <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
              {(event.attendees ?? []).map((name, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                  style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(240, 235, 224, 0.04)' }}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border"
                    style={{ background: 'rgba(201,168,76,0.15)', color: GOLD, borderColor: 'rgba(201,168,76,0.25)' }}
                  >
                    {name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <span className="text-white">{name}</span>
                </div>
              ))}
              {(event.attendees?.length ?? 0) < event.registered && (
                <p className="text-xs text-center py-1 text-gray-500">
                  + {event.registered - (event.attendees?.length ?? 0)} more not shown
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="-mx-6 -mb-6 bg-white/[0.02] border-t border-white/10 p-4" showCloseButton>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 hover:text-white bg-transparent"
          >
            <Send size={13} />
            Send Reminder
          </Button>
          <Button
            size="sm"
            className="gap-1.5 bg-[#C9A84C] hover:bg-[#b0913b] text-slate-950 font-bold"
            style={{ border: 'none' }}
          >
            <Download size={13} />
            Export List
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Event card                                                             */
/* ------------------------------------------------------------------ */

function EventCard({
  event,
  onManage,
}: {
  event: Event;
  onManage: (e: Event) => void;
}) {
  const pct = attendancePct(event.registered, event.capacity);
  const sc = STATUS_CONFIG[event.status];
  const isAlmostFull = pct >= 80;

  return (
    <Card
      className="border-0 shadow-sm"
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(240, 235, 224, 0.08)',
      }}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <Badge
                className="text-xs font-semibold"
                style={{ background: sc.bg, color: sc.color, border: 'none' }}
              >
                {event.status}
              </Badge>
              {isAlmostFull && event.status === 'Upcoming' && (
                <Badge
                  className="text-xs font-semibold"
                  style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: 'none' }}
                >
                  Almost Full
                </Badge>
              )}
            </div>
            <h3
              className="text-base font-bold text-white font-bricolage"
            >
              {event.title}
            </h3>
            <div className="flex flex-col gap-1 mt-2">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <MapPin size={12} style={{ color: GOLD }} />
                {event.venue} · {event.address}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <CalendarDays size={12} style={{ color: GOLD }} />
                {event.date}
                <Clock size={12} style={{ color: GOLD }} className="ml-1" />
                {event.time}
              </div>
            </div>
          </div>
          {event.status !== 'Cancelled' && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-3 text-xs gap-1.5 shrink-0 border-[#C9A84C]/30 text-[#C9A84C] hover:bg-[#C9A84C]/10 hover:text-white bg-transparent"
              onClick={() => onManage(event)}
              style={{
                borderRadius: 8,
              }}
            >
              Manage
            </Button>
          )}
        </div>

        {/* Attendance progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-gray-400">
              <Users size={12} className="inline mr-1" />
              {event.registered} / {event.capacity} registered
            </span>
            <span
              className="text-xs font-bold"
              style={{ color: isAlmostFull ? '#f87171' : GOLD }}
            >
              {pct}%
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${pct}%`,
                background: pct >= 80 ? '#f87171' : pct >= 50 ? GOLD : '#34d399',
              }}
            />
          </div>
        </div>

        {event.status === 'Completed' && (
          <div
            className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400"
          >
            <CheckCircle2 size={13} />
            Event completed · {event.registered} attended out of {event.capacity} capacity
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                  */
/* ------------------------------------------------------------------ */

export default function EventsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [managedEvent, setManagedEvent] = useState<Event | null>(null);
  const [manageOpen, setManageOpen] = useState(false);

  function handleManage(event: Event) {
    setManagedEvent(event);
    setManageOpen(true);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight text-white font-bricolage"
          >
            Event Manager — Kozhikode Chapter
          </h1>
          <p className="text-sm mt-1 text-gray-400">
            Physical events, meetups, workshops and logistics
          </p>
        </div>
        <Button
          className="gap-2 font-semibold bg-[#C9A84C] hover:bg-[#b0913b] text-slate-950 font-bold"
          onClick={() => setCreateOpen(true)}
          style={{
            borderRadius: 10,
            border: 'none',
          }}
        >
          <Plus size={16} />
          Schedule New Event
        </Button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card
          className="border-0 shadow-sm"
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(240, 235, 224, 0.08)',
          }}
        >
          <CardContent className="flex items-center gap-3 py-4 px-5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-indigo-500/15"
              style={{ background: 'rgba(99,102,241,0.10)' }}
            >
              <CalendarDays size={16} style={{ color: '#818cf8' }} />
            </div>
            <div>
              <div className="text-xl font-bold text-white font-bricolage">3</div>
              <div className="text-xs text-gray-400">Upcoming Events</div>
            </div>
          </CardContent>
        </Card>
        <Card
          className="border-0 shadow-sm"
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(240, 235, 224, 0.08)',
          }}
        >
          <CardContent className="flex items-center gap-3 py-4 px-5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-[#C9A84C]/15"
              style={{ background: 'rgba(201,168,76,0.10)' }}
            >
              <Users size={16} style={{ color: GOLD }} />
            </div>
            <div>
              <div className="text-xl font-bold text-white font-bricolage">85</div>
              <div className="text-xs text-gray-400">Total Registered</div>
            </div>
          </CardContent>
        </Card>
        <Card
          className="border-0 shadow-sm"
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(240, 235, 224, 0.08)',
          }}
        >
          <CardContent className="flex items-center gap-3 py-4 px-5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-emerald-500/15"
              style={{ background: 'rgba(34,197,94,0.10)' }}
            >
              <CheckCircle2 size={16} style={{ color: '#34d399' }} />
            </div>
            <div>
              <div className="text-xl font-bold text-white font-bricolage">2</div>
              <div className="text-xs text-gray-400">Past Events</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming events */}
      <div>
        <h2
          className="text-sm font-semibold uppercase tracking-wider mb-4 text-gray-400"
        >
          Upcoming Events
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {UPCOMING_EVENTS.map((event) => (
            <EventCard key={event.id} event={event} onManage={handleManage} />
          ))}
        </div>
      </div>

      {/* Past events */}
      <div>
        <h2
          className="text-sm font-semibold uppercase tracking-wider mb-4 text-gray-400"
        >
          Past Events
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {PAST_EVENTS.map((event) => (
            <EventCard key={event.id} event={event} onManage={handleManage} />
          ))}
        </div>
      </div>

      {/* Dialogs */}
      <CreateEventDialog open={createOpen} onOpenChange={setCreateOpen} />
      {managedEvent && (
        <ManageEventDialog
          event={managedEvent}
          open={manageOpen}
          onOpenChange={setManageOpen}
        />
      )}
    </div>
  );
}
