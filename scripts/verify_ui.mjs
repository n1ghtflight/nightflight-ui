// nightflight-ui visual check — headless Edge/Chrome over CDP (Node 22+, no npm deps).
// Renders a page in dark + light at desktop width and dark at a TRUE phone width (device emulation;
// plain --window-size can't go below ~500px), reports horizontal overflow, and checks Ctrl/Cmd+K.
//
//   node verify_ui.mjs <url-or-file-path> <out-dir> [--browser <exe>] [--width 1440] [--height 900]
//
// Writes desktop-dark.png, desktop-light.png, phone-dark.png (+ palette.png if Ctrl+K opens something).
// Entrance animations are disabled (prefers-reduced-motion) so content isn't captured at opacity 0.
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync, mkdtempSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 ? args.splice(i, 2)[1] : d; };
const browserArg = opt('browser'), W = +opt('width', 1440), H = +opt('height', 900);
const [target, outDir] = args;
if (!target || !outDir) { console.error('usage: node verify_ui.mjs <url-or-file> <out-dir> [--browser exe]'); process.exit(2); }
const url = /^[a-z]+:\/\//i.test(target) ? target : pathToFileURL(resolve(target)).href;
mkdirSync(outDir, { recursive: true });

const candidates = [browserArg, process.env.BROWSER,
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', 'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/microsoft-edge'].filter(Boolean);
const exe = candidates.find(p => existsSync(p));
if (!exe) { console.error('No Chromium browser found; pass --browser <path>'); process.exit(2); }

const port = 9400 + Math.floor(Math.random() * 400);
const prof = mkdtempSync(join(tmpdir(), 'nfui-verify-'));
const proc = spawn(exe, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-prefers-reduced-motion',
  `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let list;
for (let i = 0; i < 60 && !list; i++) { try { list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); } catch { await sleep(250); } }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.onopen = r);
let id = 0; const pending = new Map();
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result || {}); pending.delete(m.id); } };
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const js = async expr => (await send('Runtime.evaluate', { expression: expr, returnByValue: true })).result?.value;
const shot = async name => { const { data } = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync(join(outDir, name), Buffer.from(data, 'base64')); };
const OVERFLOW = `[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);
  return r.width&&r.right>innerWidth+1&&s.visibility!=='hidden'&&s.display!=='none'&&!e.closest('[hidden]')})
  .filter(e=>!e.parentElement||e.parentElement.getBoundingClientRect().right<=innerWidth+1)
  .map(e=>e.tagName.toLowerCase()+(e.className&&typeof e.className==='string'?'.'+e.className.trim().split(/\\s+/).join('.'):'')).slice(0,8)`;

await send('Page.enable'); await send('Runtime.enable');
async function render(name, scheme, w, h, mobile) {
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }] });
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: mobile ? 2 : 1, mobile });
  await send('Page.navigate', { url }); await sleep(1500);
  const over = await js(OVERFLOW);
  await shot(name);
  console.log(`${name.padEnd(18)} ${w}x${h} ${scheme.padEnd(5)} overflow: ${over?.length ? over.join(', ') : 'none'}`);
}
await render('desktop-dark.png', 'dark', W, H, false);
await render('desktop-light.png', 'light', W, H, false);
await render('phone-dark.png', 'dark', 390, 844, true);

// Command palette: Ctrl+K (Cmd+K on macOS) should open a dialog/palette with focus in a text input.
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'dark' }] });
await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url }); await sleep(1500);
const mod = process.platform === 'darwin' ? 4 : 2;
await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'k', code: 'KeyK', windowsVirtualKeyCode: 75, modifiers: mod });
await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'k', code: 'KeyK', windowsVirtualKeyCode: 75, modifiers: mod });
await sleep(400);
const pal = await js(`(()=>{const el=[...document.querySelectorAll('[role=dialog],[class*=palette],[id*=palette]')].find(e=>(e.checkVisibility?e.checkVisibility():e.getClientRects().length>0)&&e.getBoundingClientRect().height>40);
  const a=document.activeElement;return el?{open:true,inputFocused:/input|textarea/i.test(a?.tagName||'')}:{open:false}})()`);
if (pal?.open) await shot('palette.png');
console.log(`command palette    Ctrl/Cmd+K: ${pal?.open ? 'opens' + (pal.inputFocused ? ', input focused' : ', INPUT NOT FOCUSED') : 'not found (fine for pages without one)'}`);
console.log(`screenshots in ${resolve(outDir)}`);

ws.close(); proc.kill();
await sleep(300); try { rmSync(prof, { recursive: true, force: true }); } catch {}
