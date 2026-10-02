// The Wonderville page's checks, against the built site served by `astro preview`.
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  testMatch: '*.spec.mjs',
  use: { baseURL: 'http://localhost:4321' },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  webServer: {
    command: 'npm run build && npm run preview -- --port 4321',
    // The homepage, not /wndrvl: Playwright waits for a 2xx, and /wndrvl 404s until Step 4.
    url: 'http://localhost:4321/',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
