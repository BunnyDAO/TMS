import { useState, useMemo } from 'react';

interface Listing {
  name: string;
  slug: string;
  tagline: string;
  category: string;
  subcategory: string;
  pricing: string;
  status: string;
  website?: string;
  github?: string;
}

interface Props {
  listings: Listing[];
  subcategories: Record<string, string>;
  categoryColor: string;
  categoryKey: string;
}

const statusBadges: Record<string, { label: string; className: string; dot: string }> = {
  hot: { label: 'HOT', className: 'border-red-500/20 text-red-400', dot: 'bg-red-500' },
  trending: { label: 'TRENDING', className: 'border-amber-400/20 text-amber-400', dot: 'bg-amber-400' },
  new: { label: 'NEW', className: 'border-green-400/20 text-green-400', dot: 'bg-green-400' },
  stable: { label: '', className: '', dot: '' },
};

const pricingBadges: Record<string, { label: string; className: string }> = {
  free: { label: 'free', className: 'border-green-500/20 text-green-500/60' },
  freemium: { label: 'freemium', className: 'border-blue-500/20 text-blue-500/60' },
  paid: { label: 'paid', className: 'border-orange-500/20 text-orange-500/60' },
  'open-source': { label: 'oss', className: 'border-purple-500/20 text-purple-500/60' },
};

const colorMap: Record<string, {
  pill: string;
  pillActive: string;
  border: string;
  borderHover: string;
  shadow: string;
  glow: string;
  text: string;
  dot: string;
}> = {
  violet: {
    pill: 'border-slate-800 text-slate-600 hover:border-violet-500/30 hover:text-violet-400',
    pillActive: 'border-violet-500/50 text-violet-400',
    border: 'border-violet-500/10',
    borderHover: 'hover:border-violet-500/30',
    shadow: 'hover:shadow-violet-500/10',
    glow: 'bg-violet-500',
    text: 'text-violet-400',
    dot: 'bg-violet-500',
  },
  orange: {
    pill: 'border-slate-800 text-slate-600 hover:border-orange-500/30 hover:text-orange-400',
    pillActive: 'border-orange-500/50 text-orange-400',
    border: 'border-orange-500/10',
    borderHover: 'hover:border-orange-500/30',
    shadow: 'hover:shadow-orange-500/10',
    glow: 'bg-orange-500',
    text: 'text-orange-400',
    dot: 'bg-orange-500',
  },
  blue: {
    pill: 'border-slate-800 text-slate-600 hover:border-blue-500/30 hover:text-blue-400',
    pillActive: 'border-blue-500/50 text-blue-400',
    border: 'border-blue-500/10',
    borderHover: 'hover:border-blue-500/30',
    shadow: 'hover:shadow-blue-500/10',
    glow: 'bg-blue-500',
    text: 'text-blue-400',
    dot: 'bg-blue-500',
  },
  teal: {
    pill: 'border-slate-800 text-slate-600 hover:border-teal-400/30 hover:text-teal-400',
    pillActive: 'border-teal-400/50 text-teal-400',
    border: 'border-teal-400/10',
    borderHover: 'hover:border-teal-400/30',
    shadow: 'hover:shadow-teal-400/10',
    glow: 'bg-teal-400',
    text: 'text-teal-400',
    dot: 'bg-teal-400',
  },
  emerald: {
    pill: 'border-slate-800 text-slate-600 hover:border-emerald-500/30 hover:text-emerald-400',
    pillActive: 'border-emerald-500/50 text-emerald-400',
    border: 'border-emerald-500/10',
    borderHover: 'hover:border-emerald-500/30',
    shadow: 'hover:shadow-emerald-500/10',
    glow: 'bg-emerald-500',
    text: 'text-emerald-400',
    dot: 'bg-emerald-500',
  },
  cyan: {
    pill: 'border-slate-800 text-slate-600 hover:border-cyan-500/30 hover:text-cyan-400',
    pillActive: 'border-cyan-500/50 text-cyan-400',
    border: 'border-cyan-500/10',
    borderHover: 'hover:border-cyan-500/30',
    shadow: 'hover:shadow-cyan-500/10',
    glow: 'bg-cyan-500',
    text: 'text-cyan-400',
    dot: 'bg-cyan-500',
  },
};

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
        alt=""
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

const initBgMap: Record<string, string> = {
  violet: 'bg-violet-500/20 text-violet-400',
  orange: 'bg-orange-500/20 text-orange-400',
  blue: 'bg-blue-500/20 text-blue-400',
  teal: 'bg-teal-400/20 text-teal-400',
  emerald: 'bg-emerald-500/20 text-emerald-400',
  cyan: 'bg-cyan-500/20 text-cyan-400',
};

export default function CategoryFilter({ listings, subcategories, categoryColor, categoryKey }: Props) {
  const [activeSub, setActiveSub] = useState<string | null>(null);
  const [activePricing, setActivePricing] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState<string | null>(null);

  const colors = colorMap[categoryColor] || colorMap.violet;

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      if (activeSub && l.subcategory !== activeSub) return false;
      if (activePricing && l.pricing !== activePricing) return false;
      if (activeStatus && l.status !== activeStatus) return false;
      return true;
    });
  }, [listings, activeSub, activePricing, activeStatus]);

  const pricingOptions = ['free', 'freemium', 'paid', 'open-source'];
  const statusOptions = ['hot', 'trending', 'new'];

  return (
    <div>
      {/* Subcategory pills */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        <button
          onClick={() => setActiveSub(null)}
          className={`rounded border px-2.5 py-1 font-mono text-[10px] font-medium transition-colors ${
            activeSub === null ? colors.pillActive : colors.pill
          }`}
        >
          all
        </button>
        {Object.entries(subcategories).map(([key, name]) => (
          <button
            key={key}
            onClick={() => setActiveSub(activeSub === key ? null : key)}
            className={`rounded border px-2.5 py-1 font-mono text-[10px] font-medium transition-colors ${
              activeSub === key ? colors.pillActive : colors.pill
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Filters row */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 font-mono text-[10px] text-slate-700">pricing:</span>
          <button
            onClick={() => setActivePricing(null)}
            className={`rounded border px-2 py-0.5 font-mono text-[10px] transition-colors ${
              activePricing === null
                ? 'border-slate-600 text-slate-400'
                : 'border-slate-800 text-slate-700 hover:text-slate-400'
            }`}
          >
            all
          </button>
          {pricingOptions.map((p) => (
            <button
              key={p}
              onClick={() => setActivePricing(activePricing === p ? null : p)}
              className={`rounded border px-2 py-0.5 font-mono text-[10px] transition-colors ${
                activePricing === p
                  ? pricingBadges[p].className
                  : 'border-slate-800 text-slate-700 hover:text-slate-400'
              }`}
            >
              {pricingBadges[p].label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 font-mono text-[10px] text-slate-700">status:</span>
          <button
            onClick={() => setActiveStatus(null)}
            className={`rounded border px-2 py-0.5 font-mono text-[10px] transition-colors ${
              activeStatus === null
                ? 'border-slate-600 text-slate-400'
                : 'border-slate-800 text-slate-700 hover:text-slate-400'
            }`}
          >
            all
          </button>
          {statusOptions.map((s) => (
            <button
              key={s}
              onClick={() => setActiveStatus(activeStatus === s ? null : s)}
              className={`rounded border px-2 py-0.5 font-mono text-[10px] transition-colors ${
                activeStatus === s
                  ? statusBadges[s].className
                  : 'border-slate-800 text-slate-700 hover:text-slate-400'
              }`}
            >
              {statusBadges[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div className="mb-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-800/50"></div>
        <span className="font-mono text-[10px] text-slate-700">
          {filtered.length} {filtered.length === 1 ? 'tool' : 'tools'}
        </span>
        <div className="h-px flex-1 bg-slate-800/50"></div>
      </div>

      {/* Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((listing) => {
          const status = statusBadges[listing.status];
          const pricing = pricingBadges[listing.pricing];
          const subName = subcategories[listing.subcategory] || listing.subcategory;

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
                    <LogoImg name={listing.name} website={listing.website} initClass={initBgMap[categoryColor] || initBgMap.violet} />
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
                  <span className={`font-mono text-[10px] ${colors.text}`}>{categoryKey === 'rwa' ? 'RWA' : categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1)}</span>
                  <span className="font-mono text-[10px] text-slate-700">/</span>
                  <span className="font-mono text-[10px] text-slate-600">{subName}</span>
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

      {filtered.length === 0 && (
        <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 py-12 text-center">
          <p className="font-mono text-xs text-slate-600">no tools match the current filters.</p>
          <button
            onClick={() => {
              setActiveSub(null);
              setActivePricing(null);
              setActiveStatus(null);
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
