import { describe, it, expect } from 'vitest';
import { calculateReadingTime } from '../../src/utils/readingTime';

describe('calculateReadingTime', () => {
  describe('pure Chinese text', () => {
    it('returns 1 minute for short Chinese text', () => {
      const text = '这是一篇很短的中文文章。';
      expect(calculateReadingTime(text)).toBe(1);
    });

    it('calculates correctly for 400 Chinese characters', () => {
      const text = '中'.repeat(400);
      expect(calculateReadingTime(text)).toBe(1);
    });

    it('calculates correctly for 800 Chinese characters', () => {
      const text = '中'.repeat(800);
      expect(calculateReadingTime(text)).toBe(2);
    });

    it('calculates correctly for 1200 Chinese characters', () => {
      const text = '文'.repeat(1200);
      expect(calculateReadingTime(text)).toBe(3);
    });

    it('returns at least 1 minute even for empty string', () => {
      expect(calculateReadingTime('')).toBe(1);
    });

    it('strips HTML tags before counting', () => {
      const text = '<p>' + '中'.repeat(400) + '</p>';
      expect(calculateReadingTime(text)).toBe(1);
    });

    it('handles mixed nested HTML tags', () => {
      const text = '<div><p><strong>' + '汉'.repeat(800) + '</strong></p></div>';
      expect(calculateReadingTime(text)).toBe(2);
    });
  });

  describe('pure English text', () => {
    it('returns 1 minute for short English text', () => {
      const text = 'This is a short article.';
      expect(calculateReadingTime(text)).toBe(1);
    });

    it('calculates correctly for 200 English words', () => {
      const words = Array(200).fill('word').join(' ');
      expect(calculateReadingTime(words)).toBe(1);
    });

    it('calculates correctly for 400 English words', () => {
      const words = Array(400).fill('word').join(' ');
      expect(calculateReadingTime(words)).toBe(2);
    });

    it('calculates correctly for 600 English words', () => {
      const words = Array(600).fill('word').join(' ');
      expect(calculateReadingTime(words)).toBe(3);
    });
  });

  describe('mixed CJK and English text', () => {
    it('calculates mixed content correctly', () => {
      const cjk = '中'.repeat(200);
      const eng = Array(100).fill('word').join(' ');
      expect(calculateReadingTime(cjk + ' ' + eng)).toBe(1);
    });

    it('calculates mixed content with more CJK', () => {
      const cjk = '文'.repeat(800);
      const eng = Array(100).fill('word').join(' ');
      expect(calculateReadingTime(cjk + ' ' + eng)).toBe(3);
    });

    it('handles CJK characters separated by English words', () => {
      const text = '中 word 文 word 字'.repeat(100);
      const result = calculateReadingTime(text);
      expect(result).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Japanese and Korean text', () => {
    it('counts Japanese kanji as CJK characters', () => {
      const text = '風'.repeat(400);
      expect(calculateReadingTime(text)).toBe(1);
    });

    it('counts Japanese hiragana as CJK characters', () => {
      const hiragana = 'あ'.repeat(400);
      expect(calculateReadingTime(hiragana)).toBe(1);
    });

    it('counts Japanese katakana as CJK characters', () => {
      const katakana = 'カ'.repeat(800);
      expect(calculateReadingTime(katakana)).toBe(2);
    });
  });

  describe('edge cases', () => {
    it('handles null content gracefully', () => {
      expect(calculateReadingTime(null as any)).toBe(1);
    });

    it('handles undefined content gracefully', () => {
      expect(calculateReadingTime(undefined as any)).toBe(1);
    });

    it('handles text with only whitespace', () => {
      expect(calculateReadingTime('   \n\t  ')).toBe(1);
    });

    it('handles text with only HTML tags', () => {
      expect(calculateReadingTime('<div></div><p></p>')).toBe(1);
    });

    it('handles text with special characters', () => {
      const text = '!@#$%^&*()'.repeat(100);
      expect(calculateReadingTime(text)).toBe(1);
    });

    it('handles text with numbers', () => {
      const text = '123 '.repeat(200);
      expect(calculateReadingTime(text)).toBe(1);
    });

    it('handles very long text', () => {
      const text = '中'.repeat(10000);
      expect(calculateReadingTime(text)).toBe(25);
    });

    it('handles markdown content with HTML-like syntax', () => {
      const text = '# 标题\n\n这是一段**加粗**的文字和一段*斜体*的文字。';
      expect(calculateReadingTime(text)).toBe(1);
    });
  });

  describe('real-world blog post scenarios', () => {
    it('handles a typical short blog post', () => {
      const text = `
        <h1>风的故事</h1>
        <p>风从很远的地方吹来，带来了未知的故事。每一个故事都是一阵风，吹过就散了，却留下了痕迹。</p>
        <p>在这个博客中，我想记录那些关于风、关于旅行、关于生活的点滴感悟。</p>
      `;
      const result = calculateReadingTime(text);
      expect(result).toBe(1);
    });

    it('handles a medium-length bilingual blog post', () => {
      const paragraphs = [];
      for (let i = 0; i < 10; i++) {
        paragraphs.push(`<p>这是一段关于风和旅行的中文描述。Wind is a natural phenomenon that has inspired poets and writers for centuries. 我们每个人都曾在某个时刻感受到风的存在。</p>`);
      }
      const text = paragraphs.join('\n');
      const result = calculateReadingTime(text);
      expect(result).toBeGreaterThanOrEqual(2);
      expect(result).toBeLessThanOrEqual(5);
    });
  });
});
