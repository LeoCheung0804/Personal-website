const { test: base, expect } = require('playwright/test');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
const origin = 'http://127.0.0.1:8766';
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.png': 'image/png', '.glb': 'model/gltf-binary' };
const test = base.extend({
  localSite: [async ({ context, page }, use) => {
    const errors = [], missing = [], models = [];
    page.on('pageerror', error => errors.push(error.message));
    await context.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.origin !== origin) return route.fulfill({ body: '',
        contentType: route.request().resourceType() === 'stylesheet' ? 'text/css' : 'application/javascript' });
      const file = path.resolve(root, '.' + (url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname)));
      if (!file.startsWith(root + path.sep)) return route.fulfill({ status: 403, body: '' });
      if (url.pathname.endsWith('.glb')) models.push(url.pathname);
      try {
        return await route.fulfill({ body: fs.readFileSync(file), contentType: mime[path.extname(file).toLowerCase()] || 'application/octet-stream' });
      } catch {
        missing.push(url.pathname);
        return route.fulfill({ status: 404, body: '' });
      }
    });
    await use({ models });
    expect(errors, 'No uncaught interaction errors').toEqual([]);
    expect(missing, 'No missing local assets').toEqual([]);
  }, { auto: true }]
});

// Exercise the actual local Three.js models even on CI machines without a GPU.
test.use({ launchOptions: { args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] } });

async function hoverPhoto(page, photo) {
  await photo.scrollIntoViewIfNeeded();
  // Wait for scrolling to finish before resting the cursor on the photo's tap target.
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const box = await photo.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
}

test('homepage model controls work by keyboard, fit mobile, and return focus to the photo action', async ({ page, localSite }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#about');
  const card = page.locator('[data-robot-preview="cuBrick"]');
  await card.scrollIntoViewIfNeeded();
  await expect(card.locator('[data-preview-controls]')).toBeHidden();
  expect(localSite.models).toEqual([]);
  const activate = card.locator('[data-preview-activate]');
  await activate.focus();
  await activate.press('Enter');
  await expect(card).toHaveClass(/is-previewing/, { timeout: 15000 });
  const canvas = card.locator('canvas');
  await expect(canvas).toBeFocused();
  await expect(card.locator('[data-preview-controls]')).toBeVisible();
  await expect(card.locator('[data-preview-zoom-value]')).toHaveText('100%');
  await card.locator('[data-preview-turn="1"]').press('Enter');
  await expect(canvas).toHaveAttribute('aria-valuenow', '30');
  const zoomIn = card.locator('[data-preview-zoom="1"]');
  for (const level of [110, 120, 130]) {
    await zoomIn.press('Enter');
    await expect(card.locator('[data-preview-zoom-value]')).toHaveText(`${level}%`);
  }
  await expect(zoomIn).toBeDisabled();
  await expect(zoomIn).toBeFocused();
  await card.locator('[data-preview-reset]').press('Enter');
  await expect(canvas).toHaveAttribute('aria-valuenow', '0');
  await expect(card.locator('[data-preview-zoom-value]')).toHaveText('100%');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await card.locator('[data-preview-turn="1"]').focus();
  await page.keyboard.press('Escape');
  await expect(card).not.toHaveClass(/is-previewing/);
  await expect(card.locator('[data-preview-controls]')).toBeHidden();
  await expect(canvas).toHaveAttribute('inert', '');
  await expect(activate).toBeFocused();
});

test('homepage model toolbar keeps Show photo readable with enlarged text', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 1000 });
  await page.goto('/#about');
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  const card = page.locator('[data-robot-preview="cuBrick"]');
  await card.scrollIntoViewIfNeeded();
  await card.locator('[data-preview-activate]').press('Enter');
  const showPhoto = card.getByRole('button', { name: 'Show photo' });
  await expect(showPhoto).toBeVisible({ timeout: 15000 });
  const labelFits = await showPhoto.evaluate(button => {
    const stage = button.closest('.robot-preview__stage').getBoundingClientRect();
    const label = document.createRange();
    label.selectNodeContents(button);
    const text = label.getBoundingClientRect();
    return text.left >= stage.left && text.right <= stage.right;
  });
  expect(labelFits).toBe(true);
  await showPhoto.click();
  await expect(card.locator('[data-preview-viewport] img')).toHaveAttribute('aria-hidden', 'false');
});

test('a passing cursor keeps the photo and a deliberate pause reveals the model', async ({ page, localSite }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.clock.install();
  await page.goto('/#about');
  const card = page.locator('[data-robot-preview="cuBrick"]');
  const photo = card.locator('[data-preview-viewport]');
  await hoverPhoto(page, photo);
  await page.clock.fastForward(200);
  expect(localSite.models).toEqual([]);
  await page.mouse.move(0, 0);
  await page.clock.fastForward(300);
  await expect(card).not.toHaveClass(/is-previewing/);
  expect(localSite.models).toEqual([]);
  await hoverPhoto(page, photo);
  await page.clock.fastForward(550);
  await expect(card).toHaveClass(/is-previewing/, { timeout: 15000 });
  const turn = card.locator('[data-preview-turn="1"]');
  await turn.evaluate(button => {
    button.dispatchEvent(new MouseEvent('click', { detail: 1 }));
    button.dispatchEvent(new MouseEvent('click', { detail: 1 }));
  });
  await page.clock.fastForward(230);
  await expect(card.locator('canvas')).toHaveAttribute('aria-valuenow', '60');
  await page.mouse.move(0, 0);
  await expect(card).not.toHaveClass(/is-previewing/);
  await expect(card.locator('[data-preview-controls]')).toBeHidden();
});

test('leaving during a model load prevents a late response from revealing controls', async ({ page }) => {
  let release;
  await page.route('**/assets/models/cu-brick-end-effector.glb*', route => {
    release = () => route.fulfill({ body: fs.readFileSync(path.join(root, 'assets/models/cu-brick-end-effector.glb')), contentType: 'model/gltf-binary' });
  });
  await page.goto('/#about');
  const card = page.locator('[data-robot-preview="cuBrick"]');
  await hoverPhoto(page, card.locator('[data-preview-viewport]'));
  await expect.poll(() => !!release).toBe(true);
  await expect(card).toHaveAttribute('aria-busy', 'true');
  await page.mouse.move(0, 0);
  await release();
  await expect(card).toHaveAttribute('data-state', 'ready', { timeout: 15000 });
  await expect(card).not.toHaveClass(/is-previewing/);
  await expect(card.locator('[data-preview-controls]')).toBeHidden();
  await expect(card.locator('[data-preview-activate]')).toBeVisible();
});

test('failed model loads retain the photograph and a readable fallback', async ({ page }) => {
  await page.route('**/assets/models/cu-brick-end-effector.glb*', route => route.fulfill({ status: 503, body: '' }));
  await page.goto('/#about');
  const card = page.locator('[data-robot-preview="cuBrick"]');
  await card.locator('[data-preview-activate]').press('Enter');
  await expect(card).toHaveAttribute('data-state', 'fallback', { timeout: 15000 });
  await expect(card.locator('[data-preview-status]')).toBeVisible();
  await expect(card.locator('[data-preview-status]')).toBeFocused();
  await expect(card.locator('[data-preview-viewport] img')).toHaveAttribute('aria-hidden', 'false');
  await expect(card.locator('[data-preview-controls]')).toBeHidden();
  await expect(card.locator('canvas')).toHaveCount(0);
  await expect(card).not.toHaveAttribute('aria-busy');
});

test('Tapper presets announce their selected state and keyboard rotation can be reset', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/tapper.html#robot-explorer');
  const viewer = page.locator('[data-tapper-explorer]');
  await expect(viewer).toHaveClass(/is-ready/, { timeout: 15000 });
  await viewer.locator('[data-explorer-pose="1"]').press('Enter');
  await expect(viewer.locator('#assembly-progress')).toHaveValue('100');
  await expect(viewer.locator('[data-explorer-pose="1"]')).toHaveAttribute('aria-pressed', 'true');
  await viewer.locator('[data-explorer-pose="0"]').press('Enter');
  await expect(viewer.locator('#assembly-progress')).toHaveValue('0');
  await expect(viewer.locator('[data-explorer-pose="0"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(viewer.locator('[data-explorer-pose="1"]')).toHaveAttribute('aria-pressed', 'false');
  await expect(viewer.locator('[data-explorer-reset]')).toBeDisabled();
  await viewer.locator('canvas').press('ArrowRight');
  await expect(viewer.locator('[data-explorer-reset]')).toBeEnabled();
  await viewer.locator('[data-explorer-reset]').press('Enter');
  await expect(viewer.locator('canvas')).toHaveAttribute('aria-valuenow', '0');
  await expect(viewer.locator('[data-explorer-reset]')).toBeDisabled();
  await expect(viewer.locator('[data-explorer-reset]')).toBeFocused();
});

test('CU-Brick camera controls preserve a paused cycle and reset the camera state', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/yes.html#cu-brick-explorer');
  const viewer = page.locator('[data-brick-explorer]');
  await expect(viewer).toHaveClass(/is-ready/, { timeout: 15000 });
  await expect(viewer.locator('[data-brick-cycle-play]')).toHaveAttribute('aria-pressed', 'false');
  await viewer.locator('[data-brick-zoom="in"]').press('Enter');
  await expect(viewer.locator('[data-brick-zoom-output]')).toHaveText('120%');
  await viewer.locator('[data-brick-action-focus]').press('Enter');
  await expect(viewer.locator('[data-brick-action-focus]')).toHaveAttribute('aria-pressed', 'true');
  await viewer.locator('[data-brick-reset]').press('Enter');
  await expect(viewer.locator('[data-brick-zoom-output]')).toHaveText('100%');
  await expect(viewer.locator('[data-brick-action-focus]')).toHaveAttribute('aria-pressed', 'false');
  await expect(viewer.locator('[data-brick-cycle-play]')).toHaveAttribute('aria-pressed', 'false');
});

test('CU-Brick selects the clicked pole during Focus action', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.clock.install();
  await page.goto('/yes.html#cu-brick-explorer');
  const viewer = page.locator('[data-brick-explorer]');
  await expect(viewer).toHaveClass(/is-ready/, { timeout: 15000 });
  await viewer.locator('[data-brick-cycle-step="0"]').dispatchEvent('click');
  await viewer.locator('[data-brick-reset]').dispatchEvent('click');
  await viewer.locator('[data-part="pole3"]').dispatchEvent('click');
  await viewer.locator('canvas').scrollIntoViewIfNeeded();
  await page.clock.pauseAt(await page.evaluate(() => Date.now() + 1000));
  await viewer.locator('[data-brick-action-focus]').dispatchEvent('click', { detail: 1 });
  await page.clock.runFor(64);

  // Use the component marker to find the pole at the rendered camera angle.
  const crosshair = await viewer.locator('[data-brick-markers] svg path').last().boundingBox();
  expect(crosshair).not.toBeNull();
  await viewer.locator('[data-brick-picker]').selectOption('', { force: true });
  await expect(viewer).toHaveAttribute('data-selected', '');
  await page.mouse.move(crosshair.x + crosshair.width / 2, crosshair.y + crosshair.height / 2 + 8);
  await page.mouse.down();
  await page.clock.runFor(32);
  await page.mouse.up();
  await expect(viewer).toHaveAttribute('data-selected', 'pole3');
});
