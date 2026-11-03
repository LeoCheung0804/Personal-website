'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
let checks = 0;
function check(value, expected, message) {
  assert.deepEqual(value, expected, message);
  checks++;
}
function load(context, source) { return vm.runInContext(source, context); }
const preferences = read('assets/js/preferences.js');

async function main() {
  const { siteProjects, standalonePages } = require('../assets/js/site-data.js');
  const pages = ['index.html', ...Object.values(siteProjects).map(project => project.file),
    ...Object.values(standalonePages).map(page => page.file), ...fs.readdirSync(path.join(root, 'blog')).filter(file => file.endsWith('.html')).map(file => `blog/${file}`)];
  for (const file of pages) {
    const html = read(file), preferencesAt = html.indexOf('assets/js/preferences.js');
    const readerAt = html.indexOf(file === 'dashboard.html' ? 'const HKO_ENDPOINT' : 'assets/js/i18n.js');
    check(preferencesAt >= 0 && readerAt > preferencesAt, true, `${file} loads preferences before its readers`);
  }

  const legacy = read('blog-post.html');
  const routesJson = legacy.match(/<script[^>]*id="legacy-post-routes"[^>]*>([\s\S]*?)<\/script>/)?.[1];
  const redirectScript = legacy.match(/<script[^>]*id="legacy-post-redirect"[^>]*>([\s\S]*?)<\/script>/)?.[1];
  const posts = JSON.parse(read('assets/data/posts.json'));
  check(JSON.parse(routesJson), Object.fromEntries(posts.map(post => [post.filename, post.url])), 'Legacy routes exactly match the generated post index');
  function redirect(search, json = routesJson) {
    let destination = null;
    const nodes = { 'legacy-post-routes': { textContent: json }, 'legacy-post-title': {}, 'legacy-post-status': {}, 'legacy-post-status-zh': {} };
    load(vm.createContext({ URLSearchParams, document: { getElementById: id => nodes[id] },
      window: { location: { search, hash: '#article-section', replace: value => { destination = value; } } }
    }), redirectScript);
    return { destination, title: nodes['legacy-post-title'].textContent };
  }
  for (const post of posts) {
    check(redirect(`?post=${encodeURIComponent(post.filename)}`).destination, post.url + '#article-section', `${post.filename}: old links preserve the article and fragment`);
  }
  for (const search of ['', '?post=', '?post=missing', '?post=__proto__', '?post=constructor', '?post=..%2FREADME', '?post=https%3A%2F%2Fexample.com']) {
    check(redirect(search), { destination: null, title: 'Article not found' }, `${search || 'No parameter'}: unknown links use the recovery page`);
  }
  check(redirect('?post=OSH_2026', '{').title, 'Article not found', 'Unreadable route data retains the recovery page');
  check(redirect('?post=OSH_2026', JSON.stringify({ OSH_2026: 'https://example.com/' })).destination, null, 'Legacy redirects stay inside the generated blog directory');

  const values = new Map();
  const storage = vm.createContext({ window: { localStorage: {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value)
  } } });
  load(storage, preferences);
  load(storage, 'writePreference("language", "zhHant")');
  check(load(storage, 'readPreference("language")'), 'zhHant', 'Allowed storage persists preferences');
  Object.defineProperty(storage.window, 'localStorage', { configurable: true, get() { throw new Error('Storage denied'); } });
  check(load(storage, 'readPreference("language")'), null, 'Denied storage reads use defaults');
  check(load(storage, 'writePreference("theme", "light")'), undefined, 'Denied storage writes do not throw');
  Object.defineProperty(storage.window, 'localStorage', { value: { getItem: () => null, setItem() { throw new Error('Quota exceeded'); } } });
  check(load(storage, 'writePreference("language", "en")'), undefined, 'Write-only storage failures do not throw');

  const blog = { innerHTML: '<li>Checked-in bilingual cards</li>', appendChild(node) { this.lastCard = node; } };
  const deniedWindow = { location: { pathname: '/index.html' }, dispatchEvent() {} };
  Object.defineProperty(deniedWindow, 'localStorage', { get() { throw new Error('Storage denied'); } });
  class PacificDate extends Date {
    toLocaleDateString(locale, options) {
      return super.toLocaleDateString(locale, { timeZone: 'America/Los_Angeles', ...options });
    }
  }
  const i18n = vm.createContext({
    ...require('../assets/js/site-data.js'), window: deniedWindow, Date: PacificDate,
    document: { documentElement: {}, querySelector: () => null, querySelectorAll: () => [], getElementById: () => blog, createElement: () => ({}) },
    CustomEvent: class {}, syncFilterControls() {}
  });
  load(i18n, preferences + '\n' + read('assets/js/i18n.js'));
  load(i18n, 'setLanguage("zhHant")');
  check(load(i18n, 'currentLanguage'), 'zhHant', 'Language changes without storage');
  check(blog.innerHTML, '<li>Checked-in bilingual cards</li>', 'Language changes preserve cards before a successful post request');
  load(i18n, 'setLanguage("en")');
  check(load(i18n, 'formatPostDate("2026-06-04")'), 'Jun 04, 2026', 'Date-only posts retain their date west of UTC');
  load(i18n, 'renderBlogPosts([])');
  check(blog.innerHTML, '', 'A successfully loaded empty index can clear cards');

  const literal = `Robot "A" & <B> — O'Reilly`;
  const escaped = 'Robot &quot;A&quot; &amp; &lt;B&gt; — O&#39;Reilly';
  i18n.literalPost = { ...posts[0], title: literal, category: literal, summary: literal,
    url: './blog/osh-2026.html?label="A"&x=<B>' };
  load(i18n, 'renderBlogPosts([literalPost])');
  for (const fragment of [`alt="${escaped}"`, `blog-item-title">${escaped}</h3>`, `blog-category">${escaped}</p>`, `blog-text">${escaped}</p>`]) {
    check(blog.lastCard.innerHTML.includes(fragment), true, 'Blog metadata remains literal text in its HTML context');
  }
  check(blog.lastCard.innerHTML.includes('href="./blog/osh-2026.html?label=&quot;A&quot;&amp;x=&lt;B&gt;"'), true, 'Quotes and ampersands cannot break blog link attributes');
  i18n.literalPost = { ...i18n.literalPost, url: undefined, imageMedia: undefined, filename: 'Robot "A" & <B>', image: './image" data-injected="yes' };
  load(i18n, 'renderBlogPosts([literalPost])');
  check(blog.lastCard.innerHTML.includes('src="./image&quot; data-injected=&quot;yes"'), true, 'Unoptimized image attributes are escaped too');
  check(blog.lastCard.innerHTML.includes('href="blog-post.html?post=Robot%20%22A%22%20%26%20%3CB%3E"'), true, 'Legacy links encode the filename as one query value');

  const timers = new Map(), motion = { matches: false };
  let timerId = 0, mode = 'ok';
  const held = [];
  const doc = { activeElement: null, hidden: false, querySelectorAll: selector => groups[selector] || [], querySelector: selector => elements[selector] || null };
  function control() {
    return { dataset: {}, classList: { toggle() {} }, setAttribute(name, value) { this[name] = value; },
      focus() { doc.activeElement = this; }, querySelector() { return this.label; }, label: { dataset: {} } };
  }
  const weather = control(), bus = control(), toggle = control(), rotator = control();
  weather.dataset.rotationFace = 'weather'; bus.dataset.rotationFace = 'bus';
  rotator.contains = target => Boolean(target?.panel);
  function panel(name) {
    return { dataset: { dashboardFace: name }, contains: target => target?.panel === name,
      setAttribute(key, value) { this[key] = value; } };
  }
  const panels = [panel('weather'), panel('bus')], rows = { innerHTML: '' };
  const groups = { '[data-dashboard-face]': panels, '[data-rotation-face]': [weather, bus] };
  const elements = { '[data-rotation-toggle]': toggle, '[data-rotator]': rotator, '[data-bus-rows]': rows,
    '[data-rotation-face="weather"]': weather, '[data-rotation-face="bus"]': bus };
  function payload(url) {
    if (url.includes('etabus')) {
      return { data: [{ route: url.split('/').at(-2), dir: 'O', seq: 1, service_type: 1,
        eta: new Date(Date.now() + 12 * 60000).toISOString(), data_timestamp: new Date().toISOString() }] };
    }
    const params = new URL(url).searchParams;
    if (params.get('dataType') === 'fnd') return { weatherForecast: [{ week: params.get('lang') === 'tc' ? '星期二' : 'Tuesday' }] };
    return {};
  }
  function response(url) { return { ok: true, json: async () => payload(url) }; }
  const dashboard = vm.createContext({
    document: doc, URLSearchParams, console: { error() {} },
    window: { localStorage: { getItem: () => null }, addEventListener() {}, matchMedia: () => motion,
      clearInterval: id => timers.delete(id), setInterval: fn => { timers.set(++timerId, fn); return timerId; } },
    fetch: async url => {
      if (mode === 'fail') throw new Error('Service unavailable');
      if ((mode === 'hold-weather' && url.includes('weather.gov')) || (mode === 'hold-bus' && url.includes('etabus'))) {
        return new Promise((resolve, reject) => held.push({ url, resolve, reject }));
      }
      return response(url);
    }
  });
  const dashboardScript = [...read('dashboard.html').matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)]
    .find(match => match[1].includes('const HKO_ENDPOINT'))?.[1];
  assert.ok(dashboardScript, 'Dashboard runtime must exist');
  load(dashboard, preferences + '\n' + dashboardScript);
  load(dashboard, 'renderBusRows(state.busRows)');
  check((rows.innerHTML.match(/>Loading</g) || []).length, 3, 'Initial arrivals are loading placeholders');
  check(rows.innerHTML.includes('class="unit"'), false, 'No invented initial minute values');
  mode = 'fail';
  await load(dashboard, 'refreshDashboard()');
  check((rows.innerHTML.match(/>Unavailable</g) || []).length, 3, 'A failed first request shows unavailable arrivals');
  mode = 'ok';
  await load(dashboard, 'refreshDashboard()');
  check(load(dashboard, 'state.busRows.every(row => row.loadState === "ready" && row.minutes === 12)'), true, 'Real arrivals recover after a failed request');
  mode = 'fail';
  await load(dashboard, 'refreshDashboard()');
  check(rows.innerHTML.includes('class="unit"'), false, 'A later failure hides old minute values');

  motion.matches = true;
  load(dashboard, 'syncDashboardRotation()');
  check(timers.size, 0, 'Reduced motion disables automatic panel switching');
  check(toggle.disabled, true, 'Reduced-motion visitors retain manual panel controls only');
  motion.matches = false;
  doc.activeElement = { panel: 'bus' };
  load(dashboard, 'syncDashboardRotation()');
  check(timers.size, 0, 'Keyboard focus pauses rotation');
  doc.activeElement = null;
  load(dashboard, 'syncDashboardRotation()');
  check(timers.size, 1, 'Rotation resumes after interaction ends');
  [...timers.values()][0]();
  check(panels[0].inert, true, 'Hidden weather panel is removed from keyboard access');
  check(panels[1].inert, false, 'Visible bus panel remains interactive');
  doc.activeElement = { panel: 'bus' };
  load(dashboard, 'setDashboardFace("weather")');
  check(doc.activeElement === weather, true, 'Hiding a focused panel moves focus to its visible selector');

  mode = 'hold-weather';
  const oldWeather = load(dashboard, 'refreshDashboard()');
  load(dashboard, 'state.language = "zhHant"');
  mode = 'ok';
  await load(dashboard, 'refreshDashboard()');
  check(load(dashboard, 'state.weatherPayload.forecast.weatherForecast[0].week'), '星期二', 'The latest refresh uses the chosen language');
  held.splice(0).forEach(request => request.resolve(response(request.url)));
  await oldWeather;
  check(load(dashboard, 'state.weatherPayload.forecast.weatherForecast[0].week'), '星期二', 'A late English response cannot overwrite Chinese weather');

  mode = 'hold-bus';
  const oldBus = load(dashboard, 'refreshDashboard()');
  mode = 'ok';
  await load(dashboard, 'refreshDashboard()');
  held.splice(0).forEach(request => request.reject(new Error('Old request failed')));
  await oldBus;
  check(load(dashboard, 'state.busRows.every(row => row.loadState === "ready")'), true, 'An obsolete failure cannot hide newer arrivals');
  console.log(`Runtime checks passed: ${checks} checks for preferences, blog fallback/dates/redirects, dashboard data, rotation and response ordering.`);
}

main().catch(error => { console.error(error); process.exitCode = 1; });
