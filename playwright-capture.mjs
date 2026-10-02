import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const screenshotsDir = './screenshots';

async function captureNorthernNews() {
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch();
  const context = await browser.createBrowserContext();
  const page = await context.newPage();

  // Set viewport for consistent sizing
  await page.setViewportSize({ width: 1920, height: 1080 });

  try {
    console.log('Navigating to BBC News...');
    await page.goto('https://www.bbc.com/news', { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(screenshotsDir, '01-bbc-home.png') });
    console.log('✓ Captured BBC News home');

    // Click on regional news section or search for Northern News
    console.log('Looking for Northern News...');
    await page.goto('https://www.bbc.com/news/england', { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(screenshotsDir, '02-england-news.png') });
    console.log('✓ Captured England news section');

    // Try to find Northern England/Northern Ireland news
    await page.goto('https://www.bbc.com/news/northern_ireland', { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(screenshotsDir, '03-northern-ireland.png') });
    console.log('✓ Captured Northern Ireland news');

    // Scroll through content
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotsDir, '04-northern-ireland-scroll.png') });
    console.log('✓ Captured scrolled content');

    // Click on a news story
    const headline = await page.locator('h2, h3').first();
    if (headline) {
      await headline.click().catch(() => {});
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(screenshotsDir, '05-news-article.png') });
      console.log('✓ Captured news article');
    }

    // Go back and show more options
    await page.goBack({ waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(screenshotsDir, '06-back-to-region.png') });
    console.log('✓ Captured back to region view');

  } catch (error) {
    console.error('Error during capture:', error);
  } finally {
    await browser.close();
    console.log(`\n✓ All screenshots saved to ${screenshotsDir}/`);
  }
}

captureNorthernNews().catch(console.error);
