import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { setupMotion } from './motion'
import { setupCarousel } from './carousel'

gsap.registerPlugin(ScrollTrigger)

export function setupPageMotion(home: boolean) {
  const cleanup = home ? setupMotion() : undefined
  const carousel = setupCarousel()
  const media = gsap.matchMedia()
  if (!home) media.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.from('.page-intro h1,.profile-heading,.about-copy,.stack-list article,.contact h2,.contact-orb,.email', {
      y: 30, opacity: 0, duration: .8, stagger: .07, ease: 'power3.out', clearProps: 'all',
    })
  })
  ScrollTrigger.refresh()
  return () => { cleanup?.(); carousel?.(); media.revert() }
}
