import { useEffect, useRef, useState, useCallback } from 'react';
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  forceX,
  forceY,
} from 'd3-force';
import type { Simulation, SimulationNodeDatum, SimulationLinkDatum } from 'd3-force';
import type { EcosystemNode, EcosystemEdge, SimNode, SimEdge } from './types';
import { TIER_SIZES, CATEGORY_CLUSTER_POSITIONS } from './types';

interface UseForceSimulationOptions {
  nodes: EcosystemNode[];
  edges: EcosystemEdge[];
  width: number;
  height: number;
  activeCategories: Set<string>;
}

interface UseForceSimulationResult {
  simNodes: SimNode[];
  simEdges: SimEdge[];
  isSettled: boolean;
  onDragStart: (nodeId: string) => void;
  onDrag: (nodeId: string, x: number, y: number) => void;
  onDragEnd: (nodeId: string) => void;
  reheat: () => void;
}

export function useForceSimulation({
  nodes,
  edges,
  width,
  height,
  activeCategories,
}: UseForceSimulationOptions): UseForceSimulationResult {
  const [simNodes, setSimNodes] = useState<SimNode[]>([]);
  const [simEdges, setSimEdges] = useState<SimEdge[]>([]);
  const [isSettled, setIsSettled] = useState(false);
  const simRef = useRef<Simulation<SimNode, SimEdge> | null>(null);
  const nodesRef = useRef<SimNode[]>([]);
  const edgesRef = useRef<SimEdge[]>([]);

  useEffect(() => {
    if (width === 0 || height === 0) return;

    const filteredNodes = nodes.filter((n) => activeCategories.has(n.category));
    const filteredNodeIds = new Set(filteredNodes.map((n) => n.id));
    const filteredEdges = edges.filter(
      (e) => filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target)
    );

    const CENTER_NODES = new Set(['wenrwa']);

    // Sort nodes within each category deterministically for consistent spread
    const categoryIndices = new Map<string, number>();

    const simNodeData: SimNode[] = filteredNodes.map((n) => {
      const existing = nodesRef.current.find((sn) => sn.id === n.id);
      const isCenter = CENTER_NODES.has(n.id);
      const cluster = isCenter ? { x: 0, y: 0 } : CATEGORY_CLUSTER_POSITIONS[n.category];

      // Deterministic offset based on node ID hash
      const idx = categoryIndices.get(n.category) ?? 0;
      categoryIndices.set(n.category, idx + 1);
      const hash = hashString(n.id);
      const angle = (hash / 0xFFFF) * Math.PI * 2;
      const radius = 20 + (idx * 8) % 50;

      return {
        ...n,
        x: existing?.x ?? width / 2 + cluster.x * width * 0.35 + Math.cos(angle) * radius,
        y: existing?.y ?? height / 2 + cluster.y * height * 0.35 + Math.sin(angle) * radius,
        vx: existing?.vx ?? 0,
        vy: existing?.vy ?? 0,
        fx: isCenter ? width / 2 : (existing?.fx ?? null),
        fy: isCenter ? height / 2 : (existing?.fy ?? null),
      };
    });

    const nodeMap = new Map(simNodeData.map((n) => [n.id, n]));
    const simEdgeData: SimEdge[] = filteredEdges
      .map((e) => ({
        source: nodeMap.get(e.source)!,
        target: nodeMap.get(e.target)!,
        type: e.type,
        label: e.label,
      }))
      .filter((e) => e.source && e.target);

    nodesRef.current = simNodeData;
    edgesRef.current = simEdgeData;
    setIsSettled(false);

    if (simRef.current) {
      simRef.current.stop();
    }

    const sim = forceSimulation<SimNode>(simNodeData)
      .force(
        'link',
        forceLink<SimNode, SimEdge>(simEdgeData)
          .id((d) => d.id)
          .distance(120)
          .strength(0.3)
      )
      .force('charge', forceManyBody<SimNode>().strength(-300).distanceMax(400))
      .force('center', forceCenter(width / 2, height / 2).strength(0.05))
      .force(
        'collide',
        forceCollide<SimNode>().radius((d) => TIER_SIZES[d.tier] + 6).strength(0.7)
      )
      .force(
        'clusterX',
        forceX<SimNode>()
          .x((d) => {
            if (CENTER_NODES.has(d.id)) return width / 2;
            return width / 2 + CATEGORY_CLUSTER_POSITIONS[d.category].x * width * 0.35;
          })
          .strength((d) => CENTER_NODES.has(d.id) ? 0.5 : 0.15)
      )
      .force(
        'clusterY',
        forceY<SimNode>()
          .y((d) => {
            if (CENTER_NODES.has(d.id)) return height / 2;
            return height / 2 + CATEGORY_CLUSTER_POSITIONS[d.category].y * height * 0.35;
          })
          .strength((d) => CENTER_NODES.has(d.id) ? 0.5 : 0.15)
      )
      .alphaDecay(0.035)
      .velocityDecay(0.4)
      .on('tick', () => {
        setSimNodes([...nodesRef.current]);
        setSimEdges([...edgesRef.current]);
      })
      .on('end', () => {
        setIsSettled(true);
      });

    simRef.current = sim;

    return () => {
      sim.stop();
    };
  }, [nodes, edges, width, height, activeCategories]);

  const onDragStart = useCallback((nodeId: string) => {
    const sim = simRef.current;
    if (!sim) return;
    sim.alphaTarget(0.3).restart();
    const node = nodesRef.current.find((n) => n.id === nodeId);
    if (node) {
      node.fx = node.x;
      node.fy = node.y;
    }
  }, []);

  const onDrag = useCallback((nodeId: string, x: number, y: number) => {
    const node = nodesRef.current.find((n) => n.id === nodeId);
    if (node) {
      node.fx = x;
      node.fy = y;
    }
  }, []);

  const onDragEnd = useCallback((nodeId: string) => {
    const sim = simRef.current;
    if (!sim) return;
    sim.alphaTarget(0);
    const node = nodesRef.current.find((n) => n.id === nodeId);
    if (node) {
      const CENTER_NODES = new Set(['wenrwa']);
      if (CENTER_NODES.has(node.id)) {
        // Snap back to center
        node.fx = node.x;
        node.fy = node.y;
      } else {
        node.fx = null;
        node.fy = null;
      }
    }
  }, []);

  const reheat = useCallback(() => {
    const sim = simRef.current;
    if (!sim) return;
    setIsSettled(false);
    sim.alpha(0.5).restart();
  }, []);

  return { simNodes, simEdges, isSettled, onDragStart, onDrag, onDragEnd, reheat };
}

/** Simple deterministic hash for a string → 0..0xFFFF */
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) & 0xFFFF;
  }
  return hash;
}
