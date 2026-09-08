import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    cover: z.string().optional(),
    readingTime: z.number().optional(),
    eyebrow: z.string().optional(),
    sectionLabel: z.string().optional(),
    coverCaption: z.string().optional(),
    toc: z.boolean().default(false),
  }),
});

export const collections = {
  blog,
};
