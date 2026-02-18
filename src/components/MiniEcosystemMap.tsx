import { useMemo } from 'react';
import { nodes, edges } from '../data/ecosystemGraph';
import type { CategoryKey } from '../data/categories';
import { CATEGORY_COLORS, CATEGORY_CLUSTER_POSITIONS } from './ecosystem/types';
import { hashString, convexHull, smoothHullPath } from './ecosystem/hullUtils';

const VW = 1000;
const VH = 400;
const CX = VW / 2;
const CY = VH / 2;
const SPREAD = 0.35;

const TIER_RADII: Record<string, number> = {
  core: 4,
  major: 3,
  standard: 2.5,
  minor: 2,
};

const CATEGORY_LABELS: Record<string, string> = {
  ai: 'AI',
  bitcoin: 'Bitcoin',
  ethereum: 'Ethereum',
  solana: 'Solana',
  rwa: 'RWA',
  infra: 'Infra',
};

interface StaticNode {
  id: string;
  x: number;
  y: number;
  r: number;
  category: CategoryKey;
}

export default function MiniEcosystemMap() {
  const { staticNodes, staticEdges, regions, labels } = useMemo(() => {
    const categoryIndices = new Map<string, number>();

    const sNodes: StaticNode[] = nodes.map((n) => {
      const cluster = CATEGORY_CLUSTER_POSITIONS[n.category] ?? { x: 0, y: 0 };
      const idx = categoryIndices.get(n.category) ?? 0;
      categoryIndices.set(n.category, idx + 1);
      const hash = hashString(n.id);
      const angle = (hash / 0xffff) * Math.PI * 2;
      const radius = 15 + (idx * 6) % 40;

      return {
        id: n.id,
        x: CX + cluster.x * VW * SPREAD + Math.cos(angle) * radius,
        y: CY + cluster.y * VH * SPREAD + Math.sin(angle) * radius,
        r: TIER_RADII[n.tier] ?? 2,
        category: n.category as CategoryKey,
      };
    });

    const nodeMap = new Map(sNodes.map((n) => [n.id, n]));

    const sEdges = edges
      .map((e) => ({ source: nodeMap.get(e.source), target: nodeMap.get(e.target) }))
      .filter((e): e is { source: StaticNode; target: StaticNode } => !!e.source && !!e.target);

    // Compute hulls per category
    const grouped = new Map<string, StaticNode[]>();
    for (const n of sNodes) {
      const list = grouped.get(n.category) || [];
      list.push(n);
      grouped.set(n.category, list);
    }

    const regs: { category: string; path: string }[] = [];
    const labs: { category: string; x: number; y: number }[] = [];

    for (const [category, catNodes] of grouped) {
      if (catNodes.length < 3) continue;
      const points: [number, number][] = catNodes.map((n) => [n.x, n.y]);
      const hull = convexHull(points);
      if (hull.length < 3) continue;

      const padding = 25;
      const hcx = hull.reduce((s, p) => s + p[0], 0) / hull.length;
      const hcy = hull.reduce((s, p) => s + p[1], 0) / hull.length;
      const expanded = hull.map(([px, py]) => {
        const dx = px - hcx;
        const dy = py - hcy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const scale = (dist + padding) / dist;
        return [hcx + dx * scale, hcy + dy * scale] as [number, number];
      });

      regs.push({ category, path: smoothHullPath(expanded) });
      labs.push({ category, x: hcx, y: hcy });
    }

    return { staticNodes: sNodes, staticEdges: sEdges, regions: regs, labels: labs };
  }, []);

  return (
    <a
      href="/ecosystem"
      className="group relative block overflow-hidden rounded-xl border border-slate-800/50 bg-slate-950/80 transition-all hover:border-slate-700/50 hover:shadow-lg hover:shadow-violet-500/5"
    >
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        className="w-full min-h-[280px] sm:min-h-0"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {/* Region hulls */}
        {regions.map(({ category, path }) => {
          const color = CATEGORY_COLORS[category as CategoryKey];
          return (
            <path
              key={`r-${category}`}
              d={path}
              fill={`${color}08`}
              stroke={color}
              strokeWidth={0.8}
              strokeOpacity={0.15}
            />
          );
        })}

        {/* Edges */}
        {staticEdges.map((e, i) => (
          <line
            key={`e-${i}`}
            x1={e.source.x}
            y1={e.source.y}
            x2={e.target.x}
            y2={e.target.y}
            stroke="rgba(148,163,184,0.08)"
            strokeWidth={0.5}
          />
        ))}

        {/* Nodes */}
        {staticNodes.map((n) => (
          <circle
            key={n.id}
            cx={n.x}
            cy={n.y}
            r={n.r}
            fill={CATEGORY_COLORS[n.category]}
            opacity={0.6}
          />
        ))}

        {/* Category labels */}
        {labels.map(({ category, x, y }) => (
          <text
            key={`l-${category}`}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              fill: CATEGORY_COLORS[category as CategoryKey],
              opacity: 0.35,
              letterSpacing: '0.12em',
              textTransform: 'uppercase' as const,
            }}
          >
            {CATEGORY_LABELS[category] || category}
          </text>
        ))}
      </svg>

      {/* Gradient overlays */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950/90" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950/40 via-transparent to-slate-950/40" />

      {/* CTA overlay — below content on mobile, overlaid on desktop */}
      <div className="relative flex justify-center py-3 sm:absolute sm:inset-0 sm:items-end sm:py-0 sm:pb-5">
        <span className="inline-flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-900/80 px-4 py-2 font-mono text-xs font-medium text-slate-400 backdrop-blur-sm transition-all group-hover:border-violet-500/30 group-hover:text-white group-hover:shadow-lg group-hover:shadow-violet-500/10">
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <circle cx="4" cy="6" r="2" />
            <circle cx="20" cy="6" r="2" />
            <circle cx="4" cy="18" r="2" />
            <circle cx="20" cy="18" r="2" />
            <line x1="6" y1="7" x2="9" y2="10" />
            <line x1="18" y1="7" x2="15" y2="10" />
            <line x1="6" y1="17" x2="9" y2="14" />
            <line x1="18" y1="17" x2="15" y2="14" />
          </svg>
          Explore the ecosystem map
          <span className="transition-transform group-hover:translate-x-0.5">&rarr;</span>
        </span>
      </div>
    </a>
  );
}
