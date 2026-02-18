export const statusBadges: Record<string, { label: string; className: string; dot: string }> = {
  hot: { label: 'HOT', className: 'border-red-500/20 text-red-400', dot: 'bg-red-500' },
  trending: { label: 'TRENDING', className: 'border-amber-400/20 text-amber-400', dot: 'bg-amber-400' },
  new: { label: 'NEW', className: 'border-green-400/20 text-green-400', dot: 'bg-green-400' },
  stable: { label: '', className: '', dot: '' },
};

export const pricingBadges: Record<string, { label: string; className: string }> = {
  free: { label: 'free', className: 'border-green-500/20 text-green-500/60' },
  freemium: { label: 'freemium', className: 'border-blue-500/20 text-blue-500/60' },
  paid: { label: 'paid', className: 'border-orange-500/20 text-orange-500/60' },
  'open-source': { label: 'oss', className: 'border-purple-500/20 text-purple-500/60' },
};
