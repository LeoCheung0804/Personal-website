const { test: base, expect } = require('playwright/test');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
const origin = 'http://127.0.0.1:8766';
const now = new Date('2026-11-03T04:00:00Z');
const posts = JSON.parse(fs.readFileSync(path.join(root, 'assets/data/posts.json'), 'utf8'));
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.png': 'image/png', '.glb': 'model/gltf-binary' };

function weather(url) {
  const zh = url.searchParams.get('lang') === 'tc';
  if (url.searchParams.get('dataType') === 'rhrread') return {
    temperature: { data: [{ place: zh ? '將軍澳' : 'Tseung Kwan O', value: 26 }] },
    humidity: { data: [{ value: 70, unit: 'percent' }] }, icon: [50], updateTime: now.toISOString()
  };
  if (url.searchParams.get('dataType') === 'fnd') return { weatherForecast: [{
    forecastDate: '20261104', week: zh ? '星期三' : 'Wednesday',
    forecastWeather: zh ? '天晴。' : 'Sunny.', ForecastIcon: 50,
    forecastMintemp: { value: 22 }, forecastMaxtemp: { value: 27 },
    forecastMinrh: { value: 55 }, forecastMaxrh: { value: 80 }
  }] };
  return {};
}

const test = base.extend({
  site: [async ({ context, page }, use) => {
    const errors = [], consoleErrors = [], missing = [];
    const site = { bus: 'ok', holdEnglish: false, held: [], expectedErrors: [] };
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    await page.clock.install({ time: now });
    // Serve exact working-tree bytes without a server or any live external requests.
    await context.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.origin === origin) {
        const file = path.resolve(root, '.' + (url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname)));
        if (!file.startsWith(root + path.sep)) return route.fulfill({ status: 403, body: '' });
        try {
          return await route.fulfill({ contentType: mime[path.extname(file).toLowerCase()] || 'application/octet-stream', body: fs.readFileSync(file) });
        } catch {
          missing.push(url.pathname);
          return route.fulfill({ status: 404, body: '' });
        }
      }
      if (url.hostname === 'data.weather.gov.hk') {
        const response = { json: weather(url) };
        if (site.holdEnglish && url.searchParams.get('lang') === 'en') return void site.held.push(() => route.fulfill(response));
        return route.fulfill(response);
      }
      if (url.hostname === 'data.etabus.gov.hk') {
        if (site.bus === 'pending') return void site.held.push(() => route.fulfill({ status: 503, body: '' }));
        if (site.bus === 'fail') return route.fulfill({ status: 503, body: '' });
        return route.fulfill({ json: { data: [{ route: url.pathname.split('/').at(-2), service_type: 1,
          dir: 'O', seq: 1, eta: new Date(+now + 12 * 60000).toISOString(), data_timestamp: now.toISOString() }] } });
      }
      // Fonts, icons, analytics, embeds and form services cannot reach the network.
      if (route.request().resourceType() === 'image') return route.fulfill({ contentType: 'image/png',
        body: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64') });
      return route.fulfill({ contentType: route.request().resourceType() === 'stylesheet' ? 'text/css' : 'application/javascript', body: '' });
    });
    await use(site);
    expect(errors, 'No uncaught browser errors').toEqual([]);
    expect(missing, 'No missing local assets').toEqual([]);
    expect(consoleErrors.filter(message => !site.expectedErrors.some(pattern => pattern.test(message))), 'No unexpected console errors').toEqual([]);
  }, { auto: true }]
});

async function dashboardReady(page) {
  await expect(page.locator('[data-live-status]')).toHaveAttribute('data-status-key', /^status\.(live|partial)$/);
  await expect(page.locator('[data-refresh-btn]')).toBeEnabled();
}

test('denied storage keeps navigation, translations and themes working on desktop and mobile', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(window, 'localStorage', {
    get() { throw new DOMException('Storage disabled', 'SecurityError'); }
  }));
  await page.goto('/#about');
  await expect(page).toHaveTitle(/Cheung Man Loc/);
  await expect(page.locator('article.active')).toContainText('Robotics');
  await page.locator('[data-page-target="portfolio"]').click();
  await expect(page.locator('article.active')).toHaveAttribute('data-page', 'portfolio');
  await page.locator('[data-lang-btn]').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-Hant');
  await page.locator('[data-theme-btn]').click();
  await expect(page.locator('html')).toHaveClass(/light-theme/);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#about');
  await page.locator('[data-mobile-nav-btn]').click();
  await page.locator('[data-page-target="portfolio"]').click();
  await expect(page.locator('article.active')).toHaveAttribute('data-page', 'portfolio');
  await page.goto('/cdpr.html');
  await page.locator('[data-lang-btn]').click();
  await expect(page.locator('.project-intro-copy')).toContainText('纜索');
  await page.goto('/dashboard.html');
  await dashboardReady(page);
  await page.locator('[data-lang-btn]').click();
  await page.locator('[data-theme-btn]').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-Hant');
  await expect(page.locator('html')).toHaveClass(/light-theme/);
});

test('quota errors still allow saved preferences to load and controls to change them', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(window, 'localStorage', { value: {
    getItem: key => key === 'language' ? 'zhHant' : 'light',
    setItem() { throw new DOMException('Quota exceeded', 'QuotaExceededError'); }
  } }));
  await page.goto('/#about');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-Hant');
  await expect(page.locator('html')).toHaveClass(/light-theme/);
  await page.locator('[data-lang-btn]').click();
  await page.locator('[data-theme-btn]').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('html')).not.toHaveClass(/light-theme/);
});

for (const failure of ['unavailable', 'invalid']) {
  test(`blog ${failure} response retains the bilingual static cards`, async ({ page, site }) => {
    site.expectedErrors.push(/Error loading blog posts:|503/);
    await page.route('**/assets/data/posts.json', route => route.fulfill(failure === 'unavailable'
      ? { status: 503, body: '' } : { json: { error: 'Not an array' } }));
    await page.goto('/#blog');
    const list = page.locator('#dynamic-blog-list');
    await expect(list).toHaveAttribute('data-load-state', 'static-fallback');
    await expect(list.locator('.blog-post-item')).toHaveCount(posts.length);
    await page.locator('[data-lang-btn]').click();
    const title = list.locator('.blog-item-title').first();
    await expect(title.locator('[data-lang="zhHant"]')).toHaveText(posts[0].titleZhHant);
    await expect(title.locator('[data-lang="zhHant"]')).toBeVisible();
    await expect(title.locator('[data-lang="en"]')).toBeHidden();
    await expect(list.locator('.blog-post-item')).toHaveCount(posts.length);
    await page.locator('[data-lang-btn]').click();
    await expect(title.locator('[data-lang="en"]')).toHaveText(posts[0].title);
    await expect(title.locator('[data-lang="en"]')).toBeVisible();
    await expect(title.locator('[data-lang="zhHant"]')).toBeHidden();
  });
}

test('pending blog request preserves cards and renders the chosen language when it arrives', async ({ page }) => {
  let release;
  await page.route('**/assets/data/posts.json', route => { release = () => route.fulfill({ json: posts }); });
  await page.goto('/#blog');
  await expect.poll(() => !!release).toBe(true);
  await page.locator('[data-lang-btn]').click();
  const cards = page.locator('#dynamic-blog-list .blog-post-item');
  await expect(cards).toHaveCount(posts.length);
  await expect(cards.first().locator('.blog-item-title [data-lang="zhHant"]')).toBeVisible();
  await release();
  await expect(cards.first().locator('.blog-item-title [data-lang]')).toHaveCount(0);
  await expect(cards.first().locator('.blog-item-title')).toHaveText(posts[0].titleZhHant);
});

test('publication dates retain their calendar day west of UTC', async ({ page }) => {
  await page.goto('/#blog');
  await expect.poll(() => page.evaluate(() => Array.isArray(loadedBlogPosts))).toBe(true);
  const dates = page.locator('#dynamic-blog-list time');
  await expect(dates).toHaveCount(posts.length);
  for (let i = 0; i < posts.length; i++) {
    await expect(dates.nth(i)).toHaveText(new Date(posts[i].date).toLocaleDateString('en-US', {
      timeZone: 'UTC', month: 'short', day: '2-digit', year: 'numeric'
    }));
  }
});

test('blog metadata stays literal in both languages and links still open', async ({ page }) => {
  const title = `Robot "A" & <B> — O'Reilly`, titleZhHant = `機械人 "A" & <B>`;
  const summary = '<img src="x" onerror="window.__injected=true">';
  const url = posts[0].url + '?label="A"&x=<B>';
  const post = { ...posts[0], title, titleZhHant, summary, summaryZhHant: summary,
    category: 'R&D <category>', categoryZhHant: '研究 <分類>', url };
  await page.route('**/assets/data/posts.json', route => route.fulfill({ json: [post] }));
  await page.goto('/#blog');
  const card = page.locator('#dynamic-blog-list .blog-post-item');
  await expect(card).toHaveCount(1);
  for (const [titleText, category] of [[title, post.category], [titleZhHant, post.categoryZhHant], [title, post.category]]) {
    await expect(card.locator('.blog-item-title')).toHaveText(titleText);
    await expect(card.locator('img')).toHaveAttribute('alt', titleText);
    await expect(card.locator('.blog-category')).toHaveText(category);
    await expect(card.locator('.blog-text')).toHaveText(summary);
    await expect(card.locator('[onerror], b, category, 分類')).toHaveCount(0);
    await expect(card.locator('a')).toHaveAttribute('href', url);
    await page.locator('[data-lang-btn]').click();
  }
  expect(await page.evaluate(() => window.__injected)).toBeUndefined();
  await card.locator('a').click();
  await expect(page).toHaveURL(new URL(url, origin).href);
  await expect(page.locator('.blog-content')).toContainText('CU-Brick');
});

test('bus arrivals show loading, unavailable, recovery and no stale times after a later failure', async ({ page, site }) => {
  site.bus = 'pending';
  site.expectedErrors.push(/Dashboard refresh failed|503/);
  await page.goto('/dashboard.html');
  await expect.poll(() => site.held.length).toBe(3);
  await page.locator('[data-rotation-face="bus"]').click();
  await expect(page.locator('.next-arrival')).toHaveText(['Loading', 'Loading', 'Loading']);
  await expect(page.locator('.next-arrival .unit')).toHaveCount(0);
  site.bus = 'fail';
  await Promise.all(site.held.splice(0).map(release => release()));
  await dashboardReady(page);
  await expect(page.locator('.next-arrival')).toHaveText(['Unavailable', 'Unavailable', 'Unavailable']);
  site.bus = 'ok';
  await page.locator('[data-refresh-btn]').click();
  await dashboardReady(page);
  await expect(page.locator('.next-arrival .minutes')).toHaveText(['12', '12', '12']);
  site.bus = 'fail';
  await page.locator('[data-refresh-btn]').click();
  await dashboardReady(page);
  await expect(page.locator('.next-arrival .unit')).toHaveCount(0);
  await expect(page.locator('.next-arrival')).toHaveText(['Unavailable', 'Unavailable', 'Unavailable']);
  await page.locator('[data-lang-btn]').click();
  await dashboardReady(page);
  await expect(page.locator('.next-arrival')).toHaveText(['未能取得', '未能取得', '未能取得']);
});

test('automatic dashboard rotation pauses during keyboard use and hidden panels are inert', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/dashboard.html');
  await dashboardReady(page);
  await page.mouse.move(0, 0);
  await page.clock.fastForward(5500);
  const bus = page.locator('[data-dashboard-face="bus"]');
  await expect(bus).toHaveAttribute('aria-hidden', 'false');
  await page.locator('[data-route-filter]').first().focus();
  await page.clock.fastForward(15000);
  await expect(bus).toHaveAttribute('aria-hidden', 'false');
  await expect(page.locator('[data-route-filter]').first()).toBeFocused();
  await page.locator('[data-rotation-face="weather"]').click();
  await expect(bus).toHaveAttribute('inert', '');
  await page.locator('[data-route-filter]').first().evaluate(input => input.focus());
  await expect(page.locator('[data-route-filter]').first()).not.toBeFocused();
  await page.clock.fastForward(10000);
  await expect(page.locator('[data-dashboard-face="weather"]')).toHaveAttribute('aria-hidden', 'false');
});

test('reduced motion disables automatic rotation and retains manual selection on mobile', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/dashboard.html');
  await dashboardReady(page);
  await expect(page.locator('[data-rotation-toggle]')).toBeDisabled();
  await page.clock.fastForward(15000);
  await expect(page.locator('[data-dashboard-face="weather"]')).toHaveAttribute('aria-hidden', 'false');
  await page.locator('[data-rotation-face="bus"]').click();
  await expect(page.locator('[data-dashboard-face="bus"]')).toHaveAttribute('aria-hidden', 'false');
  await page.clock.fastForward(15000);
  await expect(page.locator('[data-dashboard-face="bus"]')).toHaveAttribute('aria-hidden', 'false');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('late English weather cannot overwrite the selected Chinese language or latest status', async ({ page, site }) => {
  site.holdEnglish = true;
  // Count settled refreshes so the final assertion waits for the old response to be processed.
  await page.addInitScript(() => window.addEventListener('DOMContentLoaded', () => {
    const refresh = refreshDashboard;
    window.__finishedRefreshes = 0;
    refreshDashboard = async (...args) => {
      try { return await refresh(...args); }
      finally { window.__finishedRefreshes++; }
    };
  }, { once: true }));
  await page.goto('/dashboard.html');
  await expect.poll(() => site.held.length).toBe(4);
  await page.locator('[data-lang-btn]').click();
  await dashboardReady(page);
  await expect(page.locator('.forecast-week')).toHaveText('星期三');
  await Promise.all(site.held.splice(0).map(release => release()));
  await expect.poll(() => page.evaluate(() => window.__finishedRefreshes)).toBe(2);
  await expect(page.locator('.forecast-week')).toHaveText('星期三');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-Hant');
  await expect(page.locator('[data-live-status]')).toHaveAttribute('data-status-key', 'status.live');
});

test('legacy blog links redirect to every generated article and unknown links have a recovery path', async ({ page }) => {
  for (const post of posts) {
    await page.goto('/blog-post.html?post=' + encodeURIComponent(post.filename) + '#content-start');
    await expect(page).toHaveURL(new URL(post.url + '#content-start', origin).href);
    await expect(page.locator('.blog-content')).toContainText('CU-Brick');
  }
  await page.goto('/blog-post.html?post=..%2FREADME');
  await expect(page.locator('#legacy-post-title')).toHaveText('Article not found');
  await page.locator('.not-found-actions a').click();
  await expect(page.locator('article.active')).toHaveAttribute('data-page', 'blog');
});
