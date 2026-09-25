import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
test('public discovery, gallery filters, lightbox keyboard and focus', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /Big futures/ })).toBeVisible()
  await page.getByRole('tab', { name: /Middle school/ }).click()
  await expect(page.getByRole('tabpanel')).toContainText('More questions. More ways to find out.')
  await page.goto('/gallery')
  await page.getByRole('button', { name: 'Sports', exact: true }).click()
  await expect(page).toHaveURL(/category=Sports/)
  await expect(page.getByRole('button', { name: /Open photo:/ })).toHaveCount(3)
  const trigger = page.getByRole('button', { name: /Open photo:/ }).first()
  await trigger.click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByRole('dialog')).toContainText('1 / 3')
  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('dialog')).toContainText('2 / 3')
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(trigger).toBeFocused()
  await page.reload()
  await expect(page.getByRole('button', { name: 'Sports', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
})
test('application validates, saves draft, previews documents and tracks reference', async ({
  page,
}) => {
  await page.goto('/admissions/apply')
  await page.getByLabel('Guardian name').fill('Demo Guardian')
  await page.getByLabel('Email', { exact: true }).fill('guardian@example.com')
  await page.getByLabel('Demo phone number').fill('0000000000')
  await page.getByRole('button', { name: 'Save draft' }).click()
  await page.reload()
  await expect(page.getByLabel('Guardian name')).toHaveValue('Demo Guardian')
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page.getByLabel('Child’s name').fill('Demo Student')
  await page.getByLabel('Date of birth', { exact: true }).fill('2019-04-12')
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('required documents')
  await page.getByLabel('Birth certificate', { exact: true }).setInputFiles({
    name: 'sample.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('%PDF-1.4 demo'),
  })
  await page.getByLabel('Previous report card', { exact: true }).setInputFiles({
    name: 'report.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('%PDF-1.4 demo'),
  })
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page.getByRole('checkbox').check()
  await page.getByRole('button', { name: 'Save demo application' }).click()
  await expect(page.getByRole('heading', { name: 'Demo application saved.' })).toBeVisible()
  await page.getByRole('link', { name: 'Follow your demo journey' }).click()
  await expect(page.getByRole('heading', { name: 'Demo Student', exact: true })).toBeVisible()
  await expect(page.getByText('Submitted · demo')).toBeVisible()
})
test('fee estimator recalculates and eligibility handles cutoff dates', async ({ page }) => {
  await page.goto('/admissions/fees')
  await expect(page.locator('.fee-summary h2')).toHaveText('₹66,000')
  await page.getByLabel('School transport').check()
  await expect(page.locator('.fee-summary h2')).toHaveText('₹84,000')
  await page.getByLabel('School meals').check()
  await expect(page.locator('.fee-summary h2')).toHaveText('₹96,000')
  await page.goto('/admissions/eligibility')
  await page.getByLabel('Child’s date of birth').fill('2021-03-31')
  await page.getByRole('button', { name: 'Check sample eligibility' }).click()
  await expect(page.getByRole('status')).toContainText('6 years')
  await expect(page.getByRole('status')).toContainText('Within the sample')
  await page.getByLabel('Child’s date of birth').fill('2021-04-01')
  await page.getByRole('button', { name: 'Check sample eligibility' }).click()
  await expect(page.getByRole('status')).toContainText('Manual review')
})
test('campus, visit review, slot capacity and cancellation', async ({ page }) => {
  await page.goto('/campus')
  await page.getByRole('button', { name: 'Explore The reading room' }).click()
  await expect(page.locator('.facility-detail')).toContainText('The reading room')
  await page.getByRole('button', { name: 'Explore the space' }).click()
  await expect(page.getByRole('dialog')).toContainText('Still-image tour fallback')
  await page.keyboard.press('Escape')
  await page.goto('/visit')
  await page.getByLabel('Preferred date').fill('2027-10-17')
  await page.getByRole('button', { name: '09:30–10:30 IST', exact: true }).click()
  await page.getByLabel('Your name').fill('Demo Visitor')
  await page.getByLabel('Email', { exact: true }).fill('visit@example.com')
  await page.getByRole('button', { name: 'Review visit' }).click()
  await expect(page.getByRole('dialog')).toContainText('2027-10-17')
  await page.getByRole('button', { name: 'Save demo visit' }).click()
  await expect(page.getByRole('heading', { name: 'Your demo visit is saved.' })).toBeVisible()
  await page.getByRole('button', { name: 'Plan another demo visit' }).click()
  await expect(page.getByRole('button', { name: /09:30–10:30 IST/ })).toBeDisabled()
  await page.getByRole('button', { name: 'Cancel demo visit' }).click()
  await expect(page.getByRole('button', { name: '09:30–10:30 IST', exact: true })).toBeEnabled()
})
test('portal child filters, data table, requests and payment state', async ({ page }) => {
  await page.goto('/portal/parent')
  await expect(page.getByText('95%', { exact: true })).toBeVisible()
  await page.getByLabel('Demo child').selectOption('tara')
  await expect(page.getByText('90%', { exact: true })).toBeVisible()
  await page.goto('/portal/progress')
  await page.getByRole('button', { name: 'View data table' }).click()
  await expect(page.getByRole('table')).toBeVisible()
  await page.goto('/portal/leave')
  await page.getByLabel('From date').fill('2026-10-01')
  await page.getByLabel('To date').fill('2026-10-02')
  await page.getByLabel('Reason', { exact: true }).fill('Fictional family commitment')
  await page.getByRole('button', { name: 'Review request' }).click()
  await page.getByRole('button', { name: 'Save demo request' }).click()
  await expect(page.getByText('Pending · demo', { exact: true })).toBeVisible()
  await page.goto('/portal/fees')
  await page.getByRole('button', { name: 'Explore checkout preview' }).click()
  await page.getByLabel('Demo scenario').selectOption('pending')
  await page.getByRole('button', { name: 'Run payment simulation' }).click()
  await expect(page.getByText('Pending verification', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Download demo receipt' })).toHaveCount(0)
  await page.getByRole('button', { name: 'Check simulated status' }).click()
  await page.getByLabel('Demo scenario').selectOption('verified')
  await page.getByRole('button', { name: 'Run payment simulation' }).click()
  await expect(page.getByRole('button', { name: 'Download demo receipt' })).toBeVisible()
})
test('assistant citations, honest unknown response and recovery states', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Ask FutureLab assistant' }).click()
  await page.getByLabel('Your question').fill('What are the fees?')
  await page.getByRole('button', { name: 'Send question' }).click()
  await expect(
    page.getByRole('dialog').getByRole('link', { name: /Demo fee schedule/ }),
  ).toBeVisible()
  await page.getByLabel('Your question').fill('Tell me who won the 2030 space prize')
  await page.getByRole('button', { name: 'Send question' }).click()
  await expect(page.getByRole('dialog')).toContainText('I do not have an approved demo answer')
  await page.keyboard.press('Escape')
  await page.goto('/portal/parent')
  await page.getByLabel('Data state').selectOption('Provider error')
  await expect(
    page.getByRole('heading', { name: 'The provider couldn’t be reached.' }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Retry demo request' }).click()
  await expect(page.getByRole('heading', { name: /A little progress/ })).toBeVisible()
})
test('public pages have no serious accessibility violations', async ({ page }) => {
  for (const route of ['/', '/gallery', '/admissions/apply', '/portal/parent']) {
    await page.goto(route)
    await page.getByRole('main').waitFor()
    await page.waitForTimeout(400)
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()
    const violations = result.violations.filter((v) =>
      ['serious', 'critical'].includes(v.impact || ''),
    )
    expect(
      violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
      })),
      route,
    ).toEqual([])
  }
})
