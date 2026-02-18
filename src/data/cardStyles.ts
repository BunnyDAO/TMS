/** Card color styles used in ListingCard, SearchApp, and CategoryFilter */
export const cardColors: Record<string, {
  border: string;
  borderHover: string;
  shadow: string;
  glow: string;
  text: string;
  dot: string;
}> = {
  violet: { border: 'border-violet-500/10', borderHover: 'hover:border-violet-500/30', shadow: 'hover:shadow-violet-500/10', glow: 'bg-violet-500', text: 'text-violet-400', dot: 'bg-violet-500' },
  orange: { border: 'border-orange-500/10', borderHover: 'hover:border-orange-500/30', shadow: 'hover:shadow-orange-500/10', glow: 'bg-orange-500', text: 'text-orange-400', dot: 'bg-orange-500' },
  blue: { border: 'border-blue-500/10', borderHover: 'hover:border-blue-500/30', shadow: 'hover:shadow-blue-500/10', glow: 'bg-blue-500', text: 'text-blue-400', dot: 'bg-blue-500' },
  green: { border: 'border-green-400/10', borderHover: 'hover:border-green-400/30', shadow: 'hover:shadow-green-400/10', glow: 'bg-green-400', text: 'text-green-400', dot: 'bg-green-400' },
  rose: { border: 'border-rose-500/10', borderHover: 'hover:border-rose-500/30', shadow: 'hover:shadow-rose-500/10', glow: 'bg-rose-500', text: 'text-rose-400', dot: 'bg-rose-500' },
  slate: { border: 'border-slate-400/10', borderHover: 'hover:border-slate-400/30', shadow: 'hover:shadow-slate-400/10', glow: 'bg-slate-400', text: 'text-slate-400', dot: 'bg-slate-400' },
};

/** Initial/fallback background for logo thumbnails */
export const initBgMap: Record<string, string> = {
  violet: 'bg-violet-500/20 text-violet-400',
  orange: 'bg-orange-500/20 text-orange-400',
  blue: 'bg-blue-500/20 text-blue-400',
  green: 'bg-green-400/20 text-green-400',
  rose: 'bg-rose-500/20 text-rose-400',
  slate: 'bg-slate-400/20 text-slate-400',
};

/** Category badge colors for filter pills */
export const catBadgeColors: Record<string, string> = {
  violet: 'border-violet-500/30 text-violet-400',
  orange: 'border-orange-500/30 text-orange-400',
  blue: 'border-blue-500/30 text-blue-400',
  green: 'border-green-400/30 text-green-400',
  rose: 'border-rose-500/30 text-rose-400',
  slate: 'border-slate-400/30 text-slate-400',
};

/** Category card styles for index page category grid */
export const categoryCardStyles: Record<string, Record<string, string>> = {
  violet: {
    border: 'border-violet-500/20',
    borderHover: 'hover:border-violet-500/50',
    bg: 'bg-violet-500/[0.03]',
    text: 'text-violet-400',
    shadow: 'hover:shadow-violet-500/20',
    glow: 'bg-violet-500',
    ring: 'ring-violet-500/20',
  },
  orange: {
    border: 'border-orange-500/20',
    borderHover: 'hover:border-orange-500/50',
    bg: 'bg-orange-500/[0.03]',
    text: 'text-orange-400',
    shadow: 'hover:shadow-orange-500/20',
    glow: 'bg-orange-500',
    ring: 'ring-orange-500/20',
  },
  blue: {
    border: 'border-blue-500/20',
    borderHover: 'hover:border-blue-500/50',
    bg: 'bg-blue-500/[0.03]',
    text: 'text-blue-400',
    shadow: 'hover:shadow-blue-500/20',
    glow: 'bg-blue-500',
    ring: 'ring-blue-500/20',
  },
  green: {
    border: 'border-green-400/20',
    borderHover: 'hover:border-green-400/50',
    bg: 'bg-green-400/[0.03]',
    text: 'text-green-400',
    shadow: 'hover:shadow-green-400/20',
    glow: 'bg-green-400',
    ring: 'ring-green-400/20',
  },
  rose: {
    border: 'border-rose-500/20',
    borderHover: 'hover:border-rose-500/50',
    bg: 'bg-rose-500/[0.03]',
    text: 'text-rose-400',
    shadow: 'hover:shadow-rose-500/20',
    glow: 'bg-rose-500',
    ring: 'ring-rose-500/20',
  },
  slate: {
    border: 'border-slate-400/20',
    borderHover: 'hover:border-slate-400/50',
    bg: 'bg-slate-400/[0.03]',
    text: 'text-slate-400',
    shadow: 'hover:shadow-slate-400/20',
    glow: 'bg-slate-400',
    ring: 'ring-slate-400/20',
  },
};

/** CategoryFilter pill colors (includes pill/pillActive in addition to card colors) */
export const filterColorMap: Record<string, {
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
  green: {
    pill: 'border-slate-800 text-slate-600 hover:border-green-400/30 hover:text-green-400',
    pillActive: 'border-green-400/50 text-green-400',
    border: 'border-green-400/10',
    borderHover: 'hover:border-green-400/30',
    shadow: 'hover:shadow-green-400/10',
    glow: 'bg-green-400',
    text: 'text-green-400',
    dot: 'bg-green-400',
  },
  rose: {
    pill: 'border-slate-800 text-slate-600 hover:border-rose-500/30 hover:text-rose-400',
    pillActive: 'border-rose-500/50 text-rose-400',
    border: 'border-rose-500/10',
    borderHover: 'hover:border-rose-500/30',
    shadow: 'hover:shadow-rose-500/10',
    glow: 'bg-rose-500',
    text: 'text-rose-400',
    dot: 'bg-rose-500',
  },
  slate: {
    pill: 'border-slate-800 text-slate-600 hover:border-slate-400/30 hover:text-slate-400',
    pillActive: 'border-slate-400/50 text-slate-400',
    border: 'border-slate-400/10',
    borderHover: 'hover:border-slate-400/30',
    shadow: 'hover:shadow-slate-400/10',
    glow: 'bg-slate-400',
    text: 'text-slate-400',
    dot: 'bg-slate-400',
  },
};
