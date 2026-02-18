import { useState } from 'react';
import { CONNECTION_STYLES } from './types';
import type { ConnectionType } from './types';

const legendEntries: { type: ConnectionType; description: string }[] = [
  { type: 'aggregates',      description: 'Routes through / aggregates liquidity' },
  { type: 'oracle',          description: 'Provides price or data feeds' },
  { type: 'infrastructure',  description: 'Wallets, RPCs, dev tools, MEV, analytics' },
  { type: 'graduation',      description: 'Token launches graduate to' },
  { type: 'composability',   description: 'DeFi composability (collateral, pairs)' },
  { type: 'bridge',          description: 'Cross-chain bridging' },
  { type: 'staking',         description: 'Staking / restaking relationship' },
  { type: 'powers',          description: 'AI model powers a tool' },
  { type: 'competes',        description: 'Direct competitors in same space' },
];

export function EcosystemLegend() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 rounded-lg border border-slate-800/50 px-3 py-1.5 font-mono text-[10px] text-slate-600 transition-colors hover:border-slate-700 hover:text-white"
      >
        <span className="inline-block h-3 w-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
        </span>
        legend
        <span className="text-slate-700">{isOpen ? '▴' : '▾'}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-40 mt-2 w-72 rounded-lg border border-slate-700/50 bg-slate-900/95 p-3 shadow-xl backdrop-blur-sm">
          <p className="mb-2 font-mono text-[9px] font-bold uppercase tracking-widest text-slate-600">
            // connection types
          </p>
          <ul className="space-y-1.5">
            {legendEntries.map(({ type, description }) => {
              const style = CONNECTION_STYLES[type];
              return (
                <li key={type} className="flex items-center gap-2">
                  <svg width="28" height="8" className="shrink-0">
                    <line
                      x1="0"
                      y1="4"
                      x2="28"
                      y2="4"
                      stroke={style.color}
                      strokeWidth="2"
                      strokeDasharray={style.stroke === 'dashed' ? '4,3' : 'none'}
                    />
                  </svg>
                  <span className="font-mono text-[10px]">
                    <span style={{ color: style.color }}>{style.label}</span>
                    <span className="text-slate-600"> — {description}</span>
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mt-3 border-t border-slate-800 pt-2">
            <p className="mb-1.5 font-mono text-[9px] font-bold uppercase tracking-widest text-slate-600">
              // node sizes
            </p>
            <div className="space-y-1">
              {[
                { label: 'Core', desc: 'Ecosystem pillars', r: 12 },
                { label: 'Major', desc: 'Key players', r: 9 },
                { label: 'Standard', desc: 'Established tools', r: 7 },
                { label: 'Minor', desc: 'Supporting tools', r: 5 },
              ].map(({ label, desc, r }) => (
                <div key={label} className="flex items-center gap-2">
                  <svg width={28} height={r * 2 + 4} className="shrink-0 flex justify-center">
                    <circle
                      cx={14}
                      cy={r + 2}
                      r={r}
                      fill="rgba(148,163,184,0.1)"
                      stroke="rgba(148,163,184,0.3)"
                      strokeWidth="1"
                    />
                  </svg>
                  <span className="font-mono text-[10px]">
                    <span className="text-slate-400">{label}</span>
                    <span className="text-slate-600"> — {desc}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
