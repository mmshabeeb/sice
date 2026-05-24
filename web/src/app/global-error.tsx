'use client';

import { useEffect } from 'react';

export default function GlobalError({
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
      console.warn('Next.js ChunkLoadError detected in GlobalError. Reloading page...');
      window.location.reload();
    } else {
      console.error('Global unhandled error:', error);
    }
  }, [error]);

  return (
    <html lang="en">
      <body 
        className="flex flex-col items-center justify-center min-h-screen px-6 text-center"
        style={{ 
          background: '#080D26', 
          color: '#F0EBE0', 
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          margin: 0
        }}
      >
        <div className="space-y-4 max-w-md">
          <h2 className="text-2xl font-bold tracking-tight text-[#C9A84C]">
            Connection Refreshed
          </h2>
          <p className="text-sm text-[#F0EBE0]/60 leading-relaxed">
            The SICE network has been updated. If the page does not reload automatically, click below to refresh.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-[#C9A84C] hover:bg-[#b0913b] text-slate-950 font-bold rounded-full text-xs uppercase tracking-wider transition-all duration-200"
            style={{ 
              border: 'none', 
              cursor: 'pointer', 
              outline: 'none',
              padding: '10px 24px',
              backgroundColor: '#C9A84C',
              color: '#080D26',
              fontWeight: 'bold',
              borderRadius: '9999px',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            Reload Page
          </button>
        </div>
      </body>
    </html>
  );
}
