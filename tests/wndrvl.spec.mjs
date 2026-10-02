import { test, expect } from '@playwright/test';

const URL = '/wndrvl';

test('renders the page the QR opens', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(URL);
  await expect(page.locator('h1')).toHaveText('PLAY NEW GAMES.');
  await expect(page.locator('#submit-btn')).toHaveText('GET INVITED');
  const links = page.locator('.wv-links');
  await expect(links.locator('a[href="https://thirdwave.fun/dev/"]')).toHaveCount(2);
  await expect(links.locator('a[href="https://instagram.com/thirdwavearcade"]')).toHaveCount(1);
  // SURVEY_URL is null: the row is omitted, and no placeholder ships.
  await expect(links.locator('a')).toHaveCount(3);
  await expect(page.getByText('Say how it went.')).toHaveCount(0);
  await expect(page.getByText('SURVEY URL', { exact: false })).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('credits every font with its own copyright line', async ({ page }) => {
  await page.goto(URL);
  await page.locator('details summary').click();
  for (const line of [
    'Copyright 2019 The Big Shoulders Project Authors',
    'Copyright 2020 The Anton Project Authors',
    'Copyright 2025 The SUSE Project Authors',
    'Copyright © 2017 IBM Corp. with Reserved Font Name "Plex"',
    'Copyright 2020-2024 The Atkinson Hyperlegible Next Project Authors',
    'Copyright 2018 The Lexend Project Authors',
  ]) {
    await expect(page.getByText(line, { exact: false })).toHaveCount(1);
  }
});

test('no horizontal scroll on a small phone', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto(URL);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test('reduced motion shows everything at once', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(URL);
  const opacity = await page.locator('h1').evaluate((el) => getComputedStyle(el).opacity);
  expect(opacity).toBe('1');
});

test('elements build in staggered', async ({ page }) => {
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  const early = await page.locator('.wv-links a').last().evaluate((el) => +getComputedStyle(el).opacity);
  await page.waitForTimeout(1000);
  const late = await page.locator('.wv-links a').last().evaluate((el) => +getComputedStyle(el).opacity);
  expect(early).toBeLessThan(1);
  expect(late).toBe(1);
});
