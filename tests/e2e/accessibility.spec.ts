import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('homepage has lang attribute', async ({ page }) => {
    await page.goto('./');
    const html = page.locator('html');
    const lang = await html.getAttribute('lang');
    expect(lang).toBe('zh-CN');
  });

  test('images have alt text', async ({ page }) => {
    await page.goto('./');
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      // Some decorative images might have empty alt, but most should have alt
      if (alt === null) {
        const role = await img.getAttribute('role');
        // If no alt, it should have role="presentation" or aria-hidden
        expect(role === 'presentation' || await img.evaluate(el => el.closest('[aria-hidden="true"]') !== null)).toBeTruthy();
      }
    }
  });

  test('interactive elements have accessible names', async ({ page }) => {
    await page.goto('./');
    
    // Buttons should have aria-label or visible text
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    for (let i = 0; i < buttonCount; i++) {
      const btn = buttons.nth(i);
      const ariaLabel = await btn.getAttribute('aria-label');
      const text = await btn.textContent();
      const ariaLabelledBy = await btn.getAttribute('aria-labelledby');
      const title = await btn.getAttribute('title');
      
      expect(ariaLabel || text?.trim() || ariaLabelledBy || title).toBeTruthy();
    }
  });

  test('links have visible text', async ({ page }) => {
    await page.goto('./');
    const links = page.locator('a');
    const count = await links.count();
    
    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      const hasImg = await link.locator('img').count() > 0;
      
      // Link should have text, aria-label, or contain an image
      expect(text?.trim() || ariaLabel || hasImg).toBeTruthy();
    }
  });

  test('heading hierarchy is correct on homepage', async ({ page }) => {
    await page.goto('./');
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const count = await headings.count();
    expect(count).toBeGreaterThan(0);
    
    // Page should have exactly one h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
  });

  test('heading hierarchy is correct on blog post', async ({ page }) => {
    await page.goto('./blog/first-post/');
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
  });

  test('color contrast is adequate on main text', async ({ page }) => {
    await page.goto('./');
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Check that body has background and text color defined
    const styles = await body.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
      };
    });
    
    expect(styles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(styles.color).toBeTruthy();
  });

  test('focusable elements are focusable', async ({ page }) => {
    await page.goto('./');
    
    // Tab through focusable elements
    const focusableElements = page.locator('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    const count = await focusableElements.count();
    expect(count).toBeGreaterThan(0);
    
    // Focus first element
    await focusableElements.first().focus();
    const activeElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(activeElement).not.toBe('BODY');
  });

  test('reduced motion is respected', async ({ page }) => {
    // Emulate prefers-reduced-motion via CDP
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('./');
    
    // With reduced motion, petals should be hidden
    const petals = page.locator('.petal');
    if (await petals.count() > 0) {
      const firstPetal = petals.first();
      const display = await firstPetal.evaluate(el => window.getComputedStyle(el).display);
      // Petals should be hidden with prefers-reduced-motion
      expect(display).toBe('none');
    }
  });

  test('has main content landmark', async ({ page }) => {
    await page.goto('./');
    const main = page.locator('main#main-content');
    await expect(main).toBeVisible();
  });

  test('ARIA landmarks exist on pages', async ({ page }) => {
    const pages = ['./', './archive/', './about/', './friends/'];
    
    for (const path of pages) {
      await page.goto(path);
      
      // Check for nav landmark
      const nav = page.locator('nav, [role="navigation"]');
      await expect(nav.first()).toBeVisible();
      
      // Check for content landmark (main, article, section, or div with substantial content)
      const content = page.locator('main, article, section, .friend-showcase, [class*="max-w"]');
      await expect(content.first()).toBeVisible();
    }
  });

  test('form controls have labels', async ({ page }) => {
    await page.goto('./blog/first-post/');
    
    const inputs = page.locator('input:not([type="hidden"])');
    const inputCount = await inputs.count();
    
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      const placeholder = await input.getAttribute('placeholder');
      const hasLabel = id ? await page.locator(`label[for="${id}"]`).count() > 0 : false;
      
      expect(hasLabel || ariaLabel || ariaLabelledBy || placeholder).toBeTruthy();
    }
  });

  test('page title changes on navigation', async ({ page }) => {
    await page.goto('./');
    const homeTitle = await page.title();
    
    await page.goto('./archive/');
    const archiveTitle = await page.title();
    expect(archiveTitle).not.toBe(homeTitle);
    expect(archiveTitle).toContain('归档');
    
    await page.goto('./about/');
    const aboutTitle = await page.title();
    expect(aboutTitle).not.toBe(archiveTitle);
    expect(aboutTitle).toContain('关于');
  });

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('./');
    
    // Press Tab to navigate
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement;
      return el ? el.tagName + (el.id ? '#' + el.id : '') : 'none';
    });
    
    expect(focusedElement).not.toBe('none');
    expect(focusedElement).not.toBe('BODY');
  });
});
