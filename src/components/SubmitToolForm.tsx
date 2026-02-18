import { useState, useMemo } from 'react';

interface Props {
  existingTools: { slug: string; name: string; category: string }[];
  repoOwner: string;
  repoName: string;
}

const CATEGORIES = [
  { key: 'ai', name: 'AI', subcategories: ['llms', 'coding', 'image', 'video', 'audio', 'agents', 'local', 'hardware', 'apps'] },
  { key: 'bitcoin', name: 'Bitcoin', subcategories: ['wallets', 'lightning', 'layer2', 'defi', 'ordinals', 'payments', 'mining'] },
  { key: 'ethereum', name: 'Ethereum', subcategories: ['layer2', 'defi-lending', 'defi-dex', 'staking', 'wallets', 'dev-tools', 'identity', 'stablecoins'] },
  { key: 'solana', name: 'Solana', subcategories: ['dex', 'defi', 'staking', 'wallets', 'nfts', 'meme', 'dev-tools', 'blinks'] },
  { key: 'rwa', name: 'Real World Assets', subcategories: ['treasuries', 'credit', 'real-estate', 'commodities', 'analytics'] },
  { key: 'infra', name: 'Infrastructure', subcategories: ['bridges', 'oracles', 'analytics', 'ai-crypto', 'ai-agents'] },
];

const CONNECTION_TYPES = [
  { key: 'aggregates', label: 'Aggregates / routes through' },
  { key: 'oracle', label: 'Oracle / data feed' },
  { key: 'wallet', label: 'Wallet access' },
  { key: 'infrastructure', label: 'Infrastructure / tooling' },
  { key: 'composability', label: 'Composability (collateral, pairs, hosts)' },
  { key: 'bridge', label: 'Bridge / cross-chain' },
  { key: 'staking', label: 'Staking / restaking' },
  { key: 'powers', label: 'Powers / runs on' },
  { key: 'mev', label: 'MEV protection' },
  { key: 'graduation', label: 'Graduation (launches to)' },
];

interface Connection {
  toolSlug: string;
  type: string;
  label: string;
}

export default function SubmitToolForm({ existingTools, repoOwner, repoName }: Props) {
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [customSubcategory, setCustomSubcategory] = useState('');
  const [pricing, setPricing] = useState('');
  const [connections, setConnections] = useState<Connection[]>([]);
  const [connSearch, setConnSearch] = useState('');
  const [connType, setConnType] = useState('composability');
  const [connLabel, setConnLabel] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const isOtherCategory = category === 'other';
  const selectedCategory = CATEGORIES.find((c) => c.key === category);

  const filteredTools = useMemo(() => {
    if (!connSearch.trim()) return [];
    const q = connSearch.toLowerCase();
    return existingTools
      .filter(
        (t) =>
          t.name.toLowerCase().includes(q) &&
          !connections.some((c) => c.toolSlug === t.slug)
      )
      .slice(0, 8);
  }, [connSearch, existingTools, connections]);

  const addConnection = (tool: { slug: string; name: string }) => {
    setConnections((prev) => [
      ...prev,
      { toolSlug: tool.slug, type: connType, label: connLabel || tool.name },
    ]);
    setConnSearch('');
    setConnLabel('');
  };

  const removeConnection = (slug: string) => {
    setConnections((prev) => prev.filter((c) => c.toolSlug !== slug));
  };

  const buildIssueUrl = () => {
    const connectionLines = connections.length
      ? connections
          .map(
            (c) =>
              `- **${existingTools.find((t) => t.slug === c.toolSlug)?.name || c.toolSlug}** — ${CONNECTION_TYPES.find((ct) => ct.key === c.type)?.label || c.type}${c.label ? ` (${c.label})` : ''}`
          )
          .join('\n')
      : '_None specified_';

    const title = `[Tool Submission] ${name}`;
    const body = `## Tool Submission

**Name:** ${name}
**Website:** ${website}
**Tagline:** ${tagline}
**Category:** ${isOtherCategory ? customCategory : (selectedCategory?.name || category)}
**Subcategory:** ${isOtherCategory ? customSubcategory : subcategory}
**Pricing:** ${pricing}

### Description
${description}

### Ecosystem Connections
${connectionLines}

---
_Submitted via toomuch.sh/submit_`;

    const params = new URLSearchParams({
      title,
      body,
      labels: 'tool-submission',
    });

    return `https://github.com/${repoOwner}/${repoName}/issues/new?${params.toString()}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = buildIssueUrl();
    window.open(url, '_blank');
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
        <p className="font-mono text-lg font-bold text-emerald-400">submission opened</p>
        <p className="mt-2 font-mono text-xs text-slate-500">
          A GitHub issue should have opened in a new tab. Sign in to GitHub and click "Submit new issue" to complete your submission.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setName('');
            setWebsite('');
            setTagline('');
            setDescription('');
            setCategory('');
            setCustomCategory('');
            setSubcategory('');
            setCustomSubcategory('');
            setPricing('');
            setConnections([]);
          }}
          className="mt-4 rounded-lg border border-slate-700 px-4 py-2 font-mono text-xs text-slate-400 transition-colors hover:border-slate-600 hover:text-white"
        >
          submit another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name + Website */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-widest text-slate-600">
            // tool name *
          </label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Jupiter"
            className="w-full rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2 font-mono text-sm text-white placeholder-slate-700 outline-none transition-colors focus:border-slate-600"
          />
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-widest text-slate-600">
            // website *
          </label>
          <input
            required
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://"
            className="w-full rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2 font-mono text-sm text-white placeholder-slate-700 outline-none transition-colors focus:border-slate-600"
          />
        </div>
      </div>

      {/* Tagline */}
      <div>
        <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-widest text-slate-600">
          // tagline *
        </label>
        <input
          required
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder="One-liner describing what it does"
          maxLength={120}
          className="w-full rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2 font-mono text-sm text-white placeholder-slate-700 outline-none transition-colors focus:border-slate-600"
        />
        <p className="mt-1 font-mono text-[10px] text-slate-700">{tagline.length}/120</p>
      </div>

      {/* Description */}
      <div>
        <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-widest text-slate-600">
          // description *
        </label>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What does this tool do? Why is it notable?"
          rows={4}
          className="w-full resize-none rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2 font-mono text-sm text-white placeholder-slate-700 outline-none transition-colors focus:border-slate-600"
        />
      </div>

      {/* Category + Subcategory + Pricing */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-widest text-slate-600">
            // category *
          </label>
          <select
            required
            value={category}
            onChange={(e) => {
              const val = e.target.value;
              setCategory(val);
              setSubcategory('');
              setCustomCategory('');
              setCustomSubcategory('');
              if (val === 'other') {
                setSubcategory('other');
              }
            }}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2 font-mono text-sm text-white outline-none transition-colors focus:border-slate-600"
          >
            <option value="">select...</option>
            {CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.name}
              </option>
            ))}
            <option value="other">Other</option>
          </select>
          {isOtherCategory && (
            <input
              required
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Enter category name"
              className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2 font-mono text-sm text-white placeholder-slate-700 outline-none transition-colors focus:border-slate-600"
            />
          )}
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-widest text-slate-600">
            // subcategory *
          </label>
          {isOtherCategory ? (
            <input
              required
              value={customSubcategory}
              onChange={(e) => setCustomSubcategory(e.target.value)}
              placeholder="Enter subcategory name"
              className="w-full rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2 font-mono text-sm text-white placeholder-slate-700 outline-none transition-colors focus:border-slate-600"
            />
          ) : (
            <select
              required
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              disabled={!category}
              className="w-full rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2 font-mono text-sm text-white outline-none transition-colors focus:border-slate-600 disabled:opacity-40"
            >
              <option value="">select...</option>
              {selectedCategory?.subcategories.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-widest text-slate-600">
            // pricing *
          </label>
          <select
            required
            value={pricing}
            onChange={(e) => setPricing(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2 font-mono text-sm text-white outline-none transition-colors focus:border-slate-600"
          >
            <option value="">select...</option>
            <option value="free">Free</option>
            <option value="freemium">Freemium</option>
            <option value="paid">Paid</option>
            <option value="open-source">Open Source</option>
          </select>
        </div>
      </div>

      {/* Connections */}
      <div>
        <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-widest text-slate-600">
          // ecosystem connections
        </label>
        <p className="mb-3 font-mono text-[10px] text-slate-600">
          What tools does this connect to? These show up on the ecosystem map.
        </p>

        {/* Existing connections */}
        {connections.length > 0 && (
          <div className="mb-3 space-y-1.5">
            {connections.map((conn) => {
              const tool = existingTools.find((t) => t.slug === conn.toolSlug);
              const type = CONNECTION_TYPES.find((ct) => ct.key === conn.type);
              return (
                <div
                  key={conn.toolSlug}
                  className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/30 px-3 py-2"
                >
                  <span className="font-mono text-xs text-slate-300">
                    {tool?.name || conn.toolSlug}{' '}
                    <span className="text-slate-600">— {type?.label || conn.type}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => removeConnection(conn.toolSlug)}
                    className="font-mono text-xs text-slate-700 transition-colors hover:text-red-400"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Add connection */}
        <div className="space-y-2 rounded-lg border border-slate-800/50 bg-slate-900/20 p-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="relative">
              <input
                value={connSearch}
                onChange={(e) => setConnSearch(e.target.value)}
                placeholder="Search tools..."
                className="w-full rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-1.5 font-mono text-xs text-white placeholder-slate-700 outline-none transition-colors focus:border-slate-600"
              />
              {filteredTools.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-48 overflow-y-auto rounded-lg border border-slate-700 bg-slate-900 shadow-xl">
                  {filteredTools.map((tool) => (
                    <button
                      key={tool.slug}
                      type="button"
                      onClick={() => addConnection(tool)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left font-mono text-xs text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                    >
                      <span className="text-slate-300">{tool.name}</span>
                      <span className="text-slate-700">{tool.category}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <select
              value={connType}
              onChange={(e) => setConnType(e.target.value)}
              className="rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-1.5 font-mono text-xs text-white outline-none transition-colors focus:border-slate-600"
            >
              {CONNECTION_TYPES.map((ct) => (
                <option key={ct.key} value={ct.key}>
                  {ct.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between border-t border-slate-800/50 pt-6">
        <p className="font-mono text-[10px] text-slate-700">
          opens a GitHub issue for review
        </p>
        <button
          type="submit"
          disabled={!name || !website || !tagline || !description || !category || !pricing || (isOtherCategory ? (!customCategory || !customSubcategory) : !subcategory)}
          className="rounded-lg border border-violet-500/30 bg-violet-500/10 px-6 py-2.5 font-mono text-sm font-bold text-violet-400 transition-all hover:border-violet-500/50 hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:opacity-30"
        >
          submit tool →
        </button>
      </div>
    </form>
  );
}
