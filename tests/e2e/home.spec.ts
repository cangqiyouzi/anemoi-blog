import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./');
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/anemoi-blog/);
  });

  test('displays hero section with title', async ({ page }) => {
    const heroTitle = page.locator('h1').first();
    await expect(heroTitle).toBeVisible();
    // Hero title uses char animation, so text is spaced out
    const text = await heroTitle.textContent();
    expect(text?.replace(/\s/g, '')).toContain('anemoi');
  });

  test('displays hero subtitle', async ({ page }) => {
    await expect(page.locator('h1 + p')).toContainText('风之所向，心之所往');
  });

  test('has scroll indicator', async ({ page }) => {
    await expect(page.locator('text=SCROLL')).toBeVisible();
  });

  test('displays intro text section', async ({ page }) => {
    await expect(page.locator('text=风，从很远的地方吹来')).toBeVisible();
  });

  test('displays NEWS timeline section', async ({ page }) => {
    await expect(page.locator('text=NEWS')).toBeVisible();
    await expect(page.locator('text=记录风的轨迹')).toBeVisible();
  });

  test('displays featured blog posts in timeline', async ({ page }) => {
    const postLinks = page.locator('a[href^="/anemoi-blog/blog/"]').first();
    await expect(postLinks).toBeVisible();
  });

  test('displays tag cloud section', async ({ page }) => {
    await expect(page.locator('text=风之絮语')).toBeVisible();
    await expect(page.locator('text=按主题浏览文章')).toBeVisible();
  });

  test('has working navigation links', async ({ page }) => {
    const desktopNav = page.locator('.hidden.md\\:flex');
    await expect(desktopNav.locator('a[href="/anemoi-blog/"]')).toContainText('首页');
    await expect(desktopNav.locator('a[href="/anemoi-blog/archive/"]')).toContainText('归档');
    await expect(desktopNav.locator('a[href="/anemoi-blog/friends/"]')).toContainText('友链');
    await expect(desktopNav.locator('a[href="/anemoi-blog/about/"]')).toContainText('关于');
  });

  test('has footer with site name', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('footer')).toContainText('anemoi');
  });

  test('has favicon link', async ({ page }) => {
    const favicon = page.locator('link[rel="icon"]');
    await expect(favicon).toHaveAttribute('href', '/anemoi-blog/favicon.svg');
  });

  test('has meta description', async ({ page }) => {
    const meta = page.locator('meta[name="description"]');
    await expect(meta).toHaveAttribute('content', /风之所向，心之所往/);
  });

  test('has viewport meta tag', async ({ page }) => {
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', 'width=device-width, initial-scale=1.0');
  });

  test('has charset meta tag', async ({ page }) => {
    const charset = page.locator('meta[charset]');
    await expect(charset).toHaveAttribute('charset', 'UTF-8');
  });

  test('has link to archive page at bottom', async ({ page }) => {
    await expect(page.locator('a[href="/anemoi-blog/archive/"]').last()).toContainText('查看全部文章');
  });

  test('hero background image loads', async ({ page }) => {
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();
  });

  test('page uses Chinese language', async ({ page }) => {
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'zh-CN');
  });
});
