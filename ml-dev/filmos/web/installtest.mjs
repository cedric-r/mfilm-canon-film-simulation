// Does install.html's "Install onto the card from this page" write a camera's zip onto a card? (docs/easy-install.md)
// Does the guide go a step at a time, Next and Back? And does it give an EOS M2 and a 1300D, whose zips have no
// ML-SETUP.FIR, their own steps (#191)?
//
// In a headless browser, with the browser's own private storage (OPFS) standing in for the card the
// visitor would pick: a card fresh from the camera (DCIM only) gets every file and folder of the zip,
// byte for byte; a folder that isn't a card, or the card's DCIM folder, is refused; a card that has
// Magic Lantern on it already is warned about.
//
//   node ml-dev/filmos/web/installtest.mjs [site dir]      default: site
//
// Needs the camera zips in <site>/dl (pages.yml, dl.py) and fos/cameras.json (sitedata.py), and
// Playwright (pageserve.mjs). fflate comes from jsDelivr, as on the page.

import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { serve, browser } from './pageserve.mjs';

const ROOT = resolve(process.argv[2] || 'site');
const list = JSON.parse(await readFile(join(ROOT, 'dl', 'index.json'), 'utf8'));
const cams = JSON.parse(await readFile(join(ROOT, 'fos', 'cameras.json'), 'utf8')).cameras;
const USB = '1300D.110', M2 = 'EOSM2.103';      // no ML-SETUP.FIR in their zips, and no box for the M2
const inGuide = (p) => cams.some((c) => c.platform === p);
const platform = ['650D.104', ...Object.keys(list.zips)].find((p) => list.zips[p] && inGuide(p) && p !== USB && p !== M2);
if (!platform) { console.log('installtest: no camera both in dl/index.json and fos/cameras.json'); process.exit(1); }
for (const p of [USB, M2]) if (!inGuide(p)) { console.log(`installtest: fos/cameras.json has no ${p}, which js/install.js has steps for`); process.exit(1); }

// the folder the visitor "picks": <OPFS>/<name>, made with what's listed (a name ending in / is a folder)
const STAND_IN = () => {
  window.showDirectoryPicker = async () => {
    const top = await navigator.storage.getDirectory();
    const { name, has } = window.__pick;
    const d = await top.getDirectoryHandle(name, { create: true });
    for (const p of has) {
      let h = d;
      const parts = p.split('/').filter(Boolean);
      for (const [i, s] of parts.entries()) {
        if (i < parts.length - 1 || p.endsWith('/')) h = await h.getDirectoryHandle(s, { create: true });
        else await (await (await h.getFileHandle(s, { create: true })).createWritable()).close();
      }
    }
    return d;
  };
};

const server = await serve(ROOT);
const url = `http://127.0.0.1:${server.address().port}/install.html?camera=${platform}`;
const b = await browser();
const problems = [];
try {
  const page = await (await b.newContext()).newPage();
  page.on('pageerror', (e) => problems.push(`page error: ${e.message}`));
  await page.addInitScript(STAND_IN);

  // the guide as a form: step 1 alone, Next twice to step 3, Back to step 2
  await page.goto(url);
  const shown = () => page.evaluate(() => [...document.querySelectorAll('.ig-steps > li')].filter((li) => !li.hidden).map((li) => li.id).join(' '));
  const want = async (what, id) => {
    await page.waitForFunction((x) => [...document.querySelectorAll('.ig-steps > li')].filter((li) => !li.hidden).map((li) => li.id).join(' ') === x, id, { timeout: 5000 }).catch(() => {});
    const got = await shown();
    console.log(`${got === id ? 'ok  ' : 'FAIL'} ${what}: ${got}`);
    if (got !== id) problems.push(`${what}: showing "${got}", not ${id}`);
  };
  await want('the guide opens on step 1', 's1');
  await page.click('#ig-next'); await page.click('#ig-next');
  await want('Next, Next', 's3');
  await page.click('#ig-back');
  await want('Back', 's2');

  await page.goto(url + '#s5');
  await want('a link to step 5', 's5');
  await page.waitForSelector('#ig-easy:not([hidden])', { timeout: 15000 });

  // pick a folder; what the box says, and whether Install can be pressed
  async function pick(name, has) {
    await page.evaluate((p) => { window.__pick = p; }, { name, has });
    await page.click('#ig-e-pick');
    await page.waitForFunction(() => document.getElementById('ig-e-msg').textContent, null, { timeout: 5000 });
    return page.evaluate(() => ({ cls: document.getElementById('ig-e-msg').className,
                                  text: document.getElementById('ig-e-msg').textContent,
                                  go: !document.getElementById('ig-e-go').disabled }));
  }
  const expect = (what, got, cls, go) => {
    const ok = got.cls.includes(cls) && got.go === go;
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}: ${got.text}`);
    if (!ok) problems.push(`${what}: wanted ${cls} with Install ${go ? 'on' : 'off'}, got "${got.cls}" ${got.go}`);
  };

  expect('a folder on the computer', await pick('Desktop', ['notes.txt', 'Photos/']), 'bad', false);
  expect("the card's DCIM folder", await pick('DCIM', ['100CANON/', '100CANON/IMG_0001.CR2']), 'bad', false);
  expect('a card with Magic Lantern on it', await pick('OLD_CARD', ['DCIM/', 'ML/', 'autoexec.bin']), 'warn', true);
  expect('a card fresh from the camera', await pick('EOS_DIGITAL', ['DCIM/100CANON/']), 'ok', true);

  await page.click('#ig-e-go');
  await page.waitForFunction(() => /\bok\b|\bbad\b/.test(document.getElementById('ig-e-msg').className) &&
                                   document.getElementById('ig-e-go').disabled === false, null, { timeout: 120000 });
  const done = await page.evaluate(() => ({ cls: document.getElementById('ig-e-msg').className,
                                            text: document.getElementById('ig-e-msg').textContent }));
  console.log(`${done.cls.includes('ok') ? 'ok  ' : 'FAIL'} install ${list.zips[platform].name}: ${done.text}`);
  if (!done.cls.includes('ok')) problems.push(`install: ${done.text}`);

  // the card against the zip: every folder (the empty ones too) and every file, byte for byte;
  // DCIM still there; nothing from mlinstall-for-your-computer/
  const diff = await page.evaluate(async (zipName) => {
    const { unzipSync } = await import('https://cdn.jsdelivr.net/npm/fflate@0.8.2/esm/browser.js');
    const files = unzipSync(new Uint8Array(await (await fetch('dl/' + zipName)).arrayBuffer()));
    const want = new Map();
    for (const [p, data] of Object.entries(files)) {
      if (p.startsWith('mlinstall-for-your-computer/')) continue;
      const parts = p.replace(/\/$/, '').split('/');
      for (let i = 1; i < parts.length; i++) want.set(parts.slice(0, i).join('/') + '/', null);
      want.set(p, p.endsWith('/') ? null : data);
    }
    const card = await (await navigator.storage.getDirectory()).getDirectoryHandle('EOS_DIGITAL');
    const got = new Map();
    async function walk(d, at) {
      for await (const [n, h] of d.entries()) {
        if (h.kind === 'directory') { got.set(at + n + '/', null); await walk(h, at + n + '/'); }
        else got.set(at + n, new Uint8Array(await (await h.getFile()).arrayBuffer()));
      }
    }
    await walk(card, '');
    const out = [];
    for (const [p, data] of want) {
      if (!got.has(p)) out.push('missing ' + p);
      else if (data && (got.get(p).length !== data.length || got.get(p).some((x, i) => x !== data[i]))) out.push('differs ' + p);
    }
    for (const p of got.keys()) if (!want.has(p) && !p.startsWith('DCIM/')) out.push('extra ' + p);
    if (!got.has('DCIM/100CANON/')) out.push('DCIM/100CANON is gone');
    return { out, files: [...want.values()].filter(Boolean).length };
  }, list.zips[platform].name);
  console.log(`${diff.out.length ? 'FAIL' : 'ok  '} the card holds the zip's ${diff.files} files exactly${diff.out.length ? ': ' + diff.out.slice(0, 8).join(', ') : ''}`);
  problems.push(...diff.out);

  // What the guide says for each kind of camera (TESTING.md), all its steps and answers open at once: on a page of its
  // own, whose dl/index.json has a zip for the EOS M2 (the newest release may not).
  const guide = await (await b.newContext({ locale: 'en-US' })).newPage();
  guide.on('pageerror', (e) => problems.push(`page error: ${e.message}`));
  await guide.addInitScript(STAND_IN);
  await guide.route('**/dl/index.json', (r) => r.fulfill({ json: { ...list, zips: { ...list.zips, [M2]: list.zips[platform] } } }));
  await guide.goto(url + '#s4');
  await guide.waitForSelector('#ig-easy:not([hidden])', { state: 'attached', timeout: 15000 });
  async function read(camera) {
    await guide.selectOption('#ig-camera', camera);
    return guide.evaluate(() => {
      const next = document.getElementById('ig-next').textContent;
      for (const li of document.querySelectorAll('.ig-steps > li')) li.hidden = false;
      for (const d of document.querySelectorAll('.ig-help details')) d.open = true;
      const seen = (q) => [...document.querySelectorAll(q)].filter((el) => el.getClientRects().length);
      return {
        next,
        said: Object.fromEntries(seen('main [data-i18n]').map((el) => [el.dataset.i18n, el.innerText])),
        menus: seen('#s4 .path, #s6 .path').map((el) => el.innerText.replace(/\s+/g, ' ')),
        fir: seen('.trees code').filter((el) => el.innerText.includes('ML-SETUP.FIR')).length,
        link: seen('#s6 a').map((a) => a.hash).join(' '),
      };
    });
  }
  const UPDATE = ['ig.6.d', 'ig.6.d2', 'ig.h.5.a'];      // Firmware ver. → update, to install and to remove
  // Canon's firmware, formatting, the installer; and the box, which says to format and writes over what is there
  const NOT_M2 = ['ig.1.tip', 'ig.4.t', 'ig.4.d', 'ig.4.tip', 'ig.6.t', 'ig.6.tip', 'ig.h.1.a', 'ig.h.2.a',
                  'ig.3.easy', 'ig.e.t', 'ig.e.d', 'ig.e.or'];
  // what it says and doesn't say; how many menu paths steps 4 and 6 show, and how many of step 5's lists have
  // ML-SETUP.FIR; where step 6 links to
  // every camera: wait after opening the card door before taking the card out (Magic Lantern's INSTALL.txt, #212)
  const EVERY = ['ig.4.door'];
  const KINDS = [
    { p: platform, says: [...EVERY, ...UPDATE, ...NOT_M2], never: [], menus: 2, fir: 2, link: '' },
    { p: USB, says: [...EVERY, 'ig.4.d', 'ig.6u.d', 'ig.h.5u.a'], never: UPDATE, menus: 1, fir: 0, link: '#canon-eos-1300d' },
    { p: M2, says: [...EVERY, 'ig.1m.tip', 'ig.4m.d', 'ig.4m.tip', 'ig.6m.d', 'ig.h.1m.a', 'ig.h.5m.a'], never: [...UPDATE, ...NOT_M2],
      menus: 0, fir: 0, link: '#canon-eos-m2' },
  ];
  for (const lang of ['English', 'Thai']) {
    const next = {};      // step 4's Next
    for (const { p, says, never, menus, fir, link } of KINDS) {
      const g = await read(p);
      next[p] = g.next;
      const wrong = [
        ...says.filter((k) => !g.said[k]).map((k) => `doesn't say ${k}`),
        ...never.filter((k) => g.said[k]).map((k) => `says ${k}`),
        ...Object.keys(g.said).filter((k) => /\p{Script=Thai}/u.test(g.said[k]) !== (lang === 'Thai')).map((k) => `${k} isn't in ${lang}`),
        ...(g.menus.length === menus ? [] : [`${menus} menu paths wanted in steps 4 and 6, not "${g.menus.join('", "')}"`]),
        ...(g.fir === fir ? [] : [`ML-SETUP.FIR in ${g.fir} of step 5's lists, not ${fir}`]),
        ...(g.link === link ? [] : [`step 6 links to "${g.link}", not "${link}"`]),
        ...((g.next === next[platform]) === (p !== M2) ? [] : [`step 4's Next says "${g.next}"`]),
      ];
      const what = `the guide for ${p}, in ${lang}`;
      console.log(`${wrong.length ? 'FAIL' : 'ok  '} ${what}${wrong.length ? ': ' + wrong.join(', ') : ''}`);
      problems.push(...wrong.map((w) => `${what}: ${w}`));
    }
    await guide.click('.lang');
  }
} catch (e) {
  problems.push(e.message);
} finally {
  await b.close();
  server.close();
}
if (problems.length) {
  console.log(`installtest: FAILED\n${problems.map((p) => `  ${p}`).join('\n')}`);
  process.exit(1);
}
console.log('installtest: all passed');
