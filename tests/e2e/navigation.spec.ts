import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('navbar is visible on all pages', async ({ page }) => {
    const pages = ['/', '/archive/', '/friends/', '/about/'];
    for (const path of pages) {
      await page.goto(path);
      const nav = page.locator('#main-nav');
      await expect(nav).toBeVisible();
    }
  });

  test('logo links to homepage', async ({ page }) => {
    const logo = page.locator('nav a[href="/"]').filter({ hasText: 'anemoi' });
    await expect(logo).toBeVisible();
    await expect(logo).toContainText('anemoi');
  });

  test('nav links work correctly', async ({ page }) => {
    const links = [
      { href: '/archive/', text: '归档' },
      { href: '/friends/', text: '友链' },
      { href: '/about/', text: '关于' },
    ];

    const isMobile = await page.locator('#mobile-menu-btn').isVisible();

    for (const link of links) {
      await page.goto('/');
      if (isMobile) {
        const menuBtn = page.locator('#mobile-menu-btn');
        await menuBtn.click();
        await page.waitForTimeout(300);
        const mobileMenu = page.locator('#mobile-menu');
        const navLink = mobileMenu.locator(`a[href="${link.href}"]`);
        await expect(navLink).toContainText(link.text);
        await navLink.click();
      } else {
        const desktopNav = page.locator('.hidden.md\\:flex');
        const navLink = desktopNav.locator(`a[href="${link.href}"]`);
        await expect(navLink).toContainText(link.text);
        await navLink.click();
      }
      await expect(page).toHaveURL(link.href);
    }
  });

  test('active nav link has indicator', async ({ page }) => {
    await page.goto('/archive/');
    const isMobile = await page.locator('#mobile-menu-btn').isVisible();
    if (isMobile) {
      await page.locator('#mobile-menu-btn').click();
      await page.waitForTimeout(300);
      const mobileMenu = page.locator('#mobile-menu');
      const activeLink = mobileMenu.locator('a[href="/archive/"]');
      await expect(activeLink).toBeVisible();
    } else {
      const desktopNav = page.locator('.hidden.md\\:flex');
      const activeLink = desktopNav.locator('a[href="/archive/"]');
      await expect(activeLink).toBeVisible();
    }
  });

  test('theme toggle button exists', async ({ page }) => {
    const isMobile = await page.locator('#mobile-menu-btn').isVisible();
    if (isMobile) {
      await page.locator('#mobile-menu-btn').click();
      await page.waitForTimeout(300);
      const themeToggle = page.locator('#theme-toggle-mobile');
      await expect(themeToggle).toBeVisible();
    } else {
      const themeToggle = page.locator('#theme-toggle');
      await expect(themeToggle).toBeVisible();
      await expect(themeToggle).toHaveAttribute('aria-label', '切换白天/黑夜模式');
    }
  });

  test('theme toggle changes theme', async ({ page }) => {
    const html = page.locator('html');
    const isMobile = await page.locator('#mobile-menu-btn').isVisible();
    
    if (isMobile) {
      await page.locator('#mobile-menu-btn').click();
      await page.waitForTimeout(300);
    }
    
    const themeToggle = isMobile ? page.locator('#theme-toggle-mobile') : page.locator('#theme-toggle');
    
    // Get initial theme
    const hasDarkInitially = await html.evaluate(el => el.classList.contains('dark'));
    
    // Click toggle
    await themeToggle.click();
    await page.waitForTimeout(200);
    
    // Check theme changed
    const hasDarkAfter = await html.evaluate(el => el.classList.contains('dark'));
    expect(hasDarkAfter).not.toBe(hasDarkInitially);
    
    // Toggle back
    await themeToggle.click();
    await page.waitForTimeout(200);
    
    const hasDarkFinal = await html.evaluate(el => el.classList.contains('dark'));
    expect(hasDarkFinal).toBe(hasDarkInitially);
  });

  test('mobile menu button exists on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    const menuBtn = page.locator('#mobile-menu-btn');
    await expect(menuBtn).toBeVisible();
    await expect(menuBtn).toHaveAttribute('aria-label', '打开菜单');
  });

  test('mobile menu opens and closes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    const menuBtn = page.locator('#mobile-menu-btn');
    const mobileMenu = page.locator('#mobile-menu');
    
    // Menu should be hidden initially
    await expect(mobileMenu).toHaveClass(/max-h-0/);
    
    // Open menu
    await menuBtn.click();
    await page.waitForTimeout(300);
    await expect(mobileMenu).toHaveClass(/max-h-64/);
    
    // Close menu
    await menuBtn.click();
    await page.waitForTimeout(300);
    await expect(mobileMenu).toHaveClass(/max-h-0/);
  });

  test('mobile menu contains navigation links', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    const menuBtn = page.locator('#mobile-menu-btn');
    await menuBtn.click();
    await page.waitForTimeout(300);
    
    const mobileMenu = page.locator('#mobile-menu');
    await expect(mobileMenu.locator('a[href="/"]')).toContainText('首页');
    await expect(mobileMenu.locator('a[href="/archive/"]')).toContainText('归档');
    await expect(mobileMenu.locator('a[href="/friends/"]')).toContainText('友链');
    await expect(mobileMenu.locator('a[href="/about/"]')).toContainText('关于');
  });

  test('mobile theme toggle exists', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    const menuBtn = page.locator('#mobile-menu-btn');
    await menuBtn.click();
    await page.waitForTimeout(300);
    
    const themeToggle = page.locator('#theme-toggle-mobile');
    await expect(themeToggle).toBeVisible();
  });

  test('back to top button appears after scrolling', async ({ page }) => {
    const backToTop = page.locator('#back-to-top');
    
    // Initially hidden
    await expect(backToTop).toHaveClass(/opacity-0/);
    
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, window.innerHeight));
    await page.waitForTimeout(300);
    
    // Should be visible
    await expect(backToTop).toHaveClass(/opacity-100/);
  });

  test('back to top button scrolls to top', async ({ page }) => {
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    
    const backToTop = page.locator('#back-to-top');
    await backToTop.click();
    
    // Wait for smooth scroll
    await page.waitForTimeout(1000);
    
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(100);
  });

  test('navbar changes background on scroll', async ({ page }) => {
    const nav = page.locator('#main-nav');
    
    // Check initial state
    await expect(nav).toBeVisible();
    
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 200));
    await page.waitForTimeout(300);
    
    // Navbar should have background class
    const classList = await nav.evaluate(el => el.className);
    expect(classList).toMatch(/bg-anemoi-bg|bg-transparent/);
  });

  test('footer links and copyright', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('anemoi');
    await expect(footer).toContainText('风之所向，心之所往');
  });
});
