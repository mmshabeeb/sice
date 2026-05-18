'use client';

import { Play, Clock, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const GOLD = '#C9A84C';
const INDIGO = '#080D26';
const BG = '#F8F7F4';

/* ------------------------------------------------------------------ */
/* Video data                                                            */
/* ------------------------------------------------------------------ */

interface Video {
  title: string;
  duration: string;
  instructor: string;
  progress?: number; // 0–100
}

interface Category {
  label: string;
  icon: string;
  videos: Video[];
}

const CATEGORIES: Category[] = [
  {
    label: 'Camera & Lighting',
    icon: '🎥',
    videos: [
      {
        title: '3-Point Lighting for South Indian Creators',
        duration: '42 min',
        instructor: 'Kiran Suresh',
        progress: 60,
      },
      {
        title: 'Camera Angles for Talking Head Content',
        duration: '28 min',
        instructor: 'Divya Krishnan',
      },
    ],
  },
  {
    label: 'Broadcasting (OBS / vMix)',
    icon: '📡',
    videos: [
      {
        title: 'OBS Setup for Regional Creators',
        duration: '55 min',
        instructor: 'Rohan Nair',
      },
      {
        title: 'vMix Live Production Masterclass',
        duration: '1 hr 20 min',
        instructor: 'Arya Menon',
      },
    ],
  },
  {
    label: 'Production Workflow',
    icon: '⚙️',
    videos: [
      {
        title: 'Professional Audio Setup on Budget',
        duration: '35 min',
        instructor: 'Sree Kumar',
      },
      {
        title: 'Color Grading for Warm Tones',
        duration: '31 min',
        instructor: 'Nidhi Varma',
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Video card                                                            */
/* ------------------------------------------------------------------ */

function VideoCard({ video, index }: { video: Video; index: number }) {
  const isFirst = index === 0 && video.progress !== undefined;

  return (
    <Card
      className="border-0 shadow-sm flex flex-col overflow-hidden"
      style={{ background: '#fff', borderRadius: '14px' }}
    >
      {/* Thumbnail */}
      <div
        className="relative flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${INDIGO} 0%, #1a2560 100%)`,
          height: '140px',
        }}
      >
        {/* Play button */}
        <button
          className="flex items-center justify-center w-12 h-12 rounded-full transition-transform hover:scale-110"
          style={{
            background: 'rgba(201,168,76,0.90)',
            boxShadow: '0 4px 16px rgba(201,168,76,0.40)',
          }}
          onClick={() =>
            alert('Video streaming would start here — integrate with your video host')
          }
          aria-label={`Play ${video.title}`}
        >
          <Play size={18} fill="#fff" style={{ color: '#fff', marginLeft: '2px' }} />
        </button>

        {/* Duration badge */}
        <div
          className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
          style={{ background: 'rgba(0,0,0,0.55)', color: '#fff', backdropFilter: 'blur(4px)' }}
        >
          <Clock size={10} />
          {video.duration}
        </div>

        {/* "Watching" indicator for in-progress video */}
        {video.progress !== undefined && (
          <div
            className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-semibold"
            style={{ background: GOLD, color: '#fff' }}
          >
            Continue watching
          </div>
        )}
      </div>

      {/* Progress bar for first video */}
      {video.progress !== undefined && (
        <div className="w-full h-1" style={{ background: '#e5e7eb' }}>
          <div
            className="h-full"
            style={{ width: `${video.progress}%`, background: GOLD }}
          />
        </div>
      )}

      {/* Info */}
      <CardContent className="pt-3 pb-4 flex flex-col gap-2 flex-1">
        <p className="text-sm font-semibold leading-snug" style={{ color: INDIGO }}>
          {video.title}
        </p>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: '#9ca3af' }}>
          <User size={11} />
          <span>{video.instructor}</span>
        </div>
        {video.progress !== undefined && (
          <p className="text-xs" style={{ color: '#9ca3af' }}>
            {video.progress}% watched
          </p>
        )}
        <Button
          className="mt-auto w-full text-xs font-semibold h-8"
          style={{
            background: isFirst ? GOLD : 'rgba(8,13,38,0.06)',
            color: isFirst ? '#fff' : INDIGO,
            border: 'none',
            borderRadius: '8px',
          }}
          onClick={() =>
            alert('Video streaming would start here — integrate with your video host')
          }
        >
          <Play size={12} />
          {isFirst ? 'Resume' : 'Play'}
        </Button>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                  */
/* ------------------------------------------------------------------ */

export default function StudioPage() {
  return (
    <div style={{ background: BG, minHeight: '100%' }} className="p-6 rounded-xl space-y-8">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: INDIGO, fontFamily: 'var(--font-bricolage, sans-serif)' }}
        >
          Studio &amp; Learning
        </h1>
        <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
          Production tutorials curated for regional and South Indian content creators.
        </p>
      </div>

      {/* Stats strip */}
      <div className="flex gap-4 flex-wrap">
        {[
          { label: 'Total Courses', value: '6' },
          { label: 'Hours of Content', value: '4.5 hrs' },
          { label: 'In Progress', value: '1' },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex items-center gap-2 px-4 py-2 rounded-xl"
            style={{ background: '#fff', border: '1px solid #f3f4f6' }}
          >
            <span className="text-base font-bold" style={{ color: GOLD }}>
              {value}
            </span>
            <span className="text-xs" style={{ color: '#6b7280' }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Category sections */}
      {CATEGORIES.map((cat) => (
        <div key={cat.label} className="space-y-3">
          {/* Section header */}
          <div className="flex items-center gap-2">
            <span className="text-xl">{cat.icon}</span>
            <h2 className="text-base font-bold" style={{ color: INDIGO }}>
              {cat.label}
            </h2>
            <Badge
              className="text-xs ml-1"
              style={{
                background: 'rgba(8,13,38,0.07)',
                color: INDIGO,
                border: 'none',
              }}
            >
              {cat.videos.length} videos
            </Badge>
          </div>

          {/* Video grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cat.videos.map((video, i) => (
              <VideoCard key={video.title} video={video} index={i} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
