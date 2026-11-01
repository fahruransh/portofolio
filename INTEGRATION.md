# React portfolio

All pages render through React 19 and TypeScript. React Router handles header/page navigation; the .html entry shells preserve direct refresh on static hosts without server rewrites.

Stack: React, TypeScript, React Router, Vite, Tailwind CSS v4, GSAP + ScrollTrigger.
Pages: src/pages. Shared header: src/Header.tsx. Shared footer: src/footer.tsx. Language provider: src/language.tsx. Animation and carousel effects clean up on route changes and StrictMode remounts.

Commands:
- npm ci
- npm run dev -- --port 5173
- npm run build
- npm run preview -- --port 5174
- npm test

Deploy dist/, not the source tree. Relative assets support repository subdirectories. The hero portrait is public/fahrur-portrait.png. The intro timeline lasts three seconds including reveal; reduced motion skips it. The adaptive marquee responds to scroll direction and speed.

## Source structure

- `src/pages/`: routed page components, including project details.
- `src/Header.tsx`, `src/footer.tsx`: shared navigation and footer wrapper.
- `components/ui/halftone-wordmark-footer.tsx`: reusable canvas footer.
- `src/styles/`: base styles, inner-page layout, Tailwind integration, accessibility/responsive overrides, and chapter/preview effects. Import order is defined in `src/main.tsx`.
- `src/page-motion.ts`: route-scoped Lenis/GSAP lifecycle; `src/motion.js`: home effects; `src/carousel.js`: certification carousel.
- `public/`: portraits and temporary project preview images. Project previews are placeholders, not screenshots.
- `assets/fonts/`: the active DM Sans font and its license.
- `tests/`: unit and browser regression tests. `npm test` builds and exercises both dev and production servers.

Project detail URLs use `project.html?slug=bnnk-inventory` and `project.html?slug=bukit-barede`, preserving refresh support on static hosts. Add new HTML entry shells to `vite.config.ts` when adding a page. Keep local progress, environment files, build output and test reports out of Git via `.gitignore`.
