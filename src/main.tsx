import { StrictMode, Suspense, lazy, useEffect, useLayoutEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation, useNavigationType, Link } from 'react-router-dom'
import { LanguageProvider, useLanguage } from './language'
import Header from './Header'
import Home from './pages/Home'
import About from './pages/About'
import Skills from './pages/Skills'
import Certifications from './pages/Certifications'
import Contact from './pages/Contact'
import Project from './pages/Project'
import '../style.css'
import '../pages.css'
import './styles/globals.css'
import './styles/audit-fixes.css'
import './styles/chapters.css'

const PortfolioFooter = lazy(() => import('./footer'))
const titles: Record<string, [string, string]> = {
  '/about.html': ['Tentang', 'About'],
  '/skills.html': ['Kemampuan', 'Capabilities'],
  '/certifications.html': ['Sertifikasi', 'Credentials'],
  '/contact.html': ['Kontak', 'Contact'],
  '/project.html': ['Project', 'Project'],
}

function App() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const { language } = useLanguage()
  const en = language === 'en'
  const home = location.pathname === '/' || location.pathname === '/index.html'
  const positions = useRef(new Map<string, number>())

  useLayoutEffect(() => {
    document.body.classList.toggle('inner-page', !home)
    let disposed = false
    let cleanup: (() => void) | undefined
    import('./page-motion').then(module => {
      if (!disposed) cleanup = module.setupPageMotion(home)
    })
    return () => { disposed = true; cleanup?.() }
  }, [location.pathname, home])

  useLayoutEffect(() => {
    const previous = history.scrollRestoration
    history.scrollRestoration = 'manual'
    return () => { history.scrollRestoration = previous }
  }, [])

  useLayoutEffect(() => {
    const savedPosition = positions.current.get(location.key)
    let restored = false
    const remember = () => { if (restored) positions.current.set(location.key, scrollY) }
    addEventListener('scroll', remember, { passive: true })
    const id = requestAnimationFrame(() => {
      if (navigationType === 'POP' && savedPosition !== undefined) {
        scrollTo({ top: savedPosition, behavior: 'instant' })
      } else if (location.hash) {
        let anchor = location.hash.slice(1)
        try { anchor = decodeURIComponent(anchor) } catch { /* Ignore malformed URL escapes. */ }
        document.getElementById(anchor)?.scrollIntoView({ behavior: 'instant' })
      } else scrollTo({ top: 0, behavior: 'instant' })
      restored = true
    })
    return () => {
      cancelAnimationFrame(id)
      removeEventListener('scroll', remember)
    }
  }, [location.key, location.hash, navigationType])

  useEffect(() => {
    const name = titles[location.pathname]
    document.title = home ? 'Fahrur Anshori | Fullstack Developer' : `${name?.[en ? 1 : 0] ?? 'Portfolio'} — Fahrur Anshori`
  }, [location.pathname, home, en])

  return <>
    <a className="skip-link" href={home ? '#experience' : '#content'}>{en ? 'Skip to content' : 'Lewati ke konten'}</a>
    <Header />
    <main id={home ? 'top' : 'content'}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/index.html" element={<Home />} />
        <Route path="/about.html" element={<About />} />
        <Route path="/skills.html" element={<Skills />} />
        <Route path="/contact.html" element={<Contact />} />
        <Route path="/project.html" element={<Project />} />
        <Route path="/certifications.html" element={<Certifications />} />
        <Route path="*" element={<p className="section">{en ? 'Page not found.' : 'Halaman tidak ditemukan.'} <Link to="/">{en ? 'Back home' : 'Kembali ke beranda'}</Link></p>} />
      </Routes>
    </main>
    <div id="halftone-footer"><Suspense fallback={<div className="footer-placeholder" />}><PortfolioFooter /></Suspense></div>
  </>
}

const basename = import.meta.env.BASE_URL === './' ? location.pathname.slice(0, location.pathname.lastIndexOf('/') + 1) : import.meta.env.BASE_URL
createRoot(document.getElementById('root')!).render(
  <StrictMode><BrowserRouter basename={basename}><LanguageProvider><App /></LanguageProvider></BrowserRouter></StrictMode>,
)