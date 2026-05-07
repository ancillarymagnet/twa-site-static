import { defineCollection, z } from 'astro:content';

const siteCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    subtitle: z.string(),
    description: z.string(),
    topBar: z.object({
      status: z.string(),
      meta: z.string(),
    }),
    ticker: z.string(),
    hero: z.object({
      title: z.string(),
      tagline: z.string(),
      subtitle: z.string(),
    }),
    signup: z.object({
      placeholder: z.string(),
      buttonText: z.string(),
      description: z.string(),
    }),
    reel: z.object({
      title: z.string().optional(),
      cta: z.string(),
      videos: z.array(z.object({
        id: z.string(),
        title: z.string(),
        duration: z.string().optional(),
        label: z.string().optional(),
      })),
    }),
    header: z.object({
      brand: z.string(),
    }),
    footer: z.object({
      production: z.string(),
      copyrightHolder: z.string().trim().min(1),
    }),
    social: z.object({
      youtube: z.string().optional(),
      instagram: z.string().optional(),
    }),
    seo: z.object({
      title: z.string(),
      description: z.string(),
      socialDescription: z.string().trim().min(1).optional(),
      keywords: z.string(),
    }),
  }),
});

export const collections = {
  'site': siteCollection,
};
