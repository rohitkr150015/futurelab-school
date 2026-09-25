import { chromium } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { writeFile } from 'node:fs/promises'
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: 'reduce',
})
const page = await context.newPage()
const results = []
for (const path of [
  '/',
  '/gallery',
  '/admissions/apply',
  '/portal/parent',
  '/campus',
  '/admissions/fees',
]) {
  await page.goto('http://127.0.0.1:5173' + path, { waitUntil: 'networkidle' })
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()
  results.push({
    path,
    violations: violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
    })),
  })
}
await writeFile('artifacts/accessibility.json', JSON.stringify(results, null, 2))
console.log(JSON.stringify(results))
await browser.close()
