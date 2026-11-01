import { existsSync, readFileSync } from 'node:fs'
import ts from 'typescript'
import vm from 'node:vm'
import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
const require = createRequire(import.meta.url)

function loadCredentials() {
  const path = new URL('../src/credentials.ts', import.meta.url)
  const source = existsSync(path) ? readFileSync(path, 'utf8') : ''
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText
  const context = { exports: {} }
  vm.runInNewContext(js, context)
  return context.exports
}

test('credential expiry keeps the supplied final month inclusive in UTC', () => {
  const { credentialStatus } = loadCredentials()
  assert.equal(typeof credentialStatus, 'function', 'a date-derived credential status helper is required')
  assert.equal(credentialStatus('2026-12', new Date('2026-12-01T00:00:00.000Z')), 'active')
  assert.equal(credentialStatus('2026-12', new Date('2026-12-31T23:59:59.999Z')), 'active')
  assert.equal(credentialStatus('2026-12', new Date('2027-01-01T00:00:00.000Z')), 'expired')
})

function renderPage(name, now) {
  const source = readFileSync(new URL(`../src/pages/${name}.tsx`, import.meta.url), 'utf8')
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText
  const context = { exports: {}, require: (id) => {
    if (id === '../language') return { useLanguage: () => ({ t: (_key, fallback) => fallback }) }
    if (id === 'react-router-dom') return { Link: ({ to, children, ...props }) => React.createElement('a', { href: to, ...props }, children) }
    if (id === '../credentials') return { ...loadCredentials(), credentialStatus: (expiry) => loadCredentials().credentialStatus(expiry, now) }
    return require(id)
  } }
  vm.runInNewContext(js, context)
  return renderToStaticMarkup(React.createElement(context.exports.default))
}

test('credential data preserves the four supplied month-precision expiry dates', () => {
  const { credentialExpiryMonths } = loadCredentials()
  assert.equal(JSON.stringify(credentialExpiryMonths), JSON.stringify({ ccna: '2029-07', microsoft: '2027-12', google: '2026-12', bnsp: '2024-09' }))
})

test('credential badges and card classes follow the evaluation date', () => {
  const html = renderPage('Certifications', new Date('2030-01-01T00:00:00Z'))
  assert.equal((html.match(/class="status expired"/g) || []).length, 4)
  assert.equal((html.match(/class="cert-item[^"]*expired-cert/g) || []).length, 4)
  assert.doesNotMatch(html, /class="status active"/)
})

test('subpages keep section h2 before any item h3', () => {
  for (const name of ['About', 'Skills', 'Certifications', 'Contact']) {
    const html = renderPage(name, new Date('2026-11-01T00:00:00Z'))
    const headings = [...html.matchAll(/<h([1-6])\b/g)].map(match => Number(match[1]))
    assert.equal(headings[0], 1, name)
    assert.equal(headings[1], 2, name)
    assert.ok(headings.every((level, index) => index === 0 || level <= headings[index - 1] + 1), name)
  }
})

test('Contact retains its primary CTA and email without a duplicate footer', () => {
  const html = renderPage('Contact')
  assert.doesNotMatch(html, /<footer/)
  assert.equal((html.match(/href="mailto:fahruransh@gmail.com"/g) || []).length, 2)
  assert.match(html, /class="contact-orb"/)
  assert.match(html, /class="email"/)
})

test('HTML shells have unique metadata and matching Open Graph fields without invented URLs', () => {
  const titles = new Set()
  const descriptions = new Set()
  for (const page of ['index', 'about', 'skills', 'certifications', 'contact']) {
    const html = readFileSync(new URL(`../${page}.html`, import.meta.url), 'utf8')
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1]
    const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1]
    assert.ok(title && description, page)
    assert.ok(!titles.has(title), `${page}: unique title`)
    assert.ok(!descriptions.has(description), `${page}: unique description`)
    titles.add(title)
    descriptions.add(description)
    assert.ok(html.includes(`<meta property="og:title" content="${title}">`), page)
    assert.ok(html.includes(`<meta property="og:description" content="${description}">`), page)
    assert.ok(html.includes('<meta property="og:type" content="website">'), page)
    assert.doesNotMatch(html, /og:(url|image)|rel="canonical"/)
  }
})

