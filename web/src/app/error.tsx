'use client';

import { useEffect } from 'react';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Check if the error is due to a missing/outdated JavaScript chunk
    const isChunkError = 
      error.message?.includes('ChunkLoadError') || 
      error.message?.includes('Failed to fetch dynamically imported module') ||
      error.message?.includes('loading chunk');

    if (isChunkError) {
      console.warn('Next.js ChunkLoadError detected. Reloading page to fetch the new build...');
      window.location.reload();
    } else {
      console.error('Unhandled app error:', error);
    }
  }, [error]);

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center"
      style={{ background: '#080D26', color: '#F0EBE0' }}
    >
      <div className="space-y-4 max-w-md">
        <h2 className="text-2xl font-bold tracking-tight font-bricolage text-[#C9A84C]">
          Connection Refreshed
        </h2>
        <p className="text-sm text-gray-400 leading-relaxed">
          The SICE network has been updated. If the page does not reload automatically, click below to refresh.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-[#C9A84C] hover:bg-[#b0913b] text-slate-950 font-bold rounded-full text-xs uppercase tracking-wider transition-all duration-200"
          style={{ border: 'none', cursor: 'pointer' }}
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}
