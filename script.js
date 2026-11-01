'use strict';
const english = {
  'nav.about':'About', 'nav.experience':'Experience', 'nav.certifications':'Credentials', 'nav.work':'Work', 'nav.contact':'Contact', 'nav.talk':'Let’s talk ↗', 'nav.emailMe':'Email me ↗',
  'hero.role':'FULLSTACK & MOBILE DEVELOPER', 'hero.hello':'Hello, I’m Fahrur Anshori.', 'hero.title':'Good ideas.<br><em>Thoughtful</em><br>execution<span class="accent">.</span>', 'hero.desc':'I turn real needs into web and mobile experiences that are clear, functional, and easy to use.', 'hero.workCta':'Explore my work', 'hero.footer':'Considered code. Experiences that feel right.', 'hero.scroll':'SELECTED WORK',
  'section.about':'ABOUT', 'section.experience':'EXPERIENCE', 'section.capabilities':'CAPABILITIES', 'section.certifications':'CREDENTIALS', 'section.work':'SELECTED WORK', 'section.contact':'CONTACT', 'common.selected':'SELECTED',
  'about.title':'I enjoy building things that <em>work well</em> and feel easy to use.', 'about.p1':'I study Informatics at Universitas Muhammadiyah Magelang, focusing on software development. I build web and mobile applications, from user interfaces to backends, databases, and API integrations.', 'about.p2':'I am used to working independently from planning to implementation, and troubleshooting technical problems along the way.',
  'experience.bnnk':'Designed and developed a QR-based inventory dashboard, from requirements analysis and UI design to databases, frontend, backend, and system testing.', 'experience.asta':'Contributed to application interfaces with a focus on responsive, clear, usable UI, collaborating with the development team.', 'date.bnnk':'AUGUST 2025 — NOVEMBER 2025', 'date.asta':'MARCH 2021 — MAY 2021',
  'cert.headerRight':'SELECTED CREDENTIALS', 'cert.kicker':'LEARNING & CREDENTIALS', 'cert.title':'Learning for<br><em>real use.</em>', 'cert.desc':'Credentials that complement my technical experience, from software engineering and networking to understanding digital products.', 'cert.total':'Total credentials', 'cert.activeCount':'Currently active', 'cert.statusActive':'ACTIVE', 'cert.statusExpired':'EXPIRED', 'date.ccna':'JUL 2026 — JUL 2029', 'date.microsoft':'MAY 2022 — DEC 2027', 'date.google':'APR 2021 — DEC 2026', 'date.bnsp':'SEP 2021 — SEP 2024',
  'work.featured':'FEATURED PROJECT', 'work.desc':'A QR-based inventory dashboard to support asset management, identification, and record keeping at BNNK Magelang.', 'work.roleLabel':'MY ROLE', 'work.scopeLabel':'SCOPE', 'work.preview':'Interface illustration · sample data', 'contact.title':'A new opportunity<br>or a project?<br><em>Let’s talk.</em>'
};
const translated = [...document.querySelectorAll('[data-i18n], [data-i18n-html]')];
const indonesian = new Map(translated.map(el => [el, el.hasAttribute('data-i18n-html') ? el.innerHTML : el.textContent]));
const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.mobile-menu');
menu.id = 'mobile-navigation';
menuButton.setAttribute('aria-controls', menu.id);
function setMenu(open, restoreFocus = false) {
  menu.classList.toggle('open', open);
  menu.inert = !open;
  menu.setAttribute('aria-hidden', String(!open));
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', document.documentElement.lang === 'en' ? (open ? 'Close menu' : 'Open menu') : (open ? 'Tutup menu' : 'Buka menu'));
  if (restoreFocus) menuButton.focus();
}
function setLanguage(lang) {
  if (!['id', 'en'].includes(lang)) lang = 'id';
  document.documentElement.lang = lang;
  translated.forEach(el => {
    const key = el.dataset.i18n || el.dataset.i18nHtml;
    const value = lang === 'en' ? english[key] : indonesian.get(el);
    if (value === undefined) return;
    if (el.hasAttribute('data-i18n-html')) el.innerHTML = value;
    else el.textContent = value;
  });
  document.querySelectorAll('[data-lang]').forEach(button => {
    const active = button.dataset.lang === lang;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  setMenu(false);
  try { localStorage.setItem('portfolio-language', lang); } catch (_) { /* File previews may restrict storage. */ }
}
document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.lang)));
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.classList.contains('open')) setMenu(false, true); });
document.addEventListener('click', event => { if (!event.target.closest('.nav') && menu.classList.contains('open')) setMenu(false); });
window.matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) setMenu(false); });
let initialLanguage = 'id';
try { initialLanguage = localStorage.getItem('portfolio-language') || 'id'; } catch (_) { /* Use the default language. */ }
setLanguage(initialLanguage);
if ('IntersectionObserver' in window) {
  const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('reveal'); reveal.unobserve(entry.target); }
  }), { threshold: .08 });
  document.querySelectorAll('.section > *:not(.section-head), .section-head').forEach(el => reveal.observe(el));
  const sections = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    document.querySelectorAll('.desktop-nav a').forEach(link => {
      const current = link.hash === '#' + entry.target.id;
      link.classList.toggle('current', current);
      if (current) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
    });
  }), { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
  document.querySelectorAll('section[id]').forEach(el => sections.observe(el));
}
