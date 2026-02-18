import type { SimNode, SimEdge } from './types';
import { CONNECTION_STYLES, CATEGORY_COLORS } from './types';

interface Props {
  node: SimNode | null;
  edges: SimEdge[];
  position: { x: number; y: number };
}

export function EcosystemTooltip({ node, edges, position }: Props) {
  if (!node) return null;

  const connections = edges.filter(
    (e) => e.source.id === node.id || e.target.id === node.id
  );

  return (
    <div
      className="pointer-events-none absolute z-50 w-64 rounded-lg border border-slate-700/50 bg-slate-900/95 p-3 shadow-xl backdrop-blur-sm"
      style={{
        left: position.x,
        top: position.y,
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

      <p className="mt-2 font-mono text-[9px] text-slate-700">tap again to view listing →</p>
    </div>
  );
}
