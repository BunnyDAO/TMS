import { useMemo } from 'react';
import { categories, categoryKeys } from '../../data/categories';
import type { CategoryKey } from '../../data/categories';

export interface GridListing {
  name: string;
  slug: string;
  category: CategoryKey;
  subcategory: string;
  website: string | null;
  status: 'hot' | 'trending' | 'new' | 'stable';
}

interface Props {
  listings: GridListing[];
}

const STATUS_PRIORITY: Record<string, number> = {
  hot: 0,
  trending: 1,
  new: 2,
  stable: 3,
};

const PANEL_STYLES: Record<string, { border: string; headerBg: string; text: string }> = {
  violet: { border: 'border-violet-500/20', headerBg: 'bg-violet-500/10', text: 'text-violet-400' },
  orange: { border: 'border-orange-500/20', headerBg: 'bg-orange-500/10', text: 'text-orange-400' },
  blue: { border: 'border-blue-500/20', headerBg: 'bg-blue-500/10', text: 'text-blue-400' },
  green: { border: 'border-green-400/20', headerBg: 'bg-green-400/10', text: 'text-green-400' },
  rose: { border: 'border-rose-500/20', headerBg: 'bg-rose-500/10', text: 'text-rose-400' },
  slate: { border: 'border-slate-400/20', headerBg: 'bg-slate-400/10', text: 'text-slate-400' },
};

function getDomain(website: string | null): string | null {
  if (!website) return null;
  try {
    return new URL(website).hostname;
  } catch {
    return null;
  }
}

export function EcosystemGrid({ listings }: Props) {
  const grouped = useMemo(() => {
    const map = new Map<CategoryKey, Map<string, GridListing[]>>();

    for (const key of categoryKeys) {
      map.set(key, new Map());
    }

    for (const listing of listings) {
      const catMap = map.get(listing.category);
      if (!catMap) continue;
      const arr = catMap.get(listing.subcategory) ?? [];
      arr.push(listing);
      catMap.set(listing.subcategory, arr);
    }

    // Sort listings within each subcategory
    for (const catMap of map.values()) {
      for (const [key, arr] of catMap.entries()) {
        arr.sort((a, b) => {
          const sp = (STATUS_PRIORITY[a.status] ?? 3) - (STATUS_PRIORITY[b.status] ?? 3);
          if (sp !== 0) return sp;
          return a.name.localeCompare(b.name);
        });
        catMap.set(key, arr);
      }
    }

    return map;
  }, [listings]);

  return (
    <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
      {categoryKeys.map((catKey) => {
        const cat = categories[catKey];
        const style = PANEL_STYLES[cat.color];
        const subcatMap = grouped.get(catKey);
        if (!subcatMap || subcatMap.size === 0) return null;

        const totalCount = Array.from(subcatMap.values()).reduce((s, a) => s + a.length, 0);
        const subcatEntries = Object.entries(cat.subcategories).filter(
          ([key]) => subcatMap.has(key) && subcatMap.get(key)!.length > 0
        );

        return (
          <div
            key={catKey}
            className={`rounded-xl border ${style.border} bg-slate-950/50 overflow-hidden`}
          >
            {/* Panel header */}
            <div className={`${style.headerBg} px-4 py-3`}>
              <div className="flex items-center justify-between">
                <p className={`font-mono text-xs font-bold uppercase tracking-[0.2em] ${style.text}`}>
                  // {cat.name}
                </p>
                <span className="font-mono text-[10px] text-slate-600">{totalCount}</span>
              </div>
              <p className="font-mono text-[10px] italic text-slate-500">{cat.tagline}</p>
            </div>

            {/* Subcategory sections */}
            <div className="space-y-4 p-4">
              {subcatEntries.map(([subKey, subLabel]) => {
                const items = subcatMap.get(subKey)!;
                return (
                  <div key={subKey}>
                    <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                      {subLabel}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {items.map((item) => {
                        const domain = getDomain(item.website);
                        return (
                          <a
                            key={item.slug}
                            href={`/listings/${item.slug}`}
                            className={`group flex items-center gap-1.5 rounded-md border border-slate-800/50 bg-slate-900/50 px-2 py-1 font-mono text-[11px] text-slate-400 transition-colors hover:border-slate-700 hover:text-white`}
                          >
                            {domain ? (
                              <img
                                src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
                                alt=""
                                width={14}
                                height={14}
                                className="shrink-0 rounded-sm"
                                loading="lazy"
                              />
                            ) : (
                              <span className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-sm text-[8px] font-bold ${style.text} opacity-50`}>
                                {item.name.charAt(0)}
                              </span>
                            )}
                            {item.name}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
