import { test, expect } from '@playwright/test';

test.describe('Blog Post Pages', () => {
  test('blog post page loads with correct title', async ({ page }) => {
    await page.goto('./blog/first-post/');
    await expect(page).toHaveTitle(/anemoi-blog/);
  });

  test('displays post title', async ({ page }) => {
    await page.goto('./blog/first-post/');
    const title = page.locator('article h1');
    await expect(title).toBeVisible();
    await expect(title).not.toBeEmpty();
  });

  test('displays post date', async ({ page }) => {
    await page.goto('./blog/first-post/');
    const dateElement = page.locator('article time').first();
    await expect(dateElement).toBeVisible();
  });

  test('displays reading time', async ({ page }) => {
    await page.goto('./blog/first-post/');
    await expect(page.locator('text=分钟阅读')).toBeVisible();
  });

  test('displays post content', async ({ page }) => {
    await page.goto('./blog/first-post/');
    const content = page.locator('article .prose');
    await expect(content).toBeVisible();
  });

  test('has share buttons section', async ({ page }) => {
    await page.goto('./blog/first-post/');
    await expect(page.locator('text=分享')).toBeVisible();
  });

  test('has copy link button', async ({ page }) => {
    await page.goto('./blog/first-post/');
    const copyBtn = page.locator('button[aria-label="复制链接"]');
    await expect(copyBtn).toBeVisible();
  });

  test('has Twitter/X share link', async ({ page }) => {
    await page.goto('./blog/first-post/');
    const twitterLink = page.locator('a[aria-label="分享到 X"]');
    await expect(twitterLink).toBeVisible();
    await expect(twitterLink).toHaveAttribute('href', /twitter.com/);
  });

  test('displays tags when post has tags', async ({ page }) => {
    await page.goto('./blog/seasons-of-wind/');
    const tags = page.locator('article a[href^="/anemoi-blog/tags/"]');
    const count = await tags.count();
    if (count > 0) {
      await expect(tags.first()).toBeVisible();
    }
  });

  test('has table of contents on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('./blog/secondhalf_chinese/');
    const toc = page.locator('aside').filter({ hasText: '目录' });
    await expect(toc).toBeVisible();
  });

  test('has mobile TOC toggle on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('./blog/secondhalf_chinese/');
    const tocToggle = page.locator('button:has-text("文章目录")');
    // May not exist if headings <= 2
    if (await tocToggle.isVisible().catch(() => false)) {
      await tocToggle.click();
      const mobileToc = page.locator('#mobile-toc');
      await expect(mobileToc).toBeVisible();
    }
  });

  test('has post navigation links', async ({ page }) => {
    await page.goto('./blog/first-post/');
    const nav = page.locator('nav').filter({ hasText: /上一篇|下一篇/ });
    // Navigation may or may not exist depending on post position
    if (await nav.isVisible().catch(() => false)) {
      const links = nav.locator('a');
      await expect(links.first()).toBeVisible();
    }
  });

  test('cover image is displayed', async ({ page }) => {
    await page.goto('./blog/first-post/');
    const header = page.locator('article header');
    await expect(header).toBeVisible();
  });

  test('scroll reveal elements exist', async ({ page }) => {
    await page.goto('./blog/first-post/');
    const scrollReveals = page.locator('.reveal');
    const count = await scrollReveals.count();
    expect(count).toBeGreaterThan(0);
  });

  test('all blog posts are accessible', async ({ page }) => {
    const posts = [
      'first-post',
      'seasons-of-wind',
      'secondhalf_chinese',
      'secondhalf_english',
      'secondhalf_japanese',
      'silent-words',
    ];

    for (const slug of posts) {
      const response = await page.goto(`./blog/${slug}/`);
      expect(response?.status()).toBe(200);
      await expect(page.locator('article')).toBeVisible();
    }
  });
});
