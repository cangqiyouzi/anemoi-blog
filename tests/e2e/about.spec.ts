import { test, expect } from '@playwright/test';

test.describe('About Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about/');
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/关于 - anemoi-blog/);
  });

  test('displays page header', async ({ page }) => {
    await expect(page.locator('text=ABOUT')).toBeVisible();
    await expect(page.getByRole('heading', { name: '关于', exact: true })).toBeVisible();
  });

  test('displays about section title', async ({ page }) => {
    await expect(page.locator('text=关于这个博客')).toBeVisible();
  });

  test('displays blog description', async ({ page }) => {
    await expect(page.getByText('anemoi-blog 是一个以风为名的个人博客')).toBeVisible();
    await expect(page.locator('section').filter({ hasText: 'Key/Visual Arts' }).first()).toBeVisible();
  });

  test('has two info cards', async ({ page }) => {
    await expect(page.locator('text=写作')).toBeVisible();
    await expect(page.locator('text=设计')).toBeVisible();
  });

  test('displays timeline section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '旅程' })).toBeVisible();
  });

  test('timeline has events', async ({ page }) => {
    const events = page.locator('.ml-10, [class*="ml-10"]').filter({ has: page.locator('h3') });
    const count = await events.count();
    expect(count).toBeGreaterThan(0);
  });

  test('timeline events have dates', async ({ page }) => {
    const dates = page.locator('time').filter({ hasText: /\d{4}\.\d{2}|未来/ });
    await expect(dates.first()).toBeVisible();
  });

  test('timeline events have titles', async ({ page }) => {
    const titles = ['博客诞生', '第一篇故事', '视觉重塑', '未完待续'];
    for (const title of titles) {
      await expect(page.locator(`text=${title}`)).toBeVisible();
    }
  });

  test('has contact section', async ({ page }) => {
    await expect(page.locator('text=联系我')).toBeVisible();
  });

  test('has contact links', async ({ page }) => {
    await expect(page.locator('a[href^="mailto:"]')).toContainText('邮箱');
    await expect(page.locator('a[href="https://twitter.com"]')).toContainText('X / Twitter');
    await expect(page.locator('a[href="https://github.com"]')).toContainText('GitHub');
  });

  test('contact links open in new tab', async ({ page }) => {
    const externalLinks = page.locator('a[href^="https://"]').filter({ hasText: /Twitter|GitHub/ });
    const count = await externalLinks.count();
    for (let i = 0; i < count; i++) {
      await expect(externalLinks.nth(i)).toHaveAttribute('target', '_blank');
      await expect(externalLinks.nth(i)).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  test('has closing intro text', async ({ page }) => {
    await expect(page.locator('text=感谢你的到访')).toBeVisible();
    await expect(page.locator('text=愿风常伴你左右')).toBeVisible();
  });

  test('hero section has parallax background', async ({ page }) => {
    const heroBg = page.locator('.about-hero-bg');
    await expect(heroBg).toBeVisible();
  });

  test('footer is visible', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible();
  });
});
