const { spawn } = require('node:child_process');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const vite = path.join(root, 'node_modules/vite/bin/vite.js');
const children = [];
const run = (args, env = {}) => new Promise((resolve, reject) => {
  const child = spawn(process.execPath, args, { cwd: root, stdio: 'inherit', env: { ...process.env, ...env } });
  child.once('error', reject);
  child.once('exit', code => code === 0 ? resolve() : reject(new Error(args.join(' ') + ' exited ' + code)));
});
async function ready(url, child) {
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error('Test server exited before readiness: ' + url);
    try { if ((await fetch(url)).ok) return; } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error('Test server unavailable: ' + url);
}
(async () => {
  try {
    await run([path.join(root, 'node_modules/typescript/bin/tsc'), '--noEmit']);
    await run([vite, 'build']);
    for (const [mode, port] of [['dev', 5193], ['preview', 5194]]) {
      const child = spawn(process.execPath, [vite, ...(mode === 'preview' ? ['preview'] : []), '--host', '127.0.0.1', '--port', String(port), '--strictPort'], { cwd: root, stdio: 'inherit' });
      children.push(child);
      const base = 'http://127.0.0.1:' + port;
      await ready(base, child);
      await run(['tests/navigation-regression.cjs'], { TEST_BASE_URL: base });
    }
    await run(['tests/react-browser.cjs'], { TEST_BASE_URLS: 'http://127.0.0.1:5193,http://127.0.0.1:5194' });
  } catch (error) { console.error(error); process.exitCode = 1; }
  finally { for (const child of children) child.kill(); }
})();
