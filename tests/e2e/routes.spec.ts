import { test, expect } from '@playwright/test'
const paths = [
  '/about',
  '/about/history',
  '/academics',
  '/academics/primary',
  '/faculty',
  '/faculty/ananya-rao',
  '/campus',
  '/campus/library',
  '/school-life',
  '/school-life/projects/little-ideas-big-impact',
  '/achievements',
  '/gallery',
  '/events',
  '/events/innovation-fair',
  '/notices',
  '/notices/term-two-calendar',
  '/downloads',
  '/search?q=robotics',
  '/clubs',
  '/clubs/robotics',
  '/contact',
  '/transport',
  '/careers',
  '/careers/science-educator',
  '/alumni',
  '/stories/the-question-that-stayed',
  '/help',
  '/privacy',
  '/accessibility',
  '/admissions',
  '/admissions/fees',
  '/admissions/eligibility',
  '/admissions/apply',
  '/admissions/track',
  '/visit',
  '/login',
  '/portal/student',
  '/portal/teacher',
  '/portal/admin',
  '/portal/attendance',
  '/portal/progress',
  '/portal/timetable',
  '/portal/assignments',
  '/portal/assignments/circuit',
  '/portal/messages',
  '/portal/fees',
  '/portal/receipts',
  '/portal/ptm',
  '/portal/leave',
  '/portal/library',
  '/portal/transport',
  '/portal/clubs',
  '/portal/documents',
  '/portal/complaints',
  '/portal/notifications',
  '/portal/admin/content',
  '/portal/admin/admissions',
  '/portal/admin/reports',
  '/portal/admin/settings',
  '/verify/demo-valid',
]
test('every public and portal route renders without errors or horizontal overflow', async ({
  page,
}) => {
  test.setTimeout(180000)
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  for (const path of paths) {
    await page.goto(path)
    await expect(page.locator('main')).not.toBeEmpty()
    await page.waitForFunction(() => !document.querySelector('.loading-page'))
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 2,
    )
    expect(overflow, path + ' horizontal overflow').toBe(false)
    await expect(page.locator('main')).not.toContainText('Even curiosity')
  }
  expect(errors).toEqual([])
})
test('responsive widths and unknown route recovery', async ({ page }) => {
  for (const width of [360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    for (const route of ['/', '/gallery', '/campus', '/portal/parent']) {
      await page.goto(route)
      await page.waitForFunction(() => !document.querySelector('.loading-page'))
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 2),
        route + ' at ' + width,
      ).toBe(true)
    }
  }
  await page.goto('/this-page-does-not-exist')
  await expect(page.getByRole('heading', { name: /Even curiosity/ })).toBeVisible()
  await page.getByRole('link', { name: 'Back to possibilities' }).click()
  await expect(page.getByRole('heading', { name: /Big futures/ })).toBeVisible()
})
