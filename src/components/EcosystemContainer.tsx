import { useState } from 'react';
import EcosystemMap from './EcosystemMap';
import { EcosystemGrid } from './ecosystem/EcosystemGrid';
import type { GridListing } from './ecosystem/EcosystemGrid';

interface Props {
  validSlugs: string[];
  domainMap: Record<string, string>;
  gridListings: GridListing[];
}

export default function EcosystemContainer({ validSlugs, domainMap, gridListings }: Props) {
  const [view, setView] = useState<'graph' | 'grid'>('graph');

  return (
    <div>
      {/* View toggle */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex gap-0.5 rounded-lg border border-slate-800 bg-slate-900/50 p-0.5">
          <button
            onClick={() => setView('graph')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-[11px] font-medium transition-colors ${
              view === 'graph'
                ? 'bg-slate-800 text-white'
                : 'text-slate-600 hover:text-slate-400'
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="6" cy="6" r="3" />
              <circle cx="18" cy="18" r="3" />
              <circle cx="18" cy="6" r="3" />
              <line x1="8.5" y1="7.5" x2="15.5" y2="16.5" />
              <line x1="15.5" y1="7.5" x2="8.5" y2="16.5" />
            </svg>
            Bubble Map
          </button>
          <button
            onClick={() => setView('grid')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-[11px] font-medium transition-colors ${
              view === 'grid'
                ? 'bg-slate-800 text-white'
                : 'text-slate-600 hover:text-slate-400'
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
            Grid
          </button>
        </div>
        <span className="font-mono text-[10px] text-slate-700">
          {view === 'graph' ? 'Interactive connection map' : `${gridListings.length} tools across 6 ecosystems`}
        </span>
      </div>

      {/* View content */}
      {view === 'graph' ? (
        <EcosystemMap validSlugs={validSlugs} domainMap={domainMap} />
      ) : (
        <EcosystemGrid listings={gridListings} />
      )}
    </div>
  );
}
