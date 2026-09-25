import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
await mkdir('artifacts', { recursive: true })
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: 'reduce',
})
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
async function settlePhotos() {
  await page.evaluate(async () => {
    for (const img of document.images) {
      img.loading = 'eager'
    }
    await Promise.all(Array.from(document.images).map((img) => img.decode().catch(() => {})))
  })
}
await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' })
await settlePhotos()
await page.screenshot({ path: 'artifacts/home-desktop-fold.png' })
await page.screenshot({ path: 'artifacts/home-desktop.png', fullPage: true })
await page.goto('http://127.0.0.1:5173/gallery', { waitUntil: 'networkidle' })
await settlePhotos()
await page.screenshot({ path: 'artifacts/gallery-desktop.png', fullPage: true })
await page.goto('http://127.0.0.1:5173/portal/parent', { waitUntil: 'networkidle' })
await page.screenshot({ path: 'artifacts/portal-desktop.png', fullPage: true })
await page.setViewportSize({ width: 390, height: 844 })
await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' })
await settlePhotos()
await page.screenshot({ path: 'artifacts/home-mobile-fold.png' })
await page.screenshot({ path: 'artifacts/home-mobile.png', fullPage: true })
await page.goto('http://127.0.0.1:5173/gallery', { waitUntil: 'networkidle' })
await settlePhotos()
await page.screenshot({ path: 'artifacts/gallery-mobile.png', fullPage: true })
await page.goto('http://127.0.0.1:5173/portal/parent', { waitUntil: 'networkidle' })
await page.screenshot({ path: 'artifacts/portal-mobile.png', fullPage: true })
await writeFile('artifacts/browser-errors.json', JSON.stringify(errors, null, 2))
console.log(JSON.stringify({ errors }))
await browser.close()
