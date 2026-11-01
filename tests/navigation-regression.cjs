const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:5173';
const selected = process.env.TEST_CASE;
const cases = {
  async projectPreview(page) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(base + '/');
    await page.waitForTimeout(3400);
    const rows = page.locator('.work-row');
    assert.equal(await rows.count(), 2);
    assert.match(await rows.nth(1).textContent(), /Bukit Barede Ticket Website/);
    for (let i = 0; i < 2; i++) {
      await rows.nth(i).scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      await rows.nth(i).hover();
      await page.waitForFunction(() => document.querySelector('.project-cursor').classList.contains('visible') && document.querySelector('.project-cursor img').naturalWidth > 0);
      const preview = await page.locator('.project-cursor').evaluate(e => {
        const r = e.getBoundingClientRect();
        return { width: r.width, left: r.left, right: r.right, bottom: r.bottom, src: e.dataset.preview, events: getComputedStyle(e).pointerEvents };
      });
      assert.equal(preview.width, 180);
      assert.ok(preview.left >= 0 && preview.right <= 1440 && preview.bottom <= 900);
      assert.equal(preview.src, await rows.nth(i).getAttribute('data-preview'));
      assert.equal(preview.events, 'none');
      await page.waitForTimeout(300);
      assert.equal(await page.locator('.preview-rail').evaluate(e => Math.round(new DOMMatrix(getComputedStyle(e).transform).m42)), i === 0 ? 0 : -110);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.locator('.project-cursor').evaluate(e => getComputedStyle(e).display), 'none');
  },
  async smoothScroll(page) {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(base + '/');
    await page.waitForTimeout(3400);
    await page.waitForFunction(() => document.documentElement.classList.contains('lenis'));
    await page.mouse.move(180, 400);
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(80);
    const early = await page.evaluate(() => scrollY);
    assert.ok(early > 0 && early < 590, `interpolated wheel position: ${early}`);
    await page.waitForTimeout(1100);
    assert.ok(await page.evaluate(() => scrollY) > early);
    await page.locator('.menu-toggle').click();
    const locked = await page.evaluate(() => scrollY);
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(250);
    assert.ok(Math.abs(await page.evaluate(() => scrollY) - locked) < 2);
    await page.keyboard.press('Escape');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForFunction(() => !document.documentElement.classList.contains('lenis'));
    await page.goto(base + '/contact.html');
    assert.equal(await page.locator('#contact a[href^="mailto:"]').count(), 1);
    assert.equal(await page.locator('#contact .email').count(), 0);
  },
  async chapterScroll(page) {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(base + '/');
    await page.waitForTimeout(3300);
    assert.equal(await page.locator('svg.chapter-curve').count(), 1);
    const work = page.locator('#work');
    const top = await work.evaluate(e => e.getBoundingClientRect().top + scrollY);
    await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), top - 750);
    await page.waitForTimeout(700);
    const before = await work.locator('.chapter-curve path').getAttribute('d');
    await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), top - 100);
    await page.waitForTimeout(700);
    assert.notEqual(await work.locator('.chapter-curve path').getAttribute('d'), before);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(await work.locator('.chapter-content').evaluate(e => getComputedStyle(e).transform), 'none');
    assert.equal(await page.locator('#experience .career-list article').count(), 2);
    await work.locator('summary').click();
    assert.equal(await work.locator('details').getAttribute('open'), '');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  },
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
