import { Page, expect } from '@playwright/test'

async function create_demo_data(page: Page) {
  // Create demo data.

  await page.goto('/')
  await expect(page).toHaveURL('/#/home')

  await page.getByRole('button', { name: 'Yes' }).click()
  await expect(page).toHaveURL('/#/demoData')

  await page.getByRole('button', { name: 'Create' }).click()
  // await page.waitForResponse
  await page.waitForSelector('div:nth-child(13) > .q-mt-sm', {
    state: 'visible',
  })
  // Asset Allocation check shown.
  await page.locator('div:nth-child(13) > .q-mt-sm').isVisible()

  await page.goto('/#/home')
}

export { create_demo_data }
