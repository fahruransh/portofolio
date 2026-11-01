import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import ts from 'typescript'
import { readFileSync } from 'node:fs'

const source = readFileSync(new URL('../components/ui/halftone-wordmark-footer.tsx', import.meta.url), 'utf8')
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React } }).outputText
function harness(props = {}) {
  let time = 0, id = 0, refIndex = 0, cleanup, layouts = 0, patterns = 0, paints = 0
  const frames = new Map(), observers = [], effects = []
  let positions = []
  const context2d = {
    setTransform() {}, fillRect() {}, measureText: () => ({ width: 100, actualBoundingBoxAscent: 72 }), fillText() {},
    getImageData: () => { layouts++; return { data: new Uint8ClampedArray(120 * 80 * 4).fill(255) } },
    createImageData: () => ({ data: new Uint8ClampedArray(256 * 256 * 4) }), putImageData() {},
    createPattern: () => { patterns++; return {} }, beginPath() {}, arc(x, y) { paints++; positions.push(x, y) }, fill() {}
  }
  const root = new EventTarget(), canvas = { getContext: () => context2d, getBoundingClientRect: () => ({ left: 0, top: 0 }) }
  root.getBoundingClientRect = () => ({ width: 120, height: 80 })
  const document = new EventTarget(); document.createElement = () => ({ getContext: () => context2d }); document.fonts = { ready: Promise.resolve() }
  const preference = new EventTarget(); preference.matches = false
  class Observer { constructor(cb, options) { this.cb = cb; this.options = options; observers.push(this) } observe() {} disconnect() {} }
  const refs = []
  const React = { useRef: value => { const i = refIndex++; return refs[i] ||= { current: i === 0 ? root : i === 1 ? canvas : value } }, useEffect: fn => effects.push(fn), createElement: (...args) => args }
  const context = { exports: {}, require: () => React, window: { matchMedia: () => preference, devicePixelRatio: 1 }, document, ResizeObserver: Observer, IntersectionObserver: Observer, Float32Array, performance: { now: () => time }, requestAnimationFrame: fn => { frames.set(++id, fn); return id }, cancelAnimationFrame: id => frames.delete(id) }
  vm.runInNewContext(js, context)
  const tree = context.exports.default(props); cleanup = effects[0]()
  return {
    tree, frames, observers, root, canvas, document, context,
    get layouts() { return layouts }, get patterns() { return patterns }, get paints() { return paints }, get positions() { return positions },
    visible(value = true) { observers.find(o => o.options?.rootMargin)?.cb([{ isIntersecting: value }]) },
    frame(at) { positions = []; time = at; const batch = [...frames.values()]; frames.clear(); batch.forEach(fn => fn(at)) },
    move(x, y) { const e = new Event('pointermove'); e.clientX = x; e.clientY = y; root.dispatchEvent(e) },
    updateInteraction(interactive, radius) {
      refIndex = 0; effects.length = 0
      context.exports.default({ ...props, interactive, radius })
      effects[1]?.()
    },
    dispose() { cleanup?.() }
  }
}
test('interactive prop changes wake a sleeping canvas without rebuilding its mask', () => {
  const h = harness()
  h.visible(); h.frame(0)
  assert.equal(h.frames.size, 0)
  h.updateInteraction(false, 0)
  assert.equal(h.frames.size, 1)
  h.frame(17)
  assert.equal(h.layouts, 1)
  h.dispose()
})

test('footer supports localized back-to-top and router link renderer', () => {
  const calls = []
  const h = harness({ backToTopLabel: 'Kembali ke atas ↑', columns: [{ title: 'Navigasi', links: [{ label: 'Karya', href: '/work' }] }], renderLink: link => { calls.push(link); return ['router-link', link.href] } })
  assert.equal(calls.length, 1)
  assert.equal(calls[0].href, '/work')
  assert.ok(JSON.stringify(h.tree).includes('Kembali ke atas ↑'))
  h.dispose()
})

test('physics gives the same dot positions at 60Hz and 120Hz', () => {
  const run = hz => {
    const h = harness(); h.visible(); h.frame(0); h.move(30, 30)
    for (let i = 1; i <= hz / 10; i++) h.frame(i * 1000 / hz)
    const result = h.positions; h.dispose(); return result
  }
  const slow = run(60), fast = run(120)
  assert.equal(slow.length, fast.length)
  assert.ok(slow.every((n, i) => Math.abs(n - fast[i]) < .0001))
})

test('stationary pointer settles and grain pattern is reused between frames', () => {
  const h = harness()
  h.visible(); h.frame(0); h.move(30, 30)
  for (let i = 1; i < 900; i++) h.frame(i * 1000 / 60)
  assert.equal(h.frames.size, 0, 'stationary pointer must not keep scheduling frames')
  assert.equal(h.patterns, 1)
  h.dispose()
})

test('canvas defers mask sampling until near viewport and skips unchanged resize', async () => {
  const h = harness()
  await Promise.resolve()
  assert.equal(h.layouts, 0)
  h.visible(); h.frame(0)
  assert.equal(h.layouts, 1)
  h.observers.find(o => !o.options)?.cb([]); h.frame(17)
  assert.equal(h.layouts, 1)
  h.dispose()
})
