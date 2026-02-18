/**
 * Generator — Auto-generates listing .md files from enriched candidates.
 * Claude writes the full listing content (frontmatter + markdown body).
 * Output is validated against the site's schema before writing.
 */
import Anthropic from '@anthropic-ai/sdk';
import type { EnrichedCandidate, GeneratedFile, GeneratedListing, ExistingListing } from './types.js';

/**
 * Generate listing .md files for enriched candidates.
 * Uses Claude to write each listing, then validates against schema.
 */
export async function generateListings(
  apiKey: string,
  candidates: EnrichedCandidate[],
  existingListings: ExistingListing[],
): Promise<GeneratedFile[]> {
  const client = new Anthropic({ apiKey });
  const generated: GeneratedFile[] = [];

  for (const candidate of candidates) {
    try {
      const listing = await generateSingleListing(client, candidate, existingListings);
      if (!listing) continue;

      const content = formatListingFile(listing);
      const filePath = `src/content/listings/${listing.category}/${listing.slug}.md`;

      generated.push({ filePath, content, candidate });
    } catch (err) {
      console.warn(`  Failed to generate listing for ${candidate.name}:`, err);
    }
  }

  return generated;
}

async function generateSingleListing(
  client: Anthropic,
  candidate: EnrichedCandidate,
  existingListings: ExistingListing[],
): Promise<GeneratedListing | null> {
  const contextParts: string[] = [];

  if (candidate.readme) {
    contextParts.push(`## GitHub README (first 3000 chars):\n${candidate.readme}`);
  }
  if (candidate.websiteMeta?.title) {
    contextParts.push(`## Website Title: ${candidate.websiteMeta.title}`);
  }
  if (candidate.websiteMeta?.description) {
    contextParts.push(`## Website Description: ${candidate.websiteMeta.description}`);
  }

  // Sample existing listing in the same category for style reference
  const sameCategory = existingListings.filter(l => l.category === candidate.category);
  const sample = sameCategory[0];

  const prompt = `You are writing a listing for toomuch.sh, a curated directory of tools.

Generate a complete listing for this tool/project:

Name: ${candidate.name}
URL: ${candidate.url}
Source: ${candidate.source}
Category: ${candidate.category}
Subcategory: ${candidate.suggestedSubcategory}
Tags: ${candidate.suggestedTags.join(', ')}
Pricing: ${candidate.suggestedPricing}
Description from source: ${candidate.description}

${contextParts.length > 0 ? `Additional context:\n${contextParts.join('\n\n')}` : ''}

${sample ? `Here's an example listing in the same category for style reference:
Name: ${sample.name}
Tagline: ${sample.tagline}
Description: ${sample.description}` : ''}

Generate a JSON object with these EXACT fields:
{
  "name": "Display Name",
  "slug": "url-friendly-slug",
  "tagline": "One sentence, max 100 chars, no period at end",
  "description": "2-3 sentence description of what it does and why it matters. Be specific and factual.",
  "category": "${candidate.category}",
  "subcategory": "${candidate.suggestedSubcategory}",
  "tags": ["tag1", "tag2", "tag3"],
  "website": "https://...",
  "github": "https://github.com/...",
  "docs": "https://docs...",
  "pricing": "${candidate.suggestedPricing}",
  "bodyContent": "## Getting Started\\n\\n1. Step one...\\n\\n## Key Features\\n\\n- **Feature** — description"
}

RULES:
- slug must be lowercase, hyphens only, no special chars
- tagline is SHORT (under 100 chars), no period, describes the tool in one phrase
- description is 2-3 sentences, factual, no hype
- tags should be 3-8 lowercase hyphenated keywords
- bodyContent uses markdown with ## Getting Started (3-4 numbered steps) and ## Key Features (4-6 bullet points with bold feature names)
- website/github/docs: only include if you're confident they exist. Use null for unknown.
- Be factual. Don't make up features or URLs.

Respond with valid JSON only (no markdown code fences).`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in response');
    const parsed = JSON.parse(jsonMatch[0]);

    const listing = validateAndNormalize(parsed, candidate);
    return listing;
  } catch (err) {
    console.warn(`  Failed to parse generated listing for ${candidate.name}:`, err);
    return null;
  }
}

function validateAndNormalize(raw: any, candidate: EnrichedCandidate): GeneratedListing | null {
  // Validate required fields
  if (!raw.name || !raw.slug || !raw.tagline || !raw.description) {
    console.warn(`  Missing required fields for ${candidate.name}`);
    return null;
  }

  // Normalize slug
  const slug = raw.slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  // Validate category
  const validCategories = ['ai', 'bitcoin', 'ethereum', 'solana', 'rwa', 'infra'];
  const category = validCategories.includes(raw.category) ? raw.category : candidate.category;

  // Validate pricing
  const validPricing = ['free', 'freemium', 'paid', 'open-source'];
  const pricing = validPricing.includes(raw.pricing) ? raw.pricing : candidate.suggestedPricing;

  // Validate tags
  const tags = Array.isArray(raw.tags)
    ? raw.tags.map((t: string) => t.toLowerCase().replace(/[^a-z0-9-]/g, '-')).slice(0, 8)
    : candidate.suggestedTags;

  // Validate URLs
  const website = isValidUrl(raw.website) ? raw.website : undefined;
  const github = isValidUrl(raw.github) ? raw.github : undefined;
  const docs = isValidUrl(raw.docs) ? raw.docs : undefined;

  // Truncate tagline
  const tagline = raw.tagline.slice(0, 100).replace(/\.\s*$/, '');

  const today = new Date().toISOString().split('T')[0];

  return {
    name: raw.name,
    slug,
    tagline,
    description: raw.description,
    category,
    subcategory: raw.subcategory || candidate.suggestedSubcategory,
    tags,
    website,
    github,
    docs,
    pricing,
    status: 'new',
    dateAdded: today,
    featured: false,
    bodyContent: raw.bodyContent || '',
  };
}

function isValidUrl(url: any): boolean {
  if (!url || typeof url !== 'string' || url === 'null') return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function formatListingFile(listing: GeneratedListing): string {
  const lines = [
    '---',
    `name: "${escapeYaml(listing.name)}"`,
    `slug: "${listing.slug}"`,
    `tagline: "${escapeYaml(listing.tagline)}"`,
    `description: "${escapeYaml(listing.description)}"`,
    `category: "${listing.category}"`,
    `subcategory: "${listing.subcategory}"`,
    `tags: [${listing.tags.map(t => `"${t}"`).join(', ')}]`,
  ];

  if (listing.website) lines.push(`website: "${listing.website}"`);
  if (listing.github) lines.push(`github: "${listing.github}"`);
  if (listing.docs) lines.push(`docs: "${listing.docs}"`);

  lines.push(
    `pricing: "${listing.pricing}"`,
    `status: "${listing.status}"`,
    `dateAdded: ${listing.dateAdded}`,
    `featured: ${listing.featured}`,
    '---',
    '',
  );

  if (listing.bodyContent) {
    lines.push(listing.bodyContent);
    lines.push('');
  }

  return lines.join('\n');
}

function escapeYaml(str: string): string {
  return str.replace(/"/g, '\\"').replace(/\n/g, ' ');
}
