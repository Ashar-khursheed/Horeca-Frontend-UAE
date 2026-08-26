const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: null });
  await page.setViewportSize({ width: 390, height: 900 });

  const errors = [];
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', (err) => errors.push('PAGEERROR: ' + err.message));

  await page.goto('http://localhost:3000/', { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(2000);

  await page.click('button[aria-label="Open menu"]');
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'C:/Users/arsha/AppData/Local/Temp/claude/c--Arshad-Arshad-All-Personal-Arshad-Khan-Horeca-NextJS-FRONTEND/c88d2747-ed2b-49de-8c4a-4cbe3b6721b3/scratchpad/nav-menu.png' });

  console.log('CONSOLE ERRORS:', JSON.stringify(errors, null, 2));
  await browser.close();
})();
