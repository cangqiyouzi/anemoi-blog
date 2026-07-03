import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    coverImage: z.string().min(1).optional(),
    tags: z.array(z.string().min(1).regex(/^[^/#]+$/)).default([]),
  }),
});

export const collections = {
  blog: blogCollection,
};
