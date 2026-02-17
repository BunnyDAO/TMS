import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { nodes as allNodes, edges as allEdges } from '../data/ecosystemGraph';
import type { CategoryKey } from '../data/categories';
import type { SimNode, SimEdge } from './ecosystem/types';
import { TIER_SIZES, CONNECTION_STYLES, CATEGORY_COLORS } from './ecosystem/types';
import { useForceSimulation } from './ecosystem/useForceSimulation';
import { useZoomPan } from './ecosystem/useZoomPan';
import { EcosystemControls } from './ecosystem/EcosystemControls';
import { EcosystemTooltip } from './ecosystem/EcosystemTooltip';
import { EcosystemLegend } from './ecosystem/EcosystemLegend';

interface Props {
  validSlugs: string[];
  domainMap: Record<string, string>;
}

const CATEGORIES: { key: CategoryKey; name: string; color: string }[] = [
  { key: 'ai', name: 'AI', color: 'violet' },
  { key: 'bitcoin', name: 'Bitcoin', color: 'orange' },
  { key: 'ethereum', name: 'Ethereum', color: 'blue' },
  { key: 'solana', name: 'Solana', color: 'teal' },
  { key: 'rwa', name: 'RWA', color: 'emerald' },
  { key: 'infra', name: 'Infra', color: 'cyan' },
];

export default function EcosystemMap({ validSlugs, domainMap }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [activeCategories, setActiveCategories] = useState<Set<string>>(
    new Set(CATEGORIES.map((c) => c.key))
  );
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  const validSlugSet = useMemo(() => new Set(validSlugs), [validSlugs]);
  const nodes = useMemo(
    () => allNodes.filter((n) => validSlugSet.has(n.id)),
    [validSlugSet]
  );
  const edges = useMemo(
    () =>
      allEdges.filter(
        (e) => validSlugSet.has(e.source) && validSlugSet.has(e.target)
      ),
    [validSlugSet]
  );

  // Measure container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setDimensions({
        width: container.clientWidth,
        height: mobile ? 600 : 800,
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Force simulation
  const { simNodes, simEdges, onDragStart, onDrag, onDragEnd, reheat } =
    useForceSimulation({
      nodes,
      edges,
      width: dimensions.width,
      height: dimensions.height,
      activeCategories,
    });

  // Zoom/pan — hook returns a callback ref setter
  const { transform: zoomTransform, zoomIn, zoomOut, resetZoom, setSvgEl } = useZoomPan();

  // Store SVG element for coordinate conversion
  const svgElRef = useRef<SVGSVGElement | null>(null);
  const svgCallbackRef = useCallback(
    (el: SVGSVGElement | null) => {
      svgElRef.current = el;
      setSvgEl(el);
    },
    [setSvgEl]
  );

  const handleToggleCategory = useCallback((category: string) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        if (next.size > 1) next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }, []);

  const handleHoverNode = useCallback(
    (nodeId: string | null, event?: { clientX: number; clientY: number }) => {
      setHoveredNode(nodeId);
      if (event && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        let x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        if (x + 280 > rect.width) x = x - 280;
        setTooltipPos({ x, y });
      }
    },
    []
  );

  const handleClickNode = useCallback(
    (nodeId: string) => {
      if (validSlugSet.has(nodeId)) {
        window.location.href = `/listings/${nodeId}`;
      }
    },
    [validSlugSet]
  );

  // Compute highlight sets
  const connectedNodes = useMemo(() => {
    const set = new Set<string>();
    if (!hoveredNode) return set;
    set.add(hoveredNode);
    simEdges.forEach((edge) => {
      if (edge.source.id === hoveredNode || edge.target.id === hoveredNode) {
        set.add(edge.source.id);
        set.add(edge.target.id);
      }
    });
    return set;
  }, [hoveredNode, simEdges]);

  const connectedEdgeIndices = useMemo(() => {
    const set = new Set<number>();
    if (!hoveredNode) return set;
    simEdges.forEach((edge, i) => {
      if (edge.source.id === hoveredNode || edge.target.id === hoveredNode) {
        set.add(i);
      }
    });
    return set;
  }, [hoveredNode, simEdges]);

  // Drag state
  const dragRef = useRef<{
    nodeId: string;
    startX: number;
    startY: number;
    hasMoved: boolean;
  } | null>(null);

  const { x: tx, y: ty, k: tk } = zoomTransform;

  const screenToSvg = useCallback(
    (clientX: number, clientY: number) => {
      const svg = svgElRef.current;
      if (!svg) return { x: 0, y: 0 };
      const rect = svg.getBoundingClientRect();
      return {
        x: (clientX - rect.left - tx) / tk,
        y: (clientY - rect.top - ty) / tk,
      };
    },
    [tx, ty, tk]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, nodeId: string) => {
      e.stopPropagation();
      (e.target as Element).setPointerCapture(e.pointerId);
      dragRef.current = {
        nodeId,
        startX: e.clientX,
        startY: e.clientY,
        hasMoved: false,
      };
      onDragStart(nodeId);
    },
    [onDragStart]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) drag.hasMoved = true;
      const pos = screenToSvg(e.clientX, e.clientY);
      onDrag(drag.nodeId, pos.x, pos.y);
    },
    [onDrag, screenToSvg]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      (e.target as Element).releasePointerCapture(e.pointerId);
      onDragEnd(drag.nodeId);
      if (!drag.hasMoved) handleClickNode(drag.nodeId);
      dragRef.current = null;
    },
    [onDragEnd, handleClickNode]
  );

  return (
    <div className="relative" ref={containerRef}>
      {/* Controls */}
      <div className="mb-4 space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <EcosystemControls
            categories={CATEGORIES}
            activeCategories={activeCategories}
            onToggleCategory={handleToggleCategory}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onResetZoom={resetZoom}
            onReheat={reheat}
          />
          <EcosystemLegend />
        </div>
        <div className="flex gap-4 font-mono text-[10px] text-slate-700">
          <span>{simNodes.length} nodes</span>
          <span>{simEdges.length} connections</span>
          <span className="hidden sm:inline">drag nodes · scroll to zoom · click to view</span>
        </div>
      </div>

      {/* Canvas */}
      <div
        className="relative overflow-hidden rounded-xl border border-slate-800/50 bg-slate-950/50"
        style={{ height: dimensions.height || 800 }}
      >
        {dimensions.width > 0 && (
          <svg
            ref={svgCallbackRef}
            width={dimensions.width}
            height={dimensions.height}
            className="cursor-grab active:cursor-grabbing"
            style={{ touchAction: 'none' }}
          >
            <defs>
              {simNodes.map((node) => {
                const r = TIER_SIZES[node.tier] / 2;
                return (
                  <clipPath key={`clip-${node.id}`} id={`clip-${node.id}`}>
                    <circle cx={0} cy={0} r={r - 1} />
                  </clipPath>
                );
              })}
            </defs>
            <g transform={`translate(${tx},${ty}) scale(${tk})`}>
              {/* Edges */}
              {simEdges.map((edge, i) => {
                const style = CONNECTION_STYLES[edge.type];
                const isHighlighted = connectedEdgeIndices.has(i);
                const opacity = !hoveredNode ? 0.4 : isHighlighted ? 0.8 : 0.04;

                return (
                  <g key={`e-${i}`}>
                    <line
                      x1={edge.source.x}
                      y1={edge.source.y}
                      x2={edge.target.x}
                      y2={edge.target.y}
                      stroke={style.color}
                      strokeWidth={isHighlighted ? 2 : 1}
                      strokeDasharray={style.stroke === 'dashed' ? '6,4' : undefined}
                      opacity={opacity}
                      className={style.animated ? 'edge-flow' : undefined}
                    />
                    {hoveredNode && isHighlighted && !isMobile && edge.label && (
                      <text
                        x={(edge.source.x + edge.target.x) / 2}
                        y={(edge.source.y + edge.target.y) / 2 - 6}
                        textAnchor="middle"
                        className="pointer-events-none select-none"
                        style={{
                          fontSize: '8px',
                          fontFamily: 'var(--font-mono)',
                          fill: 'rgba(148,163,184,0.6)',
                        }}
                      >
                        {edge.label}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Nodes */}
              {simNodes.map((node) => {
                const r = TIER_SIZES[node.tier] / 2;
                const color = CATEGORY_COLORS[node.category];
                const isHovered = hoveredNode === node.id;
                const opacity = !hoveredNode ? 1 : connectedNodes.has(node.id) ? 1 : 0.12;
                const showLabel = !isMobile || isHovered;
                const domain = domainMap[node.id];

                return (
                  <g key={node.id} style={{ opacity, transition: 'opacity 0.2s' }}>
                    {isHovered && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={r + 8}
                        fill="none"
                        stroke={color}
                        strokeWidth="1"
                        opacity="0.3"
                        className="node-pulse"
                      />
                    )}
                    {/* Background circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={r}
                      fill={domain ? 'rgba(15,23,42,0.9)' : `${color}20`}
                      stroke={color}
                      strokeWidth={isHovered ? 2 : 1}
                      className="cursor-pointer"
                      onPointerDown={(e) => handlePointerDown(e, node.id)}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      onPointerEnter={(e) =>
                        handleHoverNode(node.id, {
                          clientX: e.clientX,
                          clientY: e.clientY,
                        })
                      }
                      onPointerLeave={() => handleHoverNode(null)}
                    />
                    {/* Favicon logo */}
                    {domain && (
                      <g
                        transform={`translate(${node.x},${node.y})`}
                        clipPath={`url(#clip-${node.id})`}
                        className="pointer-events-none"
                      >
                        <image
                          href={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`}
                          x={-r + 1}
                          y={-r + 1}
                          width={(r - 1) * 2}
                          height={(r - 1) * 2}
                          preserveAspectRatio="xMidYMid slice"
                        />
                      </g>
                    )}
                    {/* Fallback letter for nodes without favicon */}
                    {!domain && (
                      <text
                        x={node.x}
                        y={node.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="pointer-events-none select-none"
                        style={{ fontSize: `${r * 0.8}px`, fill: color, opacity: 0.5 }}
                      >
                        {node.name.charAt(0)}
                      </text>
                    )}
                    {showLabel && (
                      <text
                        x={node.x}
                        y={node.y + r + 12}
                        textAnchor="middle"
                        className="pointer-events-none select-none"
                        style={{
                          fontSize:
                            node.tier === 'core'
                              ? '11px'
                              : node.tier === 'major'
                                ? '10px'
                                : '9px',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: node.tier === 'core' ? 700 : 500,
                          fill: 'rgba(148,163,184,0.7)',
                        }}
                      >
                        {node.name}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>
        )}

        {/* Tooltip */}
        <EcosystemTooltip
          node={simNodes.find((n) => n.id === hoveredNode) ?? null}
          edges={simEdges}
          position={tooltipPos}
        />
      </div>
    </div>
  );
}
