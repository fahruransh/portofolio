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

The reusable halftone footer lives in components/ui; shared styles remain style.css, pages.css and src/styles/globals.css. Canvas helper tests live in tests/.
