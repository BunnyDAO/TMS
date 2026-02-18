import { useEffect, useRef, useCallback, useState } from 'react';
import { select } from 'd3-selection';
import { zoom, zoomIdentity, type ZoomBehavior } from 'd3-zoom';

interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

interface UseZoomPanOptions {
  minZoom?: number;
  maxZoom?: number;
  /** Pre-computed bounds to set the initial transform before first render */
  initialBounds?: Bounds | null;
  /** Viewport dimensions needed for initial fit calculation */
  viewportWidth?: number;
  viewportHeight?: number;
}

interface UseZoomPanResult {
  transform: { x: number; y: number; k: number };
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  fitToView: (bounds: Bounds, animated?: boolean) => void;
  setSvgEl: (el: SVGSVGElement | null) => void;
}

/** Compute the zoom transform that fits bounds into a viewport */
function computeFitTransform(
  bounds: Bounds,
  viewW: number,
  viewH: number,
  padding = 60
): { x: number; y: number; k: number } {
  const bw = bounds.maxX - bounds.minX + padding * 2;
  const bh = bounds.maxY - bounds.minY + padding * 2;
  const scale = Math.min(viewW / bw, viewH / bh, 1);
  const cx = (bounds.minX + bounds.maxX) / 2;
  const cy = (bounds.minY + bounds.maxY) / 2;
  return {
    x: viewW / 2 - cx * scale,
    y: viewH / 2 - cy * scale,
    k: scale,
  };
}

export function useZoomPan({
  minZoom = 0.3,
  maxZoom = 3,
  initialBounds = null,
  viewportWidth = 0,
  viewportHeight = 0,
}: UseZoomPanOptions = {}): UseZoomPanResult {
  // Compute initial transform synchronously so the first render is already fitted
  const initialTransform =
    initialBounds && viewportWidth > 0 && viewportHeight > 0
      ? computeFitTransform(initialBounds, viewportWidth, viewportHeight)
      : { x: 0, y: 0, k: 1 };

  const [transform, setTransform] = useState(initialTransform);
  const [svgEl, setSvgEl] = useState<SVGSVGElement | null>(null);
  const zoomBehaviorRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const hasAppliedInitialRef = useRef(false);

  useEffect(() => {
    if (!svgEl) return;

    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([minZoom, maxZoom])
      .filter((event) => !event.button)
      .on('zoom', (event) => {
        const t = event.transform;
        setTransform({ x: t.x, y: t.y, k: t.k });
      });

    zoomBehaviorRef.current = zoomBehavior;
    const selection = select(svgEl);
    selection.call(zoomBehavior);

    // Apply initial bounds immediately (no transition) on first mount
    if (initialBounds && viewportWidth > 0 && viewportHeight > 0 && !hasAppliedInitialRef.current) {
      const fit = computeFitTransform(initialBounds, viewportWidth, viewportHeight);
      const t = zoomIdentity.translate(fit.x, fit.y).scale(fit.k);
      selection.call(zoomBehavior.transform, t);
      hasAppliedInitialRef.current = true;
    }

    return () => {
      selection.on('.zoom', null);
      zoomBehaviorRef.current = null;
    };
  }, [svgEl, minZoom, maxZoom, initialBounds, viewportWidth, viewportHeight]);

  const zoomIn = useCallback(() => {
    if (!svgEl || !zoomBehaviorRef.current) return;
    select(svgEl)
      .transition()
      .duration(300)
      .call(zoomBehaviorRef.current.scaleBy, 1.4);
  }, [svgEl]);

  const zoomOut = useCallback(() => {
    if (!svgEl || !zoomBehaviorRef.current) return;
    select(svgEl)
      .transition()
      .duration(300)
      .call(zoomBehaviorRef.current.scaleBy, 0.7);
  }, [svgEl]);

  const resetZoom = useCallback(() => {
    if (!svgEl || !zoomBehaviorRef.current) return;
    select(svgEl)
      .transition()
      .duration(500)
      .call(zoomBehaviorRef.current.transform, zoomIdentity);
  }, [svgEl]);

  const fitToView = useCallback(
    (bounds: Bounds, animated = true) => {
      if (!svgEl || !zoomBehaviorRef.current) return;
      const width = svgEl.clientWidth;
      const height = svgEl.clientHeight;
      if (width === 0 || height === 0) return;

      const fit = computeFitTransform(bounds, width, height);
      const t = zoomIdentity.translate(fit.x, fit.y).scale(fit.k);

      if (animated) {
        select(svgEl)
          .transition()
          .duration(600)
          .call(zoomBehaviorRef.current.transform, t);
      } else {
        select(svgEl).call(zoomBehaviorRef.current.transform, t);
      }
    },
    [svgEl]
  );

  return { transform, zoomIn, zoomOut, resetZoom, fitToView, setSvgEl };
}
