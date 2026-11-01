import { StrictMode, useEffect, useLayoutEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { LanguageProvider } from './language'
import Header from './Header'
import PortfolioFooter from './footer'
import Home from './pages/Home'
import About from './pages/About'
import Skills from './pages/Skills'
import Certifications from './pages/Certifications'
import Contact from './pages/Contact'
import { setupMotion } from './motion'
import { setupCarousel } from './carousel'
import '../style.css'
import '../pages.css'
import './styles/globals.css'
gsap.registerPlugin(ScrollTrigger)
function App(){
 const location=useLocation();const home=location.pathname==='/'||location.pathname==='/index.html'
 useLayoutEffect(()=>{document.body.classList.toggle('inner-page',!home);const cleanup=home?setupMotion():undefined;const carousel=setupCarousel();const context=gsap.context(()=>{if(!home&&!matchMedia('(prefers-reduced-motion: reduce)').matches)gsap.from('.page-intro h1,.profile-heading,.about-copy,.stack-list article,.contact h2,.contact-orb,.email',{y:30,opacity:0,duration:.8,stagger:.07,ease:'power3.out',clearProps:'all'})});return()=>{cleanup?.();carousel?.();context.revert()}},[location.pathname,home])
 useEffect(()=>{document.title=home?'Fahrur Anshori | Fullstack Developer':`${({'/about.html':'Tentang','/skills.html':'Kemampuan','/contact.html':'Kontak','/certifications.html':'Sertifikasi'} as Record<string,string>)[location.pathname]??'Portfolio'} — Fahrur Anshori`;const id=requestAnimationFrame(()=>{if(location.hash)document.getElementById(location.hash.slice(1))?.scrollIntoView({behavior:'instant'});else scrollTo({top:0,behavior:'instant'});ScrollTrigger.refresh()});return()=>cancelAnimationFrame(id)},[location,home])
 return <><a className="skip-link" href={home?'#experience':'#content'}>Lewati ke konten</a><Header/><main id={home?'top':'content'}><Routes><Route path="/" element={<Home/>}/><Route path="/index.html" element={<Home/>}/><Route path="/about.html" element={<About/>}/><Route path="/skills.html" element={<Skills/>}/><Route path="/contact.html" element={<Contact/>}/><Route path="/certifications.html" element={<Certifications/>}/><Route path="*" element={<p className="section">Halaman tidak ditemukan. <a href="./">Kembali ke beranda</a></p>}/></Routes></main><div id="halftone-footer"><PortfolioFooter/></div></>
}
const basename = import.meta.env.BASE_URL === './' ? location.pathname.slice(0, location.pathname.lastIndexOf('/') + 1) : import.meta.env.BASE_URL
createRoot(document.getElementById('root')!).render(<StrictMode><BrowserRouter basename={basename}><LanguageProvider><App/></LanguageProvider></BrowserRouter></StrictMode>)
