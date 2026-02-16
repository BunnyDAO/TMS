import { useEffect, useRef, useCallback, useState } from 'react';
import { select } from 'd3-selection';
import { zoom, zoomIdentity, type ZoomBehavior } from 'd3-zoom';

interface UseZoomPanResult {
  transform: { x: number; y: number; k: number };
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setSvgEl: (el: SVGSVGElement | null) => void;
}

export function useZoomPan(minZoom = 0.3, maxZoom = 3): UseZoomPanResult {
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const [svgEl, setSvgEl] = useState<SVGSVGElement | null>(null);
  const zoomBehaviorRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  useEffect(() => {
    if (!svgEl) return;

    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([minZoom, maxZoom])
      .filter((event) => {
        // Allow wheel events and pointer events that aren't on nodes
        // Nodes handle their own pointer events via stopPropagation
        return !event.button;
      })
      .on('zoom', (event) => {
        const t = event.transform;
        setTransform({ x: t.x, y: t.y, k: t.k });
      });

    zoomBehaviorRef.current = zoomBehavior;
    const selection = select(svgEl);
    selection.call(zoomBehavior);

    return () => {
      selection.on('.zoom', null);
      zoomBehaviorRef.current = null;
    };
  }, [svgEl, minZoom, maxZoom]);

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

  return { transform, zoomIn, zoomOut, resetZoom, setSvgEl };
}
