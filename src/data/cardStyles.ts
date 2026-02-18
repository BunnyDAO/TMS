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
  teal: { border: 'border-teal-400/10', borderHover: 'hover:border-teal-400/30', shadow: 'hover:shadow-teal-400/10', glow: 'bg-teal-400', text: 'text-teal-400', dot: 'bg-teal-400' },
  emerald: { border: 'border-emerald-500/10', borderHover: 'hover:border-emerald-500/30', shadow: 'hover:shadow-emerald-500/10', glow: 'bg-emerald-500', text: 'text-emerald-400', dot: 'bg-emerald-500' },
  cyan: { border: 'border-cyan-500/10', borderHover: 'hover:border-cyan-500/30', shadow: 'hover:shadow-cyan-500/10', glow: 'bg-cyan-500', text: 'text-cyan-400', dot: 'bg-cyan-500' },
};

/** Initial/fallback background for logo thumbnails */
export const initBgMap: Record<string, string> = {
  violet: 'bg-violet-500/20 text-violet-400',
  orange: 'bg-orange-500/20 text-orange-400',
  blue: 'bg-blue-500/20 text-blue-400',
  teal: 'bg-teal-400/20 text-teal-400',
  emerald: 'bg-emerald-500/20 text-emerald-400',
  cyan: 'bg-cyan-500/20 text-cyan-400',
};

/** Category badge colors for filter pills */
export const catBadgeColors: Record<string, string> = {
  violet: 'border-violet-500/30 text-violet-400',
  orange: 'border-orange-500/30 text-orange-400',
  blue: 'border-blue-500/30 text-blue-400',
  teal: 'border-teal-400/30 text-teal-400',
  emerald: 'border-emerald-500/30 text-emerald-400',
  cyan: 'border-cyan-500/30 text-cyan-400',
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
  teal: {
    border: 'border-teal-400/20',
    borderHover: 'hover:border-teal-400/50',
    bg: 'bg-teal-400/[0.03]',
    text: 'text-teal-400',
    shadow: 'hover:shadow-teal-400/20',
    glow: 'bg-teal-400',
    ring: 'ring-teal-400/20',
  },
  emerald: {
    border: 'border-emerald-500/20',
    borderHover: 'hover:border-emerald-500/50',
    bg: 'bg-emerald-500/[0.03]',
    text: 'text-emerald-400',
    shadow: 'hover:shadow-emerald-500/20',
    glow: 'bg-emerald-500',
    ring: 'ring-emerald-500/20',
  },
  cyan: {
    border: 'border-cyan-500/20',
    borderHover: 'hover:border-cyan-500/50',
    bg: 'bg-cyan-500/[0.03]',
    text: 'text-cyan-400',
    shadow: 'hover:shadow-cyan-500/20',
    glow: 'bg-cyan-500',
    ring: 'ring-cyan-500/20',
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
