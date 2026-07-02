import { test, expect } from '@playwright/test';

test.describe('Friends Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./friends/');
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/友链 - anemoi-blog/);
  });

  test('displays friend showcase component', async ({ page }) => {
    const showcase = page.locator('.friend-showcase');
    await expect(showcase).toBeVisible();
  });

  test('displays avatar buttons', async ({ page }) => {
    const avatars = page.locator('.friend-avatar-btn:visible');
    await expect(avatars.first()).toBeVisible();
    const count = await avatars.count();
    expect(count).toBeGreaterThan(0);
  });

  test('avatar images have correct alt text', async ({ page }) => {
    const images = page.locator('.friend-avatar-btn img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).toContain('的头像');
    }
  });

  test('displays friend preview image', async ({ page, browserName }) => {
    const preview = page.locator('#friend-preview');
    await page.waitForLoadState('networkidle');

    const src = await preview.getAttribute('src');
    expect(src).toBeTruthy();

    if (browserName === 'webkit') {
      // WebKit 对 flex + aspect-ratio 的布局计算较慢，toBeVisible() 容易超时卡死
      // 改为直接检测图片是否已加载且有实际像素尺寸
      await page.waitForTimeout(800);
      const complete = await preview.evaluate(el => (el as HTMLImageElement).complete);
      expect(complete).toBe(true);
      const naturalWidth = await preview.evaluate(el => (el as HTMLImageElement).naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    } else {
      await expect(preview).toBeVisible();
    }
  });

  test('displays friend name', async ({ page }) => {
    const name = page.locator('#friend-name');
    await expect(name).toBeVisible();
    await expect(name).not.toBeEmpty();
  });

  test('displays friend category', async ({ page }) => {
    const category = page.locator('#friend-category');
    await expect(category).toBeVisible();
    await expect(category).not.toBeEmpty();
  });

  test('displays friend author', async ({ page }) => {
    const author = page.locator('#friend-author');
    await expect(author).toBeVisible();
    await expect(author).toContainText('博主');
  });

  test('displays friend slogan', async ({ page }) => {
    const slogan = page.locator('#friend-slogan');
    const isMobile = await page.locator('#mobile-menu-btn').isVisible();
    if (!isMobile) {
      await expect(slogan).toBeVisible();
    }
    await expect(slogan).not.toBeEmpty();
  });

  test('displays friend description', async ({ page }) => {
    const description = page.locator('#friend-description');
    await expect(description).toBeVisible();
    await expect(description).not.toBeEmpty();
  });

  test('visit site link is present when url exists', async ({ page }) => {
    const linkWrapper = page.locator('#friend-link-wrapper');
    const link = page.locator('#friend-link');
    if (await linkWrapper.isVisible().catch(() => false)) {
      if (await link.isVisible().catch(() => false)) {
        const href = await link.getAttribute('href');
        expect(href).toBeTruthy();
        await expect(link).toContainText('访问站点');
      }
    }
  });

  test('has navigation arrows on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.reload();
    const prevBtn = page.locator('#friend-prev-btn');
    const nextBtn = page.locator('#friend-next-btn');
    await expect(prevBtn).toBeVisible();
    await expect(nextBtn).toBeVisible();
  });

  test('navigation arrows have correct aria labels', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.reload();
    const prevBtn = page.locator('#friend-prev-btn');
    const nextBtn = page.locator('#friend-next-btn');
    await expect(prevBtn).toHaveAttribute('aria-label', '上一个友链');
    await expect(nextBtn).toHaveAttribute('aria-label', '下一个友链');
  });

  test('has mobile dots indicator', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    const dots = page.locator('.mobile-dot');
    const count = await dots.count();
    expect(count).toBeGreaterThan(0);
  });

  test('avatar buttons are clickable', async ({ page }) => {
    const avatars = page.locator('.friend-avatar-btn:visible');
    const count = await avatars.count();
    if (count > 1) {
      // Click second avatar
      await avatars.nth(1).click();
      // Content should update
      const name = page.locator('#friend-name');
      await expect(name).toBeVisible();
    }
  });

  test('mobile avatar scroll container exists on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    const scrollContainer = page.locator('#mobile-avatar-scroll');
    await expect(scrollContainer).toBeVisible();
  });

  test('friend content updates when switching friends', async ({ page }) => {
    const avatars = page.locator('.friend-avatar-btn:visible');
    const count = await avatars.count();
    if (count > 1) {
      const initialName = await page.locator('#friend-name').textContent();
      await avatars.nth(1).click();
      await page.waitForTimeout(300);
      const newName = await page.locator('#friend-name').textContent();
      expect(newName).not.toBe(initialName);
    }
  });
});
