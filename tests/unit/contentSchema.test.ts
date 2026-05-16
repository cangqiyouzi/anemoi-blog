import { describe, it, expect } from 'vitest';
import { z } from 'zod';

describe('Content Schema Validation', () => {
  // Helper to simulate the blog schema from src/content/config.ts
  const createBlogSchema = () =>
    z.object({
      title: z.string(),
      date: z.date(),
      description: z.string(),
      coverImage: z.string().optional(),
      tags: z.array(z.string()).default([]),
    });

  describe('blog collection schema', () => {
    it('validates correct blog frontmatter', () => {
      const schema = createBlogSchema();
      const validData = {
        title: 'Test Post',
        date: new Date('2024-01-01'),
        description: 'A test blog post',
        coverImage: '/images/cover.jpg',
        tags: ['test', 'blog'],
      };
      expect(schema.parse(validData)).toEqual(validData);
    });

    it('validates minimal required fields', () => {
      const schema = createBlogSchema();
      const minimalData = {
        title: 'Minimal Post',
        date: new Date('2024-06-15'),
        description: 'Just the essentials',
      };
      const result = schema.parse(minimalData);
      expect(result.title).toBe('Minimal Post');
      expect(result.tags).toEqual([]);
      expect(result.coverImage).toBeUndefined();
    });

    it('validates empty tags array', () => {
      const schema = createBlogSchema();
      const data = {
        title: 'No Tags',
        date: new Date(),
        description: 'A post without tags',
        tags: [],
      };
      const result = schema.parse(data);
      expect(result.tags).toEqual([]);
    });

    it('rejects missing required title', () => {
      const schema = createBlogSchema();
      const invalidData = {
        date: new Date(),
        description: 'Missing title',
      };
      expect(() => schema.parse(invalidData)).toThrow();
    });

    it('rejects missing required date', () => {
      const schema = createBlogSchema();
      const invalidData = {
        title: 'No Date',
        description: 'Missing date field',
      };
      expect(() => schema.parse(invalidData)).toThrow();
    });

    it('rejects missing required description', () => {
      const schema = createBlogSchema();
      const invalidData = {
        title: 'No Description',
        date: new Date(),
      };
      expect(() => schema.parse(invalidData)).toThrow();
    });

    it('rejects invalid date type', () => {
      const schema = createBlogSchema();
      const invalidData = {
        title: 'Bad Date',
        date: 'not-a-date',
        description: 'Invalid date type',
      };
      expect(() => schema.parse(invalidData)).toThrow();
    });

    it('rejects non-string title', () => {
      const schema = createBlogSchema();
      const invalidData = {
        title: 123,
        date: new Date(),
        description: 'Title is a number',
      };
      expect(() => schema.parse(invalidData)).toThrow();
    });

    it('handles single tag correctly', () => {
      const schema = createBlogSchema();
      const data = {
        title: 'Single Tag',
        date: new Date(),
        description: 'One tag only',
        tags: ['astro'],
      };
      const result = schema.parse(data);
      expect(result.tags).toEqual(['astro']);
    });

    it('handles many tags', () => {
      const schema = createBlogSchema();
      const data = {
        title: 'Many Tags',
        date: new Date(),
        description: 'Lots of tags',
        tags: ['astro', 'blog', 'tailwind', 'typescript', 'markdown'],
      };
      const result = schema.parse(data);
      expect(result.tags).toHaveLength(5);
    });

    it('handles special characters in title', () => {
      const schema = createBlogSchema();
      const data = {
        title: 'Special: 风の物語 & More!',
        date: new Date(),
        description: 'Title with special characters',
      };
      const result = schema.parse(data);
      expect(result.title).toBe('Special: 风の物語 & More!');
    });

    it('handles Unicode in description', () => {
      const schema = createBlogSchema();
      const data = {
        title: 'Unicode Test',
        date: new Date(),
        description: '这是一段包含中文、日本語、한국어、🎉 emoji 的描述。',
      };
      const result = schema.parse(data);
      expect(result.description).toContain('中文');
    });
  });

  describe('real blog post data validation', () => {
    it('validates first-post style data', () => {
      const schema = createBlogSchema();
      const post = {
        title: '第一篇故事',
        date: new Date('2024-03-15'),
        description: '写下第一篇属于自己的文字，开始了这段不知终点的书写之旅。',
        coverImage: '/images/cover-1.jpg',
        tags: ['随笔', '开始'],
      };
      expect(() => schema.parse(post)).not.toThrow();
    });

    it('validates multilingual post data', () => {
      const schema = createBlogSchema();
      const post = {
        title: 'Second Half — 後半',
        date: new Date('2024-06-01'),
        description: 'A multilingual story about wind and seasons. 風と季節の物語。',
        tags: ['story', 'multilingual', '风'],
      };
      expect(() => schema.parse(post)).not.toThrow();
    });
  });
});
