import type { CategoryKey } from '../../data/categories';
import { CATEGORY_COLORS } from './types';

interface Props {
  categories: { key: CategoryKey; name: string; color: string }[];
  activeCategories: Set<string>;
  onToggleCategory: (category: string) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onReheat: () => void;
}

export function EcosystemControls({
  categories,
  activeCategories,
  onToggleCategory,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onReheat,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {/* Category filter pills */}
      <div className="flex flex-wrap gap-1.5">
        {categories.map((cat) => {
          const isActive = activeCategories.has(cat.key);
          const color = CATEGORY_COLORS[cat.key];
          return (
            <button
              key={cat.key}
              onClick={() => onToggleCategory(cat.key)}
              className="flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] font-medium transition-all"
              style={{
                backgroundColor: isActive ? `${color}15` : 'transparent',
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: isActive ? `${color}40` : 'rgba(51,65,85,0.3)',
                color: isActive ? color : 'rgba(100,116,139,0.6)',
              }}
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full transition-opacity"
                style={{
                  backgroundColor: color,
                  opacity: isActive ? 1 : 0.3,
                }}
              />
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Zoom controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={onReheat}
          className="rounded-lg border border-slate-800/50 px-2 py-1 font-mono text-[10px] text-slate-600 transition-colors hover:border-slate-700 hover:text-white"
          title="Re-simulate layout"
        >
          ↻
        </button>
        <button
          onClick={onZoomIn}
          className="rounded-lg border border-slate-800/50 px-2 py-1 font-mono text-[10px] text-slate-600 transition-colors hover:border-slate-700 hover:text-white"
          title="Zoom in"
        >
          +
        </button>
        <button
          onClick={onZoomOut}
          className="rounded-lg border border-slate-800/50 px-2 py-1 font-mono text-[10px] text-slate-600 transition-colors hover:border-slate-700 hover:text-white"
          title="Zoom out"
        >
          −
        </button>
        <button
          onClick={onResetZoom}
          className="rounded-lg border border-slate-800/50 px-2 py-1 font-mono text-[10px] text-slate-600 transition-colors hover:border-slate-700 hover:text-white"
          title="Reset view"
        >
          ⊡
        </button>
      </div>
    </div>
  );
}
