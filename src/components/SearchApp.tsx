import { useState, useMemo, useEffect } from 'react';
import Fuse from 'fuse.js';
import type { Listing } from '../types/listing';
import { statusBadges, pricingBadges } from '../data/badges';
import { cardColors, initBgMap, catBadgeColors } from '../data/cardStyles';

interface CategoryInfo {
  name: string;
  icon: string;
  color: string;
}

interface Props {
  listings: Listing[];
  categories: Record<string, CategoryInfo>;
  initialQuery?: string;
}

function getDomain(url?: string): string {
  if (!url) return '';
  try { return new URL(url).hostname; } catch { return ''; }
}

function LogoImg({ name, website, initClass }: { name: string; website?: string; initClass: string }) {
  const domain = getDomain(website);
  const faviconUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : '';

  if (!faviconUrl) {
    return (
      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded font-mono text-[10px] font-bold ${initClass}`}>
        {name.charAt(0)}
      </span>
    );
  }

  return (
    <span className="relative h-5 w-5 shrink-0">
      <img
        src={faviconUrl}
        alt={`${name} logo`}
        className="h-5 w-5 rounded"
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
          const fb = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
          if (fb) fb.style.display = 'flex';
        }}
      />
      <span className={`absolute inset-0 hidden items-center justify-center rounded font-mono text-[10px] font-bold ${initClass}`}>
        {name.charAt(0)}
      </span>
    </span>
  );
}

export default function SearchApp({ listings, categories, initialQuery = '' }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [pricingFilter, setPricingFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const fuse = useMemo(
    () =>
      new Fuse(listings, {
        keys: [
          { name: 'name', weight: 2 },
          { name: 'tagline', weight: 1.5 },
          { name: 'description', weight: 1 },
          { name: 'tags', weight: 1.5 },
          { name: 'subcategory', weight: 0.5 },
        ],
        threshold: 0.35,
        includeScore: true,
      }),
    [listings]
  );

  const results = useMemo(() => {
    let items: Listing[];

    if (query.trim()) {
      items = fuse.search(query).map((r) => r.item);
    } else {
      items = [...listings].sort((a, b) => {
        const order = { hot: 0, trending: 1, new: 2, stable: 3 };
        return (order[a.status as keyof typeof order] ?? 3) - (order[b.status as keyof typeof order] ?? 3);
      });
    }

    return items.filter((l) => {
      if (categoryFilter && l.category !== categoryFilter) return false;
      if (pricingFilter && l.pricing !== pricingFilter) return false;
      if (statusFilter && l.status !== statusFilter) return false;
      return true;
    });
  }, [query, categoryFilter, pricingFilter, statusFilter, fuse, listings]);

  // Sync URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) setQuery(q);
  }, []);

  const categoryKeys = Object.keys(categories);

  return (
    <div>
      {/* Search input */}
      <div className="relative mb-6">
        <svg className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search tools..."
          className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-12 pr-10 font-mono text-sm text-white placeholder-slate-700 outline-none backdrop-blur-sm transition-colors focus:border-slate-700 focus:ring-1 focus:ring-slate-700"
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs text-slate-700 hover:text-white"
          >
            [x]
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 font-mono text-[10px] text-slate-700">category:</span>
          <button
            onClick={() => setCategoryFilter(null)}
            className={`rounded border px-2 py-0.5 font-mono text-[10px] transition-colors ${
              categoryFilter === null
                ? 'border-slate-600 text-slate-400'
                : 'border-slate-800 text-slate-700 hover:text-slate-400'
            }`}
          >
            all
          </button>
          {categoryKeys.map((key) => {
            const cat = categories[key];
            const badge = catBadgeColors[cat.color] || catBadgeColors.violet;
            return (
              <button
                key={key}
                onClick={() => setCategoryFilter(categoryFilter === key ? null : key)}
                className={`rounded border px-2 py-0.5 font-mono text-[10px] transition-colors ${
                  categoryFilter === key ? badge : 'border-slate-800 text-slate-700 hover:text-slate-400'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 font-mono text-[10px] text-slate-700">pricing:</span>
          <button
            onClick={() => setPricingFilter(null)}
            className={`rounded border px-2 py-0.5 font-mono text-[10px] transition-colors ${
              pricingFilter === null
                ? 'border-slate-600 text-slate-400'
                : 'border-slate-800 text-slate-700 hover:text-slate-400'
            }`}
          >
            all
          </button>
          {Object.entries(pricingBadges).map(([key, badge]) => (
            <button
              key={key}
              onClick={() => setPricingFilter(pricingFilter === key ? null : key)}
              className={`rounded border px-2 py-0.5 font-mono text-[10px] transition-colors ${
                pricingFilter === key ? badge.className : 'border-slate-800 text-slate-700 hover:text-slate-400'
              }`}
            >
              {badge.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 font-mono text-[10px] text-slate-700">status:</span>
          <button
            onClick={() => setStatusFilter(null)}
            className={`rounded border px-2 py-0.5 font-mono text-[10px] transition-colors ${
              statusFilter === null
                ? 'border-slate-600 text-slate-400'
                : 'border-slate-800 text-slate-700 hover:text-slate-400'
            }`}
          >
            all
          </button>
          {['hot', 'trending', 'new'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(statusFilter === s ? null : s)}
              className={`rounded border px-2 py-0.5 font-mono text-[10px] transition-colors ${
                statusFilter === s
                  ? statusBadges[s].className
                  : 'border-slate-800 text-slate-700 hover:text-slate-400'
              }`}
            >
              {statusBadges[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="mb-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-800/50"></div>
        <span className="font-mono text-[10px] text-slate-700">
          {results.length} {results.length === 1 ? 'result' : 'results'}
          {query.trim() ? ` for "${query}"` : ''}
        </span>
        <div className="h-px flex-1 bg-slate-800/50"></div>
      </div>

      {/* Results grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((listing) => {
          const cat = categories[listing.category];
          const status = statusBadges[listing.status];
          const pricing = pricingBadges[listing.pricing];
          const colors = cardColors[cat?.color] || cardColors.violet;

          return (
            <a
              key={listing.slug}
              href={`/listings/${listing.slug}`}
              className={`group relative flex flex-col overflow-hidden rounded-xl border bg-slate-900/50 p-5 backdrop-blur-sm transition-all duration-200 hover:shadow-lg ${colors.border} ${colors.borderHover} ${colors.shadow}`}
              style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease' }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {/* Corner glow */}
              <div className={`absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-0 blur-2xl transition-opacity group-hover:opacity-20 ${colors.glow}`}></div>

              <div className="relative">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <LogoImg name={listing.name} website={listing.website} initClass={initBgMap[cat?.color] || initBgMap.violet} />
                    <h3 className="font-mono text-sm font-bold tracking-tight text-white">{listing.name}</h3>
                  </div>
                  {status.label && (
                    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-[10px] font-bold tracking-wide ${status.className}`}>
                      <span className={`inline-block h-1 w-1 rounded-full ${status.dot}`}></span>
                      {status.label}
                    </span>
                  )}
                </div>

                <div className="mb-3 flex items-center gap-2">
                  <span className={`inline-block h-1 w-1 rounded-full ${colors.dot}`}></span>
                  <span className={`font-mono text-[10px] ${colors.text}`}>{cat?.name}</span>
                </div>

                <p className="mb-4 flex-1 text-xs leading-relaxed text-slate-500">{listing.tagline}</p>

                <div className="flex items-center justify-between">
                  <span className={`rounded border px-1.5 py-0.5 font-mono text-[10px] ${pricing.className}`}>
                    {pricing.label}
                  </span>
                  <div className="flex items-center gap-2 font-mono text-[10px] text-slate-700">
                    {listing.website && <span className="transition-colors group-hover:text-slate-500">web</span>}
                    {listing.github && <span className="transition-colors group-hover:text-slate-500">git</span>}
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {results.length === 0 && (
        <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 py-12 text-center">
          <p className="font-mono text-xs text-slate-600">no results found.</p>
          <button
            onClick={() => {
              setQuery('');
              setCategoryFilter(null);
              setPricingFilter(null);
              setStatusFilter(null);
            }}
            className="mt-3 font-mono text-xs text-slate-500 underline decoration-slate-700 hover:text-white"
          >
            clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
