// The Wonderville page's checks, against the built site served by `astro preview`.
// A dedicated port and a fresh server every run, so a stale preview never answers.
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  testMatch: '*.spec.mjs',
  use: { baseURL: 'http://localhost:4329' },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  webServer: {
    command: 'npm run build && npm run preview -- --port 4329',
    url: 'http://localhost:4329/wndrvl',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
