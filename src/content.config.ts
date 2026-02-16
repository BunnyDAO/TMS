import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const listings = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/listings' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    tagline: z.string(),
    description: z.string(),
    category: z.enum(['ai', 'bitcoin', 'ethereum', 'solana', 'rwa', 'infra']),
    subcategory: z.string(),
    tags: z.array(z.string()),
    website: z.string().url().optional(),
    github: z.string().url().optional(),
    docs: z.string().url().optional(),
    pricing: z.enum(['free', 'freemium', 'paid', 'open-source']),
    status: z.enum(['hot', 'trending', 'new', 'stable']).default('stable'),
    logo: z.string().optional(),
    dateAdded: z.coerce.date(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { listings };
