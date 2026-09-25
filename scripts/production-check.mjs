import { chromium } from '@playwright/test'
import { writeFile } from 'node:fs/promises'
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
const page = await context.newPage()
const errors = []
page.on('pageerror', (error) => errors.push(error.message))
await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' })
await page.evaluate(() => navigator.serviceWorker.ready)
await page.reload({ waitUntil: 'networkidle' })
const timing = await page.evaluate(() => {
  const n = performance.getEntriesByType('navigation')[0]
  return { domContentLoadedMs: Math.round(n.domContentLoadedEventEnd), loadMs: Math.round(n.loadEventEnd), context: 'Local production preview on this machine; warm cache; not Lighthouse or field data.' }
})
await page.goto('http://127.0.0.1:4173/portal/parent', { waitUntil: 'networkidle' })
const privateCacheEntries = await page.evaluate(async () => {
  const names = await caches.keys()
  const urls = (await Promise.all(names.filter(n => n.startsWith('futurelab-public-')).map(async n => (await (await caches.open(n)).keys()).map(r => r.url)))).flat()
  return urls.filter(url => /\/(portal|api|login|auth|admissions\/apply|admissions\/track)(\/|$)/.test(new URL(url).pathname))
})
await context.setOffline(true)
await page.goto('http://127.0.0.1:4173/', { waitUntil: 'domcontentloaded' })
await page.getByRole('heading', { name: /Big futures/ }).waitFor()
const offlineShell = await page.getByText(/You’re offline/).isVisible()
await context.setOffline(false)
const report = { errors, privateCacheEntries, offlineShell, timing }
await writeFile('artifacts/production-check.json', JSON.stringify(report, null, 2))
console.log(JSON.stringify(report))
await browser.close()
if (errors.length || privateCacheEntries.length || !offlineShell) process.exitCode = 1
