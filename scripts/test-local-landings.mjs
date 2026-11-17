// Run after npm run build. Provide PLAYWRIGHT_MODULE if Playwright is not installed locally.
// All POSTs and Google requests are intercepted; no real submissions or conversions.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, stat, mkdir, readdir } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { localHeading, landingProjects, landingQuestions } from '../src/data/local-landing.js';

assert.equal(localHeading('Nowego Dworu Mazowieckiego'), 'Strony internetowe dla firm z Nowego Dworu Mazowieckiego i okolic');
assert.equal(landingProjects(undefined).length, 3);
assert.equal(landingQuestions(undefined).length, 6);
assert.equal(landingQuestions([null, {}, { title: 'Lokalne pytanie', answer: 'Odpowiedź' }]).length, 7);
assert.equal(new Set(landingProjects(['zdalny-asystent', 'zdalny-asystent'])).size, 3);

const root = resolve('dist');
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ttf': 'font/ttf' };
const server = createServer(async (req, res) => {
  if (req.method !== 'GET') { res.writeHead(405).end(); return; }
  try {
    const url = new URL(req.url, 'http://localhost');
    // Serve original local assets for Netlify Image CDN URLs in this offline preview.
    // Production resizing remains Netlify's responsibility.
    const assetPath = url.pathname === '/.netlify/images' ? '/' + url.searchParams.get('url').replace(/^\//, '') : decodeURIComponent(url.pathname);
    let file = resolve(root, '.' + assetPath);
    if (!file.startsWith(root + sep) && file !== root) throw new Error('Invalid path');
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    res.setHeader('Content-Type', mime[extname(file)] || 'application/octet-stream');
    res.end(await readFile(file));
  } catch { res.writeHead(404).end(); }
});
await new Promise((done) => server.listen(0, '127.0.0.1', done));
const origin = `http://127.0.0.1:${server.address().port}`;
const moduleName = process.env.PLAYWRIGHT_MODULE ? pathToFileURL(resolve(process.env.PLAYWRIGHT_MODULE)).href : 'playwright';
const { chromium } = await import(moduleName);
const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_EXECUTABLE || undefined });
const context = await browser.newContext();
let posts = [], tagLoads = 0, postStatus = 200;
await context.route('**/*', async (route) => {
  const request = route.request();
  if (request.method() === 'POST') {
    assert.ok(request.url().startsWith(origin));
    posts.push(new URLSearchParams(request.postData()));
    await new Promise((done) => setTimeout(done, 150));
    return route.fulfill({ status: postStatus, body: 'Mock Netlify response' });
  }
  if (!request.url().startsWith(origin)) {
    if (request.url().includes('googletagmanager.com/gtag/js')) tagLoads++;
    return route.fulfill({ status: 200, contentType: 'text/javascript', body: '' });
  }
  return route.continue();
});
const page = await context.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
const conversions = () => page.evaluate(() => (window.dataLayer || []).filter((item) => item[0] === 'event' && item[1] === 'conversion').map((item) => item[2]));
const go = async (slug) => { await page.goto(`${origin}/miasta/strony-internetowe-${slug}/`); await page.waitForFunction(() => !!window.gtag); };
const fill = async () => {
  await page.locator('#contact-name').fill('Test lokalny');
  await page.locator('#contact-email').fill('local@example.invalid');
  await page.locator('#contact-message').fill('Test lokalny bez wysyłki do Netlify.');
  await page.locator('#contact-check').check();
};
await mkdir('.local-verification', { recursive: true });
try {
  // Audit every generated city, not only the three browser samples.
  const cities = (await readdir(resolve(root, 'miasta'))).filter((name) => name.startsWith('strony-internetowe-'));
  for (const city of cities) {
    const html = await readFile(resolve(root, 'miasta', city, 'index.html'), 'utf8');
    assert.equal((html.match(/<h1\b/g) || []).length, 1, city);
    assert.ok(html.includes(`href="https://przemekmiros.pl/miasta/${city}/"`), city);
    assert.ok(html.includes('name="source-page"') && html.includes(`value="/miasta/${city}/"`), city);
    assert.ok(!html.includes('{town}') && !html.includes('i.pravatar.cc'), city);
    if (!city.endsWith('-pruszkow')) assert.ok(!/Pruszk[oó]/.test(html), city);
  }
  const samples = [['pruszkow', 'Pruszkowa'], ['warszawa', 'Warszawy'], ['janki', 'Janek']];
  if (cities.includes('strony-internetowe-nowy-dwor-mazowiecki')) samples.push(['nowy-dwor-mazowiecki', 'Nowego Dworu Mazowieckiego']);
  for (const [slug, town] of samples) {
    await go(slug);
    if (await page.locator('[data-cookie-modal]:not(.hidden)').count()) await page.locator('[data-cookie-deny]').click();
    assert.equal(await page.locator('h1').innerText(), localHeading(town));
    assert.equal(await page.locator('#realizacje article').count(), 3);
    assert.equal(await page.locator('#contact-check').isChecked(), false);
    assert.equal(await page.locator('input[name="city"]').inputValue(), slug);
    assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'index');
    assert.ok((await page.locator('meta[name="description"]').getAttribute('content')).length > 20);
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.locator('img[alt="Przemek Miros"]').last().evaluate((img) => img.decode());
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${slug} width ${width}`);
      await page.screenshot({ path: `.local-verification/${slug}-${width}.png` });
      await page.locator('a[href="#realizacje"]').click();
      await page.locator('#realizacje img').evaluateAll((images) => Promise.all(images.map((img) => img.decode())));
      if (slug === 'pruszkow') await page.screenshot({ path: `.local-verification/portfolio-${width}.png` });
      await page.locator('a[href="#wycena"]').first().click();
      await page.locator('#contact-name').focus();
      assert.ok(await page.locator('#contact-name').isVisible());
      if (slug === 'pruszkow') await page.screenshot({ path: `.local-verification/form-${width}.png` });
      await page.locator('button[type="submit"]').scrollIntoViewIfNeeded();
      if (slug === 'pruszkow') await page.screenshot({ path: `.local-verification/form-button-${width}.png` });
    }
    if (slug === 'janki') await page.screenshot({ path: '.local-verification/janki-full.png', fullPage: true });
  }
  await go('janki');
  assert.equal(tagLoads, 0, 'No tag without marketing consent');
  await page.locator('button[type="submit"]').click();
  assert.equal(posts.length, 0, 'Invalid form does not POST');
  await fill();
  await page.locator('#contact-check').uncheck();
  await page.locator('button[type="submit"]').click();
  assert.equal(posts.length, 0, 'Privacy checkbox is required');
  await page.locator('#contact-check').check();
  await page.locator('input[name="bot-field"]').evaluate((input) => { input.value = 'bot'; });
  await page.locator('button[type="submit"]').click();
  assert.equal(posts.length, 0, 'Honeypot blocks automated submissions');
  await page.locator('input[name="bot-field"]').evaluate((input) => { input.value = ''; });
  postStatus = 500;
  await page.locator('button[type="submit"]').click();
  await page.waitForFunction(() => document.querySelector('[data-form-status]').textContent.includes('Nie udało'));
  assert.equal((await conversions()).length, 0);
  assert.equal(await page.locator('button[type="submit"]').isEnabled(), true);
  const retryId = posts.at(-1).get('submission-id');
  postStatus = 200;
  await page.locator('[data-cookie-open]').click();
  await page.locator('[data-cookie-accept]').click();
  await page.waitForTimeout(100);
  await page.locator('button[type="submit"]').click();
  await page.locator('form').evaluate((form) => form.requestSubmit());
  await page.waitForFunction(() => document.querySelector('form').dataset.sent === 'true');
  assert.equal(posts.length, 2, 'Double submit blocked');
  assert.equal(posts.at(-1).get('submission-id'), retryId);
  assert.equal(posts.at(-1).get('source-page'), '/miasta/strony-internetowe-janki/');
  const events = await conversions();
  assert.equal(events.length, 1);
  assert.deepEqual(Object.keys(events[0]).sort(), ['send_to', 'transaction_id']);
  assert.equal(events[0].transaction_id, retryId);
  // ClientRouter navigation retains one module instance and one Google installation.
  await page.locator('a[href="/miasta/"]').click();
  await page.waitForURL('**/miasta/');
  await page.locator('a[href="/miasta/strony-internetowe-warszawa/"]').click();
  await page.waitForURL('**/miasta/strony-internetowe-warszawa/');
  assert.equal(tagLoads, 1);
  await fill();
  await page.locator('button[type="submit"]').click();
  await page.waitForFunction(() => document.querySelector('form').dataset.sent === 'true');
  assert.equal(posts.length, 3);
  assert.equal((await conversions()).length, 2);
  assert.notEqual(posts[2].get('submission-id'), retryId);
  await page.reload();
  assert.equal((await conversions()).length, 0, 'Reload cannot replay a conversion');
  await page.goto(`${origin}/wyslano-wiadomosc/?value=100&currency=PLN`);
  assert.equal((await conversions()).length, 0, 'Thank-you URL cannot trigger conversion');
  await go('pruszkow');
  await page.locator('[data-cookie-open]').click();
  await page.locator('[data-cookie-deny]').click();
  await fill();
  await page.locator('button[type="submit"]').click();
  await page.waitForFunction(() => document.querySelector('form').dataset.sent === 'true');
  assert.equal((await conversions()).length, 0, 'Denied consent still permits contact, without conversion');
  assert.deepEqual(errors, []);
  console.log(`PASS: ${cities.length} city pages; desktop/mobile; validation, errors, retries, double submit, consent, ClientRouter, reload and thank-you URL. Multiword name and optional data tested as fixtures.`);
} finally {
  await browser.close();
  server.close();
}
