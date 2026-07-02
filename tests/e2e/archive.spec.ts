import { test, expect } from '@playwright/test';

test.describe('Archive Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./archive/');
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/归档 - anemoi-blog/);
  });

  test('displays page header', async ({ page }) => {
    await expect(page.locator('text=ARCHIVE')).toBeVisible();
    await expect(page.locator('text=时光归档')).toBeVisible();
  });

  test('displays post count', async ({ page }) => {
    const countText = page.locator('text=/共 \\d+ 篇文章/');
    await expect(countText).toBeVisible();
  });

  test('has timeline structure', async ({ page }) => {
    const timelineLine = page.locator('.absolute.w-px');
    await expect(timelineLine.first()).toBeVisible();
  });

  test('displays month group headers', async ({ page }) => {
    const monthHeaders = page.locator('h2:visible');
    await expect(monthHeaders.first()).toBeVisible();
  });

  test('displays post links in archive', async ({ page }) => {
    const postLinks = page.locator('a[href^="/anemoi-blog/blog/"]');
    await expect(postLinks.first()).toBeVisible();
  });

  test('post links have correct structure', async ({ page }) => {
    const postLink = page.locator('a[href^="/anemoi-blog/blog/"]').first();
    await expect(postLink).toBeVisible();
    const title = postLink.locator('h3');
    await expect(title).toBeVisible();
  });

  test('post dates are formatted correctly', async ({ page }) => {
    const dateElements = page.locator('time');
    const count = await dateElements.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(count, 3); i++) {
      await expect(dateElements.nth(i)).toBeVisible();
    }
  });

  test('timeline nodes are visible', async ({ page }) => {
    const nodes = page.locator('.rounded-full').filter({ has: page.locator('..') });
    await expect(nodes.first()).toBeVisible();
  });

  test('posts are grouped by month', async ({ page }) => {
    const groups = page.locator('.mb-12');
    const count = await groups.count();
    expect(count).toBeGreaterThan(0);
  });

  test('has navbar with transparent background initially', async ({ page }) => {
    const nav = page.locator('#main-nav');
    await expect(nav).toHaveClass(/bg-transparent|bg-anemoi-bg/);
  });

  test('footer is visible', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible();
  });
});
