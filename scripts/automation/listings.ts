import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import type { ExistingListing, CategoryKey } from './types.js';

/**
 * Read all existing listing markdown files and parse their frontmatter.
 */
export function loadExistingListings(basePath: string = 'src/content/listings'): ExistingListing[] {
  const listings: ExistingListing[] = [];

  function walk(dir: string) {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (entry.endsWith('.md')) {
        const listing = parseListing(fullPath);
        if (listing) listings.push(listing);
      }
    }
  }

  walk(basePath);
  return listings;
}

/**
 * Parse frontmatter from a single markdown listing file.
 */
function parseListing(filePath: string): ExistingListing | null {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return null;

    const frontmatter = match[1];
    const data: Record<string, any> = {};

    for (const line of frontmatter.split('\n')) {
      const colonIdx = line.indexOf(':');
      if (colonIdx === -1) continue;

      const key = line.slice(0, colonIdx).trim();
      let value = line.slice(colonIdx + 1).trim();

      // Handle quoted strings
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      // Handle arrays (basic YAML inline arrays)
      if (value.startsWith('[') && value.endsWith(']')) {
        data[key] = value
          .slice(1, -1)
          .split(',')
          .map(s => s.trim().replace(/^["']|["']$/g, ''));
        continue;
      }

      // Handle booleans
      if (value === 'true') { data[key] = true; continue; }
      if (value === 'false') { data[key] = false; continue; }

      data[key] = value;
    }

    return {
      name: data.name || '',
      slug: data.slug || '',
      tagline: data.tagline || '',
      description: data.description || '',
      category: (data.category || 'ai') as CategoryKey,
      subcategory: data.subcategory || '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      website: data.website || undefined,
      github: data.github || undefined,
      docs: data.docs || undefined,
      pricing: data.pricing || 'free',
      status: data.status || 'stable',
      dateAdded: data.dateAdded || '',
      featured: data.featured === true,
      filePath,
    };
  } catch (err) {
    console.warn(`Failed to parse listing: ${filePath}`, err);
    return null;
  }
}

/**
 * Get all unique project names from existing listings.
 * Used for RSS mention tracking.
 */
export function getExistingProjectNames(listings: ExistingListing[]): string[] {
  return listings.map(l => l.name);
}

/**
 * Check if a project already exists in our listings.
 */
export function isAlreadyListed(
  listings: ExistingListing[],
  name: string,
  url?: string,
  githubUrl?: string,
): boolean {
  const lowerName = name.toLowerCase();
  return listings.some(l => {
    if (l.name.toLowerCase() === lowerName) return true;
    if (url && l.website && l.website === url) return true;
    if (githubUrl && l.github && l.github === githubUrl) return true;
    // Also check slug match
    const candidateSlug = lowerName.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (l.slug === candidateSlug) return true;
    return false;
  });
}
