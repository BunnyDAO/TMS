import type { CategoryKey } from '../../data/categories';

export type NodeTier = 'core' | 'major' | 'standard' | 'minor';

export type ConnectionType =
  | 'aggregates'
  | 'oracle'
  | 'mev'
  | 'graduation'
  | 'wallet'
  | 'infrastructure'
  | 'composability'
  | 'bridge'
  | 'staking'
  | 'powers'
  | 'competes';

export interface EcosystemNode {
  id: string;           // matches listing slug
  name: string;
  category: CategoryKey;
  tier: NodeTier;
  tagline?: string;
}

export interface EcosystemEdge {
  source: string;       // node id
  target: string;       // node id
  type: ConnectionType;
  label?: string;       // e.g. "routes through"
}

export interface ConnectionStyle {
  color: string;        // CSS color
  stroke: 'solid' | 'dashed';
  animated: boolean;
  label: string;        // human-readable type name
}

export interface SimNode extends EcosystemNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx: number | null;
  fy: number | null;
}

export interface SimEdge {
  source: SimNode;
  target: SimNode;
  type: ConnectionType;
  label?: string;
}

export const TIER_SIZES: Record<NodeTier, number> = {
  core: 32,
  major: 24,
  standard: 18,
  minor: 14,
};

export const CONNECTION_STYLES: Record<ConnectionType, ConnectionStyle> = {
  aggregates:      { color: '#2dd4bf', stroke: 'solid',  animated: true,  label: 'Aggregates' },
  oracle:          { color: '#a78bfa', stroke: 'dashed', animated: false, label: 'Oracle Feed' },
  mev:             { color: '#f87171', stroke: 'dashed', animated: true,  label: 'MEV Protection' },
  graduation:      { color: '#fbbf24', stroke: 'solid',  animated: true,  label: 'Graduation' },
  wallet:          { color: '#6b7280', stroke: 'dashed', animated: false, label: 'Wallet Access' },
  infrastructure:  { color: '#22d3ee', stroke: 'dashed', animated: false, label: 'Infrastructure' },
  composability:   { color: '#34d399', stroke: 'solid',  animated: false, label: 'Composability' },
  bridge:          { color: '#f472b6', stroke: 'solid',  animated: true,  label: 'Bridge' },
  staking:         { color: '#818cf8', stroke: 'solid',  animated: false, label: 'Staking' },
  powers:          { color: '#6b7280', stroke: 'dashed', animated: false, label: 'Powers' },
  competes:        { color: '#ef4444', stroke: 'dashed', animated: false, label: 'Competes' },
};

export const CATEGORY_COLORS: Record<CategoryKey, string> = {
  ai: '#8b5cf6',
  bitcoin: '#f97316',
  ethereum: '#3b82f6',
  solana: '#2dd4bf',
  rwa: '#10b981',
  infra: '#06b6d4',
};

export const CATEGORY_CLUSTER_POSITIONS: Record<CategoryKey, { x: number; y: number }> = {
  ai:       { x: -0.3, y: -0.5 },
  bitcoin:  { x:  0.3, y: -0.5 },
  infra:    { x: -0.5, y:  0.0 },
  ethereum: { x:  0.5, y:  0.0 },
  rwa:      { x: -0.3, y:  0.5 },
  solana:   { x:  0.3, y:  0.5 },
};
