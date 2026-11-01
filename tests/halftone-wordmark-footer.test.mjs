import { readFileSync } from 'node:fs'
import ts from 'typescript'
import vm from 'node:vm'
import test from 'node:test'
import assert from 'node:assert/strict'
const source = readFileSync(new URL('../components/ui/halftone-wordmark-footer.tsx', import.meta.url), 'utf8').split('// #region halftone')[1].split('// #endregion')[0]
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText
const context = { exports: {} }; vm.runInNewContext(js, context)
const { hwfHex, hwfRadius, hwfStep, hwfWarmth, hwfFitSize } = context.exports
test('hex parsing and invalid input', () => { assert.equal(hwfHex('#abc').join(','), '170,187,204'); assert.equal(hwfHex('#ffffff').join(','), '255,255,255'); assert.equal(hwfHex('bad-color'), null) })
test('coverage radius clamps and preserves area', () => { assert.equal(hwfRadius(-1, 6), 0); assert.equal(hwfRadius(2, 6), hwfRadius(1, 6)); assert.equal(hwfRadius(.25, 6), hwfRadius(1, 6) / 2) })
test('spring pushes and settles at home', () => { let s = hwfStep(10, 0, 0, 0, 10, 0, 0, 0, 80); assert(s[0] > 10); for(let i=0;i<300;i++) s=hwfStep(...s,10,0,-1e5,-1e5,0); assert(Math.abs(s[0]-10)<.001); assert(Math.abs(s[2])<.001) })
test('warmth and fitted size', () => { assert.equal(hwfWarmth(0,0,0,0,28),0); assert.equal(hwfWarmth(56,0,0,0,28),1); assert.equal(hwfFitSize(200,400),200); assert.equal(hwfFitSize(0,400),0) })
