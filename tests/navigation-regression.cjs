const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:5173';
const selected = process.env.TEST_CASE;
const cases = {
  async longHistory(page) {
    await page.goto(base + '/');
    await page.locator('.hwf-root').waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => scrollTo(0, 1500));
    await page.waitForTimeout(100);
    const y = await page.evaluate(() => scrollY);
    await page.locator('.menu-toggle').click();
    await page.locator('.mobile-menu a[href="/contact.html"]').click();
    await page.waitForURL('**/contact.html');
    await page.goBack();
    await page.waitForFunction(y => Math.abs(scrollY - y) < 3, y);
  },
  async malformedHash(page) {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(base + '/#%ZZ');
    await page.locator('.hero').waitFor();
    await page.waitForTimeout(200);
    assert.deepEqual(errors, []);
  },
  async language(page) {
    await page.goto(base + '/about.html');
    await page.locator('[data-lang="en"]').click();
    await page.waitForFunction(() => document.title === 'About — Fahrur Anshori');
    assert.equal(await page.locator('.skip-link').textContent(), 'Skip to content');
    await page.locator('[data-lang="id"]').click();
    assert.equal(await page.locator('.menu-toggle').getAttribute('aria-label'), 'Buka navigasi');
  },
  async overlay(page) {
    await page.goto(base + '/');
    await page.locator('.menu-toggle').click();
    assert.equal(await page.locator('#halftone-footer').evaluate(e => e.inert), true);
    await page.keyboard.press('Shift+Tab');
    assert.equal(await page.evaluate(() => document.activeElement.closest('#mobile-navigation') !== null), true);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#halftone-footer').evaluate(e => e.inert), false);
  },
  async staticName(page) {
    await page.goto(base + '/');
    const fits = await page.locator('#hero-title').evaluate(e => {
      const r = e.getBoundingClientRect();
      return r.left >= 0 && r.right <= innerWidth;
    });
    assert.equal(fits, true, 'Reduced motion must show the complete name');
  },
  async history(page) {
    await page.goto(base + '/about.html');
    await page.locator('.profile-heading').waitFor();
    await page.evaluate(() => scrollTo(0, 400));
    await page.waitForTimeout(100);
    const y = await page.evaluate(() => scrollY);
    await page.locator('.menu-toggle').click();
    await page.locator('.mobile-menu a[href="/skills.html"]').click();
    await page.waitForURL('**/skills.html');
    await page.goBack();
    await page.waitForFunction(y => Math.abs(scrollY - y) < 3, y);
  },
  async desktopFocus(page) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(base + '/');
    const hidden = await page.locator('.menu-toggle').evaluate(e => getComputedStyle(e).visibility === 'hidden' || e.tabIndex < 0);
    assert.equal(hidden, true, 'Invisible desktop menu must not receive keyboard focus');
  },
  async footerSpa(page) {
    await page.goto(base + '/');
    await page.locator('.hwf-col a[href="about.html"],.hwf-col a[href="/about.html"]').waitFor();
    await page.evaluate(() => { window.navigationMarker = 'retained'; });
    await page.locator('.hwf-col a[href="about.html"],.hwf-col a[href="/about.html"]').click();
    await page.waitForURL('**/about.html');
    assert.equal(await page.evaluate(() => window.navigationMarker), 'retained');
    assert.equal(await page.locator('.hwf-up').textContent(), 'Kembali ke atas ↑');
  },
  async pause(page) {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(base + '/');
    await page.waitForTimeout(3300);
    assert.equal(await page.locator('.marquee-pause').count(), 0);
    assert.equal(await page.locator('.desktop-nav a[href$="#work"], .mobile-menu a[href$="#work"], .mobile-menu a[href$="#experience"], .hwf-col a[href$="#work"]').count(), 0);
    const before = await page.locator('.name-track').evaluate(e => getComputedStyle(e).transform);
    await page.waitForTimeout(200);
    assert.notEqual(await page.locator('.name-track').evaluate(e => getComputedStyle(e).transform), before);
  },
  async motionPreference(page) {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(base + '/');
    await page.waitForTimeout(3300);
    await page.locator('.menu-toggle').click();
    await page.waitForTimeout(600);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.locator('.menu-toggle').click();
    assert.equal(await page.locator('.mobile-menu>a').first().evaluate(e => getComputedStyle(e).opacity), '1');
  }
};
(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  let failures = 0;
  try {
    for (const [name, run] of Object.entries(cases)) {
      if (selected && selected !== name) continue;
      const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
      page.setDefaultTimeout(5000);
      try { await run(page); console.log('PASS', name, base); }
      catch (error) { failures++; console.error('FAIL', name, error.message); }
      finally { await page.close(); }
    }
  } finally { await browser.close(); }
  if (failures) process.exitCode = 1;
})();
