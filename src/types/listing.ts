export interface Listing {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: string;
  subcategory: string;
  pricing: string;
  status: string;
  tags: string[];
  website?: string;
  github?: string;
}
