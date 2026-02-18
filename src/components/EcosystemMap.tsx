import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { nodes as allNodes, edges as allEdges } from '../data/ecosystemGraph';
import type { CategoryKey } from '../data/categories';
import type { SimNode, SimEdge } from './ecosystem/types';
import { TIER_SIZES, CONNECTION_STYLES, CATEGORY_COLORS, CATEGORY_CLUSTER_POSITIONS } from './ecosystem/types';
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
  { key: 'solana', name: 'Solana', color: 'green' },
  { key: 'rwa', name: 'RWA', color: 'rose' },
  { key: 'infra', name: 'Infra', color: 'slate' },
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
  const { simNodes, simEdges, isSettled, onDragStart, onDrag, onDragEnd, reheat } =
    useForceSimulation({
      nodes,
      edges,
      width: dimensions.width,
      height: dimensions.height,
      activeCategories,
    });

  // Compute expected bounds from cluster positions so initial zoom fits all content
  const expectedBounds = useMemo(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return null;
    const { width: w, height: h } = dimensions;
    const cx = w / 2;
    const cy = h / 2;
    // Node spread (~120px) + hull padding (45px) + text labels (20px) + extra breathing room
    const margin = 250;
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const pos of Object.values(CATEGORY_CLUSTER_POSITIONS)) {
      const x = cx + pos.x * w * 0.35;
      const y = cy + pos.y * h * 0.35;
      if (x - margin < minX) minX = x - margin;
      if (x + margin > maxX) maxX = x + margin;
      if (y - margin < minY) minY = y - margin;
      if (y + margin + 20 > maxY) maxY = y + margin + 20; // extra for bottom labels
    }
    return { minX, minY, maxX, maxY };
  }, [dimensions]);

  // Zoom/pan — initial transform pre-fitted to expected bounds
  const { transform: zoomTransform, zoomIn, zoomOut, resetZoom, fitToView, setSvgEl } = useZoomPan({
    initialBounds: expectedBounds,
    viewportWidth: dimensions.width,
    viewportHeight: dimensions.height,
  });

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
        const tooltipW = 260; // w-64 = 256px
        const tooltipH = 200; // approximate max height
        let x = event.clientX - rect.left + 16;
        let y = event.clientY - rect.top - 8;
        // Clamp to keep tooltip fully within the container
        if (x + tooltipW > rect.width) x = rect.width - tooltipW - 8;
        if (x < 8) x = 8;
        if (y + tooltipH > rect.height) y = rect.height - tooltipH - 8;
        if (y < 8) y = 8;
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

  // Compute category region hulls (smooth boundary around each cluster)
  const categoryRegions = useMemo(() => {
    if (simNodes.length === 0 || dimensions.width === 0) return [];

    const grouped = new Map<string, SimNode[]>();
    for (const node of simNodes) {
      if (!activeCategories.has(node.category)) continue;
      const list = grouped.get(node.category) || [];
      list.push(node);
      grouped.set(node.category, list);
    }

    const regions: { category: string; path: string }[] = [];

    for (const [category, catNodes] of grouped) {
      if (catNodes.length < 3) continue;

      const points: [number, number][] = catNodes.map(n => [n.x, n.y]);
      const hull = convexHull(points);
      if (hull.length < 3) continue;

      const padding = 45;
      const cx = hull.reduce((s, p) => s + p[0], 0) / hull.length;
      const cy = hull.reduce((s, p) => s + p[1], 0) / hull.length;

      const expanded = hull.map(([px, py]) => {
        const dx = px - cx;
        const dy = py - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const scale = (dist + padding) / dist;
        return [cx + dx * scale, cy + dy * scale] as [number, number];
      });

      const path = smoothHullPath(expanded);
      regions.push({ category, path });
    }

    return regions;
  }, [simNodes, activeCategories, dimensions.width]);

  // Region labels: compute ONCE when simulation settles, then lock in place
  const [regionLabels, setRegionLabels] = useState<{ category: string; x: number; y: number }[]>([]);

  useEffect(() => {
    // Clear labels when simulation is active (unsettled)
    if (!isSettled) {
      setRegionLabels([]);
      return;
    }

    // Compute label positions once at settle time
    if (simNodes.length === 0 || dimensions.width === 0) return;

    const grouped = new Map<string, SimNode[]>();
    for (const node of simNodes) {
      if (!activeCategories.has(node.category)) continue;
      const list = grouped.get(node.category) || [];
      list.push(node);
      grouped.set(node.category, list);
    }

    const labels: { category: string; x: number; y: number }[] = [];

    for (const [category, catNodes] of grouped) {
      if (catNodes.length < 3) continue;

      const points: [number, number][] = catNodes.map(n => [n.x, n.y]);
      const hull = convexHull(points);
      if (hull.length < 3) continue;

      const hcx = hull.reduce((s, p) => s + p[0], 0) / hull.length;
      const hcy = hull.reduce((s, p) => s + p[1], 0) / hull.length;

      // Grid-sample candidate positions inside the expanded hull
      const padding = 45;
      const expanded = hull.map(([px, py]) => {
        const dx = px - hcx;
        const dy = py - hcy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const scale = (dist + padding) / dist;
        return [hcx + dx * scale, hcy + dy * scale] as [number, number];
      });

      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      for (const [px, py] of expanded) {
        if (px < minX) minX = px;
        if (px > maxX) maxX = px;
        if (py < minY) minY = py;
        if (py > maxY) maxY = py;
      }

      const step = 25;
      const candidates: [number, number][] = [];
      for (let gx = minX; gx <= maxX; gx += step) {
        for (let gy = minY; gy <= maxY; gy += step) {
          if (pointInPolygon(gx, gy, expanded)) {
            candidates.push([gx, gy]);
          }
        }
      }
      candidates.push([hcx, hcy]);
      if (candidates.length === 0) continue;

      // Build obstacle list: each node's circle AND its text label below
      const obstacles: { x: number; y: number; hw: number; hh: number }[] = [];
      for (const node of simNodes) {
        const r = TIER_SIZES[node.tier] / 2;
        obstacles.push({ x: node.x, y: node.y, hw: r + 6, hh: r + 6 });
        const nodeLabelHW = node.name.length * 3 + 6;
        obstacles.push({ x: node.x, y: node.y + r + 12, hw: nodeLabelHW, hh: 8 });
      }

      const labelText = CATEGORY_LABELS[category] || category;
      const mobile = dimensions.width < 768;
      const regionLabelHW = labelText.length * (mobile ? 4 : 5.8) + 4;
      const regionLabelHH = mobile ? 8 : 11;

      // Viewport bounds: keep labels fully visible within the expected visible area
      // The zoom fits expectedBounds into the viewport, so clamp to that range
      const { width: vw, height: vh } = dimensions;
      const viewMargin = 250; // matches expectedBounds margin
      const viewMinX = vw / 2 - Math.max(...Object.values(CATEGORY_CLUSTER_POSITIONS).map(p => Math.abs(p.x))) * vw * 0.35 - viewMargin;
      const viewMaxX = vw / 2 + Math.max(...Object.values(CATEGORY_CLUSTER_POSITIONS).map(p => Math.abs(p.x))) * vw * 0.35 + viewMargin;
      const viewMinY = vh / 2 - Math.max(...Object.values(CATEGORY_CLUSTER_POSITIONS).map(p => Math.abs(p.y))) * vh * 0.35 - viewMargin;
      const viewMaxY = vh / 2 + Math.max(...Object.values(CATEGORY_CLUSTER_POSITIONS).map(p => Math.abs(p.y))) * vh * 0.35 + viewMargin;

      let bestCandidate = candidates[0];
      let bestMinDist = -Infinity;

      for (const [cx, cy] of candidates) {
        // Skip candidates where the label would extend outside the visible area
        if (cx - regionLabelHW < viewMinX || cx + regionLabelHW > viewMaxX) continue;
        if (cy - regionLabelHH < viewMinY || cy + regionLabelHH > viewMaxY) continue;

        let minDist = Infinity;
        for (const obs of obstacles) {
          const gapX = Math.max(0, Math.abs(cx - obs.x) - obs.hw - regionLabelHW);
          const gapY = Math.max(0, Math.abs(cy - obs.y) - obs.hh - regionLabelHH);
          const dist = Math.sqrt(gapX * gapX + gapY * gapY);
          if (dist < minDist) minDist = dist;
        }
        if (minDist > bestMinDist) {
          bestMinDist = minDist;
          bestCandidate = [cx, cy];
        }
      }

      // Final clamp: ensure the label text stays within visible bounds
      bestCandidate = [
        Math.max(viewMinX + regionLabelHW, Math.min(viewMaxX - regionLabelHW, bestCandidate[0])),
        Math.max(viewMinY + regionLabelHH, Math.min(viewMaxY - regionLabelHH, bestCandidate[1])),
      ];

      labels.push({ category, x: bestCandidate[0], y: bestCandidate[1] });
    }

    setRegionLabels(labels);
  // Only run when isSettled changes — NOT on every simNodes tick
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSettled]);

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

  // Mobile: track which node has its tooltip showing from a previous tap
  const mobileSelectedRef = useRef<string | null>(null);

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
      if (!drag.hasMoved) {
        if (isMobile) {
          // Mobile: first tap shows tooltip, second tap (same node) navigates
          if (mobileSelectedRef.current === drag.nodeId) {
            // Second tap on same node — navigate
            mobileSelectedRef.current = null;
            handleClickNode(drag.nodeId);
          } else {
            // First tap — show tooltip, remember this node
            mobileSelectedRef.current = drag.nodeId;
            handleHoverNode(drag.nodeId, { clientX: e.clientX, clientY: e.clientY });
          }
        } else {
          handleClickNode(drag.nodeId);
        }
      }
      dragRef.current = null;
    },
    [onDragEnd, handleClickNode, handleHoverNode, isMobile]
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
              {/* Category Region Boundaries */}
              {categoryRegions.map(({ category, path }) => {
                const color = CATEGORY_COLORS[category as CategoryKey];
                return (
                  <path
                    key={`region-${category}`}
                    d={path}
                    fill={`${color}0a`}
                    stroke={color}
                    strokeWidth={1}
                    strokeOpacity={0.2}
                    className="pointer-events-none"
                  />
                );
              })}

              {/* Category Region Labels — fade in after simulation settles */}
              {isSettled && regionLabels.map(({ category, x, y }) => {
                const color = CATEGORY_COLORS[category as CategoryKey];
                return (
                  <text
                    key={`label-${category}`}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    className="pointer-events-none select-none region-label-enter"
                    style={{
                      fontSize: isMobile ? '11px' : '16px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      fill: color,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {CATEGORY_LABELS[category] || category}
                  </text>
                );
              })}

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
          isMobile={isMobile}
          containerHeight={dimensions.height}
          containerWidth={dimensions.width}
        />
      </div>
    </div>
  );
}

// ─── Convex Hull (Andrew's monotone chain) ───────────────────

function convexHull(points: [number, number][]): [number, number][] {
  const pts = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (pts.length <= 2) return pts;

  const cross = (o: [number, number], a: [number, number], b: [number, number]) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);

  const lower: [number, number][] = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0)
      lower.pop();
    lower.push(p);
  }

  const upper: [number, number][] = [];
  for (const p of pts.reverse()) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0)
      upper.pop();
    upper.push(p);
  }

  lower.pop();
  upper.pop();
  return lower.concat(upper);
}

// ─── Smooth hull path using cubic Catmull-Rom → Bezier ───────

function smoothHullPath(hull: [number, number][]): string {
  const n = hull.length;
  if (n < 3) return '';

  const parts: string[] = [];
  parts.push(`M ${hull[0][0]},${hull[0][1]}`);

  for (let i = 0; i < n; i++) {
    const p0 = hull[(i - 1 + n) % n];
    const p1 = hull[i];
    const p2 = hull[(i + 1) % n];
    const p3 = hull[(i + 2) % n];

    // Catmull-Rom to cubic bezier control points
    const tension = 6; // higher = smoother
    const cp1x = p1[0] + (p2[0] - p0[0]) / tension;
    const cp1y = p1[1] + (p2[1] - p0[1]) / tension;
    const cp2x = p2[0] - (p3[0] - p1[0]) / tension;
    const cp2y = p2[1] - (p3[1] - p1[1]) / tension;

    parts.push(`C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2[0]},${p2[1]}`);
  }

  parts.push('Z');
  return parts.join(' ');
}

// ─── Point-in-polygon (ray casting) ──────────────────────────

function pointInPolygon(x: number, y: number, polygon: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

const CATEGORY_LABELS: Record<string, string> = {
  ai: 'AI',
  bitcoin: 'Bitcoin',
  ethereum: 'Ethereum',
  solana: 'Solana',
  rwa: 'RWA',
  infra: 'Infrastructure',
};
