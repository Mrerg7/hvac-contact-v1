import { z, defineCollection } from 'astro:content';

const siteCollection = defineCollection({
  type: 'data',
  schema: z.object({
    domain: z.string(),
    price: z.string(),
    email: z.string(),
    heroImage: z.string(),
    heroStreamUrl: z.string().url(),
    disclaimer: z.string(),
    trustPoints: z.array(z.string()),
    marketMetrics: z.array(z.object({
      value: z.string(),
      label: z.string(),
      detail: z.string(),
      source: z.string(),
    })),
    valueCards: z.array(z.object({
      icon: z.string(),
      title: z.string(),
      body: z.string(),
    })),
    visionCards: z.array(z.object({
      title: z.string(),
      body: z.string(),
      tag: z.string(),
    })),
    acquisitionTerms: z.array(z.object({
      label: z.string(),
      detail: z.string(),
    })),
    footerLinks: z.array(z.object({
      label: z.string(),
      href: z.string(),
    })),
  }),
});

export const collections = {
  site: siteCollection,
};
