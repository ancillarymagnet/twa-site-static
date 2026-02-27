import { defineCollection, z } from 'astro:content';

const siteCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    subtitle: z.string(),
    description: z.string(),
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
    header: z.object({
      brand: z.string(),
    }),
    footer: z.object({
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
