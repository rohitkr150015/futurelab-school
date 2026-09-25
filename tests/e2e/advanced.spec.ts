import { test, expect } from '@playwright/test'
test('teacher role persists through navigation and attendance edits stay scoped', async ({
  page,
}) => {
  await page.goto('/portal/teacher')
  await page
    .getByRole('navigation', { name: 'Portal navigation' })
    .getByRole('link', { name: 'Attendance', exact: true })
    .click()
  await expect(page.getByLabel('Demo role')).toHaveValue('teacher')
  await page.getByRole('button', { name: 'September 2026, session 1: Present' }).click()
  await page.getByLabel('Attendance mark').selectOption('Absent')
  await page.getByLabel('Correction reason').fill('Fictional register correction')
  await page.getByRole('button', { name: 'Save demo correction' }).click()
  await expect(
    page.getByRole('button', { name: 'September 2026, session 1: Absent' }),
  ).toBeVisible()
  await page.getByLabel('Assigned sample class').selectOption('VI B · Science')
  await expect(
    page.getByRole('button', { name: 'September 2026, session 1: Present' }),
  ).toBeVisible()
})
test('optional 3D loads on demand with a facility fallback', async ({ page }) => {
  await page.goto('/campus')
  await expect(page.locator('.three-host')).toHaveCount(0)
  await page.getByRole('button', { name: '3D model', exact: true }).click()
  await expect(page.locator('.three-host')).toBeVisible()
  await expect(page.getByText(/Illustrative 3D model/)).toBeVisible()
  await page.getByRole('button', { name: 'Facility list', exact: true }).click()
  await expect(page.locator('.facility-list')).toBeVisible()
  await page
    .locator('.facility-list')
    .getByRole('button', { name: /Maker space/ })
    .click()
  await expect(page.locator('.facility-detail h2')).toHaveText('Maker space')
})
