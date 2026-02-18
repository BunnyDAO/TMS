import { useRef, useLayoutEffect, useState } from 'react';
import type { SimNode, SimEdge } from './types';
import { CONNECTION_STYLES, CATEGORY_COLORS } from './types';

interface Props {
  node: SimNode | null;
  edges: SimEdge[];
  position: { x: number; y: number };
  isMobile: boolean;
  containerHeight: number;
  containerWidth: number;
}

export function EcosystemTooltip({ node, edges, position, isMobile, containerHeight, containerWidth }: Props) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [adjustedPos, setAdjustedPos] = useState(position);

  useLayoutEffect(() => {
    if (!node || !tooltipRef.current) return;
    const el = tooltipRef.current;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const pad = 8;

    if (isMobile) {
      // Mobile: center horizontally, comfortably below the top edge
      setAdjustedPos({
        x: Math.max(pad, (containerWidth - w) / 2),
        y: 24,
      });
    } else {
      // Desktop: position near cursor, clamped to container bounds
      let x = position.x;
      let y = position.y;
      if (x + w > containerWidth - pad) x = containerWidth - w - pad;
      if (x < pad) x = pad;
      if (y + h > containerHeight - pad) y = containerHeight - h - pad;
      if (y < pad) y = pad;
      setAdjustedPos({ x, y });
    }
  }, [node, position, isMobile, containerHeight, containerWidth]);

  if (!node) return null;

  const connections = edges.filter(
    (e) => e.source.id === node.id || e.target.id === node.id
  );

  return (
    <div
      ref={tooltipRef}
      className="pointer-events-none absolute z-50 w-64 rounded-lg border border-slate-700/50 bg-slate-900/95 p-3 shadow-xl backdrop-blur-sm"
      style={{
        left: adjustedPos.x,
        top: adjustedPos.y,
      }}
    >
      <div className="mb-2 flex items-center gap-2">
        <span
          className="inline-block h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: CATEGORY_COLORS[node.category] }}
        />
        <span className="font-mono text-sm font-bold text-white">{node.name}</span>
      </div>

      {node.tagline && (
        <p className="mb-2 font-mono text-[10px] text-slate-400">{node.tagline}</p>
      )}

      {connections.length > 0 && (
        <div className="border-t border-slate-800 pt-2">
          <p className="mb-1.5 font-mono text-[9px] font-bold uppercase tracking-widest text-slate-600">
            // connections ({connections.length})
          </p>
          <ul className="space-y-1">
            {connections.slice(0, 6).map((edge, i) => {
              const other = edge.source.id === node.id ? edge.target : edge.source;
              const style = CONNECTION_STYLES[edge.type];
              return (
                <li
                  key={i}
                  className="flex items-center gap-1.5 font-mono text-[10px] text-slate-500"
                >
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: style.color }}
                  />
                  <span className="text-slate-300">{other.name}</span>
                  <span className="text-slate-700">—</span>
                  <span>{edge.label || style.label}</span>
                </li>
              );
            })}
            {connections.length > 6 && (
              <li className="font-mono text-[10px] text-slate-600">
                +{connections.length - 6} more
              </li>
            )}
          </ul>
        </div>
      )}

      <p className="mt-2 font-mono text-[9px] text-slate-700">
        {isMobile ? 'tap again to view listing →' : 'click to view listing →'}
      </p>
    </div>
  );
}
