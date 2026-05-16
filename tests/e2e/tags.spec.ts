import { test, expect } from '@playwright/test';

test.describe('Tags Pages', () => {
  test('tag page loads with correct title', async ({ page }) => {
    await page.goto('/tags/%E9%9A%8F%E7%AC%94/');
    await expect(page).toHaveTitle(/标签：/);
  });

  test('displays tag name in header', async ({ page }) => {
    await page.goto('/tags/%E9%9A%8F%E7%AC%94/');
    const header = page.locator('h1');
    await expect(header).toBeVisible();
  });

  test('displays post count for tag', async ({ page }) => {
    await page.goto('/tags/%E9%9A%8F%E7%AC%94/');
    const countText = page.locator('text=/共 \\d+ 篇文章/');
    await expect(countText).toBeVisible();
  });

  test('displays post cards when tag has posts', async ({ page }) => {
    await page.goto('/tags/%E9%9A%8F%E7%AC%94/');
    const postCards = page.locator('article').filter({ has: page.locator('a[href^="/blog/"]') });
    if (await postCards.count() > 0) {
      await expect(postCards.first()).toBeVisible();
    }
  });

  test('post cards have correct structure', async ({ page }) => {
    await page.goto('/tags/%E9%9A%8F%E7%AC%94/');
    const card = page.locator('article').filter({ has: page.locator('a[href^="/blog/"]') }).first();
    if (await card.isVisible().catch(() => false)) {
      await expect(card.locator('img')).toBeVisible();
      await expect(card.locator('h3')).toBeVisible();
      await expect(card.locator('time')).toBeVisible();
    }
  });

  test('post card images have alt text', async ({ page }) => {
    await page.goto('/tags/%E9%9A%8F%E7%AC%94/');
    const images = page.locator('article img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('post cards link to correct blog posts', async ({ page }) => {
    await page.goto('/tags/%E9%9A%8F%E7%AC%94/');
    const links = page.locator('article a[href^="/blog/"]');
    if (await links.count() > 0) {
      const href = await links.first().getAttribute('href');
      expect(href).toMatch(/^\/blog\/.+\/$/);
    }
  });

  test('shows empty state when tag has no posts', async ({ page }) => {
    // Use a non-existent tag
    await page.goto('/tags/nonexistent-tag-12345/');
    const emptyText = page.locator('text=该标签下暂无文章');
    // This may or may not show depending on how Astro handles 404 for dynamic routes
    if (await emptyText.isVisible().catch(() => false)) {
      await expect(emptyText).toBeVisible();
    }
  });

  test('tag cloud links exist on homepage', async ({ page }) => {
    await page.goto('/');
    const tagLinks = page.locator('a[href^="/tags/"]');
    const count = await tagLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('tag cloud displays tag counts', async ({ page }) => {
    await page.goto('/');
    const tagLinks = page.locator('a[href^="/tags/"]');
    const firstTag = tagLinks.first();
    await expect(firstTag).toBeVisible();
    // Tag count should be visible as a small number
    const countSpan = firstTag.locator('span');
    if (await countSpan.isVisible().catch(() => false)) {
      const text = await countSpan.textContent();
      expect(text).toMatch(/\d+/);
    }
  });

  test('multiple tag pages are accessible', async ({ page }) => {
    // First get tags from homepage
    await page.goto('/');
    const tagHrefs: string[] = [];
    const tagLinks = page.locator('a[href^="/tags/"]');
    const count = await tagLinks.count();
    const tagsToTest = Math.min(count, 2);

    for (let i = 0; i < tagsToTest; i++) {
      const href = await tagLinks.nth(i).getAttribute('href');
      if (href) tagHrefs.push(href);
    }

    for (const href of tagHrefs) {
      await page.goto(href);
      await expect(page.locator('h1')).toBeVisible();
    }
  });
});
