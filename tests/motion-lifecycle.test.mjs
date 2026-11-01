import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'

class Element extends EventTarget {
  style = {}; children = []; hidden = false; attributes = {}; scrollLeft = 0
  setAttribute(name, value) { this.attributes[name] = value }
  getAttribute(name) { return this.attributes[name] }
  querySelector() { return new Element() }
  querySelectorAll() { return [] }
  append() {}
  remove() {}
  getBoundingClientRect() { return { left: 0, width: 100 } }
}
function motionHarness() {
  const document = new Element(), window = new Element(), track = new Element(), menu = new Element(), link = new Element(), button = new Element()
  track.children = [new Element()]; button.setAttribute('aria-pressed', 'false')
  menu.querySelectorAll = () => [link]
  document.querySelector = selector => ({ '.name-track': track, '.mobile-menu': menu, '.marquee-pause': button })[selector] || null
  document.createElement = () => new Element(); document.body = new Element(); document.fonts = { ready: Promise.resolve() }
  const ticks = new Set(), tweens = [], observers = []; let cleanup
  const apply = (target, props) => {
    for (const el of Array.isArray(target) ? target : [target]) {
      if (!el?.style) continue
      if (props.clearProps) props.clearProps.split(',').forEach(p => delete el.style[p])
      for (const p of ['opacity', 'transform', 'animation']) if (p in props) el.style[p] = props[p]
    }
  }
  const tween = (target, props) => { apply(target, props); const t = { target, killed: false, kill() { this.killed = true }, pause() { return this }, restart() {} }; tweens.push(t); return t }
  const timeline = new Proxy({}, { get: (_, key) => key === 'duration' ? () => 1 : () => timeline })
  const gsap = {
    registerPlugin() {}, matchMedia: () => ({ add(_, callback) { cleanup = callback({ conditions: { motion: true, fine: false, desktop: true } }) }, revert() { cleanup?.() } }),
    timeline: () => timeline, to: tween, fromTo: (target, _from, to) => tween(target, to), from() {}, set: apply,
    ticker: { add: fn => ticks.add(fn), remove: fn => ticks.delete(fn) }, delayedCall: () => tween({}, {}), killTweensOf(target) { tweens.filter(t => t.target === target).forEach(t => t.kill()) }, utils: { toArray: () => [] }
  }
  class Observer { constructor(callback) { this.callback = callback; observers.push(this) } observe() {} disconnect() { this.disconnected = true } }
  const ScrollTrigger = { create() {}, refresh() {} }
  const source = readFileSync(new URL('../src/motion.js', import.meta.url), 'utf8').replace(/^import .*$/gm, '').replace('export function', 'function')
  const context = { document, window, gsap, ScrollTrigger, location: { hash: '' }, scrollY: 100, ResizeObserver: Observer, IntersectionObserver: Observer }
  vm.runInNewContext(source + '\nthis.setup = setupMotion', context)
  return { ...context, ticks, tweens, observers, track, link, button, dispose: context.setup(), send(type, detail) { const e = new Event(type); e.detail = detail; document.dispatchEvent(e) } }
}
test('carousel uses settled swipe position when scrollend is unavailable', async () => {
  const track = new Element(), prev = new Element(), next = new Element(), position = new Element(), document = new Element()
  track.scrollWidth = 1000; track.clientWidth = 100
  const cards = [0, 100, 200].map(left => ({ getBoundingClientRect: () => ({ left: left - track.scrollLeft, width: 100 }) }))
  track.querySelectorAll = () => cards
  track.scrollTo = ({ left }) => { track.lastTarget = left }
  document.documentElement = { lang: 'en' }
  document.querySelector = s => ({ '#cert-slider': track, '.cert-prev': prev, '.cert-next': next, '.cert-position': position })[s]
  const source = readFileSync(new URL('../src/carousel.js', import.meta.url), 'utf8').replace('export function', 'function')
  const timers = new Map(); let id = 0
  const context = { document, getComputedStyle: () => ({ gap: '0' }), matchMedia: () => ({ matches: false }), ResizeObserver: class { observe() {} disconnect() {} }, setTimeout: fn => { timers.set(++id, fn); return id }, clearTimeout: id => timers.delete(id) }
  vm.runInNewContext(source + '\nthis.dispose = setupCarousel()', context)
  track.scrollLeft = 200; track.dispatchEvent(new Event('scroll'))
  for (const fn of timers.values()) fn()
  next.dispatchEvent(new Event('click'))
  assert.equal(track.lastTarget, 300)
  context.dispose()
  assert.equal(timers.size, 0)
})

test('marquee ticker sleeps offscreen, paused and hidden, and disconnects', () => {
  const h = motionHarness()
  assert.equal(h.ticks.size, 0)
  const io = h.observers.find(o => !o.disconnected && o !== h.observers[0])
  assert.ok(io, 'visibility observer exists')
  io.callback([{ isIntersecting: true }])
  assert.equal(h.ticks.size, 1)
  h.send('portfolio:marquee', { paused: true })
  assert.equal(h.ticks.size, 0)
  h.send('portfolio:marquee', { paused: false })
  assert.equal(h.ticks.size, 1)
  h.document.hidden = true; h.send('visibilitychange')
  assert.equal(h.ticks.size, 0)
  h.document.hidden = false; h.send('visibilitychange')
  assert.equal(h.ticks.size, 1)
  io.callback([{ isIntersecting: false }])
  assert.equal(h.ticks.size, 0)
  h.dispose()
  assert.ok(io.disconnected)
})

test('menu event tweens are killed and inline opacity is cleared on teardown', () => {
  const h = motionHarness()
  h.send('portfolio:menu', { open: false })
  const menuTween = h.tweens.find(t => Array.isArray(t.target) && t.target.includes(h.link))
  assert.equal(h.link.style.opacity, 0)
  h.dispose()
  assert.equal(menuTween.killed, true)
  assert.equal(h.link.style.opacity, undefined)
})
