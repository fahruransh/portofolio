import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { setupMotion } from './motion'
import { setupCarousel } from './carousel'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

gsap.registerPlugin(ScrollTrigger)

export function setupPageMotion(home: boolean) {
  const cleanup = home ? setupMotion() : undefined
  const carousel = setupCarousel()
  const media = gsap.matchMedia()
  media.add('(prefers-reduced-motion: no-preference)', () => {
    const lenis = new Lenis({
      lerp: .1,
      smoothWheel: true,
      syncTouch: false,
      prevent: () => document.body.classList.contains('menu-open'),
    })
    const tick = (seconds: number) => lenis.raf(seconds * 1000)
    const menu = (event: Event) => {
      if ((event as CustomEvent<{ open: boolean }>).detail.open) lenis.stop()
      else lenis.start()
    }
    document.addEventListener('portfolio:menu', menu)
    if (document.body.classList.contains('menu-open')) lenis.stop()
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      document.removeEventListener('portfolio:menu', menu)
      lenis.destroy()
    }
  })
  if (!home) media.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.from('.page-intro h1,.profile-heading,.about-copy,.stack-list article,.contact h2,.contact-orb,.email', {
      y: 30, opacity: 0, duration: .8, stagger: .07, ease: 'power3.out', clearProps: 'all',
    })
  })
  ScrollTrigger.refresh()
  return () => { cleanup?.(); carousel?.(); media.revert() }
}
