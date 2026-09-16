import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    use: { baseURL: 'http://127.0.0.1:3107' },
    projects: [
        { name: 'mobile', use: { ...devices['iPhone 13'], browserName: 'chromium' } },
        { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    ],
    webServer: {
        command: 'npm run dev -- --hostname 127.0.0.1 --port 3107',
        url: 'http://127.0.0.1:3107',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
    },
});
