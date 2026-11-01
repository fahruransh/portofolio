import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
export function setupMotion() {

  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  const heading = document.querySelector('.profile-heading');
  const track = document.querySelector('.name-track');
  const project = document.querySelector('.work-row');
  const intro = document.createElement('div');
  intro.className = 'intro';
  intro.setAttribute('aria-hidden', 'true');
  intro.style.borderRadius = '0';
  intro.innerHTML = '<span class="intro-word">Halo</span><span class="intro-note">FAHRUR ANSHORI / PORTFOLIO</span>';
  const cursor = document.createElement('div');
  cursor.className = 'project-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.textContent = 'Explore ↗';
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(intro, cursor, progress);
  let introPlayed = false;
  const splitWords = () => {
    const text = heading.textContent;
    heading.setAttribute('aria-label', text);
    heading.replaceChildren(...text.trim().split(/\s+/).flatMap((word, i) => {
      const mask = document.createElement('span');
      mask.className = 'word-mask';
      mask.setAttribute('aria-hidden', 'true');
      const inner = document.createElement('span');
      inner.className = 'word';
      inner.textContent = word;
      mask.append(inner);
      return i ? [document.createTextNode(' '), mask] : [mask];
    }));
  };
  media.add({ motion: '(prefers-reduced-motion: no-preference)', fine: '(hover: hover) and (pointer: fine)', desktop: '(min-width: 701px)' }, context => {
    const { motion, fine, desktop } = context.conditions;
    const cleanups = [];
    const listen = (el, type, fn, opts) => {
      el.addEventListener(type, fn, opts);
      cleanups.push(() => el.removeEventListener(type, fn, opts));
    };
    if (!motion) {
      intro.hidden = true;
      cursor.hidden = true;
      return;
    }
    cursor.hidden = false;
    const entry = gsap.timeline();
    const hero = document.querySelector('.hero');
    if (!introPlayed && !location.hash && scrollY < 50) {
      intro.hidden = false;
      const word = intro.querySelector('.intro-word');
      const greetings = [
        ['Halo', 'id'], ['Hello', 'en'], ['你好', 'zh'], ['مرحبًا', 'ar'],
        ['Hola', 'es'], ['Bonjour', 'fr'], ['こんにちは', 'ja'], ['Ciao', 'it'], ['Halo', 'id']
      ];
      entry.set(intro, { yPercent: 0 }).set(hero, { y: 100, scale: 1.04, transformOrigin: '50% 50%' });
      greetings.forEach(([text, lang], index) => {
        entry.call(() => {
          word.textContent = text;
          word.lang = lang;
          word.dir = lang === 'ar' ? 'rtl' : 'ltr';
        }).fromTo(word, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .12, ease: 'power3.out' })
          .to(word, { opacity: 0, y: -8, duration: .1, delay: index === 0 || index === greetings.length - 1 ? .28 : .13 });
      });
      entry.addLabel('open')
        .to('.intro-note', { opacity: 0, duration: .2 }, 'open')
        .to(intro, { borderRadius: '0 0 50% 50% / 0 0 6% 6%', duration: .45, ease: 'power3.out' }, 'open+=.18')
        .to(intro, { yPercent: -110, duration: 1.1, ease: 'power4.inOut', onComplete: () => { intro.hidden = true; } }, 'open')
        .to(hero, { y: 0, scale: 1, duration: 1.25, ease: 'power3.out', clearProps: 'transform,transformOrigin' }, 'open+=.12');
    } else intro.hidden = true;
    introPlayed = true;
    entry.from('.hero-role,.location-tag,.nav', { opacity: 0, y: 24, duration: .75, stagger: .07, ease: 'power3.out', clearProps: 'opacity,transform' }, '-=.7');
    entry.timeScale(entry.duration() / 3);
    gsap.to(progress, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });
    if (track) {
      const velocity = { value: 1 };
      let direction = 1;
      let phase = 0;
      let width = track.children[0].getBoundingClientRect().width;
      track.style.animation = 'none';
      const resize = new ResizeObserver(() => { width = track.children[0].getBoundingClientRect().width; });
      resize.observe(track.children[0]);
      const tick = (_time, delta) => {
        if (!width) return;
        phase = ((phase + velocity.value * Math.min(delta, 64) / 1000 / (desktop ? 24 : 18)) % 1 + 1) % 1;
        gsap.set(track, { x: -phase * width });
      };
      let paused = document.querySelector('.marquee-pause')?.getAttribute('aria-pressed') === 'true';
      let visible = false;
      let ticking = false;
      const syncTicker = () => {
        const active = visible && !paused && !document.hidden;
        if (active === ticking) return;
        ticking = active;
        if (active) gsap.ticker.add(tick);
        else {
          gsap.ticker.remove(tick);
          settle.pause();
          gsap.killTweensOf(velocity);
        }
      };
      const visibility = new IntersectionObserver(entries => {
        visible = entries[0]?.isIntersecting ?? false;
        syncTicker();
      });
      visibility.observe(track);
      listen(document, 'visibilitychange', syncTicker);
      listen(document, 'portfolio:marquee', event => {
        paused = Boolean(event.detail?.paused);
        syncTicker();
      });
      const settle = gsap.delayedCall(.12, () => {
        gsap.to(velocity, { value: direction, duration: .7, ease: 'power3.out', overwrite: true });
      }).pause();
      ScrollTrigger.create({ start: 0, end: 'max', onUpdate: self => {
        if (!ticking) return;
        direction = self.direction;
        gsap.to(velocity, { value: direction * (1 + Math.min(Math.abs(self.getVelocity()) / 700, 3)), duration: .2, ease: 'power3.out', overwrite: true });
        settle.restart(true);
      } });
      cleanups.push(() => {
        gsap.ticker.remove(tick);
        resize.disconnect();
        visibility.disconnect();
        settle.kill();
        gsap.killTweensOf(velocity);
        gsap.set(track, { clearProps: 'animation,transform' });
      });
    }
    if (desktop) {

      gsap.to('.hero-portrait img', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
    }
    const revealHeading = () => {
      if (!heading) return;
      splitWords();
      gsap.fromTo(heading.querySelectorAll('.word'), { yPercent: 110 }, { yPercent: 0, duration: .85, stagger: .025, ease: 'power3.out', scrollTrigger: { trigger: heading, start: 'top 88%', once: true } });
    };
    revealHeading();
    listen(document, 'portfolio:language', () => {
      // Language changes replace the spans; show the new text immediately.
      if (heading) heading.removeAttribute('aria-label');
    });
    gsap.utils.toArray('.section-head,.about-copy,.career-list article,.stack-list article,.cert-item,.work-row').forEach(el => {
      gsap.from(el, { opacity: 0, y: 36, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 94%', once: true }, clearProps: 'opacity,transform' });
    });

    const links = document.querySelector('.mobile-menu').querySelectorAll(':scope > a,.menu-caption,.menu-social');
    let menuTween;
    listen(document, 'portfolio:menu', e => {
      menuTween?.kill();
      menuTween = e.detail.open
        ? gsap.fromTo(links, { y: 45, opacity: 0 }, { y: 0, opacity: 1, stagger: .045, duration: .45, ease: 'power3.out', overwrite: true })
        : gsap.to(links, { y: 15, opacity: 0, duration: .18, overwrite: true });
    });
    cleanups.push(() => {
      menuTween?.kill();
      gsap.set(links, { clearProps: 'opacity,transform' });
    });
    if (fine) {
      document.querySelectorAll('.round-link,.contact-orb,.desktop-nav a,.brand,.email').forEach(el => {
        const x = gsap.quickTo(el, 'x', { duration: .45, ease: 'power3.out' });
        const y = gsap.quickTo(el, 'y', { duration: .45, ease: 'power3.out' });
        let bounds;
        listen(el, 'pointerenter', () => { bounds = el.getBoundingClientRect(); });
        listen(el, 'pointermove', e => { if (!bounds) return; x((e.clientX - bounds.left - bounds.width / 2) * .16); y((e.clientY - bounds.top - bounds.height / 2) * .16); });
        listen(el, 'pointerleave', () => { bounds = null; x(0); y(0); });
        cleanups.push(() => { x.tween.kill(); y.tween.kill(); gsap.set(el, { clearProps: 'transform' }); });
      });
      const cx = gsap.quickTo(cursor, 'x', { duration: .25, ease: 'power3.out' });
      const cy = gsap.quickTo(cursor, 'y', { duration: .25, ease: 'power3.out' });
      listen(project, 'pointermove', e => { cx(e.clientX); cy(e.clientY); });
      listen(project, 'pointerenter', e => { gsap.set(cursor, { x: e.clientX, y: e.clientY }); cursor.classList.add('visible'); });
      listen(project, 'pointerleave', () => cursor.classList.remove('visible'));
      listen(window, 'blur', () => cursor.classList.remove('visible'));
      cleanups.push(() => { cx.tween.kill(); cy.tween.kill(); cursor.classList.remove('visible'); });
    }
    return () => { cleanups.forEach(fn => fn()); intro.hidden = true; };
  });
  document.fonts.ready.then(() => ScrollTrigger.refresh());
  return () => { media.revert(); intro.remove(); cursor.remove(); progress.remove(); };
}
